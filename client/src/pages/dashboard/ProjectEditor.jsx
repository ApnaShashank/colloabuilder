import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, Play, Code, Eye, FileCode, Hash, Type, ArrowLeft, RefreshCw, Smartphone, Monitor, Layout, Maximize2, Rocket } from "lucide-react";
import { toast } from "sonner";
import projectService from "../../api/services/projectService";
import api from "../../api/axios";
import PageTransition from "../../components/common/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("html");
  const [viewMode, setViewMode] = useState("split"); // split, code, preview
  const [deviceMode, setDeviceMode] = useState("desktop");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [code, setCode] = useState({
    html: "<!-- Write your HTML here -->\n<div class=\"container\">\n  <h1>Hello World</h1>\n  <p>Start building your personal website.</p>\n  <button id=\"btn\">Click Me</button>\n</div>",
    css: "/* Write your CSS here */\n.container {\n  font-family: 'Inter', sans-serif;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n  background: #050505;\n  color: white;\n}\n\nh1 {\n  font-size: 4rem;\n  font-style: italic;\n  text-transform: uppercase;\n  letter-spacing: -0.05em;\n}\n\n#btn {\n  background: #6366f1;\n  border: none;\n  padding: 1rem 2rem;\n  color: white;\n  font-weight: 900;\n  text-transform: uppercase;\n  border-radius: 1rem;\n  cursor: pointer;\n  transition: all 0.3s;\n}\n\n#btn:hover {\n  transform: scale(1.1);\n  box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);\n}",
    js: "// Write your JavaScript here\nconst btn = document.getElementById('btn');\nbtn.addEventListener('click', () => {\n  alert('Website is Interactive!');\n  btn.style.backgroundColor = 'cyan';\n  btn.style.color = 'black';\n});"
  });

  const [srcDoc, setSrcDoc] = useState("");

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updatePreview();
    }, 500);
    return () => clearTimeout(timeout);
  }, [code]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
      if (data.code) setCode(data.code);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updatePreview = () => {
    setSrcDoc(`
      <html>
        <head>
          <style>${code.css}</style>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
        </head>
        <body>
          ${code.html}
          <script>${code.js}</script>
        </body>
      </html>
    `);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/projects/${id}`, { code });
      toast.success("Project saved successfully");
    } catch (err) {
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const [shipping, setShipping] = useState(false);

  const handleShip = async () => {
    setShipping(true);
    try {
      await handleSave();
      const res = await projectService.deploy(id);
      if (res) {
        toast.success("Shipment Initialized!");
        setTimeout(() => {
          navigate(`/dashboard/deploy/${id}`);
        }, 1500);
      }
    } catch (err) {
      // Error handled by axios interceptor toast
    } finally {
      setShipping(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#050505]">
      <RefreshCw className="h-8 w-8 animate-spin text-[#6366f1]" />
    </div>
  );

  return (
    <PageTransition>
      <div className="flex h-screen flex-col bg-[#050505] overflow-hidden">
        {/* Editor Toolbar */}
        <div className="flex h-16 items-center justify-between border-b border-white/5 bg-[#080808] px-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate("/dashboard/projects")}
              className="rounded-xl border border-white/5 bg-white/5 p-2 text-zinc-500 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-sm font-black uppercase tracking-widest text-white italic">
                {project?.name || "Personal Site"}
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6366f1]">Web Engine V1</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mr-4">
              <button 
                onClick={() => setDeviceMode("desktop")}
                className={`p-1.5 rounded-lg transition-all ${deviceMode === "desktop" ? "bg-[#6366f1] text-white" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => setDeviceMode("mobile")}
                className={`p-1.5 rounded-lg transition-all ${deviceMode === "mobile" ? "bg-[#6366f1] text-white" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mr-4">
              <button 
                onClick={() => setViewMode("code")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "code" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Code className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => setViewMode("split")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "split" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Layout className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => setViewMode("preview")}
                className={`p-1.5 rounded-lg transition-all ${viewMode === "preview" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Eye className="h-3.5 w-3.5" />
              </button>
            </div>

            <button 
              onClick={handleShip}
              disabled={shipping || saving}
              className="flex items-center gap-2 rounded-xl bg-white text-black px-5 py-2.5 text-[10px] font-black uppercase tracking-widest italic transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {shipping ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Rocket className="h-3 w-3" />}
              {shipping ? "Shipping..." : "Ship to Cloud"}
            </button>

            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#6366f1] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest italic text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
              {saving ? "Saving..." : "Save Build"}
            </button>
          </div>
        </div>

        {/* Main Editor Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Code Editor */}
          <AnimatePresence>
            {(viewMode === "split" || viewMode === "code") && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: viewMode === "split" ? "50%" : "100%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex flex-col border-r border-white/5 bg-[#080808]"
              >
                {/* File Tabs */}
                <div className="flex border-b border-white/5">
                  {[
                    { id: "html", label: "index.html", icon: FileCode, color: "text-orange-400" },
                    { id: "css", label: "style.css", icon: Hash, color: "text-cyan-400" },
                    { id: "js", label: "script.js", icon: Type, color: "text-amber-400" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                        activeTab === tab.id ? "text-white bg-white/[0.03]" : "text-zinc-600 hover:text-zinc-400"
                      }`}
                    >
                      <tab.icon className={`h-3 w-3 ${tab.color}`} />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div layoutId="editorTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366f1]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Editor Surface */}
                <div className="flex-1 relative overflow-hidden group">
                  <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                    <p className="text-[40px] font-black italic uppercase text-zinc-800 tracking-tighter select-none">
                      {activeTab}
                    </p>
                  </div>
                  <textarea
                    spellCheck={false}
                    className="h-full w-full bg-transparent p-10 font-mono text-sm leading-relaxed text-zinc-300 outline-none resize-none selection:bg-[#6366f1]/30 custom-scrollbar"
                    value={code[activeTab]}
                    onChange={(e) => setCode({ ...code, [activeTab]: e.target.value })}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right: Preview */}
          <AnimatePresence>
            {(viewMode === "split" || viewMode === "preview") && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`flex flex-1 items-center justify-center bg-[#050505] p-10 relative overflow-hidden`}
              >
                {/* Background Grid for Preview */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="preview-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#preview-grid)" />
                  </svg>
                </div>

                <div className={`relative z-10 transition-all duration-500 shadow-2xl rounded-2xl overflow-hidden bg-white ${
                  deviceMode === "mobile" ? "w-[375px] h-[667px]" : "w-full h-full"
                }`}>
                  <iframe
                    title="preview"
                    srcDoc={srcDoc}
                    sandbox="allow-scripts"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    className="bg-white"
                  />
                </div>
                
                {/* Tooltip for View */}
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-zinc-900/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl z-20">
                   <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live Runtime</span>
                   </div>
                   <div className="h-4 w-px bg-white/10" />
                   <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                     {deviceMode === "mobile" ? "375x667" : "Viewport-Max"}
                   </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
