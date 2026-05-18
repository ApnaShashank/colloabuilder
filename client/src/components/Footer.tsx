import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, GitBranch, Share2, Zap, ArrowRight, MessageSquare } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Practice Arena", href: "/dashboard/practice" },
    { label: "Teams",          href: "/dashboard/teams" },
    { label: "Projects",       href: "/dashboard/projects" },
    { label: "Leaderboard",    href: "/dashboard/leaderboard" },
  ],
  Resources: [
    { label: "Portfolio",  href: "/dashboard/portfolio" },
    { label: "Careers",    href: "/dashboard/careers" },
    { label: "Docs",       href: "#" },
    { label: "Changelog",  href: "#" },
  ],
  Community: [
    { label: "Discord",     href: "#" },
    { label: "GitHub",      href: "#" },
    { label: "Twitter",     href: "#" },
    { label: "Newsletter",  href: "#" },
  ],
};

const socials = [
  { icon: Globe,         href: "#", label: "Website" },
  { icon: GitBranch,     href: "#", label: "GitHub" },
  { icon: Share2,        href: "#", label: "Twitter" },
  { icon: MessageSquare, href: "#", label: "Discord" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#080808] border-t border-white/[0.06] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-14 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 mb-16">
          <div className="col-span-2 md:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-5 w-fit group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center border border-primary/30">
                <Zap size={15} className="text-white fill-white" />
              </div>
              <span className="font-headline font-black text-lg text-white tracking-tight">
                Colloa<span className="text-primary"> builder</span>
              </span>
            </Link>

            <p className="text-neutral-500 text-sm leading-relaxed mb-7 max-w-[300px]">
              A collaborative platform bridging the gap between learning and building — for the students who actually want to create.
            </p>

            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  to={href}
                  title={label}
                  className="w-8 h-8 rounded-lg bg-[#111] border border-white/[0.07] flex items-center justify-center text-neutral-600 hover:text-white hover:border-white/20 transition-all"
                >
                  <Icon size={14} />
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="md:col-span-2 col-span-1">
              <h6 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600 mb-5">
                {section}
              </h6>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-neutral-500 hover:text-neutral-200 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.05] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-700 text-xs">
            © 2025 Colloabuilder. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-neutral-700">
            <Link to="#" className="hover:text-neutral-400 transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-neutral-400 transition-colors">Terms</Link>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 font-semibold tracking-wide">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
