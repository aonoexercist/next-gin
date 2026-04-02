"use client"

import { useState } from "react"
import { AdminUser, AdminRole } from "@/models/User"

interface Props {
  users: AdminUser[]
  roles: AdminRole[]
  onUpdateUserRoles: (userId: string, roles: string[]) => void
}

export default function UsersList({ users, roles, onUpdateUserRoles }: Props) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const openEdit = (user: AdminUser) => {
    setEditingUserId(user.id)
    setSelectedRoles([...user.roles])
  }

  const toggleRole = (roleName: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName]
    )
  }

  const saveRoles = (userId: string) => {
    console.log("Updating user", userId, "with roles", selectedRoles)
    onUpdateUserRoles(userId, selectedRoles)
    setEditingUserId(null)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">Users</h2>
      <div className="overflow-x-auto rounded-xl border border-white/8">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/3 transition-colors">
                <td className="px-4 py-3 font-medium text-white">{user.name}</td>
                <td className="px-4 py-3 text-slate-400">{user.email}</td>
                <td className="px-4 py-3">
                  {editingUserId === user.id ? (
                    <div className="flex flex-wrap gap-2">
                      {roles.map((role) => (
                        <label key={role.id} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedRoles.includes(role.name)}
                            onChange={() => toggleRole(role.name)}
                            className="rounded border-white/20 bg-white/10 text-indigo-500"
                          />
                          <span className="text-slate-300 text-xs">{role.name}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length > 0 ? (
                        user.roles.map((r) => (
                          <span
                            key={r}
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              r === "super_admin"
                                ? "bg-purple-500/15 border border-purple-500/30 text-purple-300"
                                : r === "admin"
                                ? "bg-blue-500/15 border border-blue-500/30 text-blue-300"
                                : r === "editor"
                                ? "bg-green-500/15 border border-green-500/30 text-green-300"
                                : "bg-white/8 border border-white/10 text-slate-300"
                            }`}
                          >
                            {r}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic text-xs">No roles</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {editingUserId === user.id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => saveRoles(user.id)}
                        className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="px-3 py-1 text-xs bg-white/8 hover:bg-white/12 border border-white/10 text-slate-300 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openEdit(user)}
                      className="px-3 py-1 text-xs bg-white/8 hover:bg-white/12 border border-white/10 text-slate-300 rounded-lg transition"
                    >
                      Edit Roles
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
