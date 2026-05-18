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
  Briefcase02Icon,
  Wifi01Icon,
  Link01Icon,
  RadioIcon,
  Clock02Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import Skeleton from "@/components/ui/Skeleton";
import { useUser } from "@/context/UserContext";

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────
function timeAgo(dateStr: string) {
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

const SOURCE_LABELS: any = {
  manual: { label: "Platform Listed", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  ai_serpapi: { label: "AI — Google Jobs", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  ai_tavily: { label: "AI — Web Search", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
};

const TYPE_COLORS: any = {
  "Full-time": "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
  "Part-time": "text-amber-400 border-amber-500/30 bg-amber-500/5",
  Contract: "text-orange-400 border-orange-500/30 bg-orange-500/5",
  Internship: "text-sky-400 border-sky-500/30 bg-sky-500/5",
  Freelance: "text-pink-400 border-pink-500/30 bg-pink-500/5",
};

const WORK_MODE_ICONS: any = {
  Remote: Wifi01Icon,
  "On-site": Building02Icon,
  Hybrid: GlobalIcon,
};

// ────────────────────────────────────────────────────────────
// Components
// ────────────────────────────────────────────────────────────

function JobCard({ job }: { job: any }) {
  const src = SOURCE_LABELS[job.source] || SOURCE_LABELS.manual;
  const ModeIcon = WORK_MODE_ICONS[job.workMode] || GlobalIcon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-[#0d0d0d] border border-white/[0.06] rounded-[2rem] p-5 sm:p-7 hover:border-primary/20 hover:shadow-[0_0_40px_rgba(37,99,235,0.08)] transition-all relative overflow-hidden"
    >
      <div className="flex flex-col xl:flex-row xl:items-start gap-5">
        <div className="flex gap-4 items-start min-w-0 flex-1">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 text-neutral-500 group-hover:border-primary/20 group-hover:text-primary transition-all">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="w-8 h-8 object-contain" />
            ) : (
              <HugeiconsIcon icon={Building02Icon} size={20} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-black text-white italic uppercase group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <span className={`text-[8px] font-black px-2 py-1 rounded-lg border uppercase tracking-widest ${
                TYPE_COLORS[job.type] || "text-neutral-400 border-white/10 bg-white/5"
              }`}>
                {job.type}
              </span>
              <span className={`text-[8px] font-black px-2 py-1 rounded-lg border uppercase tracking-widest ${src.color}`}>
                {src.label}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-3 italic">
              <span className="flex items-center gap-1.5 truncate">
                <HugeiconsIcon icon={Building02Icon} size={11} className="text-neutral-600" />
                {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Location01Icon} size={11} className="text-primary/50" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={ModeIcon} size={11} />{job.workMode}
              </span>
            </div>

            <p className="text-neutral-500 text-[11px] font-black italic uppercase leading-relaxed line-clamp-2">
              {job.description}
            </p>
          </div>
        </div>

        <div className="flex xl:flex-col items-center xl:items-end justify-between gap-3 border-t xl:border-0 border-white/[0.04] pt-4 xl:pt-0">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] italic transition-all shadow-xl shadow-primary/10 flex items-center gap-2"
          >
            Apply Now
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────
export default function CareersPage() {
  const { user, refreshUser } = useUser();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [filters, setFilters] = useState<any>({
    q: "", type: "", workMode: "", experienceLevel: "", location: "", tags: ""
  });

  const searchPlatform = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v as string); });
      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch {
      toast.error("Search failed.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    searchPlatform();
  }, []);

  const aiSearch = async () => {
    if (!filters.q && !filters.tags && !filters.location) {
      toast.error("Role, skill, or location required for AI search.");
      return;
    }

    if (user && user.plan !== "pro" && !user.isAdmin && (user.aiJobSearchCount || 0) >= 3) {
      toast.error("You have reached your limit of 3 free AI searches. Upgrade to Pro for unlimited searches!");
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch("/api/jobs/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      const data = await res.json();
      
      if (res.status === 403 && data.error === "pro_required") {
        toast.error(data.message || "AI Search limit reached! Upgrade to Pro.");
        return;
      }

      if (data.jobs?.length > 0) {
        setJobs(prev => [...data.jobs, ...prev]);
        toast.success(`AI found ${data.jobs.length} new jobs!`);
        await refreshUser(); // Update counts in UI
      } else {
        toast.error("AI found no new results.");
      }
    } catch {
      toast.error("AI Search failed.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <section className="relative bg-[#0d0d0d] border border-white/[0.06] rounded-[3rem] p-10 lg:p-16 overflow-hidden text-center shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.05),transparent_60%)] pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2.5 mb-8 px-5 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
            <HugeiconsIcon icon={RadioIcon} size={12} className="animate-pulse" />
            Live Career Intel Network
          </div>
          <h1 className="text-4xl lg:text-6xl font-headline font-black text-white tracking-tighter leading-tight mb-6 italic uppercase">
            Forge Your <span className="text-primary">Next Phase.</span>
          </h1>
          <p className="text-neutral-500 text-[11px] font-black uppercase tracking-widest italic mb-2">
            Search curated openings or activate AI-powered web search in real time.
          </p>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 space-y-6">
          <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-[2.5rem] p-6 space-y-6 sticky top-6">
            <h3 className="font-headline font-black text-white uppercase italic text-lg mb-4">Filter</h3>
            
            <div className="space-y-4">
               <div>
                 <label className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-2 block">Role</label>
                 <input 
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black text-white uppercase italic tracking-widest focus:border-primary/50 outline-none"
                  placeholder="Software Engineer..."
                  value={filters.q}
                  onChange={e => setFilters({...filters, q: e.target.value})}
                 />
               </div>
               <div>
                 <label className="text-[9px] font-black text-neutral-600 uppercase tracking-widest mb-2 block">Location</label>
                 <input 
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black text-white uppercase italic tracking-widest focus:border-primary/50 outline-none"
                  placeholder="Remote / Bengaluru..."
                  value={filters.location}
                  onChange={e => setFilters({...filters, location: e.target.value})}
                 />
               </div>
            </div>

            <button 
              onClick={searchPlatform}
              disabled={loading}
              className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] italic shadow-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <HugeiconsIcon icon={Loading01Icon} size={14} className="animate-spin" /> : <HugeiconsIcon icon={Search01Icon} size={14} />}
              Search Intel
            </button>

            <button 
              onClick={aiSearch}
              disabled={aiLoading}
              className="w-full py-4 bg-primary text-black rounded-2xl font-black uppercase tracking-widest text-[10px] italic shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              {aiLoading ? <HugeiconsIcon icon={Loading01Icon} size={14} className="animate-spin" /> : <HugeiconsIcon icon={SparklesIcon} size={14} />}
              AI Web Search
            </button>
            {user && user.plan !== "pro" && !user.isAdmin && (
              <p className="text-[8px] font-bold text-center text-neutral-500 uppercase tracking-wider mt-2.5">
                 AI Searches: {user.aiJobSearchCount || 0} / 3 Used (Free Tier)
              </p>
            )}
          </div>
        </aside>

        <div className="flex-1 space-y-4">
          {loading || aiLoading ? (
             [1,2,3,4].map(i => <Skeleton key={i} className="h-40 rounded-[2rem]" />)
          ) : (
            jobs.map(job => <JobCard key={job._id} job={job} />)
          )}
          {jobs.length === 0 && !loading && (
            <div className="text-center py-20 text-neutral-600 font-black uppercase tracking-widest italic">
               No results found. Try a different search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
