import "@/styles/split/pages-misc.css";

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
      <figure className="shot-figure shot-figure-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || caption} className="shot-img-1"
        />
        <figcaption className="shot-figcaption-1"
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
