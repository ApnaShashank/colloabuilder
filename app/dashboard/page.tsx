"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Activity01Icon,
  Target02Icon,
  RocketIcon,
  Time02Icon,
  ArrowRight01Icon,
  Award01Icon,
  FlashIcon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useUser } from "@/context/UserContext";
import Skeleton from "@/components/ui/Skeleton";

const containerVars = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVars = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as any } },
};

export default function DashboardOverview() {
  const { user } = useUser();
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };

        const [statsRes, subRes, actRes] = await Promise.all([
          fetch("/api/submissions/stats", { headers }),
          fetch("/api/submissions?limit=3", { headers }),
          fetch("/api/user/activity", { headers })
        ]);
        
        if (statsRes.ok) setStats((await statsRes.json().catch(() => ({}))).stats);
        if (subRes.ok) setRecentActivity((await subRes.json().catch(() => ({}))).submissions || []);
        if (actRes.ok) setUserActivity((await actRes.json().catch(() => ({}))).activity || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading && !user) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-44 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
        <Skeleton className="h-56 rounded-xl" />
      </div>
    );
  }

  const xpProgress = user?.xp ? (user.xp % 1000) / 10 : 0;
  const currentLevel = user?.xp ? Math.floor(user.xp / 1000) + 1 : 1;
  
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
      className="space-y-6 pb-12 max-w-[1500px] mx-auto p-1 sm:p-2"
    >
      {/* ── TOP SECTION ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Workspace Card */}
        <motion.div 
          variants={itemVars}
          className="lg:col-span-8 bg-[#090909] border border-white/[0.05] rounded-xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between group shadow-lg"
        >
          {/* Top Info */}
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-5 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-600">Personal Workspace</span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/25 px-2 py-0.5 rounded bg-emerald-500/5">
              Sync Active
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-start justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-none uppercase">
                Hello, {user?.name || "Developer"}
              </h1>
              <p className="text-neutral-500 text-[11px] leading-relaxed max-w-md font-medium">
                Track your codebase performance, verify algorithmic completions, and manage team workspaces.
              </p>
            </div>

            {/* Metrics pills */}
            <div className="flex sm:flex-col gap-2 flex-shrink-0">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <HugeiconsIcon icon={FlashIcon} size={13} className="text-white/60" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">{user?.xp || 0} XP</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <HugeiconsIcon icon={Award01Icon} size={13} className="text-emerald-500" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Rank #{(stats?.rank || "---")}</span>
              </div>
            </div>
          </div>
          
          {/* Level Tracker */}
          <div className="mt-8 border-t border-white/[0.04] pt-5 space-y-2.5">
             <div className="flex justify-between items-end">
                <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-1.5">
                   <HugeiconsIcon icon={Layers01Icon} size={10} className="text-white/60" /> Level {currentLevel} PROGRESS
                </p>
                <p className="text-[10px] font-black text-white tracking-tight">{Math.round(xpProgress)}% Completed</p>
             </div>
             <div className="h-1.5 bg-white/[0.02] border border-white/[0.05] rounded-full overflow-hidden p-0.5">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${xpProgress}%` }}
                   className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                />
             </div>
          </div>
        </motion.div>

        {/* Action card */}
        <motion.div 
          variants={itemVars}
          className="lg:col-span-4 bg-white text-black p-8 sm:p-10 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-neutral-100 rounded-full blur-2xl opacity-50 pointer-events-none" />
          
          <div className="relative z-10 space-y-5">
            <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center">
               <HugeiconsIcon icon={RocketIcon} size={18} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black uppercase leading-none tracking-tight">
                Collaborate on workspaces
              </h3>
              <p className="text-neutral-500 text-[9px] font-black uppercase tracking-wider leading-relaxed">
                Connect with teams, review repository branches, and ship collectively.
              </p>
            </div>
          </div>
          
          <Link href="/dashboard/teams" className="mt-6 relative z-10">
             <button className="w-full py-3.5 bg-black hover:bg-neutral-900 text-white rounded-lg font-black uppercase tracking-widest text-[9px] transition-all hover:scale-[1.01] active:scale-99 flex items-center justify-center gap-2">
                Open Workspaces <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
             </button>
          </Link>
        </motion.div>
      </section>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "DSA Challenges Solved", val: stats?.solvedCount || "0", icon: Target02Icon, color: "text-white" },
          { label: "Submission Accuracy", val: `${stats?.accuracy || 0}%`, icon: Award01Icon, color: "text-emerald-500" },
          { label: "Active Coding Streak", val: `${stats?.streak || 0} Days`, icon: Time02Icon, color: "text-blue-500" },
          { label: "Recent Contributions", val: recentActivity.length, icon: Activity01Icon, color: "text-neutral-500" },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVars}
            className="bg-[#090909] border border-white/[0.05] p-5 rounded-xl group hover:border-white/10 transition-colors relative overflow-hidden"
          >
             <div className="flex items-center justify-between mb-3">
                <span className="text-neutral-600 text-[8px] font-black uppercase tracking-widest">{stat.label}</span>
                <span className={`${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
                   <HugeiconsIcon icon={stat.icon} size={14} />
                </span>
             </div>
             <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-none">{stat.val}</h3>
          </motion.div>
        ))}
      </div>

      {/* ── HEATMAP ── */}
      <motion.section 
        variants={itemVars} 
        className="bg-[#090909] border border-white/[0.05] p-8 rounded-xl shadow-lg"
      >
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/[0.04] pb-5 mb-6 gap-3">
            <div>
               <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <HugeiconsIcon icon={Activity01Icon} size={16} className="text-emerald-500" /> Contribution Activity
               </h2>
               <p className="text-[9px] text-neutral-600 mt-1 uppercase tracking-wider font-semibold">Your daily algorithmic solves and workspace activities mapped over the last 12 weeks.</p>
            </div>
            
            <div className="flex items-center gap-2 text-[8px] font-black text-neutral-600 uppercase tracking-widest">
               <span>Less</span>
               <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-sm bg-white/5 border border-white/5" />
                  <div className="w-2 h-2 rounded-sm bg-emerald-500/20" />
                  <div className="w-2 h-2 rounded-sm bg-emerald-500/50" />
                  <div className="w-2 h-2 rounded-sm bg-emerald-500" />
               </div>
               <span>More</span>
            </div>
         </div>
         
         <div className="flex flex-wrap gap-1.5 justify-center py-4 bg-white/[0.01] rounded-lg border border-white/[0.03] px-4">
            {heatmapDays.map((day, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.12 }}
                title={`${day.date}: ${day.points} points`}
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-[2px] border border-white/[0.01] cursor-crosshair transition-colors ${day.points > 0 ? 'bg-emerald-500' : 'bg-white/5'}`}
                style={{ opacity: day.points > 0 ? Math.min(0.3 + (day.points * 0.15), 1) : 0.05 }}
              />
            ))}
         </div>
      </motion.section>
    </motion.div>
  );
}
