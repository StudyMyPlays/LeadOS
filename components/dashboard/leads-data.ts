export type LeadStatus = "New" | "Contacted" | "Estimate" | "Converted" | "Lost"
export type LeadSource = "website" | "referral" | "door-knock" | "call-in"
export type JobSize   = "$" | "$$" | "$$$"

export interface ActivityEntry {
  id: string
  timestamp: string
  text: string
}

export interface Lead {
  id: number
  name: string
  city: string
  phone: string
  service: string
  source: LeadSource
  jobSize: JobSize
  dateAdded: string
  status: LeadStatus
  estValue: number
  notes: string
  activity: ActivityEntry[]
}

// ── Status display config ────────────────────────────────────────
export const STATUS_CONFIG: Record<LeadStatus, { label: string; badge: string; color: string }> = {
  New:       { label: "New",       badge: "badge-cyan",   color: "#00F5FF" },
  Contacted: { label: "Contacted", badge: "badge-blue",   color: "#4D9FFF" },
  Estimate:  { label: "Estimate",  badge: "badge-purple", color: "#9B59FF" },
  Converted: { label: "Converted", badge: "badge-green",  color: "#39FF14" },
  Lost:      { label: "Lost",      badge: "badge-dim",    color: "rgba(212,216,224,0.35)" },
}

export const SERVICE_COLORS: Record<string, string> = {
  "Tree Removal":  "#00F5FF",
  "Stump Grinding":"#9B59FF",
  "Trimming":      "#39FF14",
  "Land Clearing": "#FFB800",
  "Emergency":     "#ff4455",
}

export const SOURCE_LABELS: Record<LeadSource, string> = {
  "website":    "Website",
  "referral":   "Referral",
  "door-knock": "Door Knock",
  "call-in":    "Call-In",
}

// ── Sample leads ─────────────────────────────────────────────────
export const SAMPLE_LEADS: Lead[] = [
  {
    id: 1,
    name: "Robert Martinez",
    city: "Denver",
    phone: "720-555-0142",
    service: "Tree Removal",
    source: "website",
    jobSize: "$$$",
    dateAdded: "Apr 10, 2025",
    status: "Contacted",
    estValue: 1850,
    notes: "Large oak in backyard, close to fence. Customer wants quote ASAP.",
    activity: [
      { id: "a1", timestamp: "Apr 10 9:02am", text: "Lead created via website form." },
      { id: "a2", timestamp: "Apr 10 11:15am", text: "Called — left voicemail." },
      { id: "a3", timestamp: "Apr 11 8:40am", text: "Customer called back. Estimate scheduled for Apr 14." },
    ],
  },
  {
    id: 2,
    name: "Sarah Kim",
    city: "Boulder",
    phone: "303-555-0287",
    service: "Stump Grinding",
    source: "referral",
    jobSize: "$",
    dateAdded: "Apr 10, 2025",
    status: "Estimate",
    estValue: 420,
    notes: "Referred by David Park. Two stumps in front yard.",
    activity: [
      { id: "b1", timestamp: "Apr 10 2:17pm", text: "Lead created via referral (David Park)." },
      { id: "b2", timestamp: "Apr 10 3:30pm", text: "Texted — confirmed estimate for Apr 12." },
    ],
  },
  {
    id: 3,
    name: "James O'Brien",
    city: "Aurora",
    phone: "720-555-0364",
    service: "Trimming",
    source: "door-knock",
    jobSize: "$",
    dateAdded: "Apr 9, 2025",
    status: "New",
    estValue: 310,
    notes: "Met during canvassing on Elm St. Interested in annual contract.",
    activity: [
      { id: "c1", timestamp: "Apr 9 4:52pm", text: "Lead created via door knock — Elm St route." },
    ],
  },
  {
    id: 4,
    name: "Priya Patel",
    city: "Denver",
    phone: "303-555-0519",
    service: "Tree Removal",
    source: "website",
    jobSize: "$$$",
    dateAdded: "Apr 9, 2025",
    status: "Contacted",
    estValue: 2200,
    notes: "Storm-damaged elm, partially on roof. Urgent.",
    activity: [
      { id: "d1", timestamp: "Apr 9 6:10am", text: "Lead created via website — urgent flag." },
      { id: "d2", timestamp: "Apr 9 8:00am", text: "Called. On-site estimate booked for today 2pm." },
    ],
  },
  {
    id: 5,
    name: "Carlos Rivera",
    city: "Boulder",
    phone: "720-555-0631",
    service: "Trimming",
    source: "referral",
    jobSize: "$",
    dateAdded: "Apr 8, 2025",
    status: "New",
    estValue: 275,
    notes: "",
    activity: [
      { id: "e1", timestamp: "Apr 8 1:22pm", text: "Lead created via referral." },
    ],
  },
  {
    id: 6,
    name: "Emily Thompson",
    city: "Denver",
    phone: "303-555-0748",
    service: "Tree Removal",
    source: "website",
    jobSize: "$$$",
    dateAdded: "Apr 8, 2025",
    status: "Converted",
    estValue: 1640,
    notes: "Closed! Deposit received Apr 9. Job scheduled Apr 17.",
    activity: [
      { id: "f1", timestamp: "Apr 8 10:00am", text: "Lead created." },
      { id: "f2", timestamp: "Apr 8 3:00pm", text: "Estimate sent — $1,640." },
      { id: "f3", timestamp: "Apr 9 9:45am", text: "Customer accepted. Deposit paid $500." },
    ],
  },
  {
    id: 7,
    name: "Marcus Johnson",
    city: "Aurora",
    phone: "720-555-0855",
    service: "Stump Grinding",
    source: "call-in",
    jobSize: "$",
    dateAdded: "Apr 7, 2025",
    status: "New",
    estValue: 390,
    notes: "Called in from Yelp ad. Three stumps backyard.",
    activity: [
      { id: "g1", timestamp: "Apr 7 11:30am", text: "Inbound call — lead created." },
    ],
  },
  {
    id: 8,
    name: "Olivia Chen",
    city: "Boulder",
    phone: "303-555-0974",
    service: "Tree Removal",
    source: "referral",
    jobSize: "$$$",
    dateAdded: "Apr 7, 2025",
    status: "Estimate",
    estValue: 3100,
    notes: "High-value job — 4 large trees. In negotiation.",
    activity: [
      { id: "h1", timestamp: "Apr 7 2:00pm", text: "Lead created via referral." },
      { id: "h2", timestamp: "Apr 8 10:00am", text: "On-site visit completed." },
      { id: "h3", timestamp: "Apr 9 9:00am", text: "Estimate sent — $3,100." },
    ],
  },
  {
    id: 9,
    name: "David Park",
    city: "Denver",
    phone: "720-555-1082",
    service: "Trimming",
    source: "website",
    jobSize: "$",
    dateAdded: "Apr 6, 2025",
    status: "Contacted",
    estValue: 220,
    notes: "Seasonal trimming, repeat customer.",
    activity: [
      { id: "i1", timestamp: "Apr 6 8:15am", text: "Lead created." },
      { id: "i2", timestamp: "Apr 6 9:00am", text: "Called — confirmed for April trim." },
    ],
  },
  {
    id: 10,
    name: "Natasha Gomez",
    city: "Aurora",
    phone: "303-555-1190",
    service: "Stump Grinding",
    source: "website",
    jobSize: "$$",
    dateAdded: "Apr 5, 2025",
    status: "Lost",
    estValue: 510,
    notes: "Went with competitor. Price was the issue.",
    activity: [
      { id: "j1", timestamp: "Apr 5 4:00pm", text: "Lead created." },
      { id: "j2", timestamp: "Apr 6 11:00am", text: "Estimate sent — $510." },
      { id: "j3", timestamp: "Apr 8 2:00pm", text: "Customer chose competitor." },
    ],
  },
  {
    id: 11,
    name: "Brennan Walsh",
    city: "Denver",
    phone: "720-555-1234",
    service: "Land Clearing",
    source: "call-in",
    jobSize: "$$$",
    dateAdded: "Apr 5, 2025",
    status: "Estimate",
    estValue: 4800,
    notes: "New build lot — 0.5 acre. Wants everything cleared.",
    activity: [
      { id: "k1", timestamp: "Apr 5 10:00am", text: "Inbound call." },
      { id: "k2", timestamp: "Apr 6 1:00pm", text: "Site visit completed." },
    ],
  },
  {
    id: 12,
    name: "Aisha Williams",
    city: "Boulder",
    phone: "303-555-1377",
    service: "Tree Removal",
    source: "door-knock",
    jobSize: "$$",
    dateAdded: "Apr 4, 2025",
    status: "Converted",
    estValue: 980,
    notes: "Job completed Apr 11. Full payment received.",
    activity: [
      { id: "l1", timestamp: "Apr 4 3:30pm", text: "Lead created — door knock." },
      { id: "l2", timestamp: "Apr 5 9:00am", text: "Called, estimate booked." },
      { id: "l3", timestamp: "Apr 7 8:00am", text: "Job completed. $980 collected." },
    ],
  },
]
