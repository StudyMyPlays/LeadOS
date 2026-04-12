"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

// ── Counting animation hook ───────────────────────────────────────
function useCountUp(target: number, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf: number
    let start: number | null = null
    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts
        const elapsed = ts - start
        const progress = Math.min(elapsed / duration, 1)
        // ease-out-quad
        const eased = 1 - (1 - progress) * (1 - progress)
        setValue(Math.round(eased * target))
        if (progress < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, delay])
  return value
}

// ── 3D tilt card with glow shadow ─────────────────────────────────
function KpiCard({
  children,
  accent,
  delay,
}: {
  children: React.ReactNode
  accent: string
  delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const cx = r.width / 2
    const cy = r.height / 2
    const rotY = ((x - cx) / cx) * 10
    const rotX = -((y - cy) / cy) * 10
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) translateZ(8px)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)"
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-xl p-5 flex flex-col gap-3 cursor-default"
      style={{
        background: "rgba(10,18,35,0.68)",
        border: `1px solid rgba(${hexToRgb(accent)},0.22)`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(${hexToRgb(accent)},0.1), inset 0 1px 0 rgba(${hexToRgb(accent)},0.1)`,
        transformStyle: "preserve-3d",
        transition: "transform 0.22s ease, box-shadow 0.22s ease, opacity 0.5s ease, translate 0.5s ease",
        opacity: visible ? 1 : 0,
        translate: visible ? "0 0" : "0 32px",
      }}
    >
      {/* Downward glow "shadow" */}
      <div
        aria-hidden
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full blur-xl"
        style={{
          width: "70%",
          height: 16,
          background: `rgba(${hexToRgb(accent)},0.22)`,
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  )
}

// ── Spinning 3D shape (CSS only) ──────────────────────────────────
function SpinShape({ accent }: { accent: string }) {
  return (
    <div
      aria-hidden
      className="relative flex-shrink-0"
      style={{ width: 32, height: 32, perspective: 200 }}
    >
      <div
        className="w-full h-full rounded-sm"
        style={{
          background: `rgba(${hexToRgb(accent)},0.15)`,
          border: `1px solid rgba(${hexToRgb(accent)},0.5)`,
          boxShadow: `0 0 10px rgba(${hexToRgb(accent)},0.35)`,
          animation: "spinShape 4s linear infinite",
          transformStyle: "preserve-3d",
        }}
      />
    </div>
  )
}

// ── Sparkline (7-bar mini chart) ──────────────────────────────────
const SPARK = [3, 6, 5, 8, 7, 11, 9]
function Sparkline({ accent }: { accent: string }) {
  const max = Math.max(...SPARK)
  return (
    <div className="flex items-end gap-0.5 h-8" aria-label="7-day sparkline">
      {SPARK.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${(v / max) * 100}%`,
            background: i === SPARK.length - 1
              ? accent
              : `rgba(${hexToRgb(accent)},0.35)`,
            boxShadow: i === SPARK.length - 1 ? `0 0 6px ${accent}` : undefined,
            transition: `height 0.4s ease ${i * 60}ms`,
          }}
        />
      ))}
    </div>
  )
}

// ── Pulsing dot ───────────────────────────────────────────────────
function PulseDot({ color }: { color: string }) {
  return (
    <span className="relative flex h-3 w-3 flex-shrink-0" aria-hidden>
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ background: color, animation: "ping 1.4s cubic-bezier(0,0,0.2,1) infinite" }}
      />
      <span className="relative inline-flex h-3 w-3 rounded-full" style={{ background: color }} />
    </span>
  )
}

// ── Mini donut chart ──────────────────────────────────────────────
function MiniDonut({ pct, accent }: { pct: number; accent: string }) {
  const data = [{ value: pct }, { value: 100 - pct }]
  return (
    <div style={{ width: 52, height: 52 }} aria-label={`${pct}% conversion rate`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={16}
            outerRadius={22}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={accent} />
            <Cell fill={`rgba(${hexToRgb(accent)},0.12)`} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── hex → "r,g,b" helper ──────────────────────────────────────────
function hexToRgb(hex: string): string {
  const h = hex.replace("#", "")
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16)
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
}

// ── Individual card implementations ──────────────────────────────

function TotalLeadsCard() {
  const count = useCountUp(47, 1000, 0)
  const accent = "#00F5FF"
  return (
    <KpiCard accent={accent} delay={0}>
      <div className="flex items-center justify-between">
        <SpinShape accent={accent} />
        <span
          className="text-xs font-mono px-2 py-0.5 rounded-full"
          style={{
            background: `rgba(${hexToRgb(accent)},0.12)`,
            color: accent,
            border: `1px solid rgba(${hexToRgb(accent)},0.28)`,
          }}
        >
          all time
        </span>
      </div>
      <div>
        <div
          className="text-4xl font-bold font-mono leading-none"
          style={{ color: accent, textShadow: `0 0 18px rgba(${hexToRgb(accent)},0.65)` }}
        >
          {count}
        </div>
        <div className="text-xs font-sans mt-1" style={{ color: "rgba(232,244,248,0.5)" }}>
          Total Leads
        </div>
      </div>
      <Sparkline accent={accent} />
    </KpiCard>
  )
}

function NewThisWeekCard() {
  const count = useCountUp(11, 1000, 100)
  const accent = "#39FF14"
  return (
    <KpiCard accent={accent} delay={100}>
      <div className="flex items-center justify-between">
        <SpinShape accent={accent} />
        <span
          className="text-xs font-mono px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{
            background: `rgba(${hexToRgb(accent)},0.1)`,
            color: accent,
            border: `1px solid rgba(${hexToRgb(accent)},0.25)`,
          }}
        >
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M5 1v8M1 4l4-3 4 3" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          +22% vs last wk
        </span>
      </div>
      <div>
        <div
          className="text-4xl font-bold font-mono leading-none"
          style={{ color: accent, textShadow: `0 0 18px rgba(${hexToRgb(accent)},0.65)` }}
        >
          {count}
        </div>
        <div className="text-xs font-sans mt-1" style={{ color: "rgba(232,244,248,0.5)" }}>
          New This Week
        </div>
      </div>
    </KpiCard>
  )
}

function FollowUpCard() {
  const count = useCountUp(8, 1000, 200)
  const accent = "#FF9F1C"
  return (
    <KpiCard accent={accent} delay={200}>
      <div className="flex items-center justify-between">
        <SpinShape accent={accent} />
        <div className="flex items-center gap-2">
          <PulseDot color={accent} />
          <span className="text-xs font-mono" style={{ color: "rgba(232,244,248,0.45)" }}>
            awaiting contact
          </span>
        </div>
      </div>
      <div>
        <div
          className="text-4xl font-bold font-mono leading-none"
          style={{ color: accent, textShadow: `0 0 18px rgba(${hexToRgb(accent)},0.65)` }}
        >
          {count}
        </div>
        <div className="text-xs font-sans mt-1" style={{ color: "rgba(232,244,248,0.5)" }}>
          Follow-up Needed
        </div>
      </div>
      {/* small fill bar */}
      <div className="h-1 rounded-full" style={{ background: `rgba(${hexToRgb(accent)},0.12)` }}>
        <div
          className="h-1 rounded-full"
          style={{
            width: "62%",
            background: accent,
            boxShadow: `0 0 8px rgba(${hexToRgb(accent)},0.6)`,
            transition: "width 1s ease 0.5s",
          }}
        />
      </div>
    </KpiCard>
  )
}

function ConvertedCard() {
  const count = useCountUp(14, 1000, 300)
  const accent = "#39FF14"
  const pct = 30 // 14/47 ≈ 30%
  return (
    <KpiCard accent={accent} delay={300}>
      <div className="flex items-center justify-between">
        <SpinShape accent={accent} />
        <span
          className="text-xs font-mono px-2 py-0.5 rounded-full"
          style={{
            background: `rgba(${hexToRgb(accent)},0.1)`,
            color: accent,
            border: `1px solid rgba(${hexToRgb(accent)},0.25)`,
          }}
        >
          {pct}% conv.
        </span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <div
            className="text-4xl font-bold font-mono leading-none"
            style={{ color: accent, textShadow: `0 0 18px rgba(${hexToRgb(accent)},0.65)` }}
          >
            {count}
          </div>
          <div className="text-xs font-sans mt-1" style={{ color: "rgba(232,244,248,0.5)" }}>
            Converted to Jobs
          </div>
          <div
            className="text-xs font-mono mt-1"
            style={{ color: "rgba(232,244,248,0.65)" }}
          >
            $18,200 est. revenue
          </div>
        </div>
        <MiniDonut pct={pct} accent={accent} />
      </div>
    </KpiCard>
  )
}

// ── Hero Stats Row ────────────────────────────────────────────────
export default function HeroStats() {
  return (
    <>
      <style>{`
        @keyframes spinShape {
          0%   { transform: perspective(200px) rotateX(0deg)   rotateY(0deg); }
          33%  { transform: perspective(200px) rotateX(180deg) rotateY(90deg); }
          66%  { transform: perspective(200px) rotateX(90deg)  rotateY(270deg); }
          100% { transform: perspective(200px) rotateX(360deg) rotateY(360deg); }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <TotalLeadsCard />
        <NewThisWeekCard />
        <FollowUpCard />
        <ConvertedCard />
      </div>
    </>
  )
}
