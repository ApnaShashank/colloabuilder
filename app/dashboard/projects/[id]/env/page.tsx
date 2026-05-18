"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  KeyRound, Plus, Trash2, Eye, EyeOff,
  Save, Loader2, ShieldCheck, AlertTriangle, X
} from "lucide-react";

interface EnvVar {
  _id: string;
  key: string;
  value: string;
  environment: "production" | "preview" | "all";
}

const ENV_COLORS: Record<string, string> = {
  production: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  preview:    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  all:        "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function EnvVarsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newEnv, setNewEnv] = useState<"production" | "preview" | "all">("production");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const fetchEnvVars = async () => {
    try {
      const res = await fetch(`/api/projects/${id}/env`);
      const data = await res.json();
      if (data.success) setEnvVars(data.envVars);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => { fetchEnvVars(); }, [id]);

  const handleSave = async () => {
    if (!newKey.trim() || !newValue.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}/env`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newKey.trim(), value: newValue.trim(), environment: newEnv }),
      });
      const data = await res.json();
      if (data.success) {
        setNewKey("");
        setNewValue("");
        setNewEnv("production");
        setShowAdd(false);
        fetchEnvVars();
      }
    } catch (err) {}
    setSaving(false);
  };

  const handleDelete = async (envId: string) => {
    setDeletingId(envId);
    try {
      await fetch(`/api/projects/${id}/env`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ envId }),
      });
      setEnvVars(prev => prev.filter(v => v._id !== envId));
    } catch (err) {}
    setDeletingId(null);
  };

  const toggleReveal = (envId: string) => {
    setRevealedIds(prev => {
      const next = new Set(prev);
      next.has(envId) ? next.delete(envId) : next.add(envId);
      return next;
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-black text-xl uppercase tracking-tight text-white italic flex items-center gap-3">
            <KeyRound size={20} className="text-primary" />
            Environment Variables
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-headline font-black uppercase tracking-widest">
            Secrets injected at build time
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-headline font-black uppercase italic tracking-tight text-[11px] text-white"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        >
          <Plus size={14} />
          Add Variable
        </button>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
        <ShieldCheck size={16} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-[11px] text-amber-300/70 leading-relaxed">
          Values are masked and encrypted before storage. They are only injected into your containers at deploy time and never exposed in logs or the UI.
        </p>
      </div>

      {/* Env Vars Table */}
      <div className="bg-surface/40 border border-white/5 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_3fr_auto_auto] gap-4 px-6 py-3 border-b border-white/5 bg-white/[0.02]">
          {["Variable Name", "Value", "Environment", ""].map(h => (
            <span key={h} className="text-[9px] font-headline font-black uppercase tracking-[0.2em] text-slate-600">
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={20} className="animate-spin text-primary" />
          </div>
        ) : envVars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <KeyRound size={32} className="text-slate-700" />
            <p className="text-[11px] font-headline font-black uppercase tracking-widest text-slate-600">
              No variables yet
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="text-[10px] text-primary hover:text-primary/80 font-headline font-black uppercase tracking-widest transition-colors"
            >
              + Add your first variable
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {envVars.map(v => (
              <motion.div
                key={v._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-[2fr_3fr_auto_auto] gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group"
              >
                <span className="text-[12px] font-mono text-emerald-300 font-bold tracking-wide">
                  {v.key}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400 truncate">
                    {revealedIds.has(v._id) ? v.value : v.value}
                  </span>
                  <button
                    onClick={() => toggleReveal(v._id)}
                    className="text-slate-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {revealedIds.has(v._id) ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
                <span className={`px-3 py-1 rounded-full border text-[9px] font-headline font-black uppercase tracking-widest w-fit ${ENV_COLORS[v.environment]}`}>
                  {v.environment}
                </span>
                <button
                  onClick={() => handleDelete(v._id)}
                  disabled={deletingId === v._id}
                  className="text-slate-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                >
                  {deletingId === v._id
                    ? <Loader2 size={13} className="animate-spin" />
                    : <Trash2 size={13} />}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Variable Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline font-black uppercase italic tracking-tight text-white flex items-center gap-2">
                  <KeyRound size={16} className="text-primary" />
                  New Variable
                </h2>
                <button onClick={() => setShowAdd(false)} className="text-slate-600 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-headline font-black uppercase tracking-widest text-slate-400 block mb-2">
                    Key Name
                  </label>
                  <input
                    type="text"
                    placeholder="DATABASE_URL"
                    value={newKey}
                    onChange={e => setNewKey(e.target.value.toUpperCase().replace(/\s/g, "_"))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-emerald-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-headline font-black uppercase tracking-widest text-slate-400 block mb-2">
                    Value
                  </label>
                  <input
                    type="password"
                    placeholder="your-secret-value"
                    value={newValue}
                    onChange={e => setNewValue(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-headline font-black uppercase tracking-widest text-slate-400 block mb-2">
                    Environment
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["production", "preview", "all"] as const).map(env => (
                      <button
                        key={env}
                        onClick={() => setNewEnv(env)}
                        className={`py-2.5 rounded-xl border text-[9px] font-headline font-black uppercase tracking-widest transition-all ${
                          newEnv === env
                            ? ENV_COLORS[env]
                            : "border-white/10 text-slate-600 hover:border-white/20 hover:text-slate-400"
                        }`}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-[11px] font-headline font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !newKey.trim() || !newValue.trim()}
                  className="flex-1 py-3 rounded-xl font-headline font-black uppercase italic tracking-tight text-[11px] text-white flex items-center justify-center gap-2 disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {saving ? "Saving..." : "Save Variable"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
