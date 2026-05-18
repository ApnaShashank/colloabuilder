"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Terminal, Palette, Rocket, BookOpen, 
  ChevronRight, ChevronLeft, Sparkles, CheckCircle2,
  Box, Loader2
} from "lucide-react";

const steps = [
  { id: 1, title: "Mission Context", subtitle: "Define your operational role" },
  { id: 2, title: "Intelligence Level", subtitle: "Current proficiency signal" },
  { id: 3, title: "Core Interests", subtitle: "Primary sector focus" },
  { id: 4, title: "Tech Stack", subtitle: "Standardized equipment" },
  { id: 5, title: "Final Objective", subtitle: "Primary directive" },
];

const roles = [
  { id: "developer", label: "Developer", icon: Terminal, desc: "Building core logic and systems" },
  { id: "designer", label: "Designer", icon: Palette, desc: "Crafting premium visual signals" },
  { id: "student", label: "Student", icon: BookOpen, desc: "Acquiring new intelligence" },
  { id: "builder", label: "Team Builder", icon: Rocket, desc: "Orchestrating elite squads" },
];

const levels = ["Beginner", "Intermediate", "Advanced"];

const interests = ["DSA / Coding", "Web Dev", "App Dev", "AI / ML", "Open Source"];

const stacks = ["JavaScript", "Python", "React", "Node.js", "C++", "Rust", "Go"];

const goals = [
  { id: "job", label: "Job Ready", desc: "Forge path to professional deployment" },
  { id: "projects", label: "Ship Projects", desc: "Launch real-world operational units" },
  { id: "team", label: "Teamwork", desc: "Collaborate in multisync environments" },
  { id: "competitive", label: "Competitive", desc: "Compete in global signal events" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    role: "",
    skillLevel: "",
    interests: [] as string[],
    techStack: [] as string[],
    goal: "",
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const toggleInterest = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleStack = (stack: string) => {
    setData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(stack)
        ? prev.techStack.filter(s => s !== stack)
        : [...prev.techStack, stack]
    }));
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-full bg-[#050505] flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-4xl bg-[#0e0e0e] border border-white/5 rounded-[3rem] p-12 lg:p-20 relative shadow-2xl overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-16">
            <div>
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Step {currentStep} of 5</p>
               <h1 className="text-4xl font-headline font-black text-white italic uppercase tracking-tight">{steps[currentStep-1].title}</h1>
               <p className="text-neutral-500 text-sm mt-1">{steps[currentStep-1].subtitle}</p>
            </div>
            <button 
              onClick={handleFinish}
              className="text-[10px] font-black text-neutral-700 hover:text-white uppercase tracking-widest transition-colors pt-4"
            >
              Skip Onboarding
            </button>
          </div>

          <div className="flex-1 min-h-[300px]">
             <AnimatePresence mode="wait">
               <motion.div
                 key={currentStep}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.3 }}
                 className="h-full"
               >
                 {currentStep === 1 && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {roles.map((role) => {
                       const Icon = role.icon;
                       return (
                         <button
                           key={role.id}
                           onClick={() => { setData({ ...data, role: role.id }); nextStep(); }}
                           className={`p-6 rounded-2xl border transition-all text-left flex items-start gap-5 group ${
                             data.role === role.id ? "bg-primary/5 border-primary" : "bg-white/[0.02] border-white/5 hover:border-white/20"
                           }`}
                         >
                           <div className={`p-4 rounded-xl transition-colors ${data.role === role.id ? "bg-primary text-white" : "bg-white/5 text-neutral-600 group-hover:text-white"}`}>
                             <Icon size={24} />
                           </div>
                           <div>
                             <h3 className="text-white font-bold text-lg">{role.label}</h3>
                             <p className="text-neutral-500 text-xs mt-1">{role.desc}</p>
                           </div>
                         </button>
                       );
                     })}
                   </div>
                 )}

                 {currentStep === 2 && (
                   <div className="flex flex-col gap-4 max-w-md mx-auto justify-center h-full">
                     {levels.map((lvl) => (
                       <button
                         key={lvl}
                         onClick={() => { setData({ ...data, skillLevel: lvl }); nextStep(); }}
                         className={`p-8 rounded-2xl border transition-all font-headline font-black text-2xl uppercase tracking-widest italic group ${
                           data.skillLevel === lvl ? "bg-primary text-white border-primary" : "bg-white/[0.02] border-white/5 text-neutral-600 hover:text-white hover:border-white/20"
                         }`}
                       >
                         {lvl}
                       </button>
                     ))}
                   </div>
                 )}

                 {currentStep === 3 && (
                    <div className="flex flex-wrap gap-4 justify-center">
                      {interests.map((int) => (
                        <button
                          key={int}
                          onClick={() => toggleInterest(int)}
                          className={`px-8 py-5 rounded-2xl border transition-all text-sm font-black uppercase tracking-widest ${
                            data.interests.includes(int) ? "bg-primary text-white border-primary" : "bg-white/[0.02] border-white/5 text-neutral-600 hover:text-white hover:border-white/20"
                          }`}
                        >
                          {int}
                        </button>
                      ))}
                    </div>
                 )}

                 {currentStep === 4 && (
                    <div className="flex flex-wrap gap-3 justify-center">
                      {stacks.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleStack(s)}
                          className={`px-6 py-4 rounded-xl border transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
                            data.techStack.includes(s) ? "bg-blue-600/10 text-blue-400 border-blue-600/30" : "bg-white/[0.02] border-white/5 text-neutral-600 hover:text-white hover:border-white/20"
                          }`}
                        >
                          <Box size={14} />
                          {s}
                        </button>
                      ))}
                    </div>
                 )}

                 {currentStep === 5 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {goals.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => { setData({ ...data, goal: g.id }); }}
                          className={`p-8 rounded-2xl border transition-all text-left group ${
                            data.goal === g.id ? "bg-emerald-500/5 border-emerald-500" : "bg-white/[0.02] border-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-black text-xl italic uppercase tracking-tight">{g.label}</h3>
                            {data.goal === g.id && <CheckCircle2 size={24} className="text-emerald-500" />}
                          </div>
                          <p className="text-neutral-500 text-xs">{g.desc}</p>
                        </button>
                      ))}
                    </div>
                 )}
               </motion.div>
             </AnimatePresence>
          </div>

          <div className="flex justify-between items-center mt-12 pt-12 border-t border-white/5">
            <button 
              onClick={prevStep}
              className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${currentStep === 1 ? "opacity-0 pointer-events-none" : "text-neutral-600 hover:text-white"}`}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {currentStep < 5 ? (
               <button 
                 onClick={nextStep}
                 disabled={currentStep === 1 && !data.role || currentStep === 2 && !data.skillLevel}
                 className="bg-white text-black px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
               >
                 Next Signal <ChevronRight size={16} />
               </button>
            ) : (
               <button 
                 onClick={handleFinish}
                 disabled={loading || !data.goal}
                 className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] disabled:opacity-30"
               >
                 {loading ? <Loader2 size={16} className="animate-spin" /> : (
                   <>Initialize Dashboard <Sparkles size={16} /></>
                 )}
               </button>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      </div>
    </main>
  );
}
