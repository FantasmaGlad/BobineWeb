import type { Locale } from "@/lib/i18n";
import TerminalDemo from "@/components/TerminalDemo";

export default function HardwareDiagram({ locale }: { locale: Locale }) {
  const isEn = locale === "en";

  const cables = isEn
    ? [
        {
          num: "01",
          title: "Power & Efficiency",
          desc: "Standard 19V power supply. Low power consumption under 10W in active continuous playback.",
          tag: "< 10 Watts",
        },
        {
          num: "02",
          title: "HDMI Video + CEC Control",
          desc: "Carries 1080p/4K 60fps video signal and sends automated standby/power commands to the TV screen.",
          tag: "Auto-Power TV",
        },
        {
          num: "03",
          title: "Direct Audio to Gym Amp",
          desc: "3.5mm jack or USB connection directly into the gym's public address sound system.",
          tag: "Direct Sound Amp",
        },
      ]
    : [
        {
          num: "01",
          title: "Alimentation & Sobriété",
          desc: "Bloc secteur 19V standard. Consommation électrique inférieure à 10 Watts en lecture active.",
          tag: "< 10 Watts",
        },
        {
          num: "02",
          title: "Vidéo HDMI + Contrôle CEC",
          desc: "Transmet le flux vidéo 1080p/4K et pilote l'allumage / veille automatique de la TV.",
          tag: "Pilote TV Auto",
        },
        {
          num: "03",
          title: "Audio direct vers Sono",
          desc: "Liaison jack 3.5 mm ou USB directement reliée à l'amplificateur sono de votre espace.",
          tag: "Sortie Sono",
        },
      ];

  return (
    <section className="hardware-section">
      <div className="hardware-header">
        <span className="feature-category-label">
          {isEn ? "Architecture & Hardware" : "Architecture & Matériel"}
        </span>
        <h2 className="hardware-title">
          {isEn ? "3-Cable Setup on Dell Wyse 5070" : "Installation en 3 câbles sur Mini PC standard"}
        </h2>
        <p className="hardware-desc">
          {isEn
            ? "No complex rack required. A single refurbished mini PC placed behind the screen powers the entire studio."
            : "Aucune baie de brassage complexe. Un simple boîtier reconditionné fixé derrière l'écran pilote l'ensemble de la salle."}
        </p>
      </div>

      <div className="hardware-grid">
        {cables.map((c) => (
          <div key={c.num} className="hardware-card">
            <div className="hardware-card__top">
              <span className="hardware-card__num">{c.num}</span>
              <span className="hardware-card__tag">{c.tag}</span>
            </div>
            <h3 className="hardware-card__title">{c.title}</h3>
            <p className="hardware-card__desc">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Démo interactive du Terminal avec Art ASCII et déploiement temps réel */}
      <TerminalDemo locale={locale} />
    </section>
  );
}
