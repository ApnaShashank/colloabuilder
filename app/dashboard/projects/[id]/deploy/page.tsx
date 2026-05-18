"use client";

import { useState, useEffect, useRef, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  GitBranch,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Link2,
  Terminal,
  ChevronRight,
  RefreshCw,
  Github
} from "lucide-react";
import { toast } from "sonner";

interface LogLine {
  level: "info" | "success" | "error" | "warn";
  message: string;
  timestamp: string;
}

interface Deployment {
  _id: string;
  version: number;
  status: string;
  branch: string;
  commitMessage: string;
  deployUrl: string;
  buildDuration: number;
  logs: LogLine[];
  createdAt: string;
}

interface ProjectConfig {
  name?: string;
  github?: { isConnected: boolean; repoUrl: string; deployBranch: string; repoName: string };
  deploy?: { buildCommand: string; framework: string };
  deployStatus?: string;
  deployUrl?: string;
  currentDeploymentId?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; pulse: boolean; bg: string }> = {
  none:        { label: "Not Deployed",  color: "text-neutral-500",    icon: Clock,     pulse: false, bg: "bg-neutral-500/10 border-neutral-500/20" },
  queued:      { label: "Queued",        color: "text-amber-400",      icon: Clock,     pulse: true,  bg: "bg-amber-400/10 border-amber-400/20" },
  building:    { label: "Building",      color: "text-cyan-400",       icon: Loader2,   pulse: true,  bg: "bg-cyan-400/10 border-cyan-400/20" },
  live:        { label: "Live",          color: "text-emerald-400",    icon: CheckCircle, pulse: true,  bg: "bg-emerald-400/10 border-emerald-400/20" },
  failed:      { label: "Failed",        color: "text-red-400",        icon: XCircle,   pulse: false, bg: "bg-red-400/10 border-red-400/20" },
  rolled_back: { label: "Rolled Back",   color: "text-purple-400",     icon: RefreshCw,  pulse: false, bg: "bg-purple-400/10 border-purple-400/20" },
};

const LOG_COLORS: Record<string, string> = {
  info:    "text-neutral-400",
  success: "text-emerald-400",
  error:   "text-red-400",
  warn:    "text-amber-400",
};

export default function DeployPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectConfig | null>(null);
  const [activeDeployment, setActiveDeployment] = useState<Deployment | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  
  // Deploy source selection
  const [deploySource, setDeploySource] = useState<"workspace" | "github" | "local">("workspace");

  // Connect repository form states
  const [repoUrl, setRepoUrl] = useState("");
  const [deployBranch, setDeployBranch] = useState("main");
  const [buildCommand, setBuildCommand] = useState("npm run build");
  const [connecting, setConnecting] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}/github`);
      const data = await res.json();
      if (data.success) {
        setProject(data.project);
        if (data.project.github?.isConnected) {
          setRepoUrl(data.project.github.repoUrl || "");
          setDeployBranch(data.project.github.deployBranch || "main");
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    setConnecting(true);
    try {
      const res = await fetch(`/api/projects/${id}/github`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          repoUrl, 
          deployBranch, 
          buildCommand 
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Repository connected successfully");
        setShowConnectModal(false);
        fetchProject();
      } else {
        toast.error("Failed to connect repository");
      }
    } catch (err) {
      toast.error("Connection failed due to network error");
    } finally {
      setConnecting(false);
    }
  };

  const fetchActiveDeployment = async (deploymentId: string) => {
    try {
      const res = await fetch(`/api/deploy/${deploymentId}`);
      const data = await res.json();
      if (data.success) {
        setActiveDeployment(data.deployment);
        return data.deployment;
      }
    } catch (err) {}
    return null;
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeDeployment?.logs]);

  // Polling loop for active builds
  useEffect(() => {
    if (!activeDeployment) return;

    const shouldPoll = ["queued", "building"].includes(activeDeployment.status);
    if (shouldPoll) {
      pollRef.current = setInterval(async () => {
        const updated = await fetchActiveDeployment(activeDeployment._id);
        if (updated && !["queued", "building"].includes(updated.status)) {
          clearInterval(pollRef.current!);
          setDeploying(false);
          fetchProject();
        }
      }, 1200);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeDeployment?._id, activeDeployment?.status]);

  const handleDeploy = async () => {
    if (deploySource === "local") {
      try {
        if ('showDirectoryPicker' in window) {
          await (window as any).showDirectoryPicker();
          toast.success("Local folder linked for edge build.");
        } else {
          toast.error("Browser does not support local folder linking.");
          return;
        }
      } catch (err) {
        return; // User cancelled
      }
    }

    setDeploying(true);
    setTerminalLines([]); // Reset stdout console logs
    try {
      const res = await fetch("/api/deploy/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: id,
          branch: project?.github?.deployBranch || "main",
          commitMessage: `Manual build triggered via Launch Station (${deploySource})`,
          triggeredBy: "manual",
          source: deploySource,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Pipeline triggered successfully");
        setActiveDeployment(data.deployment);
      } else {
        toast.error("Pipeline failure: check settings");
        setDeploying(false);
      }
    } catch (err) {
      toast.error("Deployment trigger error");
      setDeploying(false);
    }
  };

  const statusCfg = STATUS_CONFIG[project?.deployStatus || "none"] || STATUS_CONFIG.none;
  const StatusIcon = statusCfg.icon;

  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  return (
    <div className="min-h-screen pb-20 relative bg-black text-white">
      <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-0">
        
        {/* Minimalist Status Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider text-white">Deploy Center</h1>
            <p className="text-neutral-500 text-xs mt-1">Configure integrations and launch cloud distribution builds.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Deploy Status Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusCfg.bg}`}>
              <StatusIcon size={12} className={`${statusCfg.color} ${statusCfg.pulse ? "animate-spin" : ""}`} />
              <span className={`text-[10px] font-black uppercase tracking-wider ${statusCfg.color}`}>
                {statusCfg.label}
              </span>
            </div>
            
            {project?.deployUrl && (
              <a
                href={project.deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
              >
                <Globe size={11} />
                Live url
              </a>
            )}
          </div>
        </div>

        {/* Dynamic Launch Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* GitHub Connection Box */}
          <div className="md:col-span-1 bg-[#090909] border border-white/[0.05] p-6 rounded-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-neutral-400">
                <Github size={16} />
                <span className="text-[10px] font-black uppercase tracking-wider">GitHub uplink</span>
              </div>
              {project?.github?.isConnected ? (
                <div>
                  <h4 className="text-sm font-bold text-white truncate">{project.github.repoName}</h4>
                  <p className="text-[9px] font-mono text-neutral-500 mt-1 flex items-center gap-1">
                    <GitBranch size={10} /> {project.github.deployBranch}
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-neutral-500 font-semibold italic">No GitHub repository linked to this project yet.</p>
              )}
            </div>

            <button 
              onClick={() => setShowConnectModal(true)}
              className="mt-6 w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all"
            >
              {project?.github?.isConnected ? "Sync Settings" : "Connect Repo"}
            </button>
          </div>

          {/* Trigger Deployment Box */}
          <div className="md:col-span-2 bg-[#090909] border border-white/[0.05] p-6 rounded-xl flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[8px] font-black uppercase tracking-widest text-neutral-500">Manual deployment pipeline</span>
              <h3 className="text-base font-black text-white uppercase">Production Launchpad</h3>
              <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
                Build and deploy your master workspace dynamically onto Colloabuilder edge nodes. Pipeline steps will run sequentially in real-time.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-center bg-black p-1 rounded-lg border border-white/10 w-fit">
                <button
                  onClick={() => setDeploySource("workspace")}
                  className={`px-4 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${deploySource === "workspace" ? "bg-white text-black" : "text-neutral-500 hover:text-white"}`}
                >
                  Workspace Code
                </button>
                <button
                  onClick={() => setDeploySource("github")}
                  className={`px-4 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${deploySource === "github" ? "bg-white text-black" : "text-neutral-500 hover:text-white"}`}
                >
                  GitHub Repo
                </button>
                <button
                  onClick={() => setDeploySource("local")}
                  className={`px-4 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${deploySource === "local" ? "bg-white text-black" : "text-neutral-500 hover:text-white"}`}
                >
                  Local System
                </button>
              </div>

              <button
                onClick={handleDeploy}
                disabled={deploying || (deploySource === "github" && !project?.github?.isConnected)}
                className="w-full py-3 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {deploying ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Rocket size={14} />
                )}
                {deploying ? "Deploying Pipeline..." : `Deploy ${deploySource === 'workspace' ? 'Workspace' : deploySource === 'github' ? 'GitHub' : 'Local'} Code`}
              </button>
            </div>
          </div>
        </div>

        {/* Live Real-time Build Console Logs */}
        <div className="bg-[#090909] border border-white/[0.05] rounded-xl overflow-hidden shadow-lg flex flex-col">
          <div className="px-6 py-4 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={13} className="text-neutral-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Live Console Output</span>
            </div>
            {deploying && (
              <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-cyan-400 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Live Tunnel Connected
              </span>
            )}
          </div>

          <div className="h-96 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed bg-black/60 custom-scrollbar space-y-1">
            {!activeDeployment ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-neutral-600">
                <Terminal size={24} className="opacity-25" />
                <p className="font-black uppercase tracking-widest text-[9px] italic">Awaiting secure pipeline deployment signals...</p>
              </div>
            ) : activeDeployment.logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-neutral-600">
                <Loader2 size={24} className="animate-spin text-cyan-400 opacity-50" />
                <p className="font-black uppercase tracking-widest text-[9px] italic">Initiating secure edge pipelines...</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {activeDeployment.logs.map((log, i) => (
                  <div key={i} className="flex gap-4 hover:bg-white/[0.01] px-2 py-0.5 rounded transition-all">
                    <span className="text-neutral-700 select-none font-bold tabular-nums">
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    <span className={`${LOG_COLORS[log.level] || "text-neutral-400"} flex-1 font-semibold`}>
                      {log.message}
                    </span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Dynamic Link Repo Modal */}
      <AnimatePresence>
        {showConnectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4" onClick={() => setShowConnectModal(false)}>
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl relative space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-1">
                <h2 className="font-bold text-sm uppercase text-white">Connect Repository</h2>
                <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Link your active project source control configurations.</p>
              </div>

              <form onSubmit={handleConnect} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase tracking-widest text-neutral-500 px-1">GitHub Repo URL</label>
                  <input
                    required
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={repoUrl}
                    onChange={e => setRepoUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white placeholder:text-neutral-700 focus:outline-none focus:border-white/20 transition-all font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-neutral-500 px-1">Deploy Branch</label>
                    <input
                      type="text"
                      value={deployBranch}
                      onChange={e => setDeployBranch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-white/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-neutral-500 px-1">Build Command</label>
                    <input
                      type="text"
                      value={buildCommand}
                      onChange={e => setBuildCommand(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-white/20 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowConnectModal(false)}
                    className="flex-1 py-3 border border-white/5 rounded-lg text-[9px] font-bold uppercase tracking-wider text-neutral-500 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={connecting || !repoUrl.trim()}
                    className="flex-1 py-3 bg-white text-black font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 disabled:opacity-40 transition-all rounded-lg"
                  >
                    {connecting ? <Loader2 size={12} className="animate-spin" /> : <Link2 size={12} />}
                    {connecting ? "Linking..." : "Connect"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
