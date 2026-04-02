"use client"

import { create } from "zustand"
import { getMe } from "@/lib/auth"
import { User } from "@/models/User"

type AuthState = {
  user: User | null
  loading: boolean
  fetch: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  fetch: async () => {
    const data = await getMe()
    set({ user: data, loading: false })
  },
  setUser: (user) => set({ user }),
}))

if (typeof window !== "undefined") {
  useAuth.getState().fetch()
}