"use client"

import TiltCard from "./TiltCard"
import { Phone, Calendar, DollarSign } from "lucide-react"

const STAGES = [
  {
    id: "new",
    label: "New",
    color: "#00F5FF",
    count: 18,
    value: 12400,
    cards: [
      { name: "Robert Martinez", service: "Tree Removal", city: "Denver", value: 1850 },
      { name: "Priya Patel",     service: "Tree Removal", city: "Denver", value: 2200 },
      { name: "Marcus Johnson",  service: "Stump Grinding",city:"Aurora", value: 390  },
    ],
  },
  {
    id: "contacted",
    label: "Contacted",
    color: "#00b4d8",
    count: 12,
    value: 9800,
    cards: [
      { name: "Sarah Kim",    service: "Stump Grinding", city: "Boulder", value: 420 },
      { name: "David Park",  service: "Trimming",        city: "Denver",  value: 220 },
    ],
  },
  {
    id: "quoted",
    label: "Quoted",
    color: "#7b2fff",
    count: 8,
    value: 21600,
    cards: [
      { name: "Olivia Chen",     service: "Tree Removal", city: "Boulder", value: 3100 },
      { name: "Carlos Rivera",   service: "Trimming",     city: "Boulder", value: 275  },
    ],
  },
  {
    id: "closed",
    label: "Closed Won",
    color: "#39FF14",
    count: 5,
    value: 14870,
    cards: [
      { name: "Emily Thompson", service: "Tree Removal",   city: "Denver", value: 1640 },
      { name: "Natasha Gomez",  service: "Stump Grinding", city: "Aurora", value: 510  },
    ],
  },
]

export default function PipelineView({ config }: { config: { currency: string } }) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: config.currency, maximumFractionDigits: 0 }).format(n)

  return (
    <div className="flex flex-col gap-4">
      {/* Funnel progress bar */}
      <TiltCard className="p-5" intensity={3}>
        <p className="text-sm font-semibold font-sans mb-4" style={{ color: "#e8f4f8" }}>
          Pipeline Funnel
        </p>
        <div className="flex flex-col gap-3">
          {STAGES.map((stage, i) => {
            const pct = Math.round(100 - i * 22)
            return (
              <div key={stage.id} className="flex items-center gap-3">
                <div className="w-20 text-xs font-mono shrink-0" style={{ color: "rgba(232,244,248,0.55)" }}>
                  {stage.label}
                </div>
                <div className="flex-1 h-5 rounded-lg overflow-hidden" style={{ background: "rgba(0,245,255,0.06)" }}>
                  <div
                    className="h-full rounded-lg flex items-center px-2 transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${stage.color}cc, ${stage.color}66)`,
                      boxShadow: `0 0 10px ${stage.color}44`,
                    }}
                  >
                    <span className="text-xs font-mono font-bold" style={{ color: "#050810" }}>
                      {stage.count}
                    </span>
                  </div>
                </div>
                <div className="w-20 text-right text-xs font-mono" style={{ color: stage.color }}>
                  {fmt(stage.value)}
                </div>
              </div>
            )
          })}
        </div>
      </TiltCard>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAGES.map((stage) => (
          <div key={stage.id} className="flex flex-col gap-3">
            {/* Column header */}
            <div
              className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ background: `${stage.color}10`, border: `1px solid ${stage.color}25` }}
            >
              <span className="text-xs font-semibold font-sans" style={{ color: stage.color }}>
                {stage.label}
              </span>
              <span
                className="text-xs font-mono px-1.5 py-0.5 rounded-full"
                style={{ background: `${stage.color}20`, color: stage.color }}
              >
                {stage.count}
              </span>
            </div>

            {/* Cards */}
            {stage.cards.map((card, ci) => (
              <TiltCard key={ci} className="p-3" intensity={9}>
                <p className="text-xs font-semibold font-sans mb-1" style={{ color: "#e8f4f8" }}>
                  {card.name}
                </p>
                <p className="text-xs font-mono mb-2" style={{ color: "rgba(232,244,248,0.45)" }}>
                  {card.service} · {card.city}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold" style={{ color: "#39FF14", textShadow: "0 0 8px rgba(57,255,20,0.5)" }}>
                    {fmt(card.value)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      className="w-5 h-5 rounded flex items-center justify-center"
                      style={{ background: "rgba(0,245,255,0.1)", color: "#00F5FF" }}
                      aria-label="Call"
                    >
                      <Phone size={9} />
                    </button>
                    <button
                      className="w-5 h-5 rounded flex items-center justify-center"
                      style={{ background: "rgba(57,255,20,0.1)", color: "#39FF14" }}
                      aria-label="Schedule"
                    >
                      <Calendar size={9} />
                    </button>
                  </div>
                </div>
                {/* Stage color bar */}
                <div
                  className="mt-2 h-0.5 rounded-full"
                  style={{ background: stage.color, boxShadow: `0 0 6px ${stage.color}` }}
                />
              </TiltCard>
            ))}

            {/* Add placeholder */}
            <button
              className="w-full rounded-lg py-2 text-xs font-mono text-center transition-colors"
              style={{
                border: `1px dashed ${stage.color}30`,
                color: `${stage.color}50`,
              }}
            >
              + Add lead
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
