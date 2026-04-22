"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronRight } from "lucide-react"

const CONFIG_KEY = "leadosConfig"

interface AdminPageHeaderProps {
  pageName: string
}

/**
 * Sticky header rendered on every admin page via app/admin/layout.tsx.
 *
 * Layout:
 *   [← Back to Dashboard]   Dashboard / Admin / [Page Name]            [Client Badge]
 *
 * The page name is keyed to force the mount animation on route changes so
 * each admin view gets a subtle slide-up fade-in on arrival.
 */
export default function AdminPageHeader({ pageName }: AdminPageHeaderProps) {
  const router = useRouter()
  const [clientName, setClientName] = useState("LeadOS")

  useEffect(() => {
    // Read persisted client config (written by the admin Settings panel).
    try {
      const raw = window.localStorage.getItem(CONFIG_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed.clientName === "string" && parsed.clientName.trim()) {
        setClientName(parsed.clientName.trim())
      }
    } catch {
      // ignore — fall back to default
    }
  }, [])

  const handleBack = () => {
    router.push("/?returnTo=admin")
  }

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 md:px-6 h-12 shrink-0"
      style={{
        background: "rgba(8,8,10,0.88)",
        borderBottom: "1px solid rgba(255,255,255,0.055)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Left: Back + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg transition-colors flex-shrink-0"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "rgba(200,205,216,0.7)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(59,130,246,0.10)"
            e.currentTarget.style.borderColor = "rgba(59,130,246,0.28)"
            e.currentTarget.style.color = "#93c5fd"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.03)"
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"
            e.currentTarget.style.color = "rgba(200,205,216,0.7)"
          }}
          aria-label="Back to dashboard"
          title="Back to dashboard"
        >
          <ArrowLeft size={12} />
          <span className="hidden sm:inline text-[11px] font-medium font-sans">
            Back to Dashboard
          </span>
        </button>

        {/* Breadcrumb — hides on very small screens so the back button keeps its label */}
        <nav
          aria-label="Breadcrumb"
          className="hidden md:flex items-center gap-1.5 min-w-0"
        >
          <span
            className="text-[11px] font-mono uppercase tracking-[0.1em]"
            style={{ color: "rgba(200,205,216,0.38)" }}
          >
            Dashboard
          </span>
          <ChevronRight size={11} aria-hidden style={{ color: "rgba(200,205,216,0.25)" }} />
          <span
            className="text-[11px] font-mono uppercase tracking-[0.1em]"
            style={{ color: "rgba(16,185,129,0.78)" }}
          >
            Admin
          </span>
          <ChevronRight size={11} aria-hidden style={{ color: "rgba(200,205,216,0.25)" }} />
          <h1
            key={pageName}
            className="text-[11px] font-mono uppercase tracking-[0.1em] truncate animate-in slide-in-from-bottom-2 fade-in duration-200"
            style={{ color: "#e2e8f0" }}
          >
            {pageName}
          </h1>
        </nav>
      </div>

      {/* Right: Client badge (matches the one in the main Topbar for visual continuity) */}
      <span
        className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full font-mono truncate max-w-[160px] flex-shrink-0"
        style={{
          background: "rgba(59,130,246,0.08)",
          color: "#93c5fd",
          border: "1px solid rgba(59,130,246,0.18)",
        }}
        title={clientName}
      >
        {clientName}
      </span>
    </header>
  )
}
