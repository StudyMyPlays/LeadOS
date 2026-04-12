"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import DashboardView from "./DashboardView"
import LeadsView from "./LeadsView"
import PipelineView from "./PipelineView"
import AnalyticsView from "./AnalyticsView"
import SettingsView from "./SettingsView"

// Dynamically import particle background to avoid SSR issues
const ParticleBackground = dynamic(() => import("./ParticleBackground"), { ssr: false })

// ─────────────────────────────────────────────────────────────────
// DASHBOARD CONFIG — reskin this for any client
// ─────────────────────────────────────────────────────────────────
const DASHBOARD_CONFIG = {
  clientName: "Mendez Tree Removal LLC",
  clientLogo: null,
  accentColor: "#00F5FF",
  currency: "USD",
  services: ["Tree Removal", "Stump Grinding", "Trimming"],
  cities: ["Denver", "Aurora", "Boulder"],
}
// ─────────────────────────────────────────────────────────────────

type Section = "dashboard" | "leads" | "pipeline" | "analytics" | "settings"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard")

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardView config={DASHBOARD_CONFIG} />
      case "leads":
        return <LeadsView config={DASHBOARD_CONFIG} />
      case "pipeline":
        return <PipelineView config={DASHBOARD_CONFIG} />
      case "analytics":
        return <AnalyticsView config={DASHBOARD_CONFIG} />
      case "settings":
        return <SettingsView config={DASHBOARD_CONFIG} />
      default:
        return <DashboardView config={DASHBOARD_CONFIG} />
    }
  }

  return (
    <div className="relative flex h-screen w-screen overflow-hidden" style={{ background: "#050810" }}>
      {/* Layer 0: animated grid */}
      <div
        className="grid-bg absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      {/* Layer 1: particles */}
      <ParticleBackground />

      {/* Layer 2: app chrome */}
      <div className="relative z-10 flex h-full w-full">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onNavigate={(s) => setActiveSection(s as Section)}
          clientName={DASHBOARD_CONFIG.clientName}
          accentColor={DASHBOARD_CONFIG.accentColor}
        />

        {/* Main */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar
            activeSection={activeSection}
            clientName={DASHBOARD_CONFIG.clientName}
            accentColor={DASHBOARD_CONFIG.accentColor}
          />

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto p-5 md:p-6">
            {renderSection()}
          </main>
        </div>
      </div>
    </div>
  )
}
