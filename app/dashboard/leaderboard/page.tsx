"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Award01Icon, 
  ChartLineData01Icon, 
  StarIcon, 
  UserGroupIcon, 
  FlashIcon,  
  MedalIcon,
  ActivityIcon,
  ArrowRight01Icon,
  Loading01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Skeleton from "@/components/ui/Skeleton";

export default function LeaderboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/users/leaderboard", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const json = await res.json().catch(() => ({ success: false, users: [] }));
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-xl space-y-4">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-2/3 h-4" />
          </div>
          <Skeleton className="w-80 h-40 rounded-[2rem]" />
        </header>
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8">
            <Skeleton className="w-full h-[400px] rounded-[2.5rem]" />
          </div>
          <div className="xl:col-span-4 space-y-8">
             <Skeleton className="w-full h-[300px] rounded-[2.5rem]" />
          </div>
        </section>
      </div>
    );
  }

  const topUsers = data?.users || [];
  const currentUserRank = data?.rank || "---";
  const currentUserStats = data?.stats;

  const xpInCurrentLevel = currentUserStats?.xp % 1000 || 0;
  const progressPercent = (xpInCurrentLevel / 1000) * 100;
  const xpToNext = 1000 - xpInCurrentLevel;

  const topOne = topUsers[0];

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="max-w-xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-4">
            <HugeiconsIcon icon={Award01Icon} size={16} className="text-primary" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">The Global Leaderboard</span>
          </motion.div>
          <h1 className="text-5xl font-headline font-black text-white tracking-tighter leading-none mb-6 italic uppercase">
            Forge The <span className="text-primary">Global</span> Ranking.
          </h1>
          <p className="text-neutral-500 text-[11px] font-black uppercase tracking-widest italic leading-relaxed">
            Real-time ranking of our elite community. Your position is determined by total XP earned.
          </p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0e0e0e] border border-white/[0.08] p-8 rounded-[2rem] min-w-[320px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <HugeiconsIcon icon={FlashIcon} size={60} className="text-primary" />
          </div>
          <div className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] mb-4">Your Position</div>
          <div className="flex items-center justify-between relative z-10">
            <div className="text-4xl font-headline font-black text-white italic">#{currentUserRank}</div>
            <div className="text-right">
              <div className="text-[10px] text-neutral-600 uppercase tracking-widest font-black">To Next Tier</div>
              <div className="text-sm font-black text-primary italic">{Math.max(0, xpToNext)} XP</div>
            </div>
          </div>
          <div className="mt-6 h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden relative z-10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5 }}
              className="h-full bg-primary"
            />
          </div>
        </motion.div>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          {topOne && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative h-[420px] bg-[#0e0e0e] border border-white/[0.07] rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_70%)]" />
              <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row justify-between items-end gap-10 z-20">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-primary text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">Global #1</span>
                    <span className="text-primary flex items-center gap-2 italic text-[10px] font-black">
                      <HugeiconsIcon icon={MedalIcon} size={14} />
                      ELITE STATUS UNLOCKED
                    </span>
                  </div>
                  <h2 className="text-5xl lg:text-7xl font-headline font-black text-white leading-none mb-6 italic uppercase">
                    {topOne.username || topOne.name}
                  </h2>
                </div>
                <div className="flex gap-12 text-white bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2rem] backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-4xl font-headline font-black mb-1 italic">{topOne.xp.toLocaleString()}</div>
                    <div className="text-[10px] text-primary uppercase font-black tracking-[0.2em]">Total XP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-headline font-black mb-1 italic">{topOne.level}</div>
                    <div className="text-[10px] text-primary uppercase font-black tracking-[0.2em]">Level</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="bg-[#0e0e0e] border border-white/[0.07] rounded-[2.5rem] p-4 lg:p-10 shadow-2xl overflow-hidden">
            <h3 className="text-xl font-headline font-black text-white italic uppercase mb-10 px-4">Elite Rankings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-white/[0.04] text-[10px] text-neutral-600 uppercase tracking-[0.3em] font-black italic">
                  <tr>
                    <th className="py-6 px-6">Rank</th>
                    <th className="py-6 px-6">User Identity</th>
                    <th className="py-6 px-6 text-right">Total XP</th>
                    <th className="py-6 px-6 text-right pr-10">Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {topUsers.map((row: any, i: number) => {
                    const rank = i + 1;
                    const isTopThree = rank <= 3;
                    return (
                      <motion.tr 
                        key={row._id}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="group hover:bg-white/[0.01] transition-all"
                      >
                        <td className={`py-10 px-6 font-headline font-black text-3xl ${isTopThree ? 'text-primary' : 'text-neutral-800'} italic`}>
                          {rank < 10 ? `0${rank}` : rank}
                        </td>
                        <td className="py-10 px-6">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black italic uppercase">
                                 {row.username?.charAt(0) || row.name?.charAt(0)}
                              </div>
                              <div>
                                 <div className="font-black text-white text-base uppercase italic group-hover:text-primary transition-colors">{row.username || row.name}</div>
                                 <div className="text-[9px] text-neutral-600 uppercase tracking-widest font-black italic mt-1">{row.role || "Architect"}</div>
                              </div>
                           </div>
                        </td>
                        <td className="py-10 px-6 text-right font-headline font-black text-2xl text-white italic">
                          {row.xp.toLocaleString()}
                        </td>
                        <td className="py-10 px-6 text-right pr-10">
                          <span className={`px-4 py-2 rounded-full text-[9px] font-black border uppercase tracking-widest italic ${isTopThree ? 'text-primary border-primary/20' : 'text-neutral-600 border-white/5'}`}>
                            Lvl {row.level}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
           <section className="bg-[#0e0e0e] border border-white/[0.07] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                <HugeiconsIcon icon={ChartLineData01Icon} size={20} />
              </div>
              <h3 className="text-xl font-headline font-black text-white uppercase tracking-tight italic">System Impact</h3>
            </div>
            <div className="space-y-8">
              {topUsers.slice(0, 3).map((cont: any, i: number) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl border border-white/[0.05] bg-black flex items-center justify-center font-black text-neutral-600 group-hover:text-primary transition-colors italic">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-black text-white text-xs uppercase italic group-hover:text-primary transition-colors">{cont.username || cont.name}</div>
                      <div className="text-[9px] text-neutral-600 font-black uppercase tracking-widest italic mt-1">Level {cont.level} Achieved</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-primary p-10 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-primary/10">
            <h3 className="text-black font-headline font-black text-2xl mb-4 leading-tight italic uppercase">Join the elite?</h3>
            <p className="text-black/60 text-[11px] font-black uppercase tracking-widest italic mb-8">Climb the ranks by solving global challenges.</p>
            <button className="w-full py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest italic hover:scale-105 transition-transform flex items-center justify-center gap-2">
              Start Solving <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </button>
          </section>
        </div>
      </section>
    </div>
  );
}
