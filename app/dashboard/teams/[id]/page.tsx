"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, MessageSquare, GitBranch, Settings, Plus, Crown,
  Shield, Code2, Activity, ArrowRight, Hash, Mic, Video,
  Lock, Globe, Star, CheckCircle2, Loader2
} from "lucide-react";
import Link from "next/link";
import SkeletonComponent from "@/components/ui/Skeleton";

const members = [
  { name: "Priya Nair", role: "Lead", avatar: "PN", level: 28, status: "online", skills: ["React", "Node.js"] },
  { name: "Arjun Mehta", role: "Backend", avatar: "AM", level: 21, status: "online", skills: ["Go", "PostgreSQL"] },
  { name: "Sneha Patel", role: "Frontend", avatar: "SP", level: 18, status: "away", skills: ["Vue", "Figma"] },
  { name: "Rahul Singh", role: "DevOps", avatar: "RS", level: 15, status: "offline", skills: ["Docker", "AWS"] },
  { name: "Aditya Verma", role: "Member", avatar: "AV", level: 12, status: "online", skills: ["Python", "ML"] },
];

const channels = [
  { name: "general", type: "text", unread: 3 },
  { name: "code-reviews", type: "text", unread: 0 },
  { name: "sprint-planning", type: "text", unread: 1 },
  { name: "standup", type: "voice" },
];

const recentActivity = [
  { user: "Priya Nair", action: "merged PR #12 — Add auth middleware", time: "10m ago", icon: GitBranch },
  { user: "Arjun Mehta", action: "opened issue #34 — Database schema update", time: "1h ago", icon: Code2 },
  { user: "Sneha Patel", action: "pushed 3 commits to feature/dashboard", time: "3h ago", icon: Activity },
  { user: "Rahul Singh", action: "closed PR #11 — CI/CD pipeline setup", time: "5h ago", icon: CheckCircle2 },
];

const projects = [
  { name: "Nexus Core", status: "In Progress", progress: 68 },
  { name: "Auth Module", status: "Review", progress: 90 },
  { name: "Mobile App", status: "Planning", progress: 15 },
];

const roleColor: Record<string, string> = {
  Lead: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Backend: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Frontend: "text-primary bg-primary/10 border-primary/20",
  DevOps: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Member: "text-neutral-400 bg-white/[0.04] border-white/[0.08]",
};

const statusDot: Record<string, string> = {
  online: "bg-emerald-400",
  away: "bg-amber-400",
  offline: "bg-neutral-600",
};

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const [activeChannel, setActiveChannel] = useState("general");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-6 lg:p-8 animate-in fade-in duration-500">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <SkeletonComponent className="w-14 h-14 rounded-2xl" />
              <div className="space-y-2">
                <SkeletonComponent className="w-48 h-8 rounded-lg" />
                <SkeletonComponent className="w-64 h-4 rounded-full" />
              </div>
            </div>
            <div className="flex gap-3">
               <SkeletonComponent className="w-24 h-10 rounded-xl" />
               <SkeletonComponent className="w-32 h-10 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5">
            {/* Sidebar Skeleton */}
            <div className="col-span-3 space-y-4">
               <div className="bg-[#111] border border-white/[0.05] rounded-2xl p-6 space-y-4">
                 <SkeletonComponent className="w-20 h-3 rounded-full" />
                 {[1,2,3,4].map(i => <SkeletonComponent key={i} className="w-full h-10 rounded-xl" />)}
               </div>
            </div>
            {/* Main Feed Skeleton */}
            <div className="col-span-6 space-y-5">
               <div className="bg-[#111] border border-white/[0.05] rounded-2xl p-8 space-y-6">
                 <SkeletonComponent className="w-1/3 h-6 rounded-lg" />
                 {[1,2,3].map(i => (
                   <div key={i} className="flex gap-4 p-4 border border-white/[0.03] rounded-xl">
                      <SkeletonComponent className="w-8 h-8 rounded-lg" />
                      <div className="flex-1 space-y-2">
                         <SkeletonComponent className="w-full h-4 rounded-full" />
                         <SkeletonComponent className="w-2/3 h-3 rounded-full" />
                      </div>
                   </div>
                 ))}
               </div>
            </div>
            {/* Members Skeleton */}
            <div className="col-span-3 space-y-4">
               <div className="bg-[#111] border border-white/[0.05] rounded-2xl p-6 space-y-4">
                 <SkeletonComponent className="w-20 h-3 rounded-full" />
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className="flex items-center gap-3">
                      <SkeletonComponent className="w-10 h-10 rounded-full" />
                      <div className="flex-1 space-y-1.5">
                         <SkeletonComponent className="w-1/2 h-3 rounded-full" />
                         <SkeletonComponent className="w-1/3 h-2 rounded-full" />
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Link href="/dashboard/teams" className="text-neutral-600 hover:text-white transition-colors text-[11px] uppercase tracking-widest font-bold">← Teams</Link>
              <span className="text-neutral-700">/</span>
              <span className="text-neutral-400 text-[11px] uppercase tracking-widest font-bold">The Debuggers</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="font-headline font-black text-xl text-primary">TD</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-headline font-black text-3xl text-white tracking-tight">The Debuggers</h1>
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded-full uppercase tracking-widest">
                    <Globe size={9} /> Public
                  </span>
                </div>
                <p className="text-neutral-500 text-sm mt-1">Full-stack development enthusiasts · {members.length} members</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-neutral-400 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2">
              <Settings size={13} /> Manage
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-background rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 border border-white/10 transition-all"
            >
              <Plus size={13} /> Invite Member
            </motion.button>
          </div>
        </motion.div>

        {/* Main 3-column layout */}
        <div className="grid grid-cols-12 gap-5">

          {/* Channel Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="col-span-3 bg-surface border border-white/[0.06] rounded-2xl p-5 h-fit"
          >
            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] mb-4">Channels</p>
            <div className="space-y-1">
              {channels.map((ch) => (
                <button
                  key={ch.name}
                  onClick={() => setActiveChannel(ch.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${activeChannel === ch.name ? "bg-primary/10 border border-primary/15" : "hover:bg-white/[0.03]"}`}
                >
                  <div className="flex items-center gap-2">
                    {ch.type === "text" ? (
                      <Hash size={13} className={activeChannel === ch.name ? "text-primary" : "text-neutral-600"} />
                    ) : (
                      <Mic size={13} className="text-emerald-400" />
                    )}
                    <span className={`text-xs font-semibold ${activeChannel === ch.name ? "text-primary" : "text-neutral-400"}`}>{ch.name}</span>
                  </div>
                  {ch.unread ? (
                    <span className="w-4 h-4 rounded-full bg-primary text-background text-[9px] font-black flex items-center justify-center">{ch.unread}</span>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.06]">
              <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] mb-3">Voice Rooms</p>
              <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-all text-left">
                <Video size={13} className="text-neutral-600" />
                <span className="text-xs font-semibold text-neutral-500">Team Standup</span>
              </button>
            </div>
          </motion.div>

          {/* Main feed */}
          <div className="col-span-6 space-y-5">

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-surface border border-white/[0.06] rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-headline font-bold text-white text-sm flex items-center gap-2">
                  <Activity size={15} className="text-primary" /> Recent Activity
                </h3>
                <span className="text-[10px] text-neutral-600 font-bold">#{activeChannel}</span>
              </div>

              <div className="space-y-4">
                {recentActivity.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.07, duration: 0.3 }}
                      className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={12} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-neutral-300 text-xs">
                          <span className="text-white font-bold">{a.user}</span>
                          {" "}{a.action}
                        </p>
                        <p className="text-neutral-700 text-[10px] mt-1">{a.time}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Current Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="bg-surface border border-white/[0.06] rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-headline font-bold text-white text-sm flex items-center gap-2">
                  <GitBranch size={15} className="text-secondary" /> Active Projects
                </h3>
                <Link href="/dashboard/projects" className="text-[10px] text-neutral-600 hover:text-primary transition-colors font-bold flex items-center gap-1">
                  View all <ArrowRight size={10} />
                </Link>
              </div>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-semibold">{proj.name}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${proj.status === "In Progress" ? "text-primary border-primary/20 bg-primary/5" : proj.status === "Review" ? "text-amber-400 border-amber-400/20 bg-amber-400/5" : "text-neutral-500 border-white/[0.08] bg-white/[0.02]"}`}>
                        {proj.status}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${proj.progress}%` }}
                        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                    <p className="text-right text-[10px] text-neutral-600 font-bold">{proj.progress}%</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Members Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="col-span-3 bg-surface border border-white/[0.06] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em]">Members ({members.length})</p>
              <button className="text-neutral-600 hover:text-primary transition-colors">
                <Plus size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {members.map((m, i) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.3 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-all group cursor-default"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <span className="text-[10px] font-black text-primary">{m.avatar}</span>
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${statusDot[m.status]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-white text-xs font-semibold truncate">{m.name}</p>
                      {m.role === "Lead" && <Crown size={9} className="text-amber-400 flex-shrink-0" />}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${roleColor[m.role]}`}>
                      {m.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-600 font-mono">Lv.{m.level}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
