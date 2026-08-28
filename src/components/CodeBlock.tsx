"use client";

import { useRef, useState } from "react";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  title?: string;
}

export default function CodeBlock({
  children,
  title = "bash",
  className,
  ...props
}: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!preRef.current) return;
    const text = preRef.current.textContent || "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="terminal-code-block">
      <div className="terminal-code-block__header">
        <div className="terminal-dots">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>
        <div className="terminal-code-block__title">
          <code>{title}</code>
        </div>
        <button
          type="button"
          className="terminal-copy-btn"
          onClick={handleCopy}
          aria-label="Copier le code"
          title="Copier dans le presse-papiers"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Copié !</span>
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copier</span>
            </>
          )}
        </button>
      </div>
      <pre ref={preRef} className={`terminal-code-block__body ${className || ""}`} {...props}>
        {children}
      </pre>
    </div>
  );
}
