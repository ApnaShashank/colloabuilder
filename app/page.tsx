"use client";

import React from "react";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Benefits from "@/components/landing/Benefits";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="bg-[#000000] min-h-screen overflow-x-hidden selection:bg-primary selection:text-black">
      <Hero />
      <Features />
      <Benefits />
      <Footer />
    </main>
  );
}
