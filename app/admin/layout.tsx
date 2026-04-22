"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Sidebar from "@/components/dashboard/Sidebar"
import AdminPageHeader from "@/components/admin/AdminPageHeader"

const CONFIG_KEY = "leadosConfig"
const SESSION_KEY = "leadosSession"
const ACTIVE_SECTION_KEY = "leadosActiveSection"

const PAGE_NAMES: Record<string, string> = {
  "/admin/users": "User Management",
  "/admin/notifications": "Notifications",
  "/admin/config": "Settings",
}

function derivePageName(pathname: string): string {
  if (PAGE_NAMES[pathname]) return PAGE_NAMES[pathname]
  // Fallback for nested segments: /admin/users/foo → "User Management"
  const match = Object.keys(PAGE_NAMES).find((p) => pathname.startsWith(p))
  return match ? PAGE_NAMES[match] : "Admin"
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname() ?? ""

  const [clientName, setClientName] = useState("LeadOS")
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  // Hydrate from storage so the admin chrome stays in sync with the main dashboard.
  useEffect(() => {
    try {
      const rawConfig = window.localStorage.getItem(CONFIG_KEY)
      if (rawConfig) {
        const parsed = JSON.parse(rawConfig)
        if (parsed?.clientName) setClientName(String(parsed.clientName))
      }

      const rawSession = window.sessionStorage.getItem(SESSION_KEY)
      if (rawSession) {
        const s = JSON.parse(rawSession)
        if (s?.email) setUserEmail(String(s.email))
      }
    } catch {
      // ignore
    }
  }, [])

  /**
   * Workspace nav (Dashboard / Leads / Pipeline / Analytics) is clicked from
   * within an admin page. Persist the requested section and jump back to `/`
   * so Home can restore it via the `?returnTo=admin` flow.
   */
  const handleNavigate = (section: string) => {
    try {
      window.sessionStorage.setItem(ACTIVE_SECTION_KEY, section)
    } catch {
      // ignore
    }
    router.push("/?returnTo=admin")
  }

  const handleLogout = () => {
    try {
      window.sessionStorage.removeItem(SESSION_KEY)
      window.sessionStorage.removeItem(ACTIVE_SECTION_KEY)
    } catch {
      // ignore
    }
    router.push("/")
  }

  const pageName = derivePageName(pathname)

  return (
    <div
      className="relative flex h-screen w-screen overflow-hidden"
      style={{ background: "#08080a" }}
    >
      <div
        className="grid-bg absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full w-full">
        <Sidebar
          activeSection=""
          onNavigate={handleNavigate}
          clientName={clientName}
          role="owner"
          userEmail={userEmail}
          onLogout={handleLogout}
          expanded={sidebarExpanded}
        />

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <AdminPageHeader pageName={pageName} />

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
