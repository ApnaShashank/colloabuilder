"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  GithubIcon,
  LinkedinIcon,
  Link01Icon,
  FlashIcon,
  UserGroupIcon,
  FolderOpenIcon,
  SourceCodeIcon,
  FileEditIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Skeleton from "@/components/ui/Skeleton";
import { useUser } from "@/context/UserContext";

export default function PortfolioPage() {
  const { user } = useUser();
  const [contributionData, setContributionData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [actRes, roadmapsRes, teamsRes] = await Promise.all([
          fetch("/api/user/activity", { headers }),
          fetch("/api/roadmap", { headers }),
          fetch("/api/teams", { headers }),
        ]);

        // Heatmap
        const actData = await actRes.json().catch(() => ({ success: false }));
        let activityLog: any = {};
        if (actData.success && actData.activity) {
          actData.activity.forEach((act: any) => {
            activityLog[act.date] = (activityLog[act.date] || 0) + act.points;
          });
        }
        const heatmap = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 370; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          const count = activityLog[dateStr] || 0;
          let level = 0;
          if (count > 0) level = 1;
          if (count >= 3) level = 2;
          if (count >= 6) level = 3;
          if (count >= 10) level = 4;
          heatmap.push({ level, date: dateStr, count });
        }
        setContributionData(heatmap);

        // Stats
        const roadmapsData = await roadmapsRes.json().catch(() => ({ success: false }));
        const teamsData = await teamsRes.json().catch(() => ({ success: false }));
        setStats({
          projects: roadmapsData.success ? roadmapsData.roadmaps.length : 0,
          teams: teamsData.success ? teamsData.teams.length : 0,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAll();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-8 max-w-3xl mx-auto">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-32 rounded-3xl" />
      </div>
    );
  }

  const socialLinks = [
    { icon: GithubIcon, url: (user as any)?.githubUrl, label: "GitHub" },
    { icon: LinkedinIcon, url: (user as any)?.linkedinUrl, label: "LinkedIn" },
    { icon: Link01Icon, url: (user as any)?.portfolioUrl, label: "Website" },
    ...((user as any)?.customLinks || []).map((l: any) => ({
      icon: Link01Icon,
      url: l.url,
      label: l.name || "Link"
    }))
  ].filter((s) => s.url);

  const techStack: string[] = (user as any)?.techStack?.length
    ? (user as any).techStack
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-6 pb-24 px-4 lg:px-0"
    >
      {/* ── AVATAR + NAME ── */}
      <section className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pt-4">
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden flex items-center justify-center">
            {(user as any)?.avatar ? (
              <img
                src={(user as any).avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-primary font-black text-4xl italic uppercase">
                {user?.name?.charAt(0)}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-3">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight font-headline italic uppercase leading-none">
              {user?.name}
            </h1>
            {(user as any)?.username && (
              <p className="text-neutral-600 text-sm font-black uppercase mt-1 tracking-widest">
                @{(user as any).username}
              </p>
            )}
          </div>

          {(user as any)?.role && (
            <p className="text-neutral-500 text-xs font-black uppercase tracking-widest">
              {(user as any).role}
            </p>
          )}

          {(user as any)?.bio && (
            <p className="text-neutral-500 text-sm leading-relaxed max-w-lg">
              {(user as any).bio}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
            {socialLinks.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-neutral-600 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
              >
                <HugeiconsIcon icon={s.icon} size={14} />
                {s.label}
              </a>
            ))}
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all active:scale-95">
              <HugeiconsIcon icon={FileEditIcon} size={13} />
              Create Resume
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-white/[0.04]" />

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "XP", val: (user as any)?.xp || 0, icon: FlashIcon },
          { label: "Roadmaps", val: stats?.projects || 0, icon: FolderOpenIcon },
          { label: "Teams", val: stats?.teams || 0, icon: UserGroupIcon },
          { label: "Level", val: (user as any)?.level || 1, icon: SourceCodeIcon },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col gap-2"
          >
            <HugeiconsIcon icon={s.icon} size={16} className="text-neutral-700" />
            <p className="text-2xl font-black text-white tracking-tighter">{s.val}</p>
            <p className="text-[9px] font-black text-neutral-700 uppercase tracking-widest">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── SKILLS ── */}
      {techStack.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-[10px] font-black text-neutral-700 uppercase tracking-[0.3em]">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-black text-neutral-500 uppercase tracking-widest hover:border-primary/30 hover:text-white transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── ACTIVITY HEATMAP ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-black text-neutral-700 uppercase tracking-[0.3em]">
            Activity
          </h2>
          <div className="flex items-center gap-1.5 text-[8px] font-black text-neutral-800 uppercase tracking-widest">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((v) => (
              <div
                key={v}
                className={`w-3 h-3 rounded-sm ${
                  v === 0
                    ? "bg-white/[0.03]"
                    : v === 1
                    ? "bg-primary/20"
                    : v === 2
                    ? "bg-primary/40"
                    : v === 3
                    ? "bg-primary/70"
                    : "bg-primary"
                }`}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2 [scrollbar-width:none]">
          <div className="flex gap-1 min-w-[700px]">
            {contributionData.map((d, i) => (
              <div
                key={i}
                title={`${d.count} points · ${d.date}`}
                className={`w-3 h-3 rounded-sm flex-shrink-0 transition-transform hover:scale-150 cursor-pointer ${
                  d.level === 0
                    ? "bg-white/[0.03]"
                    : d.level === 1
                    ? "bg-primary/20"
                    : d.level === 2
                    ? "bg-primary/40"
                    : d.level === 3
                    ? "bg-primary/70"
                    : "bg-primary"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
