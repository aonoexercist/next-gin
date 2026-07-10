"use client"

import { useEffect, useState } from "react"
import { useUsersStore } from "@/hooks/useUsersStore"

const UserPage = () => {
  const users = useUsersStore((state) => state.users)
  const loadUsers = useUsersStore((state) => state.load)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUsers().finally(() => setIsLoading(false))
  }, [loadUsers])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-4">User Management</h1>
      <p className="text-sm text-slate-400 mb-6">Manage your application's users here.</p>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/60">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/60 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Permissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {isLoading && (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={3}>
                  Loading users...
                </td>
              </tr>
            )}

            {!isLoading && users.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={3}>
                  No users found.
                </td>
              </tr>
            )}

            {!isLoading &&
              users.map((user) => (
                <tr key={user.id ?? `${user.email}-${user.name}`} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {(user.permissions?.length ?? 0) > 0
                      ? user.permissions
                          ?.map((permission) => permission?.name)
                          .filter((name): name is string => Boolean(name))
                          .join(", ")
                      : "-"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserPage