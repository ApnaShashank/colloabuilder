"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import {
  Clock01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Loading01Icon,
  RefreshIcon,
  GlobalIcon,
  GitCommitIcon,
  GitBranchIcon,
  ArrowRight01Icon,
  ZapIcon,
  RocketIcon,
  CloudIcon,
  Time02Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface Deployment {
  _id: string;
  version: number;
  status: "queued" | "building" | "live" | "failed" | "cancelled" | "rolled_back";
  branch: string;
  commitHash: string;
  commitMessage: string;
  deployUrl: string;
  buildDuration: number;
  triggeredBy: "manual" | "webhook" | "rollback";
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  queued:      { label: "Queued",       color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20",   icon: Clock01Icon },
  building:    { label: "Building",     color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20",     icon: Loading01Icon },
  live:        { label: "Live",         color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckmarkCircle02Icon },
  failed:      { label: "Failed",       color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20",       icon: Cancel01Icon },
  cancelled:   { label: "Cancelled",    color: "text-slate-400",   bg: "bg-slate-500/10 border-slate-500/20",   icon: Cancel01Icon },
  rolled_back: { label: "Rolled Back",  color: "text-purple-400",  bg: "bg-purple-500/10 border-purple-500/20", icon: RefreshIcon },
};

const TRIGGER_LABELS: Record<string, { label: string; icon: any }> = {
  manual:  { label: "Manual",  icon: RocketIcon },
  webhook: { label: "Webhook", icon: ZapIcon },
  rollback:{ label: "Rollback",icon: RefreshIcon },
};

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)  return `${Math.round(diff)}s ago`;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

export default function DeploymentsHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [rollingBack, setRollingBack] = useState<string | null>(null);

  const fetchDeployments = async () => {
    try {
      const res = await fetch(`/api/projects/${id}/deployments`);
      const data = await res.json();
      if (data.success) setDeployments(data.deployments);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => { fetchDeployments(); }, [id]);

  const handleRollback = async (deploymentId: string) => {
    setRollingBack(deploymentId);
    try {
      const res = await fetch(`/api/deploy/${deploymentId}`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await fetchDeployments();
      }
    } catch (err) {}
    setRollingBack(null);
  };

  return (
    <div className="pb-20 relative overflow-hidden min-h-screen">
      {/* ── Background Aesthetics ── */}
      <div className="absolute top-0 right-0 p-20 opacity-[0.03] select-none pointer-events-none">
         <h1 className="text-[25vw] font-black leading-none font-headline italic uppercase tracking-tighter text-white">FLEET</h1>
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10 px-4 md:px-0">
        {/* ── Header ── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="p-2.5 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                <HugeiconsIcon icon={Clock01Icon} size={24} variant="stroke" strokeWidth={1.5} />
              </div>
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Historical Log Archive</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-headline font-black text-white tracking-tighter leading-none italic uppercase"
            >
              Fleet <span className="text-secondary">Archive</span>_
            </motion.h1>
            <p className="text-slate-500 text-sm max-w-xl font-medium leading-relaxed">
              Every transmission sent to the edge network is logged here. Review performance metrics and rollback to any previous stable version with a single command.
            </p>
          </div>

          <div className="flex gap-4">
             <button
               onClick={fetchDeployments}
               className="px-8 py-4 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.05] transition-all text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white flex items-center gap-3"
             >
               <HugeiconsIcon icon={RefreshIcon} size={14} className={loading ? "animate-spin" : ""} />
               Sync Archive
             </button>
          </div>
        </header>

        {/* ── Deployments Tactical List ── */}
        <div className="bg-[#0e0e0e] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="px-10 py-8 border-b border-white/5 bg-white/[0.01] hidden md:flex items-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
             <div className="w-16">Ver</div>
             <div className="flex-1">Identity & Payload</div>
             <div className="w-32">Status</div>
             <div className="w-32">Origin</div>
             <div className="w-40">Timeline</div>
             <div className="w-32 text-right">Actions</div>
          </div>

          <div className="divide-y divide-white/5">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="px-10 py-12 flex items-center gap-8 animate-pulse">
                   <div className="w-12 h-12 rounded-2xl bg-white/5" />
                   <div className="flex-1 space-y-3">
                      <div className="h-4 w-1/3 bg-white/5 rounded-full" />
                      <div className="h-2 w-1/4 bg-white/5 rounded-full" />
                   </div>
                   <div className="w-32 h-6 bg-white/5 rounded-full" />
                </div>
              ))
            ) : deployments.length === 0 ? (
              <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
                 <div className="w-20 h-20 rounded-[2.5rem] border border-dashed border-white/10 flex items-center justify-center">
                    <HugeiconsIcon icon={CloudIcon} size={32} className="opacity-10 text-white" />
                 </div>
                 <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] italic">No archive data detected on this node.</p>
              </div>
            ) : (
              deployments.map((deploy, i) => {
                const cfg = STATUS_CONFIG[deploy.status];
                const StatusIcon = cfg?.icon || Time02Icon;
                const trigger = TRIGGER_LABELS[deploy.triggeredBy] || { label: "Unknown", icon: ZapIcon };
                const TriggerIcon = trigger.icon;

                return (
                  <motion.div 
                    key={deploy._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group px-10 py-10 flex flex-col md:flex-row md:items-center gap-8 hover:bg-white/[0.02] transition-all"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center font-headline font-black text-xl text-slate-500 italic group-hover:text-primary transition-colors">
                       {deploy.version < 10 ? `0${deploy.version}` : deploy.version}
                    </div>

                    <div className="flex-1 min-w-0">
                       <h4 className="text-lg font-black text-white italic tracking-tighter truncate group-hover:text-primary transition-colors mb-1">
                          {deploy.commitMessage || "Direct Production Launch"}
                       </h4>
                       <div className="flex items-center gap-4">
                          <span className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                             <HugeiconsIcon icon={GitCommitIcon} size={10} />
                             {deploy.commitHash?.substring(0, 7) || "STATIC"}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-white/10" />
                          <span className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                             <HugeiconsIcon icon={GitBranchIcon} size={10} />
                             {deploy.branch}
                          </span>
                       </div>
                    </div>

                    <div className="w-32">
                       <span className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${cfg?.color}`}>
                          <StatusIcon size={12} className={deploy.status === 'building' ? 'animate-spin' : ''} />
                          {cfg?.label}
                       </span>
                    </div>

                    <div className="w-32">
                       <span className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          <TriggerIcon size={12} />
                          {trigger.label}
                       </span>
                    </div>

                    <div className="w-40">
                       <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{timeAgo(deploy.createdAt)}</p>
                       <p className="text-[8px] text-slate-700 font-bold uppercase mt-1">Duration: {deploy.buildDuration || "0.0"}s</p>
                    </div>

                    <div className="w-32 text-right flex items-center justify-end gap-4">
                       {deploy.status === "live" ? (
                         <a href={deploy.deployUrl} target="_blank" className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-emerald-400 transition-all">
                            <HugeiconsIcon icon={GlobalIcon} size={14} />
                         </a>
                       ) : (
                         <button 
                           onClick={() => handleRollback(deploy._id)}
                           disabled={!!rollingBack}
                           className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-amber-400 transition-all disabled:opacity-30"
                         >
                            <HugeiconsIcon icon={RefreshIcon} size={14} className={rollingBack === deploy._id ? "animate-spin" : ""} />
                         </button>
                       )}
                       <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all">
                          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                       </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
          
          <div className="px-10 py-6 bg-white/[0.01] border-t border-white/5 text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] italic">
             Archive integrity verified via Colloabuilder Ledger
          </div>
        </div>
      </div>
    </div>
  );
}
