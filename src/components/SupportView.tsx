import type { Locale } from "@/lib/i18n";
import MarketingPage from "@/components/page/MarketingPage";
import DonationPicker from "@/components/DonationPicker";
import Icon from "@/components/ui/Icon";

export default function SupportView({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return <MarketingPage locale={locale} id="support" title={en ? "Help Bobine keep moving" : "Aider Bobine à avancer"} intro={en ? "You can help with a test report, a translation, a code change or an optional donation. Using Bobine does not require a contribution." : "Vous pouvez aider avec un retour de test, une traduction, une modification du code ou un don facultatif. Utiliser Bobine ne nécessite aucune contribution."} image="laptop">
    <div className="marketing-grid">
      <section className="marketing-card"><h2><Icon name="link" />{en ? "Contribute your experience" : "Partager votre expérience"}</h2><p>{en ? "Describe your device, operating system, browser and the steps needed to reproduce an issue. Useful reports make fixes easier to verify." : "Précisez votre appareil, votre système, votre navigateur et les étapes permettant de reproduire un problème. Un retour concret rend le correctif plus facile à vérifier."}</p><ul><li>{en ? "Report a bug or a compatibility result" : "Signaler un problème ou un résultat de compatibilité"}</li><li>{en ? "Improve a translation or installation guide" : "Améliorer une traduction ou un guide d’installation"}</li><li>{en ? "Propose and discuss a code change" : "Proposer et discuter une modification du code"}</li></ul><a className="btn-secondary" href="https://github.com/FantasmaGlad/Bobine" rel="noreferrer">{en ? "Contribute on GitHub" : "Contribuer sur GitHub"}</a></section>
      <section className="marketing-card"><h2><Icon name="cpu" />{en ? "Support development" : "Soutenir le développement"}</h2><p>{en ? "Donations help with test equipment, the domain name and development infrastructure. The contribution is voluntary; no software license or support service is sold here." : "Les dons aident à financer le matériel de test, le nom de domaine et l’infrastructure de développement. La contribution est volontaire ; aucune licence ni prestation d’assistance n’est vendue ici."}</p><DonationPicker locale={locale} /></section>
    </div>
  </MarketingPage>;
}
