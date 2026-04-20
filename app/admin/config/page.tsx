"use client"

import { useRouter } from "next/navigation"
import AdminConfigPanel from "@/components/admin/AdminConfigPanel"

export default function AdminConfigPage() {
  const router = useRouter()
  return <AdminConfigPanel onBack={() => router.push("/")} />
}
