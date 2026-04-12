"use client"

import { useState, useEffect } from "react"
import { X, Phone, MapPin, Globe, Users, PhoneCall, Clock, FileText, Activity } from "lucide-react"
import {
  Lead, LeadStatus, STATUS_CONFIG, SERVICE_COLORS, SOURCE_LABELS,
} from "./leads-data"

interface LeadDrawerProps {
  lead: Lead | null
  onClose: () => void
  currency?: string
}

const ALL_STATUSES: LeadStatus[] = ["New", "Contacted", "Estimate", "Converted", "Lost"]

export default function LeadDrawer({ lead, onClose, currency = "USD" }: LeadDrawerProps) {
  const [visible, setVisible]     = useState(false)
  const [closing, setClosing]     = useState(false)
  const [activeTab, setActiveTab] = useState<"info" | "notes" | "activity">("info")
  const [localLead, setLocalLead] = useState<Lead | null>(null)
  const [note, setNote]           = useState("")

  // Sync lead into local state so status updates feel instant
  useEffect(() => {
    if (lead) {
      setLocalLead({ ...lead })
      setNote(lead.notes)
      setActiveTab("info")
      setClosing(false)
      // Tiny delay so the enter animation fires after mount
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
    }
  }, [lead])

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => { onClose(); setClosing(false) }, 220)
  }

  const setStatus = (s: LeadStatus) => {
    if (!localLead) return
    setLocalLead({ ...localLead, status: s })
  }

  if (!localLead && !closing) return null

  const sc       = localLead ? STATUS_CONFIG[localLead.status] : STATUS_CONFIG["New"]
  const svcColor = localLead ? (SERVICE_COLORS[localLead.service] ?? "#00F5FF") : "#00F5FF"
  const fmt      = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 modal-backdrop"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-label="Lead details"
        className={closing ? "drawer-exit" : "drawer-enter"}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(480px, 100vw)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          background: "#0c0c0f",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "-8px 0 48px rgba(0,0,0,0.7)",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold font-sans" style={{ color: "#d4d8e0" }}>
              {localLead?.name}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="flex items-center gap-1 text-xs font-mono"
                style={{ color: "rgba(212,216,224,0.4)" }}
              >
                <MapPin size={10} /> {localLead?.city}
              </span>
              <span
                className="inline-block px-2 py-0.5 rounded-md text-xs font-mono badge-3d"
                style={{
                  background: `${svcColor}14`,
                  border: `1px solid ${svcColor}30`,
                  color: svcColor,
                }}
              >
                {localLead?.service}
              </span>
              <span className={`${sc.badge} badge-3d inline-block px-2 py-0.5 rounded-full text-xs`}>
                {sc.label}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ml-3"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(212,216,224,0.5)",
            }}
            aria-label="Close drawer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Quick stats row */}
        <div
          className="grid grid-cols-3 divide-x"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            divideColor: "rgba(255,255,255,0.07)",
          }}
        >
          {[
            { label: "Est. Value", value: localLead ? fmt(localLead.estValue) : "--", color: "#39FF14" },
            { label: "Job Size",   value: localLead?.jobSize ?? "--",                  color: "#FFB800" },
            { label: "Date Added", value: localLead?.dateAdded ?? "--",                color: "rgba(212,216,224,0.6)" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center py-4 gap-0.5">
              <span
                className="text-base font-bold font-mono"
                style={{ color: stat.color, textShadow: stat.color !== "rgba(212,216,224,0.6)" ? `0 0 10px ${stat.color}60` : "none" }}
              >
                {stat.value}
              </span>
              <span className="text-xs font-sans" style={{ color: "rgba(212,216,224,0.35)" }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 px-4 pt-4 pb-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          {(["info", "notes", "activity"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium font-sans capitalize"
              style={{
                background: activeTab === tab ? "rgba(0,245,255,0.1)" : "transparent",
                color: activeTab === tab ? "#00F5FF" : "rgba(212,216,224,0.4)",
                border: activeTab === tab ? "1px solid rgba(0,245,255,0.25)" : "1px solid transparent",
              }}
            >
              {tab === "info"     && <FileText size={11} />}
              {tab === "notes"    && <FileText size={11} />}
              {tab === "activity" && <Activity size={11} />}
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 px-6 py-4 flex flex-col gap-5">

          {activeTab === "info" && localLead && (
            <InfoTab lead={localLead} />
          )}

          {activeTab === "notes" && (
            <div className="flex flex-col gap-3">
              <label className="text-xs font-mono" style={{ color: "rgba(212,216,224,0.4)" }}>
                Lead Notes
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={8}
                placeholder="Add notes about this lead…"
                className="w-full rounded-lg p-3 text-xs font-sans resize-none outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#d4d8e0",
                  lineHeight: 1.6,
                }}
              />
              <button
                className="self-end text-xs font-mono px-4 py-1.5 rounded-lg"
                style={{
                  background: "rgba(0,245,255,0.1)",
                  border: "1px solid rgba(0,245,255,0.25)",
                  color: "#00F5FF",
                }}
              >
                Save Notes
              </button>
            </div>
          )}

          {activeTab === "activity" && localLead && (
            <ActivityTab entries={localLead.activity} />
          )}

          {/* Status updater — always visible at bottom */}
          <div
            className="rounded-xl p-4 mt-auto flex flex-col gap-3"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-xs font-mono" style={{ color: "rgba(212,216,224,0.4)" }}>
              Update Status
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map((s) => {
                const cfg = STATUS_CONFIG[s]
                const isActive = localLead?.status === s
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`${cfg.badge} badge-3d px-3 py-1 rounded-full text-xs font-mono`}
                    style={{
                      opacity: isActive ? 1 : 0.45,
                      transform: isActive ? "scale(1.06)" : "scale(1)",
                      boxShadow: isActive ? `0 0 10px ${cfg.color}44` : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

// ── Info tab ─────────────────────────────────────────────────────
function InfoTab({ lead }: { lead: Lead }) {
  const [copied, setCopied] = useState(false)

  const copyPhone = () => {
    navigator.clipboard.writeText(lead.phone).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const sourceIcon = () => {
    const p = { size: 13, style: { color: "rgba(212,216,224,0.45)" } }
    if (lead.source === "website")    return <Globe    {...p} />
    if (lead.source === "referral")   return <Users    {...p} />
    if (lead.source === "door-knock") return <MapPin   {...p} />
    return                                   <PhoneCall {...p} />
  }

  const rows = [
    { label: "Phone",   value: lead.phone,                 icon: <Phone size={13} style={{ color: "rgba(212,216,224,0.45)" }} />, onClick: copyPhone, hint: copied ? "Copied!" : "Click to copy" },
    { label: "City",    value: lead.city,                  icon: <MapPin size={13} style={{ color: "rgba(212,216,224,0.45)" }} /> },
    { label: "Source",  value: SOURCE_LABELS[lead.source], icon: sourceIcon() },
    { label: "Service", value: lead.service,               icon: <FileText size={13} style={{ color: "rgba(212,216,224,0.45)" }} /> },
  ]

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center gap-3 px-4 py-3 rounded-lg"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          onClick={row.onClick}
          role={row.onClick ? "button" : undefined}
          title={row.hint}
        >
          {row.icon}
          <span className="text-xs font-mono w-16 flex-shrink-0" style={{ color: "rgba(212,216,224,0.35)" }}>
            {row.label}
          </span>
          <span
            className="text-xs font-sans font-medium"
            style={{ color: row.onClick && copied ? "#39FF14" : "#d4d8e0" }}
          >
            {row.onClick && copied ? "Copied!" : row.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Activity tab ─────────────────────────────────────────────────
function ActivityTab({ entries }: { entries: Lead["activity"] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-mono" style={{ color: "rgba(212,216,224,0.4)" }}>Activity Log</p>
      <div className="flex flex-col gap-0">
        {entries.slice().reverse().map((entry, i) => (
          <div key={entry.id} className="flex gap-3 relative">
            {/* Timeline line */}
            {i < entries.length - 1 && (
              <div
                className="absolute left-[7px] top-5 w-px"
                style={{ height: "calc(100% - 4px)", background: "rgba(255,255,255,0.07)" }}
              />
            )}
            {/* Dot */}
            <div
              className="w-3.5 h-3.5 rounded-full flex-shrink-0 mt-1"
              style={{
                background: i === 0 ? "#00F5FF" : "rgba(255,255,255,0.1)",
                border: `2px solid ${i === 0 ? "rgba(0,245,255,0.4)" : "rgba(255,255,255,0.12)"}`,
                boxShadow: i === 0 ? "0 0 8px rgba(0,245,255,0.4)" : "none",
              }}
            />
            <div className="pb-4 flex flex-col gap-0.5">
              <span className="text-xs font-sans" style={{ color: "rgba(212,216,224,0.75)" }}>
                {entry.text}
              </span>
              <span
                className="flex items-center gap-1 text-xs font-mono"
                style={{ color: "rgba(212,216,224,0.3)" }}
              >
                <Clock size={9} /> {entry.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
