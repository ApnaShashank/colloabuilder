import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Tick02Icon,
  StarIcon,
  Alert01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const TABLE_ROWS = [
  { feature: "Coding Practice (DSA)",      us: true,  leet: true,  gh: false },
  { feature: "Team Collaboration",         us: true,  leet: false, gh: true  },
  { feature: "Project Workspaces",         us: true,  leet: false, gh: true  },
  { feature: "Auto-Verified Portfolio",    us: true,  leet: false, gh: false },
  { feature: "Recruitment Connection",     us: true,  leet: true,  gh: false },
  { feature: "Beginner Friendly",          us: true,  leet: false, gh: false },
  { feature: "Learning + Building",        us: true,  leet: false, gh: false },
];

const CHART_BARS = [
  { label: "Jan", val: 42 },
  { label: "Feb", val: 67 },
  { label: "Mar", val: 55 },
  { label: "Apr", val: 88 },
  { label: "May", val: 72 },
  { label: "Jun", val: 95 },
];

const BENEFITS_LIST = [
  "Real-time cost visualisation and resource usage tracking",
  "Anomaly detection system to alert on unexpected cost spikes",
  "AI-driven optimisation engine for server-side cost reduction",
];

export default function Benefits() {
  const [infraRef, infraVis]   = useInView();
  const [tableRef, tableVis]   = useInView();
  const [ctaRef,   ctaVis]     = useInView();
  const [barsAnim, setBarsAnim] = useState(false);

  useEffect(() => {
    if (infraVis) setTimeout(() => setBarsAnim(true), 300);
  }, [infraVis]);

  return (
    <section className="bg-[#111110] py-24 md:py-32 px-6 md:px-12 text-white">
      {/* ── Infrastructure Card ── */}
      <div
        ref={infraRef}
        className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-40 transition-all duration-1000 ${infraVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-[#6366f1] uppercase tracking-[0.2em]">MODULE 03</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-headline font-black italic uppercase tracking-tighter leading-[0.9]">
            Infrastructure.<br />
            Cost. <span className="text-[#6366f1]">Optimized.</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Stop flying blind on cloud spending. Monitor real-time usage, detect
            costly spikes, and use AI to optimise your infrastructure for maximum
            efficiency.
          </p>
          <ul className="space-y-4 text-sm text-slate-500">
            {BENEFITS_LIST.map((b, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="text-[#6366f1]"><HugeiconsIcon icon={Tick02Icon} size={14} variant="stroke" strokeWidth={2} /></span> {b}
              </li>
            ))}
          </ul>
          <button className="bg-[#6366f1] text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest italic hover:scale-105 transition-all shadow-xl shadow-[#6366f1]/10">
            OPTIMIZE NOW →
          </button>
        </div>

        <div className="bg-[#141412] rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
           <div className="bg-[#0e0e0e] px-5 py-3 flex items-center justify-between border-b border-white/5">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
               <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
               <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
             </div>
             <div className="flex items-center gap-3">
               <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">Resource Usage · Jun 2026</span>
               <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">▲ 12%</span>
             </div>
          </div>
          <div className="p-8">
             <div className="relative h-32 mb-10 overflow-hidden">
                <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,60 C30,55 50,20 80,30 S130,50 160,25 S220,10 260,18 L300,15 L300,80 L0,80Z"
                    fill="url(#lineGrad)"
                    className={`transition-all duration-1000 ease-out ${barsAnim ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`}
                    style={{ transformOrigin: 'bottom' }}
                  />
                  <path
                    d="M0,60 C30,55 50,20 80,30 S130,50 160,25 S220,10 260,18 L300,15"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="1.8"
                    className={`transition-all duration-1000 ease-out ${barsAnim ? "stroke-dashoffset-0" : "stroke-dashoffset-[1000]"}`}
                    style={{ strokeDasharray: 1000, strokeDashoffset: barsAnim ? 0 : 1000 }}
                  />
                  <circle cx="235" cy="14" r="4" fill="#ef4444" className="animate-pulse" />
                  <line x1="235" y1="14" x2="235" y2="80" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.5" />
                </svg>
                <div className="absolute top-2 left-[235px] -translate-x-1/2 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded shadow-xl flex items-center gap-1.5 uppercase">
                  <HugeiconsIcon icon={Alert01Icon} size={10} variant="stroke" strokeWidth={2} />
                  COST SPIKE
                </div>
             </div>

             <div className="flex items-end justify-between gap-2 mb-10 h-24">
                {CHART_BARS.map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full">
                    <div 
                      className={`w-full bg-[#6366f1] rounded-t-lg transition-all duration-700 ease-out`}
                      style={{ height: barsAnim ? `${b.val}%` : '0%', transitionDelay: `${i * 100}ms` }}
                    />
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{b.label}</span>
                  </div>
                ))}
             </div>

             <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Monthly Spend", val: "$2,840", clr: "text-white" },
                  { label: "AI Savings", val: "−18%", clr: "text-emerald-500" },
                  { label: "Spikes Found", val: "3", clr: "text-red-500" },
                ].map((s, i) => (
                  <div key={i} className="bg-[#0e0e0e] rounded-2xl p-4 border border-white/5 text-center">
                    <p className={`text-xl font-headline font-black italic tracking-tighter ${s.clr}`}>{s.val}</p>
                    <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest mt-1">{s.label}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* ── Synergy / Comparison Table ── */}
      <div
        ref={tableRef}
        className={`mb-40 transition-all duration-1000 ${tableVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        <div className="text-center mb-16 space-y-4">
          <p className="text-[10px] font-black text-[#6366f1] uppercase tracking-[0.4em]">PLATFORM COMPARISON</p>
          <h2 className="text-4xl md:text-6xl font-headline font-black italic uppercase tracking-tighter">Complete synergy.</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto uppercase tracking-wider font-bold">
            Neither LeetCode nor GitHub was built for student teams. Colloabuilder is the
            bridge that connects learning with professional output.
          </p>
        </div>

        <div className="max-w-5xl mx-auto overflow-x-auto rounded-[2.5rem] border border-white/10 bg-[#1c1c1a] shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 uppercase tracking-widest italic">
                <th className="p-8 text-[11px] font-black text-slate-600">PLATFORM EDGE</th>
                <th className="p-8 text-[11px] font-black text-[#6366f1] bg-white/[0.02] flex items-center gap-2">
                  COLLOABUILDER
                  <HugeiconsIcon icon={StarIcon} size={12} className="text-[#6366f1]" variant="stroke" strokeWidth={2} />
                </th>
                <th className="p-8 text-[11px] font-black text-slate-700">LEETCODE</th>
                <th className="p-8 text-[11px] font-black text-slate-700">GITHUB</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row, i) => (
                <tr key={i} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.01] transition-colors">
                  <td className="p-8 text-sm font-bold text-slate-400">{row.feature}</td>
                  <td className="p-8 text-center bg-white/[0.02]">
                    {row.us ? <span className="text-[#6366f1]"><HugeiconsIcon icon={Tick02Icon} size={18} variant="stroke" strokeWidth={2.5} /></span> : <span className="text-slate-800">—</span>}
                  </td>
                  <td className="p-8 text-center">
                    {row.leet ? <span className="text-slate-700 opacity-40"><HugeiconsIcon icon={Tick02Icon} size={14} variant="stroke" strokeWidth={2} /></span> : <span className="text-slate-800">—</span>}
                  </td>
                  <td className="p-8 text-center">
                    {row.gh ? <span className="text-slate-700 opacity-40"><HugeiconsIcon icon={Tick02Icon} size={14} variant="stroke" strokeWidth={2} /></span> : <span className="text-slate-800">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div
        ref={ctaRef}
        className={`relative rounded-[3.5rem] overflow-hidden transition-all duration-1000 ${ctaVis ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* Background Grid */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-8 opacity-10 pointer-events-none">
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className="border-r border-b border-white/10" />
          ))}
        </div>
        
        {/* Glow Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#6366f1]/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />

        <div className="relative z-10 bg-[#0e0e0e] border border-white/10 rounded-[3.5rem] p-12 md:p-24 text-center">
          <div className="w-16 h-16 bg-[#6366f1] rounded-2xl mx-auto flex items-center justify-center text-white font-headline font-black text-3xl italic mb-10 shadow-2xl shadow-[#6366f1]/20">C</div>
          <h2 className="text-4xl md:text-7xl font-headline font-black italic uppercase tracking-tighter leading-none mb-6">
            Stop building in isolation.<br />
            Start building <span className="text-[#6366f1]">together.</span>
          </h2>
          <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto mb-12 font-medium">
            Join 12,000+ developers already shipping real products as a team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/signup" className="bg-[#6366f1] text-white px-10 py-5 rounded-full text-base font-black uppercase tracking-widest italic hover:scale-105 transition-all shadow-2xl shadow-[#6366f1]/10">
              Join Colloabuilder Today →
            </Link>
            <Link to="/dashboard" className="border border-white/20 text-white px-10 py-5 rounded-full text-base font-bold uppercase tracking-widest italic hover:border-white transition-all">
              View Live Projects
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
