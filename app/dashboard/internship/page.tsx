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
  RadioIcon
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

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  manual: { label: "Elite Program", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  ai_serpapi: { label: "AI — Google Internships", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  ai_tavily: { label: "AI — Web Search", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
};

const WORK_MODE_ICONS: Record<string, any> = {
  Remote: Wifi01Icon,
  "On-site": Building02Icon,
  Hybrid: GlobalIcon,
};

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────
interface InternshipCardProps { job: any }

function InternshipCard({ job }: InternshipCardProps) {
  const src = SOURCE_LABELS[job.source] || SOURCE_LABELS.manual;
  const ModeIcon = WORK_MODE_ICONS[job.workMode] || GlobalIcon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-[#0d0d0d] border border-white/[0.06] rounded-[2rem] p-5 sm:p-7 hover:border-primary/30 hover:shadow-[0_0_40px_rgba(37,99,235,0.08)] transition-all relative overflow-hidden w-full"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex flex-col xl:flex-row xl:items-start gap-5 w-full">
        <div className="flex gap-4 items-start min-w-0 flex-1">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 text-neutral-500 group-hover:border-primary/20 group-hover:text-primary transition-all">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="w-8 h-8 object-contain" />
            ) : (
              <HugeiconsIcon icon={Building02Icon} size={20} variant="stroke" strokeWidth={1.5} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-headline font-black text-white leading-none group-hover:text-primary transition-colors break-words">
                {job.title}
              </h3>
              <span className={`text-[9px] font-black px-2 py-1 rounded-lg border uppercase tracking-widest whitespace-nowrap text-sky-400 border-sky-500/30 bg-sky-500/5`}>
                Internship
              </span>
              <span className={`text-[9px] font-bold px-2 py-1 rounded-lg border uppercase tracking-widest whitespace-nowrap ${src.color}`}>
                {src.label}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-3">
              <span className="flex items-center gap-1.5 text-neutral-400 truncate max-w-[200px]">
                <HugeiconsIcon icon={Building02Icon} size={11} className="text-neutral-600 flex-shrink-0" variant="stroke" strokeWidth={1.5} />
                <span className="truncate">{job.company}</span>
              </span>
              <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                <HugeiconsIcon icon={Location01Icon} size={11} className="text-primary/50 flex-shrink-0" variant="stroke" strokeWidth={1.5} />
                <span className="truncate">{job.location}</span>
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <HugeiconsIcon icon={ModeIcon} size={11} className="text-neutral-600 flex-shrink-0" variant="stroke" strokeWidth={1.5} />{job.workMode}
              </span>
              {job.salary && (
                <span className="flex items-center gap-1.5 text-emerald-400 whitespace-nowrap">
                  <HugeiconsIcon icon={Money01Icon} size={11} className="flex-shrink-0" variant="stroke" strokeWidth={1.5} />{job.salary}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-neutral-700 whitespace-nowrap">
                <HugeiconsIcon icon={Time02Icon} size={11} className="flex-shrink-0" variant="stroke" strokeWidth={1.5} />{timeAgo(job.createdAt)}
              </span>
            </div>

            <p className="text-neutral-600 text-[12px] leading-relaxed line-clamp-2 break-words">
              {job.description}
            </p>

            {job.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {job.tags.slice(0, 5).map((tag: string) => (
                  <span key={tag} className="text-[9px] font-black text-neutral-500 bg-white/[0.02] border border-white/[0.06] px-2.5 py-1 rounded-md uppercase tracking-widest hover:text-neutral-300 transition-colors whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex xl:flex-col items-center xl:items-end justify-between xl:justify-start gap-3 pt-4 xl:pt-0 border-t border-white/[0.04] xl:border-0 xl:flex-shrink-0">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-primary hover:text-white text-black px-6 sm:px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl flex items-center gap-2 group/apply whitespace-nowrap"
          >
            Apply Now
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="group-hover/apply:translate-x-1 transition-transform" variant="stroke" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────
// FILTER SIDEBAR
// ────────────────────────────────────────────────────────────
interface FilterState {
  q: string;
  workMode: string;
  experienceLevel: string;
  location: string;
  tags: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (k: keyof FilterState, v: string) => void;
  onSearch: () => void;
  onAiSearch: () => void;
  loading: boolean;
  aiLoading: boolean;
}

function FilterSidebar({ filters, onChange, onSearch, onAiSearch, loading, aiLoading }: FilterSidebarProps) {
  const selectCls = "w-full bg-[#111] border border-white/[0.07] rounded-xl px-4 py-3 text-xs font-bold text-white appearance-none focus:outline-none focus:border-primary/50 transition-all";
  const inputCls = "w-full bg-[#111] border border-white/[0.07] rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-neutral-700 focus:outline-none focus:border-primary/50 transition-all";
  const labelCls = "block text-[9px] font-black uppercase tracking-[0.15em] text-neutral-600 mb-2";

  return (
    <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-6">
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-[2rem] p-7 space-y-6 sticky top-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <HugeiconsIcon icon={FilterIcon} size={16} variant="stroke" strokeWidth={1.5} />
          </div>
          <h3 className="font-headline font-black text-white tracking-tight">Arena Filters</h3>
        </div>

        <div>
           <label className={labelCls}>Field of Interest</label>
           <div className="relative">
             <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-700" variant="stroke" strokeWidth={1.5} />
             <input
               type="text"
               className={inputCls + " pl-9"}
               placeholder="Frontend, Product..."
               value={filters.q}
               onChange={e => onChange("q", e.target.value)}
               onKeyDown={e => e.key === "Enter" && onSearch()}
             />
           </div>
        </div>

        <div>
          <label className={labelCls}>Preferred Location</label>
          <div className="relative">
            <HugeiconsIcon icon={Location01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-700" variant="stroke" strokeWidth={1.5} />
            <input
              type="text"
              className={inputCls + " pl-9"}
              placeholder="India, Remote, UK..."
              value={filters.location}
              onChange={e => onChange("location", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Program Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {["Remote", "Hybrid", "On-site"].map(mode => (
              <button
                key={mode}
                onClick={() => onChange("workMode", filters.workMode === mode ? "" : mode)}
                className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  filters.workMode === mode
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/30"
                    : "bg-[#111] border-white/[0.06] text-neutral-600 hover:text-white hover:border-white/20"
                }`}
              >
                {mode.split('-')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.05] space-y-3">
          <button
            onClick={onSearch}
            disabled={loading}
            className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? <HugeiconsIcon icon={Loading01Icon} size={16} className="animate-spin" variant="stroke" strokeWidth={1.5} /> : <HugeiconsIcon icon={Search01Icon} size={16} variant="stroke" strokeWidth={1.5} />}
            Search Portal
          </button>

          <button
            onClick={onAiSearch}
            disabled={aiLoading}
            className="w-full py-4 bg-gradient-to-r from-primary to-violet-600 text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/30 disabled:opacity-50 relative overflow-hidden group/ai"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/ai:translate-x-[100%] transition-transform duration-700" />
            {aiLoading ? <HugeiconsIcon icon={Loading01Icon} size={16} className="animate-spin" variant="stroke" strokeWidth={1.5} /> : <HugeiconsIcon icon={SparklesIcon} size={16} variant="stroke" strokeWidth={1.5} />}
            {aiLoading ? "AI Discovery Active..." : "Deploy AI Agent"}
          </button>
        </div>
      </div>
    </aside>
  );
}

// ────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────
export default function InternshipPortalPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    q: "", workMode: "", experienceLevel: "", location: "", tags: ""
  });

  const updateFilter = (k: keyof FilterState, v: string) => {
    setFilters(prev => ({ ...prev, [k]: v }));
  };

  const searchPlatform = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      params.set("type", "Internship");
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
    } catch {
      toast.error("Search failed.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/jobs?type=Internship&limit=20");
        const data = await res.json();
        setJobs(data.jobs || []);
        setTotal(data.total || 0);
      } catch {}
      finally { setLoading(false); }
    };
    loadInitial();
  }, []);

  const aiSearch = async () => {
    if (!filters.q && !filters.location) {
      toast.error("Please enter a role or location to search.");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("/api/jobs/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: filters.q,
          type: "Internship",
          workMode: filters.workMode || "Any",
          location: filters.location,
          tags: filters.tags,
        }),
      });
      const data = await res.json();
      if (data.jobs?.length > 0) {
        setJobs(prev => {
          const ids = new Set(prev.map((j: any) => j._id));
          const fresh = data.jobs.filter((j: any) => !ids.has(j._id));
          return [...fresh, ...prev];
        });
        setTotal(prev => prev + data.jobs.length);
        toast.success(`AI discovered ${data.jobs.length} new opportunities!`);
      } else {
        toast.error("AI found no new results.");
      }
    } catch {
      toast.error("AI Search failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ q: "", workMode: "", experienceLevel: "", location: "", tags: "" });
    // Trigger reset search immediately using initial fetch logic
    const resetSearch = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/jobs?type=Internship&limit=20");
        const data = await res.json();
        setJobs(data.jobs || []);
        setTotal(data.total || 0);
      } catch {}
      finally { setLoading(false); }
    };
    resetSearch();
  };

  const hasFilters = Object.values(filters).some(v => v);

  return (
    <div className="space-y-10 w-full overflow-x-hidden pb-20">
      {/* Hero */}
      <section className="relative bg-[#0a0a0a] border border-white/[0.06] rounded-[3rem] p-10 lg:p-16 overflow-hidden text-center shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_-20%,rgba(37,99,235,0.12),transparent_60%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2.5 mb-8 px-5 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
            <HugeiconsIcon icon={RadioIcon} size={12} className="animate-pulse" variant="stroke" strokeWidth={1.5} />
            Global Internship Intelligence Network
          </div>
          <h1 className="text-4xl lg:text-6xl font-headline font-black text-white tracking-tight leading-none mb-6 font-['Plus_Jakarta_Sans']">
            Bridge the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">Skill Gap</span>
          </h1>
          <p className="text-neutral-500 text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Discover 100% verified internships or activate AI to scan the live web for student opportunities across the globe.
          </p>
        </div>
      </section>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start w-full min-w-0">
        <FilterSidebar
          filters={filters}
          onChange={updateFilter}
          onSearch={searchPlatform}
          onAiSearch={aiSearch}
          loading={loading}
          aiLoading={aiLoading}
        />

        <div className="flex-1 min-w-0 overflow-hidden space-y-6">
          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 ml-2">
              <span className="text-[9px] text-neutral-600 uppercase tracking-widest font-bold">Targeted:</span>
              {Object.entries(filters).filter(([, v]) => v).map(([k, v]) => (
                <span key={k} className="inline-flex items-center gap-2 text-[10px] font-bold text-neutral-400 bg-[#111] border border-white/[0.07] px-3 py-1.5 rounded-xl">
                  {v}
                  <button onClick={() => updateFilter(k as keyof FilterState, "")} className="text-neutral-600 hover:text-white">
                    <HugeiconsIcon icon={Cancel01Icon} size={10} variant="stroke" strokeWidth={1.5} />
                  </button>
                </span>
              ))}
              <button onClick={clearFilters} className="text-[9px] text-neutral-700 hover:text-white uppercase tracking-widest font-bold underline underline-offset-2 ml-2">
                Clear filters
              </button>
            </div>
          )}

          <div className="flex justify-between items-center px-2">
            <h2 className="text-white font-headline font-black text-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {aiLoading ? "AI Scraping Public Index..." : "Program Stream"}
              {!loading && !aiLoading && <span className="text-neutral-700 font-bold ml-2">({total})</span>}
            </h2>
          </div>

          <div className="space-y-4">
            {loading || aiLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-[#0d0d0d] border border-white/[0.06] rounded-[2rem] p-7 flex flex-col xl:flex-row gap-5 animate-pulse">
                     <div className="w-14 h-14 bg-white/5 rounded-2xl" />
                     <div className="flex-1 space-y-3 pt-2">
                        <div className="h-4 bg-white/5 w-1/3 rounded" />
                        <div className="h-3 bg-white/5 w-1/2 rounded" />
                     </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-24 bg-[#0d0d0d] border border-dashed border-white/[0.06] rounded-[3rem] text-center space-y-4">
                <HugeiconsIcon icon={ZapIcon} size={32} className="mx-auto text-neutral-800" variant="stroke" strokeWidth={1.5} />
                <p className="text-neutral-500 font-black text-lg uppercase tracking-tight">Arena is Silent</p>
                <button
                  onClick={aiSearch}
                  className="px-8 py-3 bg-primary/10 border border-primary/20 text-primary rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/10"
                >
                  Start Discovery Agent
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="space-y-4">
                  {jobs.map((job: any) => (
                    <InternshipCard key={job._id} job={job} />
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
