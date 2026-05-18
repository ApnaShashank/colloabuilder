"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Target, ArrowRight, Code2, Zap, TrendingUp, LayoutGrid, GitBranch, MessageSquare, Shield, CheckCircle2 } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: "easeOut" } as any,
};

export default function LandingFeatures() {
  return (
    <section className="py-16 px-6 lg:px-12 border-b border-white/[0.05] max-w-[1500px] mx-auto">
      <div className="space-y-20">
        
        {/* Practice Arena Box */}
        <motion.div {...fadeUp} className="bg-[#0c0c0c] border border-white/[0.07] rounded-[2rem] overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative min-h-[350px] lg:min-h-[500px] overflow-hidden lg:order-last group">
              <Image 
                src="https://ik.imagekit.io/DEMOPROJECT/practice-arena.png" 
                alt="Practice Arena interface" 
                fill 
                className="object-cover object-left-top' group-hover:scale-105 transition-transform duration-700" 
                sizes="(max-width: 1024px) 100vw, 50vw" 
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#0e0e0e]/40 to-transparent lg:block hidden" />
            </div>
            <div className="p-8 lg:p-14 flex flex-col justify-center border-r border-white/[0.06]">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Target size={22} className="text-primary" />
              </div>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">Core Module 01</p>
              <h2 className="font-headline font-black text-3xl lg:text-5xl text-white tracking-tight leading-[1.05] mb-6">
                Solve with purpose.<br />Build with data.
              </h2>
              <p className="text-neutral-400 text-base leading-relaxed mb-8 max-w-lg">
                The Practice Arena transforms theory into measurable skill. Solve data structures challenges, then immediately apply those patterns in your team's live projects.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  { icon: Code2,      text: "500+ problems across DSA, System Design, and UI Engineering" },
                  { icon: Zap,        text: "Built-in editor with real-time feedback and edge-case testing" },
                  { icon: TrendingUp, text: "Automated ranking system — compete with peers worldwide" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Icon size={13} className="text-primary" />
                    </div>
                    <span className="text-neutral-400 text-xs font-medium leading-tight">{text}</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/practice" className="w-fit">
                <button className="bg-primary hover:bg-primary-dark text-background px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 group border border-white/10 shadow-[0_20px_40px_rgba(245,241,232,0.1)]">
                  Enter Practice Arena
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Team Workspace Box */}
        <motion.div {...fadeUp} className="bg-[#0c0c0c] border border-white/[0.07] rounded-[2rem] overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative min-h-[350px] lg:min-h-[500px] overflow-hidden group">
              <Image 
                src="https://ik.imagekit.io/DEMOPROJECT/team-workspace.png" 
                alt="Team Workspace interface" 
                fill 
                className="object-cover object-left-top group-hover:scale-105 transition-transform duration-700" 
                sizes="(max-width: 1024px) 100vw, 50vw" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/40 to-transparent lg:block hidden" />
            </div>
            <div className="p-8 lg:p-14 flex flex-col justify-center border-l border-white/[0.06]">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-6">
                <LayoutGrid size={22} className="text-secondary" />
              </div>
              <p className="text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-4">Core Module 02</p>
              <h2 className="font-headline font-black text-3xl lg:text-5xl text-white tracking-tight leading-[1.05] mb-6">
                Real engineering.<br />Real collaboration.
              </h2>
              <p className="text-neutral-400 text-base leading-relaxed mb-8 max-w-lg">
                Every project gets a full professional environment. Issue trackers, pull requests, file trees, and deployment previews — all in your browser.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  { icon: GitBranch,    text: "Git-integrated version control for seamless team merging" },
                  { icon: MessageSquare,text: "Peer code reviews to improve project quality and learning" },
                  { icon: Shield,       text: "Role-specific access controls for project management" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3 group">
                     <div className="w-6 h-6 rounded-lg bg-secondary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-colors">
                      <Icon size={13} className="text-secondary" />
                    </div>
                    <span className="text-neutral-400 text-xs font-medium leading-tight">{text}</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/projects/alpha" className="w-fit">
                <button className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 group">
                  Explore Workspaces
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-secondary" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
        {/* Infrastructure Analytics Box */}
        <motion.div {...fadeUp} className="bg-[#0c0c0c] border border-white/[0.07] rounded-[2rem] overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative min-h-[350px] lg:min-h-[500px] overflow-hidden lg:order-last group">
              <div className="absolute inset-0 bg-[#111] p-10 flex flex-col items-center justify-center">
                 {/* Visual Mock of Analytics */}
                 <div className="w-full max-w-md aspect-video bg-black/40 rounded-[2rem] border border-white/5 p-8 space-y-6 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                    <div className="flex justify-between items-center">
                       <div className="h-2 w-24 bg-secondary/20 rounded-full" />
                       <div className="h-6 w-16 bg-red-500/20 border border-red-500/30 rounded-full animate-pulse" />
                    </div>
                    <div className="h-32 w-full bg-gradient-to-t from-secondary/5 to-transparent border-b border-secondary/20 relative">
                       <div className="absolute bottom-0 left-0 w-full h-[2px] bg-secondary shadow-[0_0_20px_rgba(236,72,153,0.5)]" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                       <div className="h-12 bg-white/5 rounded-xl" />
                       <div className="h-12 bg-white/5 rounded-xl" />
                       <div className="h-12 bg-white/5 rounded-xl" />
                    </div>
                 </div>
              </div>
            </div>
            <div className="p-8 lg:p-14 flex flex-col justify-center border-r border-white/[0.06]">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <TrendingUp size={22} className="text-emerald-500" />
              </div>
              <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Core Module 03</p>
              <h2 className="font-headline font-black text-3xl lg:text-5xl text-white tracking-tight leading-[1.05] mb-6">
                Infrastructure.<br />Cost. Optimized.
              </h2>
              <p className="text-neutral-400 text-base leading-relaxed mb-8 max-w-lg">
                Stop flying blind on cloud spending. Monitor real-time usage, detect costly spikes, and use AI to optimize your infrastructure for maximum efficiency.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  { icon: TrendingUp,   text: "Real-time cost visualization and resource usage tracking" },
                  { icon: Shield,       text: "Anomaly detection system to alert on unexpected cost spikes" },
                  { icon: Zap,          text: "AI-driven optimization engine for server-side cost reduction" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/5 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/10 transition-colors">
                      <Icon size={13} className="text-emerald-500" />
                    </div>
                    <span className="text-neutral-400 text-xs font-medium leading-tight">{text}</span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/projects" className="w-fit">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-black px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 group border border-white/10">
                  Analyze Fleet Costs
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
