"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { useScroll, useTransform, useSpring, motion, type MotionValue } from "framer-motion"
import { ScrollCanvas } from "@/components/scroll-canvas"

interface ScrollytellingSectionProps {
  frames: HTMLImageElement[]
}

// Flanking Label component: draws 1px horizontal lines from left to right on view
function FlankingLabel({ text, colorClass = "text-white/40" }: { text: string; colorClass?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3.5 text-[11px] tracking-[0.3em] font-sans uppercase font-bold select-none ${colorClass}`}>
      <motion.span
        className="h-[1px] bg-white/20 block origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "32px" }}
      />
      <span>{text}</span>
      <motion.span
        className="h-[1px] bg-white/20 block origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "32px" }}
      />
    </div>
  )
}

// Cinematic overlay component that fades/translates based on custom scroll ranges
function CinematicOverlay({
  active,
  scrollYProgress,
  range,
  position,
  fadeInRange = 0.15,
  fadeOutRange = 0.15,
  children,
}: {
  active: boolean
  scrollYProgress: MotionValue<number>
  range: [number, number]
  position: "bottom-left" | "bottom-right" | "center-bottom" | "center" | "center-top" | "top-center-high"
  fadeInRange?: number
  fadeOutRange?: number
  children: React.ReactNode
}) {
  const start = range[0]
  const end = range[1]
  const duration = end - start

  const fadeInEnd = start + duration * fadeInRange
  const fadeOutStart = end - duration * fadeOutRange

  // Cinematic scroll binding (Enter: opacity 0->1, y 20px->0 | Exit: opacity 1->0, y 0->-10px)
  const opacity = useTransform(
    scrollYProgress,
    [start, fadeInEnd, fadeOutStart, end],
    [0, 1, 1, 0]
  )

  const y = useTransform(
    scrollYProgress,
    [start, fadeInEnd, fadeOutStart, end],
    [20, 0, 0, -10]
  )

  let positionClass = ""
  switch (position) {
    case "bottom-left":
      positionClass = "bottom-24 left-6 md:left-24 text-left items-start"
      break
    case "bottom-right":
      positionClass = "bottom-24 right-6 md:right-24 text-right items-end"
      break
    case "center-bottom":
      positionClass = "bottom-24 left-1/2 -translate-x-1/2 text-center items-center"
      break
    case "center":
      positionClass = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center items-center w-full max-w-4xl px-8"
      break
    case "center-top":
      positionClass = "top-[25%] left-1/2 -translate-x-1/2 text-center items-center w-full max-w-4xl px-8"
      break
    case "top-center-high":
      positionClass = "top-[18%] left-1/2 -translate-x-1/2 text-center items-center w-full max-w-4xl px-8"
      break
  }

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute z-30 pointer-events-none flex flex-col gap-4 max-w-xl md:max-w-2xl select-none ${positionClass}`}
    >
      {active && children}
    </motion.div>
  )
}

// Deterministic seeded PRNG — identical output on server and client to avoid hydration mismatches
function seededRandom(seed: number) {
  let t = (seed + 0x6d2b79f5) | 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

// Pre-compute particle data at module level
const PARTICLE_DATA = [...Array(15)].map((_, i) => ({
  width: (seededRandom(i * 6 + 1) * 1.5 + 0.8).toFixed(3),
  height: (seededRandom(i * 6 + 2) * 1.5 + 0.8).toFixed(3),
  left: (seededRandom(i * 6 + 3) * 100).toFixed(3),
  top: (seededRandom(i * 6 + 4) * 100).toFixed(3),
  duration: (seededRandom(i * 6 + 5) * 12 + 10).toFixed(3),
  delay: (seededRandom(i * 6 + 6) * 10).toFixed(3),
}))

// Particle effect wrapper for floating ambient elements
function AmbientParticles({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -120])
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1.0],
    [0.1, 0.35, 0.35, 0.1]
  )

  return (
    <motion.div style={{ y: yOffset, opacity }} className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {PARTICLE_DATA.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: p.width + "px",
            height: p.height + "px",
            left: p.left + "%",
            top: p.top + "%",
            animation: `float-particle ${p.duration}s linear infinite`,
            animationDelay: `-${p.delay}s`,
          }}
        />
      ))}
    </motion.div>
  )
}

function ScrollIndicator({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.05], [0, 20])
  
  return (
    <motion.div 
      style={{ opacity, y }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 pointer-events-none select-none"
    >
      <div className="text-[9px] font-sans tracking-[0.4em] uppercase text-white/40 font-bold">
        Scroll to Explore
      </div>
      
      {/* Sleek Mouse Shape */}
      <div 
        className="w-[22px] h-[36px] rounded-full border border-white/20 flex justify-center pt-1.5 relative overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0.03) 0%, transparent 100%)",
          backdropFilter: "blur(4px)",
        }}
      >
        <motion.div 
          animate={{ 
            y: [0, 14],
            opacity: [1, 0] 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeOut" 
          }}
          className="w-[3px] h-[6px] rounded-full"
          style={{
            background: "rgba(0,255,136,0.9)",
            boxShadow: "0 0 8px rgba(0,255,136,0.6)",
          }}
        />
      </div>
    </motion.div>
  )
}

export function ScrollytellingSection({
  frames,
}: ScrollytellingSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activePhase, setActivePhase] = useState(1)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Spring-smoothed scroll progress for organic fluid inertia
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.0005,
  })

  // Track active phase
  useEffect(() => {
    const handleProgressChange = (latest: number) => {
      // Determine active narrative phase based on frame segments:
      // Phase 1 (Intro): 0 to 40 frames (~16.6%)
      // Phase 2 (YieldSage): 41 to 100 frames (~41.6%)
      // Phase 3 (HollowScan): 101 to 160 frames (~66.6%)
      // Phase 4 (Polymarket): 161 to 220 frames (~91.6%)
      // Phase 5 (Resolution): 221 to 240 frames (100%)
      let phase = 1
      if (latest < 40 / 240) phase = 1
      else if (latest < 100 / 240) phase = 2
      else if (latest < 160 / 240) phase = 3
      else if (latest < 220 / 240) phase = 4
      else phase = 5

      setActivePhase(phase)
    }

    const unsubscribe = smoothProgress.on("change", handleProgressChange)
    return () => unsubscribe()
  }, [smoothProgress])

  // Framer Motion staggered child variants for text entrance delays
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const staggerItem = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  }

  // Handle CTA button hover animations to avoid inline styles
  const handleGreenHoverEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    el.style.borderColor = "var(--yieldsage)"
    el.style.color = "var(--yieldsage)"
    el.style.boxShadow = "0 0 25px rgba(0,255,136,0.2), inset 0 0 10px rgba(0,255,136,0.05)"
    el.style.background = "rgba(0,255,136,0.02)"
  }
  const handleGreenHoverLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    el.style.borderColor = "rgba(255,255,255,0.2)"
    el.style.color = "rgba(255,255,255,0.95)"
    el.style.boxShadow = "none"
    el.style.background = "transparent"
  }

  const handleOrangeHoverEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    el.style.borderColor = "var(--hollowscan)"
    el.style.color = "var(--hollowscan)"
    el.style.boxShadow = "0 0 25px rgba(255,85,0,0.2), inset 0 0 10px rgba(255,85,0,0.05)"
    el.style.background = "rgba(255,85,0,0.02)"
  }
  const handleOrangeHoverLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    el.style.borderColor = "rgba(255,255,255,0.2)"
    el.style.color = "rgba(255,255,255,0.95)"
    el.style.boxShadow = "none"
    el.style.background = "transparent"
  }

  const handleBlueHoverEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    el.style.borderColor = "var(--polymarket)"
    el.style.color = "var(--polymarket)"
    el.style.boxShadow = "0 0 25px rgba(0,85,255,0.2), inset 0 0 10px rgba(0,85,255,0.05)"
    el.style.background = "rgba(0,85,255,0.02)"
  }
  const handleBlueHoverLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    el.style.borderColor = "rgba(255,255,255,0.2)"
    el.style.color = "rgba(255,255,255,0.95)"
    el.style.boxShadow = "none"
    el.style.background = "transparent"
  }

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: "650vh" }} // Unified scroll volume for single sequence
    >
      {/* Sticky full-screen viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
        
        {/* CRT Scanline grain filter */}
        <div className="absolute inset-0 pointer-events-none z-20 scanlines opacity-[0.04]" />

        {/* Cinematic Vignette overlay */}
        <div className="absolute inset-0 pointer-events-none z-20 vignette" />

        {/* Drifting ambient particles */}
        <AmbientParticles scrollYProgress={smoothProgress} />

        {/* Global Scroll Indicator */}
        <ScrollIndicator scrollYProgress={smoothProgress} />

        {/* Fullscreen Canvas */}
        <div className="absolute inset-0 z-10 w-full h-full">
          <ScrollCanvas
            scrollProgress={smoothProgress}
            frames={frames}
          />
        </div>

        {/* -------------------- NARRATIVE OVERLAYS -------------------- */}

        {/* Phase 1: Cold Open | Frames 1-40 (0% - 16.6%) */}
        <CinematicOverlay
          active={activePhase === 1}
          scrollYProgress={smoothProgress}
          range={[0, 40 / 240]}
          position="bottom-left"
        >
          <FlankingLabel text="Unified Space" />
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white/90 tracking-tight leading-[1.1] font-light mt-1">
            Three tools.
            <br />
            One cohesive workspace.
          </h2>
          <p className="text-xs sm:text-sm font-sans text-white/45 max-w-sm mt-1 leading-relaxed font-light">
            Scroll to step through YieldSage DeFi yield optimizer, HollowScan deal matching, and Polymarket Trading prediction analysis.
          </p>
        </CinematicOverlay>

        {/* Phase 2: YieldSage | Frames 41-100 (17% - 41.6%) */}
        <CinematicOverlay
          active={activePhase === 2}
          scrollYProgress={smoothProgress}
          range={[41 / 240, 100 / 240]}
          position="bottom-left"
        >
          <FlankingLabel text="DeFi Yield Optimization" colorClass="text-[var(--yieldsage)]/60" />
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-3 mt-1">
            <motion.h3 variants={staggerItem} className="text-3xl sm:text-4xl md:text-5xl font-serif text-white/95 leading-tight font-light">
              YieldSage DeFi Intelligence.
            </motion.h3>
            <motion.p variants={staggerItem} className="text-sm font-sans text-white/60 max-w-md leading-relaxed font-light">
              Autonomous DeFi yield intelligence on Mantle Network. Features real-time risk-adjusted models, automatic portfolio scoring, and absolute transparent proof logs with 4,000+ verified transaction records.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-2 pointer-events-auto">
              <a
                href="https://www.yieldsageai.xyz"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={handleGreenHoverEnter}
                onMouseLeave={handleGreenHoverLeave}
                className="inline-block px-6 py-3 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] font-sans border transition-all duration-300"
                style={{
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.95)",
                }}
              >
                Launch YieldSage →
              </a>
            </motion.div>
          </motion.div>
        </CinematicOverlay>

        {/* Phase 3: HollowScan | Frames 101-160 (42% - 66.6%) */}
        <CinematicOverlay
          active={activePhase === 3}
          scrollYProgress={smoothProgress}
          range={[101 / 240, 160 / 240]}
          position="bottom-right"
        >
          <FlankingLabel text="Retail Arbitrage Mobile App" colorClass="text-[var(--hollowscan)]/60" />
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-3 mt-1 text-right items-end">
            <motion.h3 variants={staggerItem} className="text-3xl sm:text-4xl md:text-5xl font-serif text-white/95 leading-tight font-light">
              HollowScan Deal Radar.
            </motion.h3>
            <motion.p variants={staggerItem} className="text-sm font-sans text-white/60 max-w-md leading-relaxed font-light ml-auto">
              Real-time retail barcode arbitrage scanner. Instant price scans across major retailers, live margin calculations, and lightning fast deal alerts. Live on iOS App Store and Google Play.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-2 pointer-events-auto">
              <a
                href="https://www.hollowscan.com"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={handleOrangeHoverEnter}
                onMouseLeave={handleOrangeHoverLeave}
                className="inline-block px-6 py-3 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] font-sans border transition-all duration-300"
                style={{
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.95)",
                }}
              >
                Explore HollowScan →
              </a>
            </motion.div>
          </motion.div>
        </CinematicOverlay>

        {/* Phase 4: Polymarket Trading | Frames 161-220 (67% - 91.6%) */}
        <CinematicOverlay
          active={activePhase === 4}
          scrollYProgress={smoothProgress}
          range={[161 / 240, 220 / 240]}
          position="bottom-left"
        >
          <FlankingLabel text="Prediction Market Analytics" colorClass="text-[var(--polymarket)]/60" />
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-3 mt-1">
            <motion.h3 variants={staggerItem} className="text-3xl sm:text-4xl md:text-5xl font-serif text-white/95 leading-tight font-light">
              Polymarket Trading.
            </motion.h3>
            <motion.p variants={staggerItem} className="text-sm font-sans text-white/60 max-w-md leading-relaxed font-light">
              Premium prediction market analytics dashboard. Track sentiment changes, volume spikes, and smart wallet positions with sub-second accuracy to back your predictions with structured data.
            </motion.p>
            <motion.div variants={staggerItem} className="mt-2 pointer-events-auto">
              <a
                href="https://pmkt.bcinvestments.one"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={handleBlueHoverEnter}
                onMouseLeave={handleBlueHoverLeave}
                className="inline-block px-6 py-3 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] font-sans border transition-all duration-300"
                style={{
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.95)",
                }}
              >
                Access Dashboard →
              </a>
            </motion.div>
          </motion.div>
        </CinematicOverlay>

        {/* Phase 5: Resolution | Frames 221-240 (92% - 100%) */}
        <CinematicOverlay
          active={activePhase === 5}
          scrollYProgress={smoothProgress}
          range={[221 / 240, 1.0]}
          position="center"
          fadeOutRange={0.02}
        >
          <FlankingLabel text="The Workspace" />
          <h2 className="text-4xl sm:text-6xl font-serif text-white/95 leading-tight font-light italic mt-2">
            Integrated Workspace.
          </h2>
          <p className="text-sm sm:text-base font-sans text-white/50 max-w-lg mt-3 leading-relaxed font-light">
            All three assets are now fully synced and connected. Explore the depth of each product in the sections below or choose your path in the navigation.
          </p>
          <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-white/20 to-transparent mt-4" />
        </CinematicOverlay>

        {/* -------------------- DECORATION GLOWS & BORDERS -------------------- */}

        {/* Global Cinematic Top & Bottom shadows */}
        <div
          className="absolute inset-x-0 top-0 h-40 pointer-events-none z-20"
          style={{ background: "linear-gradient(to bottom, #050505 0%, transparent 100%)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-20"
          style={{ background: "linear-gradient(to top, #050505 0%, transparent 100%)" }}
        />

        {/* Cinematic side vignettes */}
        <div
          className="absolute inset-y-0 left-0 w-32 pointer-events-none z-20 hidden md:block"
          style={{ background: "linear-gradient(to right, #050505 0%, transparent 100%)", opacity: 0.7 }}
        />
        <div
          className="absolute inset-y-0 right-0 w-32 pointer-events-none z-20 hidden md:block"
          style={{ background: "linear-gradient(to left, #050505 0%, transparent 100%)", opacity: 0.7 }}
        />

        {/* Scroll Progress Line (Right Edge) */}
        <motion.div
          className="absolute right-0 top-0 w-[2px] origin-top opacity-30 z-30"
          style={{
            scaleY: smoothProgress,
            background: "linear-gradient(to bottom, transparent, rgba(0,255,136,0.8), transparent)",
            height: "100%",
            transformOrigin: "top",
          }}
        />
      </div>
    </section>
  )
}
