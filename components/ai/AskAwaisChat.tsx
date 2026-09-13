'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Send,
  Sparkles,
  ArrowUpRight,
  RotateCcw,
  Bot,
  User,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { LiquidGlassSurface } from '@/components/liquid-glass/LiquidGlassSurface';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'What does Awais specialize in?',
  'Tell me about CareerWise.',
  'How does DevFlow work?',
  'What technologies does Awais use?',
  'What is his educational background?',
  'Can I download his resume?',
];

// Helper to parse simple markdown bold, inline code, and links into JSX
function FormattedMessage({ content }: { content: string }) {
  // Regex to extract markdown links: [label](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  // Split lines
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-xs sm:text-[13px] leading-relaxed break-words font-sans">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Check if line is a standalone markdown link like [VIEW CAREERWISE ↗](url)
        const isStandaloneLink = /^\[([^\]]+)\]\(([^)]+)\)$/.test(trimmed);
        if (isStandaloneLink) {
          const match = trimmed.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (match) {
            const [, label, url] = match;
            const isExternal = url.startsWith('http') || url.startsWith('mailto:');
            return (
              <div key={lineIdx} className="pt-1.5 pb-0.5">
                <a
                  href={url}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noreferrer noopener' : undefined}
                  download={url.endsWith('.pdf') ? 'Mohammad-Awais-Ansari-Resume.pdf' : undefined}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-900 dark:border-[#F5F3EF] bg-neutral-950 dark:bg-[#F5F3EF] text-white dark:text-[#0A0A0A] font-mono-code text-[11px] font-semibold uppercase tracking-wider hover:opacity-85 transition-opacity"
                >
                  <span>{label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            );
          }
        }

        // Check for bullet list item
        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const cleanLine = isBullet ? trimmed.substring(2) : trimmed;

        // Parse inline formatting: links, bold (**text**), inline code (`code`)
        const parts: React.ReactNode[] = [];
        let cursor = 0;
        let match: RegExpExecArray | null;

        // Combined regex for links, bold, code
        const tokenRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`)/g;

        while ((match = tokenRegex.exec(cleanLine)) !== null) {
          if (match.index > cursor) {
            parts.push(cleanLine.substring(cursor, match.index));
          }

          if (match[2] && match[3]) {
            // Link
            const label = match[2];
            const url = match[3];
            const isExternal = url.startsWith('http') || url.startsWith('mailto:');
            parts.push(
              <a
                key={match.index}
                href={url}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer noopener' : undefined}
                className="inline-flex items-center gap-0.5 text-neutral-950 dark:text-[#F5F3EF] font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                <span>{label}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            );
          } else if (match[4]) {
            // Bold
            parts.push(
              <strong key={match.index} className="font-bold text-neutral-950 dark:text-[#F5F3EF]">
                {match[4]}
              </strong>
            );
          } else if (match[5]) {
            // Code
            parts.push(
              <code
                key={match.index}
                className="px-1.5 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800 text-[11px] font-mono-code text-neutral-900 dark:text-[#E0DFDC]"
              >
                {match[5]}
              </code>
            );
          }
          cursor = tokenRegex.lastIndex;
        }

        if (cursor < cleanLine.length) {
          parts.push(cleanLine.substring(cursor));
        }

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-2">
              <span className="text-neutral-400 dark:text-[#666666] select-none text-[10px] mt-1">•</span>
              <div className="flex-1">{parts}</div>
            </div>
          );
        }

        return <div key={lineIdx}>{parts}</div>;
      })}
    </div>
  );
}

export const AskAwaisChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Listen to external open events (e.g. from Navbar)
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setTimeout(() => textareaRef.current?.focus(), 150);
    };

    window.addEventListener('open-ask-ai', handleOpen);
    return () => window.removeEventListener('open-ask-ai', handleOpen);
  }, []);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isStreaming, isOpen]);

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus();
    }
  }, [isOpen]);

  // Submit query
  const handleSend = useCallback(
    async (textToSend?: string) => {
      const userText = (textToSend || input).trim();
      if (!userText || isStreaming) return;

      setError(null);
      setInput('');

      const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
      setMessages(newMessages);
      setIsStreaming(true);

      // Add a placeholder assistant message that will be streamed into
      const assistantMessageIndex = newMessages.length;
      setMessages([...newMessages, { role: 'assistant', content: '' }]);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Request failed with status ${res.status}`);
        }

        if (!res.body) {
          throw new Error('Readable stream not supported by server.');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;

          setMessages((prev) => {
            const updated = [...prev];
            if (updated[assistantMessageIndex]) {
              updated[assistantMessageIndex] = {
                role: 'assistant',
                content: accumulatedText,
              };
            }
            return updated;
          });
        }
      } catch (err: any) {
        console.error('Chat error:', err);
        setError(err.message || 'Unable to connect to Ask Awais AI. Please try again.');
        // Remove empty assistant placeholder if failed completely
        setMessages((prev) => {
          if (prev[assistantMessageIndex]?.content === '') {
            return prev.slice(0, assistantMessageIndex);
          }
          return prev;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [input, isStreaming, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    if (isStreaming) return;
    setMessages([]);
    setError(null);
    setInput('');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <LiquidGlassSurface
            preset="button"
            borderRadius={9999}
            id="ask-ai-launcher-glass"
          >
            <button
              onClick={() => setIsOpen(true)}
              data-cursor="ASK AI"
              aria-label="Open Ask Awais AI assistant"
              className="group inline-flex items-center gap-3 cursor-pointer liquid-glass-floating px-5 py-3.5 text-neutral-950 dark:text-[#F5F3EF] transition-all duration-300"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-mono-code text-[11px] font-semibold uppercase tracking-wider">
                ASK AWAIS AI
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-[#F5F3EF] transition-colors" />
            </button>
          </LiquidGlassSurface>
        </div>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          ref={chatContainerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ask-awais-ai-title"
          className="fixed inset-x-3 bottom-3 top-20 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[440px] sm:h-[620px] max-h-[calc(100vh-2rem)] z-50 flex flex-col overflow-hidden font-sans liquid-glass-modal"
        >
          {/* Header */}
          <div className="p-4 border-b border-neutral-200 dark:border-[#222222] bg-[#F1F0EC]/80 dark:bg-[#141414] flex items-start justify-between gap-3 shrink-0">
            <div>
              <div className="flex items-center gap-2 font-mono-code text-[10px] uppercase tracking-wider text-neutral-500 dark:text-[#A3A3A3] mb-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-neutral-300 dark:border-[#2A2A2A] bg-white dark:bg-[#181818]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>PORTFOLIO ASSISTANT</span>
                </span>
                <span>/ LIVE</span>
              </div>
              <h3
                id="ask-awais-ai-title"
                className="font-mono-code text-sm font-bold text-neutral-950 dark:text-[#F5F3EF] uppercase tracking-tight"
              >
                ASK AWAIS AI
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-[#888888] line-clamp-1 mt-0.5">
                Ask about projects, skills, education, and engineering work.
              </p>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  disabled={isStreaming}
                  aria-label="Reset conversation"
                  title="Reset conversation"
                  className="p-1.5 text-neutral-400 hover:text-neutral-950 dark:hover:text-[#F5F3EF] transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close Ask Awais AI assistant"
                className="p-1.5 text-neutral-400 hover:text-neutral-950 dark:hover:text-[#F5F3EF] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-neutral-800 dark:text-[#E0DFDC]">
            {/* Empty State */}
            {messages.length === 0 && (
              <div className="py-6 space-y-6">
                <div className="p-4 border border-neutral-200 dark:border-[#222222] bg-[#F1F0EC]/60 dark:bg-[#161616] space-y-2">
                  <div className="flex items-center gap-2 font-mono-code text-[11px] font-semibold uppercase text-neutral-950 dark:text-[#F5F3EF]">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>CURIOUS ABOUT SOMETHING?</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-[#A3A3A3] leading-relaxed">
                    Ask me anything about Mohammad Awais Ansari&apos;s technical capabilities, full-stack systems, AI integrations, or university credentials.
                  </p>
                </div>

                <div>
                  <div className="font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase tracking-wider mb-2.5">
                    SUGGESTED INQUIRIES
                  </div>
                  <div className="flex flex-col gap-2">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        disabled={isStreaming}
                        className="text-left p-2.5 text-xs text-neutral-800 dark:text-[#D5D4D0] font-medium flex items-center justify-between group cursor-pointer liquid-glass-node"
                      >
                        <span className="line-clamp-1">{q}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Messages Thread */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 font-mono-code text-[9px] uppercase tracking-wider text-neutral-400 dark:text-[#666666] mb-1">
                  {msg.role === 'user' ? (
                    <>
                      <span>YOU</span>
                      <User className="w-2.5 h-2.5" />
                    </>
                  ) : (
                    <>
                      <Bot className="w-2.5 h-2.5 text-emerald-500" />
                      <span>AWAIS AI</span>
                    </>
                  )}
                </div>

                <div
                  className={`max-w-[90%] p-3.5 rounded-xl border ${
                    msg.role === 'user'
                      ? 'bg-neutral-900 text-white dark:bg-[#1E1E1E] dark:text-[#F5F3EF] border-neutral-900 dark:border-[#333333]'
                      : 'liquid-glass-card text-neutral-900 dark:text-[#E0DFDC]'
                  }`}
                >
                  {msg.content ? (
                    <FormattedMessage content={msg.content} />
                  ) : (
                    isStreaming &&
                    idx === messages.length - 1 && (
                      <div className="flex items-center gap-2 py-1 text-xs font-mono-code text-neutral-500 dark:text-[#A3A3A3]">
                        <span className="tracking-widest uppercase text-[11px] font-semibold">Thinking</span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse [animation-delay:200ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse [animation-delay:400ms]" />
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}

            {/* Error Display */}
            {error && (
              <div className="p-3 border border-red-300 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs space-y-2">
                <p>{error}</p>
                <button
                  onClick={() => handleSend(messages[messages.length - 1]?.content)}
                  className="inline-flex items-center gap-1 font-mono-code text-[11px] font-semibold underline uppercase"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-neutral-200 dark:border-[#222222] bg-[#F1F0EC]/60 dark:bg-[#141414] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="space-y-2"
            >
              <div className="relative flex items-center rounded-xl border border-neutral-300/80 dark:border-[#2A2A2A] bg-white/70 dark:bg-[#181818]/70 focus-within:border-neutral-950 dark:focus-within:border-[#555555] transition-colors">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about projects, stack, or background..."
                  rows={1}
                  maxLength={500}
                  disabled={isStreaming}
                  className="w-full py-2.5 pl-3 pr-10 text-xs sm:text-[13px] bg-transparent text-neutral-950 dark:text-[#F5F3EF] placeholder:text-neutral-400 dark:placeholder:text-[#666666] resize-none outline-none max-h-24 leading-relaxed font-sans"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  aria-label="Send message"
                  className="absolute right-2 p-1.5 rounded-lg bg-neutral-950 dark:bg-[#F5F3EF] text-white dark:text-[#0A0A0A] disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-85 transition-opacity cursor-pointer"
                >
                  {isStreaming ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between font-mono-code text-[9px] text-neutral-400 dark:text-[#666666] px-1">
                <span>Enter to send · Shift+Enter for newline</span>
                {input.length > 300 && <span>{input.length}/500</span>}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
