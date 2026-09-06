export default function AndroidIcon({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Tête robot vert Android officiel #3DDC84 */}
      <path
        d="M18.44 5.56L16.41 9.06C14.59 8.36 12.93 8.26 12 8.27C10.15 8.29 8.65 8.73 7.74 9.09L5.72 5.6C5.39 5.03 4.65 4.84 4.08 5.17C3.51 5.5 3.32 6.24 3.65 6.81L5.6 10.17C2.9 12.18.45 14.77 0 18.99H24C23.88 17.88 23.63 16.89 23.25 15.92C22.51 14.01 21.41 12.63 20.51 11.74C19.78 11.02 18.95 10.45 18.38 10.05L20.35 6.67C20.68 6.1 20.49 5.36 19.92 5.03C19.35 4.7 18.61 4.89 18.28 5.46L18.44 5.56Z"
        fill="#3DDC84"
      />
      {/* Œil droit blanc */}
      <circle cx="16.5" cy="14.5" r="1.5" fill="#ffffff" />
      {/* Œil gauche blanc */}
      <circle cx="7.5" cy="14.5" r="1.5" fill="#ffffff" />
    </svg>
  );
}
