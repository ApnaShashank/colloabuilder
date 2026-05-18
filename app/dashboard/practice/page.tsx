"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  SourceCodeIcon, 
  ArrowRight01Icon,
  ChartLineData01Icon,
  Award01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

const SkeletonComponent = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-white/5 ${className}`} />
);

export default function PracticeArenaPage() {
  const { user } = useUser();
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };

        const [probRes, statRes] = await Promise.all([
          fetch("/api/problems", { headers }),
          fetch("/api/submissions/stats", { headers })
        ]);
        
        if (probRes.ok) {
          const data = await probRes.json().catch(() => ({ problems: [] }));
          setProblems(data.problems || []);
        }
        
        if (statRes.ok) {
          const statData = await statRes.json().catch(() => ({ stats: null }));
          setStats(statData.stats);
        }
      } catch (err) {
        console.error("Failed to fetch practice data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const difficultyStyles: any = {
    Easy: { color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
    Medium: { color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
    Hard: { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
  };

  const filteredProblems = filter === "All" 
    ? problems 
    : problems.filter(p => p.difficulty === filter);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-1 sm:p-2">
      {/* ── HEADER ── */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/[0.04] pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            Coding Practice
          </h1>
          <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">
            Solve challenges, verify your algorithmic skills, and track performance.
          </p>
        </div>
      </section>

      {user && user.plan !== "pro" && !user.isAdmin && (
        <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0_0_30px_rgba(245,158,11,0.02)]">
           <div className="space-y-1">
              <p className="text-white font-black text-xs uppercase tracking-wider italic flex items-center gap-2">
                 ⚡ Practice Arena Quota Allowance
              </p>
              <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-wide">
                 Allowance Used: {(user as any).practiceCount || 0} / 5 Free attempts. Hard challenges require PRO system access.
              </p>
           </div>
           <a href="/dashboard/settings" className="px-6 py-2.5 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest italic rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/10">
              Upgrade to Pro
           </a>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar stats */}
        <div className="lg:col-span-1">
          <div className="bg-[#090909] border border-white/[0.05] rounded-xl p-6 space-y-6 shadow-lg">
             <div className="flex items-center gap-2">
                <HugeiconsIcon icon={ChartLineData01Icon} size={14} className="text-white/60" />
                <h3 className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Performance Metrics</h3>
             </div>

             {loading ? (
                <div className="space-y-4">
                  <SkeletonComponent className="w-full h-8 rounded-lg" />
                  <SkeletonComponent className="w-full h-8 rounded-lg" />
                </div>
             ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                     <div className="flex justify-between items-end">
                        <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Solved</p>
                        <p className="text-xs font-black text-white">{stats?.solvedCount || 0}/{problems.length || 0}</p>
                     </div>
                     <div className="h-1 bg-white/[0.02] rounded-full overflow-hidden p-0.5 border border-white/[0.05]">
                        <div className="h-full bg-white rounded-full" style={{ width: `${problems.length > 0 ? ((stats?.solvedCount || 0) / problems.length) * 100 : 0}%` }}></div>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
                     <div className="text-center flex-1">
                        <p className="text-base font-black text-amber-400">{stats?.rank || '---'}</p>
                        <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Rank</p>
                     </div>
                     <div className="text-center flex-1 border-l border-white/[0.04]">
                        <p className="text-base font-black text-cyan-400">{stats?.streak || 0}d</p>
                        <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Streak</p>
                     </div>
                  </div>
                </div>
             )}
          </div>
        </div>

        {/* Problems list */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex bg-[#090909] border border-white/[0.05] p-1.5 rounded-xl max-w-sm">
            {["All", "Easy", "Medium", "Hard"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-white text-black" : "text-neutral-500 hover:text-white"}`}
              >
                 {f}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {loading ? (
              [1, 2, 3].map(i => <SkeletonComponent key={i} className="h-24 rounded-xl" />)
            ) : filteredProblems.length === 0 ? (
              <div className="py-16 text-center bg-[#090909] border border-white/[0.05] rounded-xl">
                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-600">No problems found</p>
              </div>
            ) : (
              filteredProblems.map((prob) => {
                const style = difficultyStyles[prob.difficulty] || difficultyStyles.Easy;
                const isHard = prob.difficulty?.toLowerCase() === "hard";
                const isLocked = isHard && (!user || (user.plan !== "pro" && !user.isAdmin));

                const cardContent = (
                  <motion.div 
                    whileHover={!isLocked ? { x: 4 } : {}}
                    className={`flex items-center gap-6 p-5 bg-[#090909] border rounded-xl shadow-md transition-all ${
                       isLocked 
                          ? "border-amber-500/20 opacity-70 hover:opacity-80" 
                          : "border-white/[0.05] hover:border-white/10"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-lg border ${
                       isLocked 
                          ? "bg-amber-500/5 border-amber-500/20 text-amber-500" 
                          : `${style.bg} ${style.border} ${style.color}`
                    } flex items-center justify-center flex-shrink-0`}>
                      <HugeiconsIcon icon={SourceCodeIcon} size={18} className={isLocked ? "text-amber-500" : style.color} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                         <h4 className="text-sm font-bold text-white transition-colors truncate">{prob.title}</h4>
                         <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                            isLocked 
                               ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
                               : `${style.bg} ${style.border} ${style.color}`
                         }`}>
                            {isLocked ? "★ PRO ONLY" : prob.difficulty}
                         </span>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                         {prob.tags.slice(0, 3).map((tag: string) => <span key={tag} className="text-[8px] text-neutral-600 font-bold uppercase">#{tag}</span>)}
                      </div>
                    </div>

                    {isLocked ? (
                       <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
                         🔒
                       </div>
                    ) : (
                       <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/[0.05] group-hover:bg-white group-hover:text-black transition-all">
                         <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-white group-hover:text-black" />
                       </div>
                    )}
                  </motion.div>
                );

                return isLocked ? (
                   <div 
                      key={prob._id} 
                      onClick={() => toast.error("Upgrade to Pro to unlock Hard challenges!")}
                      className="block group cursor-pointer"
                   >
                      {cardContent}
                   </div>
                ) : (
                   <Link key={prob._id} href={`/dashboard/practice/${prob._id}`} className="block group">
                      {cardContent}
                   </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
