import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, GitBranch, ExternalLink, Box, Rocket, Pause, Play, RefreshCcw, Server, Activity, ShieldCheck, Zap, Globe, Cpu } from "lucide-react";
import projectService from "../../../api/services/projectService";
import { getAccessToken } from "../../../api/axios";
import PageTransition from "../../../components/common/PageTransition";
import Skeleton from "../../../components/common/Skeleton";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_CONFIG = {
  live: { 
    label: "Running", 
    color: "text-emerald-400", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/20",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    icon: Activity 
  },
  failed: { 
    label: "Error", 
    color: "text-red-400", 
    bg: "bg-red-500/10", 
    border: "border-red-500/20",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    icon: ShieldCheck 
  },
  stopped: { 
    label: "Suspended", 
    color: "text-zinc-500", 
    bg: "bg-zinc-500/10", 
    border: "border-zinc-500/20",
    glow: "",
    icon: Pause 
  },
  queued: { 
    label: "Provisioning", 
    color: "text-amber-400", 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/20",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    icon: RefreshCcw 
  },
  building: { 
    label: "Building", 
    color: "text-[#6366f1]", 
    bg: "bg-[#6366f1]/10", 
    border: "border-[#6366f1]/20",
    glow: "shadow-[0_0_20px_rgba(99,102,241,0.15)]",
    icon: Zap 
  },
};

export default function DeployPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const isAuthenticated = true; // Integrated with main auth

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      setServices(data || []);
    } catch (err) {
      console.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setActionLoading(`${id}-${action}`);
    try {
      if (action === "suspend") await projectService.suspend(id);
      else if (action === "resume") await projectService.resume(id);
      else if (action === "redeploy") await projectService.redeploy(id);
      await fetchServices();
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setActionLoading(null);
    }
  };

  const handleConnect = () => {
    const baseUrl = import.meta.env.VITE_SHIPYARD_API_URL || "http://localhost:5001";
    window.location.href = `${baseUrl}/api/auth/github`;
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-12 p-6 lg:p-10">
        {/* Cinematic Header */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-[#6366f1] shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Global Infrastructure Panel</span>
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white lg:text-7xl">
              Cloud <span className="text-[#6366f1] opacity-30">Orchestra</span>
            </h1>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-zinc-500">
              High-performance container orchestration for Colloabuilder projects. Manage real-time deployments across global clusters.
            </p>
          </div>
          
          {isAuthenticated && (
            <Link
              to="/dashboard/deploy/new"
              className="group relative flex items-center gap-3 overflow-hidden rounded-[1.5rem] bg-white px-8 py-5 text-sm font-black uppercase tracking-widest italic text-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-cyan-400 opacity-0 transition-opacity group-hover:opacity-10" />
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              Launch Service
            </Link>
          )}
        </div>

        {/* Auth State Check */}
        {!isAuthenticated ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-[4rem] border border-white/[0.05] bg-zinc-950 p-24 text-center shadow-2xl"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="auth-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#auth-grid)" />
              </svg>
            </div>
            
            <div className="relative z-10 space-y-10">
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[3rem] bg-gradient-to-br from-[#6366f1]/20 to-cyan-500/5 text-[#6366f1] border border-white/5 shadow-2xl">
                <Server className="h-14 w-14" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black uppercase italic text-white tracking-tight">Connect Your Cluster</h3>
                <p className="mx-auto max-w-md text-zinc-500 font-medium leading-relaxed uppercase text-[11px] tracking-widest">
                  Authentication required to access cloud provisioning services. Link your GitHub identity to begin.
                </p>
              </div>
              <button
                onClick={handleConnect}
                className="group relative flex items-center gap-4 rounded-[1.8rem] bg-[#6366f1] px-12 py-5 text-xs font-black uppercase italic tracking-[0.2em] text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(99,102,241,0.3)]"
              >
                <GitBranch className="h-4 w-4" />
                Initialize Link
              </button>
            </div>
          </motion.div>
        ) : loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-[3rem] border border-white/[0.05] bg-zinc-900/40 p-10">
                <Skeleton className="h-10 w-32 mb-6" />
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-6 w-2/3 mb-10" />
                <Skeleton className="h-40 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-[4rem] border border-dashed border-white/[0.08] bg-zinc-900/10 py-32 text-center"
          >
            <div className="h-20 w-20 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-800 mb-8">
              <Box className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-black uppercase italic text-zinc-700 tracking-widest">No Active Services</h3>
            <p className="mt-2 text-zinc-800 text-[10px] font-black uppercase tracking-[0.3em]">System clear — Awaiting deployment signal</p>
          </motion.div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const config = STATUS_CONFIG[service.status] || STATUS_CONFIG.queued;
              const StatusIcon = config.icon;
              
              return (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-[3rem] border border-white/[0.06] bg-zinc-900/20 p-8 transition-all hover:border-[#6366f1]/30 hover:bg-zinc-900/40 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black italic uppercase tracking-tight text-white group-hover:text-[#6366f1] transition-colors line-clamp-1">
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-3 w-3 text-zinc-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">main branch</span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 border ${config.border} ${config.bg} ${config.glow}`}>
                      <StatusIcon className={`h-3 w-3 ${config.color} ${service.status === 'building' || service.status === 'queued' ? 'animate-spin' : ''}`} />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-black/30 p-4 border border-white/[0.03]">
                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-1">Runtime</p>
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Cpu className="h-3.5 w-3.5 text-[#6366f1]/50" />
                          <span className="text-xs font-bold uppercase tracking-tighter">Docker V2</span>
                        </div>
                      </div>
                      <div className="rounded-2xl bg-black/30 p-4 border border-white/[0.03]">
                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-1">Endpoint</p>
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Globe className="h-3.5 w-3.5 text-cyan-400/50" />
                          <span className="text-xs font-bold uppercase tracking-tighter">
                            {service.assignedPort ? `:${service.assignedPort}` : "PROVISIONING"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to={`/dashboard/deploy/${service._id}`}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-white/[0.03] border border-white/[0.06] py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98] italic"
                      >
                        Monitor Logs
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      
                      {service.status === "live" ? (
                        <button
                          onClick={() => handleAction(service._id, "suspend")}
                          disabled={actionLoading === `${service._id}-suspend`}
                          className="w-14 flex items-center justify-center rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 transition-all hover:bg-orange-500/20 active:scale-90"
                          title="Suspend Service"
                        >
                          {actionLoading === `${service._id}-suspend` ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Pause className="h-4 w-4" />}
                        </button>
                      ) : service.status === "stopped" ? (
                        <button
                          onClick={() => handleAction(service._id, "resume")}
                          disabled={actionLoading === `${service._id}-resume`}
                          className="w-14 flex items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 transition-all hover:bg-emerald-500/20 active:scale-90"
                          title="Resume Service"
                        >
                          {actionLoading === `${service._id}-resume` ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Aesthetic Background Accents */}
                  <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-[#6366f1]/5 blur-[80px] group-hover:bg-[#6366f1]/10 transition-colors" />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* System Info Footer */}
        <div className="flex flex-wrap items-center justify-center gap-10 pt-10 border-t border-white/5">
          {[
            { label: "Active Nodes", val: "4 Nodes" },
            { label: "Uptime", val: "99.99%" },
            { label: "Region", val: "Global-West-1" },
            { label: "Protocol", val: "HTTP/3" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-1 w-1 rounded-full bg-zinc-800" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">
                {item.label}: <span className="text-zinc-500">{item.val}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
