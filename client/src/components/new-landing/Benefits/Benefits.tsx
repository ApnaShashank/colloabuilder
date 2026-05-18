import React, { useEffect, useRef, useState } from "react";
import "./benefits.scss";

// ── useInView ─────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Comparison table data ─────────────────────────────────────────────────────
const TABLE_ROWS = [
  { feature: "Coding Practice (DSA)",      us: true,  leet: true,  gh: false },
  { feature: "Team Collaboration",         us: true,  leet: false, gh: true  },
  { feature: "Project Workspaces",         us: true,  leet: false, gh: true  },
  { feature: "Auto-Verified Portfolio",    us: true,  leet: false, gh: false },
  { feature: "Recruitment Connection",     us: true,  leet: true,  gh: false },
  { feature: "Beginner Friendly",          us: true,  leet: false, gh: false },
  { feature: "Learning + Building",        us: true,  leet: false, gh: false },
];

// ── Animated bar chart data ───────────────────────────────────────────────────
const CHART_BARS = [
  { label: "Jan", val: 42 },
  { label: "Feb", val: 67 },
  { label: "Mar", val: 55 },
  { label: "Apr", val: 88 },
  { label: "May", val: 72 },
  { label: "Jun", val: 95 },
];

const BENEFITS_LIST = [
  "Real-time cost visualisation and resource usage tracking",
  "Anomaly detection system to alert on unexpected cost spikes",
  "AI-driven optimisation engine for server-side cost reduction",
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Benefits() {
  const [infraRef, infraVis]   = useInView();
  const [tableRef, tableVis]   = useInView();
  const [ctaRef,   ctaVis]     = useInView();
  const [barsAnim, setBarsAnim] = useState(false);

  useEffect(() => {
    if (infraVis) setTimeout(() => setBarsAnim(true), 300);
  }, [infraVis]);

  return (
    <section className="benefits">

      {/* ── Infrastructure Card ──────────────────────────────────────── */}
      <div
        ref={infraRef}
        className={`benefits__infra ${infraVis ? "is-visible" : ""}`}
      >
        {/* Left text */}
        <div className="infra__text">
          <div className="infra__badge">
            <span className="badge-dot badge-dot--green" />
            CORE MODULE 03
          </div>
          <h2 className="infra__heading">
            Infrastructure.<br />
            Cost. <span className="infra__heading--accent">Optimized.</span>
          </h2>
          <p className="infra__body">
            Stop flying blind on cloud spending. Monitor real-time usage, detect
            costly spikes, and use AI to optimise your infrastructure for maximum
            efficiency.
          </p>
          <ul className="infra__bullets">
            {BENEFITS_LIST.map((b, i) => (
              <li key={i} style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
                <span className="bullet-check">✓</span>
                {b}
              </li>
            ))}
          </ul>
          <button className="infra__cta">ANALYZE COST FIRST →</button>
        </div>

        {/* Right: chart mockup */}
        <div className="infra__visual">
          <div className="chart-window">
            <div className="chart-titlebar">
              <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
              <span className="chart-title">Resource Usage · Jun 2026</span>
              <span className="chart-badge chart-badge--up">▲ 12%</span>
            </div>
            <div className="chart-body">
              {/* Sparkline area */}
              <div className="chart-area">
                <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="chart-svg">
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#f5c518" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#f5c518" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,60 C30,55 50,20 80,30 S130,50 160,25 S220,10 260,18 L300,15 L300,80 L0,80Z"
                    fill="url(#lineGrad)"
                    className={`chart-fill ${barsAnim ? "chart-fill--animate" : ""}`}
                  />
                  <path
                    d="M0,60 C30,55 50,20 80,30 S130,50 160,25 S220,10 260,18 L300,15"
                    fill="none"
                    stroke="#f5c518"
                    strokeWidth="1.8"
                    className={`chart-line ${barsAnim ? "chart-line--animate" : ""}`}
                  />
                  {/* Spike marker */}
                  <circle cx="235" cy="14" r="4" fill="#ef4444" className="spike-dot" />
                  <line x1="235" y1="14" x2="235" y2="80" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.5" />
                </svg>
                <div className="spike-tooltip">⚠ Cost spike detected</div>
              </div>

              {/* Bar chart */}
              <div className="chart-bars">
                {CHART_BARS.map((b, i) => (
                  <div className="bar-col" key={b.label}>
                    <div
                      className={`bar-fill ${barsAnim ? "bar-fill--animate" : ""}`}
                      style={{
                        height: barsAnim ? `${b.val}%` : '0%',
                        animationDelay: `${i * 0.08}s`,
                      } as React.CSSProperties}
                    />
                    <span className="bar-label">{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div className="chart-stats">
                <div className="chart-stat">
                  <span className="chart-stat__val">$2,840</span>
                  <span className="chart-stat__label">Monthly Spend</span>
                </div>
                <div className="chart-stat">
                  <span className="chart-stat__val chart-stat__val--green">−18%</span>
                  <span className="chart-stat__label">AI Savings</span>
                </div>
                <div className="chart-stat">
                  <span className="chart-stat__val chart-stat__val--red">3</span>
                  <span className="chart-stat__label">Spikes Found</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Synergy / Comparison Table ───────────────────────────────── */}
      <div
        ref={tableRef}
        className={`benefits__synergy ${tableVis ? "is-visible" : ""}`}
      >
        <div className="synergy__header">
          <p className="synergy__eyebrow">THE UNFAIR EDGE</p>
          <h2 className="synergy__title">Complete synergy.</h2>
          <p className="synergy__sub">
            Neither LeetCode nor GitHub was built for student teams. Colloabuilder is the
            bridge that connects learning with professional output.
          </p>
        </div>

        <div className="synergy__table-wrap">
          <table className="synergy__table">
            <thead>
              <tr>
                <th className="col-feature">PLATFORM EDGE</th>
                <th className="col-us">
                  <span className="col-us__label">COLLOABUILDER</span>
                  <span className="col-us__crown">👑</span>
                </th>
                <th className="col-other">LEETCODE</th>
                <th className="col-other">GITHUB</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row, i) => (
                <tr
                  key={row.feature}
                  className="table-row"
                  style={{ animationDelay: tableVis ? `${i * 0.07}s` : "0s" }}
                >
                  <td className="td-feature">{row.feature}</td>
                  <td className="td-us">
                    {row.us
                      ? <span className="check check--us">✓</span>
                      : <span className="dash">—</span>}
                  </td>
                  <td className="td-other">
                    {row.leet
                      ? <span className="check check--other">○</span>
                      : <span className="dash">—</span>}
                  </td>
                  <td className="td-other">
                    {row.gh
                      ? <span className="check check--other">○</span>
                      : <span className="dash">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <div
        ref={ctaRef}
        className={`benefits__cta-banner ${ctaVis ? "is-visible" : ""}`}
      >
        {/* Decorative grid */}
        <div className="cta-grid-bg" aria-hidden="true">
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className="cta-grid-cell" />
          ))}
        </div>

        {/* Glow orbs */}
        <div className="cta-orb cta-orb--1" />
        <div className="cta-orb cta-orb--2" />

        <div className="cta-banner__inner">
          <div className="cta-banner__icon">
            <span>C</span>
          </div>
          <h2 className="cta-banner__heading">
            Stop building in isolation.<br />
            Start building <span className="cta-banner__heading--accent">together.</span>
          </h2>
          <p className="cta-banner__sub">
            Join 12,000+ developers already shipping real products as a team.
          </p>
          <div className="cta-banner__actions">
            <button className="cta-banner__btn cta-banner__btn--primary">
              Join Colloabuilder Today →
            </button>
            <button className="cta-banner__btn cta-banner__btn--ghost">
              View Live Projects
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}
