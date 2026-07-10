"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { HsHubMouseAura } from "@/components/hs-hub-mouse-aura"
import { ScrollytellingSection } from "@/components/scrollytelling-section"

const TOTAL_FRAMES = 240

export default function Home() {
  const [frames, setFrames] = useState<HTMLImageElement[]>([])
  const [isReady, setIsReady] = useState(false)

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
            <a href="#sequence" onClick={handleNavClick} className="flex items-center gap-2 group select-none">
              <span className="w-6 h-6 rounded bg-gradient-to-tr from-[var(--yieldsage)] to-[var(--polymarket)] flex items-center justify-center text-[10px] font-bold font-mono text-black">
                HS
              </span>
              <span className="text-sm font-semibold tracking-wider font-sans text-white/90">
                HS <span className="text-white/40">Hub</span>
              </span>
            </a>

            {/* Anchors */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: "YieldSage", href: "#yieldsage-section" },
                { label: "HollowScan", href: "#hollowscan-section" },
                { label: "Polymarket Trading", href: "#polymarket-section" },
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
                  Mantle Network
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
                Autonomous yield routing,
                <br />
                backed by on-chain proofs.
              </h2>
              <p className="text-white/60 font-sans text-sm sm:text-base leading-relaxed font-light">
                YieldSage monitors DeFi metrics across the Mantle ecosystem continuously. It automatically ranks allocations by risk-adjusted return indices, allowing you to maximize capitals efficiently without manual tracing.
              </p>
              
              <div className="flex flex-col gap-3 max-w-md bg-white/2 border border-white/5 rounded-xl p-5 backdrop-blur-sm">
                <h4 className="text-xs font-mono text-[var(--yieldsage)] tracking-wider uppercase font-semibold">
                  Mantle Explorer Integration
                </h4>
                <p className="text-xs text-white/45 leading-relaxed font-light">
                  Every decision index is automatically written to the Mantle ledger, providing complete tracking and public validation for over 4,000+ verified transaction entries.
                </p>
              </div>

              <div>
                <a
                  href="https://yield.hollowscan.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-8 py-3.5 bg-[var(--yieldsage)] text-black text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-[var(--yieldsage)]/80 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all duration-300"
                >
                  Visit YieldSage Website
                </a>
              </div>
            </div>

            {/* Metrics Visual */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/2 border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-40 hover:border-[var(--yieldsage)]/20 transition-all">
                <span className="text-xs font-sans tracking-wider text-white/40 uppercase">Verified Transactions</span>
                <span className="text-4xl font-serif text-white tracking-tight">4,000+</span>
                <span className="text-[10px] font-mono text-[var(--yieldsage)] tracking-widest uppercase">Mantle Ledger logged</span>
              </div>

              <div className="bg-white/2 border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-40 hover:border-[var(--yieldsage)]/20 transition-all">
                <span className="text-xs font-sans tracking-wider text-white/40 uppercase">Average Yield Return</span>
                <span className="text-4xl font-serif text-white tracking-tight">18.2% APY</span>
                <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Stable-coin optimized</span>
              </div>

              <div className="bg-white/2 border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-40 hover:border-[var(--yieldsage)]/20 transition-all">
                <span className="text-xs font-sans tracking-wider text-white/40 uppercase">Capital Monitored</span>
                <span className="text-4xl font-serif text-white tracking-tight">$12.4M+</span>
                <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Across 12 major protocols</span>
              </div>

              <div className="bg-white/2 border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-40 hover:border-[var(--yieldsage)]/20 transition-all">
                <span className="text-xs font-sans tracking-wider text-white/40 uppercase">Risk Evaluation Speed</span>
                <span className="text-4xl font-serif text-white tracking-tight">Real-Time</span>
                <span className="text-[10px] font-mono text-[var(--yieldsage)] tracking-widest uppercase">5-Min Re-balancing loop</span>
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
            {/* Visual Screenshot Placeholder */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative aspect-video w-full rounded-2xl border border-white/5 bg-gradient-to-b from-white/3 to-transparent p-1 flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
                <div className="w-full h-full border border-white/5 rounded-xl bg-black/60 flex flex-col items-center justify-center p-6 text-center select-none">
                  {/* Hologram Scanner Visual */}
                  <div className="w-16 h-16 rounded-full border border-[var(--hollowscan)]/30 flex items-center justify-center mb-4 relative">
                    <div className="absolute inset-2 bg-[var(--hollowscan)]/10 rounded-full animate-ping" />
                    <svg className="w-6 h-6 text-[var(--hollowscan)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 13.5h.008v.008h-.008V13.5zm0 3h.008v.008h-.008V16.5zm0 3h.008v.008h-.008V19.5zM13.5 16.5h.008v.008h-.008V16.5zm0 3h.008v.008h-.008V19.5zm3-3h.008v.008h-.008V16.5zm-6 0h.008v.008h-.008V16.5zm0 3h.008v.008h-.008V19.5zm-3-3h.008v.008h-.008V16.5zm0 3h.008v.008h-.008V19.5zm6-6h.008v.008h-.008V13.5zm-3-3h.008v.008h-.008V10.5zm3 0h.008v.008h-.008V10.5zm-6 0h.008v.008h-.008V10.5zm-3 0h.008v.008h-.008V10.5z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-sans font-semibold text-white/95 uppercase tracking-[0.2em] mb-1">
                    Mobile Interface Preview
                  </h4>
                  <p className="text-xs text-white/40 max-w-sm mb-4 font-light leading-relaxed">
                    [Placeholdered: HollowScan mobile search radar layout. Drop live app screens / scan dashboard asset here.]
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-white/50">
                      iOS App Store
                    </span>
                    <span className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-white/50">
                      Google Play Store
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy Content */}
            <div className="lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] px-3 py-1 bg-[var(--hollowscan)]/10 text-[var(--hollowscan)] rounded-full">
                  Retail Arbitrage
                </span>
                <span className="text-white/20 text-xs">|</span>
                <span className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em]">
                  Deal Scanning
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
                Instantly scan deals,
                <br />
                uncover hidden margins.
              </h2>
              <p className="text-white/60 font-sans text-sm sm:text-base leading-relaxed font-light">
                HollowScan is a specialized mobile utility designed for retail barcode scanning. By checking product identifiers against live index markets in real time, it identifies pricing arbitrage margins instantly.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-sans font-bold text-white/80">Sub-second Scanning</span>
                  <span className="text-xs text-white/45 font-light leading-relaxed">
                    Instantly matches barcode queries with database values to provide immediate valuation metrics.
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-sans font-bold text-white/80">Arbitrage Analytics</span>
                  <span className="text-xs text-white/45 font-light leading-relaxed">
                    Calculates local platform fees, shipping weights, and target pricing differences instantly.
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="https://www.hollowscan.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-8 py-3.5 bg-[var(--hollowscan)] text-white text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-[var(--hollowscan)]/80 hover:shadow-[0_0_30px_rgba(255,85,0,0.3)] transition-all duration-300"
                >
                  Visit HollowScan Website
                </a>
              </div>
            </div>
          </div>

          {/* Subtle Glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--hollowscan)]/3 rounded-full blur-[150px] pointer-events-none" />
        </section>

        {/* Section 3: Polymarket Trading */}
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
                  Market Analytics
                </span>
                <span className="text-white/20 text-xs">|</span>
                <span className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em]">
                  Prediction Intelligence
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
                Data-driven positions.
                <br />
                Prediction analysis.
              </h2>
              <p className="text-white/60 font-sans text-sm sm:text-base leading-relaxed font-light">
                Trade prediction markets with the upper hand. Polymarket Trading monitors and analyzes order books, traces smart wallet addresses, and updates market sentiment trackers in real time.
              </p>

              <div className="flex flex-col gap-3 max-w-md bg-white/2 border border-white/5 rounded-xl p-5 backdrop-blur-sm">
                <h4 className="text-xs font-mono text-[var(--polymarket)] tracking-wider uppercase font-semibold">
                  Smart Contract Data Tracking
                </h4>
                <p className="text-xs text-white/45 leading-relaxed font-light">
                  Query and filter active contract positions, wallet volume spikes, and order spreads. Build prediction models backed by structured data.
                </p>
              </div>

              <div>
                <a
                  href="https://pmkt.bcinvestments.one"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-8 py-3.5 bg-[var(--polymarket)] text-white text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-[var(--polymarket)]/80 hover:shadow-[0_0_30px_rgba(0,85,255,0.3)] transition-all duration-300"
                >
                  Visit Polymarket Tools
                </a>
              </div>
            </div>

            {/* Visual Chart Mock */}
            <div className="lg:col-span-6">
              <div className="border border-white/5 rounded-2xl p-6 bg-gradient-to-b from-white/3 to-transparent backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase">Live Market Sentiment query</span>
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

                <div className="mt-6 border-t border-white/5 pt-4 text-center">
                  <p className="text-[10px] font-sans font-light text-white/35">
                    [Placeholdered: Live market analytics graph. Drop chart visual asset here.]
                  </p>
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
                Centralized workspace portal unifying DeFi yield models, retail arbitrage trackers, and market prediction analytics.
              </p>
              <div className="flex gap-4 mt-2">
                {/* Social icons links placeholders */}
                <span className="text-[10px] font-mono text-white/20">X.com</span>
                <span className="text-[10px] font-mono text-white/20">Discord</span>
                <span className="text-[10px] font-mono text-white/20">GitHub</span>
              </div>
            </div>

            {/* Links Column 1 */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-semibold">Products</span>
              <a href="https://yield.hollowscan.com" target="_blank" rel="noreferrer" className="text-xs text-white/60 hover:text-[var(--yieldsage)] transition-colors">
                YieldSage DeFi
              </a>
              <a href="https://www.hollowscan.com" target="_blank" rel="noreferrer" className="text-xs text-white/60 hover:text-[var(--hollowscan)] transition-colors">
                HollowScan Scanner
              </a>
              <a href="https://pmkt.bcinvestments.one" target="_blank" rel="noreferrer" className="text-xs text-white/60 hover:text-[var(--polymarket)] transition-colors">
                Polymarket Analytics
              </a>
            </div>

            {/* Links Column 2 */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-semibold">Contact</span>
              <span className="text-xs text-white/40 font-light">info@bcinvestments.one</span>
              <span className="text-xs text-white/40 font-light">BC Investments LLC</span>
            </div>
          </div>

          <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row justify-between text-[10px] text-white/20">
            <span>© 2026 BC Investments. All rights reserved.</span>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <span>Privacy Policy</span>
              <span>Terms of Use</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
