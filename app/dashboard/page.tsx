"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { logout } from "@/lib/auth"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
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
            <div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-5 rounded-xl shadow border">Card 1</div>
          <div className="bg-white p-5 rounded-xl shadow border">Card 2</div>
          <div className="bg-white p-5 rounded-xl shadow border">Card 3</div>
        </div>
      </div>
    </div>
  )
}