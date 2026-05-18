"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChartLineData01Icon, 
  ArrowRight01Icon, 
  Alert01Icon, 
  ZapIcon, 
  ActivityIcon,
  BitcoinIcon, // Using as a proxy for cost/money
  Tick01Icon,
  RefreshIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface Metric {
  timestamp: string;
  cpu: number;
  memory: number;
  bandwidth: number;
  cost: number;
}

interface Suggestion {
  id: number;
  title: string;
  desc: string;
  impact: string;
}

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}/metrics`);
      const d = await res.json();
      if (d.success) setData(d);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12 font-['Plus_Jakarta_Sans'] relative overflow-hidden">
      {/* ── Background Decals ── */}
      <div className="absolute top-0 right-0 p-20 opacity-[0.02] select-none pointer-events-none">
         <h1 className="text-[20vw] font-black leading-none italic uppercase tracking-tighter">ANALYTICS</h1>
      </div>

      <header className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary">
                <HugeiconsIcon icon={ChartLineData01Icon} size={24} />
             </div>
             <span className="text-secondary text-[10px] font-black uppercase tracking-[0.4em]">Infrastructure Monitoring</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic">Cloud <span className="text-secondary">Pulse</span>_</h1>
          <p className="text-neutral-500 font-medium max-w-xl">Real-time infrastructure cost monitoring, anomaly detection, and AI-driven resource optimization.</p>
        </div>

        <div className="flex gap-4">
           <button onClick={fetchMetrics} className="p-5 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all">
              <HugeiconsIcon icon={RefreshIcon} size={20} />
           </button>
        </div>
      </header>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 space-y-4">
            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Est. Monthly Spend</p>
            <div className="flex items-end gap-2">
               <h3 className="text-4xl font-black text-white tracking-tighter">${data?.summary.totalCost}</h3>
               <span className="text-neutral-600 text-xs font-bold pb-1">{data?.summary.currency}</span>
            </div>
         </div>
         <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 space-y-4">
            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Efficiency Score</p>
            <div className="flex items-end gap-4">
               <h3 className={`text-4xl font-black tracking-tighter ${data?.summary.efficiencyScore > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{data?.summary.efficiencyScore}%</h3>
               <div className="pb-1">
                  <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-400" style={{ width: `${data?.summary.efficiencyScore}%` }} />
                  </div>
               </div>
            </div>
         </div>
         <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 space-y-4">
            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Active Anomalies</p>
            <div className="flex items-center gap-3">
               <h3 className={`text-4xl font-black tracking-tighter ${data?.summary.hasSpike ? 'text-red-500' : 'text-emerald-500'}`}>{data?.summary.hasSpike ? '01' : '00'}</h3>
               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${data?.summary.hasSpike ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {data?.summary.hasSpike ? 'Spike Detected' : 'All Clear'}
               </span>
            </div>
         </div>
         <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 space-y-4">
            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Resource Health</p>
            <div className="flex items-center gap-3">
               <h3 className="text-4xl font-black text-white tracking-tighter">98.2</h3>
               <span className="text-emerald-500 text-[10px] font-black tracking-widest">OPT_OPTIMAL</span>
            </div>
         </div>
      </div>

      {/* ── Main Charts Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 bg-[#111] p-10 rounded-[3rem] border border-white/5 space-y-10">
            <div className="flex justify-between items-center">
               <div className="space-y-1">
                  <h3 className="text-xl font-black text-white">Infrastructure Usage</h3>
                  <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Last 12 Hours Cluster Activity</p>
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-secondary"></div>
                     <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">CPU LOAD</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-primary"></div>
                     <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">MEMORY</span>
                  </div>
               </div>
            </div>

            <div className="h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.metrics}>
                     <defs>
                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                     <XAxis 
                        dataKey="timestamp" 
                        hide 
                     />
                     <YAxis 
                        stroke="#ffffff20" 
                        fontSize={10} 
                        tickFormatter={(v) => `${v}%`}
                        axisLine={false}
                        tickLine={false}
                     />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '1rem', fontSize: '10px' }}
                        itemStyle={{ fontWeight: '900', textTransform: 'uppercase' }}
                     />
                     <Area type="monotone" dataKey="cpu" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorCpu)" />
                     <Area type="monotone" dataKey="memory" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMem)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="lg:col-span-4 bg-[#111] p-10 rounded-[3rem] border border-white/5 space-y-8">
            <div className="space-y-1">
               <h3 className="text-xl font-black text-white">Cost Distribution</h3>
               <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Micro-service Spend</p>
            </div>

            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.metrics}>
                     <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                        {data?.metrics.map((entry: any, index: number) => (
                           <Cell key={`cell-${index}`} fill={entry.cpu > 75 ? '#ef4444' : '#6366f1'} opacity={0.6} />
                        ))}
                     </Bar>
                     <Tooltip 
                        cursor={{fill: '#ffffff05'}}
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '1rem', fontSize: '10px' }}
                     />
                  </BarChart>
               </ResponsiveContainer>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Predictive Spend</span>
                  <span className="text-white font-black text-sm">$42.40 /mo</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Savings Opportunity</span>
                  <span className="text-emerald-500 font-black text-sm">-$8.12</span>
               </div>
            </div>
         </div>
      </div>

      {/* ── AI Suggestions Section ── */}
      <div className="space-y-8">
         <div className="flex items-center gap-3">
            <HugeiconsIcon icon={ZapIcon} size={20} className="text-secondary" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">AI Optimization_</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data?.suggestions.map((s: Suggestion) => (
               <div key={s.id} className="p-10 bg-[#111] border border-white/5 rounded-[3rem] space-y-6 group hover:border-secondary/30 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                     <HugeiconsIcon icon={ZapIcon} size={100} />
                  </div>
                  <div className="flex justify-between items-start relative z-10">
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-secondary">
                        <HugeiconsIcon icon={ActivityIcon} size={20} />
                     </div>
                     <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${s.impact === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-secondary/10 text-secondary'}`}>
                        {s.impact} Impact
                     </span>
                  </div>
                  <div className="space-y-2 relative z-10">
                     <h4 className="text-lg font-black text-white">{s.title}</h4>
                     <p className="text-xs text-neutral-500 font-medium leading-relaxed">{s.desc}</p>
                  </div>
                  <button className="w-full py-4 bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-neutral-500 group-hover:bg-secondary/10 group-hover:text-secondary transition-all flex items-center justify-center gap-2">
                     Apply Optimization <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
                  </button>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
