"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2, Clock, XCircle, Code2, ArrowRight, Filter,
  GitBranch, Terminal, Trophy, TrendingUp, Loader2
} from "lucide-react";

const difficultyColor: Record<string, string> = {
  Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Hard: "text-red-400 bg-red-400/10 border-red-400/20",
};

const statusIcon = (status: string) => {
  if (status === "Accepted") return <CheckCircle2 size={14} className="text-emerald-400" />;
  if (status === "Wrong Answer") return <XCircle size={14} className="text-red-400" />;
  return <Clock size={14} className="text-amber-400" />;
};

export default function SubmissionsHistoryPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await fetch("/api/submissions");
        const data = await res.json();
        if (res.ok) setSubmissions(data.submissions);
      } catch (err) {
        console.error("Failed to fetch submissions");
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, []);

  const acceptedCount = submissions.filter((s) => s.status === "Accepted").length;
  const filteredSubmissions = submissions.filter(s => filter === "All" || s.status === filter);

  const stats = [
    { label: "Submissions", val: loading ? "..." : submissions.length.toString(), icon: Terminal },
    { label: "Successful", val: loading ? "..." : acceptedCount.toString(), icon: CheckCircle2 },
    { label: "Precision", val: loading ? "..." : (submissions.length > 0 ? `${Math.round((acceptedCount / submissions.length) * 100)}%` : "0%"), icon: TrendingUp },
    { label: "Signal Level", icon: Trophy, val: "#404" },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard/practice" className="text-neutral-600 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-black italic">
              ← PRACTICE_ARENA
            </Link>
          </div>
          <h1 className="font-headline font-black text-4xl text-white tracking-tight italic uppercase">Submission History</h1>
          <p className="text-neutral-500 text-sm mt-2">Historical data of all synchronization attempts with the platform core.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, val, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#0e0e0e] border border-white/[0.06] rounded-2xl p-5 group hover:border-white/10 transition-all"
            >
              <Icon size={14} className="text-primary mb-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              <p className="font-headline font-black text-2xl text-white">{val}</p>
              <p className="text-neutral-700 text-[10px] uppercase tracking-widest font-black mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-2">
            {["All", "Accepted", "Wrong Answer"].map((f) => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  filter === f 
                    ? "bg-primary/10 border-primary/30 text-primary" 
                    : "bg-white/[0.02] border-white/[0.06] text-neutral-700 hover:text-white hover:border-white/20"
                }`}
              >
                {f === "Accepted" ? "SOLVED" : f === "Wrong Answer" ? "FAILED" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Table/List */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 size={32} className="animate-spin text-primary opacity-20" />
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/[0.05] rounded-[2.5rem] bg-[#0e0e0e]">
             <Terminal size={40} className="mx-auto mb-4 opacity-10" />
             <p className="text-neutral-700 font-black text-[10px] uppercase tracking-[0.2em]">No history found in this sector</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#0e0e0e] border border-white/[0.06] rounded-3xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="px-6 py-4 text-[10px] font-black text-neutral-700 uppercase tracking-widest">Problem_Node</th>
                    <th className="px-6 py-4 text-[10px] font-black text-neutral-700 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-neutral-700 uppercase tracking-widest">Compiler</th>
                    <th className="px-6 py-4 text-[10px] font-black text-neutral-700 uppercase tracking-widest text-right">Performance</th>
                    <th className="px-6 py-4 text-[10px] font-black text-neutral-700 uppercase tracking-widest text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {filteredSubmissions.map((sub, i) => (
                    <tr key={sub._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-5">
                        <Link href={`/dashboard/practice/${sub.problemId?._id}`} className="flex flex-col">
                          <span className="text-white font-bold text-sm group-hover:text-primary transition-colors">
                            {sub.problemId?.title || "Unknown Terminal"}
                          </span>
                          <span className={`text-[9px] font-black mt-1 uppercase tracking-widest ${sub.problemId?.difficulty === 'Easy' ? 'text-emerald-500' : sub.problemId?.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'}`}>
                            {sub.problemId?.difficulty || "????"}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          {statusIcon(sub.status)}
                          <span className={`text-[10px] font-black uppercase tracking-wider ${sub.status === "Accepted" ? "text-emerald-400" : "text-red-400"}`}>
                            {sub.status === "Accepted" ? "SYNCHRONIZED" : "REFUSED"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-neutral-600 text-xs font-mono lowercase tracking-tighter">{sub.language}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-neutral-500 text-[10px] font-mono">{sub.runtime}</span>
                          <span className="text-neutral-700 text-[9px] font-mono">{sub.memory}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right text-neutral-700 text-[10px] font-bold uppercase tracking-widest">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

