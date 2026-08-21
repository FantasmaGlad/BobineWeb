import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";


import Shot from "@/components/Shot";
import CodeBlock from "@/components/CodeBlock";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";
import DownloadPdfButton from "@/components/DownloadPdfButton";
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
    pathname: "/documentation/demarrage-rapide",
    title: isEn
      ? "Quick Start Guide & Debian Setup — Bobine | Les Mills Alternative"
      : "Guide de Démarrage Rapide & Installation Debian — Bobine | Alternative Les Mills",
    description: isEn
      ? "Step-by-step setup guide for Bobine on Debian 13: hardware selection (Dell Wyse 5070), automated 1-command installer, and first workout screen playout."
      : "Guide d'installation pas à pas de Bobine sur Debian 13 : choix du mini PC (Dell Wyse 5070), commande d'installation automatisée et premier lancement en salle.",
    keywords: [
      "Installation Bobine",
      "Alternative Les Mills Cinema",
      "Alternative Les Mills Virtual",
      "Démarrage rapide régie vidéo",
      "Debian 13 mini PC fitness",
      "Dell Wyse 5070 installation",
      "Script install.sh Bobine",
      "Gym playout installer",
    ],
  });
}

export default async function DemarrageRapidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const isEn = locale === "en";

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: "Documentation", url: `/${locale}/documentation` },
    { name: isEn ? "Quick Start" : "Démarrage rapide", url: `/${locale}/documentation/demarrage-rapide` },
  ];

  return isEn ? (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <span className="feature-category-label">Tutorial & Setup</span>
          <h1 style={{ margin: 0 }}>Quick Start Guide</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <DownloadPdfButton locale={locale as Locale} chapterId="demarrage-rapide" />
          <ShareButton
            locale={locale as Locale}
            pathname="/documentation/demarrage-rapide"
            title="Bobine Quick Start Guide"
            description="Step-by-step setup guide for Bobine on Debian 13."
          />
        </div>
      </div>

      <p>
        This guide walks you step-by-step from discovering Bobine to having your workout room actively broadcasting virtual classes — with no prior Linux or system administration experience needed beyond following straightforward instructions. Expect about 30 to 45 minutes total setup time, mostly unattended while automated installers download and build.
      </p>

      <div className="docs-callout docs-callout--tip">
        <div className="docs-callout__content">
          <div className="docs-callout__title">Quick Setup Summary</div>
          <div>Internet is only required once during the initial installation. Once setup is complete, your gym runs 100% offline from local SSD storage with zero cloud dependencies.</div>
        </div>
      </div>

      <h2 id="what-you-need">What you need</h2>
      <div className="docs-table-wrapper">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Requirement</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Mini PC / Hardware</strong></td>
              <td>x86-64 CPU with Intel iGPU</td>
              <td>Dell Wyse 5070 (Intel J4105) ~40–50 €</td>
            </tr>
            <tr>
              <td><strong>Memory (RAM)</strong></td>
              <td>4 GB minimum</td>
              <td>8 GB DDR4</td>
            </tr>
            <tr>
              <td><strong>Storage</strong></td>
              <td>32 GB minimum</td>
              <td>128 GB–256 GB SATA/NVMe SSD</td>
            </tr>
            <tr>
              <td><strong>Display / TV</strong></td>
              <td>HDMI 1080p or 4K</td>
              <td>TV with HDMI-CEC support for auto power</td>
            </tr>
            <tr>
              <td><strong>Installation Media</strong></td>
              <td>8 GB+ USB Flash Drive</td>
              <td>USB 3.0 drive</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="step-1--download-debian-13">Step 1 — Download Debian 13</h2>
      <p>
        Bobine targets <strong>Debian 13 &quot;Trixie&quot;</strong> (or Debian 12 &quot;Bookworm&quot;), minimal headless installation with no graphical desktop environment.
      </p>
      <p>
        Download the official <strong>netinst</strong> ISO image (~700 MB) from Debian: <a href="https://www.debian.org/download" target="_blank" rel="noreferrer">debian.org/download</a> — select the <code>amd64</code> netinst image.
      </p>

      <h2 id="step-2--write-image-to-usb-drive">Step 2 — Write image to USB drive</h2>
      <p><strong>Windows / macOS</strong>: use <a href="https://etcher.balena.io/" target="_blank" rel="noreferrer">balenaEtcher</a> (or Rufus on Windows) — select the downloaded Debian ISO, select your USB flash drive, and click Flash.</p>
      <Shot caption="balenaEtcher interface with Debian ISO and USB flash drive selected, ready to flash" />

      <p><strong>Linux command line</strong>:</p>
      <CodeBlock>
        <code>sudo dd if=debian-13-*-amd64-netinst.iso of=/dev/sdX bs=4M status=progress oflag=sync</code>
      </CodeBlock>
      <p><em>Replace <code>/dev/sdX</code> with your actual USB drive identifier found via <code>lsblk</code>.</em></p>

      <h2 id="step-3--boot-mini-pc-on-usb-drive">Step 3 — Boot the mini PC from USB & BIOS Settings</h2>
      <p>
        Plug the USB flash drive into your mini PC, power it on, and immediately press the Boot Menu key — usually <code>F12</code> on Dell Wyse, or <code>F7</code>, <code>F10</code>, <code>Esc</code> on other brands. Select the USB drive in the list.
      </p>
      <div className="docs-callout docs-callout--info">
        <div className="docs-callout__content">
          <div className="docs-callout__title">Recommended BIOS Setting</div>
          <div>In the BIOS under <strong>Power Management → AC Recovery</strong>, set to <strong>Power On</strong>. This guarantees that your Bobine player automatically powers back on and resumes playback after any gym power outage.</div>
        </div>
      </div>
      <Shot caption="Boot menu showing the USB flash drive selected as primary boot device" />

      <h2 id="step-4--install-debian">Step 4 — Install minimal Debian</h2>
      <p>Run through the standard installer steps:</p>
      <ol>
        <li><strong>Language & Keyboard</strong> — choose your preferences.</li>
        <li><strong>Hostname</strong> — pick any name (e.g. <code>bobine</code>). Once installed, the system is reachable at <code>http://bobine.local</code> regardless of hostname.</li>
        <li><strong>User account</strong> — create a <strong>normal user account</strong> (not root) and remember your password: this account is used for SSH and the installer.</li>
        <li><strong>Disk Partitioning</strong> — select &quot;Guided - use entire disk&quot;.</li>
        <li><strong>Software Selection (Critical step)</strong> — <strong>uncheck all desktop environments</strong> (GNOME, XFCE, etc.), and check only <strong>SSH server</strong> and <strong>Standard system utilities</strong>. Bobine runs its own optimized fullscreen kiosk layer; a heavy desktop environment is unnecessary and would consume valuable memory.</li>
      </ol>
      <Shot caption="Software Selection screen with only SSH Server and Standard System Utilities checked" />
      <p>6. Complete the installation and <strong>reboot while removing the USB drive</strong>.</p>

      <h2 id="step-5--connect-via-ssh">Step 5 — Connect via SSH</h2>
      <p>From your laptop or second computer on the same local network:</p>
      <CodeBlock>
        <code>ssh your-username@bobine.local</code>
      </CodeBlock>
      <p>If mDNS is not supported by your router, find the machine IP address in your router dashboard and connect via <code>ssh your-username@&lt;ip-address&gt;</code>.</p>
      <Shot caption="Terminal window showing a successful SSH connection to the mini PC" />

      <h2 id="step-6--install-bobine">Step 6 — Install Bobine</h2>
      <p>Still in SSH with your regular user account (<strong>not root</strong>):</p>
      <CodeBlock>
        <code>git clone https://github.com/FantasmaGlad/Bobine.git
cd Bobine
sudo ./install.sh</code>
      </CodeBlock>
      <p>
        <code>install.sh</code> is idempotent and fully automated: it installs system packages, Redis, Node.js, Python virtual environment, builds the Next.js UI, configures systemd background services (backend, kiosk, audio supervisor, watchdog), and starts the entire system.
      </p>
      <Shot caption="Completed install.sh execution showing success summary and local IP address" />

      <h2 id="step-7--verify-system">Step 7 — Post-Install Validation</h2>
      <p>Verify that your hardware acceleration and systemd services are operating properly:</p>
      <CodeBlock>
        <code># 1. Verify Intel Hardware Video Acceleration (VA-API)
vainfo

# 2. Check status of Bobine background services
sudo systemctl status bobine-backend bobine-kiosk

# 3. Test sound output through HDMI / Jack
speaker-test -t wav -c 2 -l 1</code>
      </CodeBlock>

      <h2 id="step-8--open-the-interface">Step 8 — Open the Interface</h2>
      <p>From any phone, tablet, or PC on the same Wi-Fi / LAN, open your browser:</p>
      <CodeBlock>
        <code>http://bobine.local</code>
      </CodeBlock>
      <Shot caption="First login on the Bobine web administration dashboard" />

      <h2 id="step-9--import-your-first-workouts">Step 9 — Import your first workouts</h2>
      <p>
        From the Admin panel, upload your fitness videos (drag and drop batch upload), create your categories (Spinning, Yoga, HIIT, Body Sculpt), and configure your weekly timetable.
      </p>
      <Shot caption="Administration panel: Drag-and-drop batch video upload in library" />

      <h2 id="next-steps">What&apos;s next?</h2>
      <ul>
        <li><Link href={`/${locale}/documentation/utilisation`}>User Manual & Daily Operations</Link> — Admin, Cinema kiosk, 24/7 Radio, Mobile remote.</li>
        <li><Link href={`/${locale}/documentation/faq`}>FAQ & Troubleshooting</Link> — Common questions, error resolution table, and diagnostic commands.</li>
        <li><Link href={`/${locale}/documentation/developpeurs`}>Developer & API Reference</Link> — REST endpoints, WebSockets, systemd, and contribution guidelines.</li>
      </ul>
    </>
  ) : (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <span className="feature-category-label">Tutoriel & Installation</span>
          <h1 style={{ margin: 0 }}>Démarrage rapide</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <DownloadPdfButton locale={locale as Locale} chapterId="demarrage-rapide" />
          <ShareButton
            locale={locale as Locale}
            pathname="/documentation/demarrage-rapide"
            title="Guide de Démarrage Rapide Bobine"
            description="Guide étape par étape pour installer et configurer Bobine sur votre mini PC."
          />
        </div>
      </div>

      <p>
        Ce guide vous accompagne, étape par étape, de « je découvre Bobine » à « ma salle diffuse ses cours » — sans compétence technique préalable au-delà de suivre des instructions claires. Comptez environ 30 à 45 minutes, dont une bonne partie en attente pendant le téléchargement et la compilation automatisée.
      </p>

      <div className="docs-callout docs-callout--tip">
        <div className="docs-callout__content">
          <div className="docs-callout__title">Installation 100% autonome</div>
          <div>Internet n&apos;est requis qu&apos;une seule fois lors de l&apos;installation initiale pour télécharger les paquets. Ensuite, la salle diffuse ses cours 100% hors-ligne depuis son SSD local sans aucune dépendance au cloud.</div>
        </div>
      </div>

      <h2 id="ce-quil-vous-faut">Ce qu&apos;il vous faut</h2>
      <div className="docs-table-wrapper">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Composant</th>
              <th>Spécification minimale</th>
              <th>Recommandation optimale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Mini PC / Matériel</strong></td>
              <td>x86-64 avec iGPU Intel</td>
              <td>Dell Wyse 5070 (Celeron J4105) ~40–50 €</td>
            </tr>
            <tr>
              <td><strong>Mémoire vive (RAM)</strong></td>
              <td>4 Go</td>
              <td>8 Go DDR4</td>
            </tr>
            <tr>
              <td><strong>Stockage</strong></td>
              <td>32 Go</td>
              <td>128 Go à 256 Go SSD SATA/NVMe</td>
            </tr>
            <tr>
              <td><strong>Écran / Téléviseur</strong></td>
              <td>HDMI 1080p ou 4K</td>
              <td>Écran avec HDMI-CEC pour allumage auto</td>
            </tr>
            <tr>
              <td><strong>Support d&apos;installation</strong></td>
              <td>Clé USB 8 Go ou plus</td>
              <td>Clé USB 3.0</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="etape-1--telecharger-debian-13">Étape 1 — Télécharger Debian 13</h2>
      <p>
        Bobine cible <strong>Debian 13 « Trixie »</strong> (ou Debian 12 « Bookworm »), installation minimale, sans environnement de bureau.
      </p>
      <p>
        Téléchargez l&apos;image <strong>netinst</strong> (~700 Mo) sur le site officiel : <a href="https://www.debian.org/download" target="_blank" rel="noreferrer">debian.org/download</a> — choisissez l&apos;image <code>amd64</code> netinst.
      </p>

      <h2 id="etape-2--ecrire-limage-sur-la-cle-usb">Étape 2 — Écrire l&apos;image sur la clé USB</h2>
      <p><strong>Windows / macOS</strong> : utilisez <a href="https://etcher.balena.io/" target="_blank" rel="noreferrer">balenaEtcher</a> (ou Rufus sous Windows) — sélectionnez l&apos;image téléchargée, sélectionnez la clé USB, lancez l&apos;écriture.</p>
      <Shot caption="Interface de balenaEtcher avec l'image Debian et la clé USB sélectionnées, prêt à flasher" />

      <p><strong>Linux</strong> :</p>
      <CodeBlock>
        <code>sudo dd if=debian-13-*-amd64-netinst.iso of=/dev/sdX bs=4M status=progress oflag=sync</code>
      </CodeBlock>
      <p><em>Remplacez <code>/dev/sdX</code> par votre clé USB (trouvée avec <code>lsblk</code>).</em></p>

      <h2 id="etape-3--demarrer-le-mini-pc-sur-la-cle">Étape 3 — Démarrer le mini PC sur la clé & Réglages BIOS</h2>
      <p>
        Insérez la clé USB dans le mini PC, allumez-le, et pressez la touche du menu de démarrage — souvent <code>F12</code>, <code>F7</code>, <code>F10</code> ou <code>Échap</code> (sur un Dell Wyse, c&apos;est généralement <code>F12</code>). Choisissez la clé USB dans la liste.
      </p>
      <div className="docs-callout docs-callout--info">
        <div className="docs-callout__content">
          <div className="docs-callout__title">Réglage BIOS recommandé</div>
          <div>Dans le BIOS (section <strong>Power Management → AC Recovery</strong>), choisissez <strong>Power On</strong>. Le mini PC se rallumera ainsi automatiquement dès le retour du courant après une coupure générale.</div>
        </div>
      </div>
      <Shot caption="Écran du menu de démarrage (boot menu) avec la clé USB visible dans la liste" />

      <h2 id="etape-4--installer-debian">Étape 4 — Installer Debian</h2>
      <p>Déroulez l&apos;installateur (graphique ou texte) :</p>
      <ol>
        <li><strong>Langue et clavier</strong> — choisissez ce qui vous convient.</li>
        <li><strong>Nom de machine</strong> — sans importance particulière : Bobine sera accessible via <code>bobine.local</code> une fois installé.</li>
        <li><strong>Compte utilisateur</strong> — créez un compte <strong>normal</strong> (pas root) et retenez le mot de passe : c&apos;est ce compte qui servira pour la connexion SSH et l&apos;installation.</li>
        <li><strong>Partitionnement</strong> — le mode guidé « utiliser tout le disque » convient pour une machine dédiée à Bobine.</li>
        <li><strong>Sélection des logiciels</strong> — l&apos;étape la plus importante : <strong>décochez tous les environnements de bureau</strong> (GNOME, etc.), ne gardez que <strong>serveur SSH</strong> et <strong>utilitaires usuels du système</strong>. Bobine installe sa propre pile d&apos;affichage kiosque.</li>
      </ol>
      <Shot caption="Écran « Sélection des logiciels » avec uniquement Serveur SSH et Utilitaires usuels du système cochés, tous les environnements de bureau décochés" />
      <p>6. Terminez l&apos;installation et <strong>redémarrez en retirant la clé USB</strong>.</p>

      <h2 id="etape-5--se-connecter-en-ssh">Étape 5 — Se connecter en SSH</h2>
      <p>Depuis votre second ordinateur, sur le même réseau local :</p>
      <CodeBlock>
        <code>ssh votre-utilisateur@bobine.local</code>
      </CodeBlock>
      <p>Si votre réseau bloque le mDNS, trouvez l&apos;adresse IP du mini PC depuis votre routeur et connectez-vous avec <code>ssh votre-utilisateur@&lt;ip&gt;</code>.</p>
      <Shot caption="Terminal montrant une connexion SSH réussie au mini PC fraîchement installé" />

      <h2 id="etape-6--installer-bobine">Étape 6 — Installer Bobine</h2>
      <p>Toujours en SSH, avec votre compte normal (<strong>pas root</strong>) :</p>
      <CodeBlock>
        <code>git clone https://github.com/FantasmaGlad/Bobine.git
cd Bobine
sudo ./install.sh</code>
      </CodeBlock>
      <p>
        <code>install.sh</code> est autonome et idempotent : il installe les paquets système, Redis, Node.js et Python, construit l&apos;interface web, écrit la configuration, enregistre les services systemd et démarre tout en 10 à 15 minutes.
      </p>
      <Shot caption="Fin de l'exécution de install.sh : message de succès et adresse IP affichée dans le terminal" />

      <h2 id="etape-7--validation-du-systeme">Étape 7 — Validation & Diagnostic du système</h2>
      <p>Vérifiez que l&apos;accélération matérielle et les services d&apos;arrière-plan fonctionnent :</p>
      <CodeBlock>
        <code>{`# 1. Vérifier l'accélération matérielle Intel QuickSync (VA-API)
vainfo

# 2. Vérifier l'état des services Bobine
sudo systemctl status bobine-backend bobine-kiosk

# 3. Tester la sortie audio HDMI / Jack
speaker-test -t wav -c 2 -l 1`}</code>
      </CodeBlock>

      <h2 id="etape-8--ouvrir-linterface">Étape 8 — Ouvrir l&apos;interface</h2>
      <p>Depuis n&apos;importe quel appareil du même réseau, ouvrez votre navigateur :</p>
      <CodeBlock>
        <code>http://bobine.local</code>
      </CodeBlock>
      <Shot caption="Première ouverture de l'interface d'administration Bobine dans un navigateur" />

      <h2 id="etape-9--importer-vos-premieres-videos">Étape 9 — Importer vos premières vidéos</h2>
      <p>
        Depuis le panneau d&apos;administration, importez vos vidéos de cours (glisser-déposer en lot), puis construisez un planning ou une playlist.
      </p>
      <Shot caption="Panneau d'administration : import de vidéos par glisser-déposer" />

      <h2 id="et-ensuite-">Et ensuite ?</h2>
      <ul>
        <li><Link href={`/${locale}/documentation/utilisation`}>Guide d&apos;utilisation & Exploitation</Link> — admin, cinéma membre, radio, télécommande.</li>
        <li><Link href={`/${locale}/documentation/faq`}>FAQ & Dépannage</Link> — questions fréquentes, tableau d&apos;erreurs et commandes de diagnostic.</li>
        <li><Link href={`/${locale}/documentation/developpeurs`}>Documentation Développeur & API</Link> — endpoints REST, WebSockets, systemd et contribution.</li>
      </ul>
    </>
  );
}
