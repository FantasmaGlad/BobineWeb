export default function ReferenceHeader({ badge, title, intro }: { badge: string; title: string; intro: string }) {
  return (
    <header className="ref-header">
      <span className="ref-badge">{badge}</span>
      <h1 className="ref-title">{title}</h1>
      <p className="ref-intro">{intro}</p>
    </header>
  );
}
