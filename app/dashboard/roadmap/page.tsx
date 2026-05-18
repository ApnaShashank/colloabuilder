"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight01Icon,
  PlusSignIcon,
  RouteIcon,
  Loading01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Skeleton from '@/components/ui/Skeleton';
import { toast } from 'sonner';

export default function RoadmapPage() {
  const [view, setView] = useState('lobby');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [savedRoadmaps, setSavedRoadmaps] = useState<any[]>([]);
  const [activeRoadmap, setActiveRoadmap] = useState<any>(null);
  const [formData, setFormData] = useState({ targetRole: '', focusArea: '', additionalInfo: '' });
  const [dayNodes, setDayNodes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRoadmaps() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch('/api/roadmap', {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json().catch(() => ({ success: false, roadmaps: [] }));
        if (data.success) setSavedRoadmaps(data.roadmaps);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchRoadmaps();
  }, []);

  useEffect(() => {
    if (activeRoadmap) {
      setDayNodes(Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        expanded: false,
        loading: false,
        topics: null
      })));
    }
  }, [activeRoadmap]);

  const handleCreateNew = async () => {
    if (!formData.targetRole || !formData.focusArea) {
      toast.error("Objective and Focus area required.");
      return;
    }
    setGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch('/api/roadmap/generate', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (data.success) {
        setSavedRoadmaps([data.roadmap, ...savedRoadmaps]);
        setActiveRoadmap(data.roadmap);
        setView('roadmap');
        toast.success("Roadmap generated successfully");
      }
    } catch (e) {
      toast.error("Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const fetchDayTopics = async (dayIndex: number) => {
    const node = dayNodes[dayIndex];
    if (node.topics) {
      const newNodes = [...dayNodes];
      newNodes[dayIndex].expanded = !newNodes[dayIndex].expanded;
      setDayNodes(newNodes);
      return;
    }

    const newNodes = [...dayNodes];
    newNodes[dayIndex].loading = true;
    newNodes[dayIndex].expanded = true;
    setDayNodes(newNodes);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch('/api/ai/deep-dive', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          type: "day-topics",
          context: {
            targetRole: activeRoadmap?.title,
            focusArea: activeRoadmap?.description,
            day: node.day
          }
        })
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (data.success) {
        const finalNodes = [...dayNodes];
        finalNodes[dayIndex].topics = data.results.map((t: string) => ({
          title: t,
          expanded: false,
          loading: false,
          subTopics: null
        }));
        finalNodes[dayIndex].loading = false;
        setDayNodes(finalNodes);
      }
    } catch (e) {
      const finalNodes = [...dayNodes];
      finalNodes[dayIndex].loading = false;
      setDayNodes(finalNodes);
    }
  };

  if (loading) return <Skeleton className="h-96 rounded-xl" />;

  if (generating) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
        <HugeiconsIcon icon={Loading01Icon} size={48} className="animate-spin text-white opacity-40" />
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Synthesizing learning path...</h2>
      </div>
    );
  }

  if (view === 'lobby') {
    return (
      <div className="space-y-8 p-1 sm:p-2">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-white/[0.04] pb-5">
          <div className="space-y-1">
             <div className="flex items-center gap-2">
                <HugeiconsIcon icon={RouteIcon} size={14} className="text-white/60" />
                <span className="text-neutral-500 text-[8px] font-black uppercase tracking-widest">Interactive Guidance</span>
             </div>
             <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                Career <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Roadmaps</span>
             </h1>
             <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                Architect your technical evolution through personalized, AI-guided learning modules.
             </p>
          </div>
          <button 
            onClick={() => setView('setup')}
            className="px-5 py-2.5 bg-white text-black rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2"
          >
             <HugeiconsIcon icon={PlusSignIcon} size={14} /> Create Roadmap
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {savedRoadmaps.map(r => (
             <button 
               key={r._id} 
               onClick={() => { setActiveRoadmap(r); setView('roadmap'); }}
               className="p-6 bg-[#090909] border border-white/[0.05] rounded-xl text-left group hover:border-white/20 transition-all relative overflow-hidden flex flex-col justify-between h-48 shadow-lg"
             >
                <div className="absolute -bottom-6 -right-6 opacity-[0.02] group-hover:scale-105 transition-transform text-white">
                   <HugeiconsIcon icon={RouteIcon} size={96} />
                </div>
                <div>
                   <h3 className="text-base font-bold text-white mb-2 group-hover:text-neutral-200 transition-colors line-clamp-1">{r.title}</h3>
                   <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider line-clamp-2">
                      {r.description}
                   </p>
                </div>
                <div className="flex items-center gap-1.5 text-[8px] font-black text-white uppercase tracking-widest pt-4 border-t border-white/[0.04]">
                   Deploy path <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
                </div>
             </button>
           ))}
        </div>
      </div>
    );
  }

  if (view === 'setup') {
    return (
      <div className="max-w-md mx-auto py-12 px-2">
         <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#090909] border border-white/[0.05] p-8 rounded-xl shadow-lg space-y-6"
         >
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Create a New Roadmap</h2>
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest px-1">Target Role</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:border-white/20 outline-none"
                    placeholder="E.G. SYSTEMS ARCHITECT"
                    value={formData.targetRole} onChange={e => setFormData({...formData, targetRole: e.target.value})}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest px-1">Focus Sector</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:border-white/20 outline-none"
                    placeholder="E.G. RUST, WEBGL, AI"
                    value={formData.focusArea} onChange={e => setFormData({...formData, focusArea: e.target.value})}
                  />
               </div>
               <button 
                onClick={handleCreateNew}
                className="w-full py-3 bg-white text-black rounded-lg font-black uppercase tracking-widest text-[9px] hover:bg-neutral-200 transition-all pt-3.5"
               >
                 Generate Path
               </button>
            </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-1 sm:p-2">
      <button onClick={() => setView('lobby')} className="flex items-center gap-2 text-[9px] font-black text-neutral-500 uppercase tracking-widest hover:text-white transition-all">
         <HugeiconsIcon icon={ArrowRight01Icon} size={12} className="rotate-180" /> Back to lobby
      </button>

      <div className="space-y-1">
         <h1 className="text-3xl font-black text-white uppercase leading-none tracking-tight">{activeRoadmap?.title}</h1>
         <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">30-Day Learning Plan</p>
      </div>

      <div className="space-y-3">
         {dayNodes.map((node, i) => (
            <div key={node.day} className="bg-[#090909] border border-white/[0.05] rounded-xl overflow-hidden transition-all shadow-md">
               <button 
                onClick={() => fetchDayTopics(i)}
                className="w-full p-6 flex justify-between items-center hover:bg-white/[0.01] transition-all"
               >
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-sm font-mono">
                        D{String(node.day).padStart(2, '0')}
                     </div>
                     <div className="text-left">
                        <h4 className="text-sm font-bold text-white uppercase">Module Sequence</h4>
                        <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest mt-0.5">Initiate Deep Dive</p>
                     </div>
                  </div>
                  {node.loading ? <HugeiconsIcon icon={Loading01Icon} size={14} className="animate-spin text-white" /> : <HugeiconsIcon icon={ArrowRight01Icon} size={16} className={`text-neutral-700 transition-all ${node.expanded ? 'rotate-90 text-white' : ''}`} />}
               </button>

               <AnimatePresence>
                  {node.expanded && node.topics && (
                     <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="px-6 pb-6 space-y-2">
                        {node.topics.map((topic: any, idx: number) => (
                           <div key={idx} className="p-4 bg-white/[0.01] border border-white/[0.03] rounded-lg flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                              <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">{topic.title}</span>
                           </div>
                        ))}
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         ))}
      </div>
    </div>
  );
}
