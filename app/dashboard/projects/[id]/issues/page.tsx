"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  CircleDot, 
  CheckCircle2, 
  MessageSquare 
} from "lucide-react";

export default function ProjectIssuesPage() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  const issues = [
    { 
      id: "Nexus-2491", 
      title: "Memory leak in real-time sync worker", 
      author: "Alex Rodriguez", 
      time: "2h ago", 
      labels: ["Bug", "Critical"], 
      comments: 12,
      priority: "high"
    },
    { 
      id: "Nexus-2488", 
      title: "Add support for custom WASM runtimes", 
      author: "Sarah Miller", 
      time: "1d ago", 
      labels: ["Enhancement", "Wasm"], 
      comments: 5,
      priority: "medium"
    },
    { 
      id: "Nexus-2485", 
      title: "Update contribution guidelines for next cycle", 
      author: "Alpha Nexus", 
      time: "3d ago", 
      labels: ["Docs"], 
      comments: 2,
      priority: "low"
    },
    { 
      id: "Nexus-2482", 
      title: "Critical: Secret exposure in logs", 
      author: "Security Auditor", 
      time: "4d ago", 
      labels: ["Security"], 
      comments: 28,
      priority: "critical"
    }
  ];

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-10 py-8 px-4"
    >
      {/* Search and Filters */}
      <motion.div variants={itemVars} className="bg-surface/30 border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4 backdrop-blur-sm">
        <div className="flex-1 flex items-center bg-background rounded-xl px-4 py-3 border border-white/5 group focus-within:border-primary/50 transition-all w-full">
          <Search size={16} className="text-slate-600 mr-3" />
          <input 
            type="text" 
            placeholder="Search all reports in Nexus_Alpha..." 
            className="bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-700 font-headline font-black uppercase tracking-widest text-[10px] w-full"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-surface/50 border border-white/5 text-[10px] font-headline font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">
            Labels
          </button>
          <button className="flex-1 md:flex-none px-6 py-3 premium-gradient text-white font-headline font-black uppercase italic tracking-tighter text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_5px_15px_rgba(99,102,241,0.2)] border border-white/10">
            Open Report
          </button>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div variants={itemVars} className="flex gap-6 items-center px-4">
        <button className="flex items-center gap-2 text-[10px] font-headline font-black uppercase tracking-widest text-primary italic">
          <CircleDot size={14} className="text-primary" />
          14 Active
        </button>
        <button className="flex items-center gap-2 text-[10px] font-headline font-black uppercase tracking-widest text-slate-600 hover:text-white transition-all">
          <CheckCircle2 size={14} className="text-slate-700" />
          283 Resolved
        </button>
      </motion.div>

      {/* Issues List */}
      <div className="space-y-4">
        {issues.map((issue) => (
          <motion.div 
            key={issue.id}
            variants={itemVars}
            className={`group bg-surface/20 border border-white/5 p-6 rounded-2xl border-l-[6px] transition-all hover:bg-surface/40 hover:translate-x-1 cursor-pointer flex items-start gap-6 ${
              issue.priority === 'critical' ? 'border-l-red-500/80' :
              issue.priority === 'high' ? 'border-l-primary' :
              issue.priority === 'medium' ? 'border-l-secondary' :
              'border-l-slate-800'
            }`}
          >
            <CircleDot size={18} className={`mt-1 flex-shrink-0 ${
              issue.priority === 'critical' ? 'text-red-500' : 'text-primary'
            }`} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-2 flex-wrap">
                <h3 className="text-xl font-black font-headline text-white italic uppercase tracking-tight group-hover:text-primary transition-colors truncate">
                  {issue.title}
                </h3>
                <div className="flex gap-2">
                  {issue.labels.map(label => (
                    <span key={label} className="px-3 py-1 rounded-md bg-background/50 border border-white/10 text-[9px] font-headline font-black uppercase tracking-widest text-slate-600 group-hover:text-primary transition-colors italic">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-headline font-black uppercase tracking-widest text-slate-600 italic">
                <span className="text-primary/70">{issue.id}</span>
                <span>Created {issue.time} by <span className="text-slate-400 group-hover:text-white transition-colors underline decoration-white/5 underline-offset-4">{issue.author}</span></span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-700 group-hover:text-primary transition-colors px-3 py-1.5 rounded-lg bg-surface/50 border border-transparent group-hover:border-primary/20">
              <MessageSquare size={14} />
              <span className="text-[10px] font-headline font-black">{issue.comments}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVars} className="flex justify-center pt-10">
        <button className="px-10 py-4 rounded-xl border border-white/5 bg-surface/30 text-[10px] font-headline font-black uppercase tracking-widest text-slate-600 hover:text-white hover:bg-surface/50 transition-all italic border border-white/10">
          Load Sequential Data
        </button>
      </motion.div>
    </motion.div>
  );
}
