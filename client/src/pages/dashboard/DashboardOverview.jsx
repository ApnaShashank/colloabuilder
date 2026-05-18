import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import {
  Activity01Icon,
  Target02Icon,
  RocketIcon,
  Tick02Icon,
  Time02Icon,
  ArrowRight01Icon,
  SourceCodeIcon,
  Award01Icon,
  SparklesIcon,
  FlashIcon,
  DatabaseIcon,
  Cancel01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SkeletonComponent from "../../components/ui/Skeleton";

const containerVars = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVars = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DashboardOverview() {
  const { user, loading: userLoading } = useUser();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [projects, setProjects] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };

        const [statsRes, subRes, projRes, actRes] = await Promise.all([
          fetch("/api/submissions/stats", { headers }),
          fetch("/api/submissions?limit=3", { headers }),
          fetch("/api/projects?limit=2", { headers }),
          fetch("/api/user/activity", { headers })
        ]);
        
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.stats);
        }
        
        if (subRes.ok) {
          const subData = await subRes.json();
          setRecentActivity(subData.submissions || []);
        }

        if (projRes.ok) {
          const projData = await projRes.json();
          setProjects(projData.projects || []);
        }

        if (actRes.ok) {
          const actData = await actRes.json();
          setUserActivity(actData.activity || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setStatsLoading(false);
      }
    }
    
    if (user) {
      fetchDashboardData();
    } else if (!userLoading) {
      setStatsLoading(false);
    }
  }, [user, userLoading]);

  if (userLoading || statsLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-4">
          <div className="space-y-2">
            <SkeletonComponent className="w-48 h-8 rounded-lg" />
            <SkeletonComponent className="w-64 h-4 rounded-full" />
          </div>
          <SkeletonComponent className="w-32 h-10 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonComponent key={i} className="h-32 rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-8">
              <SkeletonComponent className="h-[300px] rounded-[2.5rem]" />
              <SkeletonComponent className="h-[400px] rounded-[2.5rem]" />
           </div>
           <div className="lg:col-span-4 h-full">
              <SkeletonComponent className="h-full min-h-[600px] rounded-[2.5rem]" />
           </div>
        </div>
      </div>
    );
  }

  const xpProgress = user?.xp ? (user.xp % 1000) / 10 : 0;
  const xpNeeded = 1000 - (user?.xp ? user.xp % 1000 : 0);

  // Heatmap calculation
  const today = new Date();
  const heatmapDays = Array.from({ length: 84 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (83 - i));
    const dateStr = d.toISOString().split('T')[0];
    const activity = userActivity.find(a => a.date === dateStr);
    return { date: dateStr, points: activity?.points || 0 };
  });

  return (
    <motion.div
      variants={containerVars}
      initial="initial"
      animate="animate"
      className="space-y-8 md:space-y-12 pb-24 max-w-[1600px] mx-auto"
    >
      {/* ── Top Hero Section ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <motion.div 
          variants={itemVars}
          className="lg:col-span-8 bg-[#0e0e0e] border border-white/[0.06] rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3.5rem] p-5 sm:p-8 md:p-12 relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[120px] -mr-48 -mt-48 rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
            <div className="relative">
              <div className="w-32 h-32 rounded-[2.5rem] bg-primary/5 border border-primary/20 flex items-center justify-center p-1 shadow-2xl">
                <div className="w-full h-full rounded-[2rem] overflow-hidden bg-[#111] flex items-center justify-center text-primary text-5xl font-black italic font-headline">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0] || "U"
                  )}
                </div>
              </div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary border-4 border-[#0e0e0e] flex items-center justify-center text-black font-black text-sm italic"
              >
                {user?.level || 1}
              </motion.div>
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center md:justify-start gap-3 mb-2">
                   <span className="text-secondary text-[10px] font-black uppercase tracking-[0.4em]">Dashboard</span>
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter font-headline leading-none italic uppercase">
                  Hello, <span className="text-primary">{user?.name?.split(' ')[0]}</span>
                </h1>
                <p className="text-slate-500 text-sm mt-4 max-w-xl font-medium leading-relaxed">
                  {user?.bio || "Welcome to your dashboard. Track your progress, manage your projects, and stay updated with your latest activity."}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] group/stat">
                   <HugeiconsIcon icon={FlashIcon} size={16} className="text-amber-400 group-hover:scale-125 transition-transform" variant="solid" />
                   <span className="text-xs font-black text-white uppercase tracking-widest">{user?.xp || 0} XP Total</span>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] group/stat">
                   <HugeiconsIcon icon={Award01Icon} size={16} className="text-secondary group-hover:scale-125 transition-transform" variant="solid" />
                   <span className="text-xs font-black text-white uppercase tracking-widest">Global Rank: #{(stats?.rank || "---")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-10 border-t border-white/[0.04] space-y-5 relative z-10">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Progression</p>
                <p className="text-sm font-bold text-white uppercase tracking-tighter italic">Next Level: <span className="text-primary">{xpNeeded} XP</span> REQ.</p>
              </div>
              <p className="text-lg font-headline font-black text-white italic">{Math.round(xpProgress)}%</p>
            </div>
            <div className="h-4 w-full bg-white/[0.02] rounded-full p-1 border border-white/[0.04] shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                className="h-full bg-gradient-to-r from-white via-neutral-200 to-white rounded-full relative"
              >
                 <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] animate-shimmer" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVars}
          className="lg:col-span-4 bg-primary/5 border border-primary/20 rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3.5rem] p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden group shadow-2xl border-t-white/10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent)]" />
          <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-125 transition-transform duration-1000">
             <HugeiconsIcon icon={RocketIcon} size={250} className="text-primary" />
          </div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-black mb-8 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              <HugeiconsIcon icon={SparklesIcon} size={28} variant="stroke" strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter font-headline italic mb-4 uppercase">Project Updates</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">Keep track of your current projects and stay organized with the team.</p>
          </div>

          <Link to="/dashboard/teams" className="relative z-10">
            <button className="w-full bg-primary hover:bg-neutral-200 text-black py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 group/btn italic">
              Access Team Hub
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </section>

      {/* ── Tactical Metrics Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-8">
        {[
          { label: "NODES_RESOLVED", value: stats?.solvedCount || "0", sub: "Algorithmic Integrity", icon: Target02Icon, clr: "text-emerald-400" },
          { label: "PRECISION_RATIO", value: `${stats?.accuracy || 0}%`, sub: "Execution Metric", icon: Award01Icon, clr: "text-secondary" },
          { label: "STREAK_STABILITY", value: `${stats?.streak || 0}D`, sub: "Temporal Sequence", icon: Time02Icon, clr: "text-amber-400" },
          { label: "ACTIVE_SIGNALS", value: recentActivity.length, sub: "Network Traffic", icon: Activity01Icon, clr: "text-primary" },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVars}
            className="bg-[#0e0e0e] border border-white/[0.06] rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] p-4 sm:p-6 lg:p-9 group hover:border-white/20 transition-all shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
               <HugeiconsIcon icon={stat.icon} size={80} className={stat.clr} />
            </div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] ${stat.clr} shadow-inner`}>
                <HugeiconsIcon icon={stat.icon} size={24} variant="stroke" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col items-end">
                 <div className={`text-[8px] font-black uppercase tracking-widest ${stat.clr} opacity-50 mb-1`}>Status</div>
                 <div className="w-8 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full w-2/3 ${stat.clr.replace("text-", "bg-")}`} />
                 </div>
              </div>
            </div>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-1 relative z-10">{stat.label}</p>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-black text-white mb-2 relative z-10 italic tracking-tighter">{stat.value}</h3>
            <p className="text-slate-500 text-[11px] font-medium italic opacity-70 relative z-10">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Activity Heatmap ── */}
      <motion.section variants={itemVars} className="bg-[#0e0e0e] border border-white/[0.06] rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3.5rem] p-5 sm:p-8 md:p-12 shadow-2xl">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="space-y-1">
               <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
                  <HugeiconsIcon icon={Activity01Icon} size={24} className="text-primary" />
                  Neural_Uplink_Heatmap
               </h2>
               <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Aggregate activity across 84 tactical cycles</p>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">
               <span>Idle</span>
               <div className="flex gap-1.5">
                  {[0.1, 0.3, 0.6, 1].map(o => (
                     <div key={o} className="w-3.5 h-3.5 rounded bg-white" style={{ opacity: o }} />
                  ))}
               </div>
               <span>Critical</span>
            </div>
         </div>
         
         <div className="flex flex-wrap gap-2 justify-center">
            {heatmapDays.map((day, i) => {
               const opacity = day.points === 0 ? 0.05 : Math.min(0.2 + (day.points * 0.15), 1);
               return (
                  <motion.div 
                    key={day.date}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.005 }}
                    className="w-4 h-4 md:w-5 md:h-5 rounded-[4px] bg-white relative group cursor-crosshair border border-white/5"
                    style={{ opacity }}
                  >
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-2xl">
                        {day.date}: {day.points} SIGNALS
                     </div>
                  </motion.div>
               );
            })}
         </div>
      </motion.section>

      {/* ── Workspaces & Transmission ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10">
        
        {/* Left: Workspaces */}
        <div className="lg:col-span-8 space-y-10">
          <motion.section variants={itemVars} className="bg-[#0e0e0e] border border-white/[0.06] rounded-2xl sm:rounded-[3rem] lg:rounded-[3.5rem] overflow-hidden shadow-2xl">
            <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-10 border-b border-white/[0.04] flex justify-between items-center bg-white/[0.01] gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-headline font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <HugeiconsIcon icon={SourceCodeIcon} size={22} />
                  </div>
                  Strategic_Hubs
                </h2>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Active Project Terminals</p>
              </div>
              <Link to="/dashboard/projects" className="group flex items-center gap-3">
                 <span className="text-[10px] font-black text-slate-500 group-hover:text-white transition-colors uppercase tracking-[0.2em] italic">Access_All_Nodes</span>
                 <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-slate-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            </div>

            <div className="p-4 sm:p-8 lg:p-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              {projects.length === 0 ? (
                 <div className="col-span-full py-10 flex flex-col items-center justify-center text-center space-y-4">
                    <HugeiconsIcon icon={DatabaseIcon} size={40} className="text-slate-800" />
                    <p className="text-slate-700 text-[10px] font-black uppercase tracking-widest italic">No active hubs detected in this sector.</p>
                 </div>
              ) : (
                projects.map((proj, i) => (
                  <Link key={i} to={`/dashboard/projects/${proj._id}`} className="group block">
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8 hover:bg-white/[0.04] hover:border-primary/20 transition-all duration-500 h-full flex flex-col justify-between">
                       <div>
                          <div className="flex items-center justify-between mb-6">
                             <div className="w-12 h-12 rounded-2xl bg-[#111] border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <HugeiconsIcon icon={SourceCodeIcon} size={20} className="text-slate-500 group-hover:text-primary transition-colors" />
                             </div>
                             <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">LIVE</div>
                          </div>
                          <h4 className="text-xl font-black text-white italic tracking-tighter mb-2 group-hover:text-primary transition-colors">{proj.name}</h4>
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-6">{proj.language || "Tactical Stack"}</p>
                       </div>
                       
                       <div className="space-y-4">
                          <div className="flex justify-between items-end">
                             <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Fleet Integrity</span>
                             <span className="text-[10px] font-black text-white">94%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full w-[94%] bg-white" />
                          </div>
                       </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </motion.section>

          <motion.section variants={itemVars} className="bg-[#0e0e0e] border border-white/[0.06] rounded-2xl sm:rounded-[3rem] lg:rounded-[3.5rem] overflow-hidden shadow-2xl">
            <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-10 border-b border-white/[0.04] bg-white/[0.01]">
              <h2 className="text-xl font-headline font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <HugeiconsIcon icon={Activity01Icon} size={22} />
                </div>
                Transmission_Log
              </h2>
            </div>
            <div className="p-4 sm:p-8 lg:p-12 space-y-6 lg:space-y-10">
              {recentActivity.length === 0 ? (
                <div className="py-10 text-center space-y-6">
                   <p className="text-slate-800 text-[10px] font-black uppercase tracking-[0.3em]">Sector quiet. No incoming signals.</p>
                   <Link to="/dashboard/practice">
                     <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all italic">Initiate Broadcast</button>
                   </Link>
                </div>
              ) : (
                recentActivity.map((act, i) => (
                  <div key={i} className="flex gap-4 sm:gap-10 relative group">
                    {i !== recentActivity.length - 1 && (
                      <div className="absolute left-7 top-16 bottom-0 w-[1px] bg-white/[0.05]" />
                    )}
                     <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center border-2 transition-all group-hover:scale-110 shadow-2xl ${act.status === "Accepted" ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                      <HugeiconsIcon icon={act.status === "Accepted" ? Tick02Icon : Cancel01Icon} size={24} variant="stroke" strokeWidth={2} />
                    </div>
                    <div className="space-y-2 py-1">
                       <div className="flex items-center gap-4">
                          <p className="text-lg font-black text-white italic tracking-tighter uppercase group-hover:text-primary transition-colors">
                            {act.problemId?.title}
                          </p>
                          <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest bg-white/[0.02] px-2 py-0.5 rounded border border-white/5">{act.status}</span>
                       </div>
                       <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] flex items-center gap-3">
                          <HugeiconsIcon icon={Time02Icon} size={12} />
                          {new Date(act.submittedAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          {act.language}
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          {act.runtime}
                       </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.section>
        </div>

        {/* Right: Goals & Intel */}
        <div className="lg:col-span-4 space-y-5 lg:space-y-10">
          
          <motion.section variants={itemVars} className="bg-primary/5 border border-primary/20 rounded-2xl sm:rounded-[3rem] lg:rounded-[3.5rem] p-5 sm:p-8 lg:p-10 relative overflow-hidden group shadow-2xl border-t-white/10">
             <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
               <HugeiconsIcon icon={FlashIcon} size={200} className="text-primary" />
             </div>
             <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                     <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                     <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Critical_Intel</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white font-headline leading-[0.9] italic uppercase tracking-tighter">Accelerate<br/>Tactical Stack</h2>
                </div>
                
                <div className="space-y-4">
                   {[
                      { icon: SourceCodeIcon, text: "Optimize Edge Rendering", sub: "React Server Components" },
                      { icon: SparklesIcon, text: "Collect 150+ XP", sub: "Strategic Milestone", clr: "text-amber-500" }
                   ].map((item, i) => (
                      <div key={i} className="p-6 bg-black/40 border border-white/[0.05] rounded-3xl flex items-center gap-5 hover:bg-black/60 transition-colors">
                         <div className={`p-2.5 rounded-xl bg-white/5 ${item.clr || "text-slate-400"}`}>
                            <HugeiconsIcon icon={item.icon} size={18} />
                         </div>
                         <div>
                            <p className="text-xs font-black text-white italic uppercase tracking-tighter">{item.text}</p>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">{item.sub}</p>
                         </div>
                      </div>
                   ))}
                </div>

                <Link to="/dashboard/learn">
                  <button className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl italic">
                    Initiate Intel Sequence
                  </button>
                </Link>
             </div>
          </motion.section>

          <motion.section variants={itemVars} className="bg-[#0e0e0e] border border-white/[0.06] rounded-2xl sm:rounded-[3rem] lg:rounded-[3.5rem] p-5 sm:p-8 lg:p-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-10 flex items-center gap-4">
              <div className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                <HugeiconsIcon icon={Tick02Icon} size={14} className="text-white" />
              </div>
              Mission_Checklist
            </h2>
            <div className="space-y-5">
              {[
                { title: "Calibrate Personal Node", ok: !!user?.bio, desc: "Profile Information" },
                { title: "Uplink GitHub Account", ok: !!user?.github?.isConnected, desc: "Tactical Integration" },
                { title: "Resolve Initial Problem", ok: (stats?.solvedCount || 0) > 0, desc: "Arena Synchronization" },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-white/[0.01] border border-white/[0.03] hover:border-white/10 transition-all cursor-pointer group">
                  <div className={`w-8 h-8 rounded-xl border-2 transition-all flex items-center justify-center flex-shrink-0 ${task.ok ? 'bg-primary border-primary shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-slate-800'}`}>
                    {task.ok && <HugeiconsIcon icon={Tick02Icon} size={16} className="text-white" variant="stroke" strokeWidth={2.5} />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-black uppercase tracking-widest italic leading-none ${task.ok ? 'text-slate-700' : 'text-white'}`}>{task.title}</p>
                    <p className="text-[8px] text-slate-800 font-bold uppercase mt-2 tracking-[0.2em]">{task.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section variants={itemVars} className="bg-[#0e0e0e] border border-white/[0.06] rounded-2xl sm:rounded-[3rem] lg:rounded-[3.5rem] p-5 sm:p-8 lg:p-10 relative overflow-hidden group shadow-2xl">
            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 rotate-12">
              <HugeiconsIcon icon={Activity01Icon} size={150} className="text-secondary" />
            </div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Global_Broadcast</h2>
              <div className="space-y-4">
                <h3 className="text-white font-black text-2xl leading-[0.9] italic tracking-tighter uppercase">V4.0 Stable<br/>Live Signal</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-medium">Tactical dashboards are now synchronized. Real-time fleet health monitoring engaged. All sectors clear for development.</p>
              </div>
              <Link to="/dashboard/settings">
                <button className="text-secondary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 group/btn italic">
                  Recalibrate Core <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.section>
        </div>

      </div>
    </motion.div>
  );
}
