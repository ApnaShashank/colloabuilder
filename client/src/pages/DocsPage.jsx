import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft02Icon, Book02Icon, CodeIcon, StarsIcon, HelpCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const DocsPage = () => {
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
            <HugeiconsIcon icon={Book02Icon} size={14} className="text-[#f5c518]" />
            <span className="text-[10px] font-black text-[#f5c518] uppercase tracking-[0.2em]">Documentation</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black italic uppercase tracking-tighter leading-none mb-8">
            Master the<br />Platform.
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
            Everything you need to know about building, collaborating, and shipping on Colloabuilder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: CodeIcon, title: "Getting Started", desc: "Learn how to set up your profile and join your first team workspace." },
            { icon: StarsIcon, title: "Practice Arena", desc: "How to solve algorithmic challenges and track your DSA progression." },
            { icon: HelpCircleIcon, title: "Team Workflows", desc: "Best practices for collaborating on projects and managing roles." },
            { icon: Book02Icon, title: "API Reference", desc: "Integrate your verified portfolio with external job platforms." },
          ].map((item, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-[#f5c518]/10 rounded-2xl flex items-center justify-center text-[#f5c518] mb-6 group-hover:scale-110 transition-transform">
                <HugeiconsIcon icon={item.icon} size={24} variant="stroke" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold italic uppercase tracking-tight mb-3">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DocsPage;
