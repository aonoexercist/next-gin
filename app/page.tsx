"use client"

import Link from 'next/link'
import GoogleLoginButton from "@/components/GoogleLoginButton"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-6 max-w-7xl w-full mx-auto">
        <h1 className="text-xl font-bold">MyApp</h1>
        <div className="flex gap-3 items-center">
          <Link href="/login" className="px-5 py-2 rounded-lg hover:bg-white/10 transition">Login</Link>
          <Link href="/register" className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">Register</Link>
          <div className="hidden sm:block">
            <GoogleLoginButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <div className="max-w-3xl">
          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Build Fast Apps with <span className="text-blue-500">Next.js 16</span>
          </h2>

          <p className="mt-6 text-lg text-slate-300">
            Modern authentication, clean UI, and scalable architecture powered by Bun + Gin backend.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="px-8 py-4 bg-white/10 border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto w-full px-6 pb-20 grid md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-lg">
          <h3 className="font-semibold text-lg">⚡ Fast</h3>
          <p className="text-slate-300 mt-2 text-sm">Optimized performance with modern tooling.</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-lg">
          <h3 className="font-semibold text-lg">🔐 Secure</h3>
          <p className="text-slate-300 mt-2 text-sm">JWT + refresh token authentication ready.</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-lg">
          <h3 className="font-semibold text-lg">🎨 Modern UI</h3>
          <p className="text-slate-300 mt-2 text-sm">Clean, responsive and beautiful design system.</p>
        </div>
      </section>
    </main>
  )
}