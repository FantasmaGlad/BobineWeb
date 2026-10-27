"use client";

import React, { useState } from "react";
import type { SecurityStrings } from "../content/security-content";

interface PgpKeyBoxProps {
  strings: SecurityStrings;
}

export default function PgpKeyBox({ strings }: PgpKeyBoxProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <section className="install-flow" aria-labelledby="flow-heading">
      <h2 id="flow-heading" className="flow-section-title">
        {strings.stepsTitle}
      </h2>

      {/* Étape 1 */}
      <article className="install-step">
        <div className="install-step__header">
          <span className="install-step__num">1.</span>
          <h3 className="install-step__title">{strings.step1Title}</h3>
        </div>
        <p className="install-step__desc">{strings.step1Desc}</p>
        <div className="command-wrapper">
          <div className="command-header">
            <span>Terminal (Bash)</span>
          </div>
          <div className="command-body">
            <code id="cmd-1">{strings.step1Cmd}</code>
            <button
              type="button"
              className="copy-btn"
              data-copy="cmd-1"
              aria-label={strings.copyLabel}
              onClick={() => handleCopy("cmd-1", strings.step1Cmd)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span className="copy-label">
                {copiedId === "cmd-1" ? strings.copiedLabel : strings.copyLabel}
              </span>
            </button>
          </div>
        </div>
        <aside className="info-callout">
          <strong>Empreinte attendue :</strong> <code>{strings.expectedFp}</code>. Une clé dont l&apos;empreinte diffère sur un canal ne doit pas être utilisée.
        </aside>
      </article>

      {/* Étape 2 */}
      <article className="install-step">
        <div className="install-step__header">
          <span className="install-step__num">2.</span>
          <h3 className="install-step__title">{strings.step2Title}</h3>
        </div>
        <p className="install-step__desc">{strings.step2Desc}</p>
        <div className="command-wrapper">
          <div className="command-header">
            <span>Terminal (Bash)</span>
          </div>
          <div className="command-body">
            <code id="cmd-2">{strings.step2Cmd}</code>
            <button
              type="button"
              className="copy-btn"
              data-copy="cmd-2"
              aria-label={strings.copyLabel}
              onClick={() => handleCopy("cmd-2", strings.step2Cmd)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span className="copy-label">
                {copiedId === "cmd-2" ? strings.copiedLabel : strings.copyLabel}
              </span>
            </button>
          </div>
        </div>
        <aside className="info-callout">{strings.ownKeyNote}</aside>
      </article>

      {/* Étape 3 */}
      <article className="install-step">
        <div className="install-step__header">
          <span className="install-step__num">3.</span>
          <h3 className="install-step__title">{strings.step3Title}</h3>
        </div>
        <p className="install-step__desc">{strings.step3Desc}</p>
        <div className="command-wrapper">
          <div className="command-header">
            <span>E-mail</span>
          </div>
          <div className="command-body">
            <code id="cmd-3">{strings.step3Cmd}</code>
            <button
              type="button"
              className="copy-btn"
              data-copy="cmd-3"
              aria-label={strings.copyLabel}
              onClick={() => handleCopy("cmd-3", strings.step3Cmd)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span className="copy-label">
                {copiedId === "cmd-3" ? strings.copiedLabel : strings.copyLabel}
              </span>
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
