import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  CodeIcon, 
  Link01Icon, 
  Mail01Icon, 
  SourceCodeIcon, 
  FolderOpenIcon, 
  UserGroupIcon, 
  FlashIcon, 
  ArrowUpRightIcon, 
  TimeScheduleIcon, 
  GitBranchIcon,
  GlobalIcon,
  ArrowRight01Icon,
  Award01Icon,
  Loading01Icon,
  LinkedinIcon,
  GithubIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SkeletonComponent from "../../components/ui/Skeleton";

export default function PortfolioPage() {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [contributionData, setContributionData] = useState([]);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/user/profile", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (e) {
      console.error(e);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchProfile();
    
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/user/activity", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        
        let activityLog = {};
        if (data.success && data.activity) {
          data.activity.forEach((act) => {
            activityLog[act.date] = (activityLog[act.date] || 0) + act.points;
          });
        }

        const heatmap = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 370; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const impactCount = activityLog[dateStr] || 0;
          
          let level = 0;
          if (impactCount > 0) level = 1;
          if (impactCount >= 3) level = 2;
          if (impactCount >= 6) level = 3;
          if (impactCount >= 10) level = 4;
          
          heatmap.push({ level, date: dateStr, count: impactCount });
        }
        
        setContributionData(heatmap);
      } catch (e) {
        console.error(e);
      }
    };

    fetchActivity();

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const roadmapsRes = await fetch('/api/roadmap', { headers: { "Authorization": `Bearer ${token}` } }).catch(() => null);
        const teamsRes = await fetch('/api/teams', { headers: { "Authorization": `Bearer ${token}` } }).catch(() => null);
        
        let projectsCount = 0;
        let teamsCount = 0;
        
        if (roadmapsRes) {
          const d = await roadmapsRes.json();
          if (d.success) projectsCount = d.roadmaps.length;
        }
        if (teamsRes) {
          const d = await teamsRes.json();
          if (d.success) teamsCount = d.teams.length;
        }
        
        setStats({
          solved: user?.level ? user.level * 2 : 0,
          projects: projectsCount,
          teams: teamsCount,
          score: user?.level ? user.level * 1000 : 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setStatsLoading(false);
      }
    };

    if (user) fetchStats();
  }, [user]);

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const getSpecialtyScore = (baseTechs, defaultScore) => {
    const userTechs = user?.techStack;
    if (!userTechs || userTechs.length === 0) return defaultScore;
    const hasMatch = baseTechs.some(tech => userTechs.includes(tech));
    return hasMatch ? 85 + Math.floor(Math.random() * 10) : defaultScore; 
  };

  if (!mounted) return null;

  if (userLoading || (user && statsLoading)) {
    return (
      <div className="space-y-12 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
        <div className="bg-[#0e0e0e] border border-white/[0.08] rounded-[3rem] p-10 lg:p-14 flex flex-col lg:flex-row items-center lg:items-start gap-12">
          <SkeletonComponent className="w-48 h-48 rounded-[2.5rem]" />
          <div className="flex-1 space-y-6 w-full">
            <div className="space-y-3 text-center lg:text-left">
              <SkeletonComponent className="w-64 h-12 mx-auto lg:mx-0" />
              <SkeletonComponent className="w-48 h-4 mx-auto lg:mx-0" />
            </div>
            <div className="space-y-2">
              <SkeletonComponent className="w-full h-4" />
              <SkeletonComponent className="w-full h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="space-y-12 max-w-[1400px] mx-auto pb-20"
    >
      {/* ── Profile Header ── */}
      <motion.section variants={itemVars} className="bg-[#0e0e0e] border border-white/[0.08] rounded-[3rem] p-10 lg:p-14 relative overflow-hidden group shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 relative z-10">
          <div className="relative group/avatar">
            <div className="w-48 h-48 rounded-[2.5rem] border-2 border-white/[0.08] p-1.5 bg-[#111] shadow-2xl overflow-hidden group-hover/avatar:border-primary/40 transition-all duration-500 relative flex items-center justify-center">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Profile"
                  className="w-full h-full object-cover rounded-[2rem]"
                />
              ) : (
                <span className="text-6xl font-black text-primary/20 font-headline italic uppercase">{user?.username?.charAt(0)?.toUpperCase()}</span>
              )}
            </div>
            <div className="absolute -bottom-4 -right-4 bg-primary text-black p-4 rounded-2xl shadow-xl border border-white/10 z-20">
              <HugeiconsIcon icon={Award01Icon} size={24} />
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6">
              <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter font-headline italic uppercase">{user?.name || "Developer"}</h1>
              <p className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mt-2 mb-4">
                {user?.role || "Software Engineer"} | Lvl {user?.level || 1} 
              </p>
              <div className="w-12 h-1 bg-primary rounded-full mx-auto lg:mx-0" />
            </div>
            <p className="max-w-2xl text-neutral-500 text-lg leading-relaxed mb-8">
              {user?.bio || "No biography provided yet. Head to settings to update your profile and tell the community about your skills and goals."}
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
              {user?.githubUrl && (
                <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#111] border border-white/[0.05] hover:border-white/20 hover:bg-white/5 text-neutral-500 hover:text-white transition-all group/icon" title="GitHub">
                  <HugeiconsIcon icon={GithubIcon} size={20} className="group-hover/icon:scale-110 transition-transform" />
                </a>
              )}
              {user?.linkedinUrl && (
                <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#111] border border-white/[0.05] hover:border-primary/20 hover:bg-blue-500/10 text-neutral-500 hover:text-blue-500 transition-all group/icon" title="LinkedIn">
                  <HugeiconsIcon icon={LinkedinIcon} size={20} className="group-hover/icon:scale-110 transition-transform" />
                </a>
              )}
              {user?.portfolioUrl && (
                <a href={user.portfolioUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#111] border border-white/[0.05] hover:border-primary/40 hover:bg-primary/10 text-neutral-500 hover:text-primary transition-all group/icon" title="Portfolio">
                  <HugeiconsIcon icon={GlobalIcon} size={20} className="group-hover/icon:scale-110 transition-transform" />
                </a>
              )}
              {(user?.githubUrl || user?.linkedinUrl || user?.portfolioUrl) && <div className="h-6 w-px bg-white/[0.05] mx-2" />}
              <button 
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="bg-white hover:bg-neutral-200 text-black px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 italic"
              >
                Copy Profile Link
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Stats ── */}
      <motion.section variants={itemVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Problems Solved", val: stats?.solved || 0, sub: "Skill Mastery", icon: SourceCodeIcon, color: "text-primary" },
          { label: "Active Roadmaps", val: stats?.projects || 0, sub: "Learning Paths", icon: FolderOpenIcon, color: "text-white" },
          { label: "Teams Linked", val: stats?.teams || 0, sub: "Collaborations", icon: UserGroupIcon, color: "text-primary/70" },
          { label: "Impact Score", val: stats?.score || 0, sub: "Platform Progress", icon: FlashIcon, color: "text-yellow-400" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#0e0e0e] border border-white/[0.06] p-8 rounded-[2.5rem] group hover:border-white/10 transition-all shadow-xl relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-[0.08] group-hover:scale-110 transition-all">
                <HugeiconsIcon icon={Icon} size={120} className="text-white" />
              </div>
              <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{stat.label}</p>
              <div className="flex items-end gap-3 mb-2">
                <h3 className="text-4xl font-black text-white tracking-tighter font-headline italic uppercase">{stat.val}</h3>
                <HugeiconsIcon icon={ArrowUpRightIcon} size={16} className={stat.color} />
              </div>
              <p className={`text-[9px] font-black uppercase tracking-[0.15em] ${stat.color}`}>{stat.sub}</p>
            </div>
          );
        })}
      </motion.section>

      {/* ── Activity Heatmap ── */}
      <motion.section variants={itemVars} className="bg-[#0e0e0e] border border-white/[0.06] rounded-[3rem] p-10 lg:p-14 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-4 font-headline italic uppercase">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <HugeiconsIcon icon={TimeScheduleIcon} size={20} />
              </div>
              Activity Heatmap
            </h2>
            <p className="text-neutral-500 text-[10px] mt-2 uppercase tracking-widest font-bold">Platform contribution frequency based on XP</p>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-black text-neutral-600 uppercase tracking-widest p-3 bg-[#111] rounded-2xl border border-white/[0.03]">
            <span>Dormant</span>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3, 4].map((v) => (
                <div key={v} className={`w-3.5 h-3.5 rounded-sm ${
                  v === 0 ? "bg-[#181818]" : v === 1 ? "bg-primary/20" : v === 2 ? "bg-primary/40" : v === 3 ? "bg-primary/70" : "bg-primary"
                }`} />
              ))}
            </div>
            <span className="text-primary">Peak</span>
          </div>
        </div>
        
        <div className="overflow-x-auto pb-6 custom-scrollbar">
          <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] gap-2 min-w-[1000px]">
            {contributionData.map((data, i) => (
              <div 
                key={i}
                className={`aspect-square w-full rounded-sm ${
                  data.level === 0 ? "bg-[#181818]" : 
                  data.level === 1 ? "bg-primary/20" : 
                  data.level === 2 ? "bg-primary/40" : 
                  data.level === 3 ? "bg-primary/70" : 
                  "bg-primary"
                } transition-all hover:scale-125 hover:ring-2 hover:ring-white/20 cursor-pointer relative group`}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-white text-black text-[9px] font-black uppercase rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap shadow-xl">
                  {data.count} Impact Points ({data.date})
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Specialties ── */}
      <motion.section variants={itemVars} className="bg-[#0e0e0e] border border-white/[0.06] p-10 lg:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <h2 className="text-2xl font-black text-white tracking-tight mb-12 font-headline italic uppercase">Skill Specialties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "Frontend", val: getSpecialtyScore(["React", "Next.js", "Vue", "Tailwind"], 40), stack: "UI / UX" },
            { label: "Backend", val: getSpecialtyScore(["Node.js", "Python", "Java", "Go"], 35), stack: "API / Server" },
            { label: "Database", val: getSpecialtyScore(["MongoDB", "PostgreSQL", "SQL", "Redis"], 30), stack: "Data Layer" },
            { label: "DevOps", val: getSpecialtyScore(["Docker", "AWS", "Kubernetes"], 20), stack: "Infrastructure" },
          ].map((skill, i) => (
            <div key={i} className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em]">{skill.label}</p>
                <p className="text-sm font-black text-primary">{skill.val}%</p>
              </div>
              <div className="h-1.5 bg-[#111] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.val}%` }}
                  transition={{ duration: 2, delay: i * 0.1 }}
                  className="h-full bg-primary"
                ></motion.div>
              </div>
              <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">{skill.stack}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
