"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { logout } from "@/lib/auth"

export default function NavBar() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to sign out?")) return
    try {
      await logout()
    } catch (err) {
      console.error("Logout failed", err)
    } finally {
      router.push("/login")
    }
  }

  if (loading || !user) return null

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase() ?? "?"

  const displayName = user.name || user.email || "User"
  const isSuperAdmin = user.roles?.some((r) => r.name === "super_admin")

  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/2 backdrop-blur-sm">
      <Link href="/dashboard" className="flex items-center gap-2 group">
        <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs shadow-lg group-hover:bg-blue-500 transition">NG</span>
        <span className="text-base font-bold tracking-tight">NextGin</span>
      </Link>

      <div className="flex items-center gap-3">
        {isSuperAdmin && (
          <Link
            href="/admin"
            className="px-3 py-1.5 text-xs font-medium bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 rounded-lg transition"
          >
            Admin panel
          </Link>
        )}

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-300">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white leading-none">{displayName}</p>
            {user.name && <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="ml-1 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/8 rounded-lg transition"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
