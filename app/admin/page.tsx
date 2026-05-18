"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Terminal, 
  FolderOpen, 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Activity,
  ArrowUpRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  Users2,
  Loader2
} from "lucide-react";
import dynamic from "next/dynamic";
import Skeleton from "@/components/ui/Skeleton";

// Dynamically import Recharts to reduce initial bundle and improve navigation speed
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });


export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        if (res.ok) {
          setMetrics(json);
        }
      } catch (err) {
        console.error("Failed to fetch admin metrics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <div>
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-64 h-4 mt-2" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm space-y-4">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="w-20 h-3" />
                <Skeleton className="w-24 h-8" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <div className="space-y-2">
                 <Skeleton className="w-32 h-6" />
                 <Skeleton className="w-48 h-3" />
               </div>
               <Skeleton className="w-24 h-8 rounded-lg" />
            </div>
            <Skeleton className="w-full h-[300px] rounded-xl" />
          </div>

          <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-xl p-8 shadow-sm space-y-6">
            <Skeleton className="w-32 h-6" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-20 h-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: metrics?.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Today", value: metrics?.activeToday, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Projects",     value: metrics?.totalProjects, icon: FolderOpen, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Teams",        value: metrics?.totalTeams, icon: Users2, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Overview</h1>
        <p className="text-neutral-500 text-sm mt-1">Real-time platform performance and growth analytics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-neutral-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1 text-neutral-900">{stat.value?.toLocaleString()}</h3>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold">Growth Analytics</h3>
              <p className="text-xs text-neutral-400 mt-1">Weekly user acquisition and activity syncs.</p>
            </div>
            <select className="text-xs border border-neutral-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black">
               <option>Last 7 Days</option>
               <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full mt-4 flex items-center justify-center">
            {metrics?.chartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.chartData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#888' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#888' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #e5e5e5', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center gap-2 text-neutral-400">
                <Loader2 size={24} className="animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Compiling Analytics...</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-xl p-8 shadow-sm">
          <h3 className="font-bold mb-6 flex items-center gap-2">
             <Activity size={18} className="text-neutral-400" />
             Recent Activity
          </h3>
          <div className="space-y-6">
            {metrics?.recentActivity?.map((activity: any, i: number) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 font-bold text-[10px] flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  {activity.user.charAt(0).toUpperCase()}
                </div>
                <div>
                   <p className="text-sm font-medium">
                      <span className="font-bold text-black">{activity.user}</span> {activity.action}
                   </p>
                   <div className="flex items-center gap-1.5 mt-1 text-neutral-400">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{activity.time}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 border border-neutral-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors">
            View Audit Logs
          </button>
        </div>
      </div>

      {/* Alerts & Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
         <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex gap-4">
            <div className="p-2 bg-red-100 text-red-600 h-fit rounded-lg">
               <AlertCircle size={20} />
            </div>
            <div>
               <h4 className="font-bold text-red-900 text-sm">Action Required: Reported Content</h4>
               <p className="text-xs text-red-700 mt-1">3 comments have been flagged by the community for manual review.</p>
               <button className="mt-4 text-xs font-bold text-red-900 uppercase tracking-widest flex items-center gap-1">
                  View Reports <ArrowUpRight size={14} />
               </button>
            </div>
         </div>

         <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex gap-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 h-fit rounded-lg">
               <CheckCircle2 size={20} />
            </div>
            <div>
               <h4 className="font-bold text-emerald-900 text-sm">System Health: Optimal</h4>
               <p className="text-xs text-emerald-700 mt-1">All services including database, auth and practice arena are operational.</p>
               <button className="mt-4 text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-1">
                  Check Node Status <ArrowUpRight size={14} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
