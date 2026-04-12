"use client"

import TiltCard from "./TiltCard"
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts"

const MONTHLY = [
  { month: "Oct", revenue: 8200,  leads: 88 },
  { month: "Nov", revenue: 10400, leads: 112 },
  { month: "Dec", revenue: 7900,  leads: 79 },
  { month: "Jan", revenue: 12600, leads: 138 },
  { month: "Feb", revenue: 15100, leads: 165 },
  { month: "Mar", revenue: 18400, leads: 197 },
  { month: "Apr", revenue: 21200, leads: 228 },
]

const SOURCE_DATA = [
  { name: "Google Ads", value: 42 },
  { name: "Referral",   value: 23 },
  { name: "Website",    value: 18 },
  { name: "Facebook",   value: 11 },
  { name: "Yelp",       value: 6 },
]

const COLORS = ["#00F5FF", "#39FF14", "#00b4d8", "#7b2fff", "#ff9f1c"]

const RADIAL_DATA = [
  { name: "Conversion", value: 31, fill: "#00F5FF" },
  { name: "Close Rate", value: 68, fill: "#39FF14" },
  { name: "Retention",  value: 84, fill: "#7b2fff" },
]

export default function AnalyticsView({ config }: { config: { currency: string; services: string[] } }) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: config.currency, maximumFractionDigits: 0 }).format(n)

  return (
    <div className="flex flex-col gap-4">
      {/* Revenue trend */}
      <TiltCard className="p-5" intensity={3}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold font-sans" style={{ color: "#e8f4f8" }}>Revenue Trend</p>
            <p className="text-xs font-mono mt-0.5" style={{ color: "rgba(232,244,248,0.4)" }}>Last 7 months</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold font-mono glow-green">{fmt(21200)}</p>
            <p className="text-xs font-mono" style={{ color: "rgba(232,244,248,0.4)" }}>This month</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={MONTHLY} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#39FF14" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#39FF14" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: "rgba(232,244,248,0.4)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fill: "rgba(232,244,248,0.4)", fontSize: 11, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v: number) => [fmt(v), "Revenue"]}
              contentStyle={{ background: "rgba(5,8,16,0.95)", border: "1px solid rgba(57,255,20,0.2)", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 12, color: "#e8f4f8" }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#39FF14" strokeWidth={2} fill="url(#gRevenue)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </TiltCard>

      {/* Row: source pie + radial + bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Source pie */}
        <TiltCard className="p-5" intensity={5}>
          <p className="text-sm font-semibold font-sans mb-4" style={{ color: "#e8f4f8" }}>Lead Sources</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={130}>
              <PieChart>
                <Pie data={SOURCE_DATA} dataKey="value" cx="50%" cy="50%" outerRadius={55} innerRadius={30} strokeWidth={0}>
                  {SOURCE_DATA.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "rgba(5,8,16,0.95)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "#e8f4f8" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 flex-1">
              {SOURCE_DATA.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                  <span className="text-xs font-sans truncate" style={{ color: "rgba(232,244,248,0.6)" }}>{s.name}</span>
                  <span className="text-xs font-mono ml-auto" style={{ color: COLORS[i] }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </TiltCard>

        {/* Radial KPIs */}
        <TiltCard className="p-5" intensity={5}>
          <p className="text-sm font-semibold font-sans mb-4" style={{ color: "#e8f4f8" }}>Key Rates</p>
          <div className="flex flex-col gap-3">
            {RADIAL_DATA.map((item) => (
              <div key={item.name} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="font-sans" style={{ color: "rgba(232,244,248,0.5)" }}>{item.name}</span>
                  <span className="font-mono font-bold" style={{ color: item.fill }}>{item.value}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${item.value}%`,
                      background: item.fill,
                      boxShadow: `0 0 8px ${item.fill}66`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </TiltCard>

        {/* Monthly leads bar */}
        <TiltCard className="p-5" intensity={5}>
          <p className="text-sm font-semibold font-sans mb-4" style={{ color: "#e8f4f8" }}>Monthly Leads</p>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={MONTHLY} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fill: "rgba(232,244,248,0.4)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(v: number) => [v, "Leads"]}
                contentStyle={{ background: "rgba(5,8,16,0.95)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "#e8f4f8" }}
              />
              <Bar dataKey="leads" radius={[3, 3, 0, 0]}>
                {MONTHLY.map((_, i) => (
                  <Cell key={i} fill={i === MONTHLY.length - 1 ? "#00F5FF" : "rgba(0,245,255,0.35)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </TiltCard>
      </div>
    </div>
  )
}
