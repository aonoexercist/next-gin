export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
        </div>
        
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
              <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
              <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input type="email" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input type="password" placeholder="Min. 8 characters" className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
          </div>
          <button className="w-full mt-4 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}