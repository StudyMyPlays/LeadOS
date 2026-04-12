"use client"

import { useState } from "react"
import {
  LayoutGrid,
  List,
  Filter,
  BarChart2,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
  clientName: string
  accentColor: string
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "leads",     label: "All Leads", icon: List },
  { id: "pipeline",  label: "Pipeline",  icon: Filter },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "settings",  label: "Settings",  icon: Settings },
]

export default function Sidebar({ activeSection, onNavigate, clientName, accentColor }: SidebarProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <aside
      className="relative flex flex-col h-full transition-all duration-300 ease-in-out"
      style={{
        width: expanded ? 220 : 64,
        background: "rgba(5, 8, 16, 0.92)",
        borderRight: "1px solid rgba(0, 245, 255, 0.12)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        flexShrink: 0,
      }}
    >
      {/* Logo row */}
      <div
        className="flex items-center h-12 px-3 gap-3 overflow-hidden"
        style={{ borderBottom: "1px solid rgba(0, 245, 255, 0.1)" }}
      >
        {/* Icon mark */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono"
          style={{
            background: `rgba(0, 245, 255, 0.12)`,
            border: `1px solid rgba(0, 245, 255, 0.3)`,
            color: accentColor,
            boxShadow: `0 0 12px rgba(0, 245, 255, 0.2)`,
          }}
        >
          {clientName.charAt(0)}
        </div>
        {expanded && (
          <span
            className="text-sm font-semibold font-sans truncate"
            style={{ color: "#e8f4f8" }}
          >
            {clientName}
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-2 flex-1 mt-2">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={cn(
                "nav-item flex items-center gap-3 rounded-lg px-2 py-2.5 w-full text-left",
                isActive ? "active" : ""
              )}
              style={{
                color: isActive ? accentColor : "rgba(232,244,248,0.65)",
                minHeight: 40,
              }}
              title={!expanded ? label : undefined}
            >
              <Icon
                size={18}
                className="flex-shrink-0"
                style={{ color: isActive ? accentColor : "rgba(232,244,248,0.5)" }}
              />
              {expanded && (
                <span className="text-sm font-medium font-sans truncate">{label}</span>
              )}
              {expanded && isActive && (
                <span
                  className="ml-auto w-1 h-4 rounded-full flex-shrink-0"
                  style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-2" style={{ borderTop: "1px solid rgba(0, 245, 255, 0.1)" }}>
        <button
          className="nav-item flex items-center gap-3 rounded-lg px-2 py-2.5 w-full text-left"
          style={{ color: "rgba(255,77,109,0.8)" }}
          title={!expanded ? "Logout" : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" style={{ color: "rgba(255,77,109,0.7)" }} />
          {expanded && <span className="text-sm font-medium font-sans">Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center z-10"
        style={{
          background: "#050810",
          border: "1px solid rgba(0,245,255,0.25)",
          color: "#00F5FF",
          boxShadow: "0 0 8px rgba(0,245,255,0.2)",
        }}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        <ChevronRight
          size={12}
          className="transition-transform duration-300"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
    </aside>
  )
}
