import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tick02Icon, 
  ArrowRight01Icon,
  PlusSignIcon,
  RouteIcon,
  Loading01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SkeletonComponent from '../../components/ui/Skeleton';

export default function RoadmapPage() {
  const [view, setView] = useState('lobby');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [formData, setFormData] = useState({ targetRole: '', focusArea: '', additionalInfo: '' });
  
  // State for the interactive 30-day plan
  const [dayNodes, setDayNodes] = useState([]);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch('/api/roadmap', {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setSavedRoadmaps(data.roadmaps);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  // Initialize 30 day nodes when a roadmap is selected
  useEffect(() => {
    if (activeRoadmap) {
      setDayNodes(Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        expanded: false,
        loading: false
      })));
    }
  }, [activeRoadmap]);

  const handleCreateNew = async () => {
    if (!formData.targetRole || !formData.focusArea) {
      alert("Please fill in role and focus area.");
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
      const data = await res.json();
      if (data.success) {
        setSavedRoadmaps([data.roadmap, ...savedRoadmaps]);
        setActiveRoadmap(data.roadmap);
        setView('roadmap');
      } else {
        alert("Generation failed: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Error generating roadmap.");
    } finally {
      setGenerating(false);
    }
  };

  const fetchDayTopics = async (dayIndex) => {
    if (dayNodes[dayIndex].topics) {
      // Already loaded, just toggle
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
            day: dayNodes[dayIndex].day
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        const finalNodes = [...dayNodes];
        finalNodes[dayIndex].topics = data.results.map((t) => ({
          title: t,
          expanded: false,
          loading: false
        }));
        finalNodes[dayIndex].loading = false;
        setDayNodes(finalNodes);
      }
    } catch (e) {
      console.error(e);
      const finalNodes = [...dayNodes];
      finalNodes[dayIndex].loading = false;
      setDayNodes(finalNodes);
    }
  };

  const fetchSubTopics = async (dayIndex, topicIndex) => {
    const day = dayNodes[dayIndex];
    if (!day.topics) return;
    const topic = day.topics[topicIndex];

    if (topic.subTopics) {
      const newNodes = [...dayNodes];
      if (newNodes[dayIndex].topics) {
        newNodes[dayIndex].topics[topicIndex].expanded = !newNodes[dayIndex].topics[topicIndex].expanded;
      }
      setDayNodes(newNodes);
      return;
    }

    const newNodes = [...dayNodes];
    if (newNodes[dayIndex].topics) {
      newNodes[dayIndex].topics[topicIndex].loading = true;
      newNodes[dayIndex].topics[topicIndex].expanded = true;
    }
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
          type: "sub-topics",
          context: { targetRole: activeRoadmap?.title },
          parentTopic: topic.title
        })
      });
      const data = await res.json();
      if (data.success) {
        const finalNodes = [...dayNodes];
        if (finalNodes[dayIndex].topics) {
          finalNodes[dayIndex].topics[topicIndex].subTopics = data.results;
          finalNodes[dayIndex].topics[topicIndex].loading = false;
        }
        setDayNodes(finalNodes);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1500px] mx-auto space-y-12 animate-in fade-in duration-500">
        <SkeletonComponent className="w-full h-48 rounded-[2.5rem]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => <SkeletonComponent key={i} className="w-full h-64 rounded-[2rem]" />)}
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-8 text-center px-6">
        <HugeiconsIcon icon={Loading01Icon} size={64} className="animate-spin text-primary opacity-50" />
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-white font-headline italic uppercase tracking-tighter leading-none">GENERATING_MASTER_PLAN</h2>
          <p className="text-neutral-500 font-medium italic uppercase text-xs tracking-widest">Synthesizing 30-day curriculum with tactical precision...</p>
        </div>
      </div>
    );
  }

  if (view === 'lobby') {
    return (
      <div className="max-w-[1500px] mx-auto space-y-12 pb-24 px-4 md:px-0">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <p className="text-[11px] font-black text-neutral-600 uppercase tracking-[0.3em] mb-1">Strategic Planning</p>
            <h1 className="text-5xl font-black text-white font-headline italic uppercase tracking-tighter leading-none">
              Career <span className="text-primary opacity-40">Roadmaps</span>
            </h1>
            <p className="text-neutral-500 text-sm max-w-xl italic">Architect your professional evolution with AI-generated tactical curricula.</p>
          </div>
          <button 
            onClick={() => setView('setup')} 
            className="bg-primary hover:bg-neutral-200 text-black px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 transition-all flex items-center gap-3 italic"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
            Initialize Roadmap
          </button>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {savedRoadmaps.length === 0 ? (
            <div className="col-span-full py-24 text-center bg-[#0e0e0e] border border-white/[0.06] rounded-[3rem] shadow-2xl">
              <HugeiconsIcon icon={RouteIcon} size={64} className="text-neutral-800 mx-auto mb-6" />
              <h3 className="text-white font-black text-xl italic uppercase tracking-tighter mb-2">No active corridors detected.</h3>
              <p className="text-neutral-600 text-xs font-bold uppercase tracking-widest">Initialize a new roadmap to begin your tactical evolution.</p>
            </div>
          ) : (
            savedRoadmaps.map(r => (
              <button 
                key={r._id} 
                onClick={() => { setActiveRoadmap(r); setView('roadmap'); }} 
                className="p-10 bg-[#0e0e0e] border border-white/[0.06] rounded-[3rem] text-left hover:border-primary/30 transition-all group shadow-xl relative overflow-hidden"
              >
                <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:scale-110 transition-transform">
                   <HugeiconsIcon icon={RouteIcon} size={120} className="text-primary" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-colors">
                   <HugeiconsIcon icon={RouteIcon} size={20} className="text-neutral-400 group-hover:text-primary" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 italic uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">{r.title}</h3>
                <p className="text-xs text-neutral-500 line-clamp-3 italic leading-relaxed mb-8">{r.description}</p>
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                  Enter Corridor <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  if (view === 'setup') {
    return (
      <div className="max-w-2xl mx-auto py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0e0e0e] p-12 rounded-[3.5rem] border border-white/[0.08] space-y-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <HugeiconsIcon icon={PlusSignIcon} size={120} className="text-primary rotate-12" />
          </div>
          
          <div className="space-y-3 relative z-10">
            <h2 className="text-4xl font-black text-white font-headline italic uppercase tracking-tighter leading-none">Setup_Master_Plan</h2>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest">Define the parameters of your technical evolution.</p>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Objective_Target</label>
              <input type="text" placeholder="E.G. SENIOR FRONTEND ENGINEER" value={formData.targetRole} onChange={e => setFormData({...formData, targetRole: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.08] p-5 rounded-2xl text-white text-sm focus:border-primary/50 outline-none transition-all" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Focus_Sectors</label>
              <input type="text" placeholder="E.G. NEXT.JS, AI, THREE.JS" value={formData.focusArea} onChange={e => setFormData({...formData, focusArea: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.08] p-5 rounded-2xl text-white text-sm focus:border-primary/50 outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest ml-1">Additional_Parameters</label>
              <textarea placeholder="ANY SPECIFIC REQUIREMENTS?" value={formData.additionalInfo} onChange={e => setFormData({...formData, additionalInfo: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.08] p-5 rounded-2xl text-white text-sm focus:border-primary/50 outline-none transition-all min-h-[120px] resize-none" />
            </div>

            <div className="pt-6 flex gap-4">
              <button onClick={handleCreateNew} className="flex-1 bg-primary hover:bg-neutral-200 text-black py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] italic transition-all shadow-2xl shadow-primary/20">
                Generate 30-Day Path
              </button>
              <button onClick={() => setView('lobby')} className="px-8 text-neutral-600 hover:text-white transition-colors text-[11px] font-black uppercase tracking-widest italic">
                Abort
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 md:px-0 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-6">
          <button onClick={() => setView('lobby')} className="text-neutral-600 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all group">
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Tactical Lobby
          </button>
          <div className="space-y-4">
             <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Active_Evolution_Corridor</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter font-headline italic uppercase leading-none">{activeRoadmap?.title}</h1>
             <p className="text-neutral-500 font-medium italic max-w-2xl text-lg leading-relaxed">{activeRoadmap?.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {dayNodes.map((node, dayIdx) => (
          <div key={node.day} className="bg-[#0e0e0e] border border-white/[0.06] rounded-[2.5rem] overflow-hidden transition-all shadow-xl">
            <button 
              onClick={() => fetchDayTopics(dayIdx)}
              className="w-full p-8 md:p-10 flex justify-between items-center hover:bg-white/[0.02] transition-all"
            >
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary font-black text-xl italic">
                  D{String(node.day).padStart(2, '0')}
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Focus Module {node.day}</h3>
                  <p className="text-[10px] font-black uppercase text-neutral-700 tracking-[0.25em] mt-1">Initiate Tactical Curriculum</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                {node.loading && <HugeiconsIcon icon={Loading01Icon} size={20} className="animate-spin text-primary opacity-50" />}
                <HugeiconsIcon icon={ArrowRight01Icon} size={24} className={`text-neutral-800 transition-all ${node.expanded ? 'rotate-90 text-primary' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {node.expanded && node.topics && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-8 md:px-10 pb-10 space-y-4"
                >
                  {node.topics.map((topic, topicIdx) => (
                    <div key={topicIdx} className="bg-white/[0.01] border border-white/[0.04] rounded-3xl overflow-hidden group/topic hover:border-primary/20 transition-all">
                      <button 
                        onClick={() => fetchSubTopics(dayIdx, topicIdx)}
                        className="w-full p-7 flex justify-between items-center hover:bg-white/[0.02] transition-all"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary/30 group-hover/topic:bg-primary transition-colors shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
                          <span className="text-base font-black text-neutral-400 group-hover/topic:text-white transition-colors uppercase italic tracking-tight">{topic.title}</span>
                        </div>
                        {topic.loading ? (
                          <HugeiconsIcon icon={Loading01Icon} size={16} className="animate-spin text-primary opacity-50" />
                        ) : (
                          <HugeiconsIcon icon={PlusSignIcon} size={16} className={`text-neutral-800 transition-all ${topic.expanded ? 'rotate-45 text-primary' : ''}`} />
                        )}
                      </button>

                      <AnimatePresence>
                        {topic.expanded && topic.subTopics && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-8 pb-8 space-y-3"
                          >
                            {topic.subTopics.map((sub, sIdx) => (
                              <div key={sIdx} className="flex items-center gap-5 p-5 bg-white/[0.01] rounded-[1.2rem] border border-white/[0.03] group/sub hover:bg-white/[0.03] transition-all">
                                <HugeiconsIcon icon={Tick02Icon} size={16} className="text-neutral-800 group-hover/sub:text-primary transition-colors" />
                                <span className="text-xs font-bold text-neutral-500 group-hover/sub:text-neutral-300 transition-colors italic">{sub}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
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
