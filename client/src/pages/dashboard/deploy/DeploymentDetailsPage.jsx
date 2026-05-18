import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Terminal, Activity, Link as LinkIcon, Trash2, Square, ArrowLeft, RefreshCcw, History, Rocket, RotateCcw, GitBranch, Play } from "lucide-react";
import projectService from "../../../api/services/projectService";
import { useShipyardLogs } from "../../../hooks/useShipyardLogs";
import PageTransition from "../../../components/common/PageTransition";
import Modal from "../../../components/common/Modal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function DeploymentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("logs");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRedeploying, setIsRedeploying] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [rollbackId, setRollbackId] = useState(null);
  
  const { logs, status, publicUrl, error, setStatus } = useShipyardLogs(id);
  const logsEndRef = useRef(null);

  useEffect(() => {
    fetchProject();
    fetchHistory();
  }, [id]);

  const fetchProject = async () => {
    try {
      const data = await projectService.getById(id);
      if (data) setProject(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await projectService.getHistory(id);
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const handleStop = async () => {
    setIsStopping(true);
    try {
      await projectService.suspend(id);
      setStatus("stopped");
      toast.success("Service suspended");
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setIsStopping(false);
    }
  };

  const handleResume = async () => {
    setIsResuming(true);
    try {
      await projectService.resume(id);
      setStatus("live");
      toast.success("Service resumed");
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setIsResuming(false);
    }
  };

  const handleRedeploy = async () => {
    setIsRedeploying(true);
    try {
      await projectService.redeploy(id);
      toast.success("Redeployment started");
      setStatus("building");
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setIsRedeploying(false);
    }
  };

  const handleRollback = async (deploymentId) => {
    setRollbackId(deploymentId);
    try {
      await projectService.rollback(id, deploymentId);
      toast.success("Rollback initiated");
      setStatus("rolling back");
      fetchHistory();
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setRollbackId(null);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await projectService.delete(id);
      toast.success("Service deleted");
      navigate("/dashboard/deploy");
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const getLogStyle = (msg) => {
    if (msg.includes("[ERROR]")) return "text-red-400 font-bold bg-red-500/10 px-1 rounded";
    if (msg.includes("[SYSTEM]")) return "text-[#6366f1] font-bold bg-[#6366f1]/10 px-1 rounded";
    if (msg.includes("[APP]")) return "text-cyan-400 font-bold bg-cyan-500/10 px-1 rounded";
    if (msg.toLowerCase().includes("success") || msg.toLowerCase().includes("live")) return "text-emerald-400 font-medium";
    return "text-zinc-400";
  };

  const getStatusStyles = (s) => {
    switch (s) {
      case "live": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]";
      case "failed": return "text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]";
      case "stopped": return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
      case "queued": return "text-amber-400 bg-amber-500/10 border-amber-500/20 animate-pulse";
      default: return "text-[#6366f1] bg-[#6366f1]/10 border-[#6366f1]/20 animate-pulse shadow-[0_0_20px_rgba(99,102,241,0.15)]";
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto flex h-full max-w-6xl flex-col space-y-10 p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate("/dashboard/deploy")}
              className="group rounded-2xl border border-white/5 bg-zinc-900/50 p-4 transition-all hover:bg-zinc-800 hover:scale-105 active:scale-95 backdrop-blur-xl shadow-2xl"
            >
              <ArrowLeft className="h-6 w-6 text-zinc-500 transition-colors group-hover:text-white" />
            </button>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-black italic uppercase tracking-tight text-white">
                  {project?.name || "Service Details"}
                </h1>
                <span className={`rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] ${getStatusStyles(status)}`}>
                  {status}
                </span>
              </div>
              {project?.githubUrl && (
                <p className="mt-2 font-mono text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                  <GitBranch className="h-3 w-3" />
                  {project.githubUrl.replace("https://github.com/", "")}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {(publicUrl || project?.publicUrl) && status === "live" && (
              <a 
                href={publicUrl || project.publicUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 rounded-2xl bg-[#6366f1] px-6 py-3 text-xs font-black uppercase tracking-widest italic text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] active:scale-[0.98]"
              >
                <LinkIcon className="h-4 w-4" />
                Live Preview
              </a>
            )}
            <button 
              onClick={handleRedeploy}
              disabled={isRedeploying || status === "building"}
              className="flex items-center gap-2 rounded-2xl bg-zinc-900/50 px-6 py-3 text-xs font-black uppercase tracking-widest italic text-white transition-all hover:bg-zinc-800 disabled:opacity-50 border border-white/5"
            >
              {isRedeploying ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
              Redeploy
            </button>
            {status === "stopped" ? (
              <button 
                onClick={handleResume}
                disabled={isResuming || status === "resuming"}
                className="flex items-center gap-2 rounded-2xl bg-zinc-900/50 px-6 py-3 text-xs font-black uppercase tracking-widest italic text-white transition-all hover:bg-emerald-500/20 hover:text-emerald-400 disabled:opacity-50 border border-white/5"
              >
                {isResuming ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Resume
              </button>
            ) : (
              <button 
                onClick={handleStop}
                disabled={isStopping || status === "stopped" || status === "building" || status === "rolling back"}
                className="flex items-center gap-2 rounded-2xl bg-zinc-900/50 px-6 py-3 text-xs font-black uppercase tracking-widest italic text-white transition-all hover:bg-orange-500/20 hover:text-orange-400 disabled:opacity-50 border border-white/5"
              >
                {isStopping ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Square className="h-4 w-4" />}
                Suspend
              </button>
            )}
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl border border-red-500/10 bg-red-500/5 px-6 py-3 text-xs font-black uppercase tracking-widest italic text-red-400 transition-all hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-5 text-[10px] font-black uppercase tracking-widest text-amber-500 backdrop-blur-md"
          >
            {error}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-white/5 px-2">
          {[
            { id: "logs", label: "Runtime Logs", icon: Terminal },
            { id: "history", label: "Deployment History", icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-8 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab.id ? "text-white" : "text-zinc-600 hover:text-zinc-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366f1] rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === "logs" ? (
              <motion.div 
                key="logs"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex h-[600px] flex-col overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-zinc-950/50 shadow-2xl backdrop-blur-3xl"
              >
                <div className="flex items-center justify-between border-b border-white/[0.08] bg-zinc-900/30 px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/30" />
                      <div className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
                    </div>
                    <div className="h-5 w-px bg-white/10 mx-2" />
                    <span className="text-[9px] font-black tracking-[0.2em] text-zinc-600 uppercase italic">Runtime Stream</span>
                  </div>
                  {status !== "stopped" && status !== "failed" && status !== "live" && (
                    <div className="flex items-center gap-3 rounded-full bg-[#6366f1]/10 px-4 py-1.5 border border-[#6366f1]/20">
                      <span className="text-[9px] font-black text-[#6366f1] uppercase tracking-widest animate-pulse">Syncing...</span>
                      <Activity className="h-3 w-3 text-[#6366f1] animate-spin" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 font-mono text-[12px] leading-relaxed selection:bg-[#6366f1]/30 custom-scrollbar">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-800">
                      <p className="animate-pulse font-black uppercase tracking-[0.2em]">Awaiting signal...</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {logs.map((log, i) => (
                        <div key={i} className="group flex gap-6 rounded-lg px-3 py-0.5 transition-colors hover:bg-white/[0.02]">
                          <span className="w-20 flex-shrink-0 select-none font-black text-zinc-800 transition-colors group-hover:text-zinc-700">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                          <span className={`break-all ${getLogStyle(log.message)}`}>
                            {log.message}
                          </span>
                        </div>
                      ))}
                      <div ref={logsEndRef} />
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="history"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="rounded-[2.5rem] border border-white/[0.08] bg-zinc-900/10 backdrop-blur-xl overflow-hidden shadow-2xl"
              >
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01] text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
                      <th className="px-8 py-6">Deployment Identifier</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6">Timestamp</th>
                      <th className="px-8 py-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-24 text-center text-zinc-700 font-black uppercase tracking-widest italic">No deployment history</td>
                      </tr>
                    ) : (
                      history.map((dep) => (
                        <tr key={dep._id} className="group transition-colors hover:bg-white/[0.01]">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                              <span className="font-mono text-[13px] font-black text-zinc-500">{dep._id.slice(-12).toUpperCase()}</span>
                              {dep.isCurrent && (
                                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[8px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20">Active</span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                              dep.status === "success" ? "text-emerald-400" : "text-red-400"
                            }`}>
                              {dep.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-[11px] text-zinc-600 font-black uppercase tracking-widest">
                            {new Date(dep.createdAt).toLocaleString()}
                          </td>
                          <td className="px-8 py-6 text-right">
                            {!dep.isCurrent && (
                              <button
                                onClick={() => handleRollback(dep._id)}
                                disabled={rollbackId === dep._id}
                                className="inline-flex items-center gap-2 rounded-xl bg-white/[0.03] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black border border-white/5 active:scale-95 disabled:opacity-50"
                              >
                                {rollbackId === dep._id ? <RefreshCcw className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                                Rollback
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Decommission Service"
        >
          <div className="space-y-8">
            <div className="rounded-2xl bg-red-500/[0.03] p-6 border border-red-500/10">
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                You are about to permanently decommission <span className="font-black text-white italic">{project?.name}</span>. This will destroy all linked cloud resources and data.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 rounded-2xl bg-zinc-900 py-4 text-xs font-black uppercase tracking-widest italic text-white transition-all hover:bg-zinc-800 border border-white/5"
              >
                Abort
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded-2xl bg-red-600 py-4 text-xs font-black uppercase tracking-widest italic text-white transition-all hover:bg-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] disabled:opacity-50"
              >
                {isDeleting ? "Processing..." : "Confirm Removal"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
}
