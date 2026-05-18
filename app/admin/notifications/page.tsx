"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  Send, 
  Trash2, 
  Clock, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Plus,
  Loader2,
  Megaphone
} from "lucide-react";

export default function NotificationsPage() {
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBroadcast, setNewBroadcast] = useState({
    title: "",
    content: "",
    type: "Info",
    priority: "Normal"
  });

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (data.broadcasts) setBroadcasts(data.broadcasts);
    } catch (err) {
      console.error("Failed to fetch broadcasts");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBroadcast),
      });
      if (res.ok) {
        setNewBroadcast({ title: "", content: "", type: "Info", priority: "Normal" });
        fetchBroadcasts();
      }
    } catch (err) {}
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/notifications?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchBroadcasts();
    } catch (err) {}
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pb-10">
      {/* Left Column: Form */}
      <div className="xl:col-span-5 space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
             <div className="p-3 bg-black text-white rounded-xl">
                <Megaphone size={20} />
             </div>
             <div>
                <h2 className="font-bold text-lg">New Broadcast</h2>
                <p className="text-xs text-neutral-500">Post a system-wide announcement.</p>
             </div>
          </div>

          <form onSubmit={handleSend} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Announcement Title</label>
              <input 
                required
                type="text" 
                placeholder="e.g., Scheduled Maintenance" 
                value={newBroadcast.title}
                onChange={(e) => setNewBroadcast({...newBroadcast, title: e.target.value})}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Content</label>
              <textarea 
                required
                rows={4}
                placeholder="What do you want to tell the users?"
                value={newBroadcast.content}
                onChange={(e) => setNewBroadcast({...newBroadcast, content: e.target.value})}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Type</label>
                  <select 
                    value={newBroadcast.type}
                    onChange={(e) => setNewBroadcast({...newBroadcast, type: e.target.value})}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none"
                  >
                     <option>Info</option>
                     <option>Update</option>
                     <option>Alert</option>
                     <option>Success</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Priority</label>
                  <select 
                    value={newBroadcast.priority}
                    onChange={(e) => setNewBroadcast({...newBroadcast, priority: e.target.value})}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none"
                  >
                     <option>Normal</option>
                     <option>High</option>
                     <option>Critical</option>
                  </select>
               </div>
            </div>

            <button type="submit" className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all">
               <Send size={14} />
               Send Broadcast
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: History */}
      <div className="xl:col-span-7 space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm min-h-[600px]">
          <h2 className="font-bold text-lg mb-8">Announcement History</h2>

          {loading ? (
             <div className="py-20 text-center">
                <Loader2 className="animate-spin text-neutral-300 mx-auto" />
             </div>
          ) : broadcasts.length === 0 ? (
             <div className="py-20 text-center text-neutral-400 italic">
                No announcements have been made yet.
             </div>
          ) : (
             <div className="space-y-4">
               {broadcasts.map((b) => (
                 <div key={b._id} className="p-6 border border-neutral-100 rounded-2xl hover:bg-neutral-50 transition-all group relative">
                    <div className="flex justify-between items-start mb-4">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                          b.type === 'Alert' ? 'bg-red-50 text-red-600 border-red-100' :
                          b.type === 'Update' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-neutral-100 text-neutral-600 border-neutral-200'
                       }`}>
                          {b.type}
                       </span>
                       <button onClick={() => handleDelete(b._id)} className="opacity-0 group-hover:opacity-100 p-2 text-neutral-400 hover:text-red-500 transition-all">
                          <Trash2 size={16} />
                       </button>
                    </div>
                    <h4 className="font-bold text-neutral-900">{b.title}</h4>
                    <p className="text-sm text-neutral-500 mt-2 leading-relaxed">{b.content}</p>
                    <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-4 text-neutral-400">
                       <div className="flex items-center gap-1.5">
                          <Clock size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                             {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
