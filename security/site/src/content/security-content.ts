export interface SecurityStrings {
  lang: "fr" | "en";
  title: string;
  description: string;
  heroCategory: string;
  heroTitle: string;
  heroDesc: string;
  metaReportsOpen: string;
  metaKeyValid: string;
  stepsTitle: string;
  step1Title: string;
  step1Desc: string;
  step1Cmd: string;
  expectedFp: string;
  step2Title: string;
  step2Desc: string;
  step2Cmd: string;
  ownKeyNote: string;
  step3Title: string;
  step3Desc: string;
  step3Cmd: string;
  specsTitle: string;
  bulletinsTitle: string;
  footerLead: string;
  copyLabel: string;
  copiedLabel: string;
  snake: {
    title: string;
    description: string;
    score: string;
    best: string;
    overTitle: string;
    overDesc: string;
    restartBtn: string;
    backLink: string;
  };
}

export const SECURITY_DATA: Record<"fr" | "en", SecurityStrings> = {
  fr: {
    lang: "fr",
    title: "Sécurité & Divulgation de vulnérabilités — Bobine",
    description: "Politique de divulgation de vulnérabilités de Bobine, clé OpenPGP officielle de sécurité et signalement chiffré.",
    heroCategory: "Divulgation de vulnérabilités · OpenPGP",
    heroTitle: "Signaler une vulnérabilité",
    heroDesc: "Signalez en privé les failles de sécurité du logiciel Bobine, du site ou des dépôts de paquets signés. Chiffrez votre rapport avec la clé ci-dessous et vérifiez son empreinte sur au moins deux canaux avant l'envoi.",
    metaReportsOpen: "Signalements ouverts",
    metaKeyValid: "Clé valable jusqu'au 2028-10-06",
    stepsTitle: "Signalement privé en 3 étapes",
    step1Title: "Récupérer et vérifier la clé",
    step1Desc: "Récupérez la clé publique, puis comparez l'empreinte avec le tableau ci-dessous et avec la copie publiée dans le dépôt GitHub :",
    step1Cmd: "gpg --locate-keys security@bobine.fit && gpg --fingerprint security@bobine.fit",
    expectedFp: "23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2",
    step2Title: "Chiffrer votre rapport",
    step2Desc: "Chiffrez le rapport pour la clé de sécurité. Pour recevoir une réponse chiffrée, joignez votre propre clé publique :",
    step2Cmd: "gpg --armor --encrypt --recipient security@bobine.fit report.txt",
    ownKeyNote: 'Votre propre paire de clés : gpg --quick-generate-key "Votre Nom <vous@exemple.org>" future-default default 2y puis gpg --armor --export vous@exemple.org. Ne partagez jamais votre clé privée. Sans PGP, utilisez le signalement privé GitHub.',
    step3Title: "L'envoyer",
    step3Desc: "Envoyez le fichier chiffré (report.txt.asc) à l'adresse de sécurité, ou ouvrez un signalement privé sur GitHub :",
    step3Cmd: "security@bobine.fit",
    specsTitle: "Détails de la clé et de la divulgation",
    bulletinsTitle: "Historique des bulletins & avis de sécurité",
    footerLead: "Politique de sécurité et clé OpenPGP officielle de Bobine.",
    copyLabel: "Copier",
    copiedLabel: "Copié !",
    snake: {
      title: "Snake — Bobine Sécurité",
      description: "Mini-jeu d'arcade Snake pour patienter pendant le chiffrement de votre rapport de sécurité.",
      score: "SCORE",
      best: "RECORD",
      overTitle: "Partie terminée !",
      overDesc: "Votre serpent a heurté un obstacle.",
      restartBtn: "Rejouer",
      backLink: "← Retour à la sécurité",
    },
  },
  en: {
    lang: "en",
    title: "Security & Vulnerability Disclosure — Bobine",
    description: "Bobine vulnerability disclosure policy, official OpenPGP security key, and encrypted reporting guidelines.",
    heroCategory: "Vulnerability disclosure · OpenPGP",
    heroTitle: "Report a vulnerability",
    heroDesc: "Report security issues in the Bobine software, website or signed package repositories privately. Encrypt your report with the key below and check its fingerprint on at least two channels before sending.",
    metaReportsOpen: "Reports open",
    metaKeyValid: "Key expires 2028-10-06",
    stepsTitle: "3-Step Private Report",
    step1Title: "Retrieve and verify the key",
    step1Desc: "Fetch the public key, then compare the fingerprint with the table below and with the copy published in the GitHub repository:",
    step1Cmd: "gpg --locate-keys security@bobine.fit && gpg --fingerprint security@bobine.fit",
    expectedFp: "23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2",
    step2Title: "Encrypt your report",
    step2Desc: "Encrypt the report for the security key. To receive an encrypted reply, attach your own public key:",
    step2Cmd: "gpg --armor --encrypt --recipient security@bobine.fit report.txt",
    ownKeyNote: 'Your own key pair: gpg --quick-generate-key "Your Name <you@example.org>" future-default default 2y then gpg --armor --export you@example.org. Never share your private key. Without PGP, use the private GitHub report.',
    step3Title: "Send it",
    step3Desc: "Send the encrypted file (report.txt.asc) to the security address, or open a private report on GitHub:",
    step3Cmd: "security@bobine.fit",
    specsTitle: "Key & Disclosure Details",
    bulletinsTitle: "Security Bulletins & Advisory History",
    footerLead: "Bobine security policy and official OpenPGP key.",
    copyLabel: "Copy",
    copiedLabel: "Copied!",
    snake: {
      title: "Snake — Bobine Security",
      description: "Classic Snake arcade game while you encrypt your security report.",
      score: "SCORE",
      best: "BEST",
      overTitle: "Game Over!",
      overDesc: "Your snake hit an obstacle.",
      restartBtn: "Play Again",
      backLink: "← Back to Security",
    },
  },
};
