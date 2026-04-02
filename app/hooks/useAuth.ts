"use client"

import { useEffect, useState } from "react"
import { getMe } from "@/lib/auth"
import { User } from "@/models/User"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe().then((data) => {
      setUser(data)
      setLoading(false)
    })
  }, [])

  return { user, loading }
}