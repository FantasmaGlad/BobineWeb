export default function LinuxIcon({
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
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Pieds / pattes jaune-orange */}
      <ellipse cx="10" cy="28.5" rx="5" ry="2.2" fill="#f59e0b" />
      <ellipse cx="22" cy="28.5" rx="5" ry="2.2" fill="#f59e0b" />
      <path d="M7 27.5C8 26.5 13 26.5 14 27.8C13 29.5 7 29.5 7 27.5Z" fill="#d97706" />
      <path d="M18 27.8C19 26.5 24 26.5 25 27.5C25 29.5 19 29.5 18 27.8Z" fill="#d97706" />

      {/* Corps & ailes noir */}
      <path
        d="M16 3C11.5 3 9.8 6.5 9.8 11.5C9.8 13.8 8.5 16 6.8 18.2C5.2 20.2 4.2 22.5 5 24.2C5.8 25.8 8 26.5 11 26.5H21C24 26.5 26.2 25.8 27 24.2C27.8 22.5 26.8 20.2 25.2 18.2C23.5 16 22.2 13.8 22.2 11.5C22.2 6.5 20.5 3 16 3Z"
        fill="#18181b"
      />

      {/* Ventre / plastron blanc */}
      <path
        d="M16 12C12.5 12 11.2 14.5 11.2 18.2C11.2 22.5 13 25.5 16 25.5C19 25.5 20.8 22.5 20.8 18.2C20.8 14.5 19.5 12 16 12Z"
        fill="#ffffff"
      />

      {/* Yeux blancs */}
      <ellipse cx="14.2" cy="8.2" rx="1.8" ry="2.5" fill="#ffffff" />
      <ellipse cx="17.8" cy="8.2" rx="1.8" ry="2.5" fill="#ffffff" />

      {/* Pupilles noires */}
      <circle cx="14.6" cy="8.2" r="0.9" fill="#18181b" />
      <circle cx="17.4" cy="8.2" r="0.9" fill="#18181b" />

      {/* Reflet pupilles */}
      <circle cx="14.4" cy="7.9" r="0.3" fill="#ffffff" />
      <circle cx="17.2" cy="7.9" r="0.3" fill="#ffffff" />

      {/* Bec jaune orangé */}
      <path
        d="M13.2 10.2C13.2 10.2 14.8 11.6 16 11.6C17.2 11.6 18.8 10.2 18.8 10.2C19.4 11.4 18.2 12.8 16 12.8C13.8 12.8 12.6 11.4 13.2 10.2Z"
        fill="#f59e0b"
      />
      <path
        d="M13.8 10.3C14.8 10.8 17.2 10.8 18.2 10.3C17.8 11.2 16.8 11.8 16 11.8C15.2 11.8 14.2 11.2 13.8 10.3Z"
        fill="#fbbf24"
      />
    </svg>
  );
}
