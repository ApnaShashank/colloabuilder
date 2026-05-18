"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Terminal, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  Info, 
  Code2, 
  Loader2,
  MessageCircle,
  History,
  Send,
  User as UserIcon,
  Trophy,
  X
} from "lucide-react";
import SkeletonComponent from "@/components/ui/Skeleton";
import { formatDistanceToNow } from "date-fns";

type PracticeLanguage = "javascript" | "python";
type PracticeTab = "description" | "discussions" | "submissions";

interface PracticeProblem {
  _id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  description: string;
  examples?: { input: string; output: string; explanation?: string }[];
  constraints?: string[];
  starterCode?: Record<PracticeLanguage, string>;
}

interface DiscussionItem {
  _id: string;
  userAvatar?: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface SubmissionItem {
  _id: string;
  status: string;
  submittedAt: string;
  language: string;
  runtime: string;
  memory: string;
}

export default function ProblemEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [problem, setProblem] = useState<PracticeProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<PracticeLanguage>("javascript");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionItem | null>(null);
  const [activeTab, setActiveTab] = useState<PracticeTab>("description");
  const [discussions, setDiscussions] = useState<DiscussionItem[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [newDiscussion, setNewDiscussion] = useState("");
  const [postingDiscussion, setPostingDiscussion] = useState(false);

  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await fetch(`/api/problems`);
        const data = await res.json();
        const found = (data.problems as PracticeProblem[]).find((p) => p._id === id);
        if (found) {
          setProblem(found);
          setCode(found.starterCode?.[language] || "// Start coding your solution here...");
        }
      } catch (err) {
        console.error("Failed to fetch problem", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [id, language]);

  useEffect(() => {
    if (activeTab === "submissions") {
      fetch(`/api/submissions?problemId=${id}`)
        .then(res => res.json())
        .then(data => setSubmissions(data.submissions || []))
        .catch(console.error);
    } else if (activeTab === "discussions") {
      fetch(`/api/discussions?problemId=${id}`)
        .then(res => res.json())
        .then(data => setDiscussions(data.discussions || []))
        .catch(console.error);
    }
  }, [activeTab, id]);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: id, code, language }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.submission);
        if (activeTab === "submissions") {
          setSubmissions([data.submission, ...submissions]);
        }
      }
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLanguageChange = (nextLanguage: PracticeLanguage) => {
    setLanguage(nextLanguage);
    if (problem) {
      setCode(problem.starterCode?.[nextLanguage] || "");
    }
  };

  const handlePostDiscussion = async () => {
    if (!newDiscussion.trim() || postingDiscussion) return;
    setPostingDiscussion(true);
    try {
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: id, content: newDiscussion }),
      });
      if (res.ok) {
        const data = await res.json();
        setDiscussions([data.discussion, ...discussions]);
        setNewDiscussion("");
      }
    } catch (err) {
      console.error("Failed to post discussion", err);
    } finally {
      setPostingDiscussion(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-8 h-[calc(100vh-140px)] min-h-[700px]">
        <div className="flex gap-8 flex-1">
           <SkeletonComponent className="flex-1 rounded-[2.5rem]" />
           <SkeletonComponent className="flex-1 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="p-6 rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
          <Info size={48} />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Problem Not Found</h2>
        <Link href="/dashboard/practice" className="px-8 py-3 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-primary/90 transition-all">
          Back to Arena
        </Link>
      </div>
    );
  }

  const difficultyStyles: Record<PracticeProblem["difficulty"], string> = {
    Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Hard: "text-red-400 bg-red-400/10 border-red-400/20",
  };
  const examples = problem.examples ?? [];
  const constraints = problem.constraints ?? [];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)] min-h-[700px] font-['Inter']">
      {/* 1. Problem Content Panel */}
      <section className="flex-1 flex flex-col bg-[#0a0a0a] border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        {/* Tab Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.06] bg-black/20 backdrop-blur-md sticky top-0 z-10">
          <div className="flex gap-4">
            {[
              { id: "description", label: "Description", icon: Info },
              { id: "discussions", label: "Discussions", icon: MessageCircle },
              { id: "submissions", label: "Submissions", icon: History },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PracticeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" 
                    : "text-neutral-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon size={14} />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <Link href="/dashboard/practice" className="p-2 rounded-xl hover:bg-white/5 text-neutral-500 transition-all">
            <X size={18} />
          </Link>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === "description" && (
              <motion.div
                key="description"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${difficultyStyles[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                    <div className="flex gap-2">
                      {problem.tags.map((tag: string) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 text-[10px] font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter font-headline leading-tight">
                    {problem.title}
                  </h1>
                </div>

                <div className="prose prose-invert max-w-none text-neutral-400 leading-relaxed text-[15px]">
                  <p className="whitespace-pre-wrap">{problem.description}</p>
                </div>

                {examples.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-600">Examples</h3>
                    {examples.map((ex, idx) => (
                      <div key={idx} className="bg-black/40 border border-white/[0.04] rounded-2xl p-6 space-y-4">
                        <p className="text-[11px] font-black text-primary uppercase">Example {idx + 1}</p>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <span className="text-neutral-500 text-[13px] font-bold min-w-[60px]">Input:</span>
                            <code className="text-white text-[13px] bg-white/5 px-2 py-0.5 rounded">{ex.input}</code>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-neutral-500 text-[13px] font-bold min-w-[60px]">Output:</span>
                            <code className="text-white text-[13px] bg-white/5 px-2 py-0.5 rounded">{ex.output}</code>
                          </div>
                          {ex.explanation && (
                            <div className="flex gap-2">
                              <span className="text-neutral-500 text-[13px] font-bold min-w-[60px]">Reason:</span>
                              <p className="text-neutral-400 text-[13px]">{ex.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {constraints.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-600">Constraints</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {constraints.map((c, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-[13px] text-neutral-500 bg-white/[0.02] p-3 rounded-xl border border-white/[0.03]">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "discussions" && (
              <motion.div
                key="discussions"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="bg-[#111] border border-white/[0.06] rounded-3xl p-6 space-y-4">
                  <textarea
                    value={newDiscussion}
                    onChange={(e) => setNewDiscussion(e.target.value)}
                    placeholder="Share your approach or ask a question..."
                    className="w-full bg-black/40 border border-white/[0.1] rounded-2xl p-4 text-[13px] text-white focus:outline-none focus:border-primary/50 transition-all min-h-[100px] resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] text-neutral-600 font-medium italic">Supports Markdown in the future</p>
                    <button
                      onClick={handlePostDiscussion}
                      disabled={!newDiscussion.trim() || postingDiscussion}
                      className="px-6 py-2.5 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {postingDiscussion ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                      Post Update
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {discussions.length === 0 ? (
                    <div className="text-center py-20 text-neutral-600 space-y-4">
                       <MessageCircle size={40} className="mx-auto opacity-20" />
                       <p className="text-sm font-medium italic">No discussions yet. Be the first to start the fire!</p>
                    </div>
                  ) : (
                    discussions.map((d) => (
                      <div key={d._id} className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {d.userAvatar ? (
                            <img src={d.userAvatar} alt={d.userName} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon size={20} className="text-neutral-700" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-[13px] font-black text-white">{d.userName}</span>
                            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">
                              {formatDistanceToNow(new Date(d.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-[14px] text-neutral-400 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/[0.04] group-hover:border-white/10 transition-colors">
                            {d.content}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "submissions" && (
              <motion.div
                key="submissions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {submissions.length === 0 ? (
                  <div className="text-center py-20 text-neutral-600 space-y-4">
                     <History size={40} className="mx-auto opacity-20" />
                     <p className="text-sm font-medium italic">Your battle history is empty. Time to ship some code.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {submissions.map((s) => (
                      <div key={s._id} className="bg-[#111] border border-white/[0.04] rounded-2xl p-6 flex flex-wrap md:flex-nowrap items-center justify-between gap-6 hover:border-white/10 transition-all group">
                         <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${s.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                               <CheckCircle2 size={18} />
                            </div>
                            <div>
                               <p className={`text-[13px] font-black uppercase tracking-widest ${s.status === 'Accepted' ? 'text-emerald-500' : 'text-red-500'}`}>
                                 {s.status}
                               </p>
                               <p className="text-[10px] font-bold text-neutral-600 uppercase mt-0.5">
                                 {formatDistanceToNow(new Date(s.submittedAt), { addSuffix: true })} • {s.language}
                               </p>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-8">
                            <div className="text-center">
                               <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Runtime</p>
                               <p className="text-white text-[13px] font-bold mt-1">{s.runtime}</p>
                            </div>
                            <div className="text-center">
                               <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Memory</p>
                               <p className="text-white text-[13px] font-bold mt-1">{s.memory}</p>
                            </div>
                            <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-neutral-500 hover:text-white transition-all">
                               <Code2 size={16} />
                            </button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 2. Code Editor Panel */}
      <section className="flex-1 flex flex-col bg-[#050505] border border-white/[0.08] rounded-[3rem] overflow-hidden shadow-2xl relative">
        {/* Editor Header */}
        <div className="px-10 py-6 border-b border-white/[0.08] flex items-center justify-between bg-black/40 backdrop-blur-xl">
           <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-red-500/40" />
                 <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                 <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
              </div>
              <div className="h-4 w-px bg-white/10 mx-2" />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                 <Terminal size={14} className="text-primary" />
                 <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{language}</span>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="flex bg-[#0a0a0a] p-1 rounded-xl border border-white/10">
                {(["javascript", "python"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      language === lang
                        ? "bg-primary text-white shadow-lg"
                        : "text-neutral-500 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {lang === "javascript" ? "JS" : "Python"}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCode(problem.starterCode?.[language] || "")}
                className="p-2.5 rounded-xl text-neutral-500 hover:text-white hover:bg-white/5 transition-all"
                title="Reset Code"
              >
                 <RotateCcw size={16} />
              </button>
              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50"
              >
                 {submitting ? (
                   <>
                     <Loader2 size={14} className="animate-spin" />
                     <span>Processing...</span>
                   </>
                 ) : (
                   <>
                     <Play size={14} fill="currentColor" />
                     <span>Deploy Solution</span>
                   </>
                 )}
              </button>
           </div>
        </div>

        {/* Textarea Editor (Premium Style) */}
        <div className="flex-1 relative group">
           <div className="absolute top-0 left-0 bottom-0 w-12 bg-black/20 border-r border-white/[0.03] flex flex-col items-center pt-8 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <span key={i} className="text-[10px] font-mono text-neutral-800 h-6 leading-6">{i + 1}</span>
              ))}
           </div>
           <textarea
             value={code}
             onChange={(e) => setCode(e.target.value)}
             spellCheck={false}
             className="w-full h-full bg-transparent text-white font-mono text-[14px] p-8 pl-16 resize-none focus:outline-none leading-6 placeholder:opacity-10 selection:bg-primary/30"
             placeholder="// Build your logic here..."
           />
        </div>

        {/* Result Overlay */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="absolute bottom-0 left-0 right-0 p-8 z-20"
            >
              <div className={`rounded-[2.5rem] border p-8 shadow-2xl backdrop-blur-2xl ${
                result.status === 'Accepted' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10' 
                  : 'bg-red-500/10 border-red-500/20 shadow-red-500/10'
              }`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                       <h3 className={`text-2xl font-black uppercase tracking-tighter ${result.status === 'Accepted' ? 'text-emerald-500' : 'text-red-500'}`}>
                         {result.status}
                       </h3>
                       {result.status === 'Accepted' && (
                         <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/20">
                            <Trophy size={12} />
                            <span className="text-[10px] font-black tracking-widest">+100 XP</span>
                         </div>
                       )}
                    </div>
                    <p className="text-neutral-500 text-xs font-medium italic">Production-grade evaluation complete.</p>
                  </div>
                  <button 
                    onClick={() => setResult(null)}
                    className="p-2 rounded-xl hover:bg-white/5 text-neutral-500 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   <div className="bg-black/20 p-4 rounded-2xl border border-white/[0.04]">
                      <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-1">Runtime</p>
                      <p className="text-white text-lg font-black">{result.runtime}</p>
                   </div>
                   <div className="bg-black/20 p-4 rounded-2xl border border-white/[0.04]">
                      <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-1">Memory</p>
                      <p className="text-white text-lg font-black">{result.memory}</p>
                   </div>
                   <div className="bg-black/20 p-4 rounded-2xl border border-white/[0.04]">
                      <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-1">Language</p>
                      <p className="text-white text-lg font-black uppercase">{result.language}</p>
                   </div>
                   <div className="bg-black/20 p-4 rounded-2xl border border-white/[0.04]">
                      <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-1">Status Code</p>
                      <p className={`text-lg font-black ${result.status === 'Accepted' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {result.status === 'Accepted' ? '200' : '403'}
                      </p>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
