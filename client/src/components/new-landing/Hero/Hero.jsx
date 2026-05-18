import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Book02Icon,
  Briefcase02Icon,
  Award01Icon,
  ZapIcon,
  RouteIcon,
  UserGroupIcon,
  FolderOpenIcon,
  StarIcon,
  PinIcon,
  GithubIcon,
  ArrowDown01Icon,
  SparklesIcon,
  CodeIcon,
  RocketIcon,
  DatabaseIcon,
  InformationCircleIcon,
  SquareLock02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const NAV_ITEMS = [
  {
    label: "Products",
    hasDropdown: true,
    items: [
      { label: "Practice Arena", desc: "Solve 500+ algorithmic challenges", icon: CodeIcon, href: "/dashboard/practice" },
      { label: "Team Workspaces", desc: "Collaborate on real projects", icon: UserGroupIcon, href: "/dashboard/teams" },
      { label: "Verified Portfolio", desc: "Showcase your proof of skill", icon: Award01Icon, href: "/dashboard/portfolio" },
      { label: "Careers Hub", desc: "Get hired by top companies", icon: Briefcase02Icon, href: "/dashboard/careers" },
    ]
  },
  {
    label: "Features",
    hasDropdown: true,
    items: [
      { label: "Real-time Collab", desc: "Multi-user live workspaces", icon: ZapIcon, href: "#" },
      { label: "Deployment Pipeline", desc: "One-click preview URLs", icon: RocketIcon, href: "#" },
      { label: "Ranking System", desc: "Compete globally with peers", icon: StarIcon, href: "/dashboard/leaderboard" },
      { label: "AI Mentorship", desc: "Smart hints and code reviews", icon: SparklesIcon, href: "/dashboard/ai" },
    ]
  },
  {
    label: "Plans",
    hasDropdown: true,
    items: [
      { label: "Starter", desc: "Free forever for individuals", icon: RocketIcon, href: "#" },
      { label: "Pro Team", desc: "Advanced collaboration tools", icon: ZapIcon, href: "#" },
      { label: "Enterprise", desc: "Custom training & analytics", icon: SquareLock02Icon, href: "#" },
    ]
  },
  {
    label: "About",
    hasDropdown: true,
    items: [
      { label: "Our Mission", desc: "Why we build Colloabuilder", icon: InformationCircleIcon, href: "/about" },
      { label: "Changelog", desc: "Latest system updates", icon: ZapIcon, href: "/changelog" },
      { label: "Documentation", desc: "Master the platform", icon: Book02Icon, href: "/docs" },
    ]
  }
];

const Hero = () => {
  const floatRef = useRef(null);
  const heroRef = useRef(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    // Register Houdini Paint Worklet for Ring Particles
    if ('paintWorklet' in CSS) {
      CSS.paintWorklet.addModule('https://unpkg.com/css-houdini-ringparticles/dist/ringparticles.js');
    }

    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--ring-x', x.toString());
      hero.style.setProperty('--ring-y', y.toString());
      hero.style.setProperty('--ring-interactive', "1");
    };

    const handleMouseLeave = () => {
      hero.style.setProperty('--ring-x', "50");
      hero.style.setProperty('--ring-y', "50");
      hero.style.setProperty('--ring-interactive', "0");
    };

    hero.addEventListener('pointermove', handleMouseMove);
    hero.addEventListener('pointerleave', handleMouseLeave);

    // Cards animation delay
    const cards = document.querySelectorAll(".float-card");
    cards.forEach((card, i) => {
      card.style.animationDelay = `${i * 0.3}s`;
    });

    return () => {
      hero.removeEventListener('pointermove', handleMouseMove);
      hero.removeEventListener('pointerleave', handleMouseLeave);
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen bg-[#111110] overflow-hidden font-body text-white selection:bg-[#6366f1] selection:text-white transition-all duration-700"
      style={{
        "--ring-radius": "180",
        "--ring-thickness": "400",
        "--particle-count": "120",
        "--particle-rows": "30",
        "--particle-size": "1.5",
        "--particle-color": "#6366f1",
        "--particle-min-alpha": "0.05",
        "--particle-max-alpha": "0.6",
        "--seed": "420",
        "--ring-x": "50",
        "--ring-y": "50",
        "--ring-interactive": "0",
        backgroundImage: "paint(ring-particles)",
        animation: "ripple 6s linear infinite",
      }}
    >
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 bg-[url('data:image/svg+xml,%3Csvg_viewBox=%220_0_200_200%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.75%22_numOctaves=%224%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

      {/* Background decorations (Orbs) - Enhanced Mesh Gradient */}
      <div className="absolute top-[-100px] left-[-60px] w-[500px] h-[500px] bg-[#6366f1] rounded-full blur-[120px] opacity-[0.2] animate-pulse pointer-events-none z-0" />
      <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-[#06b6d4] rounded-full blur-[120px] opacity-[0.1] pointer-events-none z-0 animate-spin-slow" />
      <div className="absolute bottom-[10%] left-[10%] w-[450px] h-[450px] bg-[#a855f7] rounded-full blur-[120px] opacity-[0.12] pointer-events-none z-0 animate-pulse delay-700" />
      <div className="absolute bottom-[60px] right-[80px] w-[340px] h-[340px] bg-[#6366f1] rounded-full blur-[120px] opacity-[0.08] pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center font-headline font-black text-lg text-white">C</div>
          <span className="text-sm font-bold tracking-tight text-white uppercase italic">colloabuilder</span>
        </div>
        
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          {NAV_ITEMS.map((item) => (
            <li 
              key={item.label}
              className="relative group py-2"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="hover:text-white cursor-pointer transition-colors flex items-center gap-1 uppercase tracking-widest text-[11px] font-black italic">
                {item.label} 
                {item.hasDropdown && <HugeiconsIcon icon={ArrowDown01Icon} size={10} className={`transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />}
              </button>

              {/* Dropdown Menu */}
              {item.hasDropdown && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${activeDropdown === item.label ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                  <div className="bg-[#1a1a18] border border-white/10 rounded-[2rem] p-4 min-w-[280px] shadow-2xl backdrop-blur-xl">
                    <div className="grid gap-2">
                      {item.items.map((subItem) => (
                        <Link 
                          key={subItem.label} 
                          to={subItem.href}
                          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group/item"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#6366f1] group-hover/item:scale-110 transition-transform">
                            <HugeiconsIcon icon={subItem.icon} size={20} variant="stroke" strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase italic text-white tracking-tight">{subItem.label}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{subItem.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link 
            to="/dashboard" 
            className="bg-[#6366f1] text-white px-6 py-2.5 rounded-full text-[13px] font-black uppercase italic tracking-wider hover:bg-[#5457e5] hover:scale-105 transition-all shadow-lg shadow-[#6366f1]/20"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 text-center pt-24 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="font-headline text-[52px] md:text-[96px] leading-[1.0] tracking-tight text-white mb-8 uppercase italic">
          WHERE STUDENTS<br />
          <span className="text-[#6366f1]">BUILD</span> THE<br />
          FUTURE OF SOFTWARE
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup" className="bg-[#6366f1] text-white px-9 py-4 rounded-full text-base font-black hover:bg-[#5457e5] hover:scale-105 transition-all shadow-xl shadow-[#6366f1]/20 uppercase italic tracking-wider">
            Get Started →
          </Link>
          <Link to="/dashboard" className="border border-white/20 text-white px-7 py-4 rounded-full text-base font-bold hover:border-[#6366f1] hover:text-[#6366f1] transition-all uppercase italic tracking-wider">
            Explore Projects
          </Link>
        </div>
      </div>

      {/* Floating decorative chips */}
      <div className="hidden lg:block">
        <div className="float-card absolute top-[170px] left-[12%] bg-[#1c1c1a] border border-white/10 rounded-full px-4 py-1.5 text-[11px] font-black text-slate-400 animate-bounce delay-0 shadow-2xl flex items-center gap-2 uppercase tracking-widest italic">
          <HugeiconsIcon icon={Book02Icon} size={12} className="text-[#6366f1]" variant="stroke" strokeWidth={2} />
          LEARN
        </div>
        <div className="float-card absolute top-[155px] right-[22%] bg-[#1c1c1a] border border-white/10 rounded-full px-4 py-1.5 text-[11px] font-black text-slate-400 animate-bounce delay-300 shadow-2xl flex items-center gap-2 uppercase tracking-widest italic">
          <HugeiconsIcon icon={Briefcase02Icon} size={12} className="text-[#6366f1]" variant="stroke" strokeWidth={2} />
          INTERNSHIP
        </div>
        <div className="float-card absolute top-[195px] right-[13%] bg-[#1c1c1a] border border-white/10 rounded-full px-4 py-1.5 text-[11px] font-black text-slate-400 animate-bounce delay-700 shadow-2xl flex items-center gap-2 uppercase tracking-widest italic">
          <HugeiconsIcon icon={Award01Icon} size={12} className="text-[#6366f1]" variant="stroke" strokeWidth={2} />
          RANK
        </div>
        <div className="float-card absolute top-[295px] left-[5%] bg-[#1c1c1a] border border-white/10 rounded-full px-4 py-1.5 text-[11px] font-black text-slate-400 animate-bounce delay-150 shadow-2xl flex items-center gap-2 uppercase tracking-widest italic">
          <HugeiconsIcon icon={ZapIcon} size={12} className="text-[#6366f1]" variant="stroke" strokeWidth={2} />
          PRACTICE
        </div>
        <div className="float-card absolute top-[350px] left-[9%] bg-[#1c1c1a] border border-white/10 rounded-full px-4 py-1.5 text-[11px] font-black text-slate-400 animate-bounce delay-1000 shadow-2xl flex items-center gap-2 uppercase tracking-widest italic">
          <HugeiconsIcon icon={RouteIcon} size={12} className="text-[#6366f1]" variant="stroke" strokeWidth={2} />
          ROADMAP
        </div>
        <div className="float-card absolute top-[270px] right-[7%] bg-[#1c1c1a] border border-white/10 rounded-full px-4 py-1.5 text-[11px] font-black text-slate-400 animate-bounce delay-500 shadow-2xl flex items-center gap-2 uppercase tracking-widest italic">
          <HugeiconsIcon icon={UserGroupIcon} size={12} className="text-[#6366f1]" variant="stroke" strokeWidth={2} />
          TEAMS
        </div>
      </div>

      {/* Dashboard mockup */}
      <div className="relative z-10 mx-auto mt-10 w-[min(760px,92vw)] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 shadow-[0_40px_100px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden border border-white/10" ref={floatRef}>
        <div className="bg-[#141412] px-4 py-3 flex items-center gap-2 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[10px] text-slate-600 ml-2 tracking-wide font-medium">colloabuilder.dev/dashboard</span>
        </div>

        <div className="bg-[#1a1a18] flex min-h-[320px]">
          {/* Mockup Sidebar */}
          <div className="hidden sm:flex w-40 bg-[#161614] border-r border-white/5 flex-col p-4 gap-1">
            <p className="text-[11px] font-black text-white mb-4">Colloa builder</p>
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 px-1">PLATFORM</p>
            <div className="bg-[#6366f1]/15 text-[#6366f1] text-[11px] font-bold px-3 py-1.5 rounded-lg">Overview</div>
            <div className="text-slate-400 text-[11px] font-medium px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer">Practice</div>
            <div className="text-slate-400 text-[11px] font-medium px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer">Leaderboard</div>
            <div className="text-slate-400 text-[11px] font-medium px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer">Projects</div>
            <div className="mt-auto text-[10px] text-slate-600 p-1">Level 12 Elite</div>
          </div>

          {/* Mockup Main */}
          <div className="flex-1 p-5 md:p-8 bg-[#1a1a18]">
            <p className="text-sm md:text-base font-bold text-white mb-1">Good morning, Arjun</p>
            <p className="text-[10px] text-slate-500 mb-4 uppercase tracking-widest font-black">Saturday, 2 Apr 2026 — Here's your update</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {[
                { icon: ZapIcon, val: "142", label: "Problems" },
                { icon: PinIcon, val: "38", label: "On Streak" },
                { icon: Award01Icon, val: "#4", label: "Leaderboard" },
                { icon: FolderOpenIcon, val: "6", label: "Projects" },
              ].map((s, i) => (
                <div key={i} className="bg-[#222220] border border-white/5 rounded-xl p-3">
                  <HugeiconsIcon icon={s.icon} size={12} className="text-[#6366f1] mb-1" variant="stroke" strokeWidth={2} />
                  <p className="text-base font-black text-white">{s.val}</p>
                  <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
              <div className="bg-[#222220] border border-white/5 rounded-xl p-4">
                <p className="text-[11px] font-black text-white uppercase italic">Practice Arena</p>
                <p className="text-[9px] text-slate-600 uppercase font-bold mt-1">500+ Problems</p>
              </div>
              <div className="bg-[#6366f1]/20 border border-white/5 rounded-xl p-4">
                <p className="text-[11px] font-black text-white uppercase italic">Team Projects</p>
                <p className="text-[9px] text-slate-600 uppercase font-bold mt-1">Real Workspaces</p>
              </div>
              <div className="bg-[#06b6d4]/20 border border-white/5 rounded-xl p-4">
                <p className="text-[11px] font-black text-white uppercase italic">Verified Portfolio</p>
                <p className="text-[9px] text-slate-600 uppercase font-bold mt-1">Auto-Updated</p>
              </div>
            </div>

            <div className="bg-[#222220] border border-white/5 rounded-lg p-2 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#6366f1] text-white text-[10px] font-black flex items-center justify-center">A</div>
              <p className="text-[10px] text-slate-400">@arjun_dev completed PR task — 5 min ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Burst Shapes */}
      <div className="absolute top-[52%] right-[23%] text-[#6366f1] opacity-50 animate-spin-slow pointer-events-none"><HugeiconsIcon icon={SparklesIcon} size={32} /></div>
      <div className="absolute top-[70%] left-[20%] text-[#6366f1] opacity-30 animate-spin-slow-reverse pointer-events-none"><HugeiconsIcon icon={SparklesIcon} size={24} /></div>

      {/* Bottom stats bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 md:gap-0 mt-16 pb-12 px-4 animate-in fade-in duration-1000 delay-500">
        <div className="bg-[#1c1c1a] border border-white/10 px-8 py-5 flex flex-col items-center rounded-2xl md:rounded-l-2xl md:rounded-r-none md:border-r-0">
          <span className="font-headline text-3xl text-white italic">12,000+</span>
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">Registered Developers</span>
        </div>
        <div className="hidden md:block w-[1px] h-12 bg-white/10" />
        <div className="bg-[#1c1c1a] border border-white/10 px-8 py-5 flex flex-col items-center rounded-2xl md:rounded-none md:border-x-0">
          <span className="font-headline text-3xl text-white italic">3,400+</span>
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">Active Teams</span>
        </div>
        <div className="hidden md:block w-[1px] h-12 bg-white/10" />
        <div className="bg-[#1c1c1a] border border-white/10 px-8 py-5 flex flex-col items-center rounded-2xl md:rounded-none md:border-x-0">
          <span className="font-headline text-3xl text-white italic">8,900+</span>
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">Projects Shipped</span>
        </div>
        <div className="hidden md:block w-[1px] h-12 bg-white/10" />
        <div className="bg-[#1c1c1a] border border-white/10 px-8 py-5 flex flex-col items-center rounded-2xl md:rounded-r-2xl md:rounded-l-none md:border-l-0">
          <span className="font-headline text-3xl text-white italic">150K+</span>
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">Problems Solved</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
