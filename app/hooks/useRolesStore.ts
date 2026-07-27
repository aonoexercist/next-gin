"use client"

import { create } from "zustand"
import { apiFetch } from "@/lib/api"
import { UserRole } from "@/models/User"


type RolesState = {
  roles: UserRole[]
  permissionsByRoleId: Record<number, string[]>
  loadingRoleIds: Set<number>
  mutatingRoleIds: Set<number>

  load: () => Promise<void>
  setRoles: (t: UserRole[]) => void
  loadPermissions: (roleId: number, force?: boolean) => Promise<void>

  createRole: (name: string) => Promise<UserRole | null>
  updateRole: (roleId: number, name: string) => Promise<void>
  deleteRole: (roleId: number) => Promise<void>

  addPermission: (roleId: number, permission: string) => Promise<void>
  updatePermission: (roleId: number, oldPermission: string, newPermission: string) => Promise<void>
  deletePermission: (roleId: number, permission: string) => Promise<void>
}

const fetchRoles = async (): Promise<UserRole[]> => {
  const res = await apiFetch("/admin/roles")
  if (!res.ok) return []
  return await res.json()
}

const fetchPermissionsByRoleId = async (roleId: number): Promise<string[]> => {
  const res = await apiFetch(`/admin/permissions/roles/${roleId}/permissions`)
  if (!res.ok) return []
  return await res.json()
}

export const useRolesStore = create<RolesState>((set, get) => ({
  roles: [],
  permissionsByRoleId: {},
  loadingRoleIds: new Set(),
  mutatingRoleIds: new Set(),

  setRoles: (t) => set({ roles: t }),

  load: async () => {
    fetchRoles().then((data) => set({ roles: data }))
  },

  loadPermissions: async (roleId, force = false) => {
    const state = get()
    if (!force && state.permissionsByRoleId[roleId]) return
    if (state.loadingRoleIds.has(roleId)) return

    set((s) => ({ loadingRoleIds: new Set(s.loadingRoleIds).add(roleId) }))
    const data = await fetchPermissionsByRoleId(roleId)
    set((s) => {
      const next = new Set(s.loadingRoleIds)
      next.delete(roleId)
      return {
        permissionsByRoleId: { ...s.permissionsByRoleId, [roleId]: data },
        loadingRoleIds: next
      }
    })
  },

  // ---- Role CRUD ----

  createRole: async (name) => {
    const res = await apiFetch("/admin/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
    if (!res.ok) return null

    const newRole: UserRole = await res.json()
    set((s) => ({ roles: [...s.roles, newRole] }))
    return newRole
  },

  updateRole: async (roleId, name) => {
    set((s) => ({ mutatingRoleIds: new Set(s.mutatingRoleIds).add(roleId) }))

    const res = await apiFetch(`/admin/roles/${roleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })

    set((s) => {
      const next = new Set(s.mutatingRoleIds)
      next.delete(roleId)
      return { mutatingRoleIds: next }
    })

    if (!res.ok) return

    set((s) => ({
      roles: s.roles.map((r) => (r.id === roleId ? { ...r, name } : r))
    }))
  },

  deleteRole: async (roleId) => {
    set((s) => ({ mutatingRoleIds: new Set(s.mutatingRoleIds).add(roleId) }))

    const res = await apiFetch(`/admin/roles/${roleId}`, { method: "DELETE" })

    set((s) => {
      const next = new Set(s.mutatingRoleIds)
      next.delete(roleId)
      return { mutatingRoleIds: next }
    })

    if (!res.ok) return

    set((s) => {
      const { [roleId]: _, ...restPermissions } = s.permissionsByRoleId
      return {
        roles: s.roles.filter((r) => r.id !== roleId),
        permissionsByRoleId: restPermissions
      }
    })
  },

  // ---- Permission CRUD (scoped to a role) ----

  addPermission: async (roleId, permission) => {
    const res = await apiFetch(`/admin/permissions/roles/${roleId}/permissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permission })
    })
    if (!res.ok) return

    set((s) => ({
      permissionsByRoleId: {
        ...s.permissionsByRoleId,
        [roleId]: [...(s.permissionsByRoleId[roleId] ?? []), permission]
      }
    }))
  },

  updatePermission: async (roleId, oldPermission, newPermission) => {
    const res = await apiFetch(
      `/admin/permissions/roles/${roleId}/permissions/${encodeURIComponent(oldPermission)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission: newPermission })
      }
    )
    if (!res.ok) return

    set((s) => ({
      permissionsByRoleId: {
        ...s.permissionsByRoleId,
        [roleId]: (s.permissionsByRoleId[roleId] ?? []).map((p) =>
          p === oldPermission ? newPermission : p
        )
      }
    }))
  },

  deletePermission: async (roleId, permission) => {
    const res = await apiFetch(
      `/admin/permissions/roles/${roleId}/permissions/${encodeURIComponent(permission)}`,
      { method: "DELETE" }
    )
    if (!res.ok) return

    set((s) => ({
      permissionsByRoleId: {
        ...s.permissionsByRoleId,
        [roleId]: (s.permissionsByRoleId[roleId] ?? []).filter((p) => p !== permission)
      }
    }))
  }
}))