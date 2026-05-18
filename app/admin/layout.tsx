"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Terminal, 
  FolderOpen, 
  ShieldAlert, 
  Bell, 
  Settings, 
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  ChevronRight,
  Loader2,
  Briefcase,
  PieChart
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        
        const ADMIN_EMAIL = "shashank8808108802@gmail.com";
        const isTargetAdmin = data.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

        if (!res.ok || (!data.user?.isAdmin && !isTargetAdmin)) {
          router.push("/dashboard");
          return;
        }
        
        setIsAdmin(true);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-full bg-neutral-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!isAdmin) return null;

  const navItems = [
    { name: "Overview",     href: "/admin", icon: LayoutDashboard },
    { name: "Users",        href: "/admin/users", icon: Users },
    { name: "Problems",     href: "/admin/problems", icon: Terminal },
    { name: "Projects",     href: "/admin/projects", icon: FolderOpen },
    { name: "Teams",        href: "/admin/teams", icon: Users },
    { name: "Moderation",   href: "/admin/moderation", icon: ShieldAlert },
    { name: "Notifications",href: "/admin/notifications", icon: Bell },
    { name: "Analytics",    href: "/admin/analytics", icon: PieChart },
    { name: "Jobs",         href: "/admin/jobs", icon: Briefcase },
    { name: "Settings",     href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex">
      {/* Admin Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        transition-all duration-300 border-r border-neutral-200 bg-neutral-50 flex flex-col z-50
      `}>
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <Link href="/admin" className={`flex items-center gap-3 ${!sidebarOpen && 'hidden'}`}>
             <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-black text-xs">AD</div>
             <span className="font-bold tracking-tight">ADMIN PANEL</span>
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-neutral-200 rounded-lg">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-neutral-200 transition-colors group"
            >
              <item.icon size={20} className="text-neutral-500 group-hover:text-black" />
              {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-200">
           <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-neutral-200 transition-colors group">
              <LogOut size={20} className="rotate-180 text-neutral-500" />
              {sidebarOpen && <span className="text-sm font-medium">Exit Admin</span>}
           </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-8">
           <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500">
              Platform Interface / <span className="text-black">Control Mode</span>
           </h2>
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                 <UserIcon size={16} className="text-neutral-600" />
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-neutral-50/50">
           {children}
        </main>
      </div>
    </div>
  );
}
