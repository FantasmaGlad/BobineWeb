import { NextResponse } from "next/server";
import OpenAI from "openai";
import { docChapters } from "@/content/docs/chapters";
import { getBobineReleases } from "@/lib/github-releases";

export const runtime = "nodejs";
export const maxDuration = 60;

const OPENROUTER_API_KEY_FALLBACK =
  "sk-or-v1-REDACTED";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

const SYSTEM_PROMPT_TEMPLATE = `Tu es Baamix, la mascotte et conseillère technique du projet Bobine (site : bobine.fit, code : github.com/FantasmaGlad/Bobine, conçu et développé par FantasmaGlad alias Clément Barillot, contact : clement.barillot@bobine.fit).
Tu es un petit hamster blanc agile, précis, bienveillant, direct et très professionnel.

### 1. RÈGLE D'OR : ÉCOUTE ACTIVE & DIAGNOSTIC AVANT DE RÉPONDRE HÂTIVEMENT
- Quand un utilisateur pose une question ouverte ou demande conseil sur l'équipement de sa salle (ex: "Quel matériel acheter pour ma salle ?", "Comment installer mes écrans ?", "Quelle config pour mon club ?") :
  -> Ne récite PAS un pavé de texte générique d'un seul coup.
  -> Donne une réponse courte d'orientation et POSE 1 OU 2 QUESTIONS DE QUALIFICATION pour affiner le besoin :
     * Combien de salles ou d'espaces distincts voulez-vous équiper ?
     * Souhaitez-vous diffuser le même cours sur tous les écrans (duplication) ou des cours différents par zone (indépendance) ?
     * Avez-vous déjà du matériel (écrans, sonorisation, réseau Wi-Fi) ?
- Quand l'utilisateur précise sa configuration (ex: "J'ai 3 écrans 4K 60Hz, ça suffira ?") :
  -> Réponds avec une précision technique chirurgicale à son cas exact.

### 2. ARCHITECTURE MATÉRIELLE & MULTI-ÉCRANS :
- **Nombre d'écrans par machine** :
  * Un mini PC de référence (ex: Dell Wyse 5070 avec Intel UHD 600 ou HP EliteDesk 705 avec AMD Radeon Vega) dispose de sorties DisplayPort/HDMI gérant le 4K 60Hz.
  * **Pour 3 écrans dans la même salle (même cours partout)** : Le mini PC se branche sur un splitter/répartiteur HDMI 1 vers 3. Une seule machine suffit.
  * **Pour 3 salles différentes (cours différents en parallèle)** : L'architecture recommandée est 1 mini PC dédié par salle (~40-70 € pièce), chacun autonome hors-ligne avec sa propre grille horaire et sa télécommande mobile.
- **Modèles recommandés (Intel & AMD)** :
  * **Intel** : Dell Wyse 5070 reconditionné (~40-50 €, Celeron J4105), Lenovo ThinkCentre M710q/M720q Tiny, HP ProDesk 400 G4/G5, Beelink Mini S12/EQ12 (N100/N5105).
  * **AMD** : HP EliteDesk 705 G4/G5 Mini (~60-80 €, Ryzen 3/5 Pro Radeon Vega), Lenovo ThinkCentre M715q/M725q Tiny, HP T630/T730 Thin Client.
  * 4-8 Go RAM, SSD NVMe/SATA (128 à 256 Go), consommation sobre < 10 W.
- **Coût logiciel** : 0 € (licence AGPL-3.0, sans abonnement).

### 3. MISE EN PAGE : MARKDOWN AÉRÉ & ESPACÉ (TRÈS IMPORTANT)
- Formate TOUTES tes réponses en Markdown bien espacé avec des sauts de ligne clairs.
- Privilégie les puces courtes (\`- ...\`) et les mots en gras pour la lisibilité.
- Aère les paragraphes (1 à 2 phrases par bloc, séparés par une ligne vide).
- Ne produis JAMAIS de gros bloc compact ou de mur de texte.
- INTERDICTION STRICTE DES EMOJIS : N'inclus absolument aucun emoji (zéro emoji).

### 4. CONNAISSANCES DU PROJET (générées automatiquement depuis la documentation officielle, ne jamais contredire ces faits) :
{{PROJECT_KNOWLEDGE}}

### 5. VERSION ACTUELLE (récupérée en direct depuis GitHub) :
{{VERSION_INFO}}

### 6. REDIRECTIONS DOCUMENTATION :
- Guide de démarrage : /fr/documentation
- Utilisation & écrans : /fr/documentation/utilisation
- Manifeste, Vision & Auteur : /fr/a-propos
- FAQ / Dépannage : /fr/documentation/faq
- Développeurs : /fr/documentation/developpeurs
- Dépôt APT officiel Linux (Debian / Ubuntu) : https://apt.bobine.fit (et jeu rétro Pong sur /pong)

Si une question porte sur un point absent de ta base de connaissances ci-dessus, ne l'invente pas : dis que tu n'es pas certaine et renvoie vers la page de documentation la plus pertinente plutôt que de deviner.

Réponds toujours dans la langue de l'utilisateur (français par défaut, anglais si l'utilisateur écrit en anglais).`;

/**
 * Construit la section "connaissances du projet" à partir de la même
 * source de contenu que les pages de documentation et le PDF
 * (src/content/docs/chapters.ts), pour que Baamix ne se désynchronise
 * jamais de ce qui est réellement publié sur le site.
 */
function buildProjectKnowledge(): string {
  return docChapters.fr
    .map((chapter) => {
      const subsectionLines = chapter.subsections
        .map((sub) => `  * ${sub.subtitle} : ${sub.paragraphs.join(" ")}`)
        .join("\n");
      return `- **${chapter.title}** — ${chapter.summary}\n${subsectionLines}`;
    })
    .join("\n");
}

/**
 * Récupère la dernière version publiée sur GitHub (avec mise en cache
 * 30 min côté Next.js) pour que Baamix cite toujours le bon numéro de
 * version sans qu'un humain ait à éditer ce fichier à chaque sortie.
 */
async function buildVersionInfo(): Promise<string> {
  try {
    const releases = await getBobineReleases();
    const latest = releases[0];
    if (!latest) return "Version actuelle inconnue, ne pas inventer de numéro de version.";
    const shortBody = latest.body.split("\n").slice(0, 6).join("\n");
    return `- **Dernière version publiée** : ${latest.title} (${latest.slug}), publiée le ${latest.publishedAt || "date inconnue"}.\n- **Notes de version (extrait)** :\n${shortBody}`;
  } catch {
    return "Version actuelle indisponible pour le moment, ne pas inventer de numéro de version.";
  }
}

async function buildSystemPrompt(): Promise<string> {
  const [projectKnowledge, versionInfo] = await Promise.all([
    Promise.resolve(buildProjectKnowledge()),
    buildVersionInfo(),
  ]);
  return SYSTEM_PROMPT_TEMPLATE
    .replace("{{PROJECT_KNOWLEDGE}}", projectKnowledge)
    .replace("{{VERSION_INFO}}", versionInfo);
}

export async function POST(req: Request) {
  try {
    const apiKey =
      process.env.OPENROUTER_API_KEY ||
      process.env.ORCAROUTER_API_KEY ||
      OPENROUTER_API_KEY_FALLBACK;
    const baseURL =
      process.env.OPENROUTER_BASE_URL ||
      process.env.ORCAROUTER_BASE_URL ||
      OPENROUTER_BASE_URL;

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Format de messages invalide." },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      baseURL,
      apiKey,
      defaultHeaders: {
        "HTTP-Referer": "https://bobine.fit",
        "X-Title": "Bobine",
      },
    });

    const systemPrompt = await buildSystemPrompt();

    const conversation = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: String(m.content),
      })),
    ];

    const candidateModels = [
      process.env.OPENROUTER_MODEL,
      "google/gemma-4-26b-a4b-it:free",
      "google/gemma-4-31b-it:free",
      "openrouter/free",
      "openrouter/auto",
    ].filter(Boolean) as string[];

    let stream = null;
    let lastError: unknown = null;

    for (const model of candidateModels) {
      try {
        stream = await client.chat.completions.create({
          model,
          messages: conversation,
          stream: true,
          temperature: 0.3,
          max_tokens: 2500,
        });
        if (stream) break;
      } catch (err) {
        console.warn(`Modèle ${model} indisponible, tentative avec le suivant...`, err);
        lastError = err;
      }
    }

    if (!stream) {
      throw lastError || new Error("Aucun modèle disponible pour répondre.");
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (err) {
          console.error("Erreur de streaming OpenRouter:", err);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error: unknown) {
    console.error("Erreur API Chat:", error);
    const message =
      error instanceof Error ? error.message : "Erreur interne du serveur.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
