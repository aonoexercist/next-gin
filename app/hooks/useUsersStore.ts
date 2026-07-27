"use client"

import { create } from "zustand"
import { apiFetch } from "@/lib/api"
import { User } from "@/models/User"

type UsersState = {
  users: User[]
  load: () => Promise<void>
  setUsers: (t: User[]) => void
  deleteUser: (id: string) => Promise<void>
  updateUser: (id: string, data: Partial<User>) => Promise<void>
  assignRoles: (userId: string, roleIds: number[]) => Promise<void>
}

const fetchUsers = async (): Promise<User[]> => {
  const res = await apiFetch("/admin/users")
  if (!res.ok) return []
  return await res.json()
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  setUsers: (t) => set({ users: t }),

  load: async () => {
    fetchUsers().then((data) => set({ users: data }))
  },

  deleteUser: async (id) => {
    const res = await apiFetch(`/admin/users/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Failed to delete user")

    set({ users: get().users.filter((u) => u.id !== id) })
  },

  updateUser: async (id, data) => {
    const res = await apiFetch(`/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to update user")

    const updated: User = await res.json()
    set({
      users: get().users.map((u) => (u.id === id ? updated : u)),
    })
  },

  assignRoles: async (userId: string, roleIds: number[]) => {
    const res = await apiFetch(`/admin/users/${userId}/roles`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleIds }),
    })
    if (!res.ok) throw new Error("Failed to assign roles")

    const updated: User = await res.json()
    set({
      users: get().users.map((u) => (u.id === userId ? updated : u)),
    })
  },
}))