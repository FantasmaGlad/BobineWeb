import { anchor, type ApiField, type ApiRoute } from "@/lib/reference";

function Fields({ title, fields }: { title: string; fields: ApiField[] }) {
  if (fields.length === 0) return null;
  return (
    <div className="ref-fields">
      <h4>{title}</h4>
      <dl className="ref-args">
        {fields.map((field) => (
          <div key={field.name} className="ref-arg">
            <dt><code>{field.name}</code> <span className="ref-type">{field.type}{field.required ? "" : "?"}</span></dt>
            <dd>{field.choices ? field.choices.join(" | ") : ""}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ApiEntry({ route, labels }: { route: ApiRoute; labels: { path: string; query: string; body: string } }) {
  return (
    <section id={anchor(route.method, route.path)} className="ref-entry">
      <h3 className="ref-entry__title"><span className={`ref-method ref-method--${route.method.toLowerCase()}`}>{route.method}</span> <code>{route.path}</code></h3>
      {route.summary && <p className="ref-entry__help">{route.summary}</p>}
      <Fields title={labels.path} fields={route.path_parameters} />
      <Fields title={labels.query} fields={route.query} />
      {route.body && <Fields title={`${labels.body} (${route.body.format})`} fields={route.body.fields} />}
    </section>
  );
}
