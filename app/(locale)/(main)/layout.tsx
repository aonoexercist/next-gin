import NavBar from "@/components/NavBar"
import Sidebar from "@/components/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row flex-1">
      <Sidebar />

      <section className="flex-1 min-w-0">
        <NavBar />

        <div className="w-full max-w-5xl mx-auto px-6 py-10">
          {children}
        </div>
      </section>
    </div>
  )
}
