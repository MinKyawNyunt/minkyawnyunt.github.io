
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

const generateSessionId = () => {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

export const NeuralInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi! I am Min's personal ai assistant. How can I help you today?` }
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

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("tests", process.env.API_KEY)
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
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
      const botMsg: string = data.output ?? data.text ?? data.message ?? data.response ?? JSON.stringify(data);
      setMessages(prev => [...prev, { role: 'model', text: botMsg }]);
    } catch (err) {
      console.log(process.env.API_KEY, err)
      setMessages(prev => [...prev, { role: 'model', text: `CONNECTION ERROR: ${(err as Error).message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-16 h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 flex items-center justify-between border-b border-cyan-500/30 pb-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white uppercase flex items-center gap-3">
            <Bot className="text-cyan-400" /> AI ASSISTANT
          </h2>
          <p className="font-mono text-xs text-cyan-500 mt-1">SESSION: {sessionId}</p>
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-4 bg-cyan-400 animate-pulse" />
          <div className="w-1 h-4 bg-cyan-400/50 animate-pulse [animation-delay:200ms]" />
          <div className="w-1 h-4 bg-cyan-400/20 animate-pulse [animation-delay:400ms]" />
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto space-y-6 mb-6 pr-4 custom-scrollbar"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 w-8 h-8 border ${msg.role === 'user' ? 'border-pink-500' : 'border-cyan-500'} flex items-center justify-center bg-black`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-pink-500" /> : <Bot className="w-4 h-4 text-cyan-500" />}
              </div>
              <div className={`p-4 font-rajdhani text-lg ${
                msg.role === 'user' 
                  ? 'bg-pink-500/10 border border-pink-500/20 text-pink-100' 
                  : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-100'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-3 bg-cyan-500/10 border border-cyan-500/20 p-4 animate-pulse">
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                <span className="font-mono text-sm text-cyan-400">DECRYPTING RESPONSE...</span>
             </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ENTER INQUIRY..."
          className="w-full bg-black/50 border border-cyan-500/30 p-4 pr-16 font-mono text-cyan-400 placeholder:text-cyan-900 focus:outline-none focus:border-cyan-400 transition-colors"
        />
        <button 
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-2 bottom-2 px-4 bg-cyan-500 text-black hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      
      <p className="mt-4 text-[10px] font-mono text-gray-600 text-center uppercase tracking-widest">
        WARNING: ALL COMMUNICATIONS ARE LOGGED FOR QUALITY ASSURANCE
      </p>
    </div>
  );
};
