"use client"

import { useState, useRef } from "react"
import { Plus, X, Check, ArrowLeft, Save, Settings as SettingsIcon } from "lucide-react"

export interface DashboardConfig {
  clientName: string
  clientLogo: string | null
  accentColor: string
  currency: string
  services: string[]
  cities: string[]
  ownerEmail: string
  partnerEmail: string
  commissionPerLead: number
}

const DEFAULT_CONFIG: DashboardConfig = {
  clientName: "LeadOS",
  clientLogo: null,
  accentColor: "#3b82f6",
  currency: "USD",
  services: ["Consultation", "Installation", "Maintenance", "Emergency"],
  cities: ["New York", "Los Angeles", "Chicago"],
  ownerEmail: "owner@demo.com",
  partnerEmail: "partner@demo.com",
  commissionPerLead: 50,
}

function ChipInput({
  label,
  placeholder,
  items,
  onAdd,
  onRemove,
}: {
  label: string
  placeholder: string
  items: string[]
  onAdd: (v: string) => void
  onRemove: (v: string) => void
}) {
  const [val, setVal] = useState("")

  const commit = () => {
    const trimmed = val.trim()
    if (trimmed && !items.includes(trimmed)) onAdd(trimmed)
    setVal("")
  }

  return (
    <div>
      <label className="config-label">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          className="config-input"
          placeholder={placeholder}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); commit() }
          }}
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={commit}
          className="flex items-center justify-center rounded-lg px-3"
          style={{
            background: "rgba(59,130,246,0.10)",
            border: "1px solid rgba(59,130,246,0.25)",
            color: "#60a5fa",
            cursor: "pointer",
            flexShrink: 0,
          }}
          aria-label={`Add ${label}`}
        >
          <Plus size={14} />
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item} className="chip">
              {item}
              <button type="button" onClick={() => onRemove(item)} aria-label={`Remove ${item}`}>
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: "rgba(12,12,16,0.82)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
      }}
    >
      <h2
        className="text-xs font-mono font-semibold uppercase tracking-widest"
        style={{ color: "rgba(147,197,253,0.55)" }}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

interface AdminConfigPanelProps {
  onBack?: () => void
}

export default function AdminConfigPanel({ onBack }: AdminConfigPanelProps) {
  const [cfg, setCfg] = useState<DashboardConfig>(DEFAULT_CONFIG)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof DashboardConfig>(key: K, value: DashboardConfig[K]) =>
    setCfg((c) => ({ ...c, [key]: value }))

  const addTo = (key: "services" | "cities", val: string) =>
    set(key, [...cfg[key], val])

  const removeFrom = (key: "services" | "cities", val: string) =>
    set(key, cfg[key].filter((v) => v !== val))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    // In a real app: POST to /api/config
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => set("clientLogo", ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const isValid = cfg.clientName.trim() !== "" && cfg.ownerEmail.trim() !== ""

  return (
    <div className="min-h-screen w-full" style={{ background: "#06060a" }}>
      {/* Animated grid bg */}
      <div className="grid-bg fixed inset-0 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-8 flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "rgba(200,205,216,0.55)",
                  cursor: "pointer",
                }}
                aria-label="Back"
              >
                <ArrowLeft size={14} />
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{
                  background: "rgba(59,130,246,0.10)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  color: "#60a5fa",
                }}
              >
                <SettingsIcon size={15} />
              </div>
              <div>
                <div
                  className="text-[11px] font-mono uppercase tracking-[0.14em]"
                  style={{ color: "rgba(200,205,216,0.35)" }}
                >
                  LeadOS / Admin
                </div>
                <h1
                  className="text-xl font-semibold font-sans tracking-tight"
                  style={{ color: "#e2e8f0" }}
                >
                  Settings
                </h1>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold font-sans"
            style={{
              background: isValid ? "linear-gradient(135deg, #1e3a5f, #1d4ed8)" : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(59,130,246,0.30)",
              color: isValid ? "#fff" : "rgba(200,205,216,0.25)",
              cursor: isValid ? "pointer" : "not-allowed",
              boxShadow: isValid ? "0 2px 12px rgba(59,130,246,0.22)" : "none",
              transition: "all 0.15s",
            }}
          >
            {saved ? <><Check size={14} /> Saved</> : <><Save size={14} /> Save Settings</>}
          </button>
        </div>

        {/* Live brand preview bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: "rgba(59,130,246,0.05)",
            border: "1px solid rgba(59,130,246,0.14)",
          }}
        >
          {cfg.clientLogo
            ? <img src={cfg.clientLogo} alt="logo" className="w-9 h-9 rounded-lg object-cover" />
            : (
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold font-mono"
                style={{
                  background: `${cfg.accentColor}18`,
                  border: `1px solid ${cfg.accentColor}35`,
                  color: cfg.accentColor,
                }}
              >
                {cfg.clientName.charAt(0) || "?"}
              </div>
            )}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold font-sans truncate" style={{ color: "#e2e8f0" }}>
              {cfg.clientName || "Client Name"}
            </span>
            <span className="text-xs font-mono" style={{ color: "rgba(200,205,216,0.40)" }}>
              Brand preview
            </span>
          </div>
          <div
            className="ml-auto w-4 h-4 rounded-full flex-shrink-0"
            style={{ background: cfg.accentColor, boxShadow: `0 0 8px ${cfg.accentColor}80` }}
            title={`Accent: ${cfg.accentColor}`}
          />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Left column */}
          <div className="flex flex-col gap-5">

            <Section title="Client Identity">
              <div className="flex flex-col gap-1.5">
                <label className="config-label" htmlFor="clientName">Client Name</label>
                <input
                  id="clientName"
                  type="text"
                  className="config-input"
                  placeholder="Acme Services LLC"
                  value={cfg.clientName}
                  onChange={(e) => set("clientName", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="config-label">Client Logo</label>
                <div className="flex items-center gap-3 flex-wrap">
                  {cfg.clientLogo && (
                    <img src={cfg.clientLogo} alt="Logo preview" className="w-10 h-10 rounded-lg object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-sans"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      color: "rgba(200,205,216,0.60)",
                      cursor: "pointer",
                    }}
                  >
                    <Plus size={13} />
                    {cfg.clientLogo ? "Change Logo" : "Upload Logo"}
                  </button>
                  {cfg.clientLogo && (
                    <button
                      type="button"
                      onClick={() => set("clientLogo", null)}
                      className="text-xs font-sans"
                      style={{ color: "rgba(248,113,113,0.60)", background: "none", border: "none", cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="config-label" htmlFor="accentColor">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="accentColor"
                      type="color"
                      value={cfg.accentColor}
                      onChange={(e) => set("accentColor", e.target.value)}
                      className="rounded cursor-pointer"
                      style={{
                        width: 36, height: 36,
                        padding: 2,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        borderRadius: 8,
                      }}
                    />
                    <input
                      type="text"
                      className="config-input font-mono"
                      value={cfg.accentColor}
                      onChange={(e) => set("accentColor", e.target.value)}
                      style={{ flex: 1, fontSize: 12 }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="config-label" htmlFor="currency">Currency</label>
                  <select
                    id="currency"
                    className="config-input"
                    value={cfg.currency}
                    onChange={(e) => set("currency", e.target.value)}
                    style={{ cursor: "pointer" }}
                  >
                    {["USD", "CAD", "GBP", "EUR"].map((c) => (
                      <option key={c} value={c} style={{ background: "#0c0c10" }}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Section>

            <Section title="Access & Credentials">
              <div className="flex flex-col gap-1.5">
                <label className="config-label" htmlFor="ownerEmail">Owner Email</label>
                <input
                  id="ownerEmail"
                  type="email"
                  className="config-input"
                  placeholder="owner@client.com"
                  value={cfg.ownerEmail}
                  onChange={(e) => set("ownerEmail", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="config-label" htmlFor="partnerEmail">Partner Email</label>
                <input
                  id="partnerEmail"
                  type="email"
                  className="config-input"
                  placeholder="partner@client.com"
                  value={cfg.partnerEmail}
                  onChange={(e) => set("partnerEmail", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="config-label" htmlFor="commission">
                  Commission Per Converted Lead ({cfg.currency})
                </label>
                <input
                  id="commission"
                  type="number"
                  className="config-input font-mono"
                  min={0}
                  placeholder="50"
                  value={cfg.commissionPerLead}
                  onChange={(e) => set("commissionPerLead", Number(e.target.value))}
                />
                <p className="text-xs font-mono" style={{ color: "rgba(200,205,216,0.30)" }}>
                  Shown only in the Partner earnings view
                </p>
              </div>
            </Section>

          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            <Section title="Services">
              <ChipInput
                label="Services Offered"
                placeholder="e.g. Installation"
                items={cfg.services}
                onAdd={(v) => addTo("services", v)}
                onRemove={(v) => removeFrom("services", v)}
              />
            </Section>

            <Section title="Service Areas">
              <ChipInput
                label="Cities / Regions"
                placeholder="e.g. Denver"
                items={cfg.cities}
                onAdd={(v) => addTo("cities", v)}
                onRemove={(v) => removeFrom("cities", v)}
              />
            </Section>
          </div>
        </div>
      </div>
    </div>
  )
}
