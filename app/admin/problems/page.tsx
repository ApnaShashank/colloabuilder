"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Terminal, 
  Code2, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  ChevronRight,
  Filter,
  X,
  PlusCircle,
  FileCode,
  FlaskConical,
  Settings2,
  Save,
  Braces
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Details");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    difficulty: "Easy",
    tags: [] as string[],
    description: "",
    examples: [{ input: "", output: "", explanation: "" }],
    constraints: [""],
    starterCode: { javascript: "", typescript: "", python: "" },
    testCases: [{ input: "", expectedOutput: "", isPublic: true }]
  });

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/problems");
      const data = await res.json();
      if (data.success) {
        setProblems(data.problems);
      }
    } catch (err) {
      toast.error("Failed to sync problems from vault.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      difficulty: "Easy",
      tags: [],
      description: "",
      examples: [{ input: "", output: "", explanation: "" }],
      constraints: [""],
      starterCode: { javascript: "", typescript: "", python: "" },
      testCases: [{ input: "", expectedOutput: "", isPublic: true }]
    });
    setEditingProblem(null);
    setActiveTab("Details");
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (problem: any) => {
    setEditingProblem(problem);
    setFormData({
      title: problem.title,
      difficulty: problem.difficulty,
      tags: problem.tags || [],
      description: problem.description,
      examples: problem.examples?.length ? problem.examples : [{ input: "", output: "", explanation: "" }],
      constraints: problem.constraints?.length ? problem.constraints : [""],
      starterCode: problem.starterCode || { javascript: "", typescript: "", python: "" },
      testCases: problem.testCases?.length ? problem.testCases : [{ input: "", expectedOutput: "", isPublic: true }]
    });
    setIsModalOpen(true);
  };

  const generateTemplates = () => {
    if (!formData.title) return toast.error("Enter a title first");
    const fnName = formData.title.toLowerCase().replace(/\s+/g, '_');
    
    setFormData(prev => ({
      ...prev,
      starterCode: {
        javascript: `/**\n * @param {any} input\n * @return {any}\n */\nfunction solution(input) {\n  // Implement your logic here\n  return null;\n}`,
        typescript: `function solution(input: any): any {\n  // Implement your logic here\n  return null;\n}`,
        python: `def solution(input):\n    # Implement your logic here\n    pass`
      }
    }));
    toast.success("Templates generated!");
  };

  const saveProblem = async () => {
    if (!formData.title || !formData.description) return toast.error("Title and Description are mandatory.");
    
    try {
      const url = "/api/admin/problems";
      const method = editingProblem ? "PATCH" : "POST";
      const body = editingProblem 
        ? { problemId: editingProblem._id, updates: formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        toast.success(editingProblem ? "Core logic updated." : "New arena initialized.");
        setIsModalOpen(false);
        fetchProblems();
      } else {
        toast.error("Process failed. Check schema compatibility.");
      }
    } catch (err) {
      toast.error("Network synchronization error.");
    }
  };

  const handleDeleteProblem = async (id: string) => {
    if (!confirm("Terminate this problem from the database?")) return;
    try {
      const res = await fetch(`/api/admin/problems?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Problem purged.");
        fetchProblems();
      }
    } catch (err) {}
  };

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-headline font-black text-black tracking-tighter">Coding Problems</h1>
          <p className="text-neutral-500 text-sm mt-1">Full CRUD control over practice arena modules.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="px-8 py-3 bg-black text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-neutral-800 transition-all shadow-2xl active:scale-95 border border-white/10"
        >
          <Plus size={18} />
          Forge New Arena
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 p-5 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-4 opacity-[0.02] -rotate-12 translate-x-4 -translate-y-4">
           <Braces size={80} className="text-black" />
        </div>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Filter by title, difficulty or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
          />
        </div>
        <div className="flex gap-2">
           <button className="px-6 border border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              <Filter size={14} />
              Sort: Recent
           </button>
        </div>
      </div>

      {/* Grid Engine */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-neutral-100 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="w-48 h-6" />
                  <Skeleton className="w-16 h-5" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="w-12 h-4" />
                  <Skeleton className="w-12 h-4" />
                  <Skeleton className="w-12 h-4" />
                </div>
                <Skeleton className="w-full h-12" />
                <div className="pt-4 border-t border-neutral-50 flex justify-between">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-16 h-4" />
                </div>
              </div>
            ))
          ) : filteredProblems.length === 0 ? (
            <div className="col-span-full py-32 bg-[#fafafa] border border-dashed border-neutral-200 rounded-[3rem] text-center">
               <Terminal size={48} className="text-neutral-200 mx-auto mb-6 block" />
               <p className="text-neutral-400 font-headline font-black uppercase tracking-[0.3em]">No modules found.</p>
               <p className="text-[10px] text-neutral-300 uppercase tracking-widest mt-4">Initiate "Forge New Arena" to expand.</p>
            </div>
          ) : (
            filteredProblems.map((problem) => (
              <motion.div 
                key={problem._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white border border-neutral-100 rounded-[2rem] p-8 hover:shadow-2xl hover:border-black/5 transition-all group relative overflow-hidden flex flex-col justify-between"
              >
                 <div className="flex justify-between items-start mb-6">
                    <div className="space-y-3">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${
                          problem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-red-50 text-red-600 border-red-100'
                       }`}>
                          {problem.difficulty}
                       </span>
                       <h3 className="font-headline font-black text-2xl leading-none group-hover:text-black transition-colors">{problem.title}</h3>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                       <button onClick={() => handleOpenEdit(problem)} className="p-3 bg-neutral-50 hover:bg-black hover:text-white rounded-xl transition-all border border-neutral-100 shadow-sm">
                          <Edit3 size={16} />
                       </button>
                       <button onClick={() => handleDeleteProblem(problem._id)} className="p-3 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-100 text-red-600 shadow-sm">
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </div>

                 <div className="flex flex-wrap gap-2 mb-8">
                    {problem.tags?.map((tag: string) => (
                      <span key={tag} className="text-[9px] font-black text-neutral-400 bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-md uppercase tracking-widest">
                         {tag}
                      </span>
                    ))}
                 </div>

                 <div className="flex items-center justify-between pt-6 border-t border-neutral-50">
                    <div className="flex gap-6">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{problem.acceptedCount || 0} Solved</span>
                       </div>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-black text-neutral-300 group-hover:text-black uppercase tracking-widest transition-colors">
                       Manage Internal Tests <ChevronRight size={14} />
                    </button>
                 </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Editor Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl h-[85vh] bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-neutral-100 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/20">
                    {editingProblem ? <Edit3 size={24} /> : <PlusCircle size={24} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-headline font-black tracking-tight">{editingProblem ? "Refine Problem" : "Forge New Problem"}</h2>
                    <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mt-0.5">{editingProblem ? "Update core logic" : "Arena initiation mode"}</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-neutral-50 rounded-2xl transition-all">
                  <X />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 flex overflow-hidden">
                {/* Lateral Nav */}
                <div className="w-48 border-r border-neutral-100 bg-neutral-50/50 p-6 space-y-2">
                   {[
                     { id: "Details", icon: Settings2 },
                     { id: "Examples", icon: Braces },
                     { id: "Code", icon: FileCode },
                     { id: "Tests", icon: FlaskConical }
                   ].map(tab => (
                     <button 
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id)}
                       className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                         activeTab === tab.id ? "bg-white text-black shadow-lg shadow-black/5 border border-neutral-100" : "text-neutral-400 hover:text-black"
                       }`}
                     >
                       <tab.icon size={16} />
                       {tab.id}
                     </button>
                   ))}
                </div>

                {/* Form Panels */}
                <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                  <AnimatePresence mode="wait">
                    {activeTab === "Details" && (
                      <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Title</label>
                            <input 
                              type="text" 
                              value={formData.title} 
                              onChange={e => setFormData({...formData, title: e.target.value})}
                              placeholder="e.g. Spiral Matrix II" 
                              className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Difficulty</label>
                            <select 
                              value={formData.difficulty} 
                              onChange={e => setFormData({...formData, difficulty: e.target.value})}
                              className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:outline-none appearance-none"
                            >
                              <option>Easy</option>
                              <option>Medium</option>
                              <option>Hard</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Description (Markdown Supported)</label>
                          <textarea 
                            rows={8}
                            value={formData.description} 
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="Describe the logic challenge..." 
                            className="w-full bg-neutral-50 border border-neutral-100 rounded-[2rem] px-8 py-6 text-sm leading-relaxed focus:bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all resize-none"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Constraints</label>
                          {formData.constraints.map((c, i) => (
                            <div key={i} className="flex gap-2">
                               <input 
                                value={c} 
                                onChange={e => {
                                  let newC = [...formData.constraints];
                                  newC[i] = e.target.value;
                                  setFormData({...formData, constraints: newC});
                                }}
                                className="flex-1 bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-2 text-xs" 
                                placeholder="e.g. 1 <= n <= 20"
                              />
                               <button onClick={() => setFormData({...formData, constraints: formData.constraints.filter((_, idx) => idx !== i)})} className="p-2 text-neutral-400 hover:text-red-500">
                                 <X size={14} />
                               </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => setFormData({...formData, constraints: [...formData.constraints, ""]})}
                            className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1 hover:text-black"
                          >
                            <Plus size={12} /> Add Constraint
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "Examples" && (
                       <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                          {formData.examples.map((ex, i) => (
                            <div key={i} className="p-8 bg-neutral-50 rounded-[2.5rem] border border-neutral-100 space-y-6 relative">
                               <button onClick={() => setFormData({...formData, examples: formData.examples.filter((_, idx) => idx !== i)})} className="absolute top-6 right-6 p-2 text-neutral-300 hover:text-red-500 transition-colors">
                                  <Trash2 size={16} />
                               </button>
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Example #{i + 1}</h4>
                               <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                     <label className="text-[9px] font-bold uppercase tracking-widest ml-1">Input</label>
                                     <input value={ex.input} onChange={e => {
                                        let ne = [...formData.examples]; ne[i].input = e.target.value; setFormData({...formData, examples: ne});
                                     }} className="w-full bg-white border border-neutral-100 rounded-xl px-4 py-3 text-xs" />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[9px] font-bold uppercase tracking-widest ml-1">Output</label>
                                     <input value={ex.output} onChange={e => {
                                        let ne = [...formData.examples]; ne[i].output = e.target.value; setFormData({...formData, examples: ne});
                                     }} className="w-full bg-white border border-neutral-100 rounded-xl px-4 py-3 text-xs" />
                                  </div>
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[9px] font-bold uppercase tracking-widest ml-1">Explanation</label>
                                  <textarea value={ex.explanation} onChange={e => {
                                      let ne = [...formData.examples]; ne[i].explanation = e.target.value; setFormData({...formData, examples: ne});
                                  }} className="w-full bg-white border border-neutral-100 rounded-2xl px-6 py-4 text-xs resize-none" />
                               </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => setFormData({...formData, examples: [...formData.examples, { input: "", output: "", explanation: "" }]})}
                            className="w-full py-6 border-2 border-dashed border-neutral-100 rounded-[2rem] text-neutral-300 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-black hover:border-neutral-200 transition-all"
                          >
                            + Add Documentation Example
                          </button>
                       </motion.div>
                    )}

                    {activeTab === "Code" && (
                       <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                         <div className="flex justify-between items-center bg-black p-6 rounded-[2rem] border border-white/10 shadow-2xl">
                            <div>
                               <h4 className="text-white font-headline font-black text-lg">Template Architecture</h4>
                               <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">Generate standard boilerplates for supported languages.</p>
                            </div>
                            <button 
                              onClick={generateTemplates}
                              className="px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                            >
                              Generate Initial Code
                            </button>
                         </div>

                         {['javascript', 'python', 'typescript'].map(lang => (
                           <div key={lang} className="space-y-4">
                              <div className="flex items-center gap-2 px-4">
                                 <FileCode size={14} className="text-neutral-400" />
                                 <h5 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{lang} Starter</h5>
                              </div>
                              <textarea 
                                value={(formData.starterCode as any)[lang]} 
                                onChange={e => {
                                  let nsc = {...formData.starterCode} as any;
                                  nsc[lang] = e.target.value;
                                  setFormData({...formData, starterCode: nsc});
                                }}
                                className="w-full bg-[#0a0a0a] border border-white/[0.05] rounded-[2rem] p-8 text-neutral-300 font-mono text-xs leading-relaxed focus:border-primary transition-all resize-none min-h-[160px]"
                                placeholder={`// ${lang} logic blueprint...`}
                              />
                           </div>
                         ))}
                       </motion.div>
                    )}

                    {activeTab === "Tests" && (
                       <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                          {formData.testCases.map((tc, i) => (
                            <div key={i} className="p-6 bg-white border border-neutral-100 rounded-3xl shadow-sm flex flex-col md:flex-row gap-6 items-start relative overflow-hidden">
                                <div className="absolute left-0 top-0 h-full w-1 bg-neutral-200" />
                                <div className="flex-1 space-y-4">
                                   <label className="text-[9px] font-black uppercase tracking-widest text-neutral-300">Test Vector #{i+1}</label>
                                   <div className="grid grid-cols-2 gap-4">
                                      <input 
                                        value={tc.input} 
                                        onChange={e => { let nt = [...formData.testCases]; nt[i].input = e.target.value; setFormData({...formData, testCases: nt})}}
                                        placeholder="Input Buffer"
                                        className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-xs font-mono"
                                      />
                                      <input 
                                        value={tc.expectedOutput} 
                                        onChange={e => { let nt = [...formData.testCases]; nt[i].expectedOutput = e.target.value; setFormData({...formData, testCases: nt})}}
                                        placeholder="Expected Out"
                                        className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-xs font-mono"
                                      />
                                   </div>
                                </div>
                                <div className="flex flex-col gap-3 h-full justify-between items-end">
                                   <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Public</span>
                                      <input type="checkbox" checked={tc.isPublic} onChange={e => { let nt = [...formData.testCases]; nt[i].isPublic = e.target.checked; setFormData({...formData, testCases: nt})}} className="w-4 h-4 accent-black" />
                                   </div>
                                   <button onClick={() => setFormData({...formData, testCases: formData.testCases.filter((_, idx) => idx !== i)})} className="p-2 text-neutral-300 hover:text-red-500 transition-colors">
                                      <Trash2 size={16} />
                                   </button>
                                </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => setFormData({...formData, testCases: [...formData.testCases, { input: "", expectedOutput: "", isPublic: true }]})}
                            className="w-full py-5 bg-neutral-50 border border-neutral-100 rounded-2xl text-neutral-400 font-bold text-[9px] uppercase tracking-widest hover:text-black hover:bg-neutral-100 transition-all"
                          >
                            + Append Integration Test
                          </button>
                       </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-neutral-100 bg-white z-10 flex justify-between items-center font-bold">
                 <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Draft saved locally as you type.</p>
                 <div className="flex gap-4">
                    <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors">Discard</button>
                    <button 
                      onClick={saveProblem}
                      className="px-10 py-3 bg-black text-white rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-2 hover:bg-neutral-800 transition-all"
                    >
                      <Save size={16} />
                      Commit Arena
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
