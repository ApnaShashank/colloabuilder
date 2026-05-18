"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckListIcon, 
  GitCommitIcon, 
  UserAdd01Icon, 
  BugIcon, 
  SourceCodeIcon, 
  MoreVerticalIcon, 
  CloudIcon,
  NotificationIcon,
  HelpCircleIcon,
  Alert01Icon,
  FlashIcon,
  ArrowRight01Icon,
  ShieldAlert,
  Loading01Icon,
  Delete02Icon,
  Cancel01Icon,
  CircleIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import Skeleton from "@/components/ui/Skeleton";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All Activity");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      toast.error("Failed to sync notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id?: string, isBroadcast?: boolean) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { notificationId: id, isBroadcast } : { markAll: true }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => 
          (!id || n._id === id) ? { ...n, read: true } : n
        ));
        if (!id) toast.success("All notifications marked as read");
      }
    } catch (err) {}
  };

  const dismissNotification = async (id: string, isBroadcast: boolean) => {
    try {
      // Optimistic UI update
      setNotifications(prev => prev.filter(n => n._id !== id));
      
      const res = await fetch(`/api/notifications?id=${id}&isBroadcast=${isBroadcast}`, {
        method: "DELETE"
      });
      
      if (res.ok) {
        toast.info("Notification dismissed");
      } else {
        fetchNotifications(); // Rollback
        toast.error("Failed to dismiss notification");
      }
    } catch (err) {
      fetchNotifications();
      toast.error("Network error");
    }
  };

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: 50, transition: { duration: 0.2 } }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return GitCommitIcon;
      case 'error': return BugIcon;
      case 'warning': return Alert01Icon;
      case 'critical': return ShieldAlert;
      case 'info': return HelpCircleIcon;
      default: return NotificationIcon;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "All Activity") return true;
    if (filter === "Unread") return !n.read;
    if (filter === "Security") return n.type === "warning" || n.type === "critical" || n.type === "error";
    return true;
  });

  return (
    <motion.div 
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h1 className="text-3xl font-headline font-black text-white tracking-tight">Vault Notifications</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage your persistent alerts and system broadcasts.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => markAsRead()}
            className="px-6 py-2.5 rounded-xl border border-white/[0.08] bg-[#111] text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white hover:border-white/20 transition-all"
          >
            Mark All Read
          </button>
        </div>
      </header>

      {/* Filters Hub */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {["All Activity", "Unread", "Security", "Broadcasts"].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`px-8 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border ${
              filter === f 
                ? "bg-primary text-white border-primary shadow-[0_4px_20px_rgba(37,99,235,0.2)]" 
                : "bg-[#111] text-neutral-500 border-white/[0.05] hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Main Notification Engine */}
      <div className="space-y-4 min-h-[400px]">
        {loading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="bg-[#0e0e0e] border border-white/5 p-6 rounded-3xl flex items-start gap-5">
                <Skeleton className="w-12 h-12 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="w-1/4 h-5" />
                    <Skeleton className="w-16 h-4" />
                  </div>
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-20 h-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => {
                const Icon = getIcon(notif.type);
                const isCritical = notif.type === 'critical' || notif.type === 'error';
                
                return (
                  <motion.div 
                    key={notif._id}
                    variants={itemVars}
                    layout
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className={`group relative flex items-center gap-6 p-6 rounded-[1.5rem] bg-[#0c0c0c] border transition-all duration-300 ${
                      !notif.read ? 'border-primary/20 bg-primary/[0.02]' : 'border-white/[0.04] opacity-80'
                    } ${isCritical && !notif.read ? 'border-red-500/30' : ''}`}
                  >
                    {/* Status Pip */}
                    {!notif.read && (
                       <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-r-full ${isCritical ? 'bg-red-500' : 'bg-primary'}`} />
                    )}

                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/[0.05] flex-shrink-0 ${
                      isCritical ? 'bg-red-500/10 text-red-500' :
                      notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                      'bg-white/5 text-neutral-400'
                    }`}>
                      <HugeiconsIcon icon={Icon} size={20} variant="stroke" strokeWidth={1.5} />
                    </div>
                    
                    <div className="flex-1 min-w-0" onClick={() => !notif.read && markAsRead(notif._id, !!notif.isBroadcast)}>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-sm font-bold truncate ${!notif.read ? 'text-white' : 'text-neutral-500'}`}>
                          {notif.title}
                        </h3>
                        {notif.isBroadcast && (
                          <span className="text-[8px] font-black bg-white text-black px-1.5 py-0.5 rounded tracking-tighter uppercase">Broadcast</span>
                        )}
                      </div>
                      <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2">{notif.desc}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-bold text-neutral-700 uppercase tracking-widest whitespace-nowrap">
                        {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                      <button 
                        onClick={() => dismissNotification(notif._id, !!notif.isBroadcast)}
                        className="p-2 text-neutral-700 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={16} variant="stroke" strokeWidth={1.5} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col items-center justify-center h-64 border border-dashed border-white/[0.08] rounded-[2rem] text-neutral-600"
              >
               <HugeiconsIcon icon={NotificationIcon} size={48} className="mb-4 opacity-10" variant="stroke" strokeWidth={1.5} />
               <p className="font-headline font-black uppercase tracking-[0.2em] italic">No active alerts.</p>
                 <p className="text-[10px] mt-2 uppercase font-bold tracking-widest">Everything is in optimal state.</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
         <div className="p-8 rounded-[2rem] bg-[#0e0e0e] border border-white/[0.06] flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/[0.04] flex items-center justify-center">
               <HugeiconsIcon icon={ShieldAlert} size={20} className="text-neutral-600" variant="stroke" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-tight">Privacy Guard</h4>
              <p className="text-neutral-500 text-[10px] font-medium leading-relaxed uppercase tracking-widest mt-1">End-to-end encrypted alerts for your vault.</p>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
