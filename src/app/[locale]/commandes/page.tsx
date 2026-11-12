import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ArgumentTable from "@/components/reference/ArgumentTable";
import CommandEntry from "@/components/reference/CommandEntry";
import ReferenceHeader from "@/components/reference/ReferenceHeader";
import ReferenceTabs from "@/components/reference/ReferenceTabs";
import { isLocale, type Locale } from "@/lib/i18n";
import { anchor, CLI } from "@/lib/reference";
import { buildMetadata, lp } from "@/lib/seo";
import "@/styles/split/pages-reference.css";

const copy = {
  fr: {
    badge: "Référence",
    title: "Commande bobine",
    intro: "Chaque commande, ses arguments et ses codes de sortie, tels que les imprime bobine --help. Toute action de l'interface existe en ligne de commande ; --json rend une réponse lisible par une machine.",
    options: "Options communes", exit: "Codes de sortie", index: "Commandes", empty: "Aucun argument.",
    metaTitle: "Commande bobine — Bobine", metaDescription: "Référence complète de la commande bobine : commandes, arguments, choix possibles et codes de sortie.",
  },
  en: {
    badge: "Reference",
    title: "The bobine command",
    intro: "Every command, its arguments and its exit codes, as printed by bobine --help (descriptions in French). Every action of the interface exists on the command line; --json gives machine-readable output.",
    options: "Common options", exit: "Exit codes", index: "Commands", empty: "No argument.",
    metaTitle: "The bobine command — Bobine", metaDescription: "Complete reference of the bobine command: commands, arguments, allowed values and exit codes.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = copy[locale as Locale];
  return buildMetadata({ locale: locale as Locale, pathname: "/commandes", title: t.metaTitle, description: t.metaDescription });
}

export default async function CommandsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  return (
    <div className="container ref-page">
      <BreadcrumbsJsonLd items={[{ name: "Bobine", url: `/${locale}` }, { name: t.title, url: lp(locale, "/commandes") }]} />
      <ReferenceHeader badge={t.badge} title={t.title} intro={t.intro} />
      <ReferenceTabs locale={locale as Locale} current="commands" />
      <h2 className="ref-h2">{t.options}</h2>
      <ArgumentTable args={CLI.options} empty={t.empty} />
      <h2 className="ref-h2">{t.exit}</h2>
      <dl className="ref-args">
        {CLI.exit_codes.map((exit) => (
          <div key={exit.code} className="ref-arg"><dt><code>{exit.code}</code></dt><dd>{exit.meaning}</dd></div>
        ))}
      </dl>
      <h2 className="ref-h2">{t.index}</h2>
      <nav className="ref-index">
        {CLI.commands.map((command) => (
          <a key={command.name} href={`#${anchor("cmd", command.name)}`}>{command.name}</a>
        ))}
      </nav>
      {CLI.commands.map((command) => (
        <div key={command.name} id={anchor("cmd", command.name)} className="ref-group">
          <h2 className="ref-h2"><code>bobine {command.name}</code></h2>
          {command.help && <p className="ref-entry__help">{command.help}</p>}
          {command.actions.length === 0
            ? <CommandEntry words={[command.name]} entry={command} empty={t.empty} />
            : command.actions.map((action) => (
                <CommandEntry key={action.name} words={[command.name, action.name]} entry={action} empty={t.empty} />
              ))}
        </div>
      ))}
    </div>
  );
}
