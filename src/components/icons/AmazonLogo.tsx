import React from "react";

export default function AmazonLogo({ height = 16 }: { height?: number }) {
  const width = (height * 230) / 82;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 10 230 82"
      role="img"
      aria-label="Amazon"
      style={{ flexShrink: 0, display: "block" }}
    >
      <text
        x="4"
        y="58"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="52"
        fontWeight="700"
        letterSpacing="-1"
        fill="var(--text-heading)"
      >
        amazon
      </text>
      <path
        d="M13 68c28 17 66 21 97 11.5 3.5-1.1 6.5 2.6 3.7 5.7-9.5 10.5-28.5 18.5-50.5 18.5-27 0-49-10.5-54.5-24-1.3-3.2 1.4-5.4 4.3-3.7z"
        fill="#FF9900"
      />
      <path
        d="M110.5 79.5c3.2-2.3 8.2-3 11.8-2 1.5.4 1.9 1.4 1.1 3.2-1.7 3.8-4.8 7.8-8.6 9.8-1.2.6-2 0-1.6-1.1 1-2.7 2.6-7.1 1.6-8.2-.9-1-3.5-1-4.3-.9-.5.1-.6-.3 0-.8z"
        fill="#FF9900"
      />
    </svg>
  );
}
