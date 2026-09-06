export default function TauriIcon({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.847 7.708a5.534 5.534 0 0 0-4.63-2.483H5.534a5.534 5.534 0 0 0 0 11.069h1.722a5.534 5.534 0 0 0 4.63 2.483h8.683a5.534 5.534 0 0 0 0-11.069h-1.722zm-13.313 5.76a2.767 2.767 0 1 1 0-5.534h6.059c.094.275.215.54.364.793l-4.526 4.741H5.534zm12.932 2.767h-6.059a3.784 3.784 0 0 1-.364-.793l4.526-4.741h1.897a2.767 2.767 0 1 1 0 5.534z" />
    </svg>
  );
}
