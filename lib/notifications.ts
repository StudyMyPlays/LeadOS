// Shared notification types + localStorage persistence for the Topbar bell.

export type NotificationType = "lead" | "status" | "warning" | "info"

export interface AppNotification {
  id: string
  message: string
  type: NotificationType
  timestamp: string // ISO string, safe to JSON round-trip
  read: boolean
}

const STORAGE_KEY = "leadosNotifications"
const MAX_ENTRIES = 50

export function loadNotifications(): AppNotification[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const valid: NotificationType[] = ["lead", "status", "warning", "info"]
    return parsed
      .map((n): AppNotification | null => {
        if (!n || typeof n !== "object") return null
        const type = valid.includes(n.type) ? (n.type as NotificationType) : "info"
        const timestamp =
          typeof n.timestamp === "string"
            ? n.timestamp
            : new Date().toISOString()
        return {
          id: String(n.id ?? `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`),
          message: String(n.message ?? ""),
          type,
          timestamp,
          read: Boolean(n.read),
        }
      })
      .filter((n): n is AppNotification => n !== null)
      .slice(0, MAX_ENTRIES)
  } catch {
    return []
  }
}

export function saveNotifications(list: AppNotification[]) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(list.slice(0, MAX_ENTRIES)),
    )
  } catch {
    // quota exceeded or storage disabled — ignore
  }
}

export function createNotification(
  type: NotificationType,
  message: string,
): AppNotification {
  return {
    id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    message,
    type,
    timestamp: new Date().toISOString(),
    read: false,
  }
}

export function formatRelative(iso: string): string {
  const ts = new Date(iso).getTime()
  if (Number.isNaN(ts)) return ""
  const ms = Date.now() - ts
  if (ms < 0) return "just now"
  const s = Math.floor(ms / 1000)
  if (s < 45) return "just now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  const w = Math.floor(d / 7)
  if (w < 5) return `${w}w ago`
  const mo = Math.floor(d / 30)
  return `${mo}mo ago`
}

export const NOTIFICATIONS_STORAGE_KEY = STORAGE_KEY
export const NOTIFICATIONS_MAX = MAX_ENTRIES
