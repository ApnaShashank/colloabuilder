"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail01Icon, AccessIcon, ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const router = useRouter();
  const { refreshUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setErrorCode(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json().catch(() => ({ error: "Server returned an invalid response" }));
      if (!response.ok) {
        setErrorCode(data.code || null);
        throw new Error(data.error || "Login failed");
      }
      localStorage.setItem("token", data.token);
      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
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
      <div className="pointer-events-none fixed top-0 right-0 w-[600px] h-[600px] bg-[#B54B00]/6 blur-[160px] rounded-full z-0" />

      {/* ── LEFT PANEL (desktop only) ── */}
      <div className="hidden lg:flex w-[44%] flex-col justify-between p-16 border-r border-white/[0.05] relative z-10">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-8 h-8 bg-[#B54B00] rounded-lg flex items-center justify-center font-black text-white italic text-sm">C</div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white italic">Colloabuilder</span>
        </Link>

        {/* Middle content */}
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-headline font-black text-[clamp(2.5rem,4vw,4rem)] uppercase tracking-tighter leading-[0.88] text-white"
          >
            Welcome<br />back.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[12px] text-neutral-600 leading-relaxed max-w-xs"
          >
            Continue building. Your projects, teams, and progress are waiting.
          </motion.p>

          {/* Mini stat strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex gap-8 pt-4 border-t border-white/[0.05]"
          >
            {[
              { val: "12K+", label: "Developers" },
              { val: "500+", label: "Challenges" },
              { val: "8.9K+", label: "Projects" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-headline font-black text-2xl text-white">{s.val}</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-700 mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom note */}
        <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-800">
          Secure · Encrypted · Private
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-700">Sign In</span>
            <h2 className="mt-3 font-headline font-black text-3xl uppercase tracking-tighter leading-none">
              Your account
            </h2>
            <p className="mt-3 text-[11px] text-neutral-600">
              No account?{" "}
              <Link href="/signup" className="text-[#B54B00] hover:text-[#D95E00] transition-colors font-bold">
                Create one free →
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-[11px] font-medium ${
                  errorCode === "WRONG_PASSWORD"
                    ? "bg-red-500/8 border-red-500/20 text-red-400"
                    : errorCode === "USER_NOT_FOUND"
                    ? "bg-amber-500/8 border-amber-500/20 text-amber-400"
                    : "bg-red-500/8 border-red-500/20 text-red-400"
                }`}
              >
                {/* Icon */}
                <span className="text-base leading-none mt-px flex-shrink-0">
                  {errorCode === "USER_NOT_FOUND" ? "✉" : "🔑"}
                </span>
                <div>
                  <p className="font-black uppercase tracking-wide text-[10px]">
                    {errorCode === "USER_NOT_FOUND" ? "Email not found" : errorCode === "WRONG_PASSWORD" ? "Wrong password" : "Login failed"}
                  </p>
                  <p className="mt-0.5 opacity-80">{error}</p>
                  {errorCode === "USER_NOT_FOUND" && (
                    <Link href="/signup" className="inline-block mt-1.5 text-amber-400 hover:text-amber-300 font-black uppercase tracking-widest text-[9px] underline underline-offset-2">
                      Create a new account →
                    </Link>
                  )}
                </div>
              </motion.div>
            )}

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
                  placeholder="••••••••"
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
              <span className="relative z-10">{isSubmitting ? "Signing in…" : "Sign In"}</span>
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/[0.05]">
            <p className="text-center text-[10px] text-neutral-700 uppercase tracking-[0.3em]">
              Protected by 256-bit encryption
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
