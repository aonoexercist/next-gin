"use client"

import { useEffect, useState } from "react"
import { getMe } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe().then((data) => {
      setUser(data)
      setLoading(false)
    })
  }, [])

  return { user, loading }
}