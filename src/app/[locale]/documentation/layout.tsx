export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container docs-content">
      <div className="docs-content__inner">{children}</div>
    </div>
  );
}
