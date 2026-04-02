"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { register } from "@/lib/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleRegister = async () => {
    setError("")
    if (!firstName || !email || !password) {
      setError("Please fill in all required fields.")
      return
    }
    try {
      setLoading(true)
      await register(`${firstName} ${lastName}`.trim(), email, password)
      setSuccess(true)
    } catch (err) {
      setError("Registration failed. The email may already be in use.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Account created!</h2>
          <p className="mt-2 text-sm text-slate-400">You&apos;re all set. Sign in to get started.</p>
          <Link
            href="/login"
            className="mt-6 inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-500 transition rounded-xl text-sm font-semibold text-white"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <header className="relative flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-lg group-hover:bg-blue-500 transition">NG</span>
          <span className="text-lg font-bold text-white tracking-tight">NextGin</span>
        </Link>
        <span className="text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
            Sign in
          </Link>
        </span>
      </header>

      {/* Card */}
      <div className="relative flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Create account</h1>
            <p className="mt-1 text-sm text-slate-400">Free forever. No credit card required.</p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-xs font-medium text-slate-400 mb-1.5">First name <span className="text-red-400">*</span></label>
                <input
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  placeholder="Jane"
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-medium text-slate-400 mb-1.5">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  placeholder="Doe"
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1.5">Email <span className="text-red-400">*</span></label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-400 mb-1.5">Password <span className="text-red-400">*</span></label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                placeholder="Min. 8 characters"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-2.5 mt-1 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all font-semibold text-sm text-white shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}