export default function CoffeeCupIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2.5 5.5h8v4a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-4Z" />
      <path d="M10.5 6.5h1a1.75 1.75 0 0 1 0 3.5h-1" />
      <path d="M5 3.2c.3-.5.3-1-.1-1.4M8 3.2c.3-.5.3-1-.1-1.4" />
    </svg>
  );
}
