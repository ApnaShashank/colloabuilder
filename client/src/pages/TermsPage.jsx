import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft02Icon, Book02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const TermsPage = () => {
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

      <main className="max-w-3xl mx-auto py-24 px-6">
        <div className="mb-20">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#f5c518]/10 border border-[#f5c518]/20 rounded-full mb-8">
            <HugeiconsIcon icon={Book02Icon} size={14} className="text-[#f5c518]" />
            <span className="text-[10px] font-black text-[#f5c518] uppercase tracking-[0.2em]">Legal</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black italic uppercase tracking-tighter leading-none mb-8">
            Terms of<br />Service.
          </h1>
          <p className="text-slate-500 text-sm italic font-bold uppercase tracking-widest">Last updated: April 2026</p>
        </div>

        <div className="space-y-12 prose prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-black italic uppercase tracking-tight mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-500 leading-relaxed">
              By accessing or using Colloabuilder, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-black italic uppercase tracking-tight mb-4">2. User Conduct</h2>
            <p className="text-slate-500 leading-relaxed">
              You are responsible for your use of the platform and for any content you provide. You agree not to engage in any activity that interferes with or disrupts the service or the servers and networks used to provide the service.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-black italic uppercase tracking-tight mb-4">3. Intellectual Property</h2>
            <p className="text-slate-500 leading-relaxed">
              All content provided on Colloabuilder is the property of Colloabuilder or its content suppliers and is protected by international copyright laws. Your own code and projects remain your property, but you grant us a license to host and display them as part of our service.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
