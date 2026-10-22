import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  Loader2,
  Lock,
  Send,
  Sparkles,
  User,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { SectionShell } from '../components/SectionShell';
import { Reveal } from '../components/Reveal';

const generateSessionId = () =>
  `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const SUGGESTIONS = [
  "What is Min's tech stack?",
  'Tell me about his biggest project.',
  'What roles is he looking for?',
  'Summarize his experience.',
];

export const NeuralInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hi! I'm Min's personal AI assistant. Ask me anything about his experience, projects or stack.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState<string>(generateSessionId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (raw: string) => {
    const userMsg = raw.trim();
    if (!userMsg || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('chatInput', userMsg);
      formData.append('sessionId', sessionId);

      const res = await fetch('https://n8n.safenetonlinestore.com/webhook/ai-assistant', {
        method: 'POST',
        headers: {
          'ai-assistant-key': process.env.API_KEY ?? '',
        },
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const botMsg: string =
        data.output ?? data.text ?? data.message ?? data.response ?? JSON.stringify(data);
      setMessages((prev) => [...prev, { role: 'model', text: botMsg }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: `CONNECTION ERROR: ${(err as Error).message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = input;
    setInput('');
    void sendMessage(value);
  };

  return (
    <SectionShell
      id="ai"
      kicker="LIVE NEURAL LINK // N8N POWERED"
      title="Neural"
      accentWord="Interface"
      description="Skip the scrolling. Ask my AI assistant directly about my work, stack or availability — it answers from my archive in real time."
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.45fr]">
        {/* Info column */}
        <Reveal className="h-full">
          <div className="flex h-full flex-col justify-between gap-8 border border-white/[0.08] bg-[#070a12]/80 p-7">
            <div>
              <span className="flex h-12 w-12 items-center justify-center border border-cyan-400/30 bg-cyan-400/[0.06]">
                <Sparkles className="h-5 w-5 text-cyan-300" />
              </span>
              <h3 className="mt-6 font-orbitron text-xl font-bold uppercase leading-snug text-white">
                A direct line to
                <br />
                <span className="text-cyan-300">the archive</span>
              </h3>
              <p className="mt-4 font-rajdhani text-[15px] leading-relaxed text-gray-400">
                This assistant is connected to a live knowledge base covering my career,
                projects and technical background. No forms, no waiting for a reply.
              </p>

              <div className="mt-7 space-y-3">
                <p className="font-mono text-[9px] tracking-[0.24em] text-gray-600">
                  // SUGGESTED QUERIES
                </p>
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendMessage(suggestion)}
                    disabled={isLoading}
                    className="group flex w-full items-center justify-between gap-3 border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 text-left transition-all hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="font-rajdhani text-sm text-gray-300 group-hover:text-white">
                      {suggestion}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-gray-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.08] pt-4">
              <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.16em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                UPLINK ACTIVE
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.14em] text-gray-600">
                <Lock className="h-3 w-3" />
                ENCRYPTED
              </span>
            </div>
          </div>
        </Reveal>

        {/* Chat terminal */}
        <Reveal delay={120} className="h-full">
          <div className="flex h-[560px] flex-col border border-cyan-400/20 bg-[#05070f]/95 shadow-[0_30px_100px_-40px_rgba(0,243,255,0.25)]">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center border border-cyan-400/30 bg-cyan-400/[0.08]">
                  <Bot className="h-4 w-4 text-cyan-300" />
                </span>
                <div>
                  <p className="font-orbitron text-[11px] font-bold tracking-[0.18em] text-white">
                    AI ASSISTANT
                  </p>
                  <p className="mt-0.5 font-mono text-[8px] tracking-[0.14em] text-gray-600">
                    {sessionId.slice(0, 24)}...
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-400/70" />
                <span className="h-2 w-2 rounded-full bg-amber-400/70" />
                <span className="h-2 w-2 rounded-full bg-emerald-400/80 animate-pulse" />
              </div>
            </div>

            <div
              ref={scrollRef}
              className="custom-scrollbar flex-1 space-y-5 overflow-y-auto px-5 py-6"
            >
              {messages.map((message, index) => {
                const isUser = message.role === 'user';
                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex max-w-[85%] gap-2.5 ${
                        isUser ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border ${
                          isUser
                            ? 'border-fuchsia-400/40 bg-fuchsia-400/[0.08]'
                            : 'border-cyan-400/40 bg-cyan-400/[0.08]'
                        }`}
                      >
                        {isUser ? (
                          <User className="h-3.5 w-3.5 text-fuchsia-300" />
                        ) : (
                          <Bot className="h-3.5 w-3.5 text-cyan-300" />
                        )}
                      </span>
                      <div
                        className={`whitespace-pre-wrap border px-4 py-3 font-rajdhani text-[15px] leading-relaxed ${
                          isUser
                            ? 'border-fuchsia-400/20 bg-fuchsia-500/[0.08] text-fuchsia-50'
                            : 'border-cyan-400/15 bg-cyan-500/[0.06] text-cyan-50/90'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-3 border border-cyan-400/15 bg-cyan-500/[0.06] px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
                    <span className="font-mono text-[10px] tracking-[0.16em] text-cyan-300/80">
                      DECRYPTING RESPONSE...
                    </span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-white/[0.08] p-4">
              <div className="relative">
                <label htmlFor="neural-input" className="sr-only">
                  Ask the AI assistant a question
                </label>
                <input
                  id="neural-input"
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="ENTER INQUIRY..."
                  autoComplete="off"
                  className="w-full border border-cyan-400/20 bg-black/40 py-3.5 pl-4 pr-14 font-mono text-xs tracking-[0.08em] text-cyan-100 placeholder:text-gray-600 focus:border-cyan-400/60 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                  className="absolute bottom-2 right-2 top-2 flex items-center justify-center bg-cyan-400 px-4 text-black transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-center font-mono text-[8px] uppercase tracking-[0.18em] text-gray-600">
                All communications are logged for quality assurance
              </p>
            </form>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
};
