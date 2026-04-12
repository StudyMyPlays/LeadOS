"use client"

import { Bell, Search } from "lucide-react"

interface TopbarProps {
  activeSection: string
  clientName: string
  accentColor: string
}

const SECTION_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  leads: "All Leads",
  pipeline: "Pipeline",
  analytics: "Analytics",
  settings: "Settings",
}

export default function Topbar({ activeSection, clientName, accentColor }: TopbarProps) {
  return (
    <header
      className="flex items-center justify-between px-5 h-12 shrink-0 z-10"
      style={{
        borderBottom: "1px solid rgba(0, 245, 255, 0.1)",
        background: "rgba(5, 8, 16, 0.80)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Left: section name */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold font-sans" style={{ color: "#e8f4f8" }}>
          {SECTION_LABELS[activeSection] ?? activeSection}
        </h1>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-mono"
          style={{
            background: `rgba(0,245,255,0.08)`,
            color: accentColor,
            border: `1px solid rgba(0,245,255,0.2)`,
          }}
        >
          {clientName}
        </span>
      </div>

      {/* Right: search + bell + avatar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          className="hidden md:flex items-center gap-2 px-3 h-7 rounded-lg text-xs font-mono"
          style={{
            background: "rgba(0,245,255,0.06)",
            border: "1px solid rgba(0,245,255,0.12)",
            color: "rgba(232,244,248,0.4)",
          }}
        >
          <Search size={12} />
          <span>Search…</span>
        </div>

        {/* Bell */}
        <button
          className="relative flex items-center justify-center w-7 h-7 rounded-lg"
          style={{
            background: "rgba(0,245,255,0.06)",
            border: "1px solid rgba(0,245,255,0.12)",
            color: "rgba(232,244,248,0.6)",
          }}
          aria-label="Notifications"
        >
          <Bell size={13} />
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
            style={{ background: "#39FF14", boxShadow: "0 0 6px #39FF14" }}
          />
        </button>

        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${accentColor}33, rgba(57,255,20,0.2))`,
            border: `1px solid ${accentColor}44`,
            color: accentColor,
          }}
          aria-label="User menu"
        >
          JD
        </div>
      </div>
    </header>
  )
}
