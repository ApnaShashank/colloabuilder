"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MoveLeft, Terminal, Search, X, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-404" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-404)" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { icon: Terminal, top: "20%", left: "15%", delay: 0 },
          { icon: Search, top: "60%", left: "80%", delay: 1 },
          { icon: X, top: "15%", left: "85%", delay: 2 },
          { icon: Terminal, top: "75%", left: "10%", delay: 1.5 },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              y: [0, -20, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, delay: item.delay }}
            className="absolute text-primary/20"
            style={{ top: item.top, left: item.left }}
          >
            <item.icon size={48} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[12rem] md:text-[18rem] font-headline font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/5 opacity-20">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4 -mt-12 md:-mt-24"
        >
          <h2 className="text-3xl md:text-5xl font-headline font-black text-white tracking-tight">
            SYSTEM_ERROR: <span className="text-primary italic">PATH_NOT_FOUND</span>
          </h2>
          <p className="text-neutral-500 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            The resource you are attempting to access does not exist on this server or has been relocated within the ecosystem.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <Link 
            href="/dashboard"
            className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all shadow-xl shadow-primary/20 group"
          >
            <Home size={16} />
            Return to Dashboard
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="bg-white/[0.03] border border-white/[0.08] hover:border-white/20 text-neutral-400 hover:text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all"
          >
            <MoveLeft size={16} />
            Go Back
          </button>
        </motion.div>
      </div>

      {/* Bottom Label */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <p className="text-[10px] font-black text-neutral-800 uppercase tracking-[0.4em]">
          Colloabuilder Protocol // Secure Environment
        </p>
      </div>
    </div>
  );
}
