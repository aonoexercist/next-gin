"use client"

import { create } from "zustand"
import { getMe } from "@/lib/auth"
import { CurrentUser } from "@/models/User"

type AuthState = {
  user: CurrentUser | null
  loading: boolean
  isLoggedIn: boolean
  fetch: () => Promise<boolean>
  setUser: (user: CurrentUser | null) => void
  setIsLoggedIn: (isLoggedIn: boolean) => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isLoggedIn: false,
  fetch: async () => {
    const data = await getMe()
    console.log("Fetched user data:", data)
    const isLoggedIn = !!data
    set({ user: data, loading: false, isLoggedIn })

    console.log("Updated auth state:", { user: data, loading: false, isLoggedIn })
    return isLoggedIn
  },
  setUser: (user) => set({ user }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
}))
