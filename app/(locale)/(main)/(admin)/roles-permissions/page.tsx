"use client"

import { useEffect, useState } from "react"
import { useRolesStore } from "@/hooks/useRolesStore"

const RolesPermissionsPage = () => {
  const roles = useRolesStore((state) => state.roles)
  const loadRoles = useRolesStore((state) => state.load)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRoles().finally(() => setIsLoading(false))
  }, [loadRoles])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Roles & Permissions</h1>
      <p className="text-sm text-slate-400 mb-6">Manage your application's roles and permissions here.</p>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/60">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/60 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Role ID</th>
              <th className="px-4 py-3 text-left font-medium">Role Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {isLoading && (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={2}>
                  Loading roles...
                </td>
              </tr>
            )}

            {!isLoading && roles.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={2}>
                  No roles found.
                </td>
              </tr>
            )}

            {!isLoading &&
              roles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3">{role.id}</td>
                  <td className="px-4 py-3">{role.name}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RolesPermissionsPage