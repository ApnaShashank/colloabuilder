"use client";

import { useState, useEffect } from "react";
import { 
  FolderOpen, 
  Search, 
  MoreVertical, 
  Trash2, 
  ExternalLink, 
  Eye, 
  ShieldAlert,
  Loader2,
  Calendar,
  User,
  Filter,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/admin/projects");
        const data = await res.json();
        if (res.ok) {
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Monitoring</h1>
          <p className="text-neutral-500 text-sm mt-1">Audit and moderate all user-contributed projects.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search by project name or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
          />
        </div>
        <button className="px-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
           <Filter size={14} />
           Filters
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
             <Loader2 size={32} className="animate-spin text-neutral-300 mx-auto" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full py-20 bg-white border border-dashed border-neutral-300 rounded-3xl text-center">
             <FolderOpen size={40} className="text-neutral-200 mx-auto mb-4" />
             <p className="text-neutral-400 font-medium">No storage volumes detected.</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project._id} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col">
               <div className="h-40 bg-neutral-100 flex items-center justify-center relative">
                  <FolderOpen size={48} className="text-neutral-300 group-hover:scale-110 transition-transform" />
                  <div className="absolute top-4 right-4">
                     <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${
                       project.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-neutral-50 text-neutral-400 border-neutral-200'
                     }`}>
                        {project.status}
                     </span>
                  </div>
               </div>
               <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 mb-6 flex-1">{project.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center">
                           <User size={12} className="text-neutral-400" />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-700 uppercase tracking-widest">{project.owner}</span>
                     </div>
                     <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-neutral-100 rounded-md text-neutral-400 hover:text-black transition-colors" title="View Detail">
                           <Eye size={16} />
                        </button>
                        <button className="p-1.5 hover:bg-neutral-100 rounded-md text-neutral-400 hover:text-red-600 transition-colors" title="Force Delete">
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
