"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Locale } from "@/lib/i18n";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function BobineChatbot({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = isEn
    ? [
        "What hardware should I buy for my gym?",
        "How is Bobine free with no subscription?",
        "How does automated HDMI-CEC TV power work?",
        "How do I install Bobine on Debian?",
      ]
    : [
        "Quel matériel acheter pour ma salle ?",
        "Pourquoi Bobine est gratuit sans abonnement ?",
        "Comment marche l'allumage TV auto (HDMI-CEC) ?",
        "Comment installer Bobine sur Debian ?",
      ];

  const defaultGreeting = isEn
    ? "Hello! I am the Bobine virtual assistant. How can I help you equip your gym or understand how our open-source video playout works?"
    : "Bonjour ! Je suis l'assistant virtuel de Bobine. Comment puis-je vous aider à équiper votre salle ou à découvrir le fonctionnement de notre régie vidéo open-source ?";

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  async function sendMessage(textToSend?: string) {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMessage: Message = { role: "user", content: messageContent };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          locale,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Erreur de communication avec le serveur.");
      }

      if (!response.body) {
        throw new Error("Flux de réponse indisponible.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamBuffer = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        streamBuffer = `${streamBuffer}${chunk}`;
        const currentText = streamBuffer;

        setMessages((prev) => {
          const list = prev.slice(0, -1);
          return [...list, { role: "assistant", content: currentText }];
        });
      }

    } catch (err: unknown) {
      console.error("Erreur chatbot:", err);
      const errMsg =
        err instanceof Error
          ? err.message
          : isEn
          ? "Sorry, an error occurred while connecting to the assistant."
          : "Désolé, une erreur est survenue lors de la communication avec l'assistant.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ **${errMsg}**`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Bouton d'ouverture flottant */}
      <div className="chatbot-floating-wrapper">
        {!isOpen && (
          <button
            type="button"
            className="chatbot-trigger-btn"
            onClick={() => setIsOpen(true)}
            aria-label={isEn ? "Open Bobine AI Assistant" : "Ouvrir l'assistant IA Bobine"}
          >
            <div className="chatbot-trigger-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 9h8" />
                <path d="M8 13h6" />
              </svg>
            </div>
            <span className="chatbot-trigger-label">
              {isEn ? "Ask Bobine AI" : "Assistant Bobine"}
            </span>
            <span className="chatbot-trigger-dot" />
          </button>
        )}
      </div>

      {/* Fenêtre de discussion */}
      {isOpen && (
        <div className="chatbot-modal" role="dialog" aria-modal="true">
          {/* En-tête */}
          <div className="chatbot-modal__header">
            <div className="chatbot-modal__title-group">
              <div className="chatbot-avatar">
                <span>🐹</span>
                <span className="chatbot-avatar-status" />
              </div>
              <div>
                <h4 className="chatbot-modal__title">
                  {isEn ? "Bobine AI Assistant" : "Assistant IA Bobine"}
                </h4>
                <span className="chatbot-modal__subtitle">
                  {isEn ? "Instant Advice & Hardware Sizing" : "Conseil & Dimensionnement Matériel"}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
              {messages.length > 0 && (
                <button
                  type="button"
                  className="chatbot-header-btn"
                  onClick={() => setMessages([])}
                  title={isEn ? "Reset chat" : "Réinitialiser la conversation"}
                  aria-label={isEn ? "Reset chat" : "Réinitialiser la conversation"}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                className="chatbot-header-btn"
                onClick={() => setIsOpen(false)}
                aria-label={isEn ? "Close" : "Fermer"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Corps de conversation */}
          <div className="chatbot-modal__body">
            {/* Message de bienvenue */}
            <div className="chatbot-message chatbot-message--assistant">
              <div className="chatbot-message__avatar">🐹</div>
              <div className="chatbot-message__bubble">
                <p style={{ margin: 0 }}>{defaultGreeting}</p>
              </div>
            </div>

            {/* Suggestions initiales */}
            {messages.length === 0 && (
              <div className="chatbot-suggestions">
                <span className="chatbot-suggestions__title">
                  {isEn ? "Suggested questions:" : "Questions fréquentes :"}
                </span>
                <div className="chatbot-suggestions__list">
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="chatbot-suggestion-chip"
                      onClick={() => sendMessage(sug)}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages échangés */}
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`chatbot-message chatbot-message--${m.role}`}
              >
                {m.role === "assistant" && (
                  <div className="chatbot-message__avatar">🐹</div>
                )}
                <div className="chatbot-message__bubble">
                  {m.role === "assistant" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  ) : (
                    <p style={{ margin: 0 }}>{m.content}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Indicateur de frappe */}
            {isLoading && (
              <div className="chatbot-message chatbot-message--assistant">
                <div className="chatbot-message__avatar">🐹</div>
                <div className="chatbot-message__bubble chatbot-message__typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Formulaire d'envoi */}
          <div className="chatbot-modal__footer">
            <div className="chatbot-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                className="chatbot-input"
                placeholder={
                  isEn
                    ? "Ask a question (hardware, costs, setup)..."
                    : "Posez votre question (matériel, devis, config)..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                type="button"
                className="chatbot-send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                aria-label={isEn ? "Send" : "Envoyer"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <div className="chatbot-badge-disclaimer">
              {isEn
                ? "Powered by DeepSeek v4 · Free & Sovereign AGPL-3.0"
                : "Alimenté par DeepSeek v4 · Logiciel Libre AGPL-3.0"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
