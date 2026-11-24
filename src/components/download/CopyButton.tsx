"use client";

import Icon from "@/components/ui/Icon";

export default function CopyButton({
  text,
  id,
  label,
  copied,
  onCopy,
  isEn,
}: {
  text: string;
  id: string;
  label: string;
  copied: string;
  onCopy: (text: string, id: string) => void;
  isEn: boolean;
}) {
  const isCopied = copied === id;
  return (
    <button
      type="button"
      className={`dl-btn dl-btn--copy${isCopied ? " is-copied" : ""}`}
      onClick={() => onCopy(text, id)}
    >
      <Icon name={isCopied ? "check" : "copy"} size={15} />
      <span>{isCopied ? (isEn ? "Copied" : "Copié") : label}</span>
    </button>
  );
}
