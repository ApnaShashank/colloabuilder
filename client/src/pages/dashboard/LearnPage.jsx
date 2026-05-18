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
import SkeletonComponent from '../../components/ui/Skeleton';

export default function LearnPage() {
  const [category, setCategory] = useState('html');
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('code');

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
        if (data.lessons.length > 0) {
          setActiveTopic((currentTopic) => currentTopic ?? data.lessons[0].topic);
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
    
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/user/xp", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ amount: 50, reason: `Completed lesson: ${lesson?.title}` })
      });
    } catch {
      console.error("Failed to add XP");
    }

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
      <section className="mb-6 sm:mb-10 flex flex-col gap-4 sm:gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-[0.2em] uppercase border border-primary/20">
              Interactive Learning
            </span>
            {contentLoading && <HugeiconsIcon icon={Loading01Icon} size={14} className="animate-spin text-primary opacity-50" />}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white leading-[0.9] font-headline italic uppercase">
             Code <span className="text-primary opacity-40">Camp</span>
          </h1>
          <p className="text-neutral-500 text-sm max-w-xl">Master the web with production-grade documentation and bite-sized lessons.</p>
        </div>

        <div className="flex bg-[#0a0a0a] p-1.5 rounded-2xl border border-white/[0.06] shadow-2xl backdrop-blur-xl overflow-x-auto scrollbar-hide max-w-full">
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
                    ? 'bg-primary text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 lg:gap-12">
        <aside className="lg:col-span-3 space-y-4 sm:space-y-8">
          <div className="bg-[#0a0a0a] rounded-2xl sm:rounded-[2rem] border border-white/[0.06] p-4 sm:p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <HugeiconsIcon icon={Book02Icon} size={60} className="text-primary rotate-[15deg]" strokeWidth={1.5} />
            </div>
            
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-600 mb-8 px-2">Table of Contents</h3>
            
            <div className="max-h-48 sm:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                         <SkeletonComponent className="w-6 h-3 rounded-full" />
                         <SkeletonComponent className="w-1/2 h-4 rounded-lg" />
                      </div>
                      <SkeletonComponent className="w-4 h-4 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 relative z-10">
                  {topics.map((t) => (
                    <button
                      key={t.topic}
                      onClick={() => setActiveTopic(t.topic)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group/item ${
                        activeTopic === t.topic 
                          ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20' 
                          : 'bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                         <span className={`text-[10px] font-black ${activeTopic === t.topic ? 'text-primary' : 'text-neutral-700'}`}>{String(t.order).padStart(2, '0')}</span>
                         <p className={`text-[13px] font-bold tracking-tight ${activeTopic === t.topic ? 'text-white' : 'text-neutral-500 group-hover/item:text-neutral-300'}`}>
                           {t.title}
                         </p>
                      </div>
                      <HugeiconsIcon icon={ArrowRight01Icon} size={14} className={activeTopic === t.topic ? 'text-primary' : 'text-neutral-800'} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 shadow-lg relative overflow-hidden group">
            <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform">
               <HugeiconsIcon icon={SparklesIcon} size={80} className="text-primary" strokeWidth={1.5} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Roadmap Goal</p>
            <p className="text-[13px] text-white font-bold leading-relaxed">Master {category.toUpperCase()} and earn your first project badge.</p>
          </div>
        </aside>

        <main className="lg:col-span-9 min-h-[400px]">
          <AnimatePresence mode="wait">
            {!lesson || contentLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full bg-[#0a0a0a] rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] border border-white/[0.06] overflow-hidden"
              >
                  <div className="px-4 sm:px-8 lg:px-14 pt-6 sm:pt-10 pb-6 sm:pb-8 border-b border-white/[0.04] space-y-4">
                    <SkeletonComponent className="w-32 h-3 rounded-full" />
                    <SkeletonComponent className="w-2/3 h-10 rounded-xl" />
                  </div>
                  <div className="px-4 sm:px-8 lg:px-14 py-6 sm:py-12 space-y-8">
                    <SkeletonComponent className="w-full h-4 rounded-full" />
                    <SkeletonComponent className="w-5/6 h-4 rounded-full" />
                    <SkeletonComponent className="w-full h-80 rounded-[2rem]" />
                    <SkeletonComponent className="w-3/4 h-32 rounded-[2rem]" />
                  </div>
              </motion.div>
            ) : (
              <motion.div
                key={lesson._id}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0a0a0a] rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] border border-white/[0.06] overflow-hidden shadow-2xl relative"
              >
                <div className="absolute top-8 right-8 z-10 flex bg-black/60 p-1 rounded-xl border border-white/10 backdrop-blur-xl">
                  {['english', 'hinglish'].map((lang) => (
                    <button 
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        language === lang ? 'bg-primary text-black shadow-xl' : 'text-neutral-500 hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <div className="px-4 sm:px-8 lg:px-14 pt-6 sm:pt-10 pb-6 sm:pb-8 border-b border-white/[0.04]">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Unit 0{lesson.order} · {category.toUpperCase()}
                  </p>
                  <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight font-headline italic uppercase">
                    {lesson.title}
                  </h2>
                </div>

                <div className="px-4 sm:px-8 lg:px-14 py-6 sm:py-12 space-y-8 sm:space-y-12">
                  <div className="max-w-3xl">
                    <p className="text-lg lg:text-xl text-neutral-300 leading-[1.6] font-medium italic mb-6">
                      {language === 'english' ? lesson.content.english : lesson.content.hinglish}
                    </p>
                  </div>

                  {lesson.codeSample && (
                    <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.08] bg-black/40 shadow-2xl group relative flex flex-col h-[350px] sm:h-[500px]">
                      <div className="bg-[#111] px-6 py-4 border-b border-white/[0.06] flex justify-between items-center group-hover:bg-[#151515] transition-colors flex-shrink-0">
                        <div className="flex items-center gap-6">
                           <div className="flex gap-2">
                             <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-neutral-500/30"></div>
                           </div>
                           
                           <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 mx-2">
                              <button 
                                onClick={() => setViewMode('code')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                  viewMode === 'code' ? 'bg-primary/20 text-primary border border-primary/20' : 'text-neutral-500 hover:text-white'
                                }`}
                              >
                                <HugeiconsIcon icon={SourceCodeIcon} size={12} />
                                Code
                              </button>
                              {lesson.codeSample.language === 'html' && (
                                <button 
                                  onClick={() => setViewMode('preview')}
                                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                    viewMode === 'preview' ? 'bg-primary/20 text-primary border border-primary/20' : 'text-neutral-500 hover:text-white'
                                  }`}
                                >
                                  <HugeiconsIcon icon={ViewIcon} size={12} />
                                  Preview
                                </button>
                              )}
                           </div>
                        </div>

                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600 font-mono italic hidden sm:block">
                             {lesson.codeSample.filename}
                           </span>
                           
                           <button 
                             onClick={copyCode}
                             className="p-1 px-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all flex items-center gap-2"
                           >
                             {copied ? <HugeiconsIcon icon={Tick02Icon} size={12} className="text-primary" /> : <HugeiconsIcon icon={CopyIcon} size={12} className="text-neutral-500" />}
                             <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                               {copied ? 'Copied' : 'Copy'}
                             </span>
                           </button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-hidden relative">
                         <AnimatePresence mode="wait">
                           {viewMode === 'code' ? (
                             <motion.div
                                key="code"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="h-full overflow-auto custom-scrollbar bg-[#080808] p-8"
                             >
                                <pre className="text-[11px] sm:text-[13px] leading-[1.7] font-mono text-neutral-300">
                                  <code>{lesson.codeSample.code}</code>
                                </pre>
                             </motion.div>
                           ) : (
                             <motion.div
                                key="preview"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="h-full bg-white relative overflow-hidden"
                             >
                                <iframe
                                  srcDoc={lesson.codeSample.code}
                                  className="w-full h-full border-0"
                                  title="HTML Preview"
                                  sandbox="allow-scripts"
                                />
                                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                   <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Preview</span>
                                </div>
                             </motion.div>
                           )}
                         </AnimatePresence>
                      </div>
                    </div>
                  )}

                  <div className="bg-primary/5 p-4 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-primary/10 flex items-start gap-4 sm:gap-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                       <HugeiconsIcon icon={Tick02Icon} size={120} className="text-primary -rotate-12" strokeWidth={1.5} />
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-primary/20 relative z-10">
                      <HugeiconsIcon icon={SparklesIcon} size={24} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-sm font-black text-white mb-2 uppercase tracking-wide">Pro Developer Hint</p>
                      <p className="text-[13px] text-neutral-500 leading-relaxed max-w-2xl">
                        Industry projects depend on structured {category.toUpperCase()}. Master these foundations before moving to dynamic frameworks.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-8 lg:px-14 py-6 sm:py-10 bg-black/40 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                  <button 
                    onClick={handlePrev}
                    disabled={topics.findIndex(t => t.topic === activeTopic) === 0}
                    className="flex items-center gap-3 text-neutral-500 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.2em] group disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-all">
                       <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={1.5} />
                    </div>
                    Previous
                  </button>

                  <div className="flex items-center gap-6">
                    <span className="text-[9px] font-black text-neutral-700 uppercase tracking-[0.3em] font-mono">
                      Validated by Colloabuilder Core
                    </span>
                    <button 
                      onClick={handleNext}
                      disabled={topics.findIndex(t => t.topic === activeTopic) === topics.length - 1}
                      className="px-10 py-4 bg-primary text-black rounded-[1.2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                      Complete & Next
                      <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
