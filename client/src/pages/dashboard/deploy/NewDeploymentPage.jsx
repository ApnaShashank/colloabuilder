import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Github, Rocket, ArrowLeft, Globe, Terminal, Shield } from "lucide-react";
import projectService from "../../../api/services/projectService";
import PageTransition from "../../../components/common/PageTransition";
import { toast } from "sonner";

export default function NewDeploymentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    githubUrl: "",
    branch: "main",
    buildCommand: "npm run build",
    outputDir: "dist",
    installCommand: "npm install",
    isPublic: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await projectService.deploy(formData);
      toast.success("Deployment initiated successfully");
      navigate(`/dashboard/deploy/${data._id}`);
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl space-y-10 p-6 lg:p-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/dashboard/deploy")}
            className="group rounded-2xl border border-white/5 bg-zinc-900/50 p-4 transition-all hover:bg-zinc-800 backdrop-blur-xl shadow-2xl"
          >
            <ArrowLeft className="h-6 w-6 text-zinc-500 group-hover:text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tight text-white">
              Launch <span className="text-[#6366f1] opacity-40">Infrastructure</span>
            </h1>
            <p className="mt-1 text-zinc-500 text-xs font-black uppercase tracking-widest">Connect your repository and ship to the cloud.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="rounded-[2.5rem] border border-white/[0.08] bg-zinc-900/20 p-10 backdrop-blur-3xl shadow-2xl space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-1">Service Name</label>
                  <input
                    required
                    type="text"
                    placeholder="MY-PRODUCTION-APP"
                    className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-4 text-sm font-bold text-white outline-none transition-all focus:border-[#6366f1]/50 focus:bg-[#6366f1]/5 uppercase"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-1">GitHub Repository URL</label>
                  <div className="relative">
                    <Github className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      required
                      type="url"
                      placeholder="HTTPS://GITHUB.COM/USER/REPO"
                      className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] pl-14 pr-6 py-4 text-sm font-bold text-white outline-none transition-all focus:border-[#6366f1]/50 focus:bg-[#6366f1]/5"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-1">Branch</label>
                    <input
                      type="text"
                      placeholder="MAIN"
                      className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-4 text-sm font-bold text-white outline-none transition-all focus:border-[#6366f1]/50 uppercase"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-1">Output Directory</label>
                    <input
                      type="text"
                      placeholder="DIST"
                      className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-4 text-sm font-bold text-white outline-none transition-all focus:border-[#6366f1]/50 uppercase"
                      value={formData.outputDir}
                      onChange={(e) => setFormData({ ...formData, outputDir: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-1">Build Command</label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-white/[0.06] bg-black/40 px-6 py-4 font-mono text-sm text-zinc-400 outline-none transition-all focus:border-[#6366f1]/50"
                    value={formData.buildCommand}
                    onChange={(e) => setFormData({ ...formData, buildCommand: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-1">Install Command</label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-white/[0.06] bg-black/40 px-6 py-4 font-mono text-sm text-zinc-400 outline-none transition-all focus:border-[#6366f1]/50"
                    value={formData.installCommand}
                    onChange={(e) => setFormData({ ...formData, installCommand: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group relative flex items-center justify-center gap-3 overflow-hidden rounded-[1.5rem] bg-white px-8 py-5 text-sm font-black uppercase tracking-[0.2em] italic text-black transition-all hover:scale-[1.01] active:scale-[0.99] shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-cyan-400 opacity-0 transition-opacity group-hover:opacity-10" />
                {loading ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Rocket className="h-5 w-5" />}
                {loading ? "Deploying..." : "Launch Infrastructure"}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/10 p-8 backdrop-blur-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-white mb-6">Deployment Guide</h3>
              <ul className="space-y-6">
                {[
                  { icon: Globe, text: "Your site will be live on a shipyard.app subdomain.", color: "text-blue-400" },
                  { icon: Terminal, text: "Automatic CI/CD on every push to the selected branch.", color: "text-[#6366f1]" },
                  { icon: Shield, text: "Free SSL certificates provided automatically.", color: "text-emerald-400" },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <item.icon className={`h-5 w-5 shrink-0 ${item.color}`} />
                    <p className="text-[11px] font-medium leading-relaxed text-zinc-500 uppercase tracking-wider">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="rounded-3xl border border-[#6366f1]/20 bg-[#6366f1]/5 p-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#6366f1] mb-2">Pro Tip</p>
              <p className="text-[11px] font-medium leading-relaxed text-[#6366f1]/80 italic">
                Colloabuilder Shipyard detects most frameworks automatically. You can usually leave the build commands as default.
              </p>
            </div>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
