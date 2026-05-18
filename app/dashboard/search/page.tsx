"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { 
  Search01Icon, 
  CodeIcon,
  UserGroupIcon,
  FolderOpenIcon, 
  Award01Icon,
  FilterIcon, 
  Cancel01Icon, 
  ArrowRight01Icon,
  SourceCodeIcon, 
  Briefcase02Icon, 
  Loading01Icon 
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Skeleton from "@/components/ui/Skeleton";
const typeIcons: Record<string, any> = {
  Problem: SourceCodeIcon,
  Project: FolderOpenIcon,
  Team: UserGroupIcon,
  User: Award01Icon,
};

const typeColors: Record<string, string> = {
  Problem: "text-primary bg-primary/10 border-primary/20",
  Project: "text-secondary bg-secondary/10 border-secondary/20",
  Team: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  User: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

const filterTabs = ["All", "Problems", "Projects", "Teams", "Users"];

export default function GlobalSearchPage() {
  return (
    <Suspense fallback={<div>Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json().catch(() => ({ results: [] }));
        if (res.ok) setResults(data.results);
      } catch (err) {
        console.error("Search failed");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const filtered = results.filter((r) => {
    return activeFilter === "All" || r.type === activeFilter.slice(0, -1);
  });

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-[11px] font-black text-neutral-600 uppercase tracking-[0.3em] mb-1">Platform Hub</p>
          <h1 className="font-headline font-black text-4xl text-white tracking-tight">Global Search</h1>
        </motion.div>

        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative mb-6"
        >
          <HugeiconsIcon icon={Search01Icon} size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500" variant="stroke" strokeWidth={1.5} />
          {(query || loading) && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {loading && <HugeiconsIcon icon={Loading01Icon} size={16} className="text-primary animate-spin" variant="stroke" strokeWidth={1.5} />}
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-neutral-600 hover:text-white transition-colors"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={16} variant="stroke" strokeWidth={1.5} />
                </button>
              )}
            </div>
          )}
          <input
            type="text"
            placeholder="Search problems, projects, teams, users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            suppressHydrationWarning
            autoFocus
            className="w-full bg-[#0e0e0e] border border-white/[0.08] rounded-2xl pl-12 pr-12 py-4 text-white text-base placeholder:text-neutral-800 focus:outline-none focus:border-primary/30 focus:bg-[#111] transition-all shadow-lg"
          />
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 flex-wrap mb-8"
        >
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeFilter === tab
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-white/[0.02] border-white/[0.06] text-neutral-700 hover:text-white hover:border-white/20"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="popLayout">
          {query && !loading && filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 text-neutral-800"
            >
               <HugeiconsIcon icon={Search01Icon} size={40} className="mx-auto mb-4 opacity-10" variant="stroke" strokeWidth={1.5} />
              <p className="font-bold text-sm uppercase tracking-widest">No results found</p>
            </motion.div>
          ) : !query && !loading ? (
             <motion.div
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-neutral-800 border border-dashed border-white/[0.05] rounded-3xl"
            >
              <HugeiconsIcon icon={SourceCodeIcon} size={32} className="mx-auto mb-4 opacity-10" variant="stroke" strokeWidth={1.5} />
              <p className="font-black text-[10px] uppercase tracking-[0.2em]">Enter search terms to find content</p>
            </motion.div>
          ) : loading ? (
            <div className="space-y-3">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-5 p-5 bg-[#0e0e0e] border border-white/[0.06] rounded-2xl">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-1/3 h-4" />
                    <Skeleton className="w-1/4 h-3" />
                  </div>
                  <Skeleton className="w-8 h-8 rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((result, i) => {
                const Icon = typeIcons[result.type];
                return (
                  <motion.a
                    key={result._id || result.id || i}
                    href={result.type === 'Problem' ? `/dashboard/practice/${result._id}` : `/dashboard/${result.type.toLowerCase()}s/${result._id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="flex items-center gap-5 p-5 bg-[#0e0e0e] border border-white/[0.06] rounded-2xl hover:border-white/20 hover:bg-[#111] transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${typeColors[result.type]}`}>
                      <HugeiconsIcon icon={Icon} size={16} variant="stroke" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate group-hover:text-primary transition-colors">{result.name || result.title || result.username}</p>
                      <p className="text-neutral-600 text-[10px] uppercase font-black tracking-widest mt-1 truncate">
                        {result.type} {result.difficulty ? `· ${result.difficulty}` : ""} {result.language ? `· ${result.language}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-neutral-800 group-hover:text-primary group-hover:translate-x-0.5 transition-all" variant="stroke" strokeWidth={1.5} />
                    </div>
                  </motion.a>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

