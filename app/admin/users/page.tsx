"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  MoreVertical, 
  Trash2, 
  ShieldCheck, 
  ShieldX, 
  UserPlus, 
  Mail,
  Calendar,
  Filter,
  Loader2,
  CheckCircle,
  XCircle,
  Zap,
  Award
} from "lucide-react";
import { format } from "date-fns";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, updates: { isAdmin: !currentStatus } }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {}
  };

  const handleTogglePlan = async (userId: string, currentPlan: string) => {
    try {
      const targetPlan = currentPlan === "pro" ? "free" : "pro";
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, updates: { plan: targetPlan } }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {}
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
    } catch (err) {}
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "Admins") return matchesSearch && user.isAdmin;
    if (filter === "Users") return matchesSearch && !user.isAdmin;
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-neutral-500 text-sm mt-1">Directory of all platform members and access control.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-800 transition-colors">
              <UserPlus size={14} />
              Add User
           </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search by name, email or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-neutral-50 border border-neutral-200 rounded-lg p-1">
              {["All", "Admins", "Users"].map(t => (
                <button 
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-widest transition-all ${filter === t ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'}`}
                >
                   {t}
                </button>
              ))}
           </div>
           <button className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-500">
              <Filter size={18} />
           </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                <th className="px-6 py-4">User Identity</th>
                <th className="px-6 py-4">Role / Level</th>
                <th className="px-6 py-4">Subscription Plan</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="w-24 h-4" />
                          <Skeleton className="w-32 h-3" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><Skeleton className="w-20 h-5" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-24 h-4" /></td>
                    <td className="px-6 py-4"><Skeleton className="w-16 h-5" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="w-20 h-8 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-20 text-center text-neutral-400 font-medium italic">
                      No matching records located.
                   </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-neutral-500 text-sm overflow-hidden flex-shrink-0">
                             {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name?.charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-neutral-900">{user.name}</p>
                             <p className="text-xs text-neutral-400 mt-0.5">{user.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex flex-col gap-1">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full w-fit border ${user.isAdmin ? 'bg-black text-white border-black' : 'bg-neutral-100 text-neutral-500 border-neutral-200'}`}>
                             {user.isAdmin ? 'Admin' : 'Member'}
                          </span>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-0.5">Lvl {user.level || 1} • {user.xp || 0} XP</span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                             user.plan === 'pro' 
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.06)]' 
                                : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                          }`}>
                             {user.plan === 'pro' ? '★ PRO' : 'FREE'}
                          </span>
                       </div>
                       <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mt-1.5">
                          Searches: {user.aiJobSearchCount || 0} • Practice: {user.practiceCount || 0}
                       </p>
                    </td>
                    <td className="px-6 py-5">
                       <p className="text-xs text-neutral-600 font-medium">
                          {user.createdAt ? format(new Date(user.createdAt), "MMM dd, yyyy") : "N/A"}
                       </p>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-emerald-500" />
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest italic">Active</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleTogglePlan(user._id, user.plan)}
                            title={user.plan === "pro" ? "Revoke Pro Status" : "Grant Pro Status"}
                            className={`p-2 rounded-lg transition-colors ${user.plan === "pro" ? 'text-amber-500 hover:bg-amber-50 hover:text-amber-600' : 'text-neutral-400 hover:bg-neutral-100 hover:text-black'}`}
                          >
                             <Zap size={16} />
                          </button>
                          <button 
                            onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                            title={user.isAdmin ? "Revoke Admin" : "Grant Admin"}
                            className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-black transition-colors"
                          >
                             {user.isAdmin ? <ShieldX size={16} /> : <ShieldCheck size={16} />}
                          </button>
                          <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-black transition-colors">
                             <Mail size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-red-600 transition-colors"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center">
            <p className="text-xs text-neutral-500">Showing <span className="font-bold text-black">{filteredUsers.length}</span> of <span className="font-bold text-black">{users.length}</span> entries</p>
            <div className="flex gap-2">
               <button className="px-3 py-1 border border-neutral-300 rounded-md text-xs font-bold bg-white disabled:opacity-50" disabled>Prev</button>
               <button className="px-3 py-1 border border-neutral-300 rounded-md text-xs font-bold bg-white disabled:opacity-50" disabled>Next</button>
            </div>
        </div>
      </div>
    </div>
  );
}
