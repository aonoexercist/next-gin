"use client"

import { useState } from "react"
import { login } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      console.log('err', err)
      alert("Invalid credentials")
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="space-y-4">
        <input
          className="border p-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white p-2 w-full"
        >
          Login
        </button>
      </div>
    </div>
  )
}