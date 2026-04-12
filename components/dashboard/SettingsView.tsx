"use client"

import TiltCard from "./TiltCard"
import { Save, RefreshCw } from "lucide-react"

interface Config {
  clientName: string
  accentColor: string
  currency: string
  services: string[]
  cities: string[]
}

export default function SettingsView({ config }: { config: Config }) {
  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <TiltCard className="p-6" intensity={3}>
        <p className="text-sm font-semibold font-sans mb-5" style={{ color: "#e8f4f8" }}>
          White-Label Configuration
        </p>

        <div className="flex flex-col gap-5">
          {/* Client Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono" style={{ color: "rgba(232,244,248,0.5)" }}>
              Client Name
            </label>
            <input
              type="text"
              defaultValue={config.clientName}
              className="h-9 px-3 rounded-lg text-sm font-sans outline-none"
              style={{
                background: "rgba(0,245,255,0.05)",
                border: "1px solid rgba(0,245,255,0.2)",
                color: "#e8f4f8",
              }}
            />
          </div>

          {/* Accent color */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono" style={{ color: "rgba(232,244,248,0.5)" }}>
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                defaultValue={config.accentColor}
                className="w-9 h-9 rounded-lg cursor-pointer border-0"
                style={{ background: "transparent" }}
              />
              <span className="text-xs font-mono" style={{ color: config.accentColor }}>
                {config.accentColor}
              </span>
            </div>
          </div>

          {/* Currency */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono" style={{ color: "rgba(232,244,248,0.5)" }}>
              Currency
            </label>
            <select
              defaultValue={config.currency}
              className="h-9 px-3 rounded-lg text-sm font-mono outline-none"
              style={{
                background: "rgba(0,245,255,0.05)",
                border: "1px solid rgba(0,245,255,0.2)",
                color: "#e8f4f8",
              }}
            >
              <option value="USD">USD</option>
              <option value="CAD">CAD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono" style={{ color: "rgba(232,244,248,0.5)" }}>
              Services (comma separated)
            </label>
            <input
              type="text"
              defaultValue={config.services.join(", ")}
              className="h-9 px-3 rounded-lg text-sm font-mono outline-none"
              style={{
                background: "rgba(0,245,255,0.05)",
                border: "1px solid rgba(0,245,255,0.2)",
                color: "#e8f4f8",
              }}
            />
          </div>

          {/* Cities */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono" style={{ color: "rgba(232,244,248,0.5)" }}>
              Service Cities (comma separated)
            </label>
            <input
              type="text"
              defaultValue={config.cities.join(", ")}
              className="h-9 px-3 rounded-lg text-sm font-mono outline-none"
              style={{
                background: "rgba(0,245,255,0.05)",
                border: "1px solid rgba(0,245,255,0.2)",
                color: "#e8f4f8",
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              className="flex items-center gap-2 px-4 h-8 rounded-lg text-xs font-mono font-semibold"
              style={{
                background: "rgba(0,245,255,0.12)",
                border: "1px solid rgba(0,245,255,0.3)",
                color: "#00F5FF",
              }}
            >
              <Save size={12} /> Save Config
            </button>
            <button
              className="flex items-center gap-2 px-4 h-8 rounded-lg text-xs font-mono"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(232,244,248,0.5)",
              }}
            >
              <RefreshCw size={12} /> Reset
            </button>
          </div>
        </div>
      </TiltCard>

      {/* Config preview */}
      <TiltCard className="p-5" intensity={3}>
        <p className="text-xs font-mono mb-3" style={{ color: "rgba(232,244,248,0.4)" }}>
          DASHBOARD_CONFIG preview
        </p>
        <pre
          className="text-xs font-mono leading-relaxed overflow-x-auto"
          style={{ color: "#00F5FF", opacity: 0.8 }}
        >
          {JSON.stringify(config, null, 2)}
        </pre>
      </TiltCard>
    </div>
  )
}
