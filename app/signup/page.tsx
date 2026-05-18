"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { refreshUser } = useUser();

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
