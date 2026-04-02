export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-125 h-125 rounded-full bg-blue-600/8 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-125 h-125 rounded-full bg-indigo-600/8 blur-3xl" />
      </div>

      {children}
    </div>
  )
}

