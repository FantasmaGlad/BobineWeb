import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: locale === "en" ? "FAQ & Troubleshooting" : "FAQ / Dépannage",
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const isEn = locale === "en";

  return isEn ? (
    <>
      <h1>FAQ & Troubleshooting</h1>

      <h2 id="general">General Questions</h2>

      <p><strong>Is Bobine truly 100% free?</strong><br />
      Yes. Free, open-source software under the copyleft AGPL-3.0 license. Zero subscription fees, zero per-screen license royalties, and no user accounts required. The only investment is your standard hardware (mini PC, display, cables).</p>

      <p><strong>How does Bobine replace Les Mills Cinema?</strong><br />
      Same workout room usage — automated scheduled classes, on-demand member touchscreen kiosk — but without publisher lock-in: the code is open, you own your hardware, and everything plays 100% offline from local SSD.</p>

      <p><strong>Do I need an active internet connection to run Bobine?</strong><br />
      No, not for daily gym operations. Internet is only required once during the initial Debian and Bobine package download. Afterward, the studio runs workouts completely offline.</p>

      <p><strong>What hardware do I need?</strong><br />
      A standard x86-64 mini PC (Reference unit: Dell Wyse 5070 with Intel J4105), 4GB RAM minimum, and an HDMI display. See full details in the <Link href={`/${locale}/documentation/demarrage-rapide`}>Quick Start Guide</Link>.</p>

      <h2 id="installation">Installation & Setup</h2>

      <p><strong>I cannot connect to <code>http://bobine.local</code>, what should I do?</strong><br />
      If your router or corporate Wi-Fi blocks mDNS (Bonjour/Zeroconf), use the machine&apos;s local IP address directly (e.g. <code>http://192.168.1.50</code>). The IP is displayed at the end of <code>install.sh</code>, or found by running <code>hostname -I</code> on the mini PC.</p>

      <p><strong>Can I install Bobine without internet at the gym?</strong><br />
      Yes: clone and prepare the repository on another machine, then copy it via SSH/rsync or USB drive to the target mini PC.</p>

      <p><strong>Can I update Bobine without losing my workout videos or schedules?</strong><br />
      Yes, <code>install.sh</code> is idempotent: run a <code>git pull</code> then re-run <code>sudo ./install.sh</code>. Your video library, settings, and schedules stored in the database are safely preserved.</p>

      <h2 id="daily-operation">Daily Operations & Hardware</h2>

      <p><strong>What happens if a component or power crashes?</strong><br />
      A local systemd watchdog supervises <code>/api/health</code> continuously and restarts failing services automatically. All services are configured to boot automatically upon power restoration after a blackout.</p>

      <p><strong>Can I drive two different screens with different content?</strong><br />
      Yes: the wired HDMI TV screen and the network browser display are completely independent, configured separately in <em>Settings → Screen Routing</em>.</p>

      <p><strong>What video file formats are supported?</strong><br />
      Bobine embeds the robust MPV player and Intel hardware acceleration (VA-API / QuickSync) — standard video formats (MP4, H.264, H.265/HEVC, WebM, MKV) play natively without pre-conversion.</p>

      <h2 id="support-help">Getting Help</h2>
      <p><strong>My question is not answered here?</strong><br />
      Ask our integrated AI Assistant in the bottom right corner, or open an <a href="https://github.com/FantasmaGlad/Bobine/issues" target="_blank" rel="noreferrer">Issue on GitHub</a>.</p>
    </>
  ) : (
    <>
      <h1>FAQ / Dépannage</h1>

      <h2 id="general">Général</h2>

      <p><strong>Bobine est-il vraiment gratuit ?</strong><br />
      Oui. Logiciel libre sous licence AGPL-3.0, aucun abonnement, aucune licence par écran, aucun compte à créer. Le seul coût est le matériel standard (mini PC, écran).</p>

      <p><strong>En quoi Bobine remplace-t-il LesMills Cinema ?</strong><br />
      Même usage en salle — cours planifiés, borne à la demande — mais sans dépendance à un éditeur : le code est ouvert, ça tourne sur du matériel bon marché que vous possédez, et ça fonctionne 100% hors-ligne une fois installé.</p>

      <p><strong>Ai-je besoin d&apos;internet pour faire tourner Bobine ?</strong><br />
      Non, pas au quotidien. Internet n&apos;est nécessaire qu&apos;une seule fois, pour installer le système d&apos;exploitation et les paquets. Ensuite, la salle diffuse ses cours sans aucune connexion.</p>

      <p><strong>Quel matériel me faut-il ?</strong><br />
      Un mini PC ou thin client x86-64 (référence : Dell Wyse 5070), 4 Go de RAM minimum, un écran HDMI. Voir le détail dans le <Link href={`/${locale}/documentation/demarrage-rapide`}>démarrage rapide</Link>.</p>

      <h2 id="installation">Installation</h2>

      <p><strong>Je n&apos;arrive pas à joindre <code>bobine.local</code>, que faire ?</strong><br />
      Si votre réseau bloque le mDNS (Bonjour/Zeroconf), utilisez l&apos;adresse IP de la machine directement (ex. <code>http://192.168.1.50</code>). Elle s&apos;affiche à la fin de <code>install.sh</code>, ou se trouve avec <code>hostname -I</code> exécuté sur le mini PC.</p>

      <p><strong><code>sudo ./install.sh</code> échoue avec une erreur liée à sudo.</strong><br />
      Selon la configuration choisie pendant l&apos;installation de Debian, le compte créé n&apos;est pas toujours ajouté au groupe <code>sudo</code> par défaut. Ajoutez votre utilisateur avec <code>su - &amp;&amp; usermod -aG sudo votre-nom</code>.</p>

      <p><strong>Puis-je installer Bobine sans connexion internet à la salle ?</strong><br />
      Oui : copiez le dépôt depuis une autre machine par SSH (rsync) au lieu de le cloner directement sur place.</p>

      <p><strong>Puis-je réinstaller ou mettre à jour Bobine sans tout reperdre ?</strong><br />
      Oui, <code>install.sh</code> est idempotent : relancez-le après un <code>git pull</code> pour reconstruire et redémarrer proprement, vos données (vidéos, planning) sont conservées.</p>

      <h2 id="utilisation-quotidienne">Utilisation quotidienne & Matériel</h2>

      <p><strong>Un composant plante, dois-je tout redémarrer manuellement ?</strong><br />
      Non : un chien de garde surveille en continu <code>/api/health</code> et redémarre automatiquement le composant en panne (backend, Redis ou kiosque). Tous les services redémarrent aussi automatiquement après une coupure de courant.</p>

      <p><strong>Puis-je piloter deux écrans différents avec un contenu différent chacun ?</strong><br />
      Oui : l&apos;écran câblé (HDMI) et l&apos;écran réseau sont indépendants, configurables séparément dans <em>Paramètres → Sortie d&apos;écran</em>.</p>

      <p><strong>Quels formats vidéo sont supportés ?</strong><br />
      Bobine s&apos;appuie sur <code>ffmpeg</code> et le décodage matériel (VA-API / QuickSync) — les formats vidéo courants (MP4/H.264/HEVC) fonctionnent sans conversion préalable.</p>

      <h2 id="aide">Aide & Support</h2>
      <p><strong>Ma question n&apos;est pas dans cette liste ?</strong><br />
      Posez votre question à notre Assistant IA en bas à droite, ou ouvrez une <a href="https://github.com/FantasmaGlad/Bobine/issues" target="_blank" rel="noreferrer">Issue sur GitHub</a>.</p>
    </>
  );
}
