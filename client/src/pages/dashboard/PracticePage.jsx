import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  SourceCodeIcon, 
  Search01Icon, 
  ArrowRight01Icon,
  ChartLineData01Icon,
  FlashIcon,
  TargetIcon,
  UserGroup02Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SkeletonComponent from "../../components/ui/Skeleton";

export default function PracticeArenaPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [stats, setStats] = useState(null);

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
          const data = await probRes.json();
          setProblems(data.problems || []);
        }
        
        if (statRes.ok) {
          const statData = await statRes.json();
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

  const difficultyStyles = {
    Easy: { color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
    Medium: { color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
    Hard: { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
  };

  const filteredProblems = filter === "All" 
    ? problems 
    : problems.filter(p => p.difficulty === filter);

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-white text-[10px] font-black tracking-widest uppercase border border-primary/20">
            Algorithmic Arena
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-[0.9] font-headline italic uppercase">
            The Practice <span className="text-primary opacity-40">Arena</span>
          </h1>
          <p className="text-neutral-500 text-sm font-medium mt-2 max-w-lg">
            Bridge the gap between syntax and architecture with curated production-level challenges.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link to="/dashboard/practice/history" className="bg-[#111] border border-white/[0.08] text-neutral-400 hover:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all italic">
            My Submissions
          </Link>
          <Link to="/dashboard/leaderboard" className="bg-primary text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-white hover:text-black italic">
            Leaderboard
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#111] border border-white/[0.05] rounded-[2.5rem] p-8 space-y-8">
             <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <HugeiconsIcon icon={ChartLineData01Icon} size={18} variant="stroke" strokeWidth={1.5} />
                </div>
                <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest italic">Performance Metrics</h3>
             </div>

             {loading ? (
               <div className="space-y-6">
                 <div className="space-y-2">
                    <SkeletonComponent className="w-24 h-3 rounded-full" />
                    <SkeletonComponent className="w-full h-1 rounded-full" />
                 </div>
                 <div className="space-y-2">
                    <SkeletonComponent className="w-24 h-3 rounded-full" />
                    <SkeletonComponent className="w-full h-1 rounded-full" />
                 </div>
                 <div className="pt-6 border-t border-white/[0.02] flex items-center justify-between gap-4">
                    <div className="flex-1 flex flex-col items-center gap-2">
                       <SkeletonComponent className="w-12 h-6 rounded-lg" />
                       <SkeletonComponent className="w-10 h-2 rounded-full" />
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                       <SkeletonComponent className="w-12 h-6 rounded-lg" />
                       <SkeletonComponent className="w-10 h-2 rounded-full" />
                    </div>
                 </div>
               </div>
             ) : (
               <div className="space-y-6">
                 <div className="space-y-2">
                   <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Solved Challenges</p>
                      <p className="text-sm font-black text-white">{stats?.solvedCount || 0}/{problems.length || 0}</p>
                   </div>
                   <div className="h-1 bg-white/[0.02] rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${problems.length > 0 ? ((stats?.solvedCount || 0) / problems.length) * 100 : 0}%` }}></div>
                   </div>
                 </div>

                 <div className="space-y-2">
                   <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Global Accuracy</p>
                      <p className="text-sm font-black text-white">{stats?.accuracy || 0}%</p>
                   </div>
                   <div className="h-1 bg-white/[0.02] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${stats?.accuracy || 0}%` }}></div>
                   </div>
                 </div>

                 <div className="pt-6 border-t border-white/[0.02] flex items-center justify-between">
                   <div className="text-center flex-1">
                      <p className="text-xl font-black text-white">{stats?.rank || '---'}</p>
                      <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Global Rank</p>
                   </div>
                   <div className="w-px h-8 bg-white/[0.05]"></div>
                   <div className="text-center flex-1">
                      <p className="text-xl font-black text-primary">{stats?.streak || 0}d</p>
                      <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Streak</p>
                   </div>
                 </div>
               </div>
             )}
          </div>

          <div className="bg-primary/5 border-primary/10 p-8 rounded-[2rem] space-y-4">
             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <HugeiconsIcon icon={FlashIcon} size={20} variant="stroke" strokeWidth={1.5} />
             </div>
             <p className="text-xs font-bold text-white">Daily Bonus Active!</p>
             <p className="text-[10px] text-neutral-500 leading-relaxed">Solve any <span className="text-primary font-bold">Hard</span> problem today to earn 2x EXP tokens.</p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 justify-between items-center bg-[#111] border border-white/[0.05] p-2 rounded-[2rem]">
            <div className="flex bg-black p-1.5 rounded-2xl border border-white/10 shadow-inner">
              {["All", "Easy", "Medium", "Hard"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-primary text-black shadow-xl scale-105" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
                >
                   {f}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72 mr-4">
              <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
              <input 
                type="text" 
                placeholder="FIND CHALLENGES..."
                className="w-full bg-[#050505] border border-white/[0.05] rounded-xl pl-11 pr-4 py-3 text-[10px] tracking-widest font-black text-white focus:outline-none focus:border-primary/30 transition-all uppercase"
              />
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="p-8 bg-[#111] border border-white/[0.05] rounded-[2rem] flex items-center gap-8">
                    <SkeletonComponent className="w-14 h-14 rounded-2xl" />
                    <div className="flex-1 space-y-3">
                       <SkeletonComponent className="w-1/3 h-6 rounded-lg" />
                       <SkeletonComponent className="w-1/4 h-3 rounded-full" />
                    </div>
                    <SkeletonComponent className="w-24 h-8 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filteredProblems.length === 0 ? (
              <div className="py-20 text-center bg-[#111] border border-white/[0.05] rounded-[2.5rem]">
                <HugeiconsIcon icon={TargetIcon} size={40} className="mx-auto mb-4 text-neutral-800" variant="stroke" strokeWidth={1.5} />
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">No challenges found in this cycle</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredProblems.map((prob) => {
                  const style = difficultyStyles[prob.difficulty] || difficultyStyles.Easy;
                  return (
                    <Link 
                      key={prob._id} 
                      to={`/dashboard/practice/${prob._id}`}
                      className="group block"
                    >
                      <motion.div 
                        whileHover={{ x: 8 }}
                        className="flex items-center gap-8 p-6 bg-[#111] border border-white/[0.05] rounded-[2rem] hover:border-primary/40 hover:bg-[#151515] transition-all relative overflow-hidden"
                      >
                        <div className={`w-14 h-14 rounded-2xl border ${style.bg} ${style.border} flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110`}>
                          <HugeiconsIcon icon={SourceCodeIcon} size={24} className={style.color} variant="stroke" strokeWidth={1.5} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                             <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{prob.title}</h4>
                             <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${style.bg} ${style.border} ${style.color}`}>
                                {prob.difficulty}
                             </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex gap-2">
                              {prob.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-[9px] text-neutral-600 font-bold uppercase tracking-wider italic">#{tag}</span>
                              ))}
                            </div>
                            <div className="w-px h-3 bg-white/[0.05]"></div>
                            <div className="flex items-center gap-1.5">
                               <HugeiconsIcon icon={UserGroup02Icon} size={12} className="text-neutral-700" />
                               <span className="text-[9px] font-black text-neutral-700 uppercase">{prob.acceptedCount || 0} Solved</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 flex-shrink-0">
                           <div className="hidden md:flex flex-col items-end">
                              <p className="text-white text-[10px] font-black uppercase tracking-widest">+120 XP</p>
                              <p className="text-neutral-700 text-[8px] font-bold uppercase tracking-widest">Potential</p>
                           </div>
                           <div className="w-10 h-10 rounded-full bg-[#050505] flex items-center justify-center border border-white/[0.05] group-hover:border-primary/40 group-hover:bg-primary transition-all">
                              <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-neutral-700 group-hover:text-white" variant="stroke" strokeWidth={1.5} />
                           </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
