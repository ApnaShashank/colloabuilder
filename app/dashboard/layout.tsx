"use client";

import { 
  Search01Icon,
  Notification01Icon,
  UserIcon,
  Loading01Icon,
  Logout01Icon,
  UserGroupIcon,
  SparklesIcon,
  RocketIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import { useUser } from "@/context/UserContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useUser();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <HugeiconsIcon icon={Loading01Icon} className="animate-spin text-primary" size={32} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/50 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Not signed in</p>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Redirecting to Login...</h2>
          <Link href="/login" className="inline-block mt-4 text-[10px] font-black text-primary uppercase underline tracking-widest">Click here if not redirected</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] relative flex overflow-hidden">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        user={user}
      />

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div
        className="flex-1 h-screen flex flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: isDesktop ? (isSidebarCollapsed ? 80 : 256) : 0 }}
      >
        <div className="flex-1 flex flex-col overflow-hidden m-2 sm:m-3 lg:m-5">
          <div className="flex-1 bg-[#080808] border border-white/[0.06] rounded-2xl sm:rounded-[2rem] overflow-hidden flex flex-col relative shadow-2xl">
            
            <header className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 border-b border-white/[0.04] bg-[#0c0c0c]/30 backdrop-blur-md relative z-20 flex-shrink-0 gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button 
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden flex-shrink-0 p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-neutral-400"
                >
                  <div className="w-4 h-3.5 flex flex-col justify-between">
                    <span className="w-full h-0.5 bg-current rounded-full" />
                    <span className="w-3/4 h-0.5 bg-current rounded-full" />
                    <span className="w-full h-0.5 bg-current rounded-full" />
                  </div>
                </button>

                <div className="relative flex-1 group hidden sm:block max-w-md">
                  <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-primary transition-colors" />
                  <input 
                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl py-2 pl-9 pr-4 text-[10px] text-white font-black uppercase tracking-widest placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary/30" 
                    placeholder="Search..." 
                    type="text"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <ThemeToggle className="w-8 h-8 sm:w-9 sm:h-9" />
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className={`relative p-1.5 sm:p-2 rounded-xl transition-all text-neutral-500 hover:text-white ${notificationsOpen ? 'bg-primary/10 text-primary' : 'hover:bg-white/[0.05]'}`}
                  >
                    <HugeiconsIcon icon={Notification01Icon} size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-[#0c0c0c] shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                  </button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-80 bg-[#111] border border-white/[0.08] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-20 overflow-hidden"
                        >
                          <div className="px-6 py-5 border-b border-white/[0.04] flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase text-white tracking-[0.2em] italic">Notifications</h4>
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded-full border border-primary/20">3 NEW</span>
                          </div>
                          
                          <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                            {[
                              { title: "Team Invitation", desc: "You've been invited to join team 'Alpha'.", time: "2m ago", icon: UserGroupIcon, color: "text-primary" },
                              { title: "XP Milestone", desc: "You earned +250 XP from practice submissions.", time: "1h ago", icon: SparklesIcon, color: "text-amber-500" },
                              { title: "Platform Update", desc: "New features have been deployed to the platform.", time: "5h ago", icon: RocketIcon, color: "text-blue-500" },
                            ].map((notif, i) => (
                              <div key={i} className="p-5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                <div className="flex gap-4">
                                  <div className={`w-8 h-8 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center ${notif.color}`}>
                                    <HugeiconsIcon icon={notif.icon} size={14} />
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <p className="text-[9px] font-black text-white uppercase tracking-wider group-hover:text-primary transition-colors italic">{notif.title}</p>
                                    <p className="text-[10px] text-neutral-500 leading-relaxed">{notif.desc}</p>
                                    <p className="text-[8px] font-black text-neutral-700 uppercase tracking-widest mt-1">{notif.time}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <button className="w-full py-4 bg-white/[0.02] hover:bg-white/[0.04] text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em] transition-all">
                             View All Notifications
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-6 w-px bg-white/[0.06]" />

                <div className="relative">
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 group transition-all"
                  >
                    <div className="text-right hidden md:block">
                      <p className="text-[11px] font-black text-white leading-none uppercase tracking-tighter group-hover:text-primary transition-colors">{user?.name || 'Developer'}</p>
                      <p className="text-[9px] text-neutral-600 uppercase tracking-widest mt-0.5 font-black italic">{user?.role || 'Elite'}</p>
                    </div>
                    <div className="h-8 w-8 rounded-xl bg-primary text-black border border-primary flex items-center justify-center font-black italic overflow-hidden group-hover:ring-2 group-hover:ring-primary/30 transition-all">
                       {user?.name?.charAt(0) || <HugeiconsIcon icon={UserIcon} size={15} />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-56 bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl p-1.5 z-20"
                        >
                          <div className="px-4 py-3 border-b border-white/[0.04] mb-1 text-[9px] font-black uppercase text-neutral-500 tracking-widest truncate">
                            {user?.email}
                          </div>
                          <button 
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-neutral-600 hover:text-red-400 transition-all text-[10px] font-black uppercase tracking-widest italic"
                          >
                            <HugeiconsIcon icon={Logout01Icon} size={13} />
                            Sign Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar p-3 sm:p-5 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
