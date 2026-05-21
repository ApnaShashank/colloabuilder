"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  CodeIcon,
  UserGroupIcon,
  Award01Icon,
  Briefcase02Icon,
  ZapIcon,
  RocketIcon,
  StarIcon,
  SparklesIcon,
  Book02Icon,
  ArrowDown01Icon,
  SquareLock02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";

/* ─── Nav config ─────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    label: "Products",
    layout: "grid",
    items: [
      { label: "Practice Arena",     desc: "500+ DSA challenges with editorial hints",  icon: CodeIcon,        href: "/dashboard/practice",  accent: "#B54B00" },
      { label: "Team Workspaces",    desc: "Multi-user projects with PR reviews",        icon: UserGroupIcon,   href: "/dashboard/teams",     accent: "#3b82f6" },
      { label: "Verified Portfolio", desc: "Auto-verified work recruiters can preview",  icon: Award01Icon,     href: "/dashboard/portfolio", accent: "#10b981" },
      { label: "Careers Hub",        desc: "Direct connections to top hiring companies", icon: Briefcase02Icon, href: "/dashboard/careers",   accent: "#f59e0b" },
    ],
  },
  {
    label: "Features",
    layout: "strip",
    items: [
      { label: "Real-time Collab",    desc: "Multi-user live workspaces",   icon: ZapIcon,      href: "#",                     accent: "#3b82f6" },
      { label: "Deploy Pipeline",     desc: "One-click preview URLs",       icon: RocketIcon,   href: "#",                     accent: "#B54B00" },
      { label: "Ranking System",      desc: "Compete globally with peers",  icon: StarIcon,     href: "/dashboard/leaderboard",accent: "#f59e0b" },
      { label: "AI Mentorship",       desc: "Smart hints & code reviews",   icon: SparklesIcon, href: "/dashboard/ai",         accent: "#8b5cf6" },
    ],
  },
  {
    label: "Plans",
    layout: "plans",
    items: [
      { label: "Starter",    desc: "Free forever",          price: "$0",     icon: RocketIcon,       href: "#",            accent: "#6b7280" },
      { label: "Pro",        desc: "For serious builders",  price: "$12/mo", icon: ZapIcon,          href: "#",            accent: "#B54B00" },
      { label: "Enterprise", desc: "Custom & scalable",     price: "Custom", icon: SquareLock02Icon, href: "#",            accent: "#3b82f6" },
    ],
  },
  {
    label: "About",
    layout: "list",
    items: [
      { label: "Our Mission",   desc: "Why we build Colloabuilder", icon: InformationCircleIcon, href: "/about",    accent: "#B54B00" },
      { label: "Changelog",     desc: "Latest updates & releases",  icon: ZapIcon,               href: "/changelog",accent: "#10b981" },
      { label: "Documentation", desc: "Guides & API reference",     icon: Book02Icon,            href: "/docs",     accent: "#6b7280" },
    ],
  },
];

/* ─── Ticker items ────────────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  "Practice DSA", "Ship Real Projects", "Collaborate Live",
  "Climb the Leaderboard", "Get Hired Faster", "AI Code Reviews",
  "Deploy in Seconds", "Build With Teams",
];

/* ─── Stats ───────────────────────────────────────────────────────────────── */
const STATS = [
  { val: 12000, suffix: "+", label: "Developers" },
  { val: 3400,  suffix: "+", label: "Active Teams" },
  { val: 8900,  suffix: "+", label: "Projects Shipped" },
  { val: 150,   suffix: "K+", label: "Problems Solved" },
];

/* ─── Counter hook ────────────────────────────────────────────────────────── */
function useCounter(target: number, duration = 1800, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
}

/* ─── Stat tile ───────────────────────────────────────────────────────────── */
function StatTile({ stat, started, index }: { stat: typeof STATS[0]; started: boolean; index: number }) {
  const count = useCounter(stat.val, 1600, started);
  const borderClass = [
    "border-r border-b md:border-b-0 border-white/[0.06]", // index 0
    "border-b md:border-r md:border-b-0 border-white/[0.06]", // index 1
    "border-r md:border-r border-white/[0.06]", // index 2
    "border-white/[0.06]", // index 3
  ][index] || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex flex-col gap-1 px-8 py-6 ${borderClass}`}
    >
      <span className="font-headline font-black text-3xl md:text-4xl text-white tabular-nums">
        {count.toLocaleString()}{stat.suffix}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-600 group-hover:text-neutral-400 transition-colors">
        {stat.label}
      </span>
    </motion.div>
  );
}

/* ─── Marquee ─────────────────────────────────────────────────────────────── */
function Marquee() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative w-full overflow-hidden border-t border-b border-white/[0.06] py-4 my-16">
      {/* fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-black to-transparent z-10" />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        className="flex gap-12 whitespace-nowrap will-change-transform"
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-neutral-700">
            <span className="w-1 h-1 rounded-full bg-[#B54B00] flex-shrink-0" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Magnetic glow that follows cursor ─────────────────────────────────── */
function MagneticGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ left: 0, top: 0 }}
    >
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          x: useTransform(springX, v => v - 250),
          y: useTransform(springY, v => v - 250),
          background: "radial-gradient(circle, rgba(181,75,0,0.08) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

/* ─── Grid overlay ────────────────────────────────────────────────────────── */
function GridOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />
  );
}

/* ─── Live Eye ─────────────────────────────────────────────────────────────── */
function LiveEye() {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // Track mouse → move pupil inside eye bounds
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const el = eyeRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 6;
      const scale = Math.min(dist, maxDist) / (dist || 1);
      setPupil({ x: dx * scale, y: dy * scale });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Random blink every 2–5 seconds
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
      const next = 2000 + Math.random() * 3000;
      setTimeout(blink, next);
    };
    const t = setTimeout(blink, 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      className="mb-12"
    >
      {/* Outer box */}
      <div
        ref={eyeRef}
        className="relative inline-flex items-center justify-center w-14 h-9 border border-white/[0.12] rounded-xl bg-white/[0.03] overflow-hidden cursor-none"
        style={{ boxShadow: "0 0 0 1px rgba(181,75,0,0.15) inset" }}
      >
        {/* Eyelid — blink overlay */}
        <motion.div
          animate={{ scaleY: isBlinking ? 1 : 0 }}
          transition={{ duration: 0.08, ease: "easeInOut" }}
          style={{ originY: 0 }}
          className="absolute inset-0 bg-[#0a0a0a] z-10 rounded-xl"
        />

        {/* Eyeball */}
        <div className="relative w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center overflow-hidden">
          {/* Iris */}
          <motion.div
            animate={{ x: pupil.x, y: pupil.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute w-3 h-3 rounded-full bg-[#B54B00]/80 flex items-center justify-center"
          >
            {/* Pupil */}
            <div className="w-1.5 h-1.5 rounded-full bg-black" />
            {/* Glint */}
            <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 rounded-full bg-white/60" />
          </motion.div>
        </div>

        {/* Corner accent lines */}
        <div className="absolute top-1 left-1 w-2 h-px bg-[#B54B00]/30" />
        <div className="absolute top-1 left-1 w-px h-2 bg-[#B54B00]/30" />
        <div className="absolute bottom-1 right-1 w-2 h-px bg-[#B54B00]/30" />
        <div className="absolute bottom-1 right-1 w-px h-2 bg-[#B54B00]/30" />
      </div>
    </motion.div>
  );
}

/* ─── Word reveal animation ───────────────────────────────────────────────── */
const WORDS = ["Build.", "Collaborate.", "Ship."];

function WordCycler() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block overflow-hidden leading-none h-[1em]">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 text-[#B54B00]"
        >
          {WORDS[idx]}
        </motion.span>
      </AnimatePresence>
      {/* invisible width placeholder */}
      <span className="invisible">{WORDS.reduce((a, b) => a.length > b.length ? a : b)}</span>
    </span>
  );
}

/* ─── Main Hero ────────────────────────────────────────────────────────────── */
export default function Hero() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Trigger counters when stats row scrolls into view */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* char-by-char stagger for heading words */
  const headingLine1 = "Where Students";
  const headingLine2 = "Learn. ";

  const charVariant = {
    hidden: { opacity: 0, y: 30, rotateX: -40 },
    show:   { opacity: 1, y: 0,  rotateX: 0,
      transition: { type: "spring" as any, stiffness: 200, damping: 24 } },
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden text-white">
      <MagneticGlow />
      <GridOverlay />

      {/* Ambient blobs — just 2, subtle */}
      <div className="pointer-events-none absolute -top-60 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#B54B00]/8 rounded-full blur-[160px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[300px] bg-[#B54B00]/5 rounded-full blur-[120px]" />

      {/* ── FLOATING NAVBAR ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4">
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex flex-col md:flex-row md:items-center justify-between gap-x-4 px-6 py-3 rounded-2xl border transition-all duration-500 w-full max-w-5xl ${
            scrolled
              ? "bg-black/90 border-white/[0.08] backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.8)]"
              : "bg-white/[0.02] border-white/[0.04] backdrop-blur-md"
          }`}
        >
          {/* Header Row (Logo + Mobile Controls) */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link href="/" className="flex items-center gap-3 flex-shrink-0" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-8 h-8 bg-[#B54B00] rounded-lg flex items-center justify-center font-black text-white italic text-sm">
                C
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white italic">
                Colloabuilder
              </span>
            </Link>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Theme Toggle Button for Mobile */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-neutral-400"
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === "dark" ? (
                    <motion.span
                      key="sun"
                      initial={{ rotate: -45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 45, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="inline-flex"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#B54B00]">
                        <circle cx="12" cy="12" r="4"/>
                        <path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
                      </svg>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={{ rotate: -45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 45, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="inline-flex"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-amber-500">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Hamburger Button */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center text-neutral-400"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 45, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="inline-flex"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
                        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                      </svg>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: -45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 45, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="inline-flex"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-neutral-400">
                        <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Nav links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {/* Trigger button */}
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors group">
                  {item.label}
                  <motion.span
                    animate={{ rotate: activeDropdown === item.label ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex"
                  >
                    <HugeiconsIcon icon={ArrowDown01Icon} size={10} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full pt-3 z-50"
                      style={{
                        left: item.layout === "strip" || item.layout === "plans" ? "50%" : "0",
                        transform: item.layout === "strip" || item.layout === "plans" ? "translateX(-50%)" : "translateX(-20%)",
                      }}
                    >
                      {/* ─ PRODUCTS: 2-col grid ─ */}
                      {item.layout === "grid" && (
                        <div className="bg-[#080808] border border-white/[0.07] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.8)] w-[380px]">
                          {/* header strip */}
                          <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#B54B00]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-neutral-700">Platform Modules</span>
                          </div>
                          <div className="grid grid-cols-2 gap-px bg-white/[0.04] p-px">
                            {item.items.map((sub: any, i: number) => (
                              <motion.div
                                key={sub.label}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                              >
                                <Link
                                  href={sub.href}
                                  className="group flex flex-col gap-3 p-5 bg-[#080808] hover:bg-[#0f0f0f] transition-colors h-full"
                                >
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: `${sub.accent}15`, color: sub.accent }}
                                  >
                                    <HugeiconsIcon icon={sub.icon} size={15} />
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-black text-white uppercase tracking-tight group-hover:text-white/90">{sub.label}</p>
                                    <p className="text-[10px] text-neutral-700 mt-1 leading-relaxed">{sub.desc}</p>
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ─ FEATURES: horizontal strip ─ */}
                      {item.layout === "strip" && (
                        <div className="bg-[#080808] border border-white/[0.07] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.8)] w-[480px]">
                          <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#B54B00]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-neutral-700">Core Capabilities</span>
                          </div>
                          <div className="grid grid-cols-4 divide-x divide-white/[0.04]">
                            {item.items.map((sub: any, i: number) => (
                              <motion.div
                                key={sub.label}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                              >
                                <Link
                                  href={sub.href}
                                  className="group flex flex-col items-center gap-3 px-4 py-6 hover:bg-white/[0.03] transition-colors text-center"
                                >
                                  <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                                    style={{ backgroundColor: `${sub.accent}15`, color: sub.accent }}
                                  >
                                    <HugeiconsIcon icon={sub.icon} size={16} />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-tight leading-tight">{sub.label}</p>
                                    <p className="text-[9px] text-neutral-700 mt-1 leading-snug">{sub.desc}</p>
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ─ PLANS: mini pricing cards ─ */}
                      {item.layout === "plans" && (
                        <div className="bg-[#080808] border border-white/[0.07] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.8)] w-[400px]">
                          <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#B54B00]" />
                            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-neutral-700">Choose Your Plan</span>
                          </div>
                          <div className="grid grid-cols-3 divide-x divide-white/[0.04] p-0">
                            {item.items.map((sub: any, i: number) => (
                              <motion.div
                                key={sub.label}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                              >
                                <Link
                                  href={sub.href}
                                  className={`group flex flex-col gap-2 p-5 hover:bg-white/[0.03] transition-colors ${
                                    sub.label === "Pro" ? "bg-[#B54B00]/[0.04]" : ""
                                  }`}
                                >
                                  {sub.label === "Pro" && (
                                    <span className="text-[8px] font-black uppercase tracking-[0.25em] text-[#B54B00] mb-0.5">Popular</span>
                                  )}
                                  <p className="text-[12px] font-black text-white uppercase tracking-tight">{sub.label}</p>
                                  <p
                                    className="text-[15px] font-headline font-black leading-none"
                                    style={{ color: sub.accent }}
                                  >
                                    {(sub as any).price}
                                  </p>
                                  <p className="text-[9px] text-neutral-700 leading-snug mt-0.5">{sub.desc}</p>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                          <div className="px-5 py-3 border-t border-white/[0.05]">
                            <Link href="/signup" className="text-[9px] font-black uppercase tracking-[0.25em] text-[#B54B00] hover:text-[#D95E00] transition-colors">
                              View full pricing →
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* ─ ABOUT: stacked list ─ */}
                      {item.layout === "list" && (
                        <div className="bg-[#080808] border border-white/[0.07] rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.8)] w-[280px]">
                          <div className="px-5 py-3 border-b border-white/[0.05] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-[#B54B00]" />
                              <span className="text-[9px] font-black uppercase tracking-[0.35em] text-neutral-700">Company</span>
                            </div>
                            <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-emerald-500">
                              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                              All systems go
                            </span>
                          </div>
                          <div className="p-2">
                            {item.items.map((sub: any, i: number) => (
                              <motion.div
                                key={sub.label}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                              >
                                <Link
                                  href={sub.href}
                                  className="group flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/[0.04] transition-colors"
                                >
                                  <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: `${sub.accent}12`, color: sub.accent }}
                                  >
                                    <HugeiconsIcon icon={sub.icon} size={13} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[11px] font-black text-white uppercase tracking-tight">{sub.label}</p>
                                    <p className="text-[9px] text-neutral-700 mt-0.5">{sub.desc}</p>
                                  </div>
                                  <HugeiconsIcon icon={ArrowDown01Icon} size={10} className="text-neutral-800 group-hover:text-neutral-500 -rotate-90 ml-auto flex-shrink-0 transition-colors" />
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center text-neutral-400 hover:text-white"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#B54B00]">
                      <circle cx="12" cy="12" r="4"/>
                      <path d="M12 2v2"/>
                      <path d="M12 20v2"/>
                      <path d="m4.93 4.93 1.41 1.41"/>
                      <path d="m17.66 17.66 1.41 1.41"/>
                      <path d="M2 12h2"/>
                      <path d="M20 12h2"/>
                      <path d="m6.34 17.66-1.41 1.41"/>
                      <path d="m19.07 4.93-1.41 1.41"/>
                    </svg>
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber-500">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                    </svg>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {!user ? (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 bg-[#B54B00] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#9E4200] hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-[#B54B00]/20"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-[#B54B00] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#9E4200] hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-[#B54B00]/20"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* ── MOBILE DRAWER ── */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full md:hidden overflow-hidden mt-2 border-t border-white/[0.06] pt-4"
              >
                <div className="flex flex-col gap-5 pb-4">
                  {NAV_ITEMS.map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="space-y-2"
                    >
                      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#B54B00] px-1">{item.label}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {item.items.map((sub: any) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex flex-col gap-1 p-3.5 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:bg-white/[0.04] transition-all group"
                          >
                            <span className="text-[10px] font-black text-white uppercase tracking-tight group-hover:text-[#B54B00] transition-colors">{sub.label}</span>
                            <span className="text-[9px] text-neutral-600 line-clamp-1 leading-snug">{sub.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  {/* Auth row for mobile */}
                  {!user ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="flex gap-2 pt-4 border-t border-white/[0.04] mt-2"
                    >
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 py-3 text-center rounded-xl text-[10px] font-black uppercase tracking-widest text-neutral-500 border border-white/[0.06] hover:text-white hover:bg-white/[0.02] transition-all"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 py-3 text-center bg-[#B54B00] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#9E4200] transition-all"
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="pt-4 border-t border-white/[0.04] mt-2"
                    >
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-3.5 bg-[#B54B00] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#9E4200] transition-all text-center block"
                      >
                        Go to Dashboard
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>

      {/* ── HERO BODY ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 pt-28 pb-12">

        {/* Live Eye */}
        <LiveEye />

        {/* Main heading — char stagger */}
        <motion.div
          className="perspective-[800px] overflow-hidden"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.03, delayChildren: 0.25 } } }}
        >
          {/* Line 1 */}
          <div className="flex flex-wrap justify-center gap-x-[0.25em]">
            {["WHERE", "STUDENTS"].map((word, wordIdx) => (
              <span key={wordIdx} className="inline-block whitespace-nowrap">
                {word.split("").map((ch, i) => (
                  <motion.span
                    key={i}
                    variants={charVariant}
                    className="font-headline font-black text-[clamp(2.4rem,8vw,7rem)] leading-[0.9] tracking-tighter text-neutral-400 inline-block"
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            ))}
          </div>

          {/* Line 2 — cycler word */}
          <div className="font-headline font-black text-[clamp(2.8rem,8vw,7rem)] leading-[0.9] tracking-tighter text-white mt-1">
            <WordCycler />
          </div>
        </motion.div>

        {/* Sub-line */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-8 max-w-md text-[13px] text-neutral-600 leading-relaxed tracking-wide font-medium"
        >
          Master DSA. Ship production projects with elite teams.
          Bridge the gap between learning and getting hired.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center gap-3 mt-10"
        >
          {!user ? (
            <>
              <Link
                href="/signup"
                className="group relative px-9 py-4 bg-[#B54B00] text-white rounded-2xl text-[12px] font-black uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.03] active:scale-95 shadow-[0_8px_30px_rgba(181,75,0,0.35)]"
              >
                <span className="relative z-10">Start Free →</span>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/login"
                className="px-9 py-4 border border-white/[0.08] text-neutral-400 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:border-white/20 hover:text-white transition-all"
              >
                Sign In
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="px-9 py-4 bg-[#B54B00] text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:scale-[1.03] transition-all shadow-[0_8px_30px_rgba(181,75,0,0.35)]"
            >
              Resume Journey →
            </Link>
          )}
        </motion.div>

        {/* Marquee */}
        <div className="w-full max-w-5xl">
          <Marquee />
        </div>

        {/* Stats strip */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-3xl border border-white/[0.06] rounded-3xl overflow-hidden grid grid-cols-2 md:grid-cols-4"
        >
          {STATS.map((s, i) => (
            <StatTile key={i} index={i} stat={s} started={statsVisible} />
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.35em] text-neutral-700">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-neutral-700 to-transparent"
          />
        </motion.div>

      </div>
    </section>
  );
}
