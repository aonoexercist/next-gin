"use client"

import Link from "next/link"
import GoogleLoginButton from "@/components/GoogleLoginButton"
import GoogleProvider from "@/providers/GoogleProvider"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-150 h-150 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-150 h-150 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="relative flex justify-between items-center px-8 py-5 max-w-7xl w-full mx-auto border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm shadow-lg group-hover:bg-blue-500 transition">M</span>
          <span className="text-lg font-bold tracking-tight">NextGin</span>
        </Link>
        <nav className="flex gap-2 items-center">
          <Link
            href="/login"
            className="px-4 py-2 text-sm rounded-lg text-slate-300 hover:text-white hover:bg-white/8 transition"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm bg-blue-600 rounded-lg hover:bg-blue-500 transition font-medium shadow-md shadow-blue-900/30"
          >
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center text-center px-6 py-20">
        <span className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Next.js · Bun · Gin · Go
        </span>

        <h2 className="max-w-3xl text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Build fast apps,
          <br />
          <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">ship with confidence.</span>
        </h2>

        <p className="mt-6 max-w-xl text-base text-slate-400 leading-relaxed">
          Modern authentication, clean UI, and scalable architecture — ready out of the box.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Link
            href="/register"
            className="px-7 py-3.5 bg-blue-600 rounded-xl font-semibold text-sm hover:bg-blue-500 transition shadow-lg shadow-blue-900/30 active:scale-95"
          >
            Create free account
          </Link>
          <Link
            href="/login"
            className="px-7 py-3.5 bg-white/6 border border-white/10 rounded-xl font-semibold text-sm hover:bg-white/10 transition active:scale-95"
          >
            Sign in
          </Link>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <span className="text-xs text-slate-500">Or continue with Google</span>
          <GoogleProvider>
            <GoogleLoginButton />
          </GoogleProvider>
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-5xl mx-auto w-full px-6 pb-24 grid md:grid-cols-3 gap-4">
        {[
          { icon: "⚡", title: "Blazing Fast", desc: "Powered by Bun runtime and Gin HTTP framework for maximum throughput." },
          { icon: "🔐", title: "Secure by Default", desc: "JWT access tokens, refresh rotation, and Google OAuth built in." },
          { icon: "🎨", title: "Modern UI", desc: "Clean, accessible design with Tailwind CSS and smooth interactions." },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="group bg-white/3 hover:bg-white/6 border border-white/8 hover:border-white/15 p-6 rounded-2xl backdrop-blur-sm transition-all duration-200">
            <span className="text-2xl">{icon}</span>
            <h3 className="mt-3 font-semibold text-white">{title}</h3>
            <p className="mt-1.5 text-slate-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-6 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} NextGin. All rights reserved. | v.{process.env.BUILD_VERSION}
      </footer>
    </main>
  )
}