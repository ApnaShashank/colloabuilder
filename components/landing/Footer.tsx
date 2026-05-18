"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useUser } from "@/context/UserContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { user } = useUser();

  return (
    <footer className="bg-[#000000] pt-20 pb-10 px-4 md:px-12 text-white relative">
      <div className="max-w-7xl mx-auto">
        
        {/* ── INTEGRATED CTA + WORDMARK CONTAINER ── */}
        <div className="relative rounded-[2.5rem] border border-[#27272a] bg-[#121212] overflow-hidden p-8 md:p-16">
          
          {/* Header Part */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-32">
            <div className="max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B54B00] mb-6 block">
                READY TO START?
              </span>
              <h2 className="text-4xl md:text-6xl font-headline font-black italic uppercase tracking-tighter leading-[0.95] mb-8">
                Start building<br />the future of software.
              </h2>
              <p className="text-[#B9BAC6] text-[15px] max-w-sm leading-relaxed font-medium opacity-70">
                Join the elite community of developers. Build real projects, 
                master DSA, and ship production-ready code in seconds.
              </p>
            </div>

            {/* CTA Buttons - Stacked on the right like in the image */}
            <div className="flex flex-col gap-4 w-full sm:w-auto">
              {!user ? (
                <>
                  <Link
                    href="/signup"
                    className="group flex items-center justify-between gap-12 px-8 py-4 bg-[#B54B00] text-white rounded-full text-[13px] font-black uppercase tracking-widest hover:bg-[#9E4200] transition-all duration-300 shadow-xl shadow-[#B54B00]/20"
                  >
                    <span>Start Building</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center justify-center px-8 py-4 bg-white text-black rounded-full text-[13px] font-black uppercase tracking-widest hover:bg-[#E2E2E2] transition-all duration-300"
                  >
                    Explore Projects
                  </Link>
                </>
              ) : (
                <Link
                  href="/dashboard"
                  className="group flex items-center justify-between gap-12 px-8 py-4 bg-[#B54B00] text-white rounded-full text-[13px] font-black uppercase tracking-widest hover:bg-[#9E4200] transition-all duration-300 shadow-xl shadow-[#B54B00]/20"
                >
                  <span>Back to Dashboard</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              )}
            </div>
          </div>

          {/* Divider Line */}
          <div className="w-full h-px bg-white/5 mb-16" />

          {/* ── HUGE WORDMARK ── */}
          <div className="mb-20 select-none overflow-hidden text-center group cursor-pointer">
            <h1 
              className="text-[10vw] md:text-[9vw] font-headline font-black text-white uppercase tracking-tighter leading-none italic transition-all duration-500 group-hover:text-[#B54B00]"
              style={{
                textRendering: "optimizeLegibility",
                WebkitTextStroke: "1px rgba(255,255,255,0.05)",
                letterSpacing: "-0.04em"
              }}
            >
              COLLOABUILDER
            </h1>
            {/* Thick white line that appears on hover */}
            <div className="h-1.5 md:h-3 bg-white w-0 group-hover:w-[80%] transition-all duration-700 mx-auto mt-4 rounded-full opacity-0 group-hover:opacity-100" />
          </div>

          {/* ── FOOTER BOTTOM BAR (INSIDE BOX) ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10">
            <p className="text-[10px] font-black text-[#B9BAC6]/40 uppercase tracking-[0.2em]">
              © {year} Colloabuilder Engineering Group
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-[#B9BAC6]/40 uppercase tracking-[0.2em]">
                Powered by
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.03] border border-white/5 rounded-md">
                <div className="w-2.5 h-2.5 bg-[#B54B00] rounded-sm" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">
                  Colloa Intelligence
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Outer bottom links (Optional, keeping it clean) */}
        <div className="flex justify-center gap-10 mt-12 mb-6">
           {["Privacy", "Terms", "Changelog", "Careers"].map((link) => (
             <Link 
               key={link} 
               href={`/${link.toLowerCase()}`}
               className="text-[10px] font-black text-neutral-700 hover:text-white uppercase tracking-[0.3em] transition-colors"
             >
               {link}
             </Link>
           ))}
        </div>
      </div>
    </footer>
  );
}
