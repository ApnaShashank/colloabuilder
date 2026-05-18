import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft02Icon, ZapIcon, SparklesIcon, RocketIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const ChangelogPage = () => {
  const updates = [
    {
      date: "April 2026",
      version: "v2.4.0",
      title: "Team Workspace Overhaul",
      desc: "Introduced real-time collaboration features and integrated Git version control directly into the project dashboard.",
      tags: ["Feature", "Dashboard"]
    },
    {
      date: "March 2026",
      version: "v2.3.5",
      title: "Practice Arena API",
      desc: "New algorithmic challenges added with support for 12+ programming languages and automated hints.",
      tags: ["Content", "Learning"]
    },
    {
      date: "February 2026",
      version: "v2.2.0",
      title: "Verified Portfolios",
      desc: "Launched auto-updating portfolios that reflect your team project contributions to recruiters.",
      tags: ["Portfolio", "Career"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#111110] text-white font-body selection:bg-[#f5c518] selection:text-black">
      {/* Header */}
      <header className="px-6 md:px-12 py-8 flex items-center justify-between border-b border-white/5">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-all">
            <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors italic">Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#f5c518] rounded-lg flex items-center justify-center text-black font-headline font-black text-lg italic">C</div>
          <span className="text-sm font-black tracking-tighter uppercase italic text-white">colloabuilder</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-24 px-6">
        <div className="mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#f5c518]/10 border border-[#f5c518]/20 rounded-full mb-8">
            <HugeiconsIcon icon={SparklesIcon} size={14} className="text-[#f5c518]" />
            <span className="text-[10px] font-black text-[#f5c518] uppercase tracking-[0.2em]">Latest Updates</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black italic uppercase tracking-tighter leading-none mb-8">
            What's New in<br />Colloabuilder.
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
            We're constantly building. Stay updated with the latest features, improvements, and system patches.
          </p>
        </div>

        <div className="space-y-12">
          {updates.map((update, i) => (
            <div key={i} className="relative pl-12 border-l border-white/10 pb-12 last:pb-0">
              <div className="absolute top-0 left-[-6px] w-3 h-3 bg-[#f5c518] rounded-full shadow-[0_0_15px_rgba(245,197,24,0.5)]" />
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="text-[10px] font-black text-[#f5c518] uppercase tracking-[0.2em] italic">{update.date}</span>
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-slate-400">{update.version}</span>
                <div className="flex gap-2">
                  {update.tags.map(tag => (
                    <span key={tag} className="text-[8px] font-black uppercase tracking-widest text-slate-600 border border-white/5 px-2 py-0.5 rounded italic">{tag}</span>
                  ))}
                </div>
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tight mb-4">{update.title}</h3>
              <p className="text-slate-500 leading-relaxed max-w-2xl">{update.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ChangelogPage;
