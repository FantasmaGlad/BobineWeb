import { type Locale } from "./i18n";

export interface DocChapter {
  id: string;
  title: string;
  badge: string;
  summary: string;
  subsections: Array<{
    subtitle: string;
    paragraphs: string[];
    codeBlock?: string;
  }>;
}

export const docChaptersFr: DocChapter[] = [
  {
    id: "manifeste",
    badge: "Vision & DA",
    title: "1. Manifeste & Identite",
    summary:
      "Bobine est ne d'une volonte simple : liberer les salles de sport et coachs de la rente des regies video proprietaires. C'est une solution 100% hors-ligne, sobre et sous licence libre AGPL-3.0.",
    subsections: [
      {
        subtitle: "1.1 Le Pourquoi & la Rente Proprietaire",
        paragraphs: [
          "Pendant des annees, les gerants de salle ont du payer des abonnements exorbitants (150 a 400 EUR / mois par ecran) pour de simples players video connectes qui gelent a la moindre coupure reseau.",
          "Bobine elimine definitivement cette taxe recurrente et remet la souverainete entre les mains des clubs.",
        ],
      },
      {
        subtitle: "1.2 Souverainete Physique & Engagement Open Source",
        paragraphs: [
          "Creer Bobine, c'est avant tout un engagement fort envers la communaute Open Source et la liberte d'utiliser un logiciel sans entraves.",
          "Nous defendons le droit fondamental de detenir et d'executer physiquement ses outils sur ses propres moyens informatiques locaux, sans dependance au cloud ni rente imposee.",
        ],
      },
      {
        subtitle: "1.3 La Mascotte Baamix & Sobriete Energetique",
        paragraphs: [
          "Le nom Bobine rend hommage a la mecanique infatigable des bobines 35mm. Notre mascotte Baamix symbolise l'endurance et l'ingenuite locale.",
          "La solution tourne sur des mini PC reconditionnes (~40-50 EUR) consommant moins de 10 Watts.",
        ],
      },
    ],
  },
  {
    id: "demarrage-rapide",
    badge: "Tutoriel",
    title: "2. Guide de Demarrage Rapide",
    summary:
      "Guide d'installation etape par etape sur Debian 13 pour votre mini PC standard, sans connaissances techniques prealables.",
    subsections: [
      {
        subtitle: "2.1 Materiel Recommande",
        paragraphs: [
          "Mini PC bureautique reconditionne : Dell Wyse 5070 (Intel), HP EliteDesk 705 (AMD Ryzen), ou Beelink N100.",
          "Memoire vive : 4 Go a 8 Go RAM. Stockage : SSD 128 Go ou plus. Connexion : Cable HDMI relie a l'ecran du studio.",
        ],
      },
      {
        subtitle: "2.2 Installation du Systeme d'Exploitation",
        paragraphs: [
          "Telechargez l'image Debian 13 (Bookworm / Trixie) standard sans environnement graphique lourd.",
          "Flashez la cle USB avec Rufus ou BalenaEtcher, puis demarrez le mini PC sur la cle.",
        ],
        codeBlock: "sudo apt update && sudo apt install -y git curl python3 python3-pip mpv cec-utils",
      },
      {
        subtitle: "2.3 Deploiement Automatise de Bobine",
        paragraphs: [
          "Clonez le depot officiel et lancez le script d'initialisation systeme :",
        ],
        codeBlock: "git clone https://github.com/FantasmaGlad/Bobine.git\ncd Bobine\nsudo ./scripts/install.sh",
      },
    ],
  },
  {
    id: "utilisation",
    badge: "Guide Pratique",
    title: "3. Utilisation & Exploitation Quotidienne",
    summary:
      "Fonctionnement complet du panneau d'administration, de la borne cinema membre, de la radio d'ambiance et des telecommandes.",
    subsections: [
      {
        subtitle: "3.1 Panneau d'Administration Web",
        paragraphs: [
          "Accessible depuis n'importe quel ordinateur, tablette ou smartphone connecte au reseau local (LAN/Wi-Fi) de la salle sur http://[IP_DU_MINI_PC]:8000.",
          "Permet d'ajouter des cours video (H.264 / HEVC), de configurer le planning hebdomadaire et de piloter les volumes.",
        ],
      },
      {
        subtitle: "3.2 Borne Cinema Membre & Controle Tactile",
        paragraphs: [
          "En dehors des cours planifies, un ecran d'accueil interactif permet aux adherents de selectionner des seances video a la demande en 2 clics.",
          "Un QR code affiche a l'ecran permet egalement a l'adherent de telecommander la seance directement depuis son smartphone sans installer d'application.",
        ],
      },
      {
        subtitle: "3.3 Radio d'Ambiance & Fondu Musical",
        paragraphs: [
          "Bobine diffuse une musique d'ambiance continue sur le plateau avec transition sans blanc (crossfade) et annonces vocales automatiques.",
        ],
      },
    ],
  },
  {
    id: "faq",
    badge: "Support",
    title: "4. FAQ & Resolution des Problemes",
    summary:
      "Reponses aux questions courantes, depannage reseau, controle TV HDMI-CEC et astuces d'optimisation.",
    subsections: [
      {
        subtitle: "4.1 Le televiseur ne s'allume pas automatiquement",
        paragraphs: [
          "Verifiez que l'option HDMI-CEC (Anynet+, Bravia Sync, Simplink) est activee dans les parametres avances du televiseur.",
          "Testez la detection materielle avec la commande 'echo scan | cec-client -s -d 1'.",
        ],
      },
      {
        subtitle: "4.2 Bobine fonctionne-t-il sans connexion Internet ?",
        paragraphs: [
          "Oui, 100% des fonctions (lecture video materielle, planning recurrent, telecommandes locales WebSockets, radio locale) tournent en local sans aucun acces Internet requis.",
        ],
      },
      {
        subtitle: "4.3 Quels sont les formats video recommandes ?",
        paragraphs: [
          "Conteneur MP4 / MKV, encodage video H.264 ou HEVC (H.265) 1080p 60fps, piste audio AAC 192 kbps.",
        ],
      },
    ],
  },
  {
    id: "developpeurs",
    badge: "Technique",
    title: "5. Architecture Technique & Developpeurs",
    summary:
      "Stack logicielle interne, endpoints d'API REST, services systemd et guide de contribution open source.",
    subsections: [
      {
        subtitle: "5.1 Stack Logicielle",
        paragraphs: [
          "Backend : Python 3 + FastAPI pour les API REST et WebSockets ultra-rapides (< 2 ms).",
          "Base de donnees : SQLite pour la simplicite et la robustesse sans maintenance serveur.",
          "Moteur de rendu : MPV avec acceleration VA-API (Intel QuickSync et AMD Radeon).",
        ],
      },
      {
        subtitle: "5.2 Services Systemd & Watchdog",
        paragraphs: [
          "Bobine est decoupe en services systemd isoles (bobine-server, bobine-player, bobine-kiosk) surveilles par un chien de garde (Watchdog) avec relance automatique en cas d'anomalie.",
        ],
        codeBlock: "sudo systemctl status bobine-server\nsudo systemctl restart bobine-player",
      },
    ],
  },
];

export const docChaptersEn: DocChapter[] = [
  {
    id: "manifeste",
    badge: "Vision & DA",
    title: "1. Manifesto & Identity",
    summary:
      "Bobine was built with a clear purpose: liberate fitness clubs and coaches from proprietary video subscriptions. It is a 100% offline-first, frugal solution licensed under AGPL-3.0.",
    subsections: [
      {
        subtitle: "1.1 The Why & Proprietary Lock-in",
        paragraphs: [
          "For years, gym owners paid exorbitant monthly rents ($150-$400 / month per screen) for simple streaming players that freeze whenever Internet drops.",
          "Bobine permanently eliminates recurring fees and returns full sovereignty to sports facilities.",
        ],
      },
      {
        subtitle: "1.2 Physical Ownership & Open Source Dedication",
        paragraphs: [
          "Building Bobine is rooted in an unwavering dedication to the Open Source community and digital sovereignty.",
          "We champion the fundamental right to physically own, control, and execute software on local hardware without cloud dependence.",
        ],
      },
    ],
  },
  {
    id: "demarrage-rapide",
    badge: "Tutorial",
    title: "2. Quick Start Installation",
    summary:
      "Step-by-step installation guide on Debian 13 for budget mini PCs, no advanced Linux background needed.",
    subsections: [
      {
        subtitle: "2.1 Recommended Hardware",
        paragraphs: [
          "Refurbished mini PC: Dell Wyse 5070, HP T630, or Intel Celeron J4105 / N5105 / N100.",
          "4GB-8GB RAM, 128GB SSD storage, HDMI output connected to studio display.",
        ],
      },
      {
        subtitle: "2.2 Quick Installation Command",
        paragraphs: [
          "Clone the repository and run the automated deployment script:",
        ],
        codeBlock: "git clone https://github.com/FantasmaGlad/Bobine.git\ncd Bobine\nsudo ./scripts/install.sh",
      },
    ],
  },
  {
    id: "utilisation",
    badge: "User Manual",
    title: "3. Daily Operations & Usage",
    summary:
      "Guide to the web administration dashboard, member kiosk, local smartphone remotes, and background radio.",
    subsections: [
      {
        subtitle: "3.1 Local Web Dashboard",
        paragraphs: [
          "Accessible via any device on the local Wi-Fi / LAN network on http://[MINI_PC_IP]:8000.",
        ],
      },
    ],
  },
  {
    id: "faq",
    badge: "Support",
    title: "4. FAQ & Troubleshooting",
    summary:
      "Answers to common technical questions, HDMI-CEC screen controls, and network configuration.",
    subsections: [
      {
        subtitle: "4.1 Offline Operation",
        paragraphs: [
          "Bobine runs 100% offline. Video playback, weekly schedule, member kiosk, and local WebSockets operate flawlessly without Internet.",
        ],
      },
    ],
  },
  {
    id: "developpeurs",
    badge: "Technical",
    title: "5. Technical Architecture & Developers",
    summary:
      "Internal software stack, FastAPI REST endpoints, systemd services, and contribution guide.",
    subsections: [
      {
        subtitle: "5.1 Software Stack",
        paragraphs: [
          "FastAPI, SQLite, MPV hardware decoding (VA-API), and systemd watchdog supervision.",
        ],
      },
    ],
  },
];

export async function generateDocumentationPdf({
  locale,
  chapterId,
}: {
  locale: Locale;
  chapterId?: string;
}) {
  const isEn = locale === "en";
  const allChapters = isEn ? docChaptersEn : docChaptersFr;
  const chaptersToExport = chapterId
    ? allChapters.filter((c) => c.id === chapterId)
    : allChapters;

  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const primaryColor = [22, 101, 192] as const;
  const headingColor = [17, 24, 39] as const;
  const textColor = [55, 65, 81] as const;
  const mutedColor = [107, 114, 128] as const;
  const codeBgColor = [243, 244, 246] as const;

  function addHeaderFooter(pageNum: number, totalPages: number) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...mutedColor);
    doc.text(
      isEn ? "Bobine - Official Technical Documentation | AGPL-3.0" : "Bobine - Documentation Technique Officielle | Licence AGPL-3.0",
      margin,
      12
    );
    doc.text(`https://bobine.fit/${locale}`, pageWidth - margin, 12, { align: "right" });
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, 14, pageWidth - margin, 14);

    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    doc.text(
      isEn ? "Free & Open-Source Gym Video Automation Suite" : "Suite Logicielle Libre d'Automatisation Video Fitness",
      margin,
      pageHeight - 9
    );
    doc.text(`${pageNum} / ${totalPages}`, pageWidth - margin, pageHeight - 9, { align: "right" });
  }

  function checkPageBreak(requiredHeight: number) {
    if (y + requiredHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin + 5;
    }
  }

  // Cover / Top box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 42, 3, 3, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 42, 3, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...primaryColor);
  doc.text("BOBINE", margin + 8, y + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...headingColor);
  const docTitle = chapterId
    ? (isEn ? "Technical Documentation Guide" : "Guide Technique Officiel")
    : (isEn ? "Complete Technical Documentation Manual" : "Manuel Complet de Documentation Technique");
  doc.text(docTitle, margin + 8, y + 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...mutedColor);
  const dateStr = new Date().toLocaleDateString(isEn ? "en-US" : "fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Version 2.0.0 - ${dateStr} - Licence AGPL-3.0 - bobine.fit`, margin + 8, y + 34);

  y += 52;

  // Table of Contents
  if (!chapterId && chaptersToExport.length > 1) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...headingColor);
    doc.text(isEn ? "Table of Contents" : "Table des Matieres", margin, y);
    y += 6;

    chaptersToExport.forEach((chap) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...primaryColor);
      doc.text(`-  ${chap.title}`, margin + 4, y);
      y += 5.5;
    });

    y += 6;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  }

  // Chapters body
  for (const chapter of chaptersToExport) {
    checkPageBreak(35);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...headingColor);
    doc.text(chapter.title, margin, y);
    y += 6;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(...mutedColor);
    const summaryLines = doc.splitTextToSize(chapter.summary, contentWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 4.5 + 6;

    for (const sub of chapter.subsections) {
      checkPageBreak(25);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...primaryColor);
      doc.text(sub.subtitle, margin, y);
      y += 5.5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...textColor);

      for (const p of sub.paragraphs) {
        const lines = doc.splitTextToSize(p, contentWidth);
        checkPageBreak(lines.length * 4.5 + 4);
        doc.text(lines, margin, y);
        y += lines.length * 4.5 + 2.5;
      }

      if (sub.codeBlock) {
        const codeLines = doc.splitTextToSize(sub.codeBlock, contentWidth - 8);
        const codeBoxHeight = codeLines.length * 4.2 + 6;
        checkPageBreak(codeBoxHeight + 4);

        doc.setFillColor(...codeBgColor);
        doc.roundedRect(margin, y, contentWidth, codeBoxHeight, 2, 2, "F");
        doc.setDrawColor(229, 231, 235);
        doc.roundedRect(margin, y, contentWidth, codeBoxHeight, 2, 2, "S");

        doc.setFont("courier", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(31, 41, 55);
        doc.text(codeLines, margin + 4, y + 4.5);

        y += codeBoxHeight + 6;
      }
    }

    y += 6;
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeaderFooter(i, totalPages);
  }

  const filename = chapterId
    ? `Bobine_Guide_${chapterId.toUpperCase()}_${locale.toUpperCase()}.pdf`
    : `Bobine_Documentation_Complete_${locale.toUpperCase()}.pdf`;

  doc.save(filename);
}
