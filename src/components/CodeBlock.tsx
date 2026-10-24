"use client";

import { useRef, useState } from "react";
import Icon from "@/components/ui/Icon";

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
          <span>{title}</span>
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
              <Icon name="check" size={12} />
              <span>Copié !</span>
            </>
          ) : (
            <>
              <Icon name="copy" size={12} />
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
