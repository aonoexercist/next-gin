"use client"

import { create } from "zustand"
import { apiFetch } from "@/lib/api"
import { User, UserRole } from "@/models/User"


type UsersState = {
  users: User[]
  roles: UserRole[]
  load: () => Promise<void>
  setUsers: (t: User[]) => void
  setRoles: (t: UserRole[]) => void
}

const fetchUsers = async (): Promise<User[]> => {
  const res = await apiFetch("/admin/users")
  if (!res.ok) return []
  return await res.json()
}

const fetchRoles = async (): Promise<UserRole[]> => {
  const res = await apiFetch("/admin/roles")
  if (!res.ok) return []
  return await res.json()
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  roles: [],
  setUsers: (t) => set({ users: t }),
  setRoles: (t) => set({ roles: t }),
  load: async () => {
    fetchUsers().then((data) => set({ users: data }))
    fetchRoles().then((data) => set({ roles: data }))
  }
}))
