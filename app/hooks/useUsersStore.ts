"use client"

import { create } from "zustand"
import { apiFetch } from "@/lib/api"
import { User } from "@/models/User"


type UsersState = {
  users: User[]
  load: () => Promise<void>
  setUsers: (t: User[]) => void
}

const fetchUsers = async (): Promise<User[]> => {
  const res = await apiFetch("/admin/users")
  if (!res.ok) return []
  return await res.json()
}


export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  setUsers: (t) => set({ users: t }),
  load: async () => {
    fetchUsers().then((data) => set({ users: data }))
  }
}))
