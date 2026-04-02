"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { AdminRole, AdminUser } from "@/models/User"
import { useUsersStore } from "@/hooks/useUsersStore"
import { updateUserRole } from "@/lib/adminApi"
import UsersList from "./components/UsersList"
import AccessControl from "./components/AccessControl"

type Tab = "users" | "access-control"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const { users: rawUsers, roles: rawRoles, load: loadUsers, setUsers: setRawUsers, setRoles: setRawRoles } = useUsersStore()
  const [tab, setTab] = useState<Tab>("users")

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const users = useMemo<AdminUser[]>(
    () =>
      rawUsers.map((u) => ({
        id: u.id ?? u.email,
        name: u.name,
        email: u.email,
        roles: u.roles.map((r) => r.name),
      })),
    [rawUsers]
  )

  const roles = useMemo<AdminRole[]>(() => {
    const permMap = new Map<string, string[]>()
    rawUsers.forEach((u) => {
      u.roles.forEach((r) => {
        if (!permMap.has(r.name)) permMap.set(r.name, r.permissions)
      })
    })
    return rawRoles.map((r) => ({
      id: String(r.id),
      name: r.name,
      permissions: permMap.get(r.name) ?? [],
    }))
  }, [rawRoles, rawUsers])

  const isSuperAdmin = user?.roles?.some((r) => r.name === "super_admin") ?? false

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

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="bg-white/5 border border-white/10 p-10 rounded-2xl text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 text-sm mb-6">
            You need the <span className="font-semibold text-purple-400">super_admin</span> role to
            access this page.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-lg text-sm transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // --- Handlers ---

  const handleUpdateUserRoles = async (userId: string, newRoles: string[]) => {
    const prevRawUsers = rawUsers
    setRawUsers(
      rawUsers.map((u) => {
        if ((u.id ?? u.email) !== userId) return u
        return {
          ...u,
          roles: newRoles.map((name) => u.roles.find((r) => r.name === name) ?? { name, permissions: [] }),
        }
      })
    )
    try {
      await updateUserRole(userId, newRoles)
    } catch (err) {
      console.error("Failed to update user roles", err)
      setRawUsers(prevRawUsers)
    }
  }

  const handleAddRole = (role: { id: string; name: string }) => {
    setRawRoles([...rawRoles, { id: Number(role.id), name: role.name }])
  }

  const handleRenameRole = (roleId: string, newName: string) => {
    const oldRole = rawRoles.find((r) => String(r.id) === roleId)
    if (!oldRole) return
    setRawRoles(rawRoles.map((r) => (String(r.id) === roleId ? { ...r, name: newName } : r)))
    setRawUsers(
      rawUsers.map((u) => ({
        ...u,
        roles: u.roles.map((r) => (r.name === oldRole.name ? { ...r, name: newName } : r)),
      }))
    )
  }

  const handleDeleteRole = (roleId: string) => {
    const deletedRole = rawRoles.find((r) => String(r.id) === roleId)
    setRawRoles(rawRoles.filter((r) => String(r.id) !== roleId))
    if (deletedRole) {
      setRawUsers(
        rawUsers.map((u) => ({
          ...u,
          roles: u.roles.filter((r) => r.name !== deletedRole.name),
        }))
      )
    }
  }

  return (
    <div className="relative flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Panel</h1>
          <p className="text-slate-400 text-sm mt-1">Manage users, roles, and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold rounded-full">
            super_admin
          </span>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/8 border border-white/10 rounded-lg transition"
          >
            ← Dashboard
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/8 rounded-xl p-1 w-fit">
        {(["users", "access-control"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === t
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/8"
            }`}
          >
            {t === "users" ? "Users" : "Access Control"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
        {tab === "users" ? (
          <UsersList
            users={users}
            roles={roles}
            onUpdateUserRoles={handleUpdateUserRoles}
          />
        ) : (
          <AccessControl
            roles={roles}
            onAddRole={handleAddRole}
            onRenameRole={handleRenameRole}
            onDeleteRole={handleDeleteRole}
          />
        )}
      </div>
    </div>
  )
}
