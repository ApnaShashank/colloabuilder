import React, { useEffect, useRef, useState } from "react";
import {
  ZapIcon,
  UserGroupIcon,
  RocketIcon,
  SettingsIcon,
  CheckmarkCircle01Icon,
  Search01Icon,
  GlobalIcon,
  FlashIcon,
  Briefcase02Icon,
  SparklesIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// Image imports (using absolute paths as per environment)
const STEP_IMAGES = [
  "C:\\Users\\brije\\.gemini\\antigravity\\brain\\4d6d3da5-2fa3-4879-84ae-25764825476a\\step1_learn_visual_1777795808972.png",
  "C:\\Users\\brije\\.gemini\\antigravity\\brain\\4d6d3da5-2fa3-4879-84ae-25764825476a\\step2_team_visual_1777795824441.png",
  "C:\\Users\\brije\\.gemini\\antigravity\\brain\\4d6d3da5-2fa3-4879-84ae-25764825476a\\step3_ship_visual_1777795837564.png"
];

const STEPS = [
  {
    step: "STEP 1",
    icon: ZapIcon,
    title: "Learn by Solving",
    desc: "500+ algorithmic challenges with editorial hints. Practice DSA the right way, at your own pace.",
    img: STEP_IMAGES[0]
  },
  {
    step: "STEP 2",
    icon: UserGroupIcon,
    title: "Build with a Team",
    desc: "Form teams of 2–8 developers. Get role-based access and real team workspaces with version control.",
    img: STEP_IMAGES[1]
  },
  {
    step: "STEP 3",
    icon: RocketIcon,
    title: "Ship & Get Hired",
    desc: "Every project you ship is auto-verified on your public portfolio. Recruiters can see live previews.",
    img: STEP_IMAGES[2]
  },
];

const ProductStepCard = ({ step, title, desc, img, index }) => {
  return (
    <div className="product-step-card group">
      <div className="card-inner">
        <div className="image-section">
          <img src={img} alt={title} className="step-image" />
          <div className="step-badge">{step}</div>
        </div>
        <div className="content-section">
          <div className="brand-label">COLLOABUILDER</div>
          <h3 className="step-title">{title}</h3>
          <p className="step-description">{desc}</p>
          <button className="explore-btn">EXPLORE</button>
        </div>
      </div>
    </div>
  );
};

const CODE_LINES = [
  { ln: "1",  txt: "function fibonacci(n) {",          indent: 0, hi: false },
  { ln: "2",  txt: "  if (n <= 1) return n;",          indent: 1, hi: false },
  { ln: "3",  txt: "  let a = 0, b = 1;",              indent: 1, hi: false },
  { ln: "4",  txt: "  for (let i = 2; i <= n; i++) {", indent: 1, hi: true  },
  { ln: "5",  txt: "    let temp = a + b;",            indent: 2, hi: true  },
  { ln: "6",  txt: "    a = b;",                       indent: 2, hi: true  },
  { ln: "7",  txt: "    b = temp;",                    indent: 2, hi: true  },
  { ln: "8",  txt: "  }",                              indent: 1, hi: false },
  { ln: "9",  txt: "  return b;",                      indent: 1, hi: false },
  { ln: "10", txt: "}",                                indent: 0, hi: false },
];

const TEST_CASES = [
  { input: "fibonacci(10)", expected: "55", status: "pass" },
  { input: "fibonacci(0)",  expected: "0",  status: "pass" },
  { input: "fibonacci(1)",  expected: "1",  status: "pass" },
  { input: "fibonacci(20)", expected: "6765", status: "running" },
];

const DEPLOY_STEPS = [
  { id: "build",  label: "Build",       icon: SettingsIcon, status: "done",    time: "12s" },
  { id: "test",   label: "Tests",       icon: CheckmarkCircle01Icon, status: "done",    time: "28s" },
  { id: "lint",   label: "Lint & Type", icon: Search01Icon, status: "done",    time: "6s"  },
  { id: "deploy", label: "Deploy",      icon: RocketIcon, status: "active",  time: "..."  },
  { id: "cdn",    label: "CDN Flush",   icon: GlobalIcon, status: "pending", time: "--"  },
];

const COMMITS = [
  { avatar: "A", name: "arjun_dev",   msg: "feat: add Fibonacci memoization",  time: "2m ago",  branch: "main"    },
  { avatar: "P", name: "priya.codes", msg: "fix: edge case n=0 returns wrong", time: "14m ago", branch: "fix/fib" },
  { avatar: "R", name: "rahul_cse",   msg: "chore: update test runner config", time: "1h ago",  branch: "main"    },
];

const PR_ITEMS = [
  { id: "#42", title: "Optimize DP table for large n",     status: "review",  author: "P" },
  { id: "#41", title: "Add iterative + recursive variants", status: "merged",  author: "A" },
  { id: "#40", title: "Deploy preview: Fibonacci API",      status: "preview", author: "R" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function Features() {
  const [stepsRef, stepsVis]   = useInView();
  const [arenaRef, arenaVis]   = useInView();
  const [collabRef, collabVis] = useInView();
  const [deployAnim, setDeployAnim] = useState(false);

  useEffect(() => {
    if (collabVis) {
      const t = setTimeout(() => setDeployAnim(true), 600);
      return () => clearTimeout(t);
    }
  }, [collabVis]);

  function colorize(txt) {
    return txt
      .replace(/\b(function|return|let|const|for|if|of)\b/g, '<span class="text-indigo-400">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-[#06b6d4]">$1</span>')
      .replace(/(\/\/.*)/g,  '<span class="text-slate-600 italic">$1</span>');
  }

  return (
    <section className="bg-[#111110] py-24 md:py-32 px-6 md:px-12 text-white relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-[#6366f1] rounded-full blur-[160px] opacity-[0.03] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-[#06b6d4] rounded-full blur-[160px] opacity-[0.03] pointer-events-none" />
      <style>{`
        .product-step-card {
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 3rem;
          padding: 1rem;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .product-step-card:hover {
          transform: translateY(-5px) scale(1.01);
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4),
                      0 0 40px rgba(99, 102, 241, 0.1);
        }

        .card-inner {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1.5rem;
        }

        .image-section {
          position: relative;
          width: 140px;
          height: 140px;
          flex-shrink: 0;
          border-radius: 2rem;
          overflow: hidden;
          background: #1a1a18;
        }

        .step-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
        }

        .product-step-card:hover .step-image {
          transform: scale(1.1);
        }

        .step-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: #6366f1;
          color: white;
          font-size: 8px;
          font-weight: 900;
          padding: 0.3rem 0.6rem;
          border-radius: 99px;
          letter-spacing: 0.1em;
        }

        .content-section {
          padding-right: 1rem;
        }

        .brand-label {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.3em;
          color: #6366f1;
          margin-bottom: 0.5rem;
          opacity: 0.6;
        }

        .step-title {
          font-family: var(--font-headline);
          font-size: 1.25rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          font-style: italic;
          letter-spacing: -0.02em;
        }

        .step-description {
          font-size: 0.8rem;
          color: #888;
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }

        .explore-btn {
          width: auto;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: none;
          border-radius: 2rem;
          color: white;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .explore-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
        }

        @media (max-width: 1024px) {
          .card-inner {
            flex-direction: column;
            align-items: flex-start;
          }
          .image-section {
            width: 100%;
            height: 200px;
          }
        }
      `}</style>

      {/* ── Header ── */}
      <div className="max-w-4xl mx-auto text-center mb-24">
        <h2 className="font-headline text-4xl md:text-7xl leading-none uppercase italic tracking-tight mb-8">
          One platform.<br />
          <span className="text-[#6366f1]">The full journey</span><br />
          from student to engineer.
        </h2>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Most students can solve problems in isolation. What they can't do is build
          real systems with a real team under real constraints. That's exactly what
          Colloabuilder is built for.
        </p>
      </div>

      {/* ── Step cards ── */}
      <div
        ref={stepsRef}
        className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-40 transition-all duration-1000 ${stepsVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        {STEPS.map((s, i) => (
          <ProductStepCard key={s.step} {...s} index={i} />
        ))}
      </div>

      {/* ── Practice Arena ── */}
      <div
        ref={arenaRef}
        className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32 transition-all duration-1000 ${arenaVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-pulse" />
            <span className="text-[10px] font-black text-[#6366f1] uppercase tracking-[0.2em]">MODULE 01</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-headline font-black italic uppercase tracking-tighter leading-[0.9]">
            Solve with purpose.<br />Build with data.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            The Practice Arena transforms theory into measurable skill. Solve data
            structures challenges, then immediately apply those patterns in your
            team's live projects.
          </p>
          <ul className="space-y-4 text-sm text-slate-500">
            {["500+ problems across DSA, System Design, and UI Engineering", "Built-in editor with real-time feedback and edge-case testing", "Automated ranking system — compete with peers worldwide"].map((b, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="text-[#6366f1]"><HugeiconsIcon icon={SparklesIcon} size={12} /></span> {b}
              </li>
            ))}
          </ul>
          <button className="bg-[#6366f1] text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest italic hover:scale-105 transition-all shadow-xl shadow-[#6366f1]/10">
            ENTER PRACTICE ARENA →
          </button>
        </div>

        <div className="bg-[#141412] rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
          <div className="bg-[#0e0e0e] px-5 py-3 flex items-center justify-between border-b border-white/5">
             <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
               <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
               <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
             </div>
             <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">fibonacci.js · JS</span>
          </div>
          <div className="p-6 md:p-8 space-y-8">
             <div className="font-mono text-xs md:text-sm leading-loose">
               {CODE_LINES.map((l) => (
                 <div key={l.ln} className={`flex gap-6 ${l.hi ? "bg-white/[0.03] -mx-8 px-8 border-y border-white/[0.02]" : ""}`}>
                   <span className="text-slate-800 w-4 text-right select-none">{l.ln}</span>
                   <span className="text-slate-300" style={{ paddingLeft: `${l.indent * 20}px` }} dangerouslySetInnerHTML={{ __html: colorize(l.txt) }} />
                 </div>
               ))}
             </div>
             
             <div className="bg-[#0e0e0e] rounded-2xl p-6 border border-white/5">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 italic">Test Results</p>
                <div className="space-y-3">
                  {TEST_CASES.map((t) => (
                    <div key={t.input} className="flex items-center justify-between text-[11px] font-bold">
                       <div className="flex items-center gap-3">
                         <span className={t.status === "pass" ? "text-emerald-500" : "text-amber-500 animate-spin"}>{t.status === "pass" ? "✓" : "◌"}</span>
                         <span className="text-slate-400">{t.input} <span className="text-slate-700 ml-2">→ {t.expected}</span></span>
                       </div>
                       <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${t.status === "pass" ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-amber-500 bg-amber-500/10 border-amber-500/20"}`}>
                         {t.status}
                       </span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* ── Real Engineering / Collab + Deploy ── */}
      <div
        ref={collabRef}
        className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${collabVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        <div className="order-2 lg:order-1 space-y-6">
           <div className="bg-[#141412] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="bg-[#0e0e0e] px-5 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="bg-[#6366f1]/10 border border-[#6366f1]/20 text-[#6366f1] text-[8px] font-black uppercase px-2 py-0.5 rounded italic">main</div>
              </div>
              <div className="p-8 space-y-8">
                 <div className="space-y-4">
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Activity Feed</p>
                   {COMMITS.map((c, i) => (
                     <div key={i} className="flex items-center gap-5 group">
                        <div className="w-10 h-10 rounded-xl bg-[#6366f1] text-white font-black italic flex items-center justify-center text-sm group-hover:scale-110 transition-transform">{c.avatar}</div>
                        <div className="flex-1">
                           <p className="text-xs font-bold text-white mb-1">{c.msg}</p>
                           <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{c.name} · {c.time}</p>
                        </div>
                        <span className="text-[9px] text-slate-800 font-bold font-mono">{c.branch}</span>
                     </div>
                   ))}
                 </div>
                 
                 <div className="bg-[#0e0e0e] rounded-2xl p-6 border border-white/5">
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 italic">Pull Requests</p>
                   {PR_ITEMS.map((pr) => (
                     <div key={pr.id} className="flex items-center justify-between text-[11px] font-bold mb-3 last:mb-0">
                        <div className="flex items-center gap-3">
                           <span className="text-slate-700">{pr.id}</span>
                           <span className="text-white hover:text-[#6366f1] cursor-pointer transition-colors">{pr.title}</span>
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${pr.status === 'review' ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : pr.status === 'merged' ? 'text-purple-500 bg-purple-500/10 border-purple-500/20' : 'text-[#6366f1] bg-[#6366f1]/10 border-[#6366f1]/20'}`}>{pr.status}</span>
                     </div>
                   ))}
                 </div>
              </div>
           </div>

           <div className={`bg-[#6366f1]/5 border border-[#6366f1]/20 rounded-[2.5rem] p-8 md:p-10 transition-all duration-1000 delay-300 ${deployAnim ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
              <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl text-[#6366f1]"><HugeiconsIcon icon={RocketIcon} size={24} variant="stroke" strokeWidth={1.5} /></span>
                    <div>
                       <p className="text-sm font-black text-white italic uppercase tracking-tighter">Deployment Pipeline</p>
                       <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">preview.colloabuilder.dev</p>
                    </div>
                 </div>
                 <span className="bg-[#6366f1] text-white text-[9px] font-black px-3 py-1 rounded-full animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.4)]">LIVE</span>
              </div>
              <div className="space-y-3 mb-8">
                {DEPLOY_STEPS.map((d, i) => (
                   <div key={d.id} className="flex items-center justify-between text-[11px] font-bold py-1">
                      <div className="flex items-center gap-4">
                         <span className="w-5 text-[#6366f1]/60"><HugeiconsIcon icon={d.icon} size={14} variant="stroke" strokeWidth={1.5} /></span>
                         <span className={d.status === 'done' ? 'text-slate-400' : 'text-white'}>{d.label}</span>
                      </div>
                     <span className={d.status === 'done' ? 'text-emerald-500' : d.status === 'active' ? 'text-[#6366f1]' : 'text-slate-800'}>{d.time}</span>
                  </div>
                ))}
              </div>
              <div className="bg-black/60 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                 <div className="truncate pr-4">
                    <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest mb-1">Preview URL</p>
                    <p className="text-[10px] text-[#6366f1] font-bold truncate tracking-tight uppercase">https://pr-42.colloabuilder.dev</p>
                 </div>
                 <button className="flex-shrink-0 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black px-4 py-2 rounded-xl transition-all uppercase italic">Copy</button>
              </div>
           </div>
        </div>

        <div className="order-1 lg:order-2 space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-pulse" />
            <span className="text-[10px] font-black text-[#6366f1] uppercase tracking-[0.2em]">MODULE 02</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-headline font-black italic uppercase tracking-tighter leading-[0.9]">
            Real engineering.<br />Real collaboration.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Every project gets a full professional environment — issue trackers, pull
            requests, file trees, and deployment previews — all in your browser.
          </p>
          <ul className="space-y-4 text-sm text-slate-500">
            {["Git-integrated version control for seamless team merging", "Peer code reviews to improve project quality and learning", "Role-specific access controls for project management", "Automated CI/CD pipeline with live preview deployments"].map((b, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="text-[#6366f1]"><HugeiconsIcon icon={SparklesIcon} size={12} /></span> {b}
              </li>
            ))}
          </ul>
          <button className="bg-white text-black px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest italic hover:bg-[#6366f1] hover:text-white transition-all shadow-xl shadow-white/5">
            EXPLORE WORKSPACES →
          </button>
        </div>
      </div>
    </section>
  );
}
