"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  const displayName = user?.name || user?.email || "User"

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-400">Welcome back, <span className="text-slate-200">{displayName}</span>.</p>
    </div>
  )
}