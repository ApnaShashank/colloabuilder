import React from "react";

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 200" 
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="logo-orange-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9B52" />
          <stop offset="50%" stopColor="#FF6A00" />
          <stop offset="100%" stopColor="#B54B00" />
        </linearGradient>
        <linearGradient id="logo-dark-gradient" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B54B00" />
          <stop offset="100%" stopColor="#5E2700" />
        </linearGradient>
        <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background dark hexagon */}
      <path 
        d="M100 15L175 58V142L100 185L25 142V58L100 15Z" 
        fill="url(#logo-dark-gradient)" 
        fillOpacity="0.2"
        stroke="url(#logo-orange-gradient)" 
        strokeWidth="2" 
        strokeOpacity="0.5"
      />
      
      {/* Dynamic interlocking 'C' Shape built with nodes and lines */}
      <path 
        d="M150 70 A 55 55 0 1 0 150 130" 
        stroke="url(#logo-orange-gradient)" 
        strokeWidth="22" 
        strokeLinecap="round"
        filter="url(#glow-effect)"
      />
      <path 
        d="M140 60 A 70 70 0 1 0 140 140" 
        stroke="white" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeDasharray="10 15"
        opacity="0.6"
      />

      {/* Floating tech nodes */}
      <circle cx="150" cy="70" r="10" fill="white" />
      <circle cx="150" cy="130" r="10" fill="white" />
      <circle cx="62" cy="100" r="14" fill="url(#logo-orange-gradient)" />
      
      {/* Inner circuits connecting to the core */}
      <path d="M 62 100 L 100 100 L 120 70" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 100 100 L 120 130" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      
      <circle cx="120" cy="70" r="6" fill="#FF9B52" />
      <circle cx="120" cy="130" r="6" fill="#FF9B52" />
      
      {/* Grid dots in background */}
      <circle cx="100" cy="45" r="2" fill="white" opacity="0.3" />
      <circle cx="100" cy="155" r="2" fill="white" opacity="0.3" />
      <circle cx="50" cy="70" r="2" fill="white" opacity="0.3" />
      <circle cx="50" cy="130" r="2" fill="white" opacity="0.3" />
    </svg>
  );
}
