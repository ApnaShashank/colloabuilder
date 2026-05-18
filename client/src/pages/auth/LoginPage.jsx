import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Mail01Icon, 
  AccessIcon, 
  ArrowRight01Icon, 
  ViewIcon, 
  ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate/Call login API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Connection failed. Please check your network." }));
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      
      // Direct navigation as requested
      navigate("/dashboard");
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111110] flex items-center justify-center p-4 font-body">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#6366f1]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-[#0e0e0e] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10">
        
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#111] to-[#0a0a0a] border-r border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#6366f1] rounded-xl flex items-center justify-center text-white font-black text-xl">C</div>
              <span className="text-white font-black text-xl tracking-tighter uppercase italic group-hover:text-[#6366f1] transition-colors">colloabuilder</span>
            </Link>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-5xl font-headline font-black text-white italic leading-tight uppercase">
              Welcome Back to<br />
              <span className="text-[#6366f1]">Engineering</span> Excellence
            </h2>
            <p className="text-slate-500 text-sm max-w-md font-medium leading-relaxed">
              Log in to access your projects, collaborate with your team, and continue your journey in the art of building.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
            <span>Cloud Sync Enabled</span>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <span>Secure Access</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-black/40">
          <div className="mb-10 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center text-white font-black text-lg">C</div>
              <span className="text-white font-black text-lg tracking-tighter uppercase italic">colloabuilder</span>
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Member Login</h1>
            <p className="text-slate-500 text-sm">Don't have an account? <Link to="/signup" className="text-[#6366f1] font-bold hover:underline">Create one</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HugeiconsIcon icon={Mail01Icon} size={18} className="text-slate-600 group-focus-within:text-[#f5c518] transition-colors" />
                </div>
                <input 
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-[#f5c518]/50 focus:bg-white/[0.05] transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-black text-[#f5c518] uppercase tracking-widest hover:underline">Forgot password?</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HugeiconsIcon icon={AccessIcon} size={18} className="text-slate-600 group-focus-within:text-[#f5c518] transition-colors" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white text-sm focus:outline-none focus:border-[#f5c518]/50 focus:bg-white/[0.05] transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 hover:text-white transition-colors"
                >
                  <HugeiconsIcon icon={showPassword ? ViewOffSlashIcon : ViewIcon} size={18} />
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#6366f1] hover:bg-[#5457e5] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(99,102,241,0.2)] flex items-center justify-center gap-3 group mt-4 uppercase italic text-xs tracking-widest"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/5 space-y-6 text-center">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">By logging in, you agree to our Terms and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
