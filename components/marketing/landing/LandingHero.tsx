"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, Zap, Terminal, LayoutGrid, Trophy, 
  GitBranch, Users, Star, Activity, BookOpen, 
  Briefcase, Sparkles 
} from "lucide-react";
import { useUser } from "@/hooks/useUser";

export default function LandingHero() {
  const { user } = useUser();

  const leftFeatures = [
    { label: "Practice", icon: Terminal, href: "/dashboard/practice", color: "text-blue-400", h: 480 },
    { label: "Learn", icon: BookOpen, href: "/dashboard/learn", color: "text-emerald-400", h: 280 },
    { label: "Roadmap", icon: Sparkles, href: "/dashboard/roadmap", color: "text-pink-400", h: 520 },
  ];

  const rightFeatures = [
    { label: "Internship", icon: Briefcase, href: "/dashboard/internship", color: "text-amber-400", h: 320 },
    { label: "Teams", icon: Users, href: "/dashboard/teams", color: "text-violet-400", h: 460 },
    { label: "Game", icon: Trophy, href: "/dashboard/game", color: "text-orange-400", h: 360 },
  ];

  return (
    <section className="relative pt-20 pb-16 px-6 lg:px-12 overflow-hidden flex flex-col items-center text-center max-w-[1500px] mx-auto min-h-[950px]">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10" />

      {/* ── HANGING FEATURES (SIDES) ────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-[300px] hidden xl:block pointer-events-none">
        <div className="w-full h-px bg-white/10" />
        
        {/* Left Side Group - Extreme Edge */}
        <div className="absolute left-6 flex gap-12 pointer-events-auto">
          {leftFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.label} className="flex flex-col items-center group">
                <div className="w-px bg-white/10 group-hover:bg-primary/50" style={{ height: `${feat.h}px` }} />
                <Link href={feat.href}>
                  <motion.div whileHover={{ y: 5 }} className="bg-[#0d0d0d] border border-white/[0.08] px-4 py-2.5 rounded-2xl flex items-center gap-2.5 hover:border-primary/40 shadow-2xl transition-all">
                    <Icon size={13} className={feat.color} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">{feat.label}</span>
                  </motion.div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Right Side Group - Extreme Edge */}
        <div className="absolute right-6 flex gap-12 pointer-events-auto">
          {rightFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.label} className="flex flex-col items-center group">
                <div className="w-px bg-white/10 group-hover:bg-primary/50" style={{ height: `${feat.h}px` }} />
                <Link href={feat.href}>
                  <motion.div whileHover={{ y: 5 }} className="bg-[#0d0d0d] border border-white/[0.08] px-4 py-2.5 rounded-2xl flex items-center gap-2.5 hover:border-primary/40 shadow-2xl transition-all">
                    <Icon size={13} className={feat.color} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">{feat.label}</span>
                  </motion.div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hero Content (Centered) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto mb-8 relative z-10 pt-16"
      >
        <h1 className="font-headline font-black text-[2.8rem] sm:text-[3.5rem] lg:text-[5.5rem] text-white leading-[0.95] tracking-[-0.04em] mb-8">
          Where Students <span className="gradient-text">Master</span><br />
          The Art of Engineering.
        </h1>
        
        <p className="text-neutral-400 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          Stop solving in isolation. Bridge the gap between leetcode-style practice and production-level collaboration in one unified ecosystem.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="bg-primary hover:bg-primary-dark text-background px-10 py-4 rounded-xl font-black text-sm flex items-center gap-3 group transition-all border border-white/10 shadow-[0_20px_40px_rgba(245,241,232,0.1)]">
                Go to Dashboard
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          ) : (
            <>
              <Link href="/signup">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="bg-primary hover:bg-primary-dark text-background px-10 py-4 rounded-xl font-black text-sm flex items-center gap-3 group transition-all border border-white/10 shadow-[0_20px_40px_rgba(245,241,232,0.1)]">
                  Join the Club
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/dashboard/projects/alpha">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="bg-white/[0.03] border border-white/[0.1] text-neutral-300 hover:text-white px-10 py-4 rounded-xl font-bold text-sm transition-all hover:bg-white/[0.05]">
                  Explore Live Projects
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </motion.div>

      {/* Animated Dashboard Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="w-full max-w-[1100px] mx-auto relative mt-10"
      >
        <div className="glass-panel rounded-[2rem] overflow-hidden shadow-2xl border border-white/[0.12]">
          
          {/* Mac OS Style Window Bar */}
          <div className="bg-white/[0.04] border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/30 border border-red-400/50" />
              <div className="w-3 h-3 rounded-full bg-amber-400/30 border border-amber-400/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/30 border border-emerald-400/50" />
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.04] rounded-full border border-white/[0.08]">
              <span className="w-2 h-2 rounded-full bg-emerald-400/60" />
              <span className="text-[11px] text-neutral-400 font-medium">colloabuilder.dev/dashboard</span>
            </div>
            <div className="w-16" />
          </div>

          <div className="grid grid-cols-12 h-[520px]">

            {/* Sidebar Preview */}
            <div className="col-span-3 border-r border-white/[0.06] p-5 flex flex-col gap-5 bg-black/20">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Zap size={14} className="text-background" />
                </div>
                <span className="font-headline font-black text-sm text-white tracking-tight">Colloa <span className="text-primary">builder</span></span>
              </div>

              <div className="space-y-1">
                <p className="text-[9px] font-black text-neutral-700 uppercase tracking-[0.2em] mb-3">Platform</p>
                {[
                  { icon: LayoutGrid, label: "Overview", active: true },
                  { icon: Terminal, label: "Practice", active: false },
                  { icon: Trophy, label: "Leaderboard", active: false },
                  { icon: GitBranch, label: "Projects", active: false },
                  { icon: Users, label: "Teams", active: false },
                ].map(({ icon: Icon, label, active }) => (
                  <div key={label} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${active ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/[0.03]'}`}>
                    <Icon size={13} className={active ? 'text-primary' : 'text-neutral-600'} />
                    <span className={`text-[11px] font-semibold ${active ? 'text-primary' : 'text-neutral-500'}`}>{label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto border-t border-white/[0.06] pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Star size={10} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white">Level 12</p>
                    <p className="text-[9px] text-neutral-600">2,400 / 3,000 XP</p>
                  </div>
                </div>
                <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '80%' }}
                    transition={{ delay: 1.5, duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Main Content Preview */}
            <div className="col-span-9 p-6 bg-background/30 overflow-hidden relative">
               {/* Hero Image Overlay for a more premium look */}
               <img src="https://ik.imagekit.io/DEMOPROJECT/hero-team.png" alt="Hero Illustration" className="absolute top-0 right-0 w-full h-full object-cover opacity-10 mix-blend-overlay pointer-events-none" />
               
               <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-white font-headline font-black text-lg tracking-tight">Good morning, Arjun 👋</h2>
                    <p className="text-neutral-600 text-[11px] mt-0.5">Sunday, 13 Apr · You have 3 pending reviews</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { label: "Problems", val: "142", icon: Terminal, color: "primary" },
                    { label: "PRs Merged", val: "38", icon: GitBranch, color: "secondary" },
                    { label: "Team Rank", val: "#4", icon: Trophy, color: "primary" },
                    { label: "Projects", val: "6", icon: LayoutGrid, color: "secondary" },
                  ].map(({ label, val, icon: Icon, color }) => (
                    <div key={label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                      <Icon size={13} className={color === 'primary' ? 'text-primary mb-2' : 'text-secondary mb-2'} />
                      <p className="text-white font-headline font-black text-xl leading-none">{val}</p>
                      <p className="text-neutral-600 text-[9px] mt-1 uppercase tracking-wider font-bold">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { title: "Practice Arena", desc: "Solve DSA challenges", icon: Terminal, tag: "500+ Problems" },
                    { title: "Team Projects", desc: "Build with a crew", icon: Users, tag: "Real Workspaces" },
                    { title: "Verified Portfolio", desc: "Proof of your work", icon: Star, tag: "Auto-Updated" },
                  ].map(({ title, desc, icon: Icon, tag }) => (
                    <div key={title} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 group hover:border-primary/20 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center mb-3">
                        <Icon size={15} className="text-primary" />
                      </div>
                      <p className="text-white text-[12px] font-black mb-0.5">{title}</p>
                      <p className="text-neutral-600 text-[10px] mb-3">{desc}</p>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/5 rounded-full border border-primary/10">
                        <span className="text-[9px] text-primary font-bold">{tag}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2, duration: 0.5 }}
                  className="mt-4 flex items-center gap-3 px-4 py-3 bg-secondary/5 border border-secondary/10 rounded-xl"
                >
                  <Activity size={13} className="text-secondary flex-shrink-0" />
                  <p className="text-[10px] text-neutral-500">
                    <span className="text-secondary font-bold">@priya_dev</span> merged PR #48 · <span className="text-neutral-400">2 min ago</span>
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
