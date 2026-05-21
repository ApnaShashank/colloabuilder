"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
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

function useCounter(target: number, duration = 1500, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let cur = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [target, duration, started]);
  return count;
}

const TABLE_ROWS = [
  { feature: "Coding Practice (DSA)",   us: true, leet: true,  gh: false },
  { feature: "Team Collaboration",      us: true, leet: false, gh: true  },
  { feature: "Project Workspaces",      us: true, leet: false, gh: true  },
  { feature: "Auto-Verified Portfolio", us: true, leet: false, gh: false },
  { feature: "Recruitment Connection",  us: true, leet: true,  gh: false },
  { feature: "Learning + Shipping",     us: true, leet: false, gh: false },
];

const CHART_BARS = [
  { label: "Jan", val: 42 },
  { label: "Feb", val: 67 },
  { label: "Mar", val: 55 },
  { label: "Apr", val: 88 },
  { label: "May", val: 72 },
  { label: "Jun", val: 95 },
];

const GROWTH_STATS = [
  { val: 94,   suffix: "%", label: "Student placement rate" },
  { val: 3.2,  suffix: "x", label: "Faster hiring outcomes" },
  { val: 40,   suffix: "K+", label: "Hours of code shipped" },
];

function GrowthStat({ val, suffix, label, started }: { val: number; suffix: string; label: string; started: boolean }) {
  const isDecimal = val % 1 !== 0;
  const count = useCounter(isDecimal ? val * 10 : val, 1400, started);
  const display = isDecimal ? (count / 10).toFixed(1) : count;
  return (
    <div className="text-center">
      <div className="font-headline font-black text-5xl md:text-6xl text-white tabular-nums leading-none">
        {display}{suffix}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600 mt-2">{label}</div>
    </div>
  );
}

export default function Benefits() {
  const [chartRef, chartVis] = useInView();
  const [tableRef, tableVis] = useInView();
  const [ctaRef,   ctaVis]   = useInView();
  const [statsRef, statsVis] = useInView();
  const [barsAnim, setBarsAnim] = useState(false);

  useEffect(() => { if (chartVis) setTimeout(() => setBarsAnim(true), 300); }, [chartVis]);

  return (
    <section className="bg-black py-32 md:py-48 px-4 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* ── GROWTH NUMBERS ── */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 24 }}
          animate={statsVis ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-24 md:mb-40"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-700">Outcomes</span>
          <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/[0.06] rounded-2xl overflow-hidden">
            {GROWTH_STATS.map((s, i) => (
              <div key={i} className="py-12 px-8 border-b md:border-b-0 md:border-r border-white/[0.06] last:border-b-0 md:last:border-r-0 hover:bg-white/[0.02] transition-colors">
                <GrowthStat {...s} started={statsVis} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── ACTIVITY CHART ── */}
        <motion.div
          ref={chartRef}
          initial={{ opacity: 0, y: 40 }}
          animate={chartVis ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24 md:mb-40"
        >
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B54B00]/20 bg-[#B54B00]/5">
              <span className="w-1 h-1 rounded-full bg-[#B54B00] animate-pulse" />
              <span className="text-[10px] font-black text-[#B54B00] uppercase tracking-[0.3em]">Module 03</span>
            </div>
            <h2 className="font-headline font-black text-[clamp(2rem,5vw,4rem)] uppercase tracking-tighter leading-[0.9]">
              Track growth.<br />
              <span className="text-neutral-600">In real time.</span>
            </h2>
            <p className="text-[13px] text-neutral-600 leading-relaxed max-w-sm">
              XP, streaks, problem-solve rate, and team metrics in one dashboard.
              Watch your progress compound — day by day.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 bg-[#B54B00] text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.03] transition-all shadow-lg shadow-[#B54B00]/20"
            >
              View Dashboard <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Link>
          </div>

          {/* Chart card */}
          <div className="bg-[#050505] rounded-2xl border border-white/[0.06] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] bg-[#080808]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-[9px] font-black text-neutral-700 uppercase tracking-[0.3em]">XP Dynamics</span>
            </div>
            <div className="p-8 space-y-6">
              {/* Sparkline */}
              <div className="relative h-24">
                <svg viewBox="0 0 300 60" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#B54B00" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#B54B00" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,45 C40,42 60,18 90,24 S140,38 170,18 S230,8 270,10 L300,8 L300,60 L0,60Z"
                    fill="url(#sparkGrad)"
                    className={`transition-opacity duration-1000 ${barsAnim ? "opacity-100" : "opacity-0"}`}
                  />
                  <path
                    d="M0,45 C40,42 60,18 90,24 S140,38 170,18 S230,8 270,10 L300,8"
                    fill="none" stroke="#B54B00" strokeWidth="1.5" strokeOpacity="0.5"
                  />
                </svg>
                <div className={`absolute top-2 right-4 bg-[#B54B00] text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest transition-opacity duration-700 ${barsAnim ? "opacity-100" : "opacity-0"}`}>
                  Peak XP
                </div>
              </div>
              {/* Bars */}
              <div className="flex items-end justify-between gap-2 h-20">
                {CHART_BARS.map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full bg-[#B54B00]/15 hover:bg-[#B54B00]/30 rounded transition-all cursor-default"
                      style={{
                        height: barsAnim ? `${b.val}%` : "0%",
                        transitionDelay: `${i * 80}ms`,
                        transitionDuration: "700ms",
                        transitionProperty: "height",
                      }}
                    />
                    <span className="text-[8px] font-black text-neutral-800 uppercase">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── COMPARISON TABLE ── */}
        <motion.div
          ref={tableRef}
          initial={{ opacity: 0, y: 40 }}
          animate={tableVis ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-24 md:mb-40"
        >
          <div className="mb-10 md:mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-700">Comparison</span>
            <h2 className="mt-4 font-headline font-black text-[clamp(2rem,6vw,5rem)] uppercase tracking-tighter leading-[0.88]">
              Why Colloabuilder?
            </h2>
          </div>

          <div className="border border-white/[0.06] rounded-2xl overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="py-5 px-6 text-[9px] font-black uppercase tracking-[0.35em] text-neutral-700 w-1/2">Feature</th>
                  <th className="py-5 px-6 text-[9px] font-black uppercase tracking-[0.35em] text-[#B54B00] bg-[#B54B00]/[0.04] text-center">Colloabuilder</th>
                  <th className="py-5 px-6 text-[9px] font-black uppercase tracking-[0.35em] text-neutral-700 text-center hidden sm:table-cell">LeetCode</th>
                  <th className="py-5 px-6 text-[9px] font-black uppercase tracking-[0.35em] text-neutral-700 text-center hidden md:table-cell">GitHub</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={tableVis ? { opacity: 1 } : {}}
                    transition={{ delay: 0.05 * i }}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015] transition-colors group"
                  >
                    <td className="py-5 px-6 text-[11px] font-bold text-neutral-600 group-hover:text-neutral-400 transition-colors uppercase tracking-wider">{row.feature}</td>
                    <td className="py-5 px-6 text-center bg-[#B54B00]/[0.02]">
                      {row.us
                        ? <span className="text-[#B54B00] text-base font-black">✓</span>
                        : <span className="text-neutral-800 text-xs">—</span>}
                    </td>
                    <td className="py-5 px-6 text-center hidden sm:table-cell">
                      {row.leet
                        ? <span className="text-neutral-600 text-base font-black">✓</span>
                        : <span className="text-neutral-800 text-xs">—</span>}
                    </td>
                    <td className="py-5 px-6 text-center hidden md:table-cell">
                      {row.gh
                        ? <span className="text-neutral-600 text-base font-black">✓</span>
                        : <span className="text-neutral-800 text-xs">—</span>}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── PLANS ── */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 30 }}
          animate={ctaVis ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="pt-8"
        >
          <div className="mb-10 md:mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-700">Pricing</span>
            <h2 className="mt-4 font-headline font-black text-[clamp(2rem,6vw,5rem)] uppercase tracking-tighter leading-[0.88]">
              Simple plans.<br />
              <span className="text-neutral-600">No surprises.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Starter */}
            <div className="group border border-white/[0.06] rounded-2xl p-8 hover:border-white/[0.12] transition-all duration-300 flex flex-col">
              <div className="mb-8">
                <span className="text-[9px] font-black uppercase tracking-[0.35em] text-neutral-700">Starter</span>
                <div className="mt-3 flex items-end gap-1">
                  <span className="font-headline font-black text-5xl text-white leading-none">$0</span>
                  <span className="text-neutral-600 text-sm font-bold mb-1">/mo</span>
                </div>
                <p className="mt-3 text-[12px] text-neutral-600 leading-relaxed">Perfect for individuals learning DSA and building their first projects.</p>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {["100 DSA problems", "1 project workspace", "Public portfolio", "Global leaderboard", "Community support"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[11px] text-neutral-500">
                    <span className="w-1 h-1 rounded-full bg-neutral-700 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full py-3.5 border border-white/[0.08] rounded-xl text-[11px] font-black uppercase tracking-widest text-neutral-500 hover:border-white/20 hover:text-white transition-all text-center block">
                Get Started Free
              </Link>
            </div>

            {/* Pro — highlighted */}
            <div className="group border border-[#B54B00]/40 rounded-2xl p-8 bg-[#B54B00]/[0.04] relative flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B54B00] text-white text-[9px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
                Most Popular
              </div>
              <div className="mb-8">
                <span className="text-[9px] font-black uppercase tracking-[0.35em] text-[#B54B00]">Pro</span>
                <div className="mt-3 flex items-end gap-1">
                  <span className="font-headline font-black text-5xl text-white leading-none">$12</span>
                  <span className="text-neutral-600 text-sm font-bold mb-1">/mo</span>
                </div>
                <p className="mt-3 text-[12px] text-neutral-600 leading-relaxed">For serious builders shipping real products with a team.</p>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {["All 500+ DSA problems", "5 team workspaces", "AI mentorship & hints", "Verified portfolio badge", "Deployment pipeline", "Priority support"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[11px] text-neutral-400">
                    <span className="w-1 h-1 rounded-full bg-[#B54B00] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full py-3.5 bg-[#B54B00] rounded-xl text-[11px] font-black uppercase tracking-widest text-white hover:bg-[#9E4200] transition-all text-center block shadow-lg shadow-[#B54B00]/20">
                Start Pro Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="group border border-white/[0.06] rounded-2xl p-8 hover:border-white/[0.12] transition-all duration-300 flex flex-col">
              <div className="mb-8">
                <span className="text-[9px] font-black uppercase tracking-[0.35em] text-neutral-700">Enterprise</span>
                <div className="mt-3 flex items-end gap-1">
                  <span className="font-headline font-black text-5xl text-white leading-none">Custom</span>
                </div>
                <p className="mt-3 text-[12px] text-neutral-600 leading-relaxed">For colleges, bootcamps, and companies running structured programs.</p>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {["Unlimited workspaces", "Custom problem sets", "Analytics dashboard", "SSO & admin controls", "SLA & dedicated support", "On-premise option"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[11px] text-neutral-500">
                    <span className="w-1 h-1 rounded-full bg-neutral-700 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="mailto:hello@colloabuilder.dev" className="w-full py-3.5 border border-white/[0.08] rounded-xl text-[11px] font-black uppercase tracking-widest text-neutral-500 hover:border-white/20 hover:text-white transition-all text-center block">
                Contact Sales
              </a>
            </div>
          </div>

          <p className="mt-8 text-center text-[10px] text-neutral-700 uppercase tracking-[0.3em]">
            All plans include · No credit card required · Cancel anytime
          </p>
        </motion.div>

      </div>
    </section>
  );
}
