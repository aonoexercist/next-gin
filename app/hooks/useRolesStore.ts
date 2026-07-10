"use client"

import { create } from "zustand"
import { apiFetch } from "@/lib/api"
import { UserRole } from "@/models/User"


type RolesState = {
  roles: UserRole[]
  load: () => Promise<void>
  setRoles: (t: UserRole[]) => void
}

const fetchRoles = async (): Promise<UserRole[]> => {
  const res = await apiFetch("/admin/roles")
  if (!res.ok) return []
  return await res.json()
}

export const useRolesStore = create<RolesState>((set) => ({
  roles: [],
  setRoles: (t) => set({ roles: t }),
  load: async () => {
    fetchRoles().then((data) => set({ roles: data }))
  }
}))
