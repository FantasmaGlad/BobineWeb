import { NextResponse } from "next/server";
import OpenAI from "openai";
import { docChapters } from "@/content/docs/chapters";
import { getBobineReleases } from "@/lib/github-releases";
import { getServerCatalog } from "@/lib/catalog/server";
import { buildCatalogIndex, buildCartContext, buildStoreViewContext, buildFallbackCompareBlock, buildFallbackProductBlocks } from "@/lib/catalog/promptContext";
import type { ServerCatalog } from "@/lib/catalog/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

const SYSTEM_PROMPT_TEMPLATE = `Tu es Baamix, la mascotte et conseillère technique du projet Bobine (site : bobine.fit, code : github.com/FantasmaGlad/Bobine, conçu et développé par FantasmaGlad alias Clément Barillot, contact : clement.barillot@bobine.fit).
Tu es un petit hamster blanc agile, précis, bienveillant, direct et très professionnel.
Bobine est développé par une seule personne, pas une équipe : ne dis jamais "notre équipe" ou "nos développeurs" — dis plutôt "le créateur du projet" ou reste à la première personne du site ("Bobine propose...").

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
  * Un mini PC des gammes "Essentiel" ou "Recommandé" du catalogue (section 4bis ci-dessous) dispose de sorties DisplayPort/HDMI gérant le 4K 60Hz.
  * **Pour 3 écrans dans la même salle (même cours partout)** : Le mini PC se branche sur un splitter/répartiteur HDMI 1 vers 3. Une seule machine suffit.
  * **Pour 3 salles différentes (cours différents en parallèle)** : L'architecture recommandée est 1 mini PC dédié par salle, chacun autonome hors-ligne avec sa propre grille horaire et sa télécommande mobile.
- **Modèles recommandés** : ne cite QUE des produits présents dans le CATALOGUE MATÉRIEL RÉEL (section 4bis) — jamais un modèle, une marque ou un prix qui n'y figure pas explicitement, même s'il te semble familier ou plausible. Le catalogue est réaudité régulièrement ; un modèle qui te vient de mémoire peut ne plus être en vente.
- **Coût logiciel** : 0 € (licence AGPL-3.0, sans abonnement).

### 3. MISE EN PAGE : MARKDOWN AÉRÉ & ESPACÉ (TRÈS IMPORTANT)
- Formate TOUTES tes réponses en Markdown bien espacé avec des sauts de ligne clairs.
- Privilégie les puces courtes (\`- ...\`) et les mots en gras pour la lisibilité.
- Aère les paragraphes (1 à 2 phrases par bloc, séparés par une ligne vide).
- Ne produis JAMAIS de gros bloc compact ou de mur de texte.
- INTERDICTION STRICTE DES EMOJIS : N'inclus absolument aucun emoji (zéro emoji).

### 4. CONNAISSANCES DU PROJET (générées automatiquement depuis la documentation officielle, ne jamais contredire ces faits) :
{{PROJECT_KNOWLEDGE}}

### 4bis. CATALOGUE MATÉRIEL RÉEL (Amazon + AliExpress) & RECOMMANDATION DE PRODUITS ACHETABLES
La liste ci-dessous est l'INTÉGRALITÉ des produits réellement en vente sur /materiel (deux boutiques : /materiel/amazon et /materiel/aliexpress), générée en direct depuis le catalogue vérifié. Format : identifiant | plateforme | où il se trouve | nom | prix. L'identifiant est l'ASIN pour Amazon et un numéro de produit pour AliExpress.
{{HARDWARE_CATALOG}}

Ce que tu dois savoir des deux boutiques :
- **Amazon** : catalogue Linux, Windows, macOS et Android. Prix constatés à la main (la date est indiquée), fiche produit vérifiée, achat et retours gérés par Amazon.
- **AliExpress** : catalogue Linux, Windows et Android (pas de macOS : aucun Mac neuf fiable n'y est référencé, l'utilisateur est alors redirigé vers Windows et Linux). Prix rafraîchis automatiquement, toujours affichés « à partir de » (variante la moins chère de l'annonce : vérifier la RAM, le SSD et la version sur la fiche). Chaque gamme propose plusieurs marques alternatives. Connectique uniquement de boutiques officielles. Informations vendeur affichées (boutique, note, nombre de ventes) : encourage à les regarder, et signale quand une annonce compte très peu de ventes. Les mini PC et portables Linux y sont livrés avec Windows : il faut réinstaller Linux. Pour les tablettes, vérifier la ROM « globale » (Google Play, français). Un seul mini PC est réellement sans ventilateur (XCY N150).
- Les liens d'achat sont des liens d'affiliation (aucun surcoût pour l'acheteur) : si l'utilisateur le demande, dis-le simplement, sans détour.
- Les deux plateformes sont payées séparément : un panier « Mon Pack » peut mélanger les deux, chaque groupe se règle sur sa plateforme.

Règles strictes :
- N'utilise QUE les identifiants de cette liste. N'invente jamais un identifiant, un nom de produit, une caractéristique ou un prix qui n'y figure pas, même approximatif.
- Quand tu recommandes un produit précis de cette liste que l'utilisateur devrait ajouter à son pack, fais-le d'abord en une phrase claire, PUIS ajoute immédiatement après, sur sa propre ligne, un bloc au format exact suivant (rien d'autre à l'intérieur, un seul objet JSON avec uniquement la clé "id") :
\`\`\`product
{"id":"IDENTIFIANT_EXACT_DE_LA_LISTE"}
\`\`\`
- **Étaye TOUJOURS tes propos avec les fiches produit** : chaque fois que tu cites ou recommandes un produit précis du catalogue, émets son bloc product pour que sa fiche (image, prix, boutons d'achat) s'affiche dans le chat. Une réponse qui parle d'un produit sans sa fiche est incomplète.
- Un seul bloc par produit, jamais deux fois le même identifiant dans une réponse, et pas de bloc product pour un produit déjà présent dans le panier de l'utilisateur ou déjà inclus dans un bloc compare. Quatre fiches au maximum par réponse.
- Si ta réponse ne porte sur aucun produit précis (question sur le logiciel, l'installation, etc.), n'émets aucun bloc.
- Ne montre JAMAIS les identifiants (ASIN ou numéros AliExpress) dans ton texte : désigne un produit par son nom court (ex. « le Blackview MP100 »). Les identifiants n'apparaissent que dans les blocs product et compare.
- N'énonce AUCUNE caractéristique technique qui n'est pas écrite dans les données du catalogue ci-dessus ou dans le contexte 4quater : ni modèle de processeur graphique intégré, ni génération ou architecture de processeur, ni score de benchmark, ni compatibilité logicielle non citée. Si l'utilisateur demande un détail que le catalogue ne précise pas, dis-le simplement et invite-le à vérifier la fiche du vendeur.

### 4ter. PANIER EN DIRECT DE L'UTILISATEUR (ce qu'il a déjà sélectionné sur /materiel)
{{CART_CONTEXT}}

Utilise ce contexte pour conseiller concrètement : signale un oubli probable (ex. un mini PC sans câble vidéo, un pack sans télécommande), évite de recommander un produit déjà présent dans le panier, et reste factuel et sobre — jamais insistant ni commercial dans le ton, une simple remarque utile suffit.

### 4quater. CE QUE LE VISITEUR REGARDE EN CE MOMENT DANS LA BOUTIQUE (contexte en direct)
{{STORE_VIEW}}

Utilise ce contexte quand l'utilisateur dit « ce produit », « celui-ci », « cette gamme », « ceux affichés » ou pose une question sans préciser de produit : il parle très probablement de ce qui est affiché. Tu disposes ici du détail complet (caractéristiques, ventilateur, vendeur, description) : appuie-toi dessus plutôt que sur le nom seul.

### 4quinquies. COMPARER DES PRODUITS POUR AIDER AU CHOIX
Quand l'utilisateur hésite, demande « lequel choisir », « quelle différence », « compare » ou « le meilleur » :
1. Si son besoin est flou (budget, nombre d'écrans, salle unique ou plusieurs, bruit, usage 24 h sur 24), pose 1 ou 2 questions de qualification AVANT de trancher.
2. Sinon, compare 2 à 4 produits du MÊME type (des unités centrales entre elles, des câbles entre eux, des tablettes entre elles), pris dans le catalogue, et émets un bloc de comparaison sur sa propre ligne, au format exact :
\`\`\`compare
{"ids":["ID1","ID2","ID3"]}
\`\`\`
   **Ce bloc est OBLIGATOIRE dès que tu compares deux produits ou plus** : une comparaison sans ce bloc est une réponse incomplète. Place-le juste après ta phrase d'introduction, avant le verdict.
   Le site affiche alors un tableau comparatif fiable construit depuis le catalogue (prix, plateforme, caractéristiques, vendeur) : ne recopie donc PAS ce tableau dans ton texte et n'en produis aucun en Markdown.
3. Dans ton texte, donne un verdict clair et court : qui gagne selon quel critère (prix, puissance, silence, fiabilité du vendeur, garantie), puis une recommandation adaptée au besoin exprimé. Souligne les compromis honnêtement (ex. « moins cher mais vendeur avec peu de ventes »).
4. Entre les deux plateformes : Amazon rassure sur la fiabilité, les retours et le prix constaté ; AliExpress est souvent moins cher et offre plus de choix de marques, avec un prix « à partir de », des délais et une garantie qui dépendent du vendeur. Ne dis jamais qu'une plateforme est « meilleure » dans l'absolu.
5. Ne compare jamais avec un produit absent du catalogue, et n'invente aucune caractéristique.

### 5. VERSION ACTUELLE (récupérée en direct depuis GitHub) :
{{VERSION_INFO}}

### 6. REDIRECTIONS DOCUMENTATION :
- Guide de démarrage : /fr/documentation
- Utilisation & écrans : /fr/documentation/utilisation
- Manifeste, Vision & Auteur : /fr/a-propos
- FAQ / Dépannage : /fr/documentation/faq
- Développeurs : /fr/documentation/developpeurs
- Baamix en plein écran : /fr/baamix (le même assistant que la bulle, pour discuter en grand)
- Guide matériel : /fr/materiel/amazon et /fr/materiel/aliexpress (un rail d'icônes permet de basculer d'une boutique à l'autre). Un bouton flottant en bas permet de construire un pack « Mon Pack » à la carte (contexte du panier en section 4ter), mélangeant éventuellement les deux plateformes : Amazon ajoute tous ses articles à un panier en un clic, AliExpress ouvre une fiche par clic.
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

async function buildSystemPrompt(cart: unknown, storeView: unknown, catalog: ServerCatalog): Promise<string> {
  const [projectKnowledge, versionInfo] = await Promise.all([
    Promise.resolve(buildProjectKnowledge()),
    buildVersionInfo(),
  ]);
  return SYSTEM_PROMPT_TEMPLATE
    .replace("{{PROJECT_KNOWLEDGE}}", () => projectKnowledge)
    .replace("{{HARDWARE_CATALOG}}", () => buildCatalogIndex(catalog))
    .replace("{{CART_CONTEXT}}", () => buildCartContext(cart))
    .replace("{{STORE_VIEW}}", () => buildStoreViewContext(storeView, catalog))
    .replace("{{VERSION_INFO}}", () => versionInfo);
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.ORCAROUTER_API_KEY;
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY manquante : renseignez-la dans les variables d'environnement.");
      return NextResponse.json({ error: "Assistant momentanément indisponible." }, { status: 503 });
    }
    const baseURL =
      process.env.OPENROUTER_BASE_URL ||
      process.env.ORCAROUTER_BASE_URL ||
      OPENROUTER_BASE_URL;

    const { messages, cart, storeView } = await req.json();

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

    const catalog = await getServerCatalog();
    const systemPrompt = await buildSystemPrompt(cart, storeView, catalog);
    const cartIds: string[] = Array.isArray(cart)
      ? cart.flatMap((i: { asin?: unknown }) => (typeof i?.asin === "string" ? [i.asin] : []))
      : [];
    const lastUserText = String([...messages].reverse().find((m: { role: string }) => m.role === "user")?.content ?? "");

    const conversation = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: String(m.content),
      })),
    ];

    // Modèle principal : DeepSeek V4 Flash gratuit (aucun crédit requis). Raisonnement désactivé (sinon la
    // réponse est deux fois plus lente). Repli automatique sur les autres modèles gratuits. Pour passer à un
    // modèle payant plus rapide (ex. deepseek/deepseek-v4.1-flash, après avoir crédité OpenRouter), définir la
    // variable OPENROUTER_MODEL : elle passe en tête de liste. Les points d'accès gratuits collectent les données.
    interface Candidate {
      model: string;
      extra?: Record<string, unknown>;
    }
    const candidates = ([
      process.env.OPENROUTER_MODEL
        ? { model: process.env.OPENROUTER_MODEL, extra: { reasoning: { enabled: false } } }
        : null,
      { model: "deepseek/deepseek-v4-flash-0731:free", extra: { reasoning: { enabled: false } } },
      { model: "google/gemma-4-26b-a4b-it:free" },
      { model: "google/gemma-4-31b-it:free" },
      { model: "openrouter/free" },
      { model: "openrouter/auto" },
    ] as Array<Candidate | null>).filter((c): c is Candidate => c !== null);

    let stream = null;
    let lastError: unknown = null;

    for (const { model, extra } of candidates) {
      try {
        stream = await client.chat.completions.create({
          model,
          messages: conversation,
          stream: true,
          temperature: 0.3,
          max_tokens: 2500,
          ...(extra ?? {}),
        } as Parameters<typeof client.chat.completions.create>[0] & { stream: true });
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
          let full = "";
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              full += content;
              controller.enqueue(encoder.encode(content));
            }
          }
          const compareFallback = buildFallbackCompareBlock(lastUserText, full, storeView, catalog);
          if (compareFallback) {
            full += compareFallback;
            controller.enqueue(encoder.encode(compareFallback));
          }
          const productFallback = buildFallbackProductBlocks(full, cartIds, catalog);
          if (productFallback) controller.enqueue(encoder.encode(productFallback));
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
