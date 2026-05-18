"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Shield, 
  SwitchCamera, 
  Database, 
  Lock, 
  RefreshCcw, 
  Save,
  Loader2,
  HardDrive,
  Cpu,
  CheckCircle2
} from "lucide-react";

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setConfig(data);
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updates: any) => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setConfig(updated);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {} finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold tracking-widest text-neutral-300">CORE_CONFIG_LOAD</div>;

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
          <p className="text-neutral-500 text-sm mt-1">Platform-wide configurations and global overrides.</p>
        </div>
        {success && (
           <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest animate-in fade-in zoom-in">
              <CheckCircle2 size={16} /> Config Updated
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Toggle Sections */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
             <h3 className="font-bold flex items-center gap-2">
                <Shield size={18} className="text-neutral-400" />
                Global Controls
             </h3>
          </div>
          <div className="divide-y divide-neutral-100">
             {[
               { id: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Disable public access to the dashboard and landing page for all non-admins.', icon: Lock },
               { id: 'allowSignups', label: 'Allow New Signups', desc: 'Allow or block new user registrations globally.', icon: SwitchCamera },
               { id: 'debugMode', label: 'Advanced Debug Logging', desc: 'Enable verbose logging in production (Performance impact high).', icon: RefreshCcw },
             ].map((item) => (
                <div key={item.id} className="p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                   <div className="flex items-start gap-4">
                      <div className="mt-1 p-2 bg-neutral-100 rounded-lg text-neutral-500">
                         <item.icon size={16} />
                      </div>
                      <div>
                         <p className="font-bold text-sm text-neutral-900">{item.label}</p>
                         <p className="text-xs text-neutral-500 mt-1 max-w-sm leading-relaxed">{item.desc}</p>
                      </div>
                   </div>
                   <button 
                     disabled={saving}
                     onClick={() => handleUpdate({ [item.id]: !config[item.id] })}
                     className={`w-12 h-6 rounded-full transition-all relative ${config[item.id] ? 'bg-black' : 'bg-neutral-200'}`}
                   >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config[item.id] ? 'left-7' : 'left-1'}`} />
                   </button>
                </div>
             ))}
          </div>
        </div>

        {/* Subscription & Paywall Controls */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-8 space-y-8">
           <h3 className="font-bold flex items-center gap-2 text-neutral-900 border-b border-neutral-100 pb-4">
              <SwitchCamera size={18} className="text-neutral-400" />
              Paywall & Access Configuration
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Limits */}
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Max Free AI Job Searches</label>
                    <input 
                      type="number" 
                      min="0"
                      value={config.maxFreeAiJobSearches ?? 3} 
                      onChange={(e) => handleUpdate({ maxFreeAiJobSearches: parseInt(e.target.value) || 0 })}
                      className="w-full max-w-xs px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black" 
                    />
                    <p className="text-[10px] text-neutral-400 italic">Number of AI searches a Free tier user can perform.</p>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Max Free Practice Submissions</label>
                    <input 
                      type="number" 
                      min="0"
                      value={config.maxFreePracticeProblems ?? 5} 
                      onChange={(e) => handleUpdate({ maxFreePracticeProblems: parseInt(e.target.value) || 0 })}
                      className="w-full max-w-xs px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black" 
                    />
                    <p className="text-[10px] text-neutral-400 italic">Total practice code submissions allowed for Free tier users.</p>
                 </div>
              </div>

              {/* Right Column: Premium Features */}
              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Learn Mode - Pro Categories</label>
                    <div className="space-y-2">
                       {['html', 'css', 'javascript', 'react', 'nextjs', 'tailwind'].map((cat) => {
                          const isPro = config.proCategories?.includes(cat);
                          return (
                             <label key={cat} className="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
                                <input 
                                   type="checkbox" 
                                   checked={isPro}
                                   onChange={() => {
                                      const updatedList = isPro 
                                         ? config.proCategories.filter((c: string) => c !== cat)
                                         : [...(config.proCategories || []), cat];
                                      handleUpdate({ proCategories: updatedList });
                                   }}
                                   className="rounded text-black focus:ring-black"
                                />
                                <span className="text-xs uppercase font-bold tracking-wider text-neutral-700">{cat}</span>
                             </label>
                          );
                       })}
                    </div>
                 </div>

                 <div className="space-y-3 pt-4 border-t border-neutral-100">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Practice Arena - Pro Difficulties</label>
                    <div className="space-y-2">
                       {['Easy', 'Medium', 'Hard'].map((diff) => {
                          const isPro = config.proPracticeDifficulties?.includes(diff);
                          return (
                             <label key={diff} className="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
                                <input 
                                   type="checkbox" 
                                   checked={isPro}
                                   onChange={() => {
                                      const updatedList = isPro 
                                         ? config.proPracticeDifficulties.filter((d: string) => d !== diff)
                                         : [...(config.proPracticeDifficulties || []), diff];
                                      handleUpdate({ proPracticeDifficulties: updatedList });
                                   }}
                                   className="rounded text-black focus:ring-black"
                                />
                                <span className="text-xs uppercase font-bold tracking-wider text-neutral-700">{diff}</span>
                             </label>
                          );
                       })}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Site Config */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-8">
           <h3 className="font-bold mb-6 flex items-center gap-2 text-neutral-900 border-b border-neutral-100 pb-4">
              <Settings size={18} className="text-neutral-400" />
              General Configuration
           </h3>
           <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Platform Display Name</label>
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      defaultValue={config.siteName} 
                      className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none" 
                    />
                    <button className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest">Update</button>
                 </div>
              </div>
           </div>
        </div>

        {/* System Stats (Technical) */}
        <div className="bg-neutral-950 text-white rounded-2xl p-8 border border-white/5 space-y-8">
           <div className="flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                 <Cpu size={18} className="text-neutral-500" />
                 Server Resources
              </h3>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-bold uppercase text-neutral-400 tracking-widest">LIVE_SOCKET_SYNC</span>
           </div>
           
           <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">CPU Usage</span>
                    <span className="text-xs font-mono">12.4%</span>
                 </div>
                 <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[12.4%] rounded-full shadow-[0_0_10px_white]" />
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Memory (RAM)</span>
                    <span className="text-xs font-mono">1.2GB / 4GB</span>
                 </div>
                 <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[30%] rounded-full shadow-[0_0_10px_white]" />
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-4 text-neutral-500 text-[10px] font-bold uppercase tracking-widest pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 API_GATEWAY: OK
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 DB_V3_CLUSTER: OK
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
