"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { LeadStatus, LeadSource, JobSize } from "./leads-data"

interface AddLeadModalProps {
  open: boolean
  onClose: () => void
  services: string[]
  cities: string[]
  onAdd?: (lead: {
    name: string; city: string; phone: string; service: string
    source: LeadSource; jobSize: JobSize; status: LeadStatus; notes: string
  }) => void
}

const SOURCES: { value: LeadSource; label: string }[] = [
  { value: "website",    label: "Website" },
  { value: "referral",   label: "Referral" },
  { value: "door-knock", label: "Door Knock" },
  { value: "call-in",    label: "Call-In" },
]
const JOB_SIZES: JobSize[]   = ["$", "$$", "$$$"]
const STATUSES: LeadStatus[] = ["New", "Contacted", "Estimate", "Converted", "Lost"]

const EMPTY = {
  name: "", city: "", phone: "", service: "",
  source: "website" as LeadSource, jobSize: "$" as JobSize,
  status: "New" as LeadStatus, notes: "",
}

export default function AddLeadModal({ open, onClose, services, cities, onAdd }: AddLeadModalProps) {
  const [form, setForm]     = useState({ ...EMPTY })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!open) return null

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => { const n = { ...e }; delete n[k]; return n })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim())    e.name    = "Name is required"
    if (!form.phone.trim())   e.phone   = "Phone is required"
    if (!form.service.trim()) e.service = "Service is required"
    if (!form.city.trim())    e.city    = "City is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onAdd?.(form)
    setForm({ ...EMPTY })
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 modal-backdrop"
        style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-label="Add new lead"
        className="modal-enter fixed z-50 left-1/2 top-1/2"
        style={{ transform: "translate(-50%, -50%)", width: "min(520px, 95vw)" }}
      >
        <div
          style={{
            background: "#0d0d11",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,245,255,0.06)",
            overflow: "hidden",
          }}
        >
          {/* Modal header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(0,245,255,0.12)",
                  border: "1px solid rgba(0,245,255,0.3)",
                  color: "#00F5FF",
                  boxShadow: "0 0 12px rgba(0,245,255,0.2)",
                }}
              >
                <Plus size={14} />
              </div>
              <h2 className="text-sm font-semibold font-sans" style={{ color: "#d4d8e0" }}>
                Add New Lead
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(212,216,224,0.5)",
              }}
              aria-label="Close modal"
            >
              <X size={13} />
            </button>
          </div>

          {/* Form body */}
          <div className="px-6 py-5 flex flex-col gap-4">
            {/* Row 1: Name + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Full Name" error={errors.name} required>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="form-input"
                  style={inputStyle(!!errors.name)}
                />
              </FormField>
              <FormField label="Phone" error={errors.phone} required>
                <input
                  type="tel"
                  placeholder="720-555-0100"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className="form-input"
                  style={inputStyle(!!errors.phone)}
                />
              </FormField>
            </div>

            {/* Row 2: Service + City */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Service" error={errors.service} required>
                <select
                  value={form.service}
                  onChange={(e) => set("service", e.target.value)}
                  style={selectStyle(!!errors.service)}
                >
                  <option value="">Select service…</option>
                  {services.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>
              <FormField label="City" error={errors.city} required>
                <select
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  style={selectStyle(!!errors.city)}
                >
                  <option value="">Select city…</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </FormField>
            </div>

            {/* Row 3: Source + Job Size + Status */}
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Source">
                <select value={form.source} onChange={(e) => set("source", e.target.value)} style={selectStyle()}>
                  {SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </FormField>
              <FormField label="Job Size">
                <div className="flex gap-2">
                  {JOB_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => set("jobSize", size)}
                      className="flex-1 py-2 rounded-lg text-xs font-bold font-mono"
                      style={{
                        background: form.jobSize === size ? "rgba(255,184,0,0.15)" : "rgba(255,255,255,0.04)",
                        border: form.jobSize === size ? "1px solid rgba(255,184,0,0.4)" : "1px solid rgba(255,255,255,0.08)",
                        color: form.jobSize === size ? "#FFB800" : "rgba(212,216,224,0.4)",
                        boxShadow: form.jobSize === size ? "0 0 8px rgba(255,184,0,0.2)" : "none",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </FormField>
              <FormField label="Status">
                <select value={form.status} onChange={(e) => set("status", e.target.value)} style={selectStyle()}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>
            </div>

            {/* Notes */}
            <FormField label="Notes (optional)">
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
                placeholder="Additional details about this lead…"
                className="resize-none"
                style={inputStyle(false)}
              />
            </FormField>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 px-6 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <button
              onClick={onClose}
              className="h-9 px-5 rounded-lg text-xs font-medium font-sans"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(212,216,224,0.55)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="h-9 px-5 rounded-lg text-xs font-semibold font-sans flex items-center gap-2"
              style={{
                background: "rgba(0,245,255,0.13)",
                border: "1px solid rgba(0,245,255,0.35)",
                color: "#00F5FF",
                boxShadow: "0 0 16px rgba(0,245,255,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,245,255,0.2)"
                e.currentTarget.style.boxShadow  = "0 0 24px rgba(0,245,255,0.32)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0,245,255,0.13)"
                e.currentTarget.style.boxShadow  = "0 0 16px rgba(0,245,255,0.2)"
              }}
            >
              <Plus size={13} /> Add Lead
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Helpers ──────────────────────────────────────────────────────
function FormField({
  label, error, required, children,
}: {
  label: string; error?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-mono" style={{ color: "rgba(212,216,224,0.45)" }}>
        {label}{required && <span style={{ color: "#ff4455" }}> *</span>}
      </label>
      {children}
      {error && (
        <span className="text-xs font-mono" style={{ color: "#ff4455" }}>{error}</span>
      )}
    </div>
  )
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: `1px solid ${hasError ? "rgba(255,68,85,0.4)" : "rgba(255,255,255,0.08)"}`,
  borderRadius: 8,
  padding: "8px 12px",
  fontSize: 12,
  fontFamily: "var(--font-sans)",
  color: "#d4d8e0",
  outline: "none",
})

const selectStyle = (hasError = false): React.CSSProperties => ({
  ...inputStyle(hasError),
  cursor: "pointer",
  appearance: "none" as const,
  WebkitAppearance: "none" as const,
})
