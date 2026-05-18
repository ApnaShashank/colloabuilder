"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileCode, 
  Terminal, 
  Play, 
  Eye,
  Loader2,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  Folder,
  Rocket,
  Github,
  GitBranch,
  Globe,
  Link2,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  RefreshCw,
  Sliders,
  Database
} from "lucide-react";
import SkeletonComponent from "@/components/ui/Skeleton";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; pulse: boolean; bg: string }> = {
  none:        { label: "Not Deployed",  color: "text-neutral-500",    icon: Clock,     pulse: false, bg: "bg-neutral-500/10 border-neutral-500/20" },
  queued:      { label: "Queued",        color: "text-amber-400",      icon: Clock,     pulse: true,  bg: "bg-amber-400/10 border-amber-400/20" },
  building:    { label: "Building",      color: "text-cyan-400",       icon: Loader2,   pulse: true,  bg: "bg-cyan-400/10 border-cyan-400/20" },
  live:        { label: "Live",          color: "text-emerald-400",    icon: CheckCircle, pulse: true,  bg: "bg-emerald-400/10 border-emerald-400/20" },
  failed:      { label: "Failed",        color: "text-red-400",        icon: XCircle,   pulse: false, bg: "bg-red-400/10 border-red-400/20" },
  rolled_back: { label: "Rolled Back",   color: "text-purple-400",     icon: RefreshCw,  pulse: false, bg: "bg-purple-400/10 border-purple-400/20" },
};

const LOG_COLORS: Record<string, string> = {
  info:    "text-neutral-400",
  success: "text-emerald-400",
  error:   "text-red-400",
  warn:    "text-amber-400",
};

export default function ProjectCodePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFile = searchParams.get("file");

  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [activeFileKey, setActiveFileKey] = useState<string>("");
  
  // Tab Navigation state
  const [activeTab, setActiveTab] = useState<'editor' | 'deploy'>('editor');

  // Deploy Center states
  const [deploySource, setDeploySource] = useState<'workspace' | 'github' | 'local'>('workspace');
  const [activeDeployment, setActiveDeployment] = useState<any>(null);
  const [deploying, setDeploying] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [deployBranch, setDeployBranch] = useState("main");
  const [buildCommand, setBuildCommand] = useState("npm run build");
  const [connecting, setConnecting] = useState(false);
  const [deployTerminalLines, setDeployTerminalLines] = useState<string[]>([]);
  
  // Local changes state
  const [activeContent, setActiveContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);

  // New file modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [localDirHandle, setLocalDirHandle] = useState<any>(null);

  const [terminalLines, setTerminalLines] = useState<string[]>([
    "➜ colloabuilder-sh git:(main) ✗ npm run dev",
    "Ready in 0.8s. File system watcher active."
  ]);

  // Unpack params safely on client
  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  // Fetch project details
  const fetchProject = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json().catch(() => ({ success: false }));
      if (data.success) {
        setProject(data.project);
        let projectFiles = data.project.files instanceof Map 
          ? Object.fromEntries(data.project.files) 
          : (data.project.files || {});
        
        // Fallback for legacy projects without files initialized
        if (Object.keys(projectFiles).length === 0) {
          const lang = data.project.language;
          if (lang === "React" || lang === "TypeScript") {
            projectFiles = {
              "app/page.tsx": `"use client";\nimport React, { useState } from 'react';\n\nexport default function Home() {\n  const [count, setCount] = useState(0);\n  return (\n    <div className="flex flex-col items-center justify-center p-8 text-white min-h-[300px]">\n      <h1 className="text-xl font-black uppercase tracking-wider text-cyan-400">React Workspace</h1>\n      <p className="text-neutral-500 text-xs mt-2">Active count: {count}</p>\n      <button onClick={() => setCount(count + 1)} className="mt-4 px-4 py-2 bg-white text-black font-bold text-xs rounded-lg hover:bg-neutral-200 uppercase tracking-widest">Increment</button>\n    </div>\n  );\n}`
            };
          } else if (lang === "HTML/CSS") {
            projectFiles = {
              "index.html": `<!DOCTYPE html>\n<html>\n<head>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-h-screen; background: #000; color: #fff; font-family: sans-serif;">\n  <h1 style="text-transform: uppercase; letter-spacing: 0.1em; color: #10b981;">HTML Workspace</h1>\n</body>\n</html>`
            };
          } else {
            projectFiles = {
              "src/index.js": `console.log("Hello from JavaScript workspace!");`
            };
          }
        }

        setFiles(projectFiles);

        // Set active file key
        const keys = Object.keys(projectFiles);
        if (keys.length > 0) {
          const defaultKey = activeFile && projectFiles[activeFile] !== undefined ? activeFile : keys[0];
          setActiveFileKey(defaultKey);
          setActiveContent(projectFiles[defaultKey] || "");
        }
      }
    } catch (e) {
      toast.error("Failed to load project files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  // Update editor content when active file parameter changes
  useEffect(() => {
    if (activeFile && files[activeFile] !== undefined) {
      // Save current active key locally in state before switching
      if (activeFileKey && activeFileKey !== activeFile) {
        setFiles(prev => ({ ...prev, [activeFileKey]: activeContent }));
      }
      setActiveFileKey(activeFile);
      setActiveContent(files[activeFile] || "");
    }
  }, [activeFile]);

  // Fetch GitHub status when deploy tab is active
  const fetchGithubStatus = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/projects/${id}/github`);
      const data = await res.json();
      if (data.success) {
        setProject((prev: any) => ({ ...prev, ...data.project }));
        if (data.project.github?.isConnected) {
          setRepoUrl(data.project.github.repoUrl || "");
          setDeployBranch(data.project.github.deployBranch || "main");
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (id && activeTab === 'deploy') {
      fetchGithubStatus();
    }
  }, [id, activeTab]);

  // Connect repository to GitHub
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    setConnecting(true);
    try {
      const res = await fetch(`/api/projects/${id}/github`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          repoUrl, 
          deployBranch, 
          buildCommand 
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Repository connected successfully");
        setShowConnectModal(false);
        fetchGithubStatus();
      } else {
        toast.error("Failed to connect repository");
      }
    } catch (err) {
      toast.error("Connection failed due to network error");
    } finally {
      setConnecting(false);
    }
  };

  const fetchActiveDeployment = async (deploymentId: string) => {
    try {
      const res = await fetch(`/api/deploy/${deploymentId}`);
      const data = await res.json();
      if (data.success) {
        setActiveDeployment(data.deployment);
        return data.deployment;
      }
    } catch (err) {}
    return null;
  };

  const handleDeploy = async () => {
    if (deploySource === "local") {
      try {
        if ('showDirectoryPicker' in window) {
          await (window as any).showDirectoryPicker();
          toast.success("Local folder linked for edge build.");
        } else {
          toast.error("Browser does not support local folder linking.");
          return;
        }
      } catch (err) {
        return; // User cancelled
      }
    }

    setDeploying(true);
    setDeployTerminalLines(["Initiating build tunnel...", "Awaiting secure pipeline deployment signals..."]);
    try {
      const res = await fetch("/api/deploy/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: id,
          branch: project?.github?.deployBranch || "main",
          commitMessage: `Manual build triggered via Launch Station (${deploySource})`,
          triggeredBy: "manual",
          source: deploySource,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Pipeline triggered successfully");
        setActiveDeployment(data.deployment);
        if (data.deployment?.logs) {
          setDeployTerminalLines(data.deployment.logs.map((l: any) => l.message));
        }
      } else {
        toast.error("Pipeline failure: check settings");
        setDeploying(false);
      }
    } catch (err) {
      toast.error("Deployment trigger error");
      setDeploying(false);
    }
  };

  // Polling loop for active builds
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!activeDeployment) return;

    const shouldPoll = ["queued", "building"].includes(activeDeployment.status);
    if (shouldPoll) {
      pollRef.current = setInterval(async () => {
        const updated = await fetchActiveDeployment(activeDeployment._id);
        if (updated) {
          if (updated.logs) {
            setDeployTerminalLines(updated.logs.map((l: any) => l.message));
          }
          if (!["queued", "building"].includes(updated.status)) {
            clearInterval(pollRef.current!);
            setDeploying(false);
            fetchGithubStatus();
          }
        }
      }, 1200);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeDeployment?._id, activeDeployment?.status]);

  // Save files to Database and Local System
  const handleSave = async (updatedFilesMap?: Record<string, string>) => {
    setSaving(true);
    const filesToSave = updatedFilesMap || { ...files, [activeFileKey]: activeContent };
    
    try {
      // 1. Sync back to local folder if bound
      if (localDirHandle && !updatedFilesMap) {
        try {
          const pathParts = activeFileKey.split('/');
          let currentHandle = localDirHandle;
          
          for (let i = 0; i < pathParts.length - 1; i++) {
            currentHandle = await currentHandle.getDirectoryHandle(pathParts[i], { create: true });
          }
          
          const fileHandle = await currentHandle.getFileHandle(pathParts[pathParts.length - 1], { create: true });
          const writable = await fileHandle.createWritable();
          await writable.write(activeContent);
          await writable.close();
          toast.success("Saved natively to desktop!");
        } catch (localErr) {
          console.error("Local sync error", localErr);
          toast.error("Local write blocked. Check permissions.");
        }
      }

      // 2. Save to cloud database
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: filesToSave })
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (data.success) {
        if (!localDirHandle || updatedFilesMap) toast.success("Files saved to cloud");
        setFiles(filesToSave);
      } else {
        toast.error("Cloud save failed");
      }
    } catch (e) {
      toast.error("Network error during save");
    } finally {
      setSaving(false);
    }
  };

  // Run virtual execution
  const handleRunCode = () => {
    setRunning(true);
    setTerminalLines(prev => [
      ...prev,
      `➜ colloabuilder-sh node ${activeFileKey}`,
      `Compiling source tree...`
    ]);

    setTimeout(() => {
      // Basic simulation of execution or user code evaluation
      try {
        if (activeContent.includes("console.log")) {
          // Extract basic console.logs
          const matches = [...activeContent.matchAll(/console\.log\((['"`])(.*?)\1\)/g)];
          if (matches.length > 0) {
            const outputs = matches.map(m => `[stdout] ${m[2]}`);
            setTerminalLines(prev => [...prev, ...outputs, "➜ colloabuilder-sh "]);
          } else {
            setTerminalLines(prev => [...prev, "[stdout] Process completed with code 0", "➜ colloabuilder-sh "]);
          }
        } else {
          setTerminalLines(prev => [
            ...prev,
            "[stdout] Evaluation successful: file returned undefined",
            "➜ colloabuilder-sh "
          ]);
        }
      } catch (err) {
        setTerminalLines(prev => [...prev, `[stderr] Error: Process failed`, "➜ colloabuilder-sh "]);
      }
      setRunning(false);
    }, 1000);
  };

  // Add new virtual file
  const handleAddFile = async () => {
    if (!newFileName.trim()) return;
    const finalName = newFileName.trim();
    if (files[finalName] !== undefined) {
      toast.error("File already exists");
      return;
    }

    const updatedFiles = {
      ...files,
      [activeFileKey]: activeContent, // Preserve active changes first
      [finalName]: `// Dynamic file ${finalName}\n`
    };

    setFiles(updatedFiles);
    setActiveFileKey(finalName);
    setActiveContent(`// Dynamic file ${finalName}\n`);
    setShowAddModal(false);
    setNewFileName("");

    // Save changes immediately
    await handleSave(updatedFiles);
    router.push(`/dashboard/projects/${id}?file=${encodeURIComponent(finalName)}`);
  };

  // Delete virtual file
  const handleDeleteFile = async (keyToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (Object.keys(files).length <= 1) {
      toast.error("At least one file must remain in the project");
      return;
    }
    if (!confirm(`Are you sure you want to delete ${keyToDelete}?`)) return;

    const updatedFiles = { ...files };
    delete updatedFiles[keyToDelete];

    setFiles(updatedFiles);
    
    // Switch active if we deleted the currently active file
    if (activeFileKey === keyToDelete) {
      const remainingKeys = Object.keys(updatedFiles);
      setActiveFileKey(remainingKeys[0]);
      setActiveContent(updatedFiles[remainingKeys[0]]);
      router.push(`/dashboard/projects/${id}?file=${encodeURIComponent(remainingKeys[0])}`);
    }

    await handleSave(updatedFiles);
  };

  // Open device folder and populate virtual file system
  const handleOpenLocalFolder = async () => {
    try {
      // 1. Check for modern File System Access API
      if ('showDirectoryPicker' in window) {
        const dirHandle = await (window as any).showDirectoryPicker();
        const loadedFiles: Record<string, string> = {};
        
        async function readDir(handle: any, currentPath: string = "") {
          for await (const entry of handle.values()) {
            if (entry.kind === 'file') {
              const file = await entry.getFile();
              const text = await file.text();
              const relativePath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
              // Avoid loading heavy node_modules or binary files
              if (!relativePath.includes('node_modules') && !relativePath.includes('.git') && file.size < 500000) {
                loadedFiles[relativePath] = text;
              }
            } else if (entry.kind === 'directory') {
              if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '.next') {
                await readDir(entry, currentPath ? `${currentPath}/${entry.name}` : entry.name);
              }
            }
          }
        }
        
        await readDir(dirHandle);
        if (Object.keys(loadedFiles).length > 0) {
          const updatedFiles = { ...files, ...loadedFiles };
          setFiles(updatedFiles);
          const firstKey = Object.keys(loadedFiles)[0];
          setActiveFileKey(firstKey);
          setActiveContent(loadedFiles[firstKey]);
          await handleSave(updatedFiles);
          toast.success(`Successfully loaded ${Object.keys(loadedFiles).length} files from folder!`);
          router.refresh();
        } else {
          toast.warning("No readable text files found in folder.");
        }
      } else {
        // 2. Fallback using directory input
        const input = document.createElement('input');
        input.type = 'file';
        (input as any).webkitdirectory = true;
        input.multiple = true;
        
        input.onchange = async (e: any) => {
          const loadedFiles: Record<string, string> = {};
          const fileList = e.target.files;
          if (!fileList) return;
          
          for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            const relativePath = file.webkitRelativePath || file.name;
            if (!relativePath.includes('node_modules') && !relativePath.includes('.git') && file.size < 500000) {
              const text = await file.text();
              const cleanPath = relativePath.substring(relativePath.indexOf('/') + 1);
              loadedFiles[cleanPath] = text;
            }
          }
          
          if (Object.keys(loadedFiles).length > 0) {
            const updatedFiles = { ...files, ...loadedFiles };
            setFiles(updatedFiles);
            const firstKey = Object.keys(loadedFiles)[0];
            setActiveFileKey(firstKey);
            setActiveContent(loadedFiles[firstKey]);
            await handleSave(updatedFiles);
            toast.success(`Successfully loaded ${Object.keys(loadedFiles).length} files from folder!`);
            router.refresh();
          } else {
            toast.warning("No readable files found.");
          }
        };
        input.click();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        toast.error("Failed to read local folder: " + err.message);
      }
    }
  };

  // Support Tab key inside textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = activeContent.substring(0, start) + "  " + activeContent.substring(end);
      setActiveContent(newValue);
      
      // Reset cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full gap-4 animate-in fade-in duration-300">
        <div className="flex-1 flex flex-col gap-4">
           <div className="flex-1 bg-[#090909] rounded-xl border border-white/5 overflow-hidden flex flex-col p-8 space-y-4">
              <SkeletonComponent className="w-1/3 h-5 bg-white/5 rounded-lg" />
              {[1,2,3,4,5].map(i => <SkeletonComponent key={i} className="h-4 bg-white/5 rounded-full w-full" />)}
           </div>
        </div>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[project?.deployStatus || "none"] || STATUS_CONFIG.none;
  const StatusIcon = statusCfg.icon;

  return (
    <div className="flex h-screen w-full bg-[#1e1e1e] text-[#cccccc] font-sans overflow-hidden">
      {/* VS Code Left Activity Bar (Vertical strip) */}
      <div className="w-12 bg-[#18181c] border-r border-[#333333] flex flex-col items-center py-4 justify-between flex-shrink-0">
        <div className="flex flex-col items-center gap-5 w-full">
          {/* Explorer Tab Button */}
          <button 
            onClick={() => setActiveTab('editor')}
            className={`p-2 rounded-lg transition-all ${activeTab === 'editor' ? 'text-white bg-[#37373d]' : 'text-[#858585] hover:text-[#cccccc]'}`}
            title="File Explorer"
          >
            <FileCode size={20} />
          </button>
          
          {/* Deploy Center Tab Button */}
          <button 
            onClick={() => setActiveTab('deploy')}
            className={`p-2 rounded-lg transition-all ${activeTab === 'deploy' ? 'text-white bg-[#37373d]' : 'text-[#858585] hover:text-[#cccccc]'}`}
            title="Deploy Pipeline"
          >
            <Rocket size={20} />
          </button>
        </div>

        {/* Back Button */}
        <button 
          onClick={() => router.push('/dashboard/projects')}
          className="p-2 text-[#858585] hover:text-white transition-all"
          title="Back to Dashboard"
        >
          <Folder size={20} />
        </button>
      </div>

      {activeTab === 'editor' ? (
        <>
          {/* VS Code Left Sidebar (Explorer) */}
          <div className="w-64 border-r border-[#333333] flex flex-col flex-shrink-0 bg-[#1e1e1e]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#333333]">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-[#cccccc]">Explorer</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowAddModal(true)} className="text-[#858585] hover:text-[#cccccc] transition-colors" title="New File">
                  <Plus size={14} />
                </button>
                <button onClick={handleOpenLocalFolder} className="text-[#858585] hover:text-[#cccccc] transition-colors" title="Open Local Folder">
                  <Folder size={14} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {Object.keys(files).sort().map(filePath => {
                const isActive = activeFileKey === filePath;
                return (
                  <div 
                    key={filePath}
                    onClick={() => {
                      setActiveFileKey(filePath);
                      setActiveContent(files[filePath]);
                      router.push(`/dashboard/projects/${id}?file=${encodeURIComponent(filePath)}`);
                    }}
                    className={`flex items-center justify-between px-4 py-1.5 cursor-pointer text-[13px] group ${isActive ? 'bg-[#37373d] text-white' : 'text-[#cccccc] hover:bg-[#2a2d2e]'}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode size={14} className={isActive ? 'text-[#519aba]' : 'text-[#858585]'} />
                      <span className="truncate">{filePath}</span>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteFile(filePath, e)}
                      className={`text-[#858585] hover:text-[#f48771] ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
                      title="Delete File"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Editor & Terminal Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
            {/* Editor Tabs Header */}
            <div className="h-9 flex bg-[#252526]">
              <div className="flex items-center bg-[#1e1e1e] border-r border-[#333333] px-4 border-t-2 border-t-[#007acc] min-w-[120px]">
                <FileCode size={14} className="text-[#519aba] mr-2" />
                <span className="text-[13px] text-white">{activeFileKey || "App.tsx"}</span>
                {saving && <Loader2 size={12} className="animate-spin text-[#858585] ml-2" />}
              </div>
              {/* Action buttons on the right */}
              <div className="flex-1 flex items-center justify-end px-4 gap-4 border-b border-[#333333]">
                 <button onClick={() => handleSave()} disabled={saving} className="text-[11px] uppercase tracking-wider font-semibold text-[#cccccc] hover:text-white transition-colors flex items-center gap-1.5"><Save size={12}/> Save</button>
                 <button onClick={handleRunCode} disabled={running} className="text-[11px] uppercase tracking-wider font-semibold text-[#4CAF50] hover:text-[#81C784] transition-colors flex items-center gap-1.5">
                   {running ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />} Run
                 </button>
                 <a 
                   href={`/api/projects/${id}/preview`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-[11px] uppercase tracking-wider font-semibold text-[#007acc] hover:text-[#3399ff] transition-colors flex items-center gap-1.5"
                 >
                   <Eye size={12} /> Preview
                 </a>
                 <button onClick={() => router.push(`/dashboard/projects`)} className="text-[11px] uppercase tracking-wider font-semibold text-[#858585] hover:text-white transition-colors flex items-center gap-1.5">Dashboard</button>
              </div>
            </div>

            {/* Code Textarea Area */}
            <div className="flex-1 flex overflow-hidden relative bg-[#1e1e1e]">
               <div className="py-4 text-[#858585] select-none pr-4 border-r border-[#333333] space-y-1 font-mono text-[13px] bg-[#1e1e1e] w-12 text-right tabular-nums">
                 {Array.from({ length: Math.max(1, activeContent.split('\n').length) }, (_, i) => (
                   <div key={i}>{(i + 1)}</div>
                 ))}
               </div>
               <div className="flex-1 relative">
                 <textarea 
                   value={activeContent}
                   onChange={(e) => setActiveContent(e.target.value)}
                   onKeyDown={handleKeyDown}
                   spellCheck={false}
                   className="absolute inset-0 w-full h-full p-4 bg-transparent text-[#d4d4d4] font-mono text-[13px] leading-relaxed resize-none outline-none focus:ring-0 z-10 whitespace-pre"
                 />
               </div>
            </div>

            {/* Integrated Terminal (Bottom Panel) */}
            <div className="h-56 border-t border-[#333333] bg-[#1e1e1e] flex flex-col">
              <div className="flex items-center px-4 h-9 border-b border-[#333333] bg-[#252526]">
                <span className="text-[11px] font-semibold tracking-wide uppercase text-[#cccccc]">Terminal</span>
              </div>
              <div className="flex-1 p-4 overflow-y-auto font-mono text-[13px] space-y-1 bg-[#1e1e1e]">
                {terminalLines.map((line, idx) => (
                  <div key={idx} className={line.includes("Error") || line.includes("stderr") ? "text-[#f48771]" : "text-[#cccccc]"}>{line}</div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Unified Vercel-like Premium Deploy Center */
        <div className="flex-1 bg-[#1e1e1e] p-8 overflow-y-auto space-y-8 animate-in fade-in duration-300">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Deploy Status Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#333333] pb-8">
              <div>
                <h1 className="text-xl font-bold uppercase tracking-wider text-white">Deploy Center</h1>
                <p className="text-neutral-500 text-xs mt-1">Configure continuous integration pipelines and launch live web distribution builds.</p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`/api/projects/${id}/preview`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#007acc]/10 border border-[#007acc]/20 hover:bg-[#007acc]/20 text-[#3399ff] rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                >
                  <Eye size={11} />
                  Sandbox Preview
                </a>

                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusCfg.bg}`}>
                  <StatusIcon size={12} className={`${statusCfg.color} ${statusCfg.pulse ? "animate-spin" : ""}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                </div>
                
                {project?.deployUrl && (
                  <a
                    href={project.deployUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#252526] border border-[#333333] hover:bg-[#37373d] text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    <Globe size={11} />
                    Live URL
                  </a>
                )}
              </div>
            </div>

            {/* Launchpad Grid Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* GitHub Uplink Box */}
              <div className="md:col-span-1 bg-[#252526] border border-[#333333] p-6 rounded-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Github size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">GitHub Uplink</span>
                  </div>
                  {project?.github?.isConnected ? (
                    <div>
                      <h4 className="text-sm font-bold text-white truncate">{project.github.repoName}</h4>
                      <p className="text-[9px] font-mono text-neutral-500 mt-1 flex items-center gap-1">
                        <GitBranch size={10} /> {project.github.deployBranch}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-neutral-500 font-semibold italic">No GitHub repository linked to this project yet.</p>
                  )}
                </div>

                <button 
                  onClick={() => setShowConnectModal(true)}
                  className="mt-6 w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all"
                >
                  {project?.github?.isConnected ? "Sync Settings" : "Connect Repo"}
                </button>
              </div>

              {/* Trigger Deployment Controls */}
              <div className="md:col-span-2 bg-[#252526] border border-[#333333] p-6 rounded-xl flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[#007acc]">Launch Station</span>
                  <h3 className="text-base font-bold text-white uppercase">Production Launchpad</h3>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Compile and publish your active workspace assets instantly to our edge distribution networks. Build steps will pipe logs dynamically in real-time.
                  </p>
                </div>

                <div className="flex flex-col gap-4 mt-6">
                  {/* Pipeline Select Tabs */}
                  <div className="flex items-center bg-[#1e1e1e] p-1 rounded-lg border border-[#333333] w-fit">
                    <button
                      onClick={() => setDeploySource("workspace")}
                      className={`px-4 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${deploySource === "workspace" ? "bg-[#007acc] text-white" : "text-neutral-500 hover:text-white"}`}
                    >
                      Workspace Code
                    </button>
                    <button
                      onClick={() => setDeploySource("github")}
                      className={`px-4 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${deploySource === "github" ? "bg-[#007acc] text-white" : "text-neutral-500 hover:text-white"}`}
                    >
                      GitHub Repo
                    </button>
                    <button
                      onClick={() => setDeploySource("local")}
                      className={`px-4 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${deploySource === "local" ? "bg-[#007acc] text-white" : "text-neutral-500 hover:text-white"}`}
                    >
                      Local System
                    </button>
                  </div>

                  <button
                    onClick={handleDeploy}
                    disabled={deploying || (deploySource === "github" && !project?.github?.isConnected)}
                    className="w-full py-3 bg-[#007acc] hover:bg-[#0062a3] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {deploying ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Rocket size={14} />
                    )}
                    {deploying ? "Deploying Pipeline..." : `Deploy ${deploySource === 'workspace' ? 'Workspace' : deploySource === 'github' ? 'GitHub' : 'Local'} Code`}
                  </button>
                </div>
              </div>
            </div>

            {/* Build output live terminal logs */}
            <div className="bg-[#252526] border border-[#333333] rounded-xl overflow-hidden shadow-lg flex flex-col">
              <div className="px-6 py-4 border-b border-[#333333] bg-[#1e1e1e] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={13} className="text-neutral-500" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Live Console Output</span>
                </div>
                {deploying && (
                  <span className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-cyan-400 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    Edge logs active
                  </span>
                )}
              </div>

              <div className="h-96 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed bg-[#1e1e1e] space-y-1">
                {deployTerminalLines.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-neutral-600">
                    <Terminal size={24} className="opacity-25" />
                    <p className="font-bold uppercase tracking-widest text-[9px] italic">Awaiting secure pipeline deployment signals...</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {deployTerminalLines.map((line, i) => (
                      <div key={i} className="flex gap-4 hover:bg-white/[0.01] px-2 py-0.5 rounded transition-all">
                        <span className="text-neutral-700 select-none font-bold tabular-nums">
                          [{i + 1}]
                        </span>
                        <span className="text-[#cccccc] flex-1 font-semibold">
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connect GitHub Uplink Modal */}
      <AnimatePresence>
        {showConnectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setShowConnectModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-[#0a0a0a] border border-white/10 w-full max-w-sm rounded-xl p-6 space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-1">
                <h3 className="text-base font-black text-white uppercase">Connect Repository</h3>
                <p className="text-neutral-500 text-[10px] font-semibold uppercase tracking-wider">Link your active project source control configurations.</p>
              </div>

              <form onSubmit={handleConnect} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest px-1">GitHub Repo URL</label>
                  <input
                    required
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={repoUrl}
                    onChange={e => setRepoUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white placeholder:text-neutral-700 focus:outline-none focus:border-white/20 transition-all font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest px-1">Deploy Branch</label>
                    <input
                      type="text"
                      value={deployBranch}
                      onChange={e => setDeployBranch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-white/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest px-1">Build Command</label>
                    <input
                      type="text"
                      value={buildCommand}
                      onChange={e => setBuildCommand(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-white/20 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowConnectModal(false)}
                    className="flex-1 py-3 border border-white/5 rounded-lg text-[9px] font-bold uppercase tracking-wider text-neutral-500 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={connecting || !repoUrl.trim()}
                    className="flex-1 py-3 bg-[#007acc] text-white font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 disabled:opacity-40 transition-all rounded-lg"
                  >
                    {connecting ? <Loader2 size={12} className="animate-spin" /> : <Link2 size={12} />}
                    {connecting ? "Linking..." : "Connect"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add File Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setShowAddModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-[#0a0a0a] border border-white/10 w-full max-w-sm rounded-xl p-6 space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-1">
                <h3 className="text-base font-black text-white uppercase">Add New File</h3>
                <p className="text-neutral-500 text-[10px] font-semibold uppercase tracking-wider">Create a virtual source file inside this project.</p>
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest px-1">File Name / Path</label>
                <input 
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white outline-none focus:border-white/20 font-mono"
                  placeholder="e.g. src/utils.js"
                  value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddFile()}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-white/5 text-neutral-500 rounded-lg font-bold text-[9px] uppercase tracking-wider">Cancel</button>
                <button onClick={handleAddFile} className="flex-1 py-2.5 bg-white text-black rounded-lg font-bold text-[9px] uppercase tracking-wider hover:bg-neutral-200">Create</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
