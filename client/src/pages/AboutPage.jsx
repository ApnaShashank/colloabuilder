import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft02Icon, UserGroupIcon, ZapIcon, Target02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const AboutPage = () => {
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

      <main className="max-w-4xl mx-auto py-24 px-6 text-center">
        <div className="mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#f5c518]/10 border border-[#f5c518]/20 rounded-full mb-8">
            <HugeiconsIcon icon={Target02Icon} size={14} className="text-[#f5c518]" />
            <span className="text-[10px] font-black text-[#f5c518] uppercase tracking-[0.2em]">Our Mission</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-headline font-black italic uppercase tracking-tighter leading-none mb-12">
            Bridging the gap<br />for the next<br /><span className="text-[#f5c518]">Generation.</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Colloabuilder was born out of a simple observation: students are great at solving problems but struggle to build real software. We're here to change that.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            { title: "12K+", label: "Active Builders" },
            { title: "8.9K+", label: "Projects Shipped" },
            { title: "150K+", label: "Problems Solved" },
          ].map((stat, i) => (
            <div key={i} className="p-8 border border-white/5 bg-white/[0.02] rounded-[2.5rem]">
              <h4 className="text-4xl font-headline font-black italic uppercase tracking-tight text-white mb-2">{stat.title}</h4>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="text-left space-y-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black italic uppercase tracking-tight">The Problem</h2>
          <p className="text-slate-500 leading-relaxed">
            Standard educational platforms focus on isolated data structures and algorithms. While critical, they don't teach the "Full Stack" of engineering: collaboration, version control, code reviews, and deployment.
          </p>
          <h2 className="text-3xl font-black italic uppercase tracking-tight">The Solution</h2>
          <p className="text-slate-500 leading-relaxed">
            Colloabuilder provides a unified workspace where you learn DSA, then immediately apply it in team projects. Every project you build is auto-verified, creating a digital proof-of-skill that recruiters actually trust.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
