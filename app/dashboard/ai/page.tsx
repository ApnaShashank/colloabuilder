"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SmartIcon, 
  UserIcon, 
  SentIcon,
  Loading01Icon,
  Settings02Icon,
  Add01Icon,
  Message01Icon,
  MoreVerticalIcon,
  Delete02Icon,
  PencilEdit01Icon,
  CheckmarkCircle01Icon,
  Tick01Icon,
  Cancel01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useUser } from "@/context/UserContext";

export default function AIGuidePage() {
  const { user } = useUser();
  const [messages, setMessages] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [persona, setPersona] = useState(user?.aiPersona || "");
  const [savingPersona, setSavingPersona] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [customApiKey, setCustomApiKey] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistoryOnly();
    startNewTalk();
    setCustomApiKey(localStorage.getItem("user_groq_api_key") || "");
  }, []);

  const fetchHistoryOnly = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/ai/history", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setHistory(data.messages.filter((m: any) => m.role === 'user').reverse());
      }
    } catch (e) {
      console.error("Failed to fetch history", e);
    }
  };

  const startNewTalk = () => {
    setMessages([{
      id: 'initial-greeting',
      role: 'ai',
      text: `Hello! How can I help you with your code today?`,
      timestamp: new Date()
    }]);
    setSelectedChatId(null);
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/ai/history", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      fetchHistoryOnly();
      setMenuOpenId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const submitRename = async (id: string) => {
    if (!newTitle.trim()) {
      setRenamingId(null);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/ai/history", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id, newText: newTitle })
      });
      fetchHistoryOnly();
      setRenamingId(null);
      setMenuOpenId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSavePersona = async () => {
    setSavingPersona(true);
    try {
      localStorage.setItem("user_groq_api_key", customApiKey.trim());
      const token = localStorage.getItem("token");
      await fetch("/api/ai/persona", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ persona })
      });
      setIsSettingsOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingPersona(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const textToSend = input;
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const savedKey = localStorage.getItem("user_groq_api_key") || "";
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          ...(savedKey ? { "X-Custom-API-Key": savedKey } : {})
        },
        body: JSON.stringify({
          prompt: textToSend,
          history: messages.filter(m => m.id !== 'initial-greeting').map(m => ({ role: m.role, text: m.text }))
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: data.text,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
      fetchHistoryOnly();
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "Error connecting to AI. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4 p-2">
      
      {/* ── SIDEBAR ── */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 overflow-hidden">
         <button onClick={startNewTalk} className="w-full py-3 bg-white text-black rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all mb-8">
            <HugeiconsIcon icon={Add01Icon} size={14} /> New Talk
         </button>

         <div className="flex-1 overflow-y-auto space-y-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest px-2">Recent History</p>
            <div className="space-y-1">
               {history.slice(0, 15).map((m, i) => (
                 <div 
                   key={m._id || i} 
                   onClick={() => renamingId !== m._id && setSelectedChatId(m._id)}
                   className={`group p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${selectedChatId === m._id ? 'bg-white/10 text-white font-bold border border-white/5' : 'text-neutral-500 hover:bg-white/5 hover:text-white'}`}
                 >
                    {renamingId === m._id ? (
                      <div className="flex items-center gap-2 w-full">
                        <input 
                          autoFocus
                          className="flex-1 bg-white/5 border border-white/10 rounded-md px-2 py-1 text-[11px] text-white outline-none focus:border-white/20"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') submitRename(m._id);
                            if (e.key === 'Escape') setRenamingId(null);
                          }}
                        />
                        <button onClick={() => submitRename(m._id)} className="text-green-500"><HugeiconsIcon icon={Tick01Icon} size={14} /></button>
                        <button onClick={() => setRenamingId(null)} className="text-red-500"><HugeiconsIcon icon={Cancel01Icon} size={14} /></button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 overflow-hidden">
                           <HugeiconsIcon icon={Message01Icon} size={14} className={selectedChatId === m._id ? 'text-white' : 'text-neutral-700'} />
                           <span className="text-[11px] truncate">{m.text}</span>
                        </div>
                        
                        <div className="relative">
                           <button 
                            onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === m._id ? null : m._id); }}
                            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-md transition-all"
                           >
                              <HugeiconsIcon icon={MoreVerticalIcon} size={14} />
                           </button>
                           
                           <AnimatePresence>
                             {menuOpenId === m._id && (
                               <motion.div 
                                 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                 className="absolute right-0 top-full mt-1 w-32 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 p-1"
                               >
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setRenamingId(m._id); setNewTitle(m.text); setMenuOpenId(null); }}
                                    className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg flex items-center gap-2 text-[10px] font-bold text-neutral-400 hover:text-white"
                                  >
                                     <HugeiconsIcon icon={PencilEdit01Icon} size={12} /> Rename
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); deleteHistoryItem(m._id); }}
                                    className="w-full text-left px-3 py-2 hover:bg-red-500/10 rounded-lg flex items-center gap-2 text-[10px] font-bold text-red-500 hover:text-red-400"
                                  >
                                     <HugeiconsIcon icon={Delete02Icon} size={12} /> Delete
                                  </button>
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </div>
                      </>
                    )}
                 </div>
               ))}
               {history.length === 0 && <p className="text-[10px] text-neutral-700 px-3 italic">No history</p>}
            </div>
         </div>

         <div className="mt-auto pt-6 border-t border-white/5">
            <button onClick={() => setIsSettingsOpen(true)} className="w-full p-3 rounded-xl text-neutral-500 hover:text-white transition-all flex items-center gap-3">
               <HugeiconsIcon icon={Settings02Icon} size={16} />
               <span className="text-[11px] font-bold">Settings</span>
            </button>
         </div>
      </aside>

      {/* ── MAIN CHAT ── */}
      <main className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden flex flex-col relative">
         <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white"><HugeiconsIcon icon={SmartIcon} size={18} /></div>
               <h2 className="text-sm font-bold text-white tracking-tight">RUME CORE</h2>
            </div>
         </header>

         <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
            {messages.map((msg, idx) => (
              <motion.div key={msg.id || idx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${msg.role === 'ai' ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] text-neutral-500 border-white/5'}`}><HugeiconsIcon icon={msg.role === 'ai' ? SmartIcon : UserIcon} size={16} /></div>
                 <div className={`max-w-[85%] md:max-w-[75%] space-y-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`px-5 py-3 rounded-2xl ${msg.role === 'ai' ? 'bg-[#111] text-neutral-200 border border-white/5' : 'bg-white text-black font-medium'}`}>
                       <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                 </div>
              </motion.div>
            ))}
            {loading && <div className="flex gap-4 items-center"><div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center animate-pulse"><HugeiconsIcon icon={SmartIcon} size={16} /></div><span className="text-[10px] text-neutral-600 italic">...</span></div>}
         </div>

         <div className="p-4 md:p-6 border-t border-white/5">
            <div className="max-w-3xl mx-auto relative">
               <input type="text" placeholder="Message Rume..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="w-full bg-[#111] border border-white/10 py-4 pl-6 pr-14 rounded-xl text-sm text-white outline-none focus:border-white/20 transition-all" />
               <button onClick={handleSend} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 bg-white text-black rounded-lg hover:bg-neutral-200 transition-all"><HugeiconsIcon icon={SentIcon} size={16} /></button>
            </div>
         </div>
      </main>

      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSettingsOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
               <h3 className="text-xl font-bold text-white mb-6">Settings</h3>
               <div className="space-y-5">
                  <div>
                     <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 block">AI Instructions</label>
                     <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all h-28 custom-scrollbar" value={persona} onChange={(e) => setPersona(e.target.value)} placeholder="E.g., You are an expert system designer. Keep answers concise." />
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Custom Groq API Key (Optional)</label>
                     <input type="password" placeholder="gsk_••••••••••••••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all" value={customApiKey} onChange={(e) => setCustomApiKey(e.target.value)} />
                     <p className="text-[9px] text-neutral-600 mt-2 leading-relaxed">Your key is stored locally on this device only and is used to bypass global limits.</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                     <button onClick={() => setIsSettingsOpen(false)} className="flex-1 py-3 rounded-xl border border-white/5 text-neutral-500 text-xs font-bold hover:bg-white/5 transition-all">Cancel</button>
                     <button onClick={handleSavePersona} disabled={savingPersona} className="flex-[2] py-3 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-all disabled:opacity-50">{savingPersona ? 'Saving...' : 'Save Changes'}</button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
