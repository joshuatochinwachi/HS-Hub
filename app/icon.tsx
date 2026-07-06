import { ImageResponse } from "next/og"

// Next.js App Router favicon generator
// This file is auto-discovered as the site icon — no manual <link> tag needed.
export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #050505 0%, #0d0d0d 100%)",
          border: "1px solid rgba(0,255,136,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* Subtle green top-left glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "rgba(0,255,136,0.18)",
            filter: "blur(6px)",
          }}
        />
        {/* Subtle blue bottom-right glow */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "rgba(30,100,255,0.18)",
            filter: "blur(5px)",
          }}
        />
        {/* HS text mark */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "-0.5px",
            color: "rgba(255,255,255,0.92)",
            position: "relative",
            zIndex: 1,
          }}
        >
          HS
        </span>
      </div>
    ),
    { ...size }
  )
}
