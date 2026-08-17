"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

export default function HardwareDiagram({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const [copied, setCopied] = useState(false);

  const command = "curl -fsSL https://bobine.fit/install.sh | bash";

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
        <span className="hardware-badge">
          {isEn ? "Architecture & Hardware" : "Architecture & Matériel"}
        </span>
        <h3 className="hardware-title">
          {isEn ? "3-Cable Setup on Dell Wyse 5070" : "Installation en 3 câbles sur Mini PC standard"}
        </h3>
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
            <h4 className="hardware-card__title">{c.title}</h4>
            <p className="hardware-card__desc">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="terminal-wrapper">
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>
          <span className="terminal-title">
            {isEn ? "Automated Linux Deployment (Ubuntu / Debian)" : "Déploiement automatisé Linux (Ubuntu / Debian)"}
          </span>
          <button
            type="button"
            className="terminal-copy-btn"
            onClick={handleCopy}
            aria-label={isEn ? "Copy install command" : "Copier la commande"}
          >
            {copied ? (isEn ? "Copied!" : "Copié !") : (isEn ? "Copy" : "Copier")}
          </button>
        </div>
        <div className="terminal-body">
          <div className="terminal-line terminal-line--command">
            <span className="terminal-prompt">$</span>
            <code>{command}</code>
          </div>
          <div className="terminal-line terminal-line--output">
            <span className="terminal-ok">[OK]</span> Détection matérielle : Intel Celeron J4105 (VA-API QuickSync actif)
          </div>
          <div className="terminal-line terminal-line--output">
            <span className="terminal-ok">[OK]</span> Stockage local : Disque NVMe 256 Go monté sur /var/lib/bobine
          </div>
          <div className="terminal-line terminal-line--output">
            <span className="terminal-ok">[OK]</span> Sortie vidéo & CEC : Écran Samsung 65&quot; détecté sur bus HDMI-0
          </div>
          <div className="terminal-line terminal-line--output">
            <span className="terminal-ok">[OK]</span> Sortie audio sono : Interface analogique calibrée
          </div>
          <div className="terminal-line terminal-line--output">
            <span className="terminal-ok">[OK]</span> Service systemd activé : bobine.service (actif, en cours d&apos;exécution)
          </div>
          <div className="terminal-line terminal-line--highlight">
            Serveur Bobine opérationnel — Interface locale : http://192.168.1.50:8080
          </div>
        </div>
      </div>
    </section>
  );
}
