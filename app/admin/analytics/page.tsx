"use client";

import { useState, useEffect } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  Zap, 
  Clock, 
  TrendingUp,
  Loader2
} from "lucide-react";

const COLORS = ["#000000", "#737373", "#e5e5e5", "#a3a3a3"];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-neutral-300" /></div>;

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Analytics</h1>
        <p className="text-neutral-500 text-sm mt-1">Technical performance and platform health metrics.</p>
      </div>

      {/* Health Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "System Uptime", value: data.systemHealth.uptime, icon: Globe, color: "text-emerald-500" },
           { label: "Avg Latency", value: data.systemHealth.avgLatency, icon: Zap, color: "text-amber-500" },
           { label: "Error Rate", value: data.systemHealth.errorRate, icon: Activity, color: "text-red-500" },
           { label: "Database", value: data.systemHealth.dbStatus, icon: Database, color: "text-blue-500" },
         ].map((tile, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
               <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-lg bg-neutral-50 ${tile.color}`}>
                     <tile.icon size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                     <TrendingUp size={10} /> Live
                  </span>
               </div>
               <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-4">{tile.label}</p>
               <h3 className="text-xl font-bold mt-1 uppercase tracking-tight">{tile.value}</h3>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Live Traffic */}
         <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h3 className="font-bold">Active User Velocity</h3>
               <button className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">Real-time Sync</button>
            </div>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.performanceData}>
                     <defs>
                        <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#000" stopOpacity={0.05}/>
                           <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#aaa'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#aaa'}} />
                     <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} />
                     <Area type="monotone" dataKey="active" stroke="#000" strokeWidth={2} fillOpacity={1} fill="url(#activeGrad)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Distribution */}
         <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
            <h3 className="font-bold mb-8">Asset Distribution</h3>
            <div className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={data.distribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {data.distribution.map((entry: any, index: number) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
               {data.distribution.map((d: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}} />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{d.name}: {d.value}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
