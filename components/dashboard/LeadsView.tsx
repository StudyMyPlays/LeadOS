"use client"

import { useState } from "react"
import TiltCard from "./TiltCard"
import { Search, SlidersHorizontal, ChevronDown, Phone, Mail, Star } from "lucide-react"

const LEADS = [
  { id: 1, name: "Robert Martinez",  service: "Tree Removal",   city: "Denver",  status: "hot",    value: 1850, source: "Google Ads", date: "Apr 10" },
  { id: 2, name: "Sarah Kim",        service: "Stump Grinding", city: "Boulder", status: "warm",   value: 420,  source: "Referral",   date: "Apr 10" },
  { id: 3, name: "James O'Brien",    service: "Trimming",       city: "Aurora",  status: "new",    value: 310,  source: "Website",    date: "Apr 9"  },
  { id: 4, name: "Priya Patel",      service: "Tree Removal",   city: "Denver",  status: "hot",    value: 2200, source: "Google Ads", date: "Apr 9"  },
  { id: 5, name: "Carlos Rivera",    service: "Trimming",       city: "Boulder", status: "warm",   value: 275,  source: "Facebook",   date: "Apr 8"  },
  { id: 6, name: "Emily Thompson",   service: "Tree Removal",   city: "Denver",  status: "closed", value: 1640, source: "Google Ads", date: "Apr 8"  },
  { id: 7, name: "Marcus Johnson",   service: "Stump Grinding", city: "Aurora",  status: "new",    value: 390,  source: "Yelp",       date: "Apr 7"  },
  { id: 8, name: "Olivia Chen",      service: "Tree Removal",   city: "Boulder", status: "hot",    value: 3100, source: "Referral",   date: "Apr 7"  },
  { id: 9, name: "David Park",       service: "Trimming",       city: "Denver",  status: "warm",   value: 220,  source: "Website",    date: "Apr 6"  },
  { id: 10,name: "Natasha Gomez",    service: "Stump Grinding", city: "Aurora",  status: "closed", value: 510,  source: "Google Ads", date: "Apr 5"  },
]

const STATUS_BADGE: Record<string, string> = {
  hot:    "badge-green",
  warm:   "badge-cyan",
  new:    "badge-red",
  closed: "badge-cyan",
}

export default function LeadsView({ config }: { config: { accentColor: string; currency: string; services: string[]; cities: string[] } }) {
  const [search, setSearch] = useState("")
  const [filterService, setFilterService] = useState("All")
  const [starred, setStarred] = useState<number[]>([])

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: config.currency, maximumFractionDigits: 0 }).format(n)

  const filtered = LEADS.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase())
    const matchService = filterService === "All" || l.service === filterService
    return matchSearch && matchService
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 h-8 rounded-lg text-xs flex-1 min-w-[180px]"
          style={{ background: "rgba(0,245,255,0.06)", border: "1px solid rgba(0,245,255,0.14)" }}
        >
          <Search size={12} style={{ color: "rgba(232,244,248,0.4)" }} />
          <input
            type="text"
            placeholder="Search leads…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full font-mono text-xs"
            style={{ color: "#e8f4f8" }}
          />
        </div>

        {/* Service filter */}
        <div
          className="flex items-center gap-2 px-3 h-8 rounded-lg text-xs cursor-pointer"
          style={{ background: "rgba(0,245,255,0.06)", border: "1px solid rgba(0,245,255,0.14)", color: "rgba(232,244,248,0.6)" }}
        >
          <SlidersHorizontal size={12} />
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="bg-transparent outline-none font-mono text-xs cursor-pointer"
            style={{ color: "rgba(232,244,248,0.7)" }}
          >
            <option value="All">All Services</option>
            {config.services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={10} />
        </div>

        <div
          className="text-xs font-mono px-3 h-8 flex items-center rounded-lg"
          style={{ color: "rgba(232,244,248,0.4)" }}
        >
          {filtered.length} leads
        </div>
      </div>

      {/* Table */}
      <TiltCard className="overflow-hidden" intensity={2}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,245,255,0.1)", background: "rgba(0,245,255,0.03)" }}>
                {["", "Name", "Service", "City", "Source", "Status", "Est. Value", "Date", ""].map((h, i) => (
                  <th key={i} className={`px-4 py-3 font-medium text-left`} style={{ color: "rgba(232,244,248,0.4)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="group"
                  style={{
                    borderBottom: "1px solid rgba(0,245,255,0.05)",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,245,255,0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Star */}
                  <td className="px-4 py-3 w-8">
                    <button onClick={() => setStarred((s) => s.includes(lead.id) ? s.filter((x) => x !== lead.id) : [...s, lead.id])}>
                      <Star
                        size={13}
                        style={{
                          color: starred.includes(lead.id) ? "#39FF14" : "rgba(232,244,248,0.2)",
                          fill: starred.includes(lead.id) ? "#39FF14" : "transparent",
                        }}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: "#e8f4f8" }}>{lead.name}</td>
                  <td className="px-4 py-3" style={{ color: "rgba(232,244,248,0.55)" }}>{lead.service}</td>
                  <td className="px-4 py-3" style={{ color: "rgba(232,244,248,0.55)" }}>{lead.city}</td>
                  <td className="px-4 py-3 font-mono" style={{ color: "rgba(232,244,248,0.45)" }}>{lead.source}</td>
                  <td className="px-4 py-3">
                    <span className={`${STATUS_BADGE[lead.status]} px-2 py-0.5 rounded-full text-xs`}>{lead.status}</span>
                  </td>
                  <td className="px-4 py-3 font-mono" style={{ color: "#39FF14" }}>{fmt(lead.value)}</td>
                  <td className="px-4 py-3 font-mono" style={{ color: "rgba(232,244,248,0.35)" }}>{lead.date}</td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="w-6 h-6 rounded flex items-center justify-center"
                        style={{ background: "rgba(0,245,255,0.1)", color: "#00F5FF" }}
                        aria-label="Call"
                      >
                        <Phone size={11} />
                      </button>
                      <button
                        className="w-6 h-6 rounded flex items-center justify-center"
                        style={{ background: "rgba(57,255,20,0.1)", color: "#39FF14" }}
                        aria-label="Email"
                      >
                        <Mail size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TiltCard>
    </div>
  )
}
