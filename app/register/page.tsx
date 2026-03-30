"use client"

import { useState } from "react"

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
          <p className="text-sm text-slate-500 mt-2">Start your journey 🚀</p>
        </div>
        
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">First name</label>
              <input id="firstName" name="firstName" placeholder="First Name" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">Last name</label>
              <input id="lastName" name="lastName" placeholder="Last Name" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input id="email" name="email" type="email" placeholder="Email" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input id="password" name="password" type="password" placeholder="Password (min 8 chars)" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  )
}