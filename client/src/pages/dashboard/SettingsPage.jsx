import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PencilEdit02Icon, 
  SettingsIcon, 
  FlashIcon, 
  UserIcon, 
  LockIcon, 
  NotificationIcon, 
  SecurityCheckIcon,
  PowerIcon,
  ArrowRight01Icon,
  SaveIcon,
  Delete02Icon,
  Loading01Icon,
  Globe02Icon,
  PlusSignIcon,
  Award01Icon,
  UserGroupIcon,
  GithubIcon,
  LinkedinIcon,
  Link01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SkeletonComponent from "../../components/ui/Skeleton";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Global Profile");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    role: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: ""
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState("");

  const [notifications, setNotifications] = useState({
    teamAlerts: true,
    projectSync: true,
    badgeMastery: true,
    securityPulse: true
  });
  const [privacyPrefs, setPrivacyPrefs] = useState({
    discovery: true,
    liveStream: true,
    eliteBadge: true
  });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/profile", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          username: data.user.username || "",
          bio: data.user.bio || "",
          role: data.user.role || "",
          githubUrl: data.user.githubUrl || "",
          linkedinUrl: data.user.linkedinUrl || "",
          portfolioUrl: data.user.portfolioUrl || ""
        });
        if (data.user.notifications) setNotifications(data.user.notifications);
        if (data.user.privacyPrefs) setPrivacyPrefs(data.user.privacyPrefs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setSuccess("Profile Updated Successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    setSecuritySaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "updatePassword",
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      
      setSecuritySuccess("Access Keys Updated.");
      setSecurityData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSecuritySuccess(""), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSecuritySaving(false);
    }
  };

  const handleSavePreferences = async (updates) => {
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action: "updateSettings",
          ...updates
        }),
      });
    } catch (err) {
      console.error("Failed to save preferences");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/delete", { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Failed to delete account");
    }
  };

  const profileStrength = () => {
    const fields = ['name', 'bio', 'role', 'githubUrl', 'linkedinUrl', 'portfolioUrl'];
    const filled = fields.filter(f => !!formData[f]).length;
    return (filled / fields.length) * 100;
  };

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  if (userLoading) {
    return (
      <div className="space-y-12 pb-20 max-w-[1400px] mx-auto">
        <header className="space-y-2">
          <SkeletonComponent className="w-64 h-8" />
          <SkeletonComponent className="w-96 h-4" />
        </header>
        <div className="bg-[#0e0e0e] border border-white/[0.08] rounded-[2.5rem] overflow-hidden">
          <div className="flex px-10 pt-8 border-b border-white/[0.04] gap-10">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonComponent key={i} className="w-24 h-6 mb-6" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20 max-w-[1400px] mx-auto"
    >
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight font-headline italic uppercase">System <span className="text-primary opacity-40">Configuration</span></h1>
        <p className="text-neutral-500 text-sm mt-1 font-medium">Manage your profile, security preferences, and notifications.</p>
      </header>

      <div className="bg-[#0e0e0e] border border-white/[0.08] rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="flex px-10 pt-8 border-b border-white/[0.04] gap-10 overflow-x-auto custom-scrollbar bg-[#0c0c0c]/50">
          {[
            { name: "Global Profile", icon: UserIcon },
            { name: "Security",       icon: LockIcon },
            { name: "Notifications",  icon: NotificationIcon },
            { name: "Connectivity",   icon: Link01Icon }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
               <button 
                key={tab.name} 
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-3 pb-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap italic ${
                  isActive ? "border-primary text-primary" : "border-transparent text-neutral-600 hover:text-white"
                }`}
              >
                <HugeiconsIcon icon={Icon} size={14} />
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className="p-10 lg:p-14 min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === "Global Profile" && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-16"
              >
                <div className="lg:col-span-7 space-y-12">
                  <div className="flex items-center gap-8 bg-[#111] p-6 rounded-3xl border border-white/[0.04]">
                    <div className="relative group/avatar">
                      <div className="w-24 h-24 rounded-2xl border-2 border-white/[0.08] p-1.5 bg-[#151515] overflow-hidden group-hover/avatar:border-primary/40 transition-all shadow-xl">
                        {user?.avatar ? (
                          <img className="w-full h-full object-cover rounded-xl" src={user.avatar} alt="Profile" />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black text-2xl uppercase italic">
                            {user?.username?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary flex items-center justify-center text-black shadow-xl hover:scale-110 active:scale-95 transition-all border border-white/10">
                        <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm tracking-tight mb-1">Profile Picture</h3>
                      <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest leading-relaxed">Personalize your account with <br/>a professional image.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="E.G. JOHN DOE"
                          className="w-full bg-[#111] border border-white/[0.06] rounded-xl px-5 py-4 text-white text-[13px] font-medium focus:border-primary/50 transition-all outline-none italic"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Professional Role</label>
                        <input 
                          type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                          placeholder="E.G. FULLSTACK ARCHITECT"
                          className="w-full bg-[#111] border border-white/[0.06] rounded-xl px-5 py-4 text-white text-[13px] font-medium focus:border-primary/50 transition-all outline-none italic"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">About You</label>
                      <textarea 
                        rows={3} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="SUMMARIZE YOUR PROFESSIONAL IDENTITY..."
                        className="w-full bg-[#111] border border-white/[0.06] rounded-xl px-5 py-4 text-white text-[13px] font-medium focus:border-primary/50 transition-all outline-none resize-none leading-relaxed italic"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <HugeiconsIcon icon={GithubIcon} size={12} /> GitHub
                        </label>
                        <input 
                          type="url" value={formData.githubUrl} onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                          placeholder="HTTPS://GITHUB.COM/..."
                          className="w-full bg-[#111] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-[13px] font-medium focus:border-primary/50 transition-all outline-none italic"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <HugeiconsIcon icon={LinkedinIcon} size={12} /> LinkedIn
                        </label>
                        <input 
                          type="url" value={formData.linkedinUrl} onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                          placeholder="HTTPS://LINKEDIN.COM/..."
                          className="w-full bg-[#111] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-[13px] font-medium focus:border-primary/50 transition-all outline-none italic"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <HugeiconsIcon icon={Globe02Icon} size={12} /> Portfolio
                        </label>
                        <input 
                          type="url" value={formData.portfolioUrl} onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                          placeholder="HTTPS://MY-WORK.COM"
                          className="w-full bg-[#111] border border-white/[0.06] rounded-xl px-4 py-3 text-white text-[13px] font-medium focus:border-primary/50 transition-all outline-none italic"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-4 border-t border-white/[0.04]">
                      {success && <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 italic"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {success}</p>}
                      {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest italic">{error}</p>}
                      <div className="flex gap-4">
                        <button disabled={saving} className="px-8 py-3 bg-primary text-black rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 italic">
                          {saving ? <HugeiconsIcon icon={Loading01Icon} size={14} className="animate-spin" /> : <HugeiconsIcon icon={SaveIcon} size={14} />} Save Profile
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="lg:col-span-5 space-y-8">
                  <div className="p-10 rounded-[2rem] bg-[#111] border border-white/[0.04] space-y-10">
                    <h3 className="text-white font-bold text-sm flex items-center gap-3 pb-6 border-b border-white/[0.04] uppercase tracking-widest italic">
                      <HugeiconsIcon icon={SettingsIcon} size={18} className="text-primary" />
                      Privacy Settings
                    </h3>
                    
                    {[
                      { id: 'discovery', label: "Profile Discovery", desc: "Allow other members to discover you." },
                      { id: 'liveStream', label: "Live Activity", desc: "Show your active status." },
                      { id: 'eliteBadge', label: "Badge Visibility", desc: "Display your achievements." },
                    ].map((pref, i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-tight italic">{pref.label}</p>
                          <p className="text-[10px] text-neutral-600 font-bold mt-1 uppercase tracking-tighter italic">{pref.desc}</p>
                        </div>
                        <div 
                          onClick={() => {
                            const updated = {...privacyPrefs, [pref.id]: !privacyPrefs[pref.id]};
                            setPrivacyPrefs(updated);
                            handleSavePreferences({ privacyPrefs: updated, notifications });
                          }}
                          className={`w-11 h-6 rounded-full p-1 transition-all cursor-pointer relative ${privacyPrefs[pref.id] ? 'bg-primary' : 'bg-neutral-800'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-all shadow-md ${privacyPrefs[pref.id] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-10 rounded-[2.5rem] bg-[#0e0e0e] border border-white/[0.06] shadow-xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <HugeiconsIcon icon={FlashIcon} size={80} className="text-primary" />
                     </div>
                     <div className="flex justify-between items-center mb-6 relative z-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Profile Completion</h4>
                        <span className="text-primary text-[10px] font-black uppercase italic">{profileStrength() === 100 ? 'Complete' : 'Incomplete'}</span>
                     </div>
                     <div className="flex items-baseline gap-2 mb-4 relative z-10">
                        <span className="text-5xl font-black text-white font-headline italic">{Math.round(profileStrength())}</span>
                        <span className="text-neutral-700 font-bold text-sm">%</span>
                     </div>
                     <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden relative z-10">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${profileStrength()}%` }} transition={{ duration: 1.5 }} className="h-full bg-primary"></motion.div>
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Security" && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-2xl mx-auto space-y-12 py-10"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
                    <HugeiconsIcon icon={SecurityCheckIcon} size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight font-headline italic">Security</h2>
                  <p className="text-neutral-500 text-sm font-medium">Manage your password and security settings.</p>
                </div>

                <form onSubmit={handleSaveSecurity} className="space-y-8 bg-[#111] border border-white/[0.04] p-10 rounded-[2.5rem]">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Current Password</label>
                      <input 
                        required type="password" placeholder="••••••••" 
                        value={securityData.currentPassword} onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                        className="w-full bg-[#0c0c0c] border border-white/[0.06] rounded-xl px-5 py-4 text-white text-[13px] outline-none focus:border-primary/50 transition-all italic" 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-3">
                        <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">New Password</label>
                        <input 
                          required type="password" placeholder="NEW PASSWORD" 
                          value={securityData.newPassword} onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                          className="w-full bg-[#0c0c0c] border border-white/[0.06] rounded-xl px-5 py-4 text-white text-[13px] outline-none focus:border-primary/50 transition-all italic" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Confirm Password</label>
                        <input 
                          required type="password" placeholder="REPEAT PASSWORD" 
                          value={securityData.confirmPassword} onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                          className="w-full bg-[#0c0c0c] border border-white/[0.06] rounded-xl px-5 py-4 text-white text-[13px] outline-none focus:border-primary/50 transition-all italic" 
                        />
                      </div>
                    </div>
                  </div>
                  {securitySuccess && <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 italic"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {securitySuccess}</p>}
                  <button disabled={securitySaving} type="submit" className="w-full py-4 bg-white text-black font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-2xl italic">
                    {securitySaving ? <HugeiconsIcon icon={Loading01Icon} size={16} className="animate-spin" /> : "Update Password"}
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === "Notifications" && (
              <motion.div 
                key="notifications"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="max-w-3xl mx-auto py-10"
              >
                <div className="flex items-center gap-4 mb-12">
                   <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                      <HugeiconsIcon icon={NotificationIcon} size={24} />
                   </div>
                   <div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-tight font-headline italic">Notifications</h2>
                      <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-1">Configure your incoming system notifications.</p>
                   </div>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'projectSync', title: "Project Sync Signals", desc: "Get updates on branch commits and project deployment status.", icon: FlashIcon },
                    { id: 'badgeMastery', title: "Badge & Rank Mastery", desc: "Notify when your mastery XP triggers a rank elevation.", icon: Award01Icon },
                    { id: 'securityPulse', title: "System Security Pulse", desc: "Alerts for unusual node access or critical security audits.", icon: SecurityCheckIcon },
                  ].map((signal, i) => (
                    <div key={i} className="flex items-center justify-between p-8 bg-[#111] border border-white/[0.04] rounded-3xl hover:border-white/10 transition-all group">
                       <div className="flex items-center gap-6">
                          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-neutral-600 group-hover:text-primary transition-colors">
                             <HugeiconsIcon icon={signal.icon} size={18} />
                          </div>
                          <div>
                             <h4 className="text-sm font-bold text-white uppercase tracking-tight italic">{signal.title}</h4>
                             <p className="text-[11px] text-neutral-600 font-medium mt-1 leading-relaxed italic">{signal.desc}</p>
                          </div>
                       </div>
                       <div 
                        onClick={() => {
                          const updated = {...notifications, [signal.id]: !notifications[signal.id]};
                          setNotifications(updated);
                          handleSavePreferences({ notifications: updated, privacyPrefs });
                        }}
                        className={`w-11 h-6 rounded-full p-1 transition-all cursor-pointer relative ${notifications[signal.id] ? 'bg-primary' : 'bg-neutral-800'}`}
                       >
                          <div className={`w-4 h-4 bg-white rounded-full transition-all shadow-md ${notifications[signal.id] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "Connectivity" && (
              <motion.div 
                key="connectivity"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="max-w-3xl mx-auto py-10"
              >
                <div className="flex items-center gap-4 mb-12">
                   <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                      <HugeiconsIcon icon={Link01Icon} size={24} />
                   </div>
                   <div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-tight font-headline italic">Connected Accounts</h2>
                      <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-1">Link your external identities for quick access.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="p-8 bg-[#111] border border-white/[0.04] rounded-3xl flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10">
                            <HugeiconsIcon icon={GithubIcon} size={24} />
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight italic">GitHub Identity</h4>
                            <p className="text-[11px] text-neutral-500 font-medium mt-1 italic">Automatically sync your repositories and commits.</p>
                         </div>
                      </div>
                      <button className="px-6 py-3 bg-white/5 hover:bg-white text-neutral-400 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 italic">
                         Connect
                      </button>
                   </div>
                   <div className="p-8 bg-[#111] border border-white/[0.04] rounded-3xl flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                            <HugeiconsIcon icon={LinkedinIcon} size={24} />
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight italic">LinkedIn Identity</h4>
                            <p className="text-[11px] text-neutral-500 font-medium mt-1 italic">Display your professional network on your profile.</p>
                         </div>
                      </div>
                      <button className="px-6 py-3 bg-white/5 hover:bg-white text-neutral-400 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 italic">
                         Connect
                      </button>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <section className="max-w-4xl mx-auto bg-red-500/[0.02] border border-red-500/10 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-red-500 font-black text-sm uppercase flex items-center gap-2 mb-1 italic">
            <HugeiconsIcon icon={PowerIcon} size={16} /> Danger Zone
          </h3>
          <p className="text-neutral-500 text-[10px] font-medium max-w-sm uppercase italic">Deleting your account is permanent. All data, XP, and projects will be wiped instantly.</p>
        </div>
        <button onClick={handleDeleteAccount} className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20 italic">
          Delete Account
        </button>
      </section>
    </motion.div>
  );
}
