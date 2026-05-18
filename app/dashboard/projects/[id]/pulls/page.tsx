"use client";

import { motion } from "framer-motion";
import { 
  GitMerge, 
  FileEdit, 
  GitPullRequest, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Radio 
} from "lucide-react";

export default function ProjectPullsPage() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
  };

  const pulls = [
    { 
      id: "1042", 
      title: "Feat: Add support for real-time terminal sync", 
      branch: "feature/terminal", 
      target: "main",
      author: "Alex Rodriguez", 
      time: "4h ago", 
      status: "Open",
      checks: "passed",
      comments: 12,
      img: "https://i.pravatar.cc/100?u=1"
    },
    { 
      id: "1041", 
      title: "Fix: Memory leak in graph visualization container", 
      branch: "bugfix/leak-vis", 
      target: "main",
      author: "Cyan Nexus", 
      time: "1d ago", 
      status: "Draft",
      checks: "failing",
      comments: 3,
      img: "https://i.pravatar.cc/100?u=2"
    },
    { 
      id: "1039", 
      title: "Docs: Update contribution guidelines for v2.4.0", 
      branch: "docs/v2.4-updates", 
      target: "main",
      author: "Sarah Miller", 
      time: "yesterday", 
      status: "Merged",
      checks: "passed",
      comments: 0,
      img: "https://i.pravatar.cc/100?u=12"
    }
  ];

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-10 py-8 px-4"
    >
      {/* Header */}
      <motion.div variants={itemVars} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-8">
        <div>
          <p className="text-primary font-headline font-black text-[10px] uppercase tracking-[0.3em] mb-2 italic">Merge Orchestration</p>
          <h1 className="text-5xl font-black font-headline tracking-tighter text-white uppercase italic">Pull <span className="text-primary not-italic">Requests</span></h1>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-surface/50 border border-white/5 text-[10px] font-headline font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">
            Filter: Active
          </button>
          <button className="flex-1 md:flex-none premium-gradient text-white px-8 py-3 rounded-xl font-headline font-black uppercase italic tracking-tighter text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_5px_15px_rgba(99,102,241,0.2)] border border-white/10">
            Initial Merge Request
          </button>
        </div>
      </motion.div>

      {/* PR List */}
      <div className="space-y-4">
        {pulls.map((pr) => {
          const StatusIcon = pr.status === 'Merged' ? GitMerge : pr.status === 'Draft' ? FileEdit : GitPullRequest;
          return (
            <motion.div 
              key={pr.id}
              variants={itemVars}
              className={`group bg-surface/20 border border-white/5 p-6 rounded-2xl border-l-4 transition-all hover:bg-surface/40 hover:translate-x-1 cursor-pointer flex items-start gap-6 ${
                pr.status === 'Merged' ? 'border-l-secondary' :
                pr.status === 'Draft' ? 'border-l-slate-800' :
                'border-l-primary'
              }`}
            >
              <StatusIcon size={24} className={`mt-1 flex-shrink-0 ${
                pr.status === 'Merged' ? 'text-secondary' : 
                pr.status === 'Draft' ? 'text-slate-600' : 'text-primary'
              }`} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-2 flex-wrap">
                  <h3 className="text-xl font-black font-headline text-white italic uppercase tracking-tight group-hover:text-primary transition-colors truncate">
                    {pr.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-md border text-[9px] font-headline font-black uppercase tracking-widest whitespace-nowrap italic ${
                    pr.status === 'Merged' ? 'bg-secondary/10 border-secondary/20 text-secondary' :
                    pr.status === 'Draft' ? 'bg-zinc-900 border-white/5 text-slate-600' :
                    'bg-primary/10 border-primary/20 text-primary'
                  }`}>
                    {pr.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-6 text-[10px] font-headline font-black uppercase tracking-[0.2em] text-slate-600 flex-wrap italic">
                  <div className="flex items-center gap-2">
                    <span className="text-primary">{pr.branch}</span>
                    <ArrowRight size={12} className="text-slate-800" />
                    <span className="text-white">{pr.target}</span>
                  </div>
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-800"></span>
                  <span>#{pr.id} by <span className="text-slate-400 group-hover:text-white transition-colors underline decoration-white/5 underline-offset-4">{pr.author}</span></span>
                  <span className="text-slate-700">{pr.time}</span>
                </div>

                <div className="flex items-center gap-6 mt-6 flex-wrap">
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/50 border border-white/5 text-[9px] font-headline font-black uppercase tracking-[0.2em] transition-all group-hover:border-primary/20 ${
                    pr.checks === 'passed' ? 'text-primary' : 'text-red-500'
                  }`}>
                    {pr.checks === 'passed' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {pr.checks === 'passed' ? 'Checks Optimal' : 'Checks Failing'}
                  </div>
                  {pr.comments > 0 && (
                    <div className="flex items-center gap-2 text-[9px] font-headline font-black uppercase tracking-[0.2em] text-slate-600">
                      <MessageSquare size={14} />
                      {pr.comments} Synced
                    </div>
                  )}
                </div>
              </div>

              <div className="flex -space-x-3 flex-shrink-0 hidden sm:flex">
                <img className="w-10 h-10 rounded-xl border-2 border-background object-cover grayscale group-hover:grayscale-0 transition-all shadow-xl hover:scale-110" src={pr.img} alt="Ava" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sidebar-style Info Panel for Desktop */}
      <motion.section variants={itemVars} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/5">
        <div className="bg-surface/30 p-8 rounded-3xl border border-white/5">
          <h4 className="text-[10px] font-headline font-black uppercase tracking-[0.3em] text-slate-600 mb-6 italic">Nexus Insights</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-headline font-black uppercase text-white tracking-widest">Merge Velocity</span>
              <span className="text-primary font-black italic text-xs">92%</span>
            </div>
            <div className="h-1 bg-background rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "92%" }}
                className="h-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              ></motion.div>
            </div>
            <p className="text-[9px] font-headline font-black uppercase tracking-widest text-slate-700 mt-2 italic">2.4h MTTR average cycle</p>
          </div>
        </div>
        
        <div className="bg-surface/30 p-8 rounded-3xl border border-white/5">
          <h4 className="text-[10px] font-headline font-black uppercase tracking-[0.3em] text-secondary mb-6 italic">Elite Directives</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed font-headline uppercase tracking-tighter">
            Unlock priority Nexus reviews and automated merge orchestration with Pro.
          </p>
          <button className="text-white font-headline font-black uppercase text-[10px] tracking-[0.2em] mt-6 flex items-center gap-2 hover:text-primary transition-all group">
            Analyze Directives <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-surface/20 p-8 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center">
          <Radio size={32} className="text-slate-800 mb-4 animate-pulse" />
          <p className="text-[10px] font-headline font-black uppercase tracking-widest text-slate-700">Broadcasting Network Telemetry...</p>
        </div>
      </motion.section>
    </motion.div>
  );
}
