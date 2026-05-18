import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserGroupIcon, 
  SettingsIcon, 
  Link01Icon, 
  Message01Icon, 
  Shield01Icon, 
  RocketIcon, 
  PlusSignIcon, 
  Search01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  Loading01Icon,
  Cancel01Icon,
  Tick02Icon,
  ZapIcon,
  GlobalIcon,
  LockIcon,
  Briefcase02Icon,
  UserIcon,
  SentIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SkeletonComponent from "../../components/ui/Skeleton";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    category: "Full-Stack",
    isPublic: true
  });
  const [currentUser, setCurrentUser] = useState(null);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/teams", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setTeams(data.teams || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/profile", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      if (data.success) setCurrentUser(data.user);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTeams();
  }, []);

  useEffect(() => {
    let interval;
    if (selectedTeam) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`/api/teams/${selectedTeam.id || selectedTeam._id || ""}/messages`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setMessages(data.messages || []);
          }
        } catch (e) {
          console.error("Polling failed", e);
        }
      };

      fetchMessages();
      interval = setInterval(fetchMessages, 3000);
    } else {
      setMessages([]);
    }
    return () => clearInterval(interval);
  }, [selectedTeam]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedTeam) return;
    const content = chatInput.trim();
    setChatInput("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/teams/${selectedTeam.id || selectedTeam._id || ""}/messages`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
      }
    } catch (e) {
      console.error("Failed to send message", e);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeam.name) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newTeam)
      });
      const data = await res.json();
      if (data.success) {
        setTeams([data.team, ...teams]);
        setShowCreateModal(false);
        setNewTeam({ name: "", description: "", category: "Full-Stack", isPublic: true });
        fetchTeams(); 
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/teams/${teamId}/join`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: "join" })
      });
      const data = await res.json();
      if (data.success) {
        setTeams(teams.map(t => t.id === teamId || t._id === teamId ? data.team : t));
        if (selectedTeam?.id === teamId || selectedTeam?._id === teamId) setSelectedTeam(data.team);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLeaveTeam = async (teamId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/teams/${teamId}/join`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: "leave" })
      });
      const data = await res.json();
      if (data.success) {
        setTeams(teams.map(t => t.id === teamId || t._id === teamId ? data.team : t));
        if (selectedTeam?.id === teamId || selectedTeam?._id === teamId) setSelectedTeam(data.team);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!confirm("Are you sure you want to disband this squad? This action is irreversible.")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/teams/${teamId}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTeams(teams.filter(t => t.id !== teamId && t._id !== teamId));
        if (selectedTeam?.id === teamId || selectedTeam?._id === teamId) setSelectedTeam(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1500px] mx-auto pb-24 px-4 sm:px-6 space-y-12">
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">Team Hub</span>
              <span className="text-neutral-600 text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
                <HugeiconsIcon icon={GlobalIcon} size={14} /> Global Registry
              </span>
           </div>
           <h1 className="text-5xl lg:text-6xl font-black text-white leading-none font-headline tracking-tight italic uppercase">Tactical <span className="text-primary opacity-40">Squads</span></h1>
           <p className="text-neutral-500 text-sm max-w-xl font-medium">Create or join high-performance squads to collaborate on production-grade projects and earn platform XP.</p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-80">
              <HugeiconsIcon icon={Search01Icon} size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600" />
              <input 
                type="text" 
                placeholder="Find squads by name or stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-white/5 py-4 pl-14 pr-6 rounded-2xl text-white outline-none focus:border-primary/50 transition-all font-medium text-sm italic"
              />
           </div>
           <button 
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-4 bg-primary text-black rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 whitespace-nowrap italic"
           >
              <HugeiconsIcon icon={PlusSignIcon} size={18} /> Assemble Team
           </button>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: "Active Squads", val: teams.length, icon: UserGroupIcon, color: "text-blue-500" },
           { label: "Contributors", val: teams.reduce((acc, t) => acc + (t.members?.length || 0), 0), icon: UserIcon, color: "text-emerald-500" },
           { label: "Live Projects", val: teams.reduce((acc, t) => acc + (t.projects || 0), 0), icon: RocketIcon, color: "text-amber-500" },
           { label: "Total Platform XP", val: teams.reduce((acc, t) => acc + (t.xp || 0), 0).toLocaleString(), icon: ZapIcon, color: "text-purple-500" }
         ].map((stat, i) => (
           <div key={i} className="bg-[#111] border border-white/[0.05] p-6 rounded-[2rem] flex items-center gap-5">
              <div className={`w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center ${stat.color}`}>
                 <HugeiconsIcon icon={stat.icon} size={20} />
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-1">{stat.label}</p>
                 <p className="text-xl font-black text-white">{stat.val}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTeams.map((team, i) => (
          <motion.div 
            key={team.id || team._id}
            layoutId={team.id || team._id}
            onClick={() => setSelectedTeam(team)}
            className="group relative bg-[#0e0e0e] border border-white/[0.06] p-10 rounded-[3rem] hover:border-primary/30 transition-all cursor-pointer overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <HugeiconsIcon icon={RocketIcon} size={140} />
             </div>

             <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/5 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-2xl">
                      <HugeiconsIcon icon={UserGroupIcon} size={24} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-white font-headline italic uppercase">{team.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[9px] font-black uppercase text-neutral-600 tracking-widest">{team.category}</span>
                         <span className="w-1 h-1 rounded-full bg-neutral-800"></span>
                         <span className="text-[9px] font-black uppercase text-primary tracking-widest">Level {team.level}</span>
                      </div>
                   </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${team.isPublic ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-neutral-800'}`}></div>
             </div>

             <p className="text-neutral-500 text-sm leading-relaxed mb-10 line-clamp-2 h-10 font-medium relative z-10">
                {team.description}
             </p>

             <div className="flex items-center justify-between py-6 border-y border-white/[0.04] mb-10 relative z-10">
                <div className="flex -space-x-3">
                    {team.members.slice(0, 4).map((m, idx) => (
                      <div key={idx} className="w-10 h-10 rounded-full border-4 border-[#0e0e0e] bg-white/5 flex items-center justify-center text-[10px] font-black text-neutral-400 overflow-hidden">
                         {m.userId?.avatar ? <img src={m.userId.avatar} alt="avatar" className="w-full h-full object-cover" /> : (m.userId?.name?.[0] || m.name?.[0] || "?")}
                      </div>
                    ))}
                   {team.members.length > 4 && (
                     <div className="w-10 h-10 rounded-full border-4 border-[#0e0e0e] bg-primary flex items-center justify-center text-[10px] font-black text-black">
                        +{team.members.length - 4}
                     </div>
                   )}
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-neutral-700 uppercase tracking-widest mb-1">Squad XP</p>
                   <p className="text-sm font-black text-white uppercase tracking-widest">{(team.xp || 0).toLocaleString()}</p>
                </div>
             </div>

             <div className="flex gap-4 relative z-10">
                {currentUser && team.members.find(m => m.userId?._id === currentUser.id || m.userId?.id === currentUser.id) ? (
                  <button className="flex-1 py-4 bg-primary text-black rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 italic">
                     <HugeiconsIcon icon={Message01Icon} size={16} /> Comms
                  </button>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleJoinTeam(team.id || team._id || ""); }}
                    className="flex-1 py-4 bg-white/5 hover:bg-white text-neutral-400 hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2 italic"
                  >
                     <HugeiconsIcon icon={Link01Icon} size={16} /> Join Squad
                  </button>
                )}
                <button className="w-14 h-14 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center text-neutral-600 hover:text-white hover:border-white/20 transition-all">
                   <HugeiconsIcon icon={SettingsIcon} size={18} />
                </button>
             </div>
          </motion.div>
        ))}

        <motion.div 
          onClick={() => setShowCreateModal(true)}
          className="border-2 border-dashed border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center group hover:border-primary/40 hover:bg-primary/[0.02] transition-all cursor-pointer text-center"
        >
           <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary transition-all">
              <HugeiconsIcon icon={PlusSignIcon} size={32} className="text-neutral-700 group-hover:text-white" />
           </div>
           <h3 className="text-xl font-black text-neutral-700 group-hover:text-white transition-colors mb-2 italic uppercase">Assemble New Squad</h3>
           <p className="text-xs text-neutral-800 group-hover:text-neutral-500 uppercase font-black tracking-widest">Start your own legacy</p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/80"
          >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
               className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-[3rem] p-12 space-y-10 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                   <HugeiconsIcon icon={UserGroupIcon} size={180} />
                </div>

                <div className="flex justify-between items-start relative z-10">
                   <div className="space-y-4">
                      <h2 className="text-4xl font-black text-white font-headline italic uppercase">Squad Genesis</h2>
                      <p className="text-neutral-500 font-medium">Define your mission and recruit your tactical team.</p>
                   </div>
                   <button onClick={() => setShowCreateModal(false)} className="p-4 bg-white/5 rounded-2xl text-neutral-500 hover:text-white transition-all">
                      <HugeiconsIcon icon={Cancel01Icon} size={24} />
                   </button>
                </div>

                <div className="space-y-6 relative z-10">
                   <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">Squad Designation (Name)</p>
                      <input 
                        type="text" 
                        placeholder="e.g. Cyber Guardians"
                        value={newTeam.name}
                        onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-primary/50 transition-all font-medium italic"
                      />
                   </div>
                   <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">Mission Protocol (Description)</p>
                      <textarea 
                        rows={3}
                        placeholder="What will this squad build or achieve?"
                        value={newTeam.description}
                        onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-primary/50 transition-all font-medium resize-none italic"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                         <p className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">Tech Stack</p>
                         <select 
                           value={newTeam.category}
                           onChange={(e) => setNewTeam({...newTeam, category: e.target.value})}
                           className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-primary/50 transition-all font-medium appearance-none italic"
                         >
                            <option value="Full-Stack">Full-Stack</option>
                            <option value="Backend">Backend</option>
                            <option value="Frontend">Frontend</option>
                            <option value="AI/ML">AI/ML</option>
                            <option value="Web3">Web3</option>
                         </select>
                      </div>
                      <div className="space-y-3">
                         <p className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">Access Mode</p>
                         <div className="flex bg-white/5 p-2 rounded-2xl border border-white/10">
                            <button onClick={() => setNewTeam({...newTeam, isPublic: true})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${newTeam.isPublic ? 'bg-primary text-black' : 'text-neutral-500'}`}>
                               <HugeiconsIcon icon={GlobalIcon} size={14} /> Public
                            </button>
                            <button onClick={() => setNewTeam({...newTeam, isPublic: false})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${!newTeam.isPublic ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}>
                               <HugeiconsIcon icon={LockIcon} size={14} /> Private
                            </button>
                         </div>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={handleCreateTeam}
                  className="w-full py-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all italic"
                >
                   Finalize Squad Assembly
                </button>
             </motion.div>
          </motion.div>
        )}

        {selectedTeam && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center p-0 sm:p-6 backdrop-blur-2xl bg-black/90"
            onClick={() => setSelectedTeam(null)}
          >
             <motion.div 
               initial={{ y: 500 }} animate={{ y: 0 }} exit={{ y: 500 }}
               onClick={(e) => e.stopPropagation()}
               className="bg-[#0c0c0c] border-t sm:border border-white/10 w-full max-w-4xl rounded-t-[3rem] sm:rounded-[4rem] p-10 lg:p-16 space-y-12 relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                   <div className="space-y-6 flex-1">
                      <div className="flex items-center gap-4">
                         <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20">
                            <HugeiconsIcon icon={UserGroupIcon} size={40} />
                         </div>
                         <div>
                            <h2 className="text-4xl lg:text-5xl font-black text-white font-headline italic uppercase">{selectedTeam.name}</h2>
                            <div className="flex items-center gap-4 mt-2">
                               <span className="text-xs font-black uppercase text-neutral-500 tracking-widest">{selectedTeam.category} Squad</span>
                               <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,255,255,0.5)]"></span>
                               <span className="text-xs font-black uppercase text-white tracking-widest">Level {selectedTeam.level}</span>
                            </div>
                         </div>
                      </div>
                      <p className="text-neutral-400 text-lg leading-relaxed font-medium">{selectedTeam.description}</p>
                   </div>

                   <div className="flex gap-4">
                      {currentUser && (selectedTeam.ownerId === currentUser.id || selectedTeam.ownerId?._id === currentUser.id) && (
                        <button 
                          onClick={() => handleDeleteTeam(selectedTeam.id || selectedTeam._id || "")}
                          className="px-10 py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 italic"
                        >
                           Disband Squad
                        </button>
                      )}
                      {currentUser && selectedTeam.members.find(m => m.userId?._id === currentUser.id || m.userId?.id === currentUser.id) ? (
                        <button 
                          onClick={() => handleLeaveTeam(selectedTeam.id || selectedTeam._id || "")}
                          className="px-10 py-5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all italic"
                        >
                           Resign from Squad
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleJoinTeam(selectedTeam.id || selectedTeam._id || "")}
                          className="px-10 py-5 bg-primary text-black rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all italic"
                        >
                           Apply to Join
                        </button>
                      )}
                      <button onClick={() => setSelectedTeam(null)} className="p-5 bg-white/5 rounded-2xl text-neutral-500 hover:text-white transition-all">
                         <HugeiconsIcon icon={Cancel01Icon} size={24} />
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-white/[0.04] pt-12">
                   <div className="lg:col-span-8 space-y-10">
                      <div className="space-y-6">
                         <h3 className="text-xl font-black text-white flex items-center gap-3 italic uppercase">
                            <HugeiconsIcon icon={UserIcon} size={20} className="text-primary" />
                            Squad Roster ({selectedTeam.members.length})
                         </h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedTeam.members.map((member) => (
                              <div key={member.id || member.userId?._id} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center gap-5 hover:bg-white/5 transition-all">
                                 <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-sm font-black text-neutral-500 overflow-hidden">
                                    {member.userId?.avatar ? <img src={member.userId.avatar} alt="avatar" className="w-full h-full object-cover" /> : (member.userId?.name?.[0] || member.name?.[0] || "?")}
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-white">{member.userId?.name || member.name} {(member.userId?._id === currentUser?.id || member.id === "me") && "(You)"}</p>
                                    <p className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">{member.role}</p>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h3 className="text-xl font-black text-white flex items-center gap-3 italic uppercase">
                            <HugeiconsIcon icon={RocketIcon} size={20} className="text-primary" />
                            Active Missions
                         </h3>
                         <div className="p-10 border-2 border-dashed border-white/5 rounded-[3rem] text-center space-y-4 opacity-30">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 italic">No missions currently deployed</p>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <h3 className="text-xl font-black text-white flex items-center gap-3 italic uppercase">
                            <HugeiconsIcon icon={Message01Icon} size={20} className="text-primary" />
                            Squad Comms (Live)
                         </h3>
                         
                         <div className="bg-[#111] border border-white/5 rounded-[2.5rem] flex flex-col h-[500px] overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                               {messages.length > 0 ? messages.map((msg, idx) => {
                                 const isOwn = msg.senderId?._id === currentUser?.id || msg.senderId?.id === currentUser?.id || msg.senderId === currentUser?.id;
                                 return (
                                   <div key={msg._id || idx} className={`flex gap-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex-shrink-0 overflow-hidden border border-white/10">
                                       {msg.senderId?.avatar ? <img src={msg.senderId.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-neutral-500">{msg.senderId?.name?.[0] || "?"}</div>}
                                    </div>
                                    <div className={`max-w-[80%] space-y-1 ${isOwn ? 'items-end' : ''}`}>
                                       <div className={`p-4 rounded-2xl text-xs font-medium leading-relaxed ${isOwn ? 'bg-primary text-black rounded-tr-none' : 'bg-white/5 text-neutral-300 rounded-tl-none border border-white/5'}`}>
                                          {msg.content}
                                       </div>
                                       <p className={`text-[8px] font-black uppercase text-neutral-700 tracking-widest px-1 ${isOwn ? 'text-right' : ''}`}>
                                          {msg.senderId?.name || "Member"} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                       </p>
                                    </div>
                                 </div>
                               );
                             }) : (
                                 <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-4">
                                    <HugeiconsIcon icon={Message01Icon} size={48} />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Secure line established.<br/>Waiting for comms...</p>
                                 </div>
                               )}
                               <div ref={chatEndRef} />
                            </div>

                            <div className="p-6 bg-white/[0.02] border-t border-white/5 flex gap-4">
                               <input 
                                 type="text" 
                                 placeholder="Broadcast to squad..."
                                 value={chatInput}
                                 onChange={(e) => setChatInput(e.target.value)}
                                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                 className="flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white text-xs outline-none focus:border-primary/50 transition-all font-medium italic"
                               />
                               <button 
                                 onClick={handleSendMessage}
                                 className="w-12 h-12 bg-primary text-black rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                               >
                                  <HugeiconsIcon icon={SentIcon} size={18} />
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="lg:col-span-4 space-y-8">
                      <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                         <h3 className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Squad Metrics</h3>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center py-4 border-b border-white/[0.03]">
                               <span className="text-xs font-medium text-neutral-400">Total XP</span>
                               <span className="text-xs font-black text-white">{(selectedTeam.xp || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-4 border-b border-white/[0.03]">
                               <span className="text-xs font-medium text-neutral-400">Projects</span>
                               <span className="text-xs font-black text-white">{selectedTeam.projects}</span>
                            </div>
                            <div className="flex justify-between items-center py-4">
                               <span className="text-xs font-medium text-neutral-400">Founding Date</span>
                               <span className="text-xs font-black text-white">May 2024</span>
                            </div>
                         </div>
                      </div>

                      <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 flex flex-col items-center text-center space-y-4">
                         <HugeiconsIcon icon={ZapIcon} size={32} className="text-primary animate-pulse" />
                         <p className="text-xs font-black text-white uppercase tracking-widest">Tactical Advantage</p>
                         <p className="text-[11px] text-neutral-500 font-medium">This squad earns a 1.2x multiplier on all collaborated projects.</p>
                      </div>
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
