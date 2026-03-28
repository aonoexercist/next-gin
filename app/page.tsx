import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to Next.js 16</h1>
      <p className="text-lg text-slate-600 mb-8">Fast, modern, and powered by Bun.</p>
      <div className="flex gap-4">
        <Link href="/login" className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
          Login
        </Link>
        <Link href="/register" className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all">
          Register
        </Link>
      </div>
    </main>
  );
}