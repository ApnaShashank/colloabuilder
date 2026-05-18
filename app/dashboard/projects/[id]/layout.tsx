"use client";

import { motion } from "framer-motion";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  Code2, 
  AlertCircle, 
  GitPullRequest, 
  Kanban, 
  Terminal, 
  FolderPlus, 
  Folder, 
  FileText, 
  FileCode2,
  Rocket,
  KeyRound,
  Clock,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

export default function ProjectWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeFile = searchParams.get("file");
  const [mounted, setMounted] = useState(false);
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json().catch(() => ({ success: false }));
      if (data.success) {
        setProject(data.project);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchProject();
  }, [id]);

  if (!mounted) return null;

  const tabs = [
    { name: "Code",         href: `/dashboard/projects/${id}`,             icon: Code2 },
    { name: "Issues",       href: `/dashboard/projects/${id}/issues`,      icon: AlertCircle },
    { name: "Pull Requests",href: `/dashboard/projects/${id}/pulls`,       icon: GitPullRequest },
    { name: "Dev Board",    href: `/dashboard/projects/${id}/board`,       icon: Kanban },
    { name: "Deploy",       href: `/dashboard/projects/${id}/deploy`,      icon: Rocket },
    { name: "Env Vars",     href: `/dashboard/projects/${id}/env`,         icon: KeyRound },
    { name: "History",      href: `/dashboard/projects/${id}/deployments`, icon: Clock },
  ];

  // Helper to construct a nested folder structure from flat file keys
  const getFileTree = () => {
    if (!project) return [];
    let filesMap = project.files instanceof Map ? Object.fromEntries(project.files) : (project.files || {});
    const keys = Object.keys(filesMap);
    if (keys.length === 0) {
      const lang = project.language;
      if (lang === "React" || lang === "TypeScript") {
        return ["app/page.tsx"];
      } else if (lang === "HTML/CSS") {
        return ["index.html"];
      } else {
        return ["src/index.js"];
      }
    }
    return keys.sort();
  };

  const fileKeys = getFileTree();

  return (
    <div className="flex h-screen overflow-hidden bg-[#1e1e1e] text-[#cccccc] -m-8">
      {children}
    </div>
  );
}
