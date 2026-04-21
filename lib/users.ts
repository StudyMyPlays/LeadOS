// Shared registry of users who can authenticate via the LoginPage
// and who are visible / manageable inside the Admin > User Management panel.

export type AppRole = "owner" | "partner"
export type UserRole = "Owner" | "Partner" | "Viewer"
export type UserStatus = "Active" | "Suspended"

export interface AuthorizedUser {
  id: string
  name: string
  email: string
  password: string          // demo only — never do this in production
  role: UserRole
  appRole: AppRole          // used by LoginPage to decide which dashboard view to open
  status: UserStatus
  lastLogin: string         // ISO
  commissionRate?: number
  avatarHue?: number
}

// ── Authoritative list ──────────────────────────────────────────
// These are the partners / team members that can actually log in.
// LoginPage reads from here; the User Management admin panel also
// reads from here so the two are always in sync.
export const AUTHORIZED_USERS: AuthorizedUser[] = [
  {
    id: "u_owner_demo",
    name: "Owner (Demo)",
    email: "owner@demo.com",
    password: "demo1234",
    role: "Owner",
    appRole: "owner",
    status: "Active",
    lastLogin: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    id: "u_partner_demo",
    name: "Partner (Demo)",
    email: "partner@demo.com",
    password: "demo1234",
    role: "Partner",
    appRole: "partner",
    status: "Active",
    lastLogin: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    commissionRate: 15,
  },
  {
    id: "u_marcus",
    name: "Marcus Chen",
    email: "marcus@leados.app",
    password: "demo1234",
    role: "Owner",
    appRole: "owner",
    status: "Active",
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "u_elena",
    name: "Elena Vargas",
    email: "elena@growthpartners.io",
    password: "demo1234",
    role: "Partner",
    appRole: "partner",
    status: "Active",
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    commissionRate: 15,
  },
  {
    id: "u_devon",
    name: "Devon Park",
    email: "devon@growthpartners.io",
    password: "demo1234",
    role: "Partner",
    appRole: "partner",
    status: "Active",
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    commissionRate: 12,
  },
  {
    id: "u_jordan",
    name: "Jordan Reeves",
    email: "jordan@leadscout.co",
    password: "demo1234",
    role: "Partner",
    appRole: "partner",
    status: "Suspended",
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    commissionRate: 10,
  },
]

// ── Pending invites (not yet authenticated) ────────────────────
export interface PendingInvite {
  id: string
  email: string
  role: UserRole
  commissionRate?: number
  sentAt: string
}

export const INITIAL_INVITES: PendingInvite[] = [
  {
    id: "i_01",
    email: "alex.cho@growthpartners.io",
    role: "Partner",
    commissionRate: 12,
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
]

// ── Auth helper used by LoginPage ───────────────────────────────
export function authenticate(
  email: string,
  password: string,
  appRole: AppRole,
): AuthorizedUser | null {
  const normalized = email.trim().toLowerCase()
  const match = AUTHORIZED_USERS.find(
    (u) =>
      u.email.toLowerCase() === normalized &&
      u.password === password &&
      u.appRole === appRole &&
      u.status === "Active",
  )
  return match ?? null
}
