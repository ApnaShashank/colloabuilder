import React, { useRef, useState } from "react";
import "./footer.scss";

const NAV_COLS = [
  {
    heading: "Platform",
    links: ["Practice Arena", "Team Projects", "Leaderboard", "Roadmap"],
  },
  {
    heading: "Resources",
    links: ["Portfolio", "Careers", "Docs", "Changelog"],
  },
  {
    heading: "Community",
    links: ["Discord", "GitHub", "Twitter", "Newsletter"],
  },
];

const SOCIAL = [
  { icon: "𝕏",  label: "Twitter"  },
  { icon: "in", label: "LinkedIn" },
  { icon: "gh", label: "GitHub"   },
  { icon: "dc", label: "Discord"  },
];

const TICKER_ITEMS = [
  "12,000+ Developers",
  "3,400+ Active Teams",
  "8,900+ Projects Shipped",
  "150K+ Problems Solved",
  "Real Engineering. Real Collaboration.",
  "Stop Building in Isolation.",
];

export default function Footer() {
  const [year] = useState(new Date().getFullYear());
  const tickerRef = useRef(null);

  return (
    <footer className="footer">

      {/* ── Ticker tape ───────────────────────────────────────────── */}
      <div className="footer__ticker" aria-hidden="true">
        <div className="ticker__track" ref={tickerRef}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span className="ticker__item" key={i}>
              {item}
              <span className="ticker__sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main footer body ──────────────────────────────────────── */}
      <div className="footer__body">

        {/* Brand column */}
        <div className="footer__brand">
          <div className="brand-logo">
            <span className="brand-logo__mark">C</span>
            <span className="brand-logo__text">colloabuilder</span>
          </div>
          <p className="brand-tagline">
            A collaboration platform bridging the gap between learning and building — for
            developers who actually want to create.
          </p>
          <div className="brand-status">
            <span className="status-dot" />
            All systems operational
          </div>
          <div className="brand-socials">
            {SOCIAL.map((s) => (
              <button className="social-btn" key={s.label} aria-label={s.label}>
                {s.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        <div className="footer__nav">
          {NAV_COLS.map((col) => (
            <div className="footer__nav-col" key={col.heading}>
              <h4 className="nav-col__heading">{col.heading}</h4>
              <ul className="nav-col__links">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="nav-link">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* ── Bottom bar ────────────────────────────────────────────── */}
      <div className="footer__bottom">
        <span className="footer__copy">
          © {year} Colloabuilder. All rights reserved.
        </span>
        <div className="footer__legal">
          <a href="#" className="legal-link">Privacy</a>
          <span className="legal-sep">·</span>
          <a href="#" className="legal-link">Terms</a>
        </div>
        <div className="footer__built">
          <span className="built-dot" />
          <span>Built for engineers, by engineers</span>
        </div>
      </div>

      {/* ── Large watermark text ──────────────────────────────────── */}
      <div className="footer__watermark" aria-hidden="true">
        COLLOA
      </div>

    </footer>
  );
}
