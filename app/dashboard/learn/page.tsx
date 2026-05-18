"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CodeIcon, 
  SparklesIcon, 
  ArrowRight01Icon, 
  ArrowLeft01Icon, 
  SourceCodeIcon, 
  CopyIcon, 
  Tick02Icon, 
  Book02Icon, 
  Loading01Icon, 
  ViewIcon, 
  FlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useUser } from "@/context/UserContext";

const SkeletonComponent = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-white/5 ${className}`} />
);

export default function LearnPage() {
  const { user } = useUser();
  const [category, setCategory] = useState('html');
  const [topics, setTopics] = useState<any[]>([]);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('code');
  const [isPro, setIsPro] = useState(false);

  const isLocked = isPro && (!user || (user.plan !== "pro" && !user.isAdmin));

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/lessons?category=${category}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.lessons) {
        setTopics(data.lessons);
        setIsPro(data.isPro || false);
        if (data.lessons.length > 0) {
          setActiveTopic(data.lessons[0].topic);
        }
      }
    } catch (err) {
      console.error("Failed to fetch topics", err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const fetchLesson = useCallback(async () => {
    if (!activeTopic) return;
    setContentLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/lessons?category=${category}&topic=${activeTopic}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.lesson) {
        setLesson(data.lesson);
      }
    } catch (err) {
      console.error("Failed to fetch lesson", err);
    } finally {
      setContentLoading(false);
    }
  }, [category, activeTopic]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  const copyCode = () => {
    if (lesson?.codeSample?.code) {
      navigator.clipboard.writeText(lesson.codeSample.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNext = async () => {
    const currentIndex = topics.findIndex(t => t.topic === activeTopic);
    if (currentIndex < topics.length - 1) {
      setActiveTopic(topics[currentIndex + 1].topic);
      setViewMode('code');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    const currentIndex = topics.findIndex(t => t.topic === activeTopic);
    if (currentIndex > 0) {
      setActiveTopic(topics[currentIndex - 1].topic);
      setViewMode('code');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'html', label: 'HTML', icon: CodeIcon },
    { id: 'css', label: 'CSS', icon: Book02Icon },
    { id: 'javascript', label: 'JS', icon: SourceCodeIcon },
    { id: 'react', label: 'React', icon: SparklesIcon },
    { id: 'nextjs', label: 'Next.js', icon: FlashIcon },
    { id: 'tailwind', label: 'Tailwind', icon: FlashIcon },
  ];

  return (
    <div className="max-w-[1500px] mx-auto pb-24">
      <section className="mb-6 sm:mb-10 flex flex-col gap-4">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-white font-headline italic uppercase">
             CODE <span className="text-primary opacity-40">CAMP</span>
          </h1>
        </div>

        <div className="flex bg-[#0a0a0a] p-1.5 rounded-2xl border border-white/[0.06] overflow-x-auto scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                   setCategory(cat.id);
                   setActiveTopic(null);
                }}
                className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 transition-all whitespace-nowrap ${
                  category === cat.id 
                    ? 'bg-primary text-black' 
                    : 'text-neutral-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <HugeiconsIcon icon={Icon} size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <div className="bg-[#0a0a0a] rounded-3xl border border-white/[0.06] p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-600 mb-8">Table of Contents</h3>
            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => <SkeletonComponent key={i} className="h-12 rounded-2xl" />)
              ) : (
                topics.map((t) => (
                  <button
                    key={t.topic}
                    onClick={() => setActiveTopic(t.topic)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                      activeTopic === t.topic 
                        ? 'bg-primary/10 border-primary/30' 
                        : 'bg-transparent border-transparent hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                       <span className={`text-[10px] font-black ${activeTopic === t.topic ? 'text-primary' : 'text-neutral-700'}`}>{String(t.order).padStart(2, '0')}</span>
                       <p className={`text-[13px] font-bold tracking-tight ${activeTopic === t.topic ? 'text-white' : 'text-neutral-500'}`}>
                         {t.title}
                       </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        <main className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {isLocked ? (
               <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-gradient-to-br from-[#0d0d0d] to-black rounded-[2.5rem] border border-amber-500/20 p-12 text-center shadow-[0_0_50px_rgba(245,158,11,0.05)] relative overflow-hidden"
               >
                 <div className="absolute top-0 right-0 bg-amber-500 text-black font-black text-[8px] uppercase tracking-widest px-6 py-2 rounded-bl-3xl">
                     PRO REQUIRED
                 </div>
                 <div className="max-w-md mx-auto space-y-8 py-10">
                    <div className="w-20 h-20 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                       <HugeiconsIcon icon={FlashIcon} size={36} className="animate-pulse" />
                    </div>
                    <div className="space-y-3">
                       <h2 className="text-3xl font-black text-white uppercase italic tracking-tight font-headline">
                          Unlock <span className="text-primary">{category.toUpperCase()} CAMP.</span>
                       </h2>
                       <p className="text-neutral-500 text-xs font-black uppercase tracking-wider leading-relaxed">
                          {category.toUpperCase()} and other advanced platform curricula are reserved for Pro System members.
                       </p>
                    </div>
                    
                    <div className="pt-6 border-t border-white/5 space-y-4">
                       <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider leading-relaxed">
                          Upgrade now to instantly unlock full access to advanced lessons, unlimited AI Job search and unrestricted practice arena challenges.
                       </p>
                       <a 
                          href="/dashboard/settings" 
                          className="inline-block px-12 py-4 bg-primary text-black rounded-xl font-black uppercase tracking-widest text-xs italic shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                       >
                          Upgrade to Pro
                       </a>
                    </div>
                 </div>
               </motion.div>
            ) : !lesson || contentLoading ? (
              <div className="bg-[#0a0a0a] rounded-3xl border border-white/[0.06] p-10 space-y-8">
                <SkeletonComponent className="w-1/3 h-10 rounded-xl" />
                <SkeletonComponent className="w-full h-80 rounded-[2rem]" />
              </div>
            ) : (
              <motion.div
                key={lesson._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0a0a] rounded-3xl border border-white/[0.06] overflow-hidden shadow-2xl"
              >
                <div className="px-14 pt-10 pb-8 border-b border-white/[0.04]">
                  <h2 className="text-4xl font-black text-white tracking-tight font-headline italic uppercase">
                    {lesson.title}
                  </h2>
                </div>
                <div className="px-14 py-12 space-y-12">
                  <p className="text-xl text-neutral-300 leading-relaxed italic">
                    {language === 'english' ? lesson.content.english : lesson.content.hinglish}
                  </p>

                  {lesson.codeSample && (
                    <div className="rounded-3xl overflow-hidden border border-white/[0.08] bg-black/40 shadow-2xl flex flex-col h-[500px]">
                      <div className="bg-[#111] px-6 py-4 border-b border-white/[0.06] flex justify-between items-center">
                        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                           <button onClick={() => setViewMode('code')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${viewMode === 'code' ? 'bg-primary/20 text-primary' : 'text-neutral-500'}`}>Code</button>
                           {lesson.codeSample.language === 'html' && <button onClick={() => setViewMode('preview')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${viewMode === 'preview' ? 'bg-primary/20 text-primary' : 'text-neutral-500'}`}>Preview</button>}
                        </div>
                        <button onClick={copyCode} className="p-1 px-3 rounded-lg bg-white/5 text-[9px] font-bold uppercase text-neutral-400">{copied ? 'Copied' : 'Copy'}</button>
                      </div>
                      <div className="flex-1 overflow-auto bg-[#080808] p-8">
                         {viewMode === 'code' ? (
                            <pre className="text-[13px] font-mono text-neutral-300"><code>{lesson.codeSample.code}</code></pre>
                         ) : (
                            <iframe srcDoc={lesson.codeSample.code} className="w-full h-full border-0 bg-white" />
                         )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="px-14 py-10 bg-black/40 border-t border-white/[0.04] flex justify-between items-center">
                  <button onClick={handlePrev} className="text-neutral-500 hover:text-white uppercase font-black text-[11px]">Previous</button>
                  <button onClick={handleNext} className="px-10 py-4 bg-primary text-black rounded-xl font-black uppercase text-xs">Complete & Next</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
