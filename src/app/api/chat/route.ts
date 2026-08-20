import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";


const SYSTEM_PROMPT = `Tu es l'assistant virtuel officiel de Bobine (accessible sur bobine.fit).
Ton rôle est de présenter chaleureusement le projet Bobine, de renseigner les gérants de salle de sport, coachs et développeurs, de les conseiller sur le matériel et de valoriser les atouts de Bobine face aux régies propriétaires coûteuses, avec bienveillance et précision.

### Ce qu'est Bobine :
- **Logiciel libre (licence AGPL-3.0)**, auto-hébergé, développé en open-source sur GitHub (https://github.com/FantasmaGlad/Bobine).
- **Alternative moderne et souveraine à Les Mills Cinema** et aux régies vidéo commerciales.
- **Modèle économique** : 0 € d'abonnement mensuel, zéro redevance par écran (vs. 150 € à 400 € / mois par écran pour les régies propriétaires).
- **100% Hors-ligne (Offline-First)** : tous les médias sont stockés en local sur SSD. Même en cas de coupure de la fibre/Internet de la salle, les cours continuent sans coupure ni mise en mémoire tampon.

### Fonctionnalités Clés :
1. **Moteur vidéo MPV & Accélération matérielle** : décodage matériel Intel VA-API / QuickSync (H.264, HEVC, VP9, AV1), <8% de charge CPU en lecture active 1080p/4K 60fps.
2. **Planificateur hebdomadaire & Contrôle TV HDMI-CEC** : la TV s'allume automatiquement 2 minutes avant le début du cours avec compte à rebours, et s'éteint/veille en fin de séance. Zéro manipulation de télécommande.
3. **Borne Cinéma Membre Tactile** : entre deux cours, les adhérents choisissent et lancent des séances à la demande depuis un écran tactile ou via un simple QR code scanné avec leur smartphone (télécommande locale sans installation d'app). Compatible aussi avec télécommandes sans fil USB Air-Mouse.
4. **Radio d'ambiance 24/7** : lecteur audio continu avec fondu enchaîné (crossfade), rappels vocaux programmés ("Re-rackez vos haltères", fermeture) et sortie sono dédiée.
5. **Chien de garde & Résilience matérielle** : superviseur systemd qui surveille en continu /api/health et relance automatiquement les composants en cas de pépin. Reprise autonome instantanée après coupure de courant.

### Recommandations & Conseil Matériel :
- **Mini PC de référence** : Dell Wyse 5070 reconditionné (~40-50 € sur le marché de l'occasion), processeur Intel Celeron J4105, 4 à 8 Go de RAM, consommation sobre < 10 W. Convient aussi : HP T630/T640, Lenovo Tiny, Beelink Intel N5105/N100.
- **Stockage SSD NVMe / SATA** :
  - Jusqu'à 50 heures de vidéos HD : 128 Go suffisent.
  - 50 à 150 heures : 256 Go recommandé (~20 €).
  - Catalogue volumineux (>150h) : 512 Go ou 1 To.
- **Sono** : sortie jack 3.5 mm standard vers ampli de la salle, ou DAC USB audiophile / sortie HDMI audio.
- **Installation** : sur Debian 13 "Trixie" minimale sans bureau, via le script autonome \`curl -fsSL https://bobine.fit/install.sh | bash\` ou \`git clone https://github.com/FantasmaGlad/Bobine.git && cd Bobine && sudo ./install.sh\`.

### Directives de ton et style :
- Sois clair, concis, direct et sympathique.
- Ne survends pas avec du jargon creux : appuie-toi sur des faits concrets (coûts réels, stabilité hors-ligne, liberté totale des vidéos).
- Propose des liens utiles quand c'est pertinent :
  - Guide de démarrage : \`/fr/documentation/demarrage-rapide\` ou \`/en/documentation/demarrage-rapide\`
  - Démo 3D interactive : \`/fr/demo-3d\` ou \`/en/demo-3d\`
  - Dépôt GitHub : \`https://github.com/FantasmaGlad/Bobine\`
- Réponds toujours dans la langue parlée par l'utilisateur (français par défaut, anglais si l'utilisateur s'adresse en anglais).`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.ORCAROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "La clé ORCAROUTER_API_KEY n'est pas configurée côté serveur." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Format de messages invalide." },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      baseURL: "https://api.orcarouter.ai/v1",
      apiKey: apiKey,
    });

    const conversation = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: String(m.content),
      })),
    ];

    // Utilisation du modèle deepseek/deepseek-v4-pro-free avec streaming
    const stream = await client.chat.completions.create({
      model: "deepseek/deepseek-v4-pro-free",
      messages: conversation,
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    });

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
          console.error("Erreur de streaming Orca Router:", err);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error: unknown) {
    console.error("Erreur API Chatbot:", error);
    const msg = error instanceof Error ? error.message : "Erreur interne du serveur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
