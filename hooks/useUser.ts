"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  role?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  level?: number;
  xp?: number;
  skills?: string[];
  onboarded?: boolean;
  isAdmin?: boolean;
  skillLevel?: string;
  interests?: string[];
  techStack?: string[];
  goal?: string;
  github?: {
    accessToken?: string;
    username?: string;
    avatarUrl?: string;
    profileUrl?: string;
    isConnected?: boolean;
  };
  notifications?: {
    teamAlerts: boolean;
    projectSync: boolean;
    badgeMastery: boolean;
    securityPulse: boolean;
  };
  privacyPrefs?: {
    discovery: boolean;
    liveStream: boolean;
    eliteBadge: boolean;
  };
  createdAt?: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        
        if (!res.ok) {
          if (isMounted) setLoading(false);
          return;
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
           if (isMounted) setLoading(false);
           return;
        }

        const data = await res.json();
        if (isMounted) {
          setUser(data.user);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        if (isMounted) setLoading(false);
      }
    }

    fetchUser();
    return () => { isMounted = false; };
  }, [router]);

  return { user, loading };
}
