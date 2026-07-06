"use client"

import { useEffect, useRef, useCallback } from "react"
import { type MotionValue } from "framer-motion"

const TOTAL_FRAMES = 240

interface ScrollCanvasProps {
  scrollProgress: MotionValue<number>
  frames: HTMLImageElement[]
}

export function ScrollCanvas({ scrollProgress, frames }: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const lastFrameIndexRef = useRef<number>(-1)

  const drawFrame = useCallback(
    (latestProgress: number) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d", { alpha: false })
      if (!ctx) return

      if (frames.length === 0) return

      // Map progress (0..1) to frame index (0..239)
      const targetIndex = Math.round(Math.min(Math.max(latestProgress * (TOTAL_FRAMES - 1), 0), TOTAL_FRAMES - 1))

      let clampedIndex = targetIndex
      let img = frames[clampedIndex]

      // Fallback: search backwards for the nearest loaded frame to prevent blank screen flicker
      while ((!img || !img.complete || img.naturalWidth === 0) && clampedIndex > 0) {
        clampedIndex--
        img = frames[clampedIndex]
      }

      if (!img || !img.complete || img.naturalWidth === 0) return

      // Skip draw if frame hasn't changed
      if (clampedIndex === lastFrameIndexRef.current) return
      
      lastFrameIndexRef.current = clampedIndex

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"

      const dpr = window.devicePixelRatio || 1
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      // Adjust dimensions on changes
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr
        canvas.height = h * dpr
        ctx.scale(dpr, dpr)
      }

      // Aspect-ratio cover calculation
      const imgAspect = img.naturalWidth / img.naturalHeight
      const canvasAspect = w / h

      let drawW: number, drawH: number, drawX: number, drawY: number

      if (imgAspect > canvasAspect) {
        drawH = h
        drawW = h * imgAspect
        drawX = (w - drawW) / 2
        drawY = 0
      } else {
        drawW = w
        drawH = w / imgAspect
        drawX = 0
        drawY = (h - drawH) / 2
      }

      ctx.fillStyle = "#050505"
      ctx.fillRect(0, 0, w, h)
      ctx.drawImage(img, drawX, drawY, drawW, drawH)
    },
    [frames]
  )

  // Subscribe to progress and schedule redraws
  useEffect(() => {
    const handleScroll = (latest: number) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => drawFrame(latest))
    }

    const unsubscribe = scrollProgress.on("change", handleScroll)

    return () => {
      unsubscribe()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [scrollProgress, drawFrame])

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = 0
      canvas.height = 0
      lastFrameIndexRef.current = -1
      drawFrame(scrollProgress.get())
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [drawFrame, scrollProgress])

  // Draw immediately once loaded or updated
  useEffect(() => {
    if (frames.length > 0) {
      lastFrameIndexRef.current = -1 // Force redraw check
      drawFrame(scrollProgress.get())
    }
  }, [frames, drawFrame, scrollProgress])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ display: "block" }}
      aria-hidden="true"
    />
  )
}
