"use client"

import { useRef, useEffect, useState, useCallback } from "react"

export interface FunnelStage {
  name: string
  count: number
  color: string
  avgDays: number
}

interface FunnelChartProps {
  stages?: FunnelStage[]
}

const DEFAULT_STAGES: FunnelStage[] = [
  { name: "New Leads",     count: 47, color: "#00F5FF", avgDays: 0  },
  { name: "Contacted",     count: 31, color: "#4D9FFF", avgDays: 2  },
  { name: "Estimate Sent", count: 22, color: "#9B59FF", avgDays: 5  },
  { name: "Negotiating",   count: 16, color: "#FFB800", avgDays: 9  },
  { name: "Converted",     count: 14, color: "#39FF14", avgDays: 14 },
]

// How wide each layer is as a % of the container (top → bottom = wide → narrow)
const WIDTHS = [100, 82, 64, 48, 34]
const LAYER_H = 56   // px height of each trapezoid layer
const PERSPECTIVE = 600

export default function FunnelChart({ stages = DEFAULT_STAGES }: FunnelChartProps) {
  const total = stages[0]?.count || 1
  const convRate = ((stages[stages.length - 1].count / total) * 100).toFixed(1)

  // Auto-rotate state (degrees)
  const [rotateY, setRotateY] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Gentle auto-rotation (20 deg/s) — pauses when a layer is hovered
  const animate = useCallback((ts: number) => {
    const dt = ts - lastTsRef.current
    lastTsRef.current = ts
    setRotateY((prev) => {
      if (hoveredIdx !== null) return prev
      return (prev + (dt / 1000) * 20) % 360
    })
    rafRef.current = requestAnimationFrame(animate)
  }, [hoveredIdx])

  useEffect(() => {
    lastTsRef.current = performance.now()
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [animate])

  const handleLayerEnter = (idx: number, e: React.MouseEvent) => {
    setHoveredIdx(idx)
    setTooltipPos({ x: e.clientX, y: e.clientY })
  }
  const handleLayerMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY })
  }
  const handleLayerLeave = () => setHoveredIdx(null)

  // ---- 3D layer geometry ------------------------------------------------
  // Each layer is a CSS-3D trapezoid built from two divs:
  //  · front face  — flat rect clipped to a trapezoid via clip-path
  //  · top face    — thin rect rotated -90° + translateZ to fake the bevel
  // The whole stack sits inside a perspective wrapper that also rotates on Y.
  // -----------------------------------------------------------------------
  const containerW = 340  // px — the reference width for WIDTHS percentages

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">

      {/* ── LEFT: 3D funnel ───────────────────────────────────────────── */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ minWidth: 360 }}>

        {/* Perspective wrapper */}
        <div
          ref={containerRef}
          style={{
            perspective: PERSPECTIVE,
            perspectiveOrigin: "50% 40%",
            width: containerW,
            // Extra vertical space for 3D depth
            height: stages.length * LAYER_H + 40,
            position: "relative",
          }}
          aria-label="3D lead pipeline funnel"
        >
          {/* Rotating group */}
          <div
            style={{
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              transform: `rotateY(${rotateY}deg)`,
              transition: hoveredIdx !== null ? "transform 0.4s ease" : "none",
              position: "relative",
            }}
          >
            {stages.map((stage, i) => {
              const layerW = (WIDTHS[i] / 100) * containerW
              const nextW   = i < stages.length - 1 ? (WIDTHS[i + 1] / 100) * containerW : layerW * 0.75
              const leftOff = (containerW - layerW) / 2
              const topOff  = i * LAYER_H + 16
              const isHovered = hoveredIdx === i

              // clip-path trapezoid: top-left, top-right, bottom-right, bottom-left
              const clipInset  = ((layerW - nextW) / 2)
              const clipL = `${clipInset}px`
              const clipR = `${clipInset}px`
              const clipPath = `polygon(0% 0%, 100% 0%, calc(100% - ${clipR}) 100%, ${clipL} 100%)`

              // Top-bevel face height — thicker at top (bigger layers)
              const bevelH = 10

              return (
                <div
                  key={stage.name}
                  style={{
                    position: "absolute",
                    left: leftOff,
                    top: topOff,
                    width: layerW,
                    transformStyle: "preserve-3d",
                    transform: isHovered ? `translateZ(18px) translateY(-4px)` : "translateZ(0px)",
                    transition: "transform 0.25s cubic-bezier(.34,1.56,.64,1)",
                    zIndex: isHovered ? 10 : stages.length - i,
                  }}
                  onMouseEnter={(e) => handleLayerEnter(i, e)}
                  onMouseMove={handleLayerMove}
                  onMouseLeave={handleLayerLeave}
                  role="button"
                  tabIndex={0}
                  aria-label={`${stage.name}: ${stage.count} leads`}
                  onFocus={(e) => handleLayerEnter(i, e as unknown as React.MouseEvent)}
                  onBlur={handleLayerLeave}
                >
                  {/* Front face */}
                  <div
                    style={{
                      width: "100%",
                      height: LAYER_H,
                      clipPath,
                      background: isHovered
                        ? `linear-gradient(135deg, ${stage.color}ee 0%, ${stage.color}99 100%)`
                        : `linear-gradient(135deg, ${stage.color}99 0%, ${stage.color}44 100%)`,
                      boxShadow: isHovered
                        ? `0 0 32px ${stage.color}99, inset 0 1px 0 ${stage.color}cc`
                        : `0 0 14px ${stage.color}44, inset 0 1px 0 ${stage.color}55`,
                      border: `1px solid ${stage.color}${isHovered ? "cc" : "55"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      position: "relative",
                      transition: "all 0.25s ease",
                    }}
                  >
                    {/* Scanline shimmer overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        clipPath,
                        background: `repeating-linear-gradient(
                          0deg,
                          transparent,
                          transparent 3px,
                          ${stage.color}08 3px,
                          ${stage.color}08 4px
                        )`,
                        pointerEvents: "none",
                      }}
                      aria-hidden="true"
                    />

                    {/* Label */}
                    <div className="flex items-center gap-2 z-10 select-none" style={{ pointerEvents: "none" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: 12,
                          fontWeight: 600,
                          color: isHovered ? "#fff" : `${stage.color}dd`,
                          textShadow: `0 0 10px ${stage.color}`,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {stage.name.toUpperCase()}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 13,
                          fontWeight: 700,
                          color: stage.color,
                          textShadow: `0 0 12px ${stage.color}`,
                        }}
                      >
                        {stage.count}
                      </span>
                    </div>
                  </div>

                  {/* Top bevel face (3D depth illusion) */}
                  <div
                    style={{
                      position: "absolute",
                      top: -bevelH,
                      left: 0,
                      width: "100%",
                      height: bevelH,
                      background: `linear-gradient(180deg, ${stage.color}33 0%, ${stage.color}11 100%)`,
                      clipPath: `polygon(0% 100%, 100% 100%, calc(100% - 4px) 0%, 4px 0%)`,
                      borderTop: `1px solid ${stage.color}44`,
                      pointerEvents: "none",
                    }}
                    aria-hidden="true"
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Conversion rate badge */}
        <div
          className="mt-2 flex items-center gap-2 px-5 py-2 rounded-full"
          style={{
            background: "rgba(57,255,20,0.08)",
            border: "1px solid rgba(57,255,20,0.35)",
            boxShadow: "0 0 20px rgba(57,255,20,0.15)",
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#39FF14", boxShadow: "0 0 8px #39FF14" }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              fontWeight: 700,
              color: "#39FF14",
              textShadow: "0 0 10px rgba(57,255,20,0.7)",
            }}
          >
            {convRate}% overall conversion
          </span>
        </div>
      </div>

      {/* ── RIGHT: stage breakdown panel ─────────────────────────────── */}
      <div
        className="flex-1 flex flex-col gap-0 rounded-xl overflow-hidden"
        style={{
          background: "rgba(5,8,16,0.6)",
          border: "1px solid rgba(0,245,255,0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Panel header */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(0,245,255,0.1)" }}
        >
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "rgba(232,244,248,0.5)", letterSpacing: "0.08em" }}>
            STAGE BREAKDOWN
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(232,244,248,0.3)" }}>
            {total} total
          </span>
        </div>

        {/* Stage rows */}
        {stages.map((stage, i) => {
          const pct = Math.round((stage.count / total) * 100)
          const prevCount = i > 0 ? stages[i - 1].count : null
          const dropOff = prevCount ? Math.round(((prevCount - stage.count) / prevCount) * 100) : null

          return (
            <div key={stage.name}>
              {/* Drop-off indicator */}
              {dropOff !== null && (
                <div
                  className="flex items-center gap-2 px-5 py-1"
                  style={{ background: "rgba(255,60,60,0.04)", borderTop: "1px solid rgba(255,60,60,0.08)" }}
                >
                  <div className="w-px h-3 mx-1" style={{ background: "rgba(255,80,80,0.3)" }} aria-hidden="true" />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#FF6B6B" }}>
                    ↓ {dropOff}% drop-off
                  </span>
                </div>
              )}

              {/* Stage row */}
              <div
                className="flex items-center gap-3 px-5 py-3 group cursor-default"
                style={{
                  background: hoveredIdx === i ? `${stage.color}08` : "transparent",
                  borderLeft: hoveredIdx === i ? `2px solid ${stage.color}` : "2px solid transparent",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Dot */}
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    background: stage.color,
                    boxShadow: `0 0 8px ${stage.color}`,
                  }}
                />

                {/* Name */}
                <span
                  className="w-28 shrink-0"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: hoveredIdx === i ? stage.color : "rgba(232,244,248,0.75)",
                    transition: "color 0.2s",
                  }}
                >
                  {stage.name}
                </span>

                {/* Mini bar */}
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: stage.color,
                      boxShadow: `0 0 6px ${stage.color}`,
                      borderRadius: 999,
                      transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
                    }}
                  />
                </div>

                {/* Count + pct */}
                <div className="flex items-center gap-2 shrink-0">
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: stage.color }}>
                    {stage.count}
                  </span>
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded"
                    style={{ background: `${stage.color}18`, color: `${stage.color}cc`, fontSize: 10 }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {/* Avg days footer */}
        <div
          className="px-5 py-3 flex flex-col gap-1.5"
          style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }}
        >
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600, color: "rgba(232,244,248,0.3)", letterSpacing: "0.08em" }}>
            AVG DAYS IN STAGE
          </span>
          <div className="flex gap-2 flex-wrap">
            {stages.map((stage) => (
              <span
                key={stage.name}
                className="px-2 py-0.5 rounded-full text-xs font-mono"
                style={{ background: `${stage.color}12`, border: `1px solid ${stage.color}25`, color: `${stage.color}cc` }}
              >
                {stage.avgDays}d
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating tooltip (portal-style, follows cursor) ───────────── */}
      {hoveredIdx !== null && (
        <div
          className="fixed pointer-events-none z-50 rounded-xl px-4 py-3"
          style={{
            left: tooltipPos.x + 16,
            top: tooltipPos.y - 80,
            background: "rgba(5,8,16,0.92)",
            border: `1px solid ${stages[hoveredIdx].color}55`,
            backdropFilter: "blur(16px)",
            boxShadow: `0 0 24px ${stages[hoveredIdx].color}33`,
            minWidth: 180,
          }}
          role="tooltip"
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: stages[hoveredIdx].color, boxShadow: `0 0 8px ${stages[hoveredIdx].color}` }}
            />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, color: stages[hoveredIdx].color }}>
              {stages[hoveredIdx].name}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between gap-6">
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(232,244,248,0.45)" }}>Leads</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#e8f4f8" }}>
                {stages[hoveredIdx].count}
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(232,244,248,0.45)" }}>% of total</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: stages[hoveredIdx].color }}>
                {Math.round((stages[hoveredIdx].count / total) * 100)}%
              </span>
            </div>
            <div className="flex justify-between gap-6">
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(232,244,248,0.45)" }}>Avg days</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#e8f4f8" }}>
                {stages[hoveredIdx].avgDays}d
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
