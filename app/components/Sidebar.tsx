"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { sidebarConfig } from "@/lib/sidebarConfig"
import { useAuthContext } from "@/context/AuthContext"

export default function Sidebar() {
  const pathname = usePathname()
  const { isAdmin, loading, can } = useAuthContext()

  const visibleItems = sidebarConfig.filter((item) => {
    // No requiredPermission -> always visible
    if (!item.requiredPermission) return true
    // Admins bypass permission checks
    if (isAdmin) return true
    // Otherwise check the user's permissions
    return can(item.requiredPermission)
  })

  return (
    <aside className="w-full md:w-64 md:min-h-[calc(100vh-1px)] border-b md:border-b-0 md:border-r border-white/5 bg-slate-950/35 backdrop-blur-sm">
      <div className="p-4 md:p-5">
        <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">Navigation</p>

        {loading ? (
          <div className="mt-4 space-y-2">
            <div className="h-9 rounded-md bg-white/5 animate-pulse" />
            <div className="h-9 rounded-md bg-white/5 animate-pulse" />
            <div className="h-9 rounded-md bg-white/5 animate-pulse" />
          </div>
        ) : (
          <nav className="mt-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
            {visibleItems.length === 0 ? (
              <p className="text-xs text-slate-500">No menu items available</p>
            ) : (
              visibleItems.map((item) => {
                const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`)

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`whitespace-nowrap px-3 py-2 rounded-md text-sm border transition ${
                      isActive
                        ? "bg-blue-500/15 border-blue-400/35 text-blue-200"
                        : "bg-white/2 border-transparent text-slate-300 hover:bg-white/6 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })
            )}
          </nav>
        )}
      </div>
    </aside>
  )
}