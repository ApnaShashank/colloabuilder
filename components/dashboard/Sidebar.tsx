"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  DashboardCircleIcon,
  SourceCodeIcon,
  Award01Icon,
  FolderOpenIcon,
  UserGroupIcon,
  Briefcase02Icon,
  UserIcon,
  Settings02Icon,
  Shield01Icon,
  ArrowRight01Icon,
  SparklesIcon,
  Book02Icon,
  AiChat02Icon,
  SidebarLeft01Icon,
  SidebarRight01Icon,
  Cancel01Icon,
  RocketIcon,
  RouteIcon,
  GameController01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  user: any;
}

export default function Sidebar({ isCollapsed, onToggle, isMobileOpen, onMobileClose, user }: SidebarProps) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["OVERVIEW", "LEARN & GROW", "BUILD & SHIP", "ACCOUNT"]);

  const isAdmin = user?.isAdmin || user?.email === "shashank8808108802@gmail.com";

  const toggleGroup = (group: string) => {
    if (isCollapsed && !isMobileOpen) return;
    setExpandedGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const navigation = [
    {
      group: "OVERVIEW",
      items: [
        { name: "Dashboard",       href: "/dashboard",            icon: DashboardCircleIcon,  badge: null },
        ...(isAdmin ? [{ name: "Admin Panel", href: "/admin", icon: Shield01Icon, badge: "ADMIN" }] : []),
      ]
    },
    {
      group: "LEARN & GROW",
      items: [
        { name: "Learn",           href: "/dashboard/learn",       icon: Book02Icon,    badge: null },
        { name: "Skill Practice",  href: "/dashboard/practice",    icon: SourceCodeIcon, badge: null },
        { name: "Game Mode",       href: "/dashboard/game",        icon: GameController01Icon, badge: "NEW" },
        { name: "Roadmap",         href: "/dashboard/roadmap",     icon: RouteIcon,     badge: null },
        { name: "Leaderboard",     href: "/dashboard/leaderboard", icon: Award01Icon,   badge: null },
      ]
    },
    {
      group: "BUILD & SHIP",
      items: [
        { name: "Projects",        href: "/dashboard/projects",    icon: FolderOpenIcon, badge: null },
        { name: "Deploy",          href: "/dashboard/deploy",      icon: RocketIcon,     badge: "NEW" },
        { name: "Teams",           href: "/dashboard/teams",       icon: UserGroupIcon,  badge: null },
        { name: "AI Guide",        href: "/dashboard/ai",          icon: AiChat02Icon,   badge: null },
      ]
    },
    {
      group: "CAREERS",
      items: [
        { name: "Hackathons",      href: "/dashboard/hackathons",  icon: Award01Icon,    badge: "WIN" },
        { name: "Internships",     href: "/dashboard/internship",  icon: SparklesIcon,   badge: null },
        { name: "Careers",         href: "/dashboard/careers",     icon: Briefcase02Icon, badge: null },
      ]
    },
    {
      group: "ACCOUNT",
      items: [
        { name: "My Profile",      href: "/dashboard/portfolio",   icon: UserIcon,       badge: null },
        { name: "Settings",        href: "/dashboard/settings",    icon: Settings02Icon, badge: null },
      ]
    },
  ];

  return (
    <>
      <aside
        style={{ width: isMobileOpen ? 256 : (isCollapsed ? 80 : 256) }}
        className={`
          h-screen fixed left-0 top-0 z-[60]
          bg-[#050505] border-r border-white/[0.04] 
          flex flex-col overflow-hidden
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:transition-all lg:duration-300
        `}
      >
        {/* Brand */}
        <div className="p-5 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-3 w-fit group">
              <div className={`relative flex-shrink-0 transition-all duration-300 ${(isCollapsed && !isMobileOpen) ? "w-8 h-8" : "w-10 h-10"}`}>
                <img
                  src="https://ik.imagekit.io/DEMOPROJECT/colloabuilder.png"
                  alt="Colloabuilder Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <div className="flex flex-col">
                  <span className="text-base font-black text-white tracking-tighter leading-none">
                    Colloa<span className="text-primary">builder</span>
                  </span>
                </div>
              )}
            </Link>

            <div className="flex items-center gap-1.5">
              {(!isCollapsed || isMobileOpen) && (
                <button
                  onClick={onToggle}
                  className="hidden lg:flex p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-neutral-700 hover:text-primary hover:bg-white/[0.05] transition-all"
                >
                  <HugeiconsIcon icon={SidebarLeft01Icon} size={13} variant="stroke" strokeWidth={1.5} />
                </button>
              )}

              <button
                onClick={onMobileClose}
                className="lg:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-neutral-400 hover:text-white transition-all"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} variant="stroke" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {isCollapsed && !isMobileOpen && (
            <button
              onClick={onToggle}
              className="hidden lg:flex w-full h-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all mb-2"
            >
              <HugeiconsIcon icon={SidebarRight01Icon} size={15} variant="stroke" strokeWidth={1.5} />
            </button>
          )}
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

        <nav className="flex-1 px-3 pt-4 overflow-y-auto custom-scrollbar pb-20 space-y-1">
          {navigation.map((section) => {
            const isExpanded = expandedGroups.includes(section.group);
            const showExpanded = isCollapsed && !isMobileOpen;

            return (
              <div key={section.group} className="mb-1">
                {!showExpanded ? (
                  <button
                    onClick={() => toggleGroup(section.group)}
                    className="w-full flex items-center justify-between px-3 py-1.5 mb-1 group"
                  >
                    <span className="text-[9px] font-black text-neutral-700 uppercase tracking-[0.25em] group-hover:text-neutral-500 transition-colors">
                      {section.group}
                    </span>
                    <motion.div animate={{ rotate: isExpanded ? 0 : -90 }} transition={{ duration: 0.2 }}>
                      <HugeiconsIcon icon={ArrowDown01Icon} size={10} className="text-neutral-700 group-hover:text-neutral-500 transition-colors" variant="stroke" strokeWidth={1.5} />
                    </motion.div>
                  </button>
                ) : (
                  <div className="h-px w-full bg-white/[0.04] my-3" />
                )}

                <AnimatePresence initial={false}>
                  {(isExpanded || showExpanded) && (
                    <motion.div
                      initial={!showExpanded ? { height: 0, opacity: 0 } : false}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={!showExpanded ? { height: 0, opacity: 0 } : {}}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className={`overflow-hidden space-y-0.5 ${showExpanded ? "flex flex-col items-center" : ""}`}
                    >
                      {section.items.map((item: any) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.name + item.href}
                            href={item.href}
                            onClick={onMobileClose}
                            title={showExpanded ? `${item.name}` : ""}
                            className={`
                              flex items-center transition-all duration-200 group relative
                              ${showExpanded ? "justify-center w-11 h-11 rounded-xl mx-auto" : "gap-3 px-3 py-2.5 rounded-xl"}
                              ${isActive
                                ? "text-white bg-primary/10 border border-primary/20"
                                : "text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.03]"
                              }
                            `}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="sidebar-active"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                              />
                            )}

                            <div className={`relative flex-shrink-0 transition-all duration-200 ${isActive ? "text-primary" : "text-neutral-600 group-hover:text-neutral-400"}`}>
                              <HugeiconsIcon icon={Icon} size={showExpanded ? 18 : 15} variant="stroke" strokeWidth={isActive ? 2 : 1.5} />
                              {isActive && (
                                <div className="absolute inset-0 bg-primary/30 blur-md rounded-full opacity-40" />
                              )}
                            </div>

                            {!showExpanded && (
                              <div className="flex items-center flex-1 min-w-0 gap-2">
                                <span className={`text-[11px] font-bold tracking-tight truncate ${isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"}`}>
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full border flex-shrink-0 ${
                                    item.badge === "ADMIN"
                                      ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                      : "bg-primary/10 border-primary/20 text-primary"
                                  }`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            )}

                            {!isActive && !showExpanded && (
                              <HugeiconsIcon icon={ArrowRight01Icon} size={9} className="ml-auto opacity-0 group-hover:opacity-100 transition-all text-neutral-700 flex-shrink-0" variant="stroke" strokeWidth={1.5} />
                            )}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {(!isCollapsed || isMobileOpen) && user && (
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/[0.04] bg-[#050505]">
            <Link
              href="/dashboard/portfolio"
              onClick={onMobileClose}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                {user.avatar
                  ? <img src={user.avatar} className="w-full h-full rounded-lg object-cover" alt="" />
                  : <HugeiconsIcon icon={UserIcon} size={14} className="text-primary" variant="stroke" strokeWidth={1.5} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white truncate leading-none">{user.name || "User"}</p>
                <p className="text-[9px] text-neutral-600 uppercase tracking-widest mt-0.5 truncate">
                  {user.role || "Member"}
                </p>
              </div>
              <HugeiconsIcon icon={Settings02Icon} size={11} className="text-neutral-700 group-hover:text-neutral-400 transition-colors flex-shrink-0" variant="stroke" strokeWidth={1.5} />
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
