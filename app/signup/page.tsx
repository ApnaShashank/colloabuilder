"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail01Icon, AccessIcon, ViewIcon, ViewOffSlashIcon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useUser } from "@/context/UserContext";

const PERKS = [
  "500+ DSA problems with editorial hints",
  "Real team workspaces & collaboration",
  "Auto-verified portfolio for recruiters",
  "Global leaderboard & XP rankings",
  "AI-powered code reviews & mentorship",
];

function SignupContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useUser();

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) {
      setError(`Authentication Error: ${err}`);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json().catch(() => ({ error: "Server returned an invalid response" }));
      if (!response.ok) throw new Error(data.error || "Registration failed");
      localStorage.setItem("token", data.token);
      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex text-white overflow-hidden">

      {/* Grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025] z-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient glow */}
      <div className="pointer-events-none fixed bottom-0 left-0 w-[500px] h-[500px] bg-[#B54B00]/6 blur-[160px] rounded-full z-0" />

      {/* ── LEFT PANEL (form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-7 h-7 bg-[#B54B00] rounded-md flex items-center justify-center font-black text-white italic text-xs">C</div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Colloabuilder</span>
          </Link>

          <div className="mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-700">Create Account</span>
            <h2 className="mt-3 font-headline font-black text-3xl uppercase tracking-tighter leading-none">
              Start building.
            </h2>
            <p className="mt-3 text-[11px] text-neutral-600">
              Already have one?{" "}
              <Link href="/login" className="text-[#B54B00] hover:text-[#D95E00] transition-colors font-bold">
                Sign in →
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/8 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-[11px] font-bold"
              >
                {error}
              </motion.div>
            )}

            <div className="flex gap-3">
              <a href="/api/auth/oauth/github" className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all text-white text-[11px] font-bold tracking-wider">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path></svg>
                GITHUB
              </a>
              <a href="/api/auth/oauth/google" className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all text-white text-[11px] font-bold tracking-wider">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>
                GOOGLE
              </a>
            </div>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/[0.08]"></div>
              <span className="flex-shrink-0 mx-4 text-neutral-600 text-[9px] uppercase tracking-widest font-bold">Or sign up with email</span>
              <div className="flex-grow border-t border-white/[0.08]"></div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-[0.35em] text-neutral-700">Full Name</label>
              <div className="relative group">
                <HugeiconsIcon
                  icon={UserIcon}
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-[#B54B00] transition-colors"
                />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3.5 pl-11 pr-4 text-white text-[13px] placeholder:text-neutral-700 focus:outline-none focus:border-[#B54B00]/40 focus:bg-[#B54B00]/[0.03] transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-[0.35em] text-neutral-700">Email</label>
              <div className="relative group">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-[#B54B00] transition-colors"
                />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3.5 pl-11 pr-4 text-white text-[13px] placeholder:text-neutral-700 focus:outline-none focus:border-[#B54B00]/40 focus:bg-[#B54B00]/[0.03] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-[0.35em] text-neutral-700">Password</label>
              <div className="relative group">
                <HugeiconsIcon
                  icon={AccessIcon}
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700 group-focus-within:text-[#B54B00] transition-colors"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3.5 pl-11 pr-12 text-white text-[13px] placeholder:text-neutral-700 focus:outline-none focus:border-[#B54B00]/40 focus:bg-[#B54B00]/[0.03] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-700 hover:text-white transition-colors"
                >
                  <HugeiconsIcon icon={showPassword ? ViewOffSlashIcon : ViewIcon} size={15} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-[#B54B00] text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#9E4200] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 disabled:scale-100 shadow-lg shadow-[#B54B00]/20 relative overflow-hidden group"
            >
              <span className="relative z-10">{isSubmitting ? "Creating account…" : "Create Free Account"}</span>
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <p className="text-center text-[10px] text-neutral-700 pt-1">
              By signing up you agree to our{" "}
              <span className="text-neutral-600 hover:text-white cursor-pointer transition-colors">Terms</span>{" "}
              &{" "}
              <span className="text-neutral-600 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            </p>
          </form>
        </motion.div>
      </div>

      {/* ── RIGHT PANEL (desktop only) ── */}
      <div className="hidden lg:flex w-[44%] flex-col justify-between p-16 border-l border-white/[0.05] relative z-10">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-8 h-8 bg-[#B54B00] rounded-lg flex items-center justify-center font-black text-white italic text-sm">C</div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white italic">Colloabuilder</span>
        </Link>

        {/* Middle content */}
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="font-headline font-black text-[clamp(2rem,3.5vw,3.5rem)] uppercase tracking-tighter leading-[0.88] text-white">
              Everything<br />you need to<br />
              <span className="text-neutral-600">get hired.</span>
            </h2>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {PERKS.map((perk, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-start gap-3 text-[12px] text-neutral-500"
              >
                <span className="w-1 h-1 rounded-full bg-[#B54B00] flex-shrink-0 mt-1.5" />
                {perk}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#B54B00]/20 bg-[#B54B00]/5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B54B00] animate-pulse" />
            <span className="text-[10px] font-black text-[#B54B00] uppercase tracking-[0.3em]">Free forever · No card needed</span>
          </motion.div>
        </div>

        {/* Bottom note */}
        <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-800">
          Secure · Encrypted · Private
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SignupContent />
    </Suspense>
  );
}
