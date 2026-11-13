import type { CliArgument } from "@/lib/reference";

export default function ArgumentTable({ args, empty }: { args: CliArgument[]; empty: string }) {
  if (args.length === 0) return <p className="ref-empty">{empty}</p>;
  return (
    <dl className="ref-args">
      {args.map((argument) => (
        <div key={argument.name} className="ref-arg">
          <dt><code>{argument.name}</code>{argument.choices && <span className="ref-choices">{argument.choices.join(" | ")}</span>}</dt>
          <dd>{argument.help}</dd>
        </div>
      ))}
    </dl>
  );
}
