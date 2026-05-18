import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft02Icon, Shield02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const PrivacyPage = () => {
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
            <HugeiconsIcon icon={Shield02Icon} size={14} className="text-[#f5c518]" />
            <span className="text-[10px] font-black text-[#f5c518] uppercase tracking-[0.2em]">Legal</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black italic uppercase tracking-tighter leading-none mb-8">
            Privacy<br />Policy.
          </h1>
          <p className="text-slate-500 text-sm italic font-bold uppercase tracking-widest">Last updated: April 2026</p>
        </div>

        <div className="space-y-12 prose prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-black italic uppercase tracking-tight mb-4">1. Data Collection</h2>
            <p className="text-slate-500 leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, build a team, or communicate with us. This includes your name, email address, and any project-related data you upload to the platform.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-black italic uppercase tracking-tight mb-4">2. Use of Information</h2>
            <p className="text-slate-500 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, including the Practice Arena and Team Workspaces. We also use it to personalize your experience and track your professional progression.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-black italic uppercase tracking-tight mb-4">3. Data Security</h2>
            <p className="text-slate-500 leading-relaxed">
              We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. Your verified portfolio data is secured and only shared with recruiters upon your explicit consent.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;
