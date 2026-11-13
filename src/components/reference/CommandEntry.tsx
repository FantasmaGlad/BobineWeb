import { anchor, usage, type CliAction } from "@/lib/reference";
import ArgumentTable from "./ArgumentTable";

export default function CommandEntry({ words, entry, empty }: { words: string[]; entry: CliAction; empty: string }) {
  return (
    <section id={anchor("cmd", ...words)} className="ref-entry">
      <h3 className="ref-entry__title"><code>bobine {words.join(" ")}</code></h3>
      {entry.help && <p className="ref-entry__help">{entry.help}</p>}
      <pre className="ref-usage"><code>{usage(words, entry.arguments)}</code></pre>
      <ArgumentTable args={entry.arguments.filter((a) => !a.positional || a.help)} empty={empty} />
    </section>
  );
}
