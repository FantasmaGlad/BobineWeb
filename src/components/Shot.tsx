export default function Shot({
  caption,
  src,
  alt,
}: {
  caption: string;
  src?: string;
  alt?: string;
}) {
  if (src) {
    return (
      <figure className="shot-figure" style={{ marginBlock: "1.25rem" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || caption}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "0.65rem",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        />
        <figcaption
          style={{
            fontSize: "0.825rem",
            color: "var(--text-muted)",
            marginTop: "0.45rem",
            textAlign: "center",
          }}
        >
          {caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <div className="shot-placeholder">
      <span className="shot-placeholder__tag">Capture d&apos;écran / Preview</span>
      <span>{caption}</span>
    </div>
  );
}
