"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserGroupIcon, 
  RocketIcon, 
  PlusSignIcon, 
  SentIcon,
  Delete02Icon,
  PencilEdit01Icon,
  Tick01Icon,
  Cancel01Icon,
  LockIcon,
  GlobalIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Skeleton from "@/components/ui/Skeleton";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

export default function TeamsPage() {
  const { user } = useUser();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  
  // Create Team States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTeamName, setCreateTeamName] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // Rename States
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/teams", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json().catch(() => ({ success: false }));
        if (data.success) setTeams(data.teams || []);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchTeams(); }, []);

  useEffect(() => {
    let interval: any;
    if (selectedTeam) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem("token");
          const teamId = selectedTeam.id || selectedTeam._id;
          const res = await fetch(`/api/teams/${teamId}/messages`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json().catch(() => ({ success: false }));
            if (data.success) setMessages(data.messages || []);
          }
        } catch (e) { console.error("Polling failed", e); }
      };
      fetchMessages();
      interval = setInterval(fetchMessages, 3000);
    } else {
      setMessages([]);
      setIsRenaming(false);
    }
    return () => clearInterval(interval);
  }, [selectedTeam]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleCreateTeam = async () => {
    const randomId = Math.random().toString(36).substring(2, 6).toUpperCase();
    const finalName = createTeamName.trim() || `Team-${randomId}`;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ 
          name: finalName, 
          description: `A team for collaboration`, 
          category: "General", 
          isPublic: isPublic 
        })
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (data.success) { 
        setTeams([data.team, ...teams]); 
        toast.success(`Team "${finalName}" created`); 
        setShowCreateModal(false);
        setCreateTeamName("");
      }
    } catch (e) { toast.error("Creation failed"); }
  };

  const handleDeleteTeam = async (e: React.MouseEvent, team: any) => {
    e.stopPropagation();
    const teamId = team._id || team.id;
    if (!teamId) return toast.error("Invalid team ID");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/teams/${teamId}/delete`, { 
        method: "POST", 
        headers: { "Authorization": `Bearer ${token}` } 
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json().catch(() => ({ success: false }));
        if (data.success) { 
          setTeams(teams.filter(t => (t._id || t.id) !== teamId)); 
          toast.success("Team deleted"); 
        } else {
          toast.error(data.error || "Delete failed");
        }
      } else {
        toast.error("System error: Non-JSON response");
      }
    } catch (e) { 
      console.error(e);
      toast.error("Network error"); 
    }
  };

  const handleRenameTeam = async () => {
    if (!newTeamName.trim() || newTeamName === selectedTeam.name) { setIsRenaming(false); return; }
    try {
      const token = localStorage.getItem("token");
      const teamId = selectedTeam.id || selectedTeam._id;
      await fetch(`/api/teams/${teamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: newTeamName })
      });
      setSelectedTeam({ ...selectedTeam, name: newTeamName });
      setTeams(teams.map(t => (t._id === teamId || t.id === teamId) ? { ...t, name: newTeamName } : t));
      setIsRenaming(false);
      toast.success("Team renamed");
    } catch (e) { toast.error("Rename failed"); }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedTeam) return;
    const content = chatInput.trim();
    setChatInput("");
    try {
      const token = localStorage.getItem("token");
      const teamId = selectedTeam.id || selectedTeam._id;
      const res = await fetch(`/api/teams/${teamId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ content })
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (data.success) setMessages(prev => [...prev, data.message]);
    } catch (e) { toast.error("Failed to send"); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 p-1 sm:p-2">
      
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.04] pb-5">
        <div className="space-y-1">
           <h1 className="text-3xl font-black text-white tracking-tight uppercase">Teams</h1>
           <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Create and manage your collaborative team workspaces.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="px-5 py-2.5 bg-white text-black rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2">
          <HugeiconsIcon icon={PlusSignIcon} size={14} /> Create Team
        </button>
      </header>

      {/* ── CREATE MODAL ── */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setShowCreateModal(false)}>
              <motion.div initial={{ scale: 0.98, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 8 }} className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-xl p-6 space-y-6" onClick={e => e.stopPropagation()}>
                 <div className="space-y-1">
                    <h2 className="text-xl font-black text-white uppercase">Create a New Team</h2>
                    <p className="text-neutral-500 text-xs">Set up your team name and visibility settings.</p>
                 </div>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest px-1">Team Name</label>
                       <input className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-white/20 text-sm" placeholder="e.g. Project Alpha" value={createTeamName} onChange={e => setCreateTeamName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest px-1">Access Protocol</label>
                       <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => setIsPublic(true)} className={`p-3.5 rounded-lg border flex flex-col items-center gap-2 transition-all ${isPublic ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-neutral-600'}`}>
                             <HugeiconsIcon icon={GlobalIcon} size={18} />
                             <span className="text-[9px] font-bold uppercase">Public</span>
                          </button>
                          <button onClick={() => setIsPublic(false)} className={`p-3.5 rounded-lg border flex flex-col items-center gap-2 transition-all ${!isPublic ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-neutral-600'}`}>
                             <HugeiconsIcon icon={LockIcon} size={18} />
                             <span className="text-[9px] font-bold uppercase">Private</span>
                          </button>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 bg-white/5 text-neutral-500 rounded-lg font-bold text-xs uppercase tracking-widest">Cancel</button>
                    <button onClick={handleCreateTeam} className="flex-1 py-2.5 bg-white text-black rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-neutral-200">Create Team</button>
                 </div>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* ── GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? [1,2,3].map(i => <Skeleton key={i} className="h-44 rounded-xl" />) : (
          teams.map((team) => (
            <motion.div key={team._id} onClick={() => setSelectedTeam(team)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#090909] border border-white/[0.05] p-6 rounded-xl hover:border-white/10 transition-all cursor-pointer relative group flex flex-col justify-between h-48 shadow-lg">
              <div className="flex justify-between items-start">
                 <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-white"><HugeiconsIcon icon={UserGroupIcon} size={16} /></div>
                 <div className="flex items-center gap-2">
                    {(team.ownerId?._id === user?._id || team.ownerId === user?._id) && (
                       <button onClick={(e) => handleDeleteTeam(e, team)} className="p-1.5 text-neutral-500 hover:text-red-500 transition-colors"><HugeiconsIcon icon={Delete02Icon} size={14} /></button>
                    )}
                    <div className={`w-2 h-2 rounded-full ${team.isPublic ? 'bg-green-500' : 'bg-neutral-700'}`}></div>
                 </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-0.5 truncate">{team.name}</h3>
                <p className="text-[10px] text-neutral-500 line-clamp-1">{team.isPublic ? 'Public Workspace' : 'Stealth Workspace'}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                 <div className="flex -space-x-1.5">
                    {team.members?.slice(0, 3).map((m: any, idx: number) => (
                      <div key={idx} className="w-6 h-6 rounded-full border-2 border-[#090909] bg-neutral-800 flex items-center justify-center text-[7px] font-bold text-white uppercase">{m.userId?.name?.[0]}</div>
                    ))}
                 </div>
                 <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">{team.members?.length || 1} Active</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ── CHAT MODAL ── */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setSelectedTeam(null)}>
              <motion.div initial={{ scale: 0.98, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 8 }} className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-xl overflow-hidden flex flex-col h-[580px] shadow-2xl" onClick={e => e.stopPropagation()}>
                 
                 <header className="p-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex-1">
                          {isRenaming ? (
                            <div className="flex items-center gap-2">
                               <input autoFocus className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-base font-bold text-white outline-none focus:border-white/20" value={newTeamName} onChange={e => setNewTeamName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRenameTeam()} />
                               <button onClick={handleRenameTeam} className="text-green-500"><HugeiconsIcon icon={Tick01Icon} size={18} /></button>
                               <button onClick={() => setIsRenaming(false)} className="text-red-500"><HugeiconsIcon icon={Cancel01Icon} size={18} /></button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group/title">
                               <h2 className="text-lg font-bold text-white tracking-tight">{selectedTeam.name}</h2>
                               { (selectedTeam.ownerId?._id === user?._id || selectedTeam.ownerId === user?._id) && (
                                 <button onClick={() => { setIsRenaming(true); setNewTeamName(selectedTeam.name); }} className="p-1 hover:bg-white/5 rounded-md transition-all">
                                    <HugeiconsIcon icon={PencilEdit01Icon} size={12} className="text-neutral-500" />
                                 </button>
                               )}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Status: Online</span>
                          </div>
                       </div>
                       <button onClick={() => setSelectedTeam(null)} className="p-2 text-neutral-500 hover:text-white"><HugeiconsIcon icon={RocketIcon} size={16} /></button>
                    </div>

                    <div className="flex items-center gap-3">
                       <div className="flex -space-x-2">
                          {selectedTeam.members?.map((m: any, idx: number) => (
                            <div key={idx} className="relative group/member">
                               <div className="w-7 h-7 rounded-full border-2 border-[#0a0a0a] bg-neutral-800 flex items-center justify-center text-[8px] font-bold text-white uppercase relative overflow-hidden">
                                  {m.userId?.name?.[0]}
                                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
                               </div>
                               <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-black border border-white/10 rounded text-[8px] font-bold text-white opacity-0 group-hover/member:opacity-100 pointer-events-none transition-all z-10 whitespace-nowrap">
                                  {m.userId?.name} (Online)
                               </div>
                            </div>
                          ))}
                       </div>
                       <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
                       <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">{selectedTeam.members?.length || 1} connected</span>
                    </div>
                 </header>

                 <div className="flex-1 overflow-y-auto p-6 space-y-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
                    {messages.map((msg, i) => {
                      const isMe = msg.senderId?._id === user?._id;
                      return (
                        <div key={i} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                           <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[9px] font-bold ${isMe ? 'bg-white text-black' : 'bg-white/5 text-neutral-400 border border-white/5'}`}>{msg.senderId?.name?.[0]}</div>
                           <div className={`max-w-[75%] space-y-0.5 ${isMe ? 'text-right' : ''}`}>
                              <p className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest px-1">{msg.senderId?.name}</p>
                              <div className={`p-3 rounded-lg text-xs leading-relaxed ${isMe ? 'bg-white text-black font-medium shadow-md shadow-white/5' : 'bg-[#111] text-neutral-300 border border-white/5'}`}>{msg.content}</div>
                              <span className="text-[7px] text-neutral-800 font-bold uppercase tracking-widest px-1">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                 </div>

                 <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                    <div className="relative flex items-center">
                       <input type="text" placeholder="Type a message..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-lg text-xs text-white outline-none focus:border-white/20 transition-all" />
                       <button onClick={handleSendMessage} className="absolute right-1.5 p-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-all shadow-md"><HugeiconsIcon icon={SentIcon} size={14} /></button>
                    </div>
                 </div>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
