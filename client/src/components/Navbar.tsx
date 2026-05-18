import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  ArrowRight, 
  Zap
} from "lucide-react";

// Placeholder for useUser
const useUser = () => ({ user: null });

const navLinks = [
  { label: "Practice", href: "/dashboard/practice" },
  { label: "Teams",    href: "/dashboard/teams" },
  { label: "Careers",  href: "/dashboard/careers" },
  { label: "Portfolio",href: "/dashboard/portfolio" },
];

export default function Navbar() {
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[60] py-6 px-6 sm:px-10"
      >
        <div className={`max-w-[1600px] mx-auto transition-all duration-500 relative ${
          scrolled 
            ? "bg-[#080808]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
            : "bg-white/[0.02] backdrop-blur-xl border border-white/[0.05]"
        } rounded-[2rem] overflow-hidden`}>
          
          {/* Internal Content Wrapper */}
          <div className="flex items-center justify-between px-6 sm:px-10 py-4 relative">
            
            {/* ── Left: Large Brand Logo ── */}
            <Link to="/" className="flex items-center gap-4 group flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 relative flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <img 
                  src="https://ik.imagekit.io/DEMOPROJECT/colloabuilder.png" 
                  alt="Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
            </Link>

            {/* ── Center: Website Name (Bina Box Ke) ── */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link to="/" className="group">
                <h1 className="font-headline font-black text-2xl sm:text-3xl text-white tracking-tighter italic leading-none transition-all duration-300 group-hover:tracking-normal">
                  Colloa<span className="text-primary italic">builder</span>
                </h1>
              </Link>
            </div>

            {/* ── Right: Auth / CTAs ── */}
            <div className="flex items-center justify-end gap-3 flex-1">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard" className="hidden sm:block">
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors">
                      Account
                    </button>
                  </Link>
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2 border border-white/10 group/btn"
                    >
                      Dashboard
                      <Zap size={14} className="group-hover:rotate-12 transition-transform" />
                    </motion.button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link to="/signup">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white hover:bg-neutral-200 text-black px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center gap-2 group/get"
                    >
                      Start Building
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/[0.03] border border-white/[0.06] rounded-xl text-white hover:bg-white/[0.06] transition-all"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* ── The Hanging Line ── */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto opacity-50" />
        </div>
      </motion.nav>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[55] bg-[#080808]/90 lg:hidden flex flex-col pt-32 px-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] group hover:border-primary/40 transition-all"
                  >
                    <span className="text-2xl font-headline font-black text-white uppercase tracking-tight italic">
                      {link.label}
                    </span>
                    <ArrowRight size={20} className="text-neutral-700 group-hover:text-primary transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
