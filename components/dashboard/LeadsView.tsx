"use client"

import { useState } from "react"
import { List, GitBranch } from "lucide-react"
import LeadsTable from "./LeadsTable"
import LeadDrawer from "./LeadDrawer"
import AddLeadModal from "./AddLeadModal"
import LeadRoutingPanel from "@/components/admin/LeadRoutingPanel"
import { Lead, SAMPLE_LEADS } from "./leads-data"
import { cn } from "@/lib/utils"

interface LeadsViewProps {
  config: {
    accentColor: string
    currency: string
    services: string[]
    cities: string[]
  }
  leads?: Lead[]
}

type Tab = "leads" | "routing"

export default function LeadsView({ config, leads = SAMPLE_LEADS }: LeadsViewProps) {
  const [allLeads, setAllLeads]         = useState<Lead[]>(leads)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [modalOpen, setModalOpen]       = useState(false)
  const [tab, setTab]                   = useState<Tab>("leads")

  const handleAddLead = (form: {
    name: string; city: string; phone: string; email: string; service: string
    source: Lead["source"]; jobSize: Lead["jobSize"]
    status: Lead["status"]; estValue: number; notes: string
  }) => {
    const newLead: Lead = {
      id: Date.now(),
      ...form,
      estValue: form.estValue || 0,
      dateAdded: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      activity: [
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
          text: "Lead created manually.",
        },
      ],
    }
    setAllLeads((prev) => [newLead, ...prev])
  }

  return (
    <>
      {/* Header + tab switcher */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold font-sans" style={{ color: "#d4d8e0" }}>
              {tab === "leads" ? "All Leads" : "Lead Routing Rules"}
            </h1>
            <p className="text-xs font-mono" style={{ color: "rgba(212,216,224,0.35)" }}>
              {tab === "leads"
                ? `${allLeads.length} total leads across ${config.cities.join(", ")}`
                : "Automatically assign incoming leads based on rules"}
            </p>
          </div>

          {/* Segmented tab switcher */}
          <div
            className="inline-flex items-center gap-1 p-1 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            role="tablist"
            aria-label="Leads section view"
          >
            <TabButton
              active={tab === "leads"}
              onClick={() => setTab("leads")}
              icon={<List size={14} />}
              label="Leads"
            />
            <TabButton
              active={tab === "routing"}
              onClick={() => setTab("routing")}
              icon={<GitBranch size={14} />}
              label="Routing Rules"
            />
          </div>
        </div>
      </div>

      {tab === "leads" ? (
        <>
          <LeadsTable
            leads={allLeads}
            currency={config.currency}
            onViewLead={setSelectedLead}
            onAddLead={() => setModalOpen(true)}
            allServices={config.services}
          />

          <LeadDrawer
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            currency={config.currency}
          />

          <AddLeadModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            services={config.services}
            cities={config.cities}
            onAdd={handleAddLead}
          />
        </>
      ) : (
        <LeadRoutingPanel />
      )}
    </>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium font-sans transition-colors",
      )}
      style={{
        color: active ? "#e8ecf4" : "rgba(200,205,216,0.55)",
        background: active ? "rgba(255,255,255,0.06)" : "transparent",
        border: active
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid transparent",
      }}
    >
      <span style={{ color: active ? "#60a5fa" : "rgba(200,205,216,0.5)" }}>{icon}</span>
      {label}
    </button>
  )
}
