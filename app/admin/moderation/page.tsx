"use client";

import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Flag,
  MoreVertical,
  Search,
  Filter,
  Eye,
  Trash2,
  Ban,
  Loader2
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

export default function ModerationPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Pending");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/moderation");
      const data = await res.json();
      if (data.reports) setReports(data.reports);
    } catch (err) {
      console.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/moderation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, updates: { status } }),
      });
      if (res.ok) fetchReports();
    } catch (err) {}
  };

  const filteredReports = reports.filter(r => filter === "All" || r.status === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Moderation</h1>
          <p className="text-neutral-500 text-sm mt-1">Review flagged content and maintain community standards.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100">
           <Flag size={14} className="animate-pulse" />
           <span className="text-xs font-bold uppercase tracking-widest">{reports.filter(r => r.status === "Pending").length} Pending</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Total Reports</p>
            <h3 className="text-3xl font-bold mt-2">{reports.length}</h3>
         </div>
         <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Resolved</p>
            <h3 className="text-3xl font-bold mt-2 text-emerald-600">{reports.filter(r => r.status === "Resolved").length}</h3>
         </div>
         <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Dismissed</p>
            <h3 className="text-3xl font-bold mt-2 text-neutral-400">{reports.filter(r => r.status === "Dismissed").length}</h3>
         </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
         <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search reports by user or reason..." 
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none"
            />
         </div>
         <div className="flex bg-neutral-50 border border-neutral-200 rounded-lg p-1">
            {["Pending", "Reviewed", "Resolved", "Dismissed", "All"].map(s => (
              <button 
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${filter === s ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'}`}
              >
                 {s}
              </button>
            ))}
         </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                <th className="px-6 py-4">Report Details</th>
                <th className="px-6 py-4">Target Type</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                 Array(5).fill(0).map((_, i) => (
                   <tr key={i} className="border-b border-neutral-50 pulse">
                      <td className="px-6 py-5">
                         <Skeleton className="w-48 h-5 mb-2" />
                         <Skeleton className="w-full h-3 mb-2" />
                         <Skeleton className="w-24 h-3" />
                      </td>
                      <td className="px-6 py-5"><Skeleton className="w-20 h-5" /></td>
                      <td className="px-6 py-5"><Skeleton className="w-16 h-5" /></td>
                      <td className="px-6 py-5"><Skeleton className="w-16 h-5 rounded-full" /></td>
                      <td className="px-6 py-5 text-right flex justify-end gap-2 pt-8">
                         <Skeleton className="w-8 h-8 rounded-lg" />
                         <Skeleton className="w-8 h-8 rounded-lg" />
                      </td>
                   </tr>
                 ))
              ) : filteredReports.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="py-20 text-center text-neutral-400 font-medium italic">
                       No moderation requests found in this category.
                    </td>
                 </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report._id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-6 py-5">
                       <p className="text-sm font-bold text-neutral-900">{report.reason}</p>
                       <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{report.details || "No additional details provided."}</p>
                       <p className="text-[10px] text-neutral-400 font-bold uppercase mt-2">By: {report.reporter?.username || "System"}</p>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-neutral-100 px-2 py-1 rounded border border-neutral-200">
                          {report.targetType}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-1.5">
                          <AlertTriangle size={14} className={
                             report.priority === 'Critical' ? 'text-red-500' : 
                             report.priority === 'High' ? 'text-orange-500' : 'text-amber-500'
                          } />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{report.priority}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                          report.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          report.status === 'Dismissed' ? 'bg-neutral-100 text-neutral-500 border-neutral-200' :
                          'bg-amber-50 text-amber-600 border-amber-100'
                       }`}>
                          {report.status}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex justify-end gap-2">
                          <button onClick={() => handleAction(report._id, 'Resolved')} className="p-2 hover:bg-emerald-50 text-neutral-400 hover:text-emerald-600 rounded-lg transition-colors border border-transparent hover:border-emerald-100">
                             <CheckCircle2 size={16} />
                          </button>
                          <button onClick={() => handleAction(report._id, 'Dismissed')} className="p-2 hover:bg-neutral-50 text-neutral-400 hover:text-neutral-900 rounded-lg transition-colors">
                             <XCircle size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
