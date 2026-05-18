"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search01Icon,
  Location01Icon,
  Building02Icon,
  GlobalIcon,
  Money01Icon,
  ArrowRight01Icon,
  SparklesIcon,
  Loading01Icon,
  FilterIcon,
  Cancel01Icon,
  Time02Icon,
  Briefcase02Icon,
  Wifi01Icon,
  Link01Icon,
  SignalIcon,
  ZapIcon,
  StarIcon,
  RadioIcon,
  Award01Icon,
  Calendar01Icon,
  UserGroupIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import Skeleton from "@/components/ui/Skeleton";

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────
interface HackathonCardProps { hackathon: any }

function HackathonCard({ hackathon }: HackathonCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-[#0d0d0d] border border-white/[0.06] rounded-[2rem] p-6 sm:p-8 hover:border-amber-500/30 hover:shadow-[0_0_50px_rgba(245,158,11,0.06)] transition-all relative overflow-hidden w-full"
    >
      {/* Golden accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/0 via-amber-500/60 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex flex-col lg:flex-row lg:items-center gap-8 w-full">
        {/* Left: Branding & Core Info */}
        <div className="flex gap-6 items-start min-w-0 flex-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 text-amber-500 group-hover:border-amber-500/20 group-hover:scale-105 transition-all shadow-inner">
            {hackathon.companyLogo ? (
              <img src={hackathon.companyLogo} alt={hackathon.company} className="w-10 h-10 object-contain" />
            ) : (
              <HugeiconsIcon icon={Award01Icon} size={28} variant="stroke" strokeWidth={1.5} />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
               <h3 className="text-xl sm:text-2xl font-headline font-black text-white leading-tight group-hover:text-amber-500 transition-colors break-words italic uppercase tracking-tighter">
                {hackathon.title}
              </h3>
              <span className="text-[9px] font-black px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 uppercase tracking-[0.2em] shadow-lg shadow-amber-500/10">
                Active_Arena
              </span>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-black text-neutral-600 uppercase tracking-widest">
              <span className="flex items-center gap-2 group-hover:text-neutral-400 transition-colors">
                <HugeiconsIcon icon={Building02Icon} size={14} className="text-neutral-700" variant="stroke" strokeWidth={1.5} />
                {hackathon.company}
              </span>
              <span className="flex items-center gap-2 group-hover:text-neutral-400 transition-colors">
                <HugeiconsIcon icon={Location01Icon} size={14} className="text-neutral-700" variant="stroke" strokeWidth={1.5} />
                {hackathon.location}
              </span>
              <span className="flex items-center gap-2 text-emerald-500 italic">
                <HugeiconsIcon icon={Money01Icon} size={14} variant="stroke" strokeWidth={1.5} />
                {hackathon.salary || "Prize Pool: $5,000+"}
              </span>
            </div>

            <p className="text-neutral-500 text-[13px] leading-relaxed line-clamp-2 font-medium">
              {hackathon.description}
            </p>
          </div>
        </div>

        {/* Right: Timeline & Action */}
        <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-6 pt-6 lg:pt-0 border-t lg:border-t-0 border-white/[0.04]">
           <div className="text-right space-y-1 hidden sm:block">
              <p className="text-[10px] font-black text-neutral-700 uppercase tracking-widest">Deadline</p>
              <p className="text-white font-black text-sm tabular-nums uppercase italic">Ends in 4 Days</p>
           </div>
           
           <a
            href={hackathon.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative px-10 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[12px] transition-all overflow-hidden hover:bg-amber-500 hover:text-white shadow-2xl hover:shadow-amber-500/20 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-3">
              Enter Arena
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="group-hover/btn:translate-x-1 transition-transform" variant="stroke" strokeWidth={1.5} />
            </span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────
export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      try {
        // Fetching with type Hackathon
        const res = await fetch("/api/jobs?type=Hackathon&limit=20");
        const data = await res.json();
        setHackathons(data.jobs || []);
        setTotal(data.total || 0);
      } catch {}
      finally { setLoading(false); }
    };
    loadInitial();
  }, []);

  const aiSearch = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/jobs/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: "global hackathons bounty 2024",
          type: "Hackathon",
          location: "Remote",
        }),
      });
      const data = await res.json();
      if (data.jobs?.length > 0) {
        setHackathons(prev => {
          const ids = new Set(prev.map((j: any) => j._id));
          const fresh = data.jobs.filter((j: any) => !ids.has(j._id));
          return [...fresh, ...prev];
        });
        setTotal(prev => prev + data.jobs.length);
        toast.success(`AI Scout Successful! Discovered ${data.jobs.length} hackathons from the web.`);
      } else {
        toast.error("AI Scout found no new events. Try again later or refine filters.");
      }
    } catch {
      toast.error("AI Discovery failed.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-12 w-full overflow-x-hidden pb-32">
      {/* Hero Section */}
      <section className="relative bg-[#0a0a0a] border border-white/[0.06] rounded-[4rem] p-12 lg:p-20 overflow-hidden shadow-2xl">
        {/* Cinematic Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(245,158,11,0.15),transparent_60%)] pointer-events-none" />
        <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
           <HugeiconsIcon icon={Award01Icon} size={300} variant="stroke" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500 font-black text-[11px] uppercase tracking-[0.3em] shadow-xl"
          >
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Battleground Live Discovery
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-8xl font-headline font-black text-white tracking-tighter leading-[0.9] italic uppercase"
          >
            Compete. Build. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Win Big.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-500 text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Access the world's most prestigious hackathons. Use our AI agent to scan for hidden opportunities and bounty programs.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
             <button 
              onClick={aiSearch}
              disabled={aiLoading}
              className="px-10 py-5 bg-amber-500 text-black rounded-[2rem] font-black uppercase tracking-widest text-[12px] hover:bg-amber-400 transition-all shadow-[0_20px_50px_rgba(245,158,11,0.2)] disabled:opacity-50 flex items-center gap-3 group"
             >
                {aiLoading ? <HugeiconsIcon icon={Loading01Icon} size={18} className="animate-spin" /> : <HugeiconsIcon icon={SparklesIcon} size={18} className="group-hover:rotate-12 transition-transform" />}
                {aiLoading ? "Scanning World Index..." : "Deploy AI Scout"}
             </button>
             <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] font-black uppercase tracking-widest text-[12px] hover:bg-white/10 transition-all flex items-center gap-3 group">
                <HugeiconsIcon icon={Calendar01Icon} size={18} className="text-neutral-500 group-hover:text-white transition-colors" />
                Event Calendar
             </button>
          </motion.div>
        </div>
      </section>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Active Events", val: total.toString(), icon: SignalIcon, color: "text-amber-500" },
           { label: "Total Bounties", val: "$2.4M+", icon: Money01Icon, color: "text-emerald-500" },
           { label: "Arena Slots", val: "1,204", icon: UserGroupIcon, color: "text-blue-500" },
           { label: "New Today", val: "12", icon: ZapIcon, color: "text-violet-500" },
         ].map((stat, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-white/[0.06] p-8 rounded-[2.5rem] space-y-4 hover:border-white/10 transition-colors group">
               <div className={`w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                  <HugeiconsIcon icon={stat.icon} size={20} variant="stroke" strokeWidth={1.5} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-neutral-700 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{stat.val}</p>
               </div>
            </div>
         ))}
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-6 px-4">
         <div className="space-y-2">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Current_Openings</h2>
            <p className="text-[10px] font-black text-neutral-700 uppercase tracking-widest">Showing all verified hackathons from the network</p>
         </div>
         <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] p-1.5 rounded-2xl">
            <button className="px-5 py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest">All Events</button>
            <button className="px-5 py-2.5 text-neutral-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Remote Only</button>
            <button className="px-5 py-2.5 text-neutral-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Big Prize</button>
         </div>
      </div>

      {/* Hackathon Stream */}
      <div className="space-y-6">
        {loading || aiLoading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-white/[0.06] rounded-[3rem] p-8 animate-pulse flex flex-col lg:flex-row gap-8">
                 <div className="w-20 h-20 bg-white/5 rounded-[2rem]" />
                 <div className="flex-1 space-y-4 pt-2">
                    <div className="h-6 bg-white/5 w-1/4 rounded-lg" />
                    <div className="h-4 bg-white/5 w-1/2 rounded-md" />
                    <div className="h-3 bg-white/5 w-3/4 rounded-md" />
                 </div>
              </div>
            ))}
          </div>
        ) : hackathons.length === 0 ? (
          <div className="py-32 bg-[#0d0d0d] border border-dashed border-white/[0.06] rounded-[4rem] text-center space-y-6">
            <div className="w-20 h-20 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mx-auto text-neutral-800">
               <HugeiconsIcon icon={Award01Icon} size={40} />
            </div>
            <div className="space-y-2">
              <p className="text-neutral-500 font-black text-2xl uppercase italic tracking-tighter">The Arena is Quiet</p>
              <p className="text-[11px] text-neutral-700 uppercase tracking-widest max-w-sm mx-auto">No hackathons match your current criteria. Deploy the AI Scout to scan global sources.</p>
            </div>
            <button
              onClick={aiSearch}
              className="px-10 py-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-amber-500 hover:text-white transition-all shadow-xl shadow-amber-500/10"
            >
              Initialize AI Discovery
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-6">
              {hackathons.map((hack: any) => (
                <HackathonCard key={hack._id} hackathon={hack} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
