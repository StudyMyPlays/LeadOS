"use client"

import { useState, useMemo } from "react"
import TiltCard from "./TiltCard"
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid,
} from "recharts"

// ── Palette ──────────────────────────────────────────────────────
const BLUE   = "#3b82f6"
const BLUE_LT = "#60a5fa"
const GREEN  = "#22c55e"
const GREEN_LT = "#4ade80"
const PURPLE = "#a78bfa"
const AMBER  = "#f59e0b"
const DIM_FG = "rgba(200,205,216,0.4)"
const CARD_FG = "#c8cdd8"
const TOOLTIP_STYLE = {
  background: "rgba(10,10,14,0.97)",
  border: "1px solid rgba(59,130,246,0.18)",
  borderRadius: 8,
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  color: CARD_FG,
}

// ── Source colours ────────────────────────────────────────────────
const SOURCE_COLORS = [BLUE_LT, GREEN, PURPLE, AMBER, "#f87171"]

// ── Static data sets keyed by date range ─────────────────────────
const WEEKS_DATA: Record<string, { week: string; total: number; converted: number }[]> = {
  "7D": [
    { week: "Mon", total: 14, converted: 4 },
    { week: "Tue", total: 21, converted: 7 },
    { week: "Wed", total: 18, converted: 5 },
    { week: "Thu", total: 28, converted: 11 },
    { week: "Fri", total: 35, converted: 15 },
    { week: "Sat", total: 22, converted: 9 },
    { week: "Sun", total: 10, converted: 3 },
  ],
  "30D": [
    { week: "Wk 1", total: 68,  converted: 21 },
    { week: "Wk 2", total: 84,  converted: 27 },
    { week: "Wk 3", total: 92,  converted: 31 },
    { week: "Wk 4", total: 77,  converted: 24 },
  ],
  "90D": [
    { week: "Jan", total: 138, converted: 43 },
    { week: "Feb", total: 165, converted: 52 },
    { week: "Mar", total: 197, converted: 64 },
  ],
  "All": [
    { week: "Oct", total: 88,  converted: 26 },
    { week: "Nov", total: 112, converted: 35 },
    { week: "Dec", total: 79,  converted: 22 },
    { week: "Jan", total: 138, converted: 43 },
    { week: "Feb", total: 165, converted: 52 },
    { week: "Mar", total: 197, converted: 64 },
    { week: "Apr", total: 228, converted: 74 },
    { week: "May", total: 244, converted: 81 },
  ],
}

const CITY_DATA: Record<string, { city: string; count: number }[]> = {
  "7D":  [
    { city: "Denver",  count: 31 },
    { city: "Aurora",  count: 22 },
    { city: "Boulder", count: 18 },
    { city: "Lakewood",count: 11 },
    { city: "Arvada",  count: 8  },
  ],
  "30D": [
    { city: "Denver",  count: 94 },
    { city: "Aurora",  count: 61 },
    { city: "Boulder", count: 47 },
    { city: "Lakewood",count: 33 },
    { city: "Arvada",  count: 22 },
  ],
  "90D": [
    { city: "Denver",  count: 241 },
    { city: "Aurora",  count: 178 },
    { city: "Boulder", count: 130 },
    { city: "Lakewood",count: 89  },
    { city: "Arvada",  count: 64  },
  ],
  "All": [
    { city: "Denver",  count: 412 },
    { city: "Aurora",  count: 298 },
    { city: "Boulder", count: 221 },
    { city: "Lakewood",count: 152 },
    { city: "Arvada",  count: 108 },
  ],
}

const REVENUE_DATA: Record<string, { month: string; potential: number; converted: number }[]> = {
  "7D": [
    { month: "Mon", potential: 3200, converted: 1100 },
    { month: "Tue", potential: 4800, converted: 1800 },
    { month: "Wed", potential: 3900, converted: 1400 },
    { month: "Thu", potential: 6200, converted: 2600 },
    { month: "Fri", potential: 7800, converted: 3500 },
    { month: "Sat", potential: 5100, converted: 2100 },
    { month: "Sun", potential: 2400, converted: 800  },
  ],
  "30D": [
    { month: "Wk 1", potential: 18400, converted: 6800 },
    { month: "Wk 2", potential: 22600, converted: 8900 },
    { month: "Wk 3", potential: 25100, converted: 9600 },
    { month: "Wk 4", potential: 20300, converted: 7400 },
  ],
  "90D": [
    { month: "Jan", potential: 62000, converted: 21200 },
    { month: "Feb", potential: 74500, converted: 28400 },
    { month: "Mar", potential: 88200, converted: 34600 },
  ],
  "All": [
    { month: "Oct", potential: 42000, converted: 14200 },
    { month: "Nov", potential: 54800, converted: 18800 },
    { month: "Dec", potential: 38600, converted: 12200 },
    { month: "Jan", potential: 62000, converted: 21200 },
    { month: "Feb", potential: 74500, converted: 28400 },
    { month: "Mar", potential: 88200, converted: 34600 },
    { month: "Apr", potential: 96400, converted: 38800 },
  ],
}

const SOURCE_DATA: Record<string, { name: string; value: number }[]> = {
  "7D": [
    { name: "Google Ads", value: 42 },
    { name: "Referral",   value: 23 },
    { name: "Website",    value: 18 },
    { name: "Facebook",   value: 11 },
    { name: "Yelp",       value: 6  },
  ],
  "30D": [
    { name: "Google Ads", value: 38 },
    { name: "Referral",   value: 26 },
    { name: "Website",    value: 20 },
    { name: "Facebook",   value: 10 },
    { name: "Yelp",       value: 6  },
  ],
  "90D": [
    { name: "Google Ads", value: 35 },
    { name: "Referral",   value: 28 },
    { name: "Website",    value: 22 },
    { name: "Facebook",   value: 9  },
    { name: "Yelp",       value: 6  },
  ],
  "All": [
    { name: "Google Ads", value: 36 },
    { name: "Referral",   value: 27 },
    { name: "Website",    value: 21 },
    { name: "Facebook",   value: 10 },
    { name: "Yelp",       value: 6  },
  ],
}

const DATE_RANGES = ["7D", "30D", "90D", "All"] as const
type DateRange = (typeof DATE_RANGES)[number]

// ── Custom tooltip ────────────────────────────────────────────────
function ChartTooltip({ active, payload, label, formatter }: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
  formatter?: (name: string, value: number) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div style={TOOLTIP_STYLE} className="px-3 py-2 rounded-lg shadow-xl">
      <p className="font-mono text-xs mb-1.5" style={{ color: DIM_FG }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: DIM_FG }}>{p.name}:</span>
          <span style={{ color: p.color }} className="font-bold">
            {formatter ? formatter(p.name, p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Custom donut label (center text) ─────────────────────────────
function DonutCenter({ cx, cy, total }: { cx: number; cy: number; total: number }) {
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, fill: CARD_FG }}>
        {total}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" style={{ fontFamily: "var(--font-sans)", fontSize: 10, fill: DIM_FG }}>
        total leads
      </text>
    </g>
  )
}

export default function AnalyticsView({ config }: { config: { currency: string; services: string[] } }) {
  const [range, setRange] = useState<DateRange>("30D")

  const weekData   = WEEKS_DATA[range]
  const cityData   = useMemo(() => [...CITY_DATA[range]].sort((a, b) => b.count - a.count), [range])
  const revenueData = REVENUE_DATA[range]
  const sourceData  = SOURCE_DATA[range]

  const totalLeads      = sourceData.reduce((s, d) => s + d.value, 0)
  const pipelineTotal   = revenueData.reduce((s, d) => s + d.potential, 0)
  const convertedTotal  = revenueData.reduce((s, d) => s + d.converted, 0)
  const convRate        = ((convertedTotal / pipelineTotal) * 100).toFixed(1)
  const maxCity         = cityData[0]?.count ?? 1

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: config.currency, maximumFractionDigits: 0 }).format(n)
  const fmtK = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`

  const weekConversionWeek = (total: number, converted: number) =>
    total > 0 ? `${((converted / total) * 100).toFixed(0)}%` : "—"

  return (
    <div className="flex flex-col gap-5">
      {/* ── Date filter ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold font-sans" style={{ color: CARD_FG }}>Analytics</h2>
          <p className="text-xs font-mono mt-0.5" style={{ color: DIM_FG }}>Performance overview</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {DATE_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`date-btn${range === r ? " active" : ""}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2×2 chart grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* CHART 1 — Leads over time */}
        <TiltCard className="p-5" intensity={3}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold font-sans" style={{ color: CARD_FG }}>Leads Over Time</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: DIM_FG }}>Total vs. Converted</p>
            </div>
            <span className="badge-blue text-xs px-2 py-0.5 rounded-full">{range}</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weekData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={BLUE}  stopOpacity={0.30} />
                  <stop offset="100%" stopColor={BLUE}  stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gConv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={GREEN} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: DIM_FG, fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: DIM_FG, fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <Tooltip
                content={
                  <ChartTooltip
                    formatter={(name, value) => {
                      if (name === "total" || name === "converted") {
                        const row = weekData.find(d => d.total === value || d.converted === value)
                        if (name === "converted" && row) {
                          return `${value} (${weekConversionWeek(row.total, row.converted)} conv.)`
                        }
                      }
                      return String(value)
                    }}
                  />
                }
              />
              <Area type="monotone" dataKey="total"     name="Total Leads"     stroke={BLUE}  strokeWidth={2} fill="url(#gTotal)" dot={false} />
              <Area type="monotone" dataKey="converted" name="Converted Leads"  stroke={GREEN} strokeWidth={2} fill="url(#gConv)"  dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          {/* Mini legend */}
          <div className="flex items-center gap-4 mt-3">
            {[{ color: BLUE, label: "Total Leads" }, { color: GREEN, label: "Converted" }].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded-full" style={{ background: l.color }} />
                <span className="text-xs font-mono" style={{ color: DIM_FG }}>{l.label}</span>
              </div>
            ))}
          </div>
        </TiltCard>

        {/* CHART 2 — Leads by Service (donut) */}
        <TiltCard className="p-5" intensity={3}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold font-sans" style={{ color: CARD_FG }}>Leads by Source</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: DIM_FG }}>Acquisition channels</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            {/* Donut */}
            <div className="flex-shrink-0" style={{ width: 160, height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    strokeWidth={2}
                    stroke="rgba(8,8,10,0.8)"
                    paddingAngle={3}
                  >
                    {sourceData.map((_, i) => (
                      <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip formatter={(_, v) => `${v}%`} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <p className="text-xl font-bold font-mono glow-blue">{totalLeads}</p>
              <p className="text-xs font-sans mb-1" style={{ color: DIM_FG }}>total (relative %)</p>
              {sourceData.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-sm flex-shrink-0"
                    style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }}
                  />
                  <span className="text-xs font-sans truncate flex-1" style={{ color: DIM_FG }}>{s.name}</span>
                  <span className="text-xs font-mono flex-shrink-0" style={{ color: SOURCE_COLORS[i % SOURCE_COLORS.length] }}>
                    {s.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TiltCard>

        {/* CHART 3 — Leads by City (horizontal pill bars) */}
        <TiltCard className="p-5" intensity={3}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold font-sans" style={{ color: CARD_FG }}>Leads by Area</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: DIM_FG }}>Sorted by volume</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {cityData.map((c, i) => {
              const pct = (c.count / maxCity) * 100
              // intensity: brightest = first, dims down
              const opacity = 1 - i * 0.14
              return (
                <div key={c.city} className="flex items-center gap-3">
                  <span
                    className="text-xs font-mono w-20 text-right flex-shrink-0"
                    style={{ color: DIM_FG }}
                  >
                    {c.city}
                  </span>
                  <div
                    className="flex-1 h-5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: `rgba(59, 130, 246, ${opacity})`,
                        boxShadow: i === 0 ? `0 0 8px rgba(59,130,246,0.35)` : "none",
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-mono w-8 flex-shrink-0 text-right"
                    style={{ color: i === 0 ? BLUE_LT : DIM_FG }}
                  >
                    {c.count}
                  </span>
                </div>
              )
            })}
          </div>
        </TiltCard>

        {/* CHART 4 — Revenue Pipeline (stacked bar) */}
        <TiltCard className="p-5" intensity={3}>
          {/* Summary row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold font-sans" style={{ color: CARD_FG }}>Revenue Pipeline</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: DIM_FG }}>Potential vs. Converted</p>
            </div>
          </div>
          {/* KPI mini-cards */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: "Pipeline",   value: fmt(pipelineTotal),  color: BLUE_LT },
              { label: "Converted",  value: fmt(convertedTotal), color: GREEN_LT },
              { label: "Conv. Rate", value: `${convRate}%`,       color: AMBER },
            ].map((k) => (
              <div
                key={k.label}
                className="flex flex-col gap-0.5 px-3 py-2 rounded-lg"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-xs font-sans" style={{ color: DIM_FG }}>{k.label}</span>
                <span className="text-sm font-bold font-mono" style={{ color: k.color }}>{k.value}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: DIM_FG, fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtK} tick={{ fill: DIM_FG, fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <Tooltip
                content={
                  <ChartTooltip
                    formatter={(_, v) => fmt(v)}
                  />
                }
              />
              <Bar dataKey="potential" name="Potential"  stackId="rev" fill="rgba(59,130,246,0.22)" radius={[0, 0, 3, 3]} />
              <Bar dataKey="converted" name="Converted"  stackId="rev" fill={GREEN} radius={[3, 3, 0, 0]}>
                {revenueData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={GREEN}
                    style={{ filter: "drop-shadow(0 0 3px rgba(34,197,94,0.35))" }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </TiltCard>
      </div>
    </div>
  )
}
