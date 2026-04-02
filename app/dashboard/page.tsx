"use client"

import React, { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth"
import Todos from "./Todos"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      confirm("Are you sure you want to logout?") && await logout();
    } catch (err) {
      // swallow errors and continue to redirect
      console.error("Logout failed", err)
    } finally {
      router.push("/login")
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-2">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {user?.roles?.some((r) => r.name === "super_admin") && (
                <button
                  onClick={() => router.push("/admin")}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm"
                >
                  Admin
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {/* Todos component */}
          {/* eslint-disable-next-line @next/next/no-component-definition */}
          {/* Lazy import client component to avoid SSR issues */}
          <React.Suspense fallback={<div>Loading todos…</div>}>
            {/* @ts-ignore */}
            <Todos />
          </React.Suspense>
        </div>
      </div>
    </div>
  )
}