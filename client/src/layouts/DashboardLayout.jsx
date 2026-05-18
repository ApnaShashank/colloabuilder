import { 
  Search01Icon,
  Notification01Icon,
  HelpCircleIcon,
  UserIcon,
  ZapIcon,
  Loading01Icon,
  Logout01Icon,
  Settings02Icon,
  ArrowDown01Icon,
  Tick02Icon,
  Message01Icon,
  InboxIcon,
  ArrowRight01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import Sidebar from "../components/dashboard/Sidebar";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { user, loading: userLoading, logout } = useUser();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Track desktop/mobile for margin calculation
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    if (!userLoading && !user) {
      navigate("/login");
      return;
    }

    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.notifications.filter((n) => !n.read).length);
        }
      } catch (err) {}
    };

    if (user) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 60000);
      return () => { isMounted = false; clearInterval(interval); };
    }
    
    return () => { isMounted = false; };
  }, [user, userLoading, navigate, pathname]);

  // Auto-close sidebar on route change (mobile UX)
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const markAsRead = async (id, isBroadcast) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { notificationId: id, isBroadcast } : { markAll: true }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => (!id || n._id === id) ? { ...n, read: true } : n));
        setUnreadCount(prev => id ? Math.max(0, prev - 1) : 0);
      }
    } catch (err) {}
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (userLoading) {
    return (
      <div className="h-screen w-full bg-[#050505] flex items-center justify-center">
        <HugeiconsIcon icon={Loading01Icon} className="animate-spin text-primary" size={32} variant="stroke" strokeWidth={1.5} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] relative flex overflow-hidden">
      
      {/* Sidebar — handles its own mobile/desktop visibility */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* 
        MOBILE BACKDROP
        Appears when sidebar is open on mobile — click to close
      */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 
        MAIN CONTENT AREA
        - Mobile: ml-0 (sidebar is overlay, doesn't push content)
        - Desktop: ml-64 or ml-20 depending on collapsed state
      */}
      <div
        className="flex-1 h-screen flex flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{ marginLeft: isDesktop ? (isSidebarCollapsed ? 80 : 256) : 0 }}
      >
        <div className="flex-1 flex flex-col overflow-hidden m-2 sm:m-3 lg:m-5">
          <div className="flex-1 bg-[#080808] border border-white/[0.06] rounded-2xl sm:rounded-[2rem] overflow-hidden flex flex-col relative shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)]">
            
            {/* ── HEADER ── */}
            <header className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 border-b border-white/[0.04] bg-[#0c0c0c]/30 backdrop-blur-md relative z-20 flex-shrink-0 gap-3">
              
              {/* LEFT: Hamburger (mobile) + Search */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                
                {/* Hamburger menu — only on mobile */}
                <button 
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden flex-shrink-0 p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-all"
                  aria-label="Open navigation menu"
                >
                  <div className="w-4 h-3.5 flex flex-col justify-between">
                    <span className="w-full h-0.5 bg-current rounded-full" />
                    <span className="w-3/4 h-0.5 bg-current rounded-full" />
                    <span className="w-full h-0.5 bg-current rounded-full" />
                  </div>
                </button>

                {/* Search — hidden on mobile, visible sm+ */}
                <div className="relative flex-1 group hidden sm:block">
                  <HugeiconsIcon 
                    icon={Search01Icon} 
                    size={14} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-primary transition-colors" 
                    variant="stroke" strokeWidth={1.5} 
                  />
                  <input 
                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl py-2 pl-9 pr-4 text-[12px] text-white placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:bg-white/[0.05] transition-all" 
                    placeholder="Search or press Ctrl+K..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                  />
                </div>

                {/* Mobile: show page title instead of search */}
                <span className="sm:hidden text-sm font-black text-white uppercase tracking-tighter truncate">
                  Colloa<span className="text-primary">builder</span>
                </span>
              </div>

              {/* RIGHT: Actions */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className={`relative p-1.5 sm:p-2 rounded-xl transition-all text-neutral-500 hover:text-white ${notificationsOpen ? 'bg-primary/10 text-primary' : 'hover:bg-white/[0.05]'}`}
                  >
                    <HugeiconsIcon icon={Notification01Icon} size={18} variant="stroke" strokeWidth={1.5} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-black flex items-center justify-center rounded-full text-[9px] font-black border-2 border-[#0c0c0c]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-[300px] sm:w-[380px] bg-[#0e0e0e] border border-white/[0.08] rounded-2xl shadow-2xl z-20 overflow-hidden"
                        >
                          <div className="p-4 border-b border-white/[0.04] bg-[#111] flex justify-between items-center">
                            <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                              <HugeiconsIcon icon={InboxIcon} size={12} variant="stroke" strokeWidth={1.5} />
                              Notifications
                            </h4>
                            <button 
                              onClick={() => markAsRead()}
                              className="text-[9px] font-bold text-primary hover:text-white px-2 py-1 bg-primary/10 rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <HugeiconsIcon icon={Tick02Icon} size={10} variant="stroke" strokeWidth={1.5} />
                              Mark All Read
                            </button>
                          </div>
                          <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto scrollbar-hide py-2">
                            {notifications.length > 0 ? (
                              notifications.slice(0, 8).map((notif) => (
                                <div 
                                  key={notif._id} 
                                  className={`px-4 py-3 flex gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer border-l-2 ${notif.read ? 'border-transparent opacity-60' : 'border-primary bg-primary/[0.02]'}`}
                                  onClick={() => !notif.read && markAsRead(notif._id, !!notif.isBroadcast)}
                                >
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-[#151515] border border-white/[0.04] flex-shrink-0 ${!notif.read ? 'text-primary' : 'text-neutral-700'}`}>
                                    {notif.type === 'message' 
                                      ? <HugeiconsIcon icon={Message01Icon} size={14} variant="stroke" strokeWidth={1.5} /> 
                                      : <HugeiconsIcon icon={ZapIcon} size={14} variant="stroke" strokeWidth={1.5} />
                                    }
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2 mb-0.5">
                                      <p className="text-[11px] font-bold text-white truncate">{notif.title}</p>
                                      <span className="text-[8px] font-bold text-neutral-700 uppercase whitespace-nowrap flex-shrink-0">
                                        {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">{notif.desc}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="py-10 text-center text-neutral-700">
                                <HugeiconsIcon icon={InboxIcon} size={28} className="mx-auto mb-3 opacity-10" variant="stroke" strokeWidth={1.5} />
                                <p className="text-[10px] uppercase font-black tracking-widest text-neutral-800">No new notifications</p>
                              </div>
                            )}
                          </div>
                          <Link 
                            to="/dashboard/notifications" 
                            onClick={() => setNotificationsOpen(false)}
                            className="flex items-center justify-center gap-1.5 p-3 bg-[#111] border-t border-white/[0.04] text-[10px] font-black text-neutral-500 hover:text-white uppercase tracking-[0.15em] transition-colors"
                          >
                            View All <HugeiconsIcon icon={ArrowRight01Icon} size={10} variant="stroke" strokeWidth={1.5} />
                          </Link>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Help — hidden on mobile */}
                <button className="hidden sm:flex p-2 rounded-xl text-neutral-500 hover:text-white hover:bg-white/[0.05] transition-all">
                  <HugeiconsIcon icon={HelpCircleIcon} size={18} variant="stroke" strokeWidth={1.5} />
                </button>

                <div className="h-6 w-px bg-white/[0.06]" />

                {/* User Profile */}
                <div className="relative">
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 group transition-all"
                  >
                    {/* Name + role — hidden on mobile */}
                    <div className="text-right hidden md:block">
                      <p className="text-[11px] font-bold text-white leading-none uppercase tracking-tighter group-hover:text-primary transition-colors">{userData?.name || 'User'}</p>
                      <p className="text-[9px] text-neutral-600 uppercase tracking-widest mt-0.5">{userData?.role || 'Member'}</p>
                    </div>
                    {/* Avatar */}
                    <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary overflow-hidden group-hover:ring-2 group-hover:ring-primary/30 transition-all">
                      {userData?.avatar 
                        ? <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        : <HugeiconsIcon icon={UserIcon} size={15} variant="stroke" strokeWidth={1.5} />
                      }
                    </div>
                    <HugeiconsIcon 
                      icon={ArrowDown01Icon} 
                      size={11} 
                      className={`text-neutral-600 transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} 
                      variant="stroke" strokeWidth={1.5} 
                    />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl p-1.5 z-20"
                        >
                          <div className="px-4 py-3 border-b border-white/[0.04] mb-1">
                            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Signed in as</p>
                            <p className="text-xs font-bold text-white truncate mt-0.5">{userData?.email}</p>
                          </div>
                          
                          <Link 
                            onClick={() => setProfileOpen(false)}
                            to="/dashboard/portfolio"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] text-neutral-400 hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest group"
                          >
                            <HugeiconsIcon icon={UserIcon} size={13} className="text-neutral-600 group-hover:text-primary transition-colors" variant="stroke" strokeWidth={1.5} />
                            My Profile
                          </Link>
                          
                          <Link 
                            onClick={() => setProfileOpen(false)}
                            to="/dashboard/settings"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] text-neutral-400 hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest group"
                          >
                            <HugeiconsIcon icon={Settings02Icon} size={13} className="text-neutral-600 group-hover:text-primary transition-colors" variant="stroke" strokeWidth={1.5} />
                            Settings
                          </Link>

                          <div className="h-px bg-white/[0.05] mx-2 my-1" />

                          <button 
                            onClick={() => { setProfileOpen(false); handleLogout(); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-neutral-600 hover:text-red-400 transition-all text-[11px] font-bold uppercase tracking-widest group"
                          >
                            <HugeiconsIcon icon={Logout01Icon} size={13} className="group-hover:text-red-400 transition-colors" variant="stroke" strokeWidth={1.5} />
                            Log Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </header>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
              <div className="p-3 sm:p-5 lg:p-8 pb-24">
                <Outlet />
              </div>
            </main>

            {/* Background grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.015] z-0 overflow-hidden">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="dash-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dash-grid)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
