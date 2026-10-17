import type { ReactElement } from "react";
import { Document, Page, Text, View, StyleSheet, Link, Image } from "@react-pdf/renderer";
import type { Locale } from "@/lib/i18n";
import type { DocChapter, DocIconKey, DeviceImageKey } from "@/content/docs/types";
import { FAQ_ITEMS, FAQ_CATEGORY_LABELS, type FaqCategory } from "@/content/docs/faq-data";
import {
  IconManifesto,
  IconInstall,
  IconPlay,
  IconFeatures,
  IconHelp,
  IconCode,
  IconRoadmap,
  IconServer,
  IconDatabase,
  IconFilm,
  IconTerminal,
  IconTv,
  IconSmartphone,
  IconTablet,
} from "./icons";

/**
 * Les polices de base PDF (Helvetica/Courier, encodage WinAnsi) ne couvrent pas
 * tout Unicode : la flèche "→" utilisée dans le contenu web (ex. "Réglages →
 * Mises à jour") s'affiche comme un caractère erroné une fois imprimée. On la
 * remplace uniquement pour le rendu PDF, sans toucher au contenu source partagé
 * avec le site (chapters.ts / faq-data.ts).
 */
function sanitizePdfText(text: string): string {
  return text.replace(/→/g, "->");
}

function sanitizeChapterForPdf(chapter: DocChapter): DocChapter {
  return {
    ...chapter,
    title: sanitizePdfText(chapter.title),
    badge: sanitizePdfText(chapter.badge),
    summary: sanitizePdfText(chapter.summary),
    subsections: chapter.subsections.map((sub) => ({
      ...sub,
      subtitle: sanitizePdfText(sub.subtitle),
      paragraphs: sub.paragraphs.map(sanitizePdfText),
      codeBlock: sub.codeBlock ? sanitizePdfText(sub.codeBlock) : sub.codeBlock,
      techChips: sub.techChips?.map((chip) => ({ ...chip, label: sanitizePdfText(chip.label) })),
    })),
  };
}

const ICONS: Record<DocIconKey, (props: { size?: number }) => ReactElement> = {
  manifesto: IconManifesto,
  install: IconInstall,
  play: IconPlay,
  features: IconFeatures,
  help: IconHelp,
  code: IconCode,
  roadmap: IconRoadmap,
  server: IconServer,
  database: IconDatabase,
  film: IconFilm,
  terminal: IconTerminal,
  tv: IconTv,
  smartphone: IconSmartphone,
  tablet: IconTablet,
};

/**
 * Charte graphique du document : noir et blanc strict, aucun aplat de
 * couleur, aucun encadré arrondi. Mise en page inspirée des manuels
 * techniques imprimés (filets fins, typographie hiérarchisée, angles nets).
 */
const INK = "#000000";
const GREY_700 = "#3f3f3f";
const GREY_500 = "#6b6b6b";
const RULE = "#000000";
const RULE_LIGHT = "#bdbdbd";

const styles = StyleSheet.create({
  page: {
    paddingTop: 46,
    paddingBottom: 46,
    paddingHorizontal: 44,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: INK,
    backgroundColor: "#ffffff",
  },

  // En-tête / pied de page courants
  header: {
    position: "absolute",
    top: 20,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    fontSize: 7.5,
    color: GREY_500,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    borderBottom: `0.75pt solid ${RULE}`,
    paddingBottom: 6,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: GREY_500,
    borderTop: `0.75pt solid ${RULE}`,
    paddingTop: 6,
  },

  // Page de garde
  coverRuleTop: {
    borderTop: `1.5pt solid ${RULE}`,
    marginTop: 70,
  },
  coverEyebrow: {
    fontSize: 9,
    fontWeight: 700,
    color: INK,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginTop: 18,
  },
  coverWordmark: {
    fontSize: 52,
    fontWeight: 700,
    color: INK,
    letterSpacing: 1,
    marginTop: 10,
  },
  coverDocTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: INK,
    marginTop: 20,
    lineHeight: 1.4,
  },
  coverSubtitle: {
    fontSize: 10.5,
    color: GREY_700,
    lineHeight: 1.6,
    marginTop: 10,
    maxWidth: 360,
  },
  coverRuleBottom: {
    borderTop: `0.75pt solid ${RULE_LIGHT}`,
    marginTop: 26,
    paddingTop: 12,
  },
  coverMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8.5,
    color: GREY_500,
  },
  coverFooterBlock: {
    position: "absolute",
    bottom: 46,
    left: 44,
    right: 44,
    borderTop: `1.5pt solid ${RULE}`,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8.5,
    color: GREY_500,
  },

  // Sommaire
  sectionLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: INK,
    marginBottom: 4,
  },
  tocTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: INK,
    marginBottom: 4,
    borderBottom: `1.5pt solid ${RULE}`,
    paddingBottom: 12,
  },
  tocRow: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingVertical: 9,
    borderBottom: `0.75pt solid ${RULE_LIGHT}`,
  },
  tocNumber: {
    width: 26,
    fontSize: 10,
    fontWeight: 700,
    color: INK,
  },
  tocIcon: {
    width: 20,
  },
  tocLabel: {
    flex: 1,
    fontSize: 10.5,
    color: INK,
  },
  tocBadge: {
    fontSize: 8,
    color: GREY_500,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Chapitres
  chapterKicker: {
    fontSize: 8.5,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: GREY_500,
    marginBottom: 6,
  },
  chapterTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    paddingBottom: 12,
    borderBottom: `1.5pt solid ${RULE}`,
  },
  chapterTitle: {
    fontSize: 19,
    fontWeight: 700,
    color: INK,
  },
  chapterSummary: {
    fontSize: 10.5,
    fontStyle: "italic",
    color: GREY_700,
    lineHeight: 1.55,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 700,
    color: INK,
    marginTop: 14,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.6,
    color: GREY_700,
    marginBottom: 6,
  },
  codeBlock: {
    fontFamily: "Courier",
    fontSize: 9,
    color: INK,
    padding: 9,
    marginTop: 5,
    marginBottom: 9,
    border: `0.75pt solid ${RULE}`,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 2,
    marginBottom: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    border: `0.75pt solid ${RULE_LIGHT}`,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  chipLabel: {
    fontSize: 7.5,
    fontWeight: 700,
    letterSpacing: 0.3,
    color: GREY_700,
  },

  // Illustrations d'appareils (chapitre installation)
  deviceImageWrap: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 12,
    paddingVertical: 10,
    border: `0.75pt solid ${RULE_LIGHT}`,
  },
  deviceImageRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  deviceImage: {
    width: 110,
    height: 110,
    objectFit: "contain",
  },
  deviceCaption: {
    fontSize: 7.5,
    color: GREY_500,
    marginTop: 6,
    textAlign: "center",
  },

  // FAQ enrichie
  faqItem: {
    marginBottom: 8,
  },
  faqQuestion: {
    fontSize: 10.5,
    fontWeight: 700,
    color: INK,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  faqFootnote: {
    fontSize: 8,
    fontStyle: "italic",
    color: GREY_500,
    marginTop: 10,
    borderTop: `0.75pt solid ${RULE_LIGHT}`,
    paddingTop: 8,
  },
});

function BrandHeader({ locale, chapterTitle }: { locale: Locale; chapterTitle: string }) {
  const isEn = locale === "en";
  return (
    <View style={styles.header} fixed>
      <Text>{isEn ? "Bobine — Documentation" : "Bobine — Documentation"}</Text>
      <Text>{chapterTitle}</Text>
    </View>
  );
}

function BrandFooter({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  return (
    <View style={styles.footer} fixed>
      <Text>
        {isEn ? "AGPL-3.0 — bobine.fit" : "AGPL-3.0 — bobine.fit"}
      </Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

// Illustrations du PDF : photos d'appareils réels (fiches produit vérifiées du hub matériel
// bobine.fit/materiel), visuel Google Book, mascotte et logos des trois canaux de mise à jour.
// react-pdf ne lit que le PNG et le JPEG : pas de WebP ici.
const DEVICE_IMAGES: Record<DeviceImageKey, { srcs: string[]; captionFr: string; captionEn: string }> = {
  windows: {
    srcs: ["/images/pdf/windows-device.png"],
    captionFr: "Exemple de mini PC Windows 11 (Intel N100) — photo officielle du fabricant",
    captionEn: "Example Windows 11 mini PC (Intel N100) — official manufacturer photo",
  },
  macos: {
    srcs: ["/images/pdf/macos-device.png"],
    captionFr: "Apple Mac Mini — photo officielle Apple",
    captionEn: "Apple Mac Mini — official Apple photo",
  },
  linux: {
    srcs: ["/images/pdf/linux-device.png"],
    captionFr: "Mini PC industriel 100% fanless recommandé pour Linux — photo officielle du fabricant",
    captionEn: "100% fanless industrial mini PC recommended for Linux — official manufacturer photo",
  },
  android: {
    srcs: ["/images/pdf/android-device.png"],
    captionFr: "Exemple de tablette Android compatible — photo officielle du fabricant",
    captionEn: "Example compatible Android tablet — official manufacturer photo",
  },
  googlebook: {
    srcs: ["/images/pdf/googlebook-device.png"],
    captionFr: "Ordinateur portable Google Book (Aluminium OS), compatible avec Bobine",
    captionEn: "Google Book laptop (Aluminium OS), compatible with Bobine",
  },
  mascot: {
    srcs: ["/images/pdf/firefox-baamix.png"],
    captionFr: "Baamix, la mascotte de Bobine, et le renard Firefox — Bobine soutient Firefox",
    captionEn: "Baamix, Bobine's mascot, and the Firefox fox — Bobine supports Firefox",
  },
  channels: {
    srcs: ["/images/channels/stable.png", "/images/channels/beta.png", "/images/channels/canary.png"],
    captionFr: "Les trois canaux de mise à jour : Stable, Bêta (curée) et Canary (rolling)",
    captionEn: "The three update channels: Stable, Beta (curated) and Canary (rolling)",
  },
};

function DeviceIllustration({ deviceKeys, locale }: { deviceKeys: DeviceImageKey[]; locale: Locale }) {
  const isEn = locale === "en";
  const devices = deviceKeys.map((key) => DEVICE_IMAGES[key]);
  return (
    <View style={styles.deviceImageWrap} wrap={false}>
      <View style={styles.deviceImageRow}>
        {devices.flatMap((device) => device.srcs).map((src) => (
          <Image key={src} src={src} style={styles.deviceImage} />
        ))}
      </View>
      {devices.map((device, idx) => (
        <Text key={idx} style={styles.deviceCaption}>
          {isEn ? device.captionEn : device.captionFr}
        </Text>
      ))}
    </View>
  );
}

function FaqSection({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const items = FAQ_ITEMS[locale];
  const categories = Object.keys(FAQ_CATEGORY_LABELS[locale]) as FaqCategory[];
  const labels = FAQ_CATEGORY_LABELS[locale];

  return (
    <>
      {categories.map((cat) => {
        const catItems = items.filter((it) => it.category === cat);
        if (catItems.length === 0) return null;
        return (
          <View key={cat}>
            <Text style={styles.subtitle}>{labels[cat]}</Text>
            {catItems.map((item, idx) => (
              <View key={idx} style={styles.faqItem} wrap={false}>
                <Text style={styles.faqQuestion}>{sanitizePdfText(item.q)}</Text>
                <Text style={styles.paragraph}>{sanitizePdfText(item.a)}</Text>
              </View>
            ))}
          </View>
        );
      })}
      <Text style={styles.faqFootnote}>
        {isEn
          ? "This FAQ is kept in sync with the live troubleshooting guide at bobine.fit/documentation/faq."
          : "Cette FAQ est synchronisée avec le guide de dépannage en ligne sur bobine.fit/documentation/faq."}
      </Text>
    </>
  );
}

export function DocumentationPdf({
  locale,
  chapters,
}: {
  locale: Locale;
  chapters: DocChapter[];
}) {
  const isEn = locale === "en";
  chapters = chapters.map(sanitizeChapterForPdf);
  const isFullManual = chapters.length > 1;
  const dateStr = new Date().toLocaleDateString(isEn ? "en-US" : "fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const docTitle = isFullManual
    ? isEn
      ? "Complete Documentation Manual"
      : "Manuel Complet de Documentation"
    : chapters[0]?.title ?? "";

  return (
    <Document
      title={
        isFullManual
          ? isEn
            ? "Bobine — Complete Documentation"
            : "Bobine — Documentation Complète"
          : `Bobine — ${chapters[0]?.title ?? ""}`
      }
      author="Bobine"
      subject={isEn ? "Bobine technical documentation" : "Documentation technique Bobine"}
    >
      {/* Page de garde */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverRuleTop} />
        <Text style={styles.coverEyebrow}>
          {isEn ? "Technical Documentation" : "Documentation Technique"}
        </Text>
        <Text style={styles.coverWordmark}>BOBINE</Text>

        <Text style={styles.coverDocTitle}>{docTitle}</Text>
        <Text style={styles.coverSubtitle}>
          {isEn
            ? "Offline-ready reference guide for installing, operating, and maintaining Bobine — the free, local-first gym video automation suite."
            : "Guide de référence utilisable hors-ligne pour installer, exploiter et maintenir Bobine, la suite libre et autonome d'automatisation vidéo pour salles de sport."}
        </Text>

        <View style={styles.coverRuleBottom}>
          <View style={styles.coverMetaRow}>
            <Text>VERSION 5.0.0</Text>
            <Text>{dateStr.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.coverFooterBlock}>
          <Text>{isEn ? "License AGPL-3.0" : "Licence AGPL-3.0"}</Text>
          <Text>{`bobine.fit/${locale}`}</Text>
        </View>
      </Page>

      {/* Sommaire */}
      {isFullManual && (
        <Page size="A4" style={styles.page}>
          <BrandHeader locale={locale} chapterTitle={isEn ? "Table of Contents" : "Sommaire"} />
          <Text style={styles.tocTitle}>
            {isEn ? "Table of Contents" : "Table des Matières"}
          </Text>
          {chapters.map((chapter, idx) => {
            const ChapterIcon = ICONS[chapter.icon];
            return (
              <View key={chapter.id} style={styles.tocRow}>
                <Text style={styles.tocNumber}>{String(idx + 1).padStart(2, "0")}</Text>
                <View style={styles.tocIcon}>
                  <ChapterIcon size={12} />
                </View>
                <Link src={`#${chapter.id}`} style={styles.tocLabel}>
                  {chapter.title.replace(/^\d+\.\s*/, "")}
                </Link>
                <Text style={styles.tocBadge}>{chapter.badge}</Text>
              </View>
            );
          })}
          <BrandFooter locale={locale} />
        </Page>
      )}

      {/* Chapitres */}
      {chapters.map((chapter) => {
        const ChapterIcon = ICONS[chapter.icon];
        return (
          <Page key={chapter.id} size="A4" style={styles.page} id={chapter.id}>
            <BrandHeader locale={locale} chapterTitle={chapter.title.replace(/^\d+\.\s*/, "")} />

            <Text style={styles.chapterKicker}>{chapter.badge}</Text>
            <View style={styles.chapterTitleRow}>
              <ChapterIcon size={16} />
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
            </View>
            <Text style={styles.chapterSummary}>{chapter.summary}</Text>

            {chapter.id === "faq" ? (
              <FaqSection locale={locale} />
            ) : (
              chapter.subsections.map((sub, idx) => (
                <View key={idx} wrap={false}>
                  <Text style={styles.subtitle}>{sub.subtitle}</Text>
                  {sub.paragraphs.map((p, pIdx) => (
                    <Text key={pIdx} style={styles.paragraph}>
                      {p}
                    </Text>
                  ))}
                  {sub.codeBlock && (
                    <Text style={styles.codeBlock}>{sub.codeBlock}</Text>
                  )}
                  {sub.deviceImage && (
                    <DeviceIllustration
                      deviceKeys={Array.isArray(sub.deviceImage) ? sub.deviceImage : [sub.deviceImage]}
                      locale={locale}
                    />
                  )}
                  {sub.techChips && sub.techChips.length > 0 && (
                    <View style={styles.chipRow}>
                      {sub.techChips.map((chip, chipIdx) => {
                        const ChipIcon = ICONS[chip.icon];
                        return (
                          <View key={chipIdx} style={styles.chip}>
                            <ChipIcon size={9} />
                            <Text style={styles.chipLabel}>{chip.label}</Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              ))
            )}

            <BrandFooter locale={locale} />
          </Page>
        );
      })}
    </Document>
  );
}
