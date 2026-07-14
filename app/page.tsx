"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Image from "next/image"
import { LoadingScreen } from "@/components/loading-screen"
import { HsHubMouseAura } from "@/components/hs-hub-mouse-aura"
import { ScrollytellingSection } from "@/components/scrollytelling-section"

const TOTAL_FRAMES = 240

export default function Home() {
  const [frames, setFrames] = useState<HTMLImageElement[]>([])
  const [isReady, setIsReady] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Triggers once the loading screen completes preloading all 240 frames
  const handleLoadComplete = useCallback((loadedFrames: HTMLImageElement[]) => {
    setFrames(loadedFrames)
    setIsReady(true)
  }, [])

  // Navigation handlers
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute("href")
    if (!href) return
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Button hover functions to avoid inline handler parsing issues
  const handleLaunchHoverEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    el.style.background = "rgba(0,255,136,0.08)"
    el.style.borderColor = "rgba(0,255,136,0.6)"
    el.style.boxShadow = "0 0 20px rgba(0,255,136,0.2)"
  }
  const handleLaunchHoverLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    el.style.background = "transparent"
    el.style.borderColor = "rgba(0,255,136,0.25)"
    el.style.boxShadow = "none"
  }

  return (
    <>
      {/* Loading Screen - preloads first 40 frames */}
      {!isReady && <LoadingScreen onComplete={handleLoadComplete} />}

      {/* Multi-brand mouse aurora — fixed behind all content */}
      <HsHubMouseAura />

      {/* Main Container - visible after initial preload */}
      <main
        id="sequence"
        style={{
          opacity: isReady ? 1 : 0,
          transition: "opacity 0.8s ease",
          background: "#050505",
          minHeight: "100vh",
        }}
      >
        {/* Floating premium sticky header (Navbar) */}
        <header className="fixed top-0 left-0 w-full z-40" style={{ isolation: "isolate" }}>
          <div
            className="absolute inset-x-0 top-0 h-[100px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 80px at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
            style={{
              background: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 80%, transparent 100%)",
            }}
          />

          <div
            className="flex items-center justify-between px-6 md:px-12 py-5"
            style={{
              background: "linear-gradient(to bottom, rgba(5,5,5,0.8) 0%, rgba(5,5,5,0.3) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2 group select-none">
              <Image
                src="/logo.png"
                alt="HS Hub Logo"
                width={24}
                height={24}
                className="object-contain transition-transform duration-300 group-hover:scale-110"
                priority
              />
              <span className="text-sm font-semibold tracking-wider font-sans text-white/90">
                HS <span className="text-white/40">Hub</span>
              </span>
            </div>

            {/* Anchors */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: "YieldSage", href: "#yieldsage-section" },
                { label: "HollowScan", href: "#hollowscan-section" },
                { label: "Polymarket Bot", href: "#polymarket-section" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={handleNavClick}
                  className="text-xs text-white/40 hover:text-white/80 transition-colors tracking-wide font-sans font-medium relative group py-1 select-none"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-white/40 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            <a
              href="#yieldsage-section"
              onClick={handleNavClick}
              onMouseEnter={handleLaunchHoverEnter}
              onMouseLeave={handleLaunchHoverLeave}
              className="text-[11px] font-sans font-semibold tracking-wider uppercase px-5 py-2.5 rounded-full border transition-all select-none"
              style={{
                borderColor: "rgba(0,255,136,0.25)",
                color: "rgba(0,255,136,0.9)",
              }}
            >
              Enter Hub
            </a>
          </div>
        </header>

        {/* Cinematic Scrollytelling Section */}
        <ScrollytellingSection
          frames={frames}
        />

        {/* -------------------- BELOW FOLD DETAILED SECTIONS -------------------- */}

        {/* Section 1: YieldSage */}
        <section
          id="yieldsage-section"
          className="relative min-h-screen py-32 px-6 md:px-12 flex flex-col justify-center overflow-hidden border-t border-white/5"
          style={{
            background: "radial-gradient(ellipse 60% 600px at 50% 100%, rgba(0,255,136,0.03), transparent)",
          }}
        >
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Description Card */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] px-3 py-1 bg-[var(--yieldsage)]/10 text-[var(--yieldsage)] rounded-full">
                  Defi intelligence
                </span>
                <span className="text-white/20 text-xs">|</span>
                <span className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em]">
                  AI Yield Farming Agent
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
                Autonomous yield routing,
                <br />
                backed by on-chain proofs.
              </h2>
              <p className="text-white/60 font-sans text-sm sm:text-base leading-relaxed font-light">
                YieldSage monitors DeFi metrics continuously. It automatically ranks allocations by risk-adjusted return indices, allowing you to maximize capitals efficiently without manual tracing.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 my-2">
                {[
                  {
                    title: "Hourly Live Monitoring",
                    desc: "Tracks live APY & TVL across every major DeFi protocol, refreshed hourly."
                  },
                  {
                    title: "Multi-Tier Risk Scores",
                    desc: "Scores every pool by risk tier: stable, moderate, aggressive."
                  },
                  {
                    title: "24/7 Telegram Alerts",
                    desc: "Delivers AI-ranked picks + alerts via Telegram bot, 24/7."
                  },
                  {
                    title: "Risk-Free Paper Trading",
                    desc: "Paper trade any pool with real-time APY accrual before risking real funds."
                  },
                  {
                    title: "On-Chain Verification",
                    desc: "Anchors every AI recommendation on-chain for public verification."
                  },
                  {
                    title: "Continuous AI Research",
                    desc: "AI agent works round the clock researching best yield opportunities."
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <span className="text-[var(--yieldsage)] font-bold text-xs shrink-0 mt-0.5">↘︎</span>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs font-semibold text-white/90">{item.title}</h4>
                      <p className="text-[11px] text-white/45 leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2">
                <a
                  href="https://yield.hollowscan.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-8 py-3.5 bg-[var(--yieldsage)] text-black text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-[var(--yieldsage)]/80 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all duration-300"
                >
                  Visit Website
                </a>
                <a
                  href="http://t.me/YieldSageBot"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/5 border border-white/10 text-white/90 text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <span>💬 Chat with AI Agent</span>
                </a>
              </div>
            </div>

            {/* Video Demo */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              {/* Player shell */}
              <div
                className="relative w-full rounded-2xl overflow-hidden border border-white/8 group"
                style={{
                  background: "linear-gradient(135deg, rgba(0,255,136,0.04) 0%, rgba(0,0,0,0) 60%)",
                  boxShadow: "0 0 60px rgba(0,255,136,0.06), 0 24px 64px rgba(0,0,0,0.6)",
                  aspectRatio: "16/9",
                }}
              >
                {/* Actual video */}
                <video
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isVideoPlaying ? "opacity-100" : "opacity-0"}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onPlaying={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                >
                  <source src="/videos/yieldsage-demo.mp4" type="video/mp4" />
                </video>

                {/* Placeholder overlay — hidden once video loads and plays */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#050505] transition-opacity duration-700 ${isVideoPlaying ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                  {/* Animated ring + play button */}
                  <div className="relative flex items-center justify-center">
                    {/* Outer pulse rings */}
                    <div className="absolute w-24 h-24 rounded-full border border-[var(--yieldsage)]/20 animate-ping" style={{ animationDuration: "2.5s" }} />
                    <div className="absolute w-20 h-20 rounded-full border border-[var(--yieldsage)]/30 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.4s" }} />
                    {/* Play button circle */}
                    <div
                      className="relative w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: "radial-gradient(circle, rgba(0,255,136,0.15) 0%, rgba(0,255,136,0.04) 100%)", border: "1.5px solid rgba(0,255,136,0.35)" }}
                    >
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[var(--yieldsage)] ml-0.5" style={{ filter: "drop-shadow(0 0 8px rgba(0,255,136,0.6))" }}>
                        <path d="M8 5.14v14l11-7-11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-mono text-[var(--yieldsage)] tracking-widest uppercase opacity-70">Demo video loading...</span>
                    <span className="text-[10px] font-sans text-white/25 tracking-wide">YieldSage · Autonomous Yield Routing</span>
                  </div>

                  {/* Scan-line overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 3px)", backgroundSize: "100% 4px" }}
                  />

                  {/* Corner accents */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[var(--yieldsage)]/40" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[var(--yieldsage)]/40" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[var(--yieldsage)]/40" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[var(--yieldsage)]/40" />
                </div>
              </div>

              {/* Caption row */}
              <div className="flex justify-end px-1">
                <span className="text-[10px] font-mono text-[var(--yieldsage)]/50 tracking-wider">yield.hollowscan.com</span>
              </div>
            </div>

          </div>
          
          {/* Subtle Glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--yieldsage)]/5 rounded-full blur-[150px] pointer-events-none" />
        </section>

        {/* Section 2: HollowScan */}
        <section
          id="hollowscan-section"
          className="relative min-h-screen py-32 px-6 md:px-12 flex flex-col justify-center overflow-hidden border-t border-white/5 bg-[#050505]"
          style={{
            background: "radial-gradient(ellipse 60% 600px at 50% 0%, rgba(255,85,0,0.03), transparent)",
          }}
        >
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

            {/* ── Realistic Phone Mockup ── */}
            <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center w-full">
              {/* Outer phone shell */}
              <div className="relative w-[230px] rounded-[40px] border-[6px] border-white/15 bg-[#0a0a0a] shadow-[0_0_60px_rgba(255,85,0,0.15),0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden"
                style={{ aspectRatio: "9/19.5" }}>

                {/* Dynamic Island / notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-black z-40 flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full border border-white/10" />
                </div>

                {/* Screen content */}
                <div className="w-full h-full bg-white flex flex-col overflow-hidden">

                  {/* Status bar */}
                  <div className="flex justify-between items-center px-4 pt-8 pb-1 bg-white">
                    <span className="text-[7px] font-bold text-black">7:51</span>
                    <div className="flex items-center gap-0.5">
                      <span className="text-[6px] text-black/60">4G+</span>
                      <svg viewBox="0 0 16 12" className="w-3 h-2.5 fill-black/80"><rect x="0" y="4" width="3" height="8" rx="0.5"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="0.5"/><rect x="9" y="1" width="3" height="11" rx="0.5"/><rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.3"/></svg>
                      <svg viewBox="0 0 22 12" className="w-4 h-2.5"><rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke="black" strokeWidth="1" fill="none"/><rect x="2" y="2" width="12" height="8" rx="1.5" fill="black"/><path d="M19.5 4v4a2 2 0 000-4z" fill="black" opacity="0.4"/></svg>
                    </div>
                  </div>

                  {/* Search bar + icons row */}
                  <div className="flex items-center gap-1.5 px-2 pb-1.5 bg-white">
                    {/* App icon — HollowScan logo SVG */}
                    <div className="w-6 h-6 shrink-0">
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <defs>
                          {/* Outer ring gradient: blue → purple */}
                          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6bb5ff" />
                            <stop offset="100%" stopColor="#8b45ff" />
                          </linearGradient>
                          {/* Icon bracket gradient: blue top → purple bottom */}
                          <linearGradient id="bracket-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6bb5ff" />
                            <stop offset="100%" stopColor="#8b45ff" />
                          </linearGradient>
                          {/* Glow filter for the eye */}
                          <filter id="eye-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                          </filter>
                          {/* Glow for pupil */}
                          <filter id="pupil-glow" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                          </filter>
                          {/* Clip to circle */}
                          <clipPath id="circle-clip">
                            <circle cx="50" cy="50" r="44" />
                          </clipPath>
                        </defs>

                        {/* Dark navy background */}
                        <circle cx="50" cy="50" r="50" fill="#0d0f1e" />

                        {/* Gradient ring border */}
                        <circle cx="50" cy="50" r="46" fill="none" stroke="url(#ring-grad)" strokeWidth="3.5" />

                        {/* Inner content clipped to circle */}
                        <g clipPath="url(#circle-clip)">

                          {/* ── QR bracket corners (top-left) ── */}
                          {/* Top-left bracket */}
                          <path d="M22 22 L22 36 L26 36 L26 26 L36 26 L36 22 Z" fill="url(#bracket-grad)" />
                          {/* Top-left inner teeth */}
                          <rect x="29" y="22" width="2.5" height="10" fill="url(#bracket-grad)" opacity="0.7" />
                          <rect x="33" y="22" width="2.5" height="7" fill="url(#bracket-grad)" opacity="0.5" />

                          {/* ── Top-right bracket ── */}
                          <path d="M78 22 L78 36 L74 36 L74 26 L64 26 L64 22 Z" fill="url(#bracket-grad)" />
                          {/* Top-right inner teeth */}
                          <rect x="68.5" y="22" width="2.5" height="10" fill="url(#bracket-grad)" opacity="0.7" />
                          <rect x="64" y="22" width="2.5" height="7" fill="url(#bracket-grad)" opacity="0.5" />

                          {/* ── Bottom-left bracket ── */}
                          <path d="M22 78 L22 64 L26 64 L26 74 L36 74 L36 78 Z" fill="url(#bracket-grad)" />
                          {/* Bottom-left inner teeth */}
                          <rect x="29" y="68" width="2.5" height="10" fill="url(#bracket-grad)" opacity="0.7" />
                          <rect x="33" y="71" width="2.5" height="7" fill="url(#bracket-grad)" opacity="0.5" />

                          {/* ── Bottom-right bracket ── */}
                          <path d="M78 78 L78 64 L74 64 L74 74 L64 74 L64 78 Z" fill="url(#bracket-grad)" />
                          {/* Bottom-right inner teeth */}
                          <rect x="68.5" y="68" width="2.5" height="10" fill="url(#bracket-grad)" opacity="0.7" />
                          <rect x="64" y="71" width="2.5" height="7" fill="url(#bracket-grad)" opacity="0.5" />

                          {/* ── Central vertical scan bars (barcode lines) ── */}
                          <rect x="47.5" y="20" width="5" height="18" fill="#5a9ef5" opacity="0.55" />
                          <rect x="45" y="20" width="2" height="14" fill="#5a9ef5" opacity="0.3" />
                          <rect x="53" y="20" width="2" height="14" fill="#5a9ef5" opacity="0.3" />
                          {/* Bottom bars */}
                          <rect x="47.5" y="62" width="5" height="18" fill="#8b45ff" opacity="0.55" />
                          <rect x="45" y="66" width="2" height="14" fill="#8b45ff" opacity="0.3" />
                          <rect x="53" y="66" width="2" height="14" fill="#8b45ff" opacity="0.3" />

                          {/* ── Eye shape (lens) ── */}
                          <ellipse cx="50" cy="50" rx="18" ry="10" fill="#05071a" stroke="url(#bracket-grad)" strokeWidth="1.5" filter="url(#eye-glow)" />

                          {/* Eye corner points */}
                          <polygon points="32,50 38,45 38,55" fill="#0d0f1e" />
                          <polygon points="68,50 62,45 62,55" fill="#0d0f1e" />

                          {/* Eye highlight lines */}
                          <line x1="32" y1="50" x2="22" y2="50" stroke="#6bb5ff" strokeWidth="1" opacity="0.5" />
                          <line x1="68" y1="50" x2="78" y2="50" stroke="#8b45ff" strokeWidth="1" opacity="0.5" />

                          {/* ── Pupil ── */}
                          <circle cx="50" cy="50" r="7" fill="#0a0d20" filter="url(#pupil-glow)" />
                          {/* Iris ring */}
                          <circle cx="50" cy="50" r="6" fill="none" stroke="#6bb5ff" strokeWidth="1" opacity="0.6" />
                          {/* Glowing pupil core */}
                          <circle cx="50" cy="50" r="4" fill="#c8e8ff" opacity="0.95" filter="url(#pupil-glow)" />
                          {/* Highlight dot */}
                          <circle cx="48.5" cy="48.5" r="1.5" fill="white" opacity="0.9" />
                        </g>
                      </svg>
                    </div>

                    {/* GO pill + search box */}
                    <div className="flex flex-1 items-center rounded-xl border border-gray-200 bg-gray-50 overflow-hidden h-6">
                      <span className="bg-[#4c8cff] text-white text-[6px] font-bold px-1.5 py-0.5 h-full flex items-center">GO</span>
                      <span className="text-[6px] text-gray-400 px-1.5">Search products...</span>
                    </div>
                    {/* Crown icon */}
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <span className="text-[8px]">👑</span>
                    </div>
                  </div>

                  {/* Region tabs */}
                  <div className="flex items-center gap-1 px-2 pb-1.5 bg-white">
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-gray-100 border border-gray-200">
                      <img src="https://flagcdn.com/16x12/us.png" alt="US" className="w-3 h-2 object-cover rounded-sm" />
                      <span className="text-[6px] font-semibold text-gray-500">US</span>
                    </div>
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-blue-50 border border-blue-400">
                      <img src="https://flagcdn.com/16x12/gb.png" alt="UK" className="w-3 h-2 object-cover rounded-sm" />
                      <span className="text-[6px] font-bold text-blue-600">UK</span>
                    </div>
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-gray-100 border border-gray-200">
                      <img src="https://flagcdn.com/16x12/ca.png" alt="CA" className="w-3 h-2 object-cover rounded-sm" />
                      <span className="text-[6px] font-semibold text-gray-500">CA</span>
                    </div>
                    <div className="ml-auto flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-gray-100 border border-gray-200">
                      <span className="text-[6px]">⚡</span>
                      <span className="text-[6px] text-gray-500">All Categories</span>
                      <span className="text-[5px] text-gray-400">▼</span>
                    </div>
                  </div>

                  {/* Announcement ticker */}
                  <div className="flex items-center gap-1.5 bg-amber-50 border-y border-amber-100 py-1 overflow-hidden shrink-0">
                    <span className="text-[8px] shrink-0 pl-2">📢</span>
                    <div className="overflow-hidden flex-1">
                      <div className="animate-ticker flex gap-8 whitespace-nowrap">
                        <span className="text-[6px] text-amber-800 font-medium">🔥 Want more TCG deals before they sell out? Visit thetcgspecialist.co.uk — London&apos;s most trusted Pokémon card shop! DON&apos;T MISS OUT. 😉</span>
                        <span className="text-[6px] text-amber-800 font-medium">👀 Want to understand the full HollowScan rewards ecosystem? Explore the Rewards Matrix at retail.hollowscan.com/whitepaper. Don&apos;t sleep on it.</span>
                        {/* Duplicate for seamless loop */}
                        <span className="text-[6px] text-amber-800 font-medium">🔥 Want more TCG deals before they sell out? Visit thetcgspecialist.co.uk — London&apos;s most trusted Pokémon card shop! DON&apos;T MISS OUT. 😉</span>
                        <span className="text-[6px] text-amber-800 font-medium">👀 Want to understand the full HollowScan rewards ecosystem? Explore the Rewards Matrix at retail.hollowscan.com/whitepaper. Don&apos;t sleep on it.</span>
                    </div>
                  </div>
                </div>
                {/* Product listings — continuous vertical scroll feed */}
                  <div className="flex-1 overflow-hidden bg-gray-50 relative">
                    {/* The inner strip is doubled so it loops seamlessly */}
                    <div className="animate-feed-scroll flex flex-col">
                      {/* ── First copy ── */}
                      {[
                        {
                          img: "/products/panini_prizm_wc.png",
                          name: "26 Panini Prizm World Cup Soccer Exclusive Trading Cards Value Box",
                          price: "$34.97",
                          flagCode: "us",
                          flagAlt: "US",
                          store: "Walmart",
                          time: "2h ago",
                          liked: false,
                        },
                        {
                          img: "/products/mega_greninja_ex.png",
                          name: "Pokémon TCG Mega Greninja ex Premium Collection",
                          price: "CA$69.98",
                          flagCode: "ca",
                          flagAlt: "CA",
                          store: "Pokémon Center",
                          time: "45m ago",
                          liked: false,
                        },
                        {
                          img: "/products/perfect_order_box.png",
                          name: "Pokémon Mega Evolution Perfect Order Trading Card Game Booster Box",
                          price: "$169.99",
                          flagCode: "us",
                          flagAlt: "US",
                          store: "TCGPlayer",
                          time: "1h ago",
                          liked: true,
                        },
                        {
                          img: "/products/panini_prizm_wc.png",
                          name: "26 Panini Prizm World Cup Soccer Exclusive Trading Cards Value Box",
                          price: "$34.97",
                          flagCode: "us",
                          flagAlt: "US",
                          store: "Target",
                          time: "3h ago",
                          liked: false,
                        },
                        {
                          img: "/products/trainers_toolkit.png",
                          name: "Pokémon Trainer's Toolkit 2022",
                          price: "£59.99",
                          flagCode: "gb",
                          flagAlt: "UK",
                          store: "Chaos Cards",
                          time: "1h ago",
                          liked: false,
                        },
                        // ── Duplicate for seamless loop ──
                        {
                          img: "/products/panini_prizm_wc.png",
                          name: "26 Panini Prizm World Cup Soccer Exclusive Trading Cards Value Box",
                          price: "$34.97",
                          flagCode: "us",
                          flagAlt: "US",
                          store: "Walmart",
                          time: "2h ago",
                          liked: false,
                        },
                        {
                          img: "/products/mega_greninja_ex.png",
                          name: "Pokémon TCG Mega Greninja ex Premium Collection",
                          price: "CA$69.98",
                          flagCode: "ca",
                          flagAlt: "CA",
                          store: "Pokémon Center",
                          time: "45m ago",
                          liked: false,
                        },
                        {
                          img: "/products/perfect_order_box.png",
                          name: "Pokémon Mega Evolution Perfect Order Trading Card Game Booster Box",
                          price: "$169.99",
                          flagCode: "us",
                          flagAlt: "US",
                          store: "TCGPlayer",
                          time: "1h ago",
                          liked: true,
                        },
                        {
                          img: "/products/panini_prizm_wc.png",
                          name: "26 Panini Prizm World Cup Soccer Exclusive Trading Cards Value Box",
                          price: "$34.97",
                          flagCode: "us",
                          flagAlt: "US",
                          store: "Target",
                          time: "3h ago",
                          liked: false,
                        },
                        {
                          img: "/products/trainers_toolkit.png",
                          name: "Pokémon Trainer's Toolkit 2022",
                          price: "£59.99",
                          flagCode: "gb",
                          flagAlt: "UK",
                          store: "Chaos Cards",
                          time: "1h ago",
                          liked: false,
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="mx-2 my-1 bg-white rounded-xl shadow-sm border border-gray-100 flex gap-2 p-2 shrink-0"
                        >
                          {/* Product image */}
                          <div className="w-14 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Text content */}
                          <div className="flex flex-col justify-between flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-1">
                              <p className="text-[6px] font-bold text-gray-900 leading-tight line-clamp-3">{item.name}</p>
                              <div className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                                <span className={`text-[7px] ${item.liked ? "text-[#e0194a]" : "text-gray-400"}`}>{item.liked ? "♥" : "♡"}</span>
                              </div>
                            </div>
                            <p className="text-[7.5px] font-bold text-gray-900 mt-0.5">Buy: {item.price}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`https://flagcdn.com/16x12/${item.flagCode}.png`}
                                alt={item.flagAlt}
                                className="w-3 h-2 object-cover rounded-sm shrink-0"
                              />
                              <span className="text-[5.5px] bg-gray-100 text-gray-500 px-1 py-0.5 rounded-md font-medium">{item.store}</span>
                              <span className="text-[5.5px] text-gray-400">{item.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>


                  {/* Bottom nav bar */}
                  <div className="bg-white border-t border-gray-100 flex justify-around items-center pt-1.5 pb-3 shrink-0">
                    {[
                      { icon: "🏠", label: "Home", active: true },
                      { icon: "❤️", label: "Saved", active: false },
                      { icon: "🔔", label: "Alerts", active: false },
                      { icon: "👤", label: "Profile", active: false },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col items-center gap-0.5">
                        <span className="text-[10px]">{item.icon}</span>
                        <span className={`text-[5px] font-medium ${item.active ? "text-[#4c8cff]" : "text-gray-400"}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>

                </div>{/* end screen */}
              </div>{/* end phone shell */}
            </div>

            {/* ── Copy Content ── */}
            <div className="lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] px-3 py-1 bg-[var(--hollowscan)]/10 text-[var(--hollowscan)] rounded-full">
                  Retail Arbitrage
                </span>
                <span className="text-white/20 text-xs">|</span>
                <span className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em]">
                  TCG &amp; Collectibles
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
                Find deals before
                <br />
                everyone else does.
              </h2>
              <p className="text-white/60 font-sans text-sm sm:text-base leading-relaxed font-light">
                HollowScan monitors hundreds of stores across the US, UK, and Canada in real time — surfacing underpriced Pokémon cards, collectibles, and TCG products the moment they drop. Get instant alerts, see live buy prices and resell margins, and never miss a flip opportunity again.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-sans font-bold text-white/80">Live Price Alerts</span>
                  <span className="text-xs text-white/45 font-light leading-relaxed">
                    Get notified the instant underpriced stock appears across US, UK, and CA stores — before it sells out.
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-sans font-bold text-white/80">Instant Margin View</span>
                  <span className="text-xs text-white/45 font-light leading-relaxed">
                    See buy price, resell value, and profit margin at a glance — no spreadsheets, no guesswork.
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <a
                  href="/ios"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-semibold rounded-full hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300"
                >
                  <span>🍎</span> App Store
                </a>
                <a
                  href="/android"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--hollowscan)] text-white text-xs font-semibold rounded-full hover:bg-[var(--hollowscan)]/80 hover:shadow-[0_0_30px_rgba(255,85,0,0.3)] transition-all duration-300"
                >
                  <span>▶</span> Google Play
                </a>
                <a
                  href="https://retail.hollowscan.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors duration-300 underline underline-offset-4 decoration-white/20 hover:decoration-white/50 pt-1"
                >
                  Visit website →
                </a>
              </div>

            </div>
          </div>

          {/* Subtle Glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--hollowscan)]/3 rounded-full blur-[150px] pointer-events-none" />
        </section>

        {/* Section 3: Polymarket Bot */}
        <section
          id="polymarket-section"
          className="relative min-h-screen py-32 px-6 md:px-12 flex flex-col justify-center overflow-hidden border-t border-white/5"
          style={{
            background: "radial-gradient(ellipse 60% 600px at 50% 100%, rgba(0,85,255,0.03), transparent)",
          }}
        >
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Copy Content */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] px-3 py-1 bg-[var(--polymarket)]/10 text-[var(--polymarket)] rounded-full">
                  Trading Bot
                </span>
                <span className="text-white/20 text-xs">|</span>
                <span className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em]">
                  Autonomous Execution
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
                Automated trading.
                <br />
                Prediction execution.
              </h2>
              <p className="text-white/60 font-sans text-sm sm:text-base leading-relaxed font-light">
                Trade prediction markets autonomously. The Polymarket Trading Bot monitors order books, traces smart wallet volume spikes, and executes positions instantly based on live sentiment metrics.
              </p>

              <div className="flex flex-col gap-3 max-w-md bg-white/2 border border-white/5 rounded-xl p-5 backdrop-blur-sm">
                <h4 className="text-xs font-mono text-[var(--polymarket)] tracking-wider uppercase font-semibold">
                  Autonomous Execution Engine
                </h4>
                <p className="text-xs text-white/45 leading-relaxed font-light">
                  Execute prediction orders, track dynamic spreads, and re-balance market exposure. Deploy a fully automated strategy backed by real-time contract inputs.
                </p>
              </div>

              <div>
                <a
                  href="https://pmkt.hollowscan.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-8 py-3.5 bg-[var(--polymarket)] text-white text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-[var(--polymarket)]/80 hover:shadow-[0_0_30px_rgba(0,85,255,0.3)] transition-all duration-300"
                >
                  Access Polymarket Bot
                </a>
              </div>
            </div>

            {/* Visual Chart Mock */}
            <div className="lg:col-span-6">
              <div className="border border-white/5 rounded-2xl p-6 bg-gradient-to-b from-white/3 to-transparent backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase">Live Bot Execution telemetry</span>
                  <span className="w-2 h-2 rounded-full bg-[var(--polymarket)] animate-pulse" />
                </div>
                
                {/* Visual Chart Blocks */}
                <div className="flex flex-col gap-3">
                  <div className="bg-white/2 border border-white/5 rounded-lg p-3 flex justify-between items-center text-xs">
                    <span className="font-mono text-white/60">Target Market Index</span>
                    <span className="font-bold text-white/90 font-serif">$1.24M Vol</span>
                  </div>
                  <div className="bg-white/2 border border-white/5 rounded-lg p-3 flex justify-between items-center text-xs">
                    <span className="font-mono text-white/60">Sentiment Shift Rate</span>
                    <span className="font-bold text-[var(--polymarket)] font-serif">+14.2% / Hr</span>
                  </div>
                  <div className="bg-white/2 border border-white/5 rounded-lg p-3 flex justify-between items-center text-xs">
                    <span className="font-mono text-white/60">Active Smart Wallet Spikes</span>
                    <span className="font-bold text-white/95 font-serif">18 Address Marks</span>
                  </div>
                </div>

                {/* Live Bot Execution Telemetry Graph */}
                <div className="mt-6 border-t border-white/5 pt-5 relative">
                  <div className="flex justify-between items-center text-[9px] font-mono text-white/40 mb-3">
                    <span>Performance Matrix</span>
                    <span className="text-[var(--polymarket)] font-bold">Drawdown 0.82%</span>
                  </div>

                  {/* SVG Line Graph Mockup */}
                  <div className="relative w-full h-32 bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-end">
                    {/* SVG Chart paths */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      
                      {/* Area Gradient */}
                      <defs>
                        <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--polymarket)" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="var(--polymarket)" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M0,80 Q15,60 30,70 T60,40 T90,20 T100,25 L100,100 L0,100 Z" 
                        fill="url(#chart-glow)" 
                      />
                      
                      {/* Main Trend Line */}
                      <path 
                        d="M0,80 Q15,60 30,70 T60,40 T90,20 T100,25" 
                        fill="none" 
                        stroke="var(--polymarket)" 
                        strokeWidth="1.5" 
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: 200,
                          strokeDashoffset: 0,
                          animation: "draw-chart 4s ease-in-out infinite"
                        }}
                      />
                    </svg>

                    {/* Telemetry LED Node */}
                    <div 
                      className="absolute w-2 h-2 rounded-full bg-[var(--polymarket)] animate-ping"
                      style={{ left: "90%", bottom: "75%" }}
                    />
                    <div 
                      className="absolute w-1.5 h-1.5 rounded-full bg-[var(--polymarket)]"
                      style={{ left: "90%", bottom: "75%" }}
                    />

                    {/* Chart Labels */}
                    <div className="absolute top-2.5 left-2.5 text-[8px] font-mono text-white/30 flex flex-col gap-0.5">
                      <span>96.2% Confidence</span>
                      <span>Execution Speed: 84ms</span>
                    </div>
                  </div>

                  {/* Live Transaction Ledger */}
                  <div className="mt-4 flex flex-col gap-1.5 font-mono text-[8px] text-white/45 text-left">
                    <div className="flex justify-between items-center p-2 bg-white/2 border border-white/5 rounded-md">
                      <span className="text-emerald-400">● EXEC YES @ $0.61</span>
                      <span className="text-white/30">12s ago</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/2 border border-white/5 rounded-md">
                      <span className="text-emerald-400">● EXEC NO @ $0.39</span>
                      <span className="text-white/30">45s ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle Glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--polymarket)]/3 rounded-full blur-[150px] pointer-events-none" />
        </section>

        {/* -------------------- BRAND FOOTER -------------------- */}

        <footer className="border-t border-white/5 bg-[#030303] py-16 px-6 md:px-12 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {/* Branding Column */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <span className="text-base font-semibold font-sans text-white tracking-wide">
                HS <span className="text-white/40">Hub</span>
              </span>
              <p className="text-xs text-white/40 font-light max-w-sm leading-relaxed">
                Centralized workspace portal unifying DeFi yield models, retail arbitrage trackers, and a market prediction trading bot.
              </p>

            </div>

            {/* Links Column 1 */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-semibold">Products</span>
              <a href="https://yield.hollowscan.com" target="_blank" rel="noreferrer" className="text-xs text-white/60 hover:text-[var(--yieldsage)] transition-colors">
                YieldSage DeFi
              </a>
              <a href="https://retail.hollowscan.com" target="_blank" rel="noreferrer" className="text-xs text-white/60 hover:text-[var(--hollowscan)] transition-colors">
                HollowScan Scanner
              </a>
              <a href="https://pmkt.hollowscan.com" target="_blank" rel="noreferrer" className="text-xs text-white/60 hover:text-[var(--polymarket)] transition-colors">
                Polymarket Trading Bot
              </a>
            </div>

            {/* Links Column 2 */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-semibold">Contact</span>
              <a href="mailto:support@hollowscan.com" className="text-xs text-white/40 hover:text-white/60 transition-colors font-light">support@hollowscan.com</a>
            </div>
          </div>

          <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row justify-between text-[10px] text-white/20">
            <span>© 2026 HollowScan. All rights reserved.</span>
          </div>
        </footer>
      </main>
    </>
  )
}
