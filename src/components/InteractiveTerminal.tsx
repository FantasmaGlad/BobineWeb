"use client";

import { useState, useCallback, useMemo } from "react";
import type { Locale } from "@/lib/i18n";

export interface TerminalLine {
  type: "prompt" | "stdout" | "success" | "warn" | "error" | "info" | "dim" | "json";
  text: string;
}

export interface InteractiveFlag {
  id: string;
  flag: string;
  labelFr: string;
  labelEn: string;
  descFr: string;
  descEn: string;
  defaultValue?: boolean;
}

export interface TerminalScenario {
  id: string;
  badge?: {
    fr: string;
    en: string;
    variant?: "default" | "success" | "warning" | "danger" | "info";
  };
  tabLabel: {
    fr: string;
    en: string;
  };
  title: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  baseCommand: string;
  availableFlags?: InteractiveFlag[];
  getOutput: (activeFlags: string[], isEn: boolean) => TerminalLine[];
}

import {
  installerScenarios,
  troubleshootingScenarios,
  developerScenarios,
  usageScenarios,
} from "@/lib/terminalScenarios";

export type PresetType = "installer" | "troubleshooting" | "developer" | "usage";

interface InteractiveTerminalProps {
  locale: Locale;
  title?: string;
  preset?: PresetType;
  scenarios?: TerminalScenario[];
  defaultScenarioId?: string;
}

export default function InteractiveTerminal({
  locale,
  title,
  preset,
  scenarios: propScenarios,
  defaultScenarioId,
}: InteractiveTerminalProps) {
  const isEn = locale === "en";

  const scenarios = useMemo(() => {
    if (propScenarios && propScenarios.length > 0) return propScenarios;
    if (preset === "installer") return installerScenarios;
    if (preset === "troubleshooting") return troubleshootingScenarios;
    if (preset === "developer") return developerScenarios;
    if (preset === "usage") return usageScenarios;
    return installerScenarios;
  }, [propScenarios, preset]);

  const [activeScenarioId, setActiveScenarioId] = useState(
    defaultScenarioId || scenarios[0]?.id || ""
  );
  const [activeFlagsMap, setActiveFlagsMap] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    scenarios.forEach((s) => {
      if (s.availableFlags) {
        initial[s.id] = s.availableFlags
          .filter((f) => f.defaultValue)
          .map((f) => f.flag);
      } else {
        initial[s.id] = [];
      }
    });
    return initial;
  });

  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const activeScenario =
    scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const currentActiveFlags = useMemo(() => {
    return activeFlagsMap[activeScenario?.id || ""] || [];
  }, [activeFlagsMap, activeScenario?.id]);

  const toggleFlag = (flag: string) => {
    if (!activeScenario) return;
    setActiveFlagsMap((prev) => {
      const current = prev[activeScenario.id] || [];
      const updated = current.includes(flag)
        ? current.filter((f) => f !== flag)
        : [...current, flag];
      return { ...prev, [activeScenario.id]: updated };
    });
    handleSimulate();
  };

  const computeCommand = useCallback(() => {
    if (!activeScenario) return "";
    let cmd = activeScenario.baseCommand;
    if (currentActiveFlags.length > 0) {
      if (cmd.includes(" | bash")) {
        cmd = `${cmd} -s -- ${currentActiveFlags.join(" ")}`;
      } else {
        cmd = `${cmd} ${currentActiveFlags.join(" ")}`;
      }
    }
    return cmd;
  }, [activeScenario, currentActiveFlags]);

  const fullCommand = computeCommand();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSimulate = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
    }, 350);
  };

  if (!activeScenario) return null;

  const outputLines = activeScenario.getOutput(currentActiveFlags, isEn);

  return (
    <div className="interactive-terminal-card">
      {/* Header & Scenario Selection Tabs */}
      <div className="interactive-terminal-topbar">
        <div className="interactive-terminal-tabs-wrap">
          {scenarios.map((sc) => {
            const isActive = sc.id === activeScenario.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setActiveScenarioId(sc.id);
                  handleSimulate();
                }}
                className={`interactive-terminal-tab ${isActive ? "is-active" : ""}`}
              >
                {sc.badge && (
                  <span
                    className={`interactive-terminal-tab-badge ${
                      sc.badge.variant ? `is-${sc.badge.variant}` : ""
                    }`}
                  >
                    {isEn ? sc.badge.en : sc.badge.fr}
                  </span>
                )}
                <span>{isEn ? sc.tabLabel.en : sc.tabLabel.fr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description & Interactive Option Switches */}
      <div className="interactive-terminal-desc-bar">
        <div className="interactive-terminal-desc-content">
          <strong className="interactive-terminal-scenario-title">
            {isEn ? activeScenario.title.en : activeScenario.title.fr}
          </strong>
          <p className="interactive-terminal-scenario-text">
            {isEn ? activeScenario.description.en : activeScenario.description.fr}
          </p>
        </div>

        {/* Flag Checkboxes / Toggles if available */}
        {activeScenario.availableFlags && activeScenario.availableFlags.length > 0 && (
          <div className="interactive-terminal-flags-group">
            <span className="interactive-terminal-flags-label">
              {isEn ? "Options & Arguments:" : "Options & Arguments :"}
            </span>
            <div className="interactive-terminal-flags-list">
              {activeScenario.availableFlags.map((flagItem) => {
                const isChecked = currentActiveFlags.includes(flagItem.flag);
                return (
                  <button
                    key={flagItem.id}
                    type="button"
                    onClick={() => toggleFlag(flagItem.flag)}
                    className={`interactive-terminal-flag-chip ${isChecked ? "is-checked" : ""}`}
                    title={isEn ? flagItem.descEn : flagItem.descFr}
                  >
                    <span className="flag-checkbox-indicator">
                      {isChecked ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : null}
                    </span>
                    <code>{flagItem.flag}</code>
                    <span className="flag-label">{isEn ? flagItem.labelEn : flagItem.labelFr}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Terminal Window */}
      <div className="interactive-terminal-window">
        {/* Terminal Header */}
        <div className="interactive-terminal-header">
          <div className="terminal-dots">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>

          <div className="interactive-terminal-window-title">
            <span>{title || "terminal — bobine-cli"}</span>
          </div>

          <div className="interactive-terminal-header-actions">
            <button
              type="button"
              className="terminal-copy-btn"
              onClick={handleCopy}
              title={isEn ? "Copy command" : "Copier la commande"}
              aria-label={isEn ? "Copy command" : "Copier la commande"}
            >
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{isEn ? "Copied" : "Copié"}</span>
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>{isEn ? "Copy" : "Copier"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className={`interactive-terminal-body ${isExecuting ? "is-animating" : ""}`}>
          {/* Command Prompt Line (Clickable to re-execute) */}
          <div
            className="interactive-terminal-cmd-row is-clickable"
            onClick={handleSimulate}
            role="button"
            tabIndex={0}
            title={isEn ? "Click to run command" : "Cliquer pour exécuter la commande"}
          >
            <span className="interactive-terminal-user-host">fanta@wyse:~$</span>
            <span className="interactive-terminal-cmd-text">{fullCommand}</span>
            <span className="terminal-cursor" />
          </div>

          {/* Output Lines */}
          <div className="interactive-terminal-output">
            {outputLines.map((line, idx) => {
              let lineClass = "terminal-line--stdout";
              let prefix = "";

              if (line.type === "prompt") {
                lineClass = "terminal-line--prompt";
              } else if (line.type === "success") {
                lineClass = "terminal-line--success";
                prefix = "✓ ";
              } else if (line.type === "warn") {
                lineClass = "terminal-line--warn";
                prefix = "⚠ ";
              } else if (line.type === "error") {
                lineClass = "terminal-line--error";
                prefix = "✗ ";
              } else if (line.type === "info") {
                lineClass = "terminal-line--info";
                prefix = "▸ ";
              } else if (line.type === "dim") {
                lineClass = "terminal-line--dim";
              } else if (line.type === "json") {
                lineClass = "terminal-line--json";
              }

              return (
                <div key={idx} className={`terminal-output-line ${lineClass}`}>
                  {prefix && <span className="line-symbol-prefix">{prefix}</span>}
                  <span>{line.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
