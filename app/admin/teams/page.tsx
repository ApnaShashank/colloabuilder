"use client";

import { useState, useEffect } from "react";
import { 
  Users2, 
  Search, 
  Trash2, 
  UserPlus, 
  UserMinus,
  Loader2,
  Calendar,
  Lock,
  Unlock,
  Users
} from "lucide-react";

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch("/api/admin/teams");
        const data = await res.json();
        if (res.ok) {
          setTeams(data);
        }
      } catch (err) {
        console.error("Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    }
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.leader.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
        <p className="text-neutral-500 text-sm mt-1">Manage global teams, change ownership, and moderate membership.</p>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search teams by name or leader..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
          />
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              <th className="px-6 py-4">Team Cluster</th>
              <th className="px-6 py-4">Lead Developer</th>
              <th className="px-6 py-4">Population</th>
              <th className="px-6 py-4">Security Level</th>
              <th className="px-6 py-4 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                   <Loader2 size={24} className="animate-spin text-neutral-300 mx-auto" />
                </td>
              </tr>
            ) : filteredTeams.map((team) => (
              <tr key={team._id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
                         {team.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-neutral-900">{team.name}</p>
                         <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{team.type}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center">
                         <Users size={10} className="text-neutral-500" />
                      </div>
                      <span className="text-xs font-medium text-neutral-700">{team.leader}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className="text-xs font-bold text-neutral-900">{team.members} Members</span>
                </td>
                <td className="px-6 py-5">
                   {team.privacy === "Locked" ? (
                     <div className="flex items-center gap-2 text-amber-500">
                        <Lock size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Restricted</span>
                     </div>
                   ) : (
                     <div className="flex items-center gap-2 text-emerald-500">
                        <Unlock size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Open</span>
                     </div>
                   )}
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-black transition-colors" title="Manage Members">
                         <UserPlus size={16} />
                      </button>
                      <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-red-600 transition-colors" title="Disband Team">
                         <Trash2 size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
