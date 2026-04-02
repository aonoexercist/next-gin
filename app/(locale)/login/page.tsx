"use client"

import { useState } from "react"
import { login } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import GoogleLoginButton from "@/components/GoogleLoginButton"
import GoogleProvider from "@/providers/GoogleProvider"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setError("")
    try {
      setLoading(true)
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <GoogleProvider>
      <div className="flex flex-col flex-1">
        <header className="relative flex items-center justify-between px-8 py-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-lg group-hover:bg-blue-500 transition">NG</span>
            <span className="text-lg font-bold text-white tracking-tight">NextGin</span>
          </Link>
          <span className="text-sm text-slate-400">
            No account?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Sign up free
            </Link>
          </span>
        </header>

        {/* Card */}
        <div className="relative flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
              <p className="mt-1 text-sm text-slate-400">Sign in to your account to continue.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-medium text-slate-400">Password</label>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-2.5 mt-1 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all font-semibold text-sm text-white shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-xs text-slate-500">or</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            <div className="flex justify-center">
              <GoogleLoginButton />
            </div>

            <p className="mt-8 text-center text-xs text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition">
                Create one for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GoogleProvider>
  )
}