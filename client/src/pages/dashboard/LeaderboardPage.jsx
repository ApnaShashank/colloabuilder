import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Award01Icon, 
  TargetIcon, 
  ChartLineData01Icon, 
  StarIcon, 
  UserGroupIcon, 
  FlashIcon,  
  CheckListIcon, 
  MedalIcon,
  ActivityIcon,
  ArrowRight01Icon,
  Loading01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SkeletonComponent from "../../components/ui/Skeleton";

export default function LeaderboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/users/leaderboard", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const json = await res.json();
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
            <SkeletonComponent className="w-32 h-4" />
            <SkeletonComponent className="w-full h-12" />
            <SkeletonComponent className="w-full h-12" />
            <SkeletonComponent className="w-2/3 h-4" />
          </div>
          <SkeletonComponent className="w-80 h-40 rounded-[2rem]" />
        </header>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8">
            <SkeletonComponent className="w-full h-[420px] rounded-[2.5rem]" />
            <div className="bg-[#0e0e0e] border border-white/[0.07] rounded-[2.5rem] p-10 space-y-8">
              <SkeletonComponent className="w-48 h-8" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center gap-6 py-6 border-b border-white/[0.03]">
                    <SkeletonComponent className="w-12 h-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                       <SkeletonComponent className="w-1/3 h-5" />
                       <SkeletonComponent className="w-1/4 h-3" />
                    </div>
                    <SkeletonComponent className="w-24 h-8 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="xl:col-span-4 space-y-8">
             <SkeletonComponent className="w-full h-[400px] rounded-[2.5rem]" />
             <SkeletonComponent className="w-full h-[250px] rounded-[2.5rem]" />
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
  const remainingUsers = topUsers.slice(1);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="max-w-xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-4">
            <HugeiconsIcon icon={Award01Icon} size={16} className="text-primary" variant="stroke" strokeWidth={1.5} />
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">The Global Leaderboard</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-headline font-black text-white tracking-tighter leading-none mb-6 italic uppercase"
          >
            Forge The <span className="text-primary italic">Global</span> Ranking.
          </motion.h1>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Real-time ranking of our elite community. Your position is determined by total XP earned across practice, projects, and contributions.
          </p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0e0e0e] border border-white/[0.08] p-8 rounded-[2rem] min-w-[320px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <HugeiconsIcon icon={FlashIcon} size={60} className="text-primary" variant="stroke" strokeWidth={1.5} />
          </div>
          <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] mb-4">Your Position</div>
          <div className="flex items-center justify-between relative z-10">
            <div className="text-4xl font-headline font-black text-white">#{currentUserRank || "???"}</div>
            <div className="text-right">
              <div className="text-[10px] text-neutral-600 uppercase tracking-widest font-bold">To Next Tier</div>
              <div className="text-sm font-bold text-primary">{Math.max(0, xpToNext)} XP</div>
            </div>
          </div>
          <div className="mt-6 h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden relative z-10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-primary"
            ></motion.div>
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
                    <span className="bg-primary text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/10">Global #1</span>
                    <span className="text-primary flex items-center gap-2 italic">
                      <HugeiconsIcon icon={MedalIcon} size={14} variant="stroke" strokeWidth={1.5} />
                      ELITE STATUS UNLOCKED
                    </span>
                  </div>
                  <h2 className="text-5xl lg:text-7xl font-headline font-black text-white leading-none mb-6 italic uppercase">
                    {topOne.username || topOne.name}
                  </h2>
                  <p className="text-neutral-500 text-sm max-w-sm leading-relaxed">
                    Current top developer. Maintaining top rank with consistent practice and active project contributions.
                  </p>
                </div>
                <div className="flex gap-12 text-white bg-white/[0.02] border border-white/[0.05] p-8 rounded-[2rem] backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-4xl font-headline font-black mb-1">{topOne.xp.toLocaleString()}</div>
                    <div className="text-[10px] text-primary uppercase font-bold tracking-[0.2em]">Total XP</div>
                  </div>
                  <div className="w-px h-12 bg-white/[0.05]" />
                  <div className="text-center">
                    <div className="text-4xl font-headline font-black mb-1">{topOne.level}</div>
                    <div className="text-[10px] text-primary uppercase font-bold tracking-[0.2em]">Level</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-105 transition-transform duration-1000">
                 <HugeiconsIcon icon={Award01Icon} size={320} className="text-white" variant="stroke" strokeWidth={1.5} />
              </div>
            </motion.div>
          )}

          <div className="bg-[#0e0e0e] border border-white/[0.07] rounded-[2.5rem] p-4 lg:p-10 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 px-4">
              <h3 className="text-xl font-headline font-black text-white italic uppercase">Elite Rankings</h3>
              <div className="flex gap-2 p-1.5 bg-[#050505] border border-white/[0.05] rounded-xl">
                <button className="bg-white/[0.03] border border-white/[0.05] px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-neutral-300 italic">Global</button>
                <button className="px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-neutral-600 hover:text-white transition-colors italic">Local</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-white/[0.04] text-[10px] text-neutral-600 uppercase tracking-[0.3em] font-black font-headline">
                  <tr>
                    <th className="py-6 px-6">Rank</th>
                    <th className="py-6 px-6">User Identity</th>
                    <th className="py-6 px-6 text-right">Total XP</th>
                    <th className="py-6 px-6 text-right pr-10">Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {topUsers.map((row, i) => {
                    const rank = i + 1;
                    const rankStr = rank < 10 ? `0${rank}` : `${rank}`;
                    const isTopThree = rank <= 3;

                    return (
                      <motion.tr 
                        key={row._id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group transition-colors hover:bg-white/[0.01]"
                      >
                        <td className={`py-10 px-6 font-headline font-black text-3xl ${isTopThree ? 'text-primary' : 'text-neutral-700'} italic leading-none`}>
                          {rankStr}
                        </td>
                        <td className="py-10 px-6">
                          <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl bg-[#111] border border-white/[0.05] flex items-center justify-center font-black text-lg ${isTopThree ? 'text-primary' : 'text-neutral-600'} group-hover:border-primary/20 transition-all overflow-hidden`}>
                              {row.avatar ? (
                                <img src={row.avatar} alt={row.name} className="w-full h-full object-cover" />
                              ) : (
                                (row.username || row.name).charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white text-lg group-hover:text-primary transition-colors">
                                {row.username || row.name}
                              </div>
                              <div className="text-[10px] text-neutral-600 uppercase tracking-[0.2em] font-black font-headline mt-1">
                                {row.role || "Software Engineer"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-10 px-6 text-right font-headline font-black text-2xl text-white">
                          {row.xp.toLocaleString()}
                        </td>
                        <td className="py-10 px-6 text-right pr-10">
                          <span className={`${isTopThree ? 'bg-primary/5 text-primary border-primary/10' : 'bg-white/[0.02] text-neutral-500 border-white/5'} px-4 py-2 rounded-full text-[10px] font-black border uppercase tracking-widest`}>
                            Lvl {row.level}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {topUsers.length === 0 && (
              <div className="text-center py-20 text-neutral-600 font-bold uppercase tracking-widest italic">
                No active nodes detected.
              </div>
            )}
            <button className="w-full mt-10 py-5 bg-[#0a0a0a] border border-dashed border-white/[0.08] text-neutral-600 rounded-[2rem] font-bold text-[11px] uppercase tracking-[0.3em] hover:text-white hover:border-white/20 transition-all italic">
              Load More Developers...
            </button>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
          <section className="bg-[#0e0e0e] border border-white/[0.07] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <HugeiconsIcon icon={UserGroupIcon} size={120} variant="stroke" strokeWidth={1.5} />
            </div>
            <div className="flex items-center gap-4 mb-10 relative z-10">
              <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary">
                <HugeiconsIcon icon={ChartLineData01Icon} size={20} variant="stroke" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-headline font-black text-white uppercase tracking-tight italic">System Impact</h3>
            </div>
            <div className="space-y-8 relative z-10">
              {topUsers.slice(0, 3).map((cont, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl border border-white/[0.05] bg-[#111] flex items-center justify-center font-black text-neutral-600 group-hover:text-primary transition-colors">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm group-hover:text-primary transition-colors">{cont.username || cont.name}</div>
                      <div className={`text-[10px] ${i === 0 ? 'text-primary' : 'text-neutral-600'} font-black uppercase tracking-widest font-headline mt-1`}>
                        Level {cont.level} Achieved
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-headline font-black text-white">{Math.floor(cont.xp / 100)}</div>
                    <div className="text-[9px] text-neutral-700 uppercase tracking-widest font-black">Impact</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 bg-white/[0.03] border border-white/[0.05] text-neutral-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:text-white hover:bg-white/[0.05] transition-all italic">
              Hall of Fame
            </button>
          </section>

          <section className="bg-[#0e0e0e] border border-white/[0.07] rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] pointer-events-none"></div>
            <h3 className="text-xl font-headline font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2 italic">
              <HugeiconsIcon icon={StarIcon} size={18} className="text-primary" variant="stroke" strokeWidth={1.5} />
              Ranking System
            </h3>
            <p className="text-neutral-500 text-sm leading-relaxed mb-10">
              Developers are ranked by <strong className="text-white italic">Experience Points (XP)</strong>, earned by solving practice problems, contributing to projects, and participating in teams.
            </p>
            <div className="flex items-center gap-5 p-6 bg-white/[0.02] rounded-3xl border border-white/[0.05] relative z-10">
              <HugeiconsIcon icon={ActivityIcon} size={24} className="text-primary flex-shrink-0" variant="stroke" strokeWidth={1.5} />
              <div>
                <p className="text-[10px] text-neutral-600 uppercase font-black leading-tight tracking-[0.2em]">Live Sync Status:</p>
                <p className="text-primary text-base font-black mt-1 uppercase">Operational</p>
              </div>
            </div>
          </section>

          <section className="bg-primary p-10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <h3 className="text-white font-headline font-black text-2xl mb-4 leading-tight italic uppercase">Join the elite?</h3>
              <p className="text-white/70 text-sm mb-8">Start solving challenges and contribute to global projects to climb the ranks.</p>
              <button className="w-full py-4 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 italic">
                Start Solving <HugeiconsIcon icon={ArrowRight01Icon} size={14} variant="stroke" strokeWidth={1.5} />
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
