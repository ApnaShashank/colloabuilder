"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CodeIcon, UserGroupIcon, Award01Icon, ZapIcon, SparklesIcon, ArrowRight01Icon, RocketIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

const FEATURES = [
  { num: "01", icon: CodeIcon,       title: "Practice Arena",      desc: "500+ algorithmic challenges. Live code editor, editorial hints, timed contests.", tag: "DSA",         href: "/dashboard/practice",   accent: "#B54B00" },
  { num: "02", icon: UserGroupIcon,  title: "Team Workspaces",     desc: "Form squads of 2–8. PR reviews, role-based access, shared file trees.",          tag: "Collab",      href: "/dashboard/teams",      accent: "#3b82f6" },
  { num: "03", icon: Award01Icon,    title: "Verified Portfolio",   desc: "Every project you ship is auto-verified. Recruiters see live previews.",          tag: "Portfolio",   href: "/dashboard/portfolio",  accent: "#10b981" },
  { num: "04", icon: ZapIcon,        title: "Global Leaderboard",  desc: "Earn XP, unlock ranks, compete with developers worldwide in real time.",           tag: "Rankings",    href: "/dashboard/leaderboard",accent: "#f59e0b" },
  { num: "05", icon: SparklesIcon,   title: "AI Mentorship",       desc: "Smart hints, personalized learning paths, and automated code reviews.",            tag: "AI",          href: "/dashboard/ai",         accent: "#8b5cf6" },
  { num: "06", icon: RocketIcon,     title: "Deploy Pipeline",     desc: "One-click preview URLs. Real CI/CD in the browser without leaving Colloabuilder.", tag: "DevOps",      href: "/dashboard/projects",   accent: "#ec4899" },
];

const CODE_LINES = [
  { ln: "1",  txt: "function fibonacci(n) {",          hi: false },
  { ln: "2",  txt: "  if (n <= 1) return n;",          hi: false },
  { ln: "3",  txt: "  let a = 0, b = 1;",              hi: false },
  { ln: "4",  txt: "  for (let i = 2; i <= n; i++) {", hi: true  },
  { ln: "5",  txt: "    let temp = a + b;",             hi: true  },
  { ln: "6",  txt: "    a = b; b = temp;",              hi: true  },
  { ln: "7",  txt: "  }",                               hi: false },
  { ln: "8",  txt: "  return b;",                       hi: false },
  { ln: "9",  txt: "}",                                 hi: false },
];

const COMMITS = [
  { avatar: "A", name: "arjun_dev",   msg: "feat: add Fibonacci memoization",   time: "2m ago"  },
  { avatar: "P", name: "priya.codes", msg: "fix: edge case n=0 returns wrong",  time: "14m ago" },
  { avatar: "S", name: "sara.builds", msg: "chore: update test coverage to 94%", time: "1h ago"  },
];

export default function Features() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [listRef,   listVis]   = useInView();
  const [arenaRef,  arenaVis]  = useInView();
  const [collabRef, collabVis] = useInView();

  function colorize(txt: string) {
    if (!mounted) return txt;
    return txt
      .replace(/\b(function|return|let|const|for|if)\b/g, '<span style="color:#B54B00;opacity:0.8">$1</span>')
      .replace(/\b(\d+)\b/g, '<span style="color:#3b82f6">$1</span>');
  }

  return (
    <section className="bg-black py-32 md:py-48 px-4 text-white overflow-hidden">

      {/* Grid overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      <div className="max-w-6xl mx-auto">

        {/* ── SECTION LABEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-700">Platform Modules</span>
          <h2 className="mt-4 font-headline font-black text-[clamp(2.5rem,7vw,6rem)] leading-[0.88] tracking-tighter uppercase text-white">
            One platform.<br />
            <span className="text-neutral-600">The full journey.</span>
          </h2>
        </motion.div>

        {/* ── NUMBERED FEATURE LIST ── */}
        <motion.div
          ref={listRef}
          className="mb-40"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.num}
              initial={{ opacity: 0, x: -20 }}
              animate={listVis ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                href={f.href}
                className="group flex flex-row items-center gap-4 sm:gap-8 py-7 border-b border-white/[0.05] hover:border-white/[0.12] transition-all duration-300 min-w-0"
              >
                {/* Number */}
                <span className="font-headline font-black text-[11px] tracking-[0.3em] text-neutral-800 w-6 sm:w-8 flex-shrink-0 group-hover:text-neutral-600 transition-colors">
                  {f.num}
                </span>

                {/* Icon dot */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${f.accent}15`, color: f.accent }}
                >
                  <HugeiconsIcon icon={f.icon} size={14} />
                </div>

                {/* Title */}
                <h3 className="font-headline font-black text-[clamp(1rem,2.2vw,1.5rem)] uppercase tracking-tighter text-neutral-400 group-hover:text-white transition-colors duration-300 min-w-0 flex-1 md:flex-initial md:w-56 truncate">
                  {f.title}
                </h3>

                {/* Desc — hidden on mobile */}
                <p className="hidden md:block text-[12px] text-neutral-700 leading-relaxed flex-1 group-hover:text-neutral-500 transition-colors truncate">
                  {f.desc}
                </p>

                {/* Tag */}
                <span
                  className="hidden lg:block text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full border flex-shrink-0 transition-all duration-300"
                  style={{ color: f.accent, borderColor: `${f.accent}30`, backgroundColor: `${f.accent}08` }}
                >
                  {f.tag}
                </span>

                {/* Arrow */}
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={16}
                  className="text-neutral-800 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 ml-auto"
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* ── PRACTICE ARENA DEEP DIVE ── */}
        <motion.div
          ref={arenaRef}
          initial={{ opacity: 0, y: 40 }}
          animate={arenaVis ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-40"
        >
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B54B00]/20 bg-[#B54B00]/5">
              <span className="w-1 h-1 rounded-full bg-[#B54B00] animate-pulse" />
              <span className="text-[10px] font-black text-[#B54B00] uppercase tracking-[0.3em]">Module 01</span>
            </div>
            <h2 className="font-headline font-black text-[clamp(2rem,5vw,4rem)] uppercase tracking-tighter leading-[0.9]">
              Solve with<br />purpose.
            </h2>
            <p className="text-[13px] text-neutral-600 leading-relaxed max-w-sm">
              The Practice Arena transforms theory into measurable skill. Solve DSA challenges,
              then apply those patterns in live projects with your team.
            </p>
            <Link
              href="/dashboard/practice"
              className="inline-flex items-center gap-3 bg-[#B54B00] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.03] transition-all shadow-lg shadow-[#B54B00]/20"
            >
              Enter Arena <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Link>
          </div>

          {/* Code mockup */}
          <div className="bg-[#050505] rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.04] bg-[#080808]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-[10px] font-mono text-neutral-700 ml-2">fibonacci_opt.js</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="font-mono text-[11px] leading-loose space-y-0.5">
                {CODE_LINES.map((l, i) => (
                  <div
                    key={i}
                    className={`flex gap-5 rounded-sm px-2 ${l.hi ? "bg-[#B54B00]/10 border-l-2 border-[#B54B00] -mx-2" : ""}`}
                  >
                    <span className="text-neutral-800 w-4 text-right select-none flex-shrink-0">{l.ln}</span>
                    {mounted ? (
                      <span className="text-neutral-500" dangerouslySetInnerHTML={{ __html: colorize(l.txt) }} />
                    ) : (
                      <span className="text-neutral-500">{l.txt}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-black/60 rounded-xl p-4 border border-white/[0.04]">
                <p className="text-[9px] font-black text-neutral-700 uppercase tracking-[0.3em] mb-3">Test Results</p>
                <div className="space-y-2">
                  {[
                    { input: "fibonacci(10)", res: "55",   ok: true },
                    { input: "fibonacci(0)",  res: "0",    ok: true },
                    { input: "fibonacci(20)", res: "6765", ok: true },
                  ].map((t, i) => (
                    <div key={i} className="flex justify-between text-[10px] font-mono">
                      <span className="text-neutral-700">{t.input}</span>
                      <span className={t.ok ? "text-emerald-500" : "text-[#B54B00]"}>{t.ok ? `✓ ${t.res}` : "FAIL"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── COLLABORATION DEEP DIVE ── */}
        <motion.div
          ref={collabRef}
          initial={{ opacity: 0, y: 40 }}
          animate={collabVis ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Activity panel */}
          <div className="bg-[#050505] rounded-2xl border border-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-8 space-y-6 order-2 lg:order-1">
            <p className="text-[9px] font-black text-neutral-700 uppercase tracking-[0.4em]">Live Activity Stream</p>
            <div className="space-y-5">
              {COMMITS.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={collabVis ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#B54B00] text-white font-black italic flex items-center justify-center text-sm flex-shrink-0">
                    {c.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-neutral-300 truncate">{c.msg}</p>
                    <p className="text-[10px] text-neutral-700 mt-0.5">{c.name} · {c.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/[0.04]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-neutral-700 uppercase tracking-[0.3em]">Deploy Status</span>
                <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Build",  time: "12s", done: true },
                  { label: "Tests",  time: "28s", done: true },
                  { label: "Deploy", time: "4s",  done: true },
                ].map((d, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px]">
                    <span className="text-neutral-700 uppercase font-black tracking-widest">{d.label}</span>
                    <span className="text-emerald-500 font-mono">{d.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B54B00]/20 bg-[#B54B00]/5">
              <span className="w-1 h-1 rounded-full bg-[#B54B00] animate-pulse" />
              <span className="text-[10px] font-black text-[#B54B00] uppercase tracking-[0.3em]">Module 02</span>
            </div>
            <h2 className="font-headline font-black text-[clamp(2rem,5vw,4rem)] uppercase tracking-tighter leading-[0.9]">
              Real engineering.<br />Real teams.
            </h2>
            <p className="text-[13px] text-neutral-600 leading-relaxed max-w-sm">
              Every project gets a full professional environment — issue trackers, pull requests,
              shared file trees, and deployment previews — all in your browser.
            </p>
            <Link
              href="/dashboard/teams"
              className="inline-flex items-center gap-3 border border-white/[0.08] text-neutral-400 px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:border-white/20 hover:text-white transition-all"
            >
              Explore Workspaces <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
