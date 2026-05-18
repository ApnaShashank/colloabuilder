"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  PencilEdit02Icon, 
  SettingsIcon, 
  FlashIcon, 
  UserIcon, 
  LockIcon, 
  NotificationIcon, 
  SecurityCheckIcon,
  PowerIcon,
  SaveIcon,
  Loading01Icon,
  Globe02Icon,
  GithubIcon,
  LinkedinIcon,
  Link01Icon,
  CommandIcon,
  PlusSignIcon,
  Delete02Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Skeleton from "@/components/ui/Skeleton";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, refreshUser } = useUser();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    username: "",
    bio: "",
    role: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    techStack: "",
    customLinks: []
  });

  const handleUpdatePlan = async (targetPlan: 'free' | 'pro') => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/plan", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ plan: targetPlan }),
      });
      if (res.ok) {
        toast.success(`Switched account plan to ${targetPlan.toUpperCase()}`);
        await refreshUser();
      } else {
        toast.error("Failed to transition subscription tier");
      }
    } catch (err) {
      toast.error("Subscription update failure");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: (user as any).name || "",
        username: (user as any).username || "",
        bio: (user as any).bio || "",
        role: (user as any).role || "",
        githubUrl: (user as any).githubUrl || "",
        linkedinUrl: (user as any).linkedinUrl || "",
        portfolioUrl: (user as any).portfolioUrl || "",
        techStack: (user as any).techStack?.join(", ") || "",
        customLinks: (user as any).customLinks || []
      });
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const processedData = {
        ...formData,
        techStack: formData.techStack.split(",").map((s: string) => s.trim()).filter((s: string) => s !== "")
      };

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(processedData),
      });
      if (res.ok) {
        toast.success("Profile updated successfully");
        window.location.reload();
      }
      else toast.error("Update failed");
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json().catch(() => ({ success: false, message: "Invalid server response" }));
      if (data.success) {
        toast.success("Visual signature updated");
        window.location.reload();
      } else {
        toast.error(data.message || data.error || "Upload failed");
      }
    } catch (err) {
      toast.error("Network disruption");
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <Skeleton className="h-[600px] rounded-[3rem]" />;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 px-4 lg:px-0">
      
      {/* ── HEADER ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
         <div>
            <h1 className="text-4xl lg:text-6xl font-black text-white italic uppercase tracking-tighter font-headline leading-none">Account <span className="text-primary">Settings.</span></h1>
            <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.3em] mt-4 italic flex items-center gap-2">
               <HugeiconsIcon icon={CommandIcon} size={12} className="text-primary" /> 
               Manage your profile, skills, and social links
            </p>
         </div>
         <button 
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-10 py-4 bg-primary text-black rounded-2xl font-black uppercase tracking-widest text-[10px] italic shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
         >
            {saving ? <HugeiconsIcon icon={Loading01Icon} size={16} className="animate-spin" /> : <HugeiconsIcon icon={SaveIcon} size={16} />} 
            Deploy Changes
         </button>
      </header>

      {/* ── CORE SETTINGS ── */}
      <div className="space-y-16">
         
         {/* 1. Identity & Visuals */}
         <section className="space-y-10">
            <div className="flex items-center gap-4">
               <span className="text-white font-black text-xs italic opacity-30">01</span>
               <h3 className="text-white font-black uppercase italic text-sm tracking-widest">Profile & Photo</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
               <div className="lg:col-span-4">
                  <div className="relative group w-full aspect-square max-w-[240px] mx-auto lg:mx-0">
                     <div className="w-full h-full rounded-[2.5rem] bg-white/[0.02] border border-white/10 flex items-center justify-center overflow-hidden relative shadow-2xl">
                        {uploading ? (
                          <HugeiconsIcon icon={Loading01Icon} className="animate-spin text-primary w-10 h-10" />
                        ) : (
                          <>
                            {(user as any).avatar ? (
                              <img src={(user as any).avatar} alt="Avatar" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            ) : (
                              <span className="text-primary/20 font-black text-6xl italic uppercase">{user.name?.charAt(0)}</span>
                            )}
                            <label className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all gap-2">
                               <HugeiconsIcon icon={PencilEdit02Icon} className="text-white w-8 h-8" />
                               <span className="text-[8px] font-black text-white uppercase tracking-widest">Change Photo</span>
                               <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                          </>
                        )}
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <label className="text-[9px] font-black text-neutral-700 uppercase tracking-widest italic ml-1">Full Name</label>
                        <input 
                           className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-[12px] font-black uppercase italic text-white focus:border-primary/50 outline-none transition-all focus:bg-white/[0.04]"
                           value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[9px] font-black text-neutral-700 uppercase tracking-widest italic ml-1">Username (@)</label>
                        <input 
                           className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-[12px] font-black uppercase italic text-white focus:border-primary/50 outline-none transition-all focus:bg-white/[0.04]"
                           value={formData.username} onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, "")})}
                        />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[9px] font-black text-neutral-700 uppercase tracking-widest italic ml-1">Current Role / Protocol</label>
                     <input 
                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-[12px] font-black uppercase italic text-white focus:border-primary/50 outline-none transition-all focus:bg-white/[0.04]"
                        value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                     />
                  </div>
               </div>
            </div>
         </section>

         {/* 2. Tactical Info */}
         <section className="space-y-10">
            <div className="flex items-center gap-4">
               <span className="text-white font-black text-xs italic opacity-30">02</span>
               <h3 className="text-white font-black uppercase italic text-sm tracking-widest">About You</h3>
            </div>
            
            <div className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-neutral-700 uppercase tracking-widest italic ml-1">Bio</label>
                  <textarea 
                     rows={4}
                     className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-[12px] font-black uppercase italic text-white focus:border-primary/50 outline-none resize-none transition-all focus:bg-white/[0.04]"
                     value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-neutral-700 uppercase tracking-widest italic ml-1">Skills (Comma separated)</label>
                  <input 
                     className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-[12px] font-black uppercase italic text-white focus:border-primary/50 outline-none transition-all focus:bg-white/[0.04]"
                     placeholder="React, Next.js, TypeScript..."
                     value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})}
                  />
               </div>
            </div>
         </section>

         {/* 3. Connectivity Nodes */}
         <section className="space-y-10">
            <div className="flex items-center gap-4">
               <span className="text-white font-black text-xs italic opacity-30">03</span>
               <h3 className="text-white font-black uppercase italic text-sm tracking-widest">Social Links</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-neutral-700 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                     <HugeiconsIcon icon={GithubIcon} size={10} /> GitHub
                  </label>
                  <input 
                     className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-[12px] font-black uppercase italic text-white focus:border-primary/50 outline-none transition-all focus:bg-white/[0.04]"
                     value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})}
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-neutral-700 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                     <HugeiconsIcon icon={LinkedinIcon} size={10} /> LinkedIn
                  </label>
                  <input 
                     className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-[12px] font-black uppercase italic text-white focus:border-primary/50 outline-none transition-all focus:bg-white/[0.04]"
                     value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})}
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-neutral-700 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                     <HugeiconsIcon icon={Link01Icon} size={10} /> Portfolio
                  </label>
                  <input 
                     className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-[12px] font-black uppercase italic text-white focus:border-primary/50 outline-none transition-all focus:bg-white/[0.04]"
                     value={formData.portfolioUrl} onChange={e => setFormData({...formData, portfolioUrl: e.target.value})}
                  />
               </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
               <div className="flex items-center justify-between">
                  <label className="text-[9px] font-black text-neutral-700 uppercase tracking-widest italic ml-1">Other Custom Links</label>
                  <button 
                     type="button"
                     onClick={() => setFormData({...formData, customLinks: [...formData.customLinks, { name: "", url: "" }]})}
                     className="text-[9px] font-black text-primary uppercase tracking-widest italic flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  >
                     <HugeiconsIcon icon={PlusSignIcon} size={10} /> Add Another Link
                  </button>
               </div>
               
               <div className="space-y-4">
                  {formData.customLinks.map((link: any, idx: number) => (
                     <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white/[0.01] p-4 rounded-2xl border border-white/5">
                        <div className="md:col-span-4 space-y-2">
                           <label className="text-[8px] font-black text-neutral-800 uppercase tracking-widest italic ml-1">Link Name</label>
                           <input 
                              className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-[11px] font-black uppercase italic text-white focus:border-primary/50 outline-none transition-all"
                              placeholder="E.G. BEHANCE"
                              value={link.name} 
                              onChange={e => {
                                 const newLinks = [...formData.customLinks];
                                 newLinks[idx].name = e.target.value;
                                 setFormData({...formData, customLinks: newLinks});
                              }}
                           />
                        </div>
                        <div className="md:col-span-7 space-y-2">
                           <label className="text-[8px] font-black text-neutral-800 uppercase tracking-widest italic ml-1">URL</label>
                           <input 
                              className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-[11px] font-black uppercase italic text-white focus:border-primary/50 outline-none transition-all"
                              placeholder="HTTPS://..."
                              value={link.url} 
                              onChange={e => {
                                 const newLinks = [...formData.customLinks];
                                 newLinks[idx].url = e.target.value;
                                 setFormData({...formData, customLinks: newLinks});
                              }}
                           />
                        </div>
                        <div className="md:col-span-1 flex justify-center pb-1">
                           <button 
                              type="button"
                              onClick={() => {
                                 const newLinks = formData.customLinks.filter((_: any, i: number) => i !== idx);
                                 setFormData({...formData, customLinks: newLinks});
                              }}
                              className="p-2 text-neutral-700 hover:text-red-500 transition-colors"
                           >
                              <HugeiconsIcon icon={Delete02Icon} size={16} />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* 4. Plan & Subscription */}
         <section className="space-y-10">
            <div className="flex items-center gap-4">
               <span className="text-white font-black text-xs italic opacity-30">04</span>
               <h3 className="text-white font-black uppercase italic text-sm tracking-widest">Plan & Subscription</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Free Plan Card */}
               <div className={`p-8 rounded-[2rem] border transition-all duration-300 ${
                  user.plan !== 'pro' 
                     ? 'bg-white/[0.02] border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.02)]' 
                     : 'bg-transparent border-white/5 opacity-50 hover:opacity-80'
               }`}>
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <h4 className="text-lg font-black text-white uppercase italic">FREE TIER</h4>
                        <p className="text-[9px] font-black text-neutral-500 uppercase tracking-wider mt-1">Standard Development Access</p>
                     </div>
                     {user.plan !== 'pro' && (
                        <span className="px-3 py-1 bg-white/10 text-white border border-white/20 text-[8px] font-black uppercase rounded-lg">Active</span>
                     )}
                  </div>
                  <ul className="space-y-3 text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-8">
                     <li className="flex items-center gap-2">✓ Basic Learn Mode (HTML, CSS, JS)</li>
                     <li className="flex items-center gap-2">✓ Standard Practice Problems (Easy/Medium)</li>
                     <li className="flex items-center gap-2">✓ AI Job Searches: {(user as any).aiJobSearchCount || 0} / 3 Used</li>
                     <li className="flex items-center gap-2">✓ Practice Arena Submissions: {(user as any).practiceCount || 0} / 5 Used</li>
                  </ul>
                  {user.plan === 'pro' && (
                     <button 
                        type="button"
                        onClick={() => handleUpdatePlan('free')}
                        disabled={saving}
                        className="w-full py-4 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] italic hover:bg-white hover:text-black transition-all"
                     >
                        Downgrade to Free
                     </button>
                  )}
               </div>

               {/* Pro Plan Card */}
               <div className={`p-8 rounded-[2rem] border relative overflow-hidden transition-all duration-300 ${
                  user.plan === 'pro' 
                     ? 'bg-primary/5 border-primary/40 shadow-[0_0_40px_rgba(37,99,235,0.05)]' 
                     : 'bg-transparent border-white/5 hover:border-primary/20 group'
               }`}>
                  <div className="absolute top-0 right-0 bg-primary text-black font-black text-[7px] uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
                     UNLIMITED
                  </div>
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <h4 className="text-lg font-black text-primary uppercase italic">PRO SYSTEM</h4>
                        <p className="text-[9px] font-black text-primary/60 uppercase tracking-wider mt-1">High-Frequency Engineering</p>
                     </div>
                     {user.plan === 'pro' && (
                        <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 text-[8px] font-black uppercase rounded-lg">Active</span>
                     )}
                  </div>
                  <ul className="space-y-3 text-[10px] font-black uppercase text-neutral-300 tracking-wider mb-8">
                     <li className="flex items-center gap-2 text-primary">⚡ Unlimited Learn Mode (Next.js, Tailwind, etc.)</li>
                     <li className="flex items-center gap-2 text-primary">⚡ Hard practice challenges unlocked</li>
                     <li className="flex items-center gap-2 text-primary">⚡ Unlimited AI Web Job Search</li>
                     <li className="flex items-center gap-2 text-primary">⚡ Unlimited practice code submissions</li>
                  </ul>
                  {user.plan !== 'pro' ? (
                     <button 
                        type="button"
                        onClick={() => handleUpdatePlan('pro')}
                        disabled={saving}
                        className="w-full py-4 bg-primary text-black rounded-2xl font-black uppercase tracking-widest text-[9px] italic shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                     >
                        Upgrade to Pro
                     </button>
                  ) : (
                     <div className="w-full py-4 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black uppercase tracking-widest text-[9px] italic text-center">
                        Active Premium License
                     </div>
                  )}
               </div>
            </div>
         </section>

         {/* 5. Integrity Check (Security) */}
         <section className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
            <div className="flex items-center justify-between">
               <h4 className="text-white font-black italic uppercase text-sm flex items-center gap-3">
                  <HugeiconsIcon icon={SecurityCheckIcon} size={16} className="text-primary" /> Security
               </h4>
               <span className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase rounded-lg border border-primary/20">Active</span>
            </div>
            <p className="text-neutral-600 text-[10px] font-black uppercase italic tracking-widest leading-relaxed">
               Your password and security settings are managed through your account. Contact support if you need to reset your credentials.
            </p>
         </section>

      </div>

      {/* ── DANGER ZONE ── */}
      <section className="bg-red-500/[0.03] border border-red-500/10 p-10 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-10 opacity-60 hover:opacity-100 transition-opacity">
         <div className="max-w-md">
            <h4 className="text-red-500 font-black uppercase italic text-sm mb-2 flex items-center gap-2">
               <HugeiconsIcon icon={PowerIcon} size={16} /> Delete Account
            </h4>
            <p className="text-[9px] text-neutral-600 font-black uppercase italic leading-relaxed tracking-widest">
               Permanently delete your account and all associated data. This action cannot be undone.
            </p>
         </div>
         <button className="px-10 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase tracking-widest text-[10px] italic hover:bg-red-500 hover:text-white transition-all">
            Delete Account
         </button>
      </section>

    </div>
  );
}
