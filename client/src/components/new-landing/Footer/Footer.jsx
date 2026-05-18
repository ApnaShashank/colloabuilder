import React, { useState } from "react";
import { Link } from "react-router-dom";

const NAV_COLS = [
  {
    heading: "Platform",
    links: [
      { label: "Practice Arena", href: "/dashboard/practice" },
      { label: "Team Projects",  href: "/dashboard/teams" },
      { label: "Leaderboard",   href: "/dashboard/leaderboard" },
      { label: "Roadmap",       href: "/dashboard/roadmap" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Portfolio", href: "/dashboard/portfolio" },
      { label: "Careers",   href: "/dashboard/careers" },
      { label: "Docs",      href: "/docs" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy Policy",    href: "/privacy" },
      { label: "Terms of Service",  href: "/terms" },
    ],
  },
];

export default function Footer() {
  const [year] = useState(new Date().getFullYear());

  return (
    <footer className="bg-[#111110] pt-32 pb-12 px-6 md:px-12 relative overflow-hidden font-body text-white">
      
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-24">
          <div className="lg:max-w-md">
            <h2 className="text-4xl md:text-5xl font-headline font-black italic uppercase tracking-tighter leading-tight">
              Experience<br />liftoff
            </h2>
            <p className="mt-6 text-slate-500 text-sm max-w-xs leading-relaxed uppercase tracking-widest font-bold">
              The only platform that bridges the gap between learning and engineering.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
            {NAV_COLS.map((col) => (
              <div key={col.heading} className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">
                  {col.heading}
                </h4>
                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        to={link.href} 
                        className="text-sm font-bold text-slate-400 hover:text-[#6366f1] transition-colors whitespace-nowrap"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Section: Massive Watermark */}
        <div className="mb-20 pointer-events-none select-none">
          <h1 className="text-[11vw] font-headline font-black text-white/[0.03] uppercase tracking-tighter leading-[0.8] text-center w-full">
            Colloabuilder
          </h1>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center text-white font-headline font-black text-lg italic shadow-2xl shadow-[#6366f1]/10">C</div>
            <span className="text-sm font-black tracking-tighter uppercase italic text-white">colloabuilder</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link to="/about" className="text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors italic">About</Link>
            <Link to="/privacy" className="text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors italic">Privacy</Link>
            <Link to="/terms" className="text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors italic">Terms</Link>
            <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">
              © {year} All rights reserved.
            </span>
          </div>
        </div>
      </div>
      
      {/* Decorative Orbs to match the premium feel */}
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6366f1] rounded-full blur-[120px] opacity-[0.03] pointer-events-none" />
    </footer>
  );
}
