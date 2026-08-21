import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";
import DownloadPdfButton from "@/components/DownloadPdfButton";
import CodeBlock from "@/components/CodeBlock";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const isEn = locale === "en";
  return buildMetadata({
    locale: locale as Locale,
    pathname: "/documentation/faq",
    title: isEn
      ? "FAQ & Troubleshooting Guide — Bobine | Les Mills Cinema Alternative"
      : "FAQ & Guide de Dépannage — Bobine | Alternative Les Mills Cinema",
    description: isEn
      ? "Frequently asked questions, common error troubleshooting matrix, diagnostic commands, and resilience guides for Bobine."
      : "Foire aux questions, tableau de résolution des erreurs courantes, commandes de diagnostic et résilience de Bobine face aux régies comme Les Mills Cinema.",
    keywords: [
      "FAQ Bobine",
      "Alternative Les Mills Cinema",
      "Alternative Les Mills Virtual",
      "Dépannage régie vidéo",
      "Erreurs courantes Bobine",
      "Commandes diagnostic Linux Bobine",
      "HDMI-CEC dépannage",
      "Virtual gym troubleshooting",
    ],
  });
}

const faqData = {
  fr: [
    {
      q: "Bobine est-il vraiment gratuit ?",
      a: "Oui. Logiciel libre sous licence AGPL-3.0, aucun abonnement, aucune redevance par écran, aucun compte requis. Le seul investissement est votre matériel standard (mini PC, écran, câbles).",
    },
    {
      q: "En quoi Bobine diffère-t-il d'un outil d'affichage publicitaire / dynamique (Anthias, Screenly, Xibo, Yodeck) ?",
      a: "Les outils d'affichage dynamique généralistes font défiler des diaporamas ou des pages web en boucle, mais ils ne sont pas adaptés aux studios de fitness : pas d'allumage TV par HDMI-CEC synchronisé à la seconde, pas de borne tactile membre pour lancer un cours à la demande, pas de télécommande smartphone par QR code et pas de radio 24/7 avec fondu sonore. Bobine est spécialement pensé comme une régie de cours collectifs.",
    },
    {
      q: "En quoi Bobine remplace-t-il Les Mills Cinema, Wexer ou Spivi ?",
      a: "Même expérience haut de gamme en salle (cours planifiés, borne tactile membre à la demande, diffusion 1080p60/4K), mais sans abonnement exorbitant (0 € vs 150-400 €/mois) et sans catalogue imposé. Vous êtes propriétaire de vos appareils et tout tourne 100% hors-ligne sur SSD local.",
    },
    {
      q: "Ai-je besoin d'une connexion internet pour faire tourner Bobine ?",
      a: "Non, pas au quotidien. Internet n'est requis qu'une seule fois lors de l'installation initiale. Ensuite, la salle diffuse ses cours sans aucune connexion.",
    },
    {
      q: "Quel matériel informatique faut-il acheter ?",
      a: "Un mini PC x86-64 standard (référence : Dell Wyse 5070 reconditionné à ~40-50 € avec processeur Intel Celeron J4105), 4 à 8 Go de RAM, et un écran HDMI.",
    },
    {
      q: "Que se passe-t-il en cas de coupure de courant ou de plantage ?",
      a: "Un chien de garde systemd surveille en continu la santé des services et relance automatiquement les composants en cas d'anomalie. Les services redémarrent instantanément et de façon autonome dès le retour du courant.",
    },
  ],
  en: [
    {
      q: "Is Bobine truly 100% free with no recurring fees?",
      a: "Yes. Free and open-source software under the copyleft AGPL-3.0 license. Zero subscription fees, zero royalties per screen, and no user accounts. Your only investment is standard refurbished hardware.",
    },
    {
      q: "How does Bobine differ from general digital signage tools (Anthias, Screenly, Xibo, Yodeck)?",
      a: "General digital signage players loop slides and ad banners, but lack fitness-specific features: automated HDMI-CEC TV wake/standby synchronized to timetables, interactive touch member kiosk, QR-code smartphone remote, and 24/7 background audio with voice crossfade. Bobine is purpose-built for gym studio playout.",
    },
    {
      q: "How does Bobine replace proprietary systems like Les Mills Cinema, Wexer, or Spivi?",
      a: "Same premium studio workout experience — automated weekly timetables, on-demand member touchscreen kiosk, 1080p60/4K playout — without recurring monthly fees ($0 vs $150-$400/mo) or locked catalogs. You own your devices, and playback is 100% offline from local SSD.",
    },
    {
      q: "Do I need an active internet connection to run Bobine?",
      a: "No, not for daily operations. Internet is only required once during the initial setup. Afterwards, your gym plays workout videos entirely offline.",
    },
    {
      q: "What hardware do I need to equip my gym?",
      a: "A standard refurbished x86-64 mini PC (Reference unit: Dell Wyse 5070 with Intel Celeron J4105, ~40-50 EUR), 4-8GB RAM, and an HDMI TV display.",
    },
    {
      q: "What happens if there is a power cut or system crash?",
      a: "A local systemd supervisor continuously monitors process health and restarts failing components automatically. All services boot autonomously upon power restoration after a blackout.",
    },
  ],
};

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const isEn = locale === "en";
  const items = faqData[locale as Locale];

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: "Documentation", url: `/${locale}/documentation` },
    { name: isEn ? "FAQ & Troubleshooting" : "FAQ & Dépannage", url: `/${locale}/documentation/faq` },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return isEn ? (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <span className="feature-category-label">Support & Knowledge</span>
          <h1 style={{ margin: 0 }}>FAQ & Troubleshooting</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <DownloadPdfButton locale={locale as Locale} chapterId="faq" />
          <ShareButton
            locale={locale as Locale}
            pathname="/documentation/faq"
            title="Bobine FAQ & Troubleshooting"
            description="Answers to common questions and troubleshooting guide for Bobine."
          />
        </div>
      </div>

      <p>
        Find fast answers to general questions and step-by-step diagnostic solutions for common hardware and network issues.
      </p>

      <h2 id="general">General Questions</h2>

      <p><strong>Is Bobine truly 100% free with no hidden fees?</strong><br />
      Yes. Free, open-source software under the copyleft AGPL-3.0 license. Zero subscription fees, zero per-screen royalties, and no mandatory cloud accounts. You own your hardware and data permanently.</p>

      <p><strong>How does Bobine replace Les Mills Cinema or commercial kiosk systems?</strong><br />
      Same workout room features (automated timetable playback, on-demand member touchscreen kiosk, 24/7 background music) with no vendor lock-in. Playout is 100% offline from local SSD storage.</p>

      <p><strong>Do I need an active internet connection?</strong><br />
      No. Internet access is only required once during the initial software installation to download packages. Daily gym operations are completely offline.</p>

      <p><strong>What hardware is recommended?</strong><br />
      A standard refurbished x86-64 mini PC (Reference unit: Dell Wyse 5070 with Intel Celeron J4105, ~40–50 €), 4GB to 8GB RAM, and an HDMI TV screen. Detailed hardware guide in the <Link href={`/${locale}/documentation/demarrage-rapide`}>Quick Start Guide</Link>.</p>

      <h2 id="troubleshooting-matrix">Common Error Resolution Matrix</h2>
      <div className="docs-table-wrapper">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Issue / Symptom</th>
              <th>Probable Cause</th>
              <th>Resolution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>http://bobine.local</code> unreachable</td>
              <td>Router / Wi-Fi blocks mDNS (Bonjour)</td>
              <td>Use direct IP address (e.g. <code>http://192.168.1.50</code>). Run <code>hostname -I</code> on the mini PC to find it.</td>
            </tr>
            <tr>
              <td>Black screen on wired TV</td>
              <td>Chromium kiosk failed to launch X11</td>
              <td>Run <code>sudo systemctl restart bobine-kiosk</code>. Check HDMI cable connection.</td>
            </tr>
            <tr>
              <td>No sound through HDMI / Speakers</td>
              <td>Audio sink misconfigured or muted</td>
              <td>Run <code>alsamixer</code> to unmute HDMI, or set default sink via <code>pactl set-default-sink</code>.</td>
            </tr>
            <tr>
              <td>Video stutter / high CPU load (&gt;30%)</td>
              <td>VA-API hardware acceleration disabled</td>
              <td>Run <code>vainfo</code>. Verify <code>i965-va-driver-shaders</code> or <code>intel-media-va-driver</code> is installed.</td>
            </tr>
            <tr>
              <td>Port 8000 / 8001 Conflict</td>
              <td>Stale process holding web server port</td>
              <td>Kill lingering processes with <code>sudo fuser -k 8000/tcp</code> and restart services.</td>
            </tr>
            <tr>
              <td>TV does not power on via HDMI-CEC</td>
              <td>CEC disabled in TV settings or permissions</td>
              <td>Enable HDMI-CEC (Anynet+, Bravia Sync, Simplink) in TV menu. Add user: <code>sudo usermod -aG video,dialout $USER</code>.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="diagnostic-commands">Essential Diagnostic Commands</h2>
      <p>Connect over SSH to run these diagnostic commands if you encounter an issue:</p>

      <CodeBlock>
        <code># 1. Check all Bobine systemd services
sudo systemctl status bobine-backend bobine-kiosk bobine-watchdog

# 2. View live logs in real time
sudo journalctl -u bobine-backend -u bobine-kiosk -f

# 3. Query the machine health endpoint
curl -s http://127.0.0.1:8000/api/health | jq .

# 4. Test HDMI-CEC communication
cec-client -l

# 5. Test audio output
speaker-test -t wav -c 2 -l 1</code>
      </CodeBlock>

      <h2 id="support-help">Getting Further Help</h2>
      <div className="docs-callout docs-callout--tip">
        <div className="docs-callout__content">
          <div className="docs-callout__title">Interactive AI Assistant & Community</div>
          <div>You can ask technical questions to our AI assistant Baamix using the chat widget on the right, or open a ticket on <a href="https://github.com/FantasmaGlad/Bobine/issues" target="_blank" rel="noreferrer">GitHub Issues</a>.</div>
        </div>
      </div>
    </>
  ) : (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <span className="feature-category-label">Support & Connaissances</span>
          <h1 style={{ margin: 0 }}>FAQ / Dépannage</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <DownloadPdfButton locale={locale as Locale} chapterId="faq" />
          <ShareButton
            locale={locale as Locale}
            pathname="/documentation/faq"
            title="FAQ & Dépannage Bobine"
            description="Réponses aux questions fréquentes et guide de résolution des erreurs."
          />
        </div>
      </div>

      <p>
        Retrouvez les réponses aux questions fondamentales ainsi qu&apos;un tableau de diagnostic pas-à-pas pour résoudre rapidement les éventuels incidents matériels ou réseau.
      </p>

      <h2 id="general">Questions Générales</h2>

      <p><strong>Bobine est-il vraiment 100% gratuit et sans redevance ?</strong><br />
      Oui. Logiciel libre sous licence AGPL-3.0 : aucun abonnement, aucune redevance par écran, aucun compte obligatoire. Vous êtes l&apos;unique propriétaire de votre matériel et de vos médias.</p>

      <p><strong>En quoi Bobine remplace-t-il Les Mills Cinema ou une régie propriétaire ?</strong><br />
      Mêmes fonctionnalités en salle (cours planifiés, borne tactile membre à la demande, musique d&apos;ambiance 24/7) sans enfermement éditeur. Tout fonctionne 100% hors-ligne depuis le SSD local.</p>

      <p><strong>Ai-je besoin d&apos;une connexion internet au quotidien ?</strong><br />
      Non. Internet n&apos;est requis qu&apos;une seule fois lors de l&apos;installation initiale pour télécharger les paquets Debian. L&apos;exploitation quotidienne en salle est totalement autonome.</p>

      <p><strong>Quel matériel informatique faut-il acheter ?</strong><br />
      Un mini PC x86-64 standard (référence : Dell Wyse 5070 reconditionné à ~40-50 € avec processeur Intel Celeron J4105), 4 à 8 Go de RAM, et un écran HDMI. Voir les détails dans le <Link href={`/${locale}/documentation/demarrage-rapide`}>guide de démarrage rapide</Link>.</p>

      <h2 id="tableau-depannage">Tableau de Résolution des Erreurs Courantes</h2>
      <div className="docs-table-wrapper">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Problème / Symptôme</th>
              <th>Cause probable</th>
              <th>Solution pas-à-pas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>http://bobine.local</code> inaccessible</td>
              <td>La box / routeur bloque le mDNS (Bonjour)</td>
              <td>Utilisez l&apos;IP locale (ex: <code>http://192.168.1.50</code>). Tapez <code>hostname -I</code> sur le mini PC pour la connaître.</td>
            </tr>
            <tr>
              <td>Écran noir sur la TV en HDMI</td>
              <td>Le kiosque Chromium a planté au boot</td>
              <td>Relancez avec <code>sudo systemctl restart bobine-kiosk</code>. Vérifiez le câble HDMI.</td>
            </tr>
            <tr>
              <td>Pas de son sur la TV ou la sono</td>
              <td>Sortie audio HDMI muette ou mal routée</td>
              <td>Ouvrez <code>alsamixer</code> pour démuter l&apos;HDMI, ou définissez la sortie avec <code>pactl set-default-sink</code>.</td>
            </tr>
            <tr>
              <td>Vidéo saccadée / CPU saturé (&gt;30%)</td>
              <td>Accélération matérielle VA-API inactive</td>
              <td>Vérifiez avec <code>vainfo</code>. Installez le paquet de pilotes <code>intel-media-va-driver</code>.</td>
            </tr>
            <tr>
              <td>Conflit de port 8000 / 8001</td>
              <td>Un ancien processus occupe le port web</td>
              <td>Tuez le processus bloquant avec <code>sudo fuser -k 8000/tcp</code> puis relancez les services.</td>
            </tr>
            <tr>
              <td>La TV ne s&apos;allume pas en HDMI-CEC</td>
              <td>Option CEC désactivée sur la TV ou droits</td>
              <td>Activez le CEC (Anynet+, Bravia Sync, Simplink) dans le menu TV. Ajoutez l&apos;utilisateur : <code>sudo usermod -aG video,dialout $USER</code>.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="commandes-diagnostic">Commandes de Diagnostic Indispensables</h2>
      <p>Connectez-vous en SSH sur le mini PC pour exécuter ces vérifications :</p>

      <CodeBlock>
        <code>{`# 1. Vérifier l'état de tous les services Bobine
sudo systemctl status bobine-backend bobine-kiosk bobine-watchdog

# 2. Consulter les logs en direct (streaming temps réel)
sudo journalctl -u bobine-backend -u bobine-kiosk -f

# 3. Tester le point de santé machine de l'API
curl -s http://127.0.0.1:8000/api/health | jq .

# 4. Détecter l'adaptateur HDMI-CEC
cec-client -l

# 5. Tester la sortie audio des enceintes
speaker-test -t wav -c 2 -l 1`}</code>
      </CodeBlock>

      <h2 id="support-aide">Aide & Support</h2>
      <div className="docs-callout docs-callout--tip">
        <div className="docs-callout__content">
          <div className="docs-callout__title">Assistant IA & Communauté</div>
          <div>Vous pouvez poser vos questions techniques directement à Baamix via la bulle de discussion à droite, ou ouvrir un ticket sur <a href="https://github.com/FantasmaGlad/Bobine/issues" target="_blank" rel="noreferrer">GitHub Issues</a>.</div>
        </div>
      </div>
    </>
  );
}
