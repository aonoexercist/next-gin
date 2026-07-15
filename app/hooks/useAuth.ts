"use client"

import { create } from "zustand"
import { getMe } from "@/lib/auth"
import { User } from "@/models/User"

type AuthState = {
  user: User | null
  loading: boolean
  isLoggedIn: boolean
  fetch: () => Promise<boolean>
  setUser: (user: User | null) => void
  setIsLoggedIn: (isLoggedIn: boolean) => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isLoggedIn: false,
  fetch: async () => {
    const data = await getMe()
    const isLoggedIn = !!data
    set({ user: data, loading: false, isLoggedIn })
    return isLoggedIn
  },
  setUser: (user) => set({ user }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
}))
