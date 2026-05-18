import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SmartIcon, 
  UserIcon, 
  CopyIcon, 
  SentIcon,
  Loading01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function AIGuidePage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const token = localStorage.getItem("token");
        const profileRes = await fetch("/api/user/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        
        const name = profileData.success && profileData.user ? profileData.user.name : "Developer";
        
        const greeting = {
          id: '1',
          role: 'ai',
          text: `Hello ${name}, I am Rume AI. How can I help you today?`,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages([greeting]);
      } catch (e) {
        console.error(e);
        const greeting = {
          id: '1',
          role: 'ai',
          text: `Hello Developer, I am Rume AI. How can I help you today?`,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages([greeting]);
      }
    };
    fetchContext();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: currentInput,
          history: messages.filter(m => m.id !== '1').map(m => ({ role: m.role, text: m.text }))
        })
      });
      const data = await res.json();
      
      if (!data.success) throw new Error(data.error);

      // Parse markdown-style code blocks
      const text = data.text;
      const codeRegex = /```(?:[a-z]+)?\n([\s\S]*?)```/g;
      const matches = [...text.matchAll(codeRegex)];
      
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: text.replace(codeRegex, '').trim(),
        code: matches.length > 0 ? matches[0][1].trim() : null,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Error:", err);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "I encountered an error processing your tactical request. Please verify connection.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto h-[calc(100vh-140px)] flex flex-col p-4">
      <section className="mb-6 flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black text-white leading-none font-headline italic uppercase tracking-tighter flex items-center gap-3">
            RUME <span className="text-primary underline decoration-4 underline-offset-8">AI</span>
          </h1>
          <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.3em] ml-1 opacity-70">Advanced Tactical Development Core</p>
        </div>
      </section>

      <div className="flex-1 bg-[#0a0a0a] border border-white/[0.08] rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-3xl">
         <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar scroll-smooth">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                 <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-lg transition-all ${msg.role === 'ai' ? 'bg-primary text-black border-primary shadow-primary/20' : 'bg-white/5 text-neutral-400 border-white/10'}`}>
                    <HugeiconsIcon icon={msg.role === 'ai' ? SmartIcon : UserIcon} size={22} />
                 </div>
                 <div className={`max-w-[90%] md:max-w-[80%] space-y-3 ${msg.role === 'user' ? 'text-right flex flex-col items-end' : ''}`}>
                    <div className={`p-6 md:p-7 rounded-[2rem] border transition-all ${msg.role === 'ai' ? 'bg-[#141414] border-white/5 text-neutral-200' : 'bg-primary text-black border-primary font-medium'}`}>
                       <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${msg.role === 'ai' ? 'italic font-light' : ''}`}>{msg.text}</p>
                       {msg.code && (
                         <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 bg-black/80 text-left shadow-2xl">
                            <div className="bg-white/[0.03] px-5 py-3 border-b border-white/5 flex justify-between items-center text-[9px] font-bold uppercase text-neutral-500 tracking-widest">
                               <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary/50 animate-pulse" /> Code_Output</span>
                               <button onClick={() => copyCode(msg.code)} className="hover:text-white flex items-center gap-2 transition-colors uppercase">Copy</button>
                            </div>
                            <pre className="p-6 overflow-x-auto text-[13px] font-mono text-primary/90 custom-scrollbar-horizontal"><code>{msg.code}</code></pre>
                         </div>
                       )}
                    </div>
                    <span className="text-[9px] font-bold text-neutral-700 uppercase tracking-[0.2em] px-4 italic">{msg.timestamp}</span>
                 </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex gap-6 items-center">
                 <div className="w-12 h-12 rounded-2xl bg-primary text-black flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.5)]"><HugeiconsIcon icon={SmartIcon} size={24} /></div>
                 <div className="flex items-center gap-2 px-6 py-4 bg-[#111] rounded-2xl border border-white/5">
                    <HugeiconsIcon icon={Loading01Icon} className="animate-spin text-primary" size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 italic">Rume is processing...</span>
                 </div>
              </div>
            )}
         </div>

         <div className="p-8 border-t border-white/[0.05] bg-black/40 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto relative group">
               <input 
                type="text" 
                placeholder="Ask Rume anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full bg-[#111] border border-white/5 py-6 pl-10 pr-24 rounded-3xl text-white outline-none focus:border-primary/50 transition-all font-medium text-sm shadow-inner italic"
               />
               <button onClick={handleSend} className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-primary text-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block italic">Transmit</span>
                  <HugeiconsIcon icon={SentIcon} size={20} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
