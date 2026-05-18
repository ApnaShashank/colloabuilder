"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderOpenIcon, 
  PlusSignIcon, 
  GitBranchIcon, 
  StarIcon, 
  ArrowRight01Icon, 
  LockIcon, 
  GlobalIcon,
  GithubIcon,
  Cancel01Icon,
  Tick02Icon,
  Loading01Icon,
  RocketIcon,
  Tick01Icon,
  Cancel02Icon,
  Time02Icon,
  Search01Icon,
  Delete02Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Skeleton from "@/components/ui/Skeleton";

const DEPLOY_STATUS: Record<string, { label: string; color: string; dot: string; icon: any }> = {
  none:     { label: "Not Deployed", color: "text-neutral-600",  dot: "bg-neutral-700",    icon: Time02Icon },
  queued:   { label: "Queued",       color: "text-amber-400",    dot: "bg-amber-400",      icon: Time02Icon },
  building: { label: "Building",     color: "text-blue-400",     dot: "bg-blue-400",       icon: Loading01Icon },
  live:     { label: "Live",         color: "text-emerald-400",  dot: "bg-emerald-400",    icon: Tick01Icon },
  failed:   { label: "Failed",       color: "text-red-400",      dot: "bg-red-400",        icon: Cancel02Icon },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "JavaScript",
    isPublic: true
  });

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json().catch(() => ({ projects: [] }));
      if (res.ok) setProjects(data.projects);
    } catch (err) {
      console.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (res.ok) {
        setIsCreateModalOpen(false);
        setFormData({ name: "", description: "", language: "JavaScript", isPublic: true });
        fetchProjects();
      }
    } catch (err) {
      console.error("Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete project");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Projects", val: projects.length.toString(),                                                    icon: FolderOpenIcon },
    { label: "Stars Earned",   val: projects.reduce((acc, p) => acc + (p.stars || 0), 0).toString(),              icon: StarIcon },
    { label: "Live Deploys",   val: projects.filter((p: any) => p.deployStatus === "live").length.toString(),     icon: GlobalIcon },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] font-black text-neutral-600 uppercase tracking-[0.3em] mb-1">Your Work</p>
            <h1 className="font-headline font-black text-4xl text-white tracking-tight">Project Hub</h1>
            <p className="text-neutral-500 text-sm mt-2">Build, collaborate, and ship real projects with your team.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <HugeiconsIcon icon={Search01Icon} size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text"
                placeholder="SEARCH PROJECTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-3 text-[10px] font-headline font-black text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 w-64 uppercase tracking-widest transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-white hover:bg-neutral-200 text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={15} variant="stroke" strokeWidth={1.5} />
              New Project
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {stats.map(({ label, val, icon: Icon }, i) => (
            <motion.div
              key={label}
              {...fadeUp}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
              className="bg-[#0e0e0e] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 group hover:border-white/10 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                <HugeiconsIcon icon={Icon} size={16} className="text-primary" variant="stroke" strokeWidth={1.5} />
              </div>
              <div>
                {loading ? (
                  <Skeleton className="w-12 h-8 mb-1" />
                ) : (
                  <p className="text-white font-headline font-black text-2xl">{val}</p>
                )}
                <p className="text-neutral-600 text-[10px] uppercase tracking-wider font-bold">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-[#0e0e0e] border border-white/[0.06] rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="w-40 h-5" />
                      <Skeleton className="w-24 h-4" />
                    </div>
                  </div>
                  <Skeleton className="w-8 h-8 rounded-lg" />
                </div>
                <Skeleton className="w-full h-12" />
                <div className="flex gap-2">
                  <Skeleton className="w-16 h-4" />
                  <Skeleton className="w-16 h-4" />
                </div>
                <div className="pt-4 border-t border-white/[0.04] flex justify-between">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-24 h-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center bg-[#0e0e0e] border border-white/[0.04] rounded-xl">
            <HugeiconsIcon icon={FolderOpenIcon} size={48} className="text-neutral-800 mx-auto mb-4" variant="stroke" strokeWidth={1.5} />
            <h3 className="text-white font-bold text-lg">{searchQuery ? "No Matches Found" : "No Projects Found"}</h3>
            <p className="text-neutral-600 text-sm mt-1 mb-6">{searchQuery ? `We couldn't find any projects matching "${searchQuery}"` : "Start your developer journey by creating your first project."}</p>
            {!searchQuery && (
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-white/[0.03] border border-white/[0.08] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/[0.05] transition-all"
              >
                Create Your First Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProjects.map((proj: any, i: number) => (
              <motion.div
                key={proj._id}
                {...fadeUp}
                transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
                className="bg-[#0e0e0e] border border-white/[0.06] rounded-2xl p-6 group hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                      <HugeiconsIcon icon={FolderOpenIcon} size={16} className="text-neutral-400" variant="stroke" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-white font-headline font-bold text-sm group-hover:text-primary transition-colors">
                        {proj.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {!proj.isPublic ? (
                          <><HugeiconsIcon icon={LockIcon} size={10} className="text-neutral-600" variant="stroke" strokeWidth={1.5} /><span className="text-[10px] text-neutral-600 uppercase font-black tracking-widest">Private</span></>
                        ) : (
                          <><HugeiconsIcon icon={GlobalIcon} size={10} className="text-neutral-600" variant="stroke" strokeWidth={1.5} /><span className="text-[10px] text-neutral-600 uppercase font-black tracking-widest">Public</span></>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                       onClick={(e) => handleDelete(proj._id, e)}
                       disabled={isDeleting === proj._id}
                       className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >
                       {isDeleting === proj._id ? <HugeiconsIcon icon={Loading01Icon} size={12} className="animate-spin" /> : <HugeiconsIcon icon={Delete02Icon} size={12} />}
                    </button>
                    <div className="flex gap-2 flex-wrap justify-end">
                    {proj.tags?.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded-full text-neutral-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-neutral-500 text-xs leading-relaxed mb-5 line-clamp-2">
                  {proj.description || "No description provided for this project."}
                </p>

                {/* Deploy Status Bar */}
                {(() => {
                  const ds = proj.deployStatus || "none";
                  const cfg = DEPLOY_STATUS[ds] || DEPLOY_STATUS.none;
                  const StatusIcon = cfg.icon;
                  return (
                    <div className={`flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg ${
                      ds === "live" ? "bg-emerald-500/5 border border-emerald-500/10" :
                      ds === "building" ? "bg-blue-500/5 border border-blue-500/10" :
                      ds === "failed" ? "bg-red-500/5 border border-red-500/10" :
                      "bg-white/[0.02] border border-white/[0.04]"
                    }`}>
                      <HugeiconsIcon icon={StatusIcon} size={11} className={`${cfg.color} ${ds === "building" ? "animate-spin" : ""} flex-shrink-0`} variant="stroke" strokeWidth={1.5} />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      {proj.deployUrl && ds === "live" && (
                        <a
                          href={proj.deployUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="ml-auto text-[9px] text-emerald-400 hover:text-emerald-300 font-mono truncate max-w-[120px] underline underline-offset-2"
                        >
                          {proj.deployUrl.replace("https://", "")}
                        </a>
                      )}
                      {proj.github?.isConnected && (
                        <HugeiconsIcon icon={GithubIcon} size={10} className="ml-auto text-neutral-700" />
                      )}
                    </div>
                  );
                })()}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-neutral-600 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: proj.langColor || "#3178c6" }} />
                      <span>{proj.language}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HugeiconsIcon icon={StarIcon} size={11} variant="stroke" strokeWidth={1.5} />
                      <span>{proj.stars || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HugeiconsIcon icon={GitBranchIcon} size={11} />
                      <span>{proj.branches || 1}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/dashboard/projects/${proj._id}`} className="flex items-center gap-1.5 text-[10px] bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-white/20 text-neutral-400 hover:text-white transition-all font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                      <HugeiconsIcon icon={FolderOpenIcon} size={11} variant="stroke" strokeWidth={1.5} />
                      Edit Code
                    </Link>
                    <Link
                      href={`/dashboard/projects/${proj._id}/deploy`}
                      className="flex items-center gap-1.5 text-[10px] bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary hover:text-primary transition-all font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm"
                    >
                      <HugeiconsIcon icon={RocketIcon} size={11} variant="stroke" strokeWidth={1.5} />
                      Deploy
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-[#0e0e0e] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 lg:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-headline font-black text-white uppercase italic tracking-tight">Initiate New Project</h2>
                    <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-1">Define your next technical masterpiece</p>
                  </div>
                  <button 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-neutral-600 hover:text-white transition-all"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={18} variant="stroke" strokeWidth={1.5} />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Project Identifier</label>
                    <input 
                      required
                      type="text" 
                      placeholder="E.G. NEXUS-CORE-AI"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-4 text-white text-sm focus:border-primary/50 focus:bg-primary/[0.02] transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Mission Description</label>
                    <textarea 
                      rows={3}
                      placeholder="WHAT ARE YOU BUILDING?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-4 text-white text-sm focus:border-primary/50 focus:bg-primary/[0.02] transition-all outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Primary Stack</label>
                      <select 
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-4 text-white text-sm focus:border-primary/50 transition-all outline-none appearance-none"
                      >
                        <option value="JavaScript">JavaScript</option>
                        <option value="TypeScript">TypeScript</option>
                        <option value="Python">Python</option>
                        <option value="React">React / Next.js</option>
                        <option value="HTML/CSS">HTML / CSS</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Access Protocol</label>
                      <div className="flex bg-white/[0.02] border border-white/[0.06] rounded-xl p-1">
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, isPublic: true })}
                          className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.isPublic ? 'bg-primary text-white' : 'text-neutral-600'}`}
                        >
                          Public
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, isPublic: false })}
                          className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!formData.isPublic ? 'bg-red-500/20 text-red-500' : 'text-neutral-600'}`}
                        >
                          Private
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="submit"
                      disabled={creating}
                      className="flex-1 bg-primary hover:bg-blue-700 disabled:bg-neutral-800 disabled:text-neutral-600 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg transition-all border border-white/10 flex items-center justify-center gap-2"
                    >
                      {creating ? (
                        <HugeiconsIcon icon={Loading01Icon} size={16} className="animate-spin" />
                      ) : (
                        <HugeiconsIcon icon={Tick02Icon} size={16} />
                      )}
                      Initialize Project
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-8 py-4 text-neutral-600 hover:text-white transition-colors text-[11px] font-black uppercase tracking-widest"
                    >
                      Abort
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
