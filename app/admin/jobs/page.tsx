"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Plus, MapPin, Trash2, Loader2, Building2,
  Tag, Search, X, Edit3, Globe, Wifi, Save, PlusCircle,
  DollarSign, Clock, ExternalLink, CheckCircle2, XCircle,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import Skeleton from "@/components/ui/Skeleton";

const EMPTY_FORM = {
  title: "", company: "", location: "Remote", workMode: "Remote",
  type: "Full-time", experienceLevel: "Mid", salary: "", salaryMin: 0,
  salaryMax: 0, currency: "USD", description: "", requirements: "",
  url: "", tags: "", isActive: true
};

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const TYPE_COLORS: Record<string, string> = {
  "Full-time": "text-emerald-600 bg-emerald-50 border-emerald-100",
  "Part-time": "text-amber-600 bg-amber-50 border-amber-100",
  Contract: "text-orange-600 bg-orange-50 border-orange-100",
  Internship: "text-sky-600 bg-sky-50 border-sky-100",
  Freelance: "text-pink-600 bg-pink-50 border-pink-100",
};
const SRC_LABELS: Record<string, string> = {
  manual: "Manual",
  ai_serpapi: "AI · Google",
  ai_tavily: "AI · Tavily",
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchJobs(); }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/jobs");
      const data = await res.json();
      if (data.jobs) setJobs(data.jobs);
    } catch {
      toast.error("Failed to load jobs");
    } finally { setLoading(false); }
  }

  function openCreate() {
    setEditingJob(null);
    setForm({ ...EMPTY_FORM });
    setIsModalOpen(true);
  }

  function openEdit(job: any) {
    setEditingJob(job);
    setForm({
      title: job.title, company: job.company, location: job.location,
      workMode: job.workMode || "Remote", type: job.type,
      experienceLevel: job.experienceLevel || "Mid", salary: job.salary || "",
      salaryMin: job.salaryMin || 0, salaryMax: job.salaryMax || 0,
      currency: job.currency || "USD", description: job.description,
      requirements: job.requirements || "", url: job.url || "",
      tags: job.tags?.join(", ") || "", isActive: job.isActive ?? true,
    });
    setIsModalOpen(true);
  }

  async function save() {
    if (!form.title || !form.company || !form.description) {
      toast.error("Title, Company and Description are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) };
      const method = editingJob ? "PATCH" : "POST";
      const body = editingJob ? { id: editingJob._id, updates: payload } : payload;
      const res = await fetch("/api/admin/jobs", {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
      });
      if (res.ok) {
        toast.success(editingJob ? "Job updated." : "Job created & live.");
        setIsModalOpen(false);
        fetchJobs();
      } else {
        toast.error("Save failed.");
      }
    } catch { toast.error("Network error."); }
    finally { setSaving(false); }
  }

  async function toggleActive(job: any) {
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: job._id, updates: { isActive: !job.isActive } })
      });
      if (res.ok) { toast.success("Status updated."); fetchJobs(); }
    } catch { toast.error("Failed."); }
  }

  async function deleteJob(id: string) {
    if (!confirm("Delete this job posting permanently?")) return;
    try {
      const res = await fetch(`/api/admin/jobs?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Job deleted."); fetchJobs(); }
    } catch { toast.error("Delete failed."); }
  }

  const filtered = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-3.5 text-sm font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all";
  const selectCls = inputCls + " appearance-none";
  const labelCls = "text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2";

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-headline font-black text-black tracking-tighter">Career Management</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage job listings — manual and AI-sourced.</p>
        </div>
        <button
          onClick={openCreate}
          className="px-8 py-3 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-neutral-800 transition-all shadow-2xl"
        >
          <Plus size={18} /> Post New Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Listings", value: jobs.length, color: "text-black" },
          { label: "Active", value: jobs.filter(j => j.isActive).length, color: "text-emerald-600" },
          { label: "AI Sourced", value: jobs.filter(j => j.source !== "manual").length, color: "text-violet-600" },
          { label: "Closed", value: jobs.filter(j => !j.isActive).length, color: "text-red-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm">
            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">{s.label}</p>
            <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text" placeholder="Search by title or company..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl text-sm focus:outline-none shadow-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white border border-neutral-100 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex gap-4 items-start flex-1">
                <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
                <div className="space-y-3 flex-1">
                  <div className="flex gap-2">
                    <Skeleton className="w-48 h-5" />
                    <Skeleton className="w-20 h-5" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-20 h-4" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="w-24 h-10 rounded-xl" />
                <Skeleton className="w-10 h-10 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-28 bg-neutral-50 border border-dashed border-neutral-200 rounded-[3rem] text-center">
          <Briefcase size={48} className="text-neutral-200 mx-auto mb-4" />
          <p className="text-neutral-400 font-black uppercase tracking-[0.3em]">No jobs found.</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {filtered.map(job => (
              <motion.div
                key={job._id} layout
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
                className={`bg-white border rounded-[2rem] p-7 hover:shadow-xl transition-all group relative overflow-hidden ${
                  job.isActive ? "border-neutral-100" : "border-neutral-100 opacity-60"
                }`}
              >
                <div className="absolute top-0 left-0 w-1 h-full rounded-l-[2rem]" style={{ background: job.isActive ? "#16a34a" : "#e5e7eb" }} />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-5 flex-1 min-w-0">
                    <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 flex-shrink-0">
                      <Building2 size={22} className="text-neutral-400" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                        <h3 className="font-black text-xl leading-none">{job.title}</h3>
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${TYPE_COLORS[job.type] || "bg-neutral-100"}`}>
                          {job.type}
                        </span>
                        {job.source && job.source !== "manual" && (
                          <span className="text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest text-violet-600 bg-violet-50 border-violet-100 flex items-center gap-1">
                            <Sparkles size={9} /> {SRC_LABELS[job.source] || "AI"}
                          </span>
                        )}
                        {!job.isActive && (
                          <span className="text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest text-neutral-400 bg-neutral-50 border-neutral-200">Closed</span>
                        )}
                      </div>
                      <p className="text-neutral-500 text-sm font-medium flex items-center gap-3">
                        <span className="flex items-center gap-1.5"><Building2 size={12} /> {job.company}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={12} /> {job.location}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12} /> {timeAgo(job.createdAt)}</span>
                        {job.salary && <span className="flex items-center gap-1.5 text-emerald-600"><DollarSign size={12} /> {job.salary}</span>}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.tags?.slice(0, 5).map((t: string) => (
                          <span key={t} className="text-[9px] bg-neutral-50 border border-neutral-100 text-neutral-500 px-2 py-1 rounded font-bold uppercase">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    <button onClick={() => toggleActive(job)}
                      className={`p-3 rounded-xl border transition-all ${job.isActive ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-red-50 hover:text-red-500 hover:border-red-100" : "bg-neutral-50 text-neutral-400 hover:bg-emerald-50 hover:text-emerald-600"}`}
                      title={job.isActive ? "Close listing" : "Reopen listing"}>
                      {job.isActive ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </button>
                    <button onClick={() => openEdit(job)} className="p-3 bg-neutral-50 hover:bg-black hover:text-white rounded-xl border border-neutral-100 transition-all">
                      <Edit3 size={18} />
                    </button>
                    {job.url && <a href={job.url} target="_blank" className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-neutral-500 hover:text-black transition-all"><ExternalLink size={18} /></a>}
                    <button onClick={() => deleteJob(job._id)} className="p-3 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-xl border border-red-100 transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* ── CREATE / EDIT MODAL ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                    {editingJob ? <Edit3 size={22} /> : <PlusCircle size={22} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-headline font-black tracking-tight">{editingJob ? "Edit Listing" : "Post New Job"}</h2>
                    <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mt-0.5">Career Opportunity Management</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-neutral-50 rounded-2xl"><X /></button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div><label className={labelCls}>Job Title</label><input className={inputCls} placeholder="Senior React Developer" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
                  <div><label className={labelCls}>Company</label><input className={inputCls} placeholder="Vercel, Google, Startup..." value={form.company} onChange={e => setForm({...form, company: e.target.value})} /></div>
                  <div><label className={labelCls}>Location</label><input className={inputCls} placeholder="Remote / Bengaluru / NY..." value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
                  <div><label className={labelCls}>Work Mode</label>
                    <select className={selectCls} value={form.workMode} onChange={e => setForm({...form, workMode: e.target.value})}>
                      <option>Remote</option><option>Hybrid</option><option>On-site</option>
                    </select>
                  </div>
                  <div><label className={labelCls}>Job Type</label>
                    <select className={selectCls} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                      <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option><option>Freelance</option>
                    </select>
                  </div>
                  <div><label className={labelCls}>Experience Level</label>
                    <select className={selectCls} value={form.experienceLevel} onChange={e => setForm({...form, experienceLevel: e.target.value})}>
                      <option>Entry</option><option>Mid</option><option>Senior</option><option>Lead</option><option>Executive</option>
                    </select>
                  </div>
                  <div><label className={labelCls}>Salary</label><input className={inputCls} placeholder="₹15L–₹25L / $120k..." value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} /></div>
                  <div><label className={labelCls}>Application URL</label><input className={inputCls} placeholder="https://..." value={form.url} onChange={e => setForm({...form, url: e.target.value})} /></div>
                </div>

                <div><label className={labelCls}>Description</label>
                  <textarea rows={5} className={inputCls + " resize-none"} placeholder="Job description and responsibilities..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div><label className={labelCls}>Requirements (Optional)</label>
                  <textarea rows={3} className={inputCls + " resize-none"} placeholder="Skills, qualifications, experience needed..." value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} />
                </div>
                <div><label className={labelCls}>Tags / Skills (comma separated)</label>
                  <input className={inputCls} placeholder="React, TypeScript, Node.js, AWS..." value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
                </div>

                <div className="flex items-center gap-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <input type="checkbox" id="active" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} className="w-5 h-5 accent-black" />
                  <label htmlFor="active" className="text-sm font-bold cursor-pointer">Listing is Active (visible to users)</label>
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-neutral-100 flex justify-between items-center">
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">All listings go live immediately.</p>
                <div className="flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-[10px] uppercase tracking-widest font-bold text-neutral-400 hover:text-black">Cancel</button>
                  <button onClick={save} disabled={saving} className="px-10 py-3 bg-black text-white rounded-2xl text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2 hover:bg-neutral-800 transition-all shadow-xl disabled:opacity-50">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {editingJob ? "Save Changes" : "Publish Job"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
