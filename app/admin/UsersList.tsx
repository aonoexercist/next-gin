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
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Users</h2>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="bg-white hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{user.name}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3">
                  {editingUserId === user.id ? (
                    <div className="flex flex-wrap gap-2">
                      {roles.map((role) => (
                        <label key={role.id} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedRoles.includes(role.name)}
                            onChange={() => toggleRole(role.name)}
                            className="rounded border-slate-300 text-indigo-600"
                          />
                          <span className="text-slate-700">{role.name}</span>
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
                                ? "bg-purple-100 text-purple-700"
                                : r === "admin"
                                ? "bg-blue-100 text-blue-700"
                                : r === "editor"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {r}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">No roles</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {editingUserId === user.id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => saveRoles(user.id)}
                        className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="px-3 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openEdit(user)}
                      className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md"
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
