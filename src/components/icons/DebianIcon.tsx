export default function DebianIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" fill="#D70A53" fillOpacity="0.15" stroke="#D70A53" strokeWidth="1.5" />
      <path
        d="M12 6C8.68629 6 6 8.68629 6 12C6 14.5 7.5 16.5 9.5 17.5C11.5 18.5 14 18 15.5 16.5C17 15 17.5 13 16.5 11.5C15.5 10 13.5 9.5 12 10.5C10.5 11.5 10 13.5 11 15"
        stroke="#D70A53"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
