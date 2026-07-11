"use client"

import { useEffect, useRef } from "react"

/**
 * HsHubMouseAura
 *
 * A custom-built canvas-based mouse background effect for the HS Hub.
 * Design intent: Three brand-colored orbs (YieldSage green, HollowScan orange,
 * Polymarket blue) drift autonomously and converge loosely toward the mouse cursor
 * with different inertia delays — giving a multi-product "constellation" feel.
 * The mouse attracts all three orbs but each with a different lag coefficient,
 * creating natural parallax depth. All three blend and overlap on the canvas.
 *
 * Distinct from YieldSage's single trailing orb + counter-balance pattern.
 */
export function HsHubMouseAura() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const targetRef = useRef({ x: 0.5, y: 0.5 })
  const timeRef = useRef(0)

  // Three independent orb positions, each with their own inertia
  const orbGreenRef = useRef({ x: 0.25, y: 0.6 })
  const orbOrangeRef = useRef({ x: 0.75, y: 0.4 })
  const orbBlueRef = useRef({ x: 0.5, y: 0.2 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    let animationId: number

    const animate = () => {
      timeRef.current += 0.008

      const t = timeRef.current
      const w = canvas.width
      const h = canvas.height
      const tx = targetRef.current.x
      const ty = targetRef.current.y

      // --- Orb 1: YieldSage Green — closest mouse follower, lerp 0.035 ---
      // Orbits with a slow sinusoidal drift offset
      const gTargetX = tx * 0.85 + 0.15 + Math.sin(t * 0.7) * 0.12
      const gTargetY = ty * 0.85 + 0.05 + Math.cos(t * 0.5) * 0.10
      orbGreenRef.current.x += (gTargetX - orbGreenRef.current.x) * 0.035
      orbGreenRef.current.y += (gTargetY - orbGreenRef.current.y) * 0.035

      // --- Orb 2: HollowScan Orange — slower follow, drifts counter-clockwise ---
      const oTargetX = tx * 0.70 + 0.30 + Math.cos(t * 0.6 + 2.1) * 0.18
      const oTargetY = ty * 0.70 + 0.20 + Math.sin(t * 0.45 + 1.2) * 0.14
      orbOrangeRef.current.x += (oTargetX - orbOrangeRef.current.x) * 0.022
      orbOrangeRef.current.y += (oTargetY - orbOrangeRef.current.y) * 0.022

      // --- Orb 3: Polymarket Blue — slowest, stays in upper quadrant ---
      const bTargetX = tx * 0.55 + 0.25 + Math.sin(t * 0.4 + 3.9) * 0.20
      const bTargetY = ty * 0.50 + 0.10 + Math.cos(t * 0.35 + 0.8) * 0.16
      orbBlueRef.current.x += (bTargetX - orbBlueRef.current.x) * 0.014
      orbBlueRef.current.y += (bTargetY - orbBlueRef.current.y) * 0.014

      // Breath pulses per orb (desynchronized)
      const pulseG = 0.92 + Math.sin(t * 1.9) * 0.08
      const pulseO = 0.92 + Math.sin(t * 1.4 + 1.3) * 0.08
      const pulseB = 0.92 + Math.sin(t * 1.1 + 2.7) * 0.08

      // Pitch-black base
      ctx.fillStyle = "#050505"
      ctx.fillRect(0, 0, w, h)

      const maxDim = Math.max(w, h)

      // --- YieldSage Green Orb ---
      const gx = orbGreenRef.current.x * w
      const gy = orbGreenRef.current.y * h
      const gGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, maxDim * 0.58)
      gGrad.addColorStop(0, `rgba(0, 255, 136, ${0.22 * pulseG})`)
      gGrad.addColorStop(0.18, `rgba(0, 210, 100, ${0.14 * pulseG})`)
      gGrad.addColorStop(0.45, `rgba(0, 140, 60, ${0.06 * pulseG})`)
      gGrad.addColorStop(0.75, `rgba(0, 60, 30, ${0.02 * pulseG})`)
      gGrad.addColorStop(1, "rgba(5, 5, 5, 0)")
      ctx.fillStyle = gGrad
      ctx.fillRect(0, 0, w, h)

      // --- HollowScan Orange Orb ---
      const ox = orbOrangeRef.current.x * w
      const oy = orbOrangeRef.current.y * h
      const oGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, maxDim * 0.48)
      oGrad.addColorStop(0, `rgba(255, 80, 15, ${0.20 * pulseO})`)
      oGrad.addColorStop(0.2, `rgba(220, 60, 10, ${0.12 * pulseO})`)
      oGrad.addColorStop(0.5, `rgba(140, 35, 5, ${0.05 * pulseO})`)
      oGrad.addColorStop(0.8, `rgba(60, 15, 0, ${0.015 * pulseO})`)
      oGrad.addColorStop(1, "rgba(5, 5, 5, 0)")
      ctx.fillStyle = oGrad
      ctx.fillRect(0, 0, w, h)

      // --- Polymarket Blue Orb ---
      const bx = orbBlueRef.current.x * w
      const by = orbBlueRef.current.y * h
      const bGrad = ctx.createRadialGradient(bx, by, 0, bx, by, maxDim * 0.50)
      bGrad.addColorStop(0, `rgba(30, 100, 255, ${0.18 * pulseB})`)
      bGrad.addColorStop(0.2, `rgba(20, 70, 200, ${0.10 * pulseB})`)
      bGrad.addColorStop(0.5, `rgba(10, 40, 120, ${0.04 * pulseB})`)
      bGrad.addColorStop(0.8, `rgba(5, 15, 50, ${0.01 * pulseB})`)
      bGrad.addColorStop(1, "rgba(5, 5, 5, 0)")
      ctx.fillStyle = bGrad
      ctx.fillRect(0, 0, w, h)

      // --- Subtle center nebula ambient (no mouse tracking, pure slow drift) ---
      const nebX = w * 0.5 + Math.sin(t * 0.25) * w * 0.15
      const nebY = h * 0.5 + Math.cos(t * 0.18) * h * 0.15
      const nebGrad = ctx.createRadialGradient(nebX, nebY, 0, nebX, nebY, maxDim * 0.40)
      nebGrad.addColorStop(0, `rgba(80, 80, 180, ${0.04 * pulseB})`)
      nebGrad.addColorStop(0.5, `rgba(40, 100, 80, ${0.02})`)
      nebGrad.addColorStop(1, "rgba(5, 5, 5, 0)")
      ctx.fillStyle = nebGrad
      ctx.fillRect(0, 0, w, h)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      {/* Live canvas aurora */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "#050505" }}
        aria-hidden="true"
      />

      {/* Faint tech grid */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden opacity-[0.06]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating data telemetry labels — HS Hub themed */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden opacity-[0.07] select-none">

        {/* YieldSage telemetry — top left */}
        <div className="absolute top-[9%] left-[6%] font-mono text-[9px] text-emerald-400/80 rotate-[-2deg] space-y-0.5">
          <div>YIELDSAGE::MANTLE_NET_SYNC: OK</div>
          <div>YIELD_RANK_REFRESH: 5m interval</div>
        </div>

        {/* HollowScan telemetry — top right */}
        <div className="absolute top-[11%] right-[6%] font-mono text-[9px] text-orange-400/75 rotate-[2deg] text-right space-y-0.5">
          <div>HOLLOWSCAN::BARCODE_DB: LIVE</div>
          <div>MARGIN_CALC_ENGINE: active</div>
        </div>

        {/* Polymarket telemetry — left mid */}
        <div className="absolute top-[38%] left-[3%] font-mono text-[8px] text-blue-400/60 rotate-[-1deg] space-y-1">
          <div>POLYMARKET_STREAM: connected</div>
          <div>ORDER_BOOK_DEPTH: 14 levels</div>
          <div>SMART_WALLET_ALERTS: 3 flagged</div>
        </div>

        {/* Hub ID marker — right mid */}
        <div className="absolute top-[42%] right-[4%] font-mono text-[9px] text-emerald-300/55 rotate-[3deg] text-right space-y-0.5">
          <div>HS_HUB_REV: 1.0.0</div>
          <div>PROD_SYNC: 3/3 ACTIVE</div>
        </div>

        {/* YieldSage proof trace — lower left */}
        <div className="absolute top-[62%] left-[5%] font-mono text-[8px] text-emerald-400/55 rotate-[4deg] space-y-0.5">
          <div>ON_CHAIN_PROOF LOGS:</div>
          <div>TX_COUNT: 4,000+ verified</div>
          <div>BLOCK_HEIGHT: current</div>
        </div>

        {/* HollowScan scan badge — lower right */}
        <div className="absolute top-[65%] right-[5%] font-mono text-[8px] text-orange-400/55 rotate-[-3deg] text-right space-y-0.5">
          <div>APP_STORE: iOS + Android</div>
          <div>DEAL_ACCURACY: 98.2%</div>
        </div>

        {/* Circular badge — Polymarket */}
        <div className="absolute top-[24%] left-[46%] w-16 h-16 border border-dashed border-blue-500/25 rounded-full flex items-center justify-center rotate-[-8deg]">
          <div className="text-[6px] text-blue-400/55 font-mono text-center leading-tight">
            <div>PMKT</div>
            <div>ANALYTICS</div>
            <div className="font-bold text-[7px]">LIVE</div>
          </div>
        </div>

        {/* Circular badge — YieldSage bottom */}
        <div className="absolute bottom-[18%] left-[38%] w-14 h-14 border border-emerald-500/20 rounded-full flex items-center justify-center rotate-[12deg]">
          <div className="text-[6px] text-emerald-400/55 font-mono text-center leading-tight">
            <div>YIELD</div>
            <div>VERIFIED</div>
            <div>✓</div>
          </div>
        </div>

        {/* Bottom scan bar */}
        <div className="absolute bottom-[10%] left-[7%] font-mono text-[8px] text-white/25 rotate-[5deg] space-y-0.5">
          <div>||| |||| |||| ||| |||</div>
          <div>HS-HUB-CORE-SEQUENCE</div>
        </div>
        <div className="absolute bottom-[12%] right-[7%] font-mono text-[8px] text-white/25 rotate-[-5deg] text-right">
          <div>HOLLOWSCAN 2026</div>
          <div>SUITE: YS + HS + PMKT</div>
        </div>
      </div>

      {/* Luxury cinema-grade noise grain overlay */}
      <div
        className="fixed inset-0 z-[2] pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
        aria-hidden="true"
      />
    </>
  )
}
