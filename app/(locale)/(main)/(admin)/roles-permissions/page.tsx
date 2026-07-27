"use client"

import { useEffect, useState, Fragment } from "react"
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, X, Check } from "lucide-react"
import { useRolesStore } from "@/hooks/useRolesStore"

const RolesPermissionsPage = () => {
  const roles = useRolesStore((s) => s.roles)
  const loadRoles = useRolesStore((s) => s.load)
  const loadPermissions = useRolesStore((s) => s.loadPermissions)
  const permissionsByRoleId = useRolesStore((s) => s.permissionsByRoleId)
  const loadingRoleIds = useRolesStore((s) => s.loadingRoleIds)
  const mutatingRoleIds = useRolesStore((s) => s.mutatingRoleIds)

  const createRole = useRolesStore((s) => s.createRole)
  const updateRole = useRolesStore((s) => s.updateRole)
  const deleteRole = useRolesStore((s) => s.deleteRole)

  const addPermission = useRolesStore((s) => s.addPermission)
  const updatePermission = useRolesStore((s) => s.updatePermission)
  const deletePermission = useRolesStore((s) => s.deletePermission)

  const [isLoading, setIsLoading] = useState(true)
  const [expandedRoleId, setExpandedRoleId] = useState<number | null>(null)

  // Role create/edit state
  const [isAddingRole, setIsAddingRole] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null)
  const [editRoleName, setEditRoleName] = useState("")

  // Permission add/edit state (scoped per role)
  const [newPermissionByRole, setNewPermissionByRole] = useState<Record<number, string>>({})
  const [editingPermissionId, setEditingPermissionId] = useState<number | null>(null)
  const [editPermissionValue, setEditPermissionValue] = useState("")

  useEffect(() => {
    loadRoles().finally(() => setIsLoading(false))
  }, [loadRoles])

  const handleToggle = (roleId: number) => {
    const next = expandedRoleId === roleId ? null : roleId
    setExpandedRoleId(next)
    if (next !== null) loadPermissions(roleId)
  }

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return
    await createRole(newRoleName.trim())
    setNewRoleName("")
    setIsAddingRole(false)
  }

  const handleStartEditRole = (roleId: number, currentName: string) => {
    setEditingRoleId(roleId)
    setEditRoleName(currentName)
  }

  const handleSaveEditRole = async (roleId: number) => {
    if (!editRoleName.trim()) return
    await updateRole(roleId, editRoleName.trim())
    setEditingRoleId(null)
  }

  const handleDeleteRole = async (roleId: number) => {
    if (!confirm("Delete this role? This cannot be undone.")) return
    await deleteRole(roleId)
    if (expandedRoleId === roleId) setExpandedRoleId(null)
  }

  const handleAddPermission = async (roleId: number) => {
    const value = newPermissionByRole[roleId]?.trim()
    if (!value) return
    await addPermission(roleId, value)
    setNewPermissionByRole((prev) => ({ ...prev, [roleId]: "" }))
  }

  const handleStartEditPermission = (permissionId: number, currentName: string) => {
    setEditingPermissionId(permissionId)
    setEditPermissionValue(currentName)
  }

  const handleSaveEditPermission = async (roleId: number, permissionId: number) => {
    if (!editPermissionValue.trim()) return
    await updatePermission(roleId, permissionId, editPermissionValue.trim())
    setEditingPermissionId(null)
  }

  const handleDeletePermission = async (roleId: number, permissionId: number, name: string) => {
    if (!confirm(`Remove permission "${name}" from this role?`)) return
    await deletePermission(roleId, permissionId)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your application's roles and permissions here.</p>
        </div>
        <button
          onClick={() => setIsAddingRole(true)}
          className="flex items-center gap-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-2"
        >
          <Plus size={16} />
          Add Role
        </button>
      </div>

      {isAddingRole && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <input
            autoFocus
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateRole()}
            placeholder="Role name"
            className="flex-1 rounded-md bg-slate-800 border border-slate-700 px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500"
          />
          <button onClick={handleCreateRole} className="text-green-400 hover:text-green-300 p-1.5">
            <Check size={16} />
          </button>
          <button
            onClick={() => {
              setIsAddingRole(false)
              setNewRoleName("")
            }}
            className="text-slate-400 hover:text-slate-200 p-1.5"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/60">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/60 text-slate-300">
            <tr>
              <th className="w-10 px-4 py-3" />
              <th className="px-4 py-3 text-left font-medium">Role ID</th>
              <th className="px-4 py-3 text-left font-medium">Role Name</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {isLoading && (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={4}>Loading roles...</td>
              </tr>
            )}

            {!isLoading && roles.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={4}>No roles found.</td>
              </tr>
            )}

            {!isLoading &&
              roles.map((role) => {
                const isExpanded = expandedRoleId === role.id
                const isLoadingPermissions = loadingRoleIds.has(role.id)
                const isMutating = mutatingRoleIds.has(role.id)
                const permissions = permissionsByRoleId[role.id]
                const isEditingRole = editingRoleId === role.id

                return (
                  <Fragment key={role.id}>
                    <tr className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 text-slate-400 cursor-pointer" onClick={() => handleToggle(role.id)}>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </td>
                      <td className="px-4 py-3 cursor-pointer" onClick={() => handleToggle(role.id)}>
                        {role.id}
                      </td>
                      <td className="px-4 py-3">
                        {isEditingRole ? (
                          <input
                            autoFocus
                            value={editRoleName}
                            onChange={(e) => setEditRoleName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSaveEditRole(role.id)}
                            className="w-full rounded-md bg-slate-800 border border-slate-700 px-2 py-1 text-sm text-white outline-none focus:border-blue-500"
                          />
                        ) : (
                          <span className="cursor-pointer" onClick={() => handleToggle(role.id)}>
                            {role.name}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {isEditingRole ? (
                            <>
                              <button
                                onClick={() => handleSaveEditRole(role.id)}
                                disabled={isMutating}
                                className="text-green-400 hover:text-green-300 p-1 disabled:opacity-50"
                              >
                                <Check size={15} />
                              </button>
                              <button onClick={() => setEditingRoleId(null)} className="text-slate-400 hover:text-slate-200 p-1">
                                <X size={15} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEditRole(role.id, role.name)}
                                className="text-slate-400 hover:text-blue-400 p-1"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteRole(role.id)}
                                disabled={isMutating}
                                className="text-slate-400 hover:text-red-400 p-1 disabled:opacity-50"
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-slate-900/80">
                        <td colSpan={4} className="px-4 py-3">
                          {isLoadingPermissions && (
                            <p className="text-slate-400 text-sm">Loading permissions...</p>
                          )}

                          {!isLoadingPermissions && (
                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-2">
                                {(permissions ?? []).length === 0 && (
                                  <p className="text-slate-400 text-sm">No permissions assigned.</p>
                                )}

                                {(permissions ?? []).map((permission) => {
                                  const isEditingThis = editingPermissionId === permission.id

                                  if (isEditingThis) {
                                    return (
                                      <div
                                        key={permission.id}
                                        className="flex items-center gap-1 rounded-full border border-blue-500 bg-slate-800 px-2 py-1"
                                      >
                                        <input
                                          autoFocus
                                          value={editPermissionValue}
                                          onChange={(e) => setEditPermissionValue(e.target.value)}
                                          onKeyDown={(e) =>
                                            e.key === "Enter" && handleSaveEditPermission(role.id, permission.id)
                                          }
                                          className="w-32 bg-transparent text-xs text-white outline-none"
                                        />
                                        <button
                                          onClick={() => handleSaveEditPermission(role.id, permission.id)}
                                          className="text-green-400 hover:text-green-300"
                                        >
                                          <Check size={13} />
                                        </button>
                                        <button
                                          onClick={() => setEditingPermissionId(null)}
                                          className="text-slate-400 hover:text-slate-200"
                                        >
                                          <X size={13} />
                                        </button>
                                      </div>
                                    )
                                  }

                                  return (
                                    <span
                                      key={permission.id}
                                      className="group flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs text-slate-200"
                                    >
                                      {permission.name}
                                      <button
                                        onClick={() => handleStartEditPermission(permission.id, permission.name)}
                                        className="text-slate-500 hover:text-blue-400"
                                      >
                                        <Pencil size={11} />
                                      </button>
                                      <button
                                        onClick={() => handleDeletePermission(role.id, permission.id, permission.name)}
                                        className="text-slate-500 hover:text-red-400"
                                      >
                                        <X size={11} />
                                      </button>
                                    </span>
                                  )
                                })}
                              </div>

                              <div className="flex items-center gap-2">
                                <input
                                  value={newPermissionByRole[role.id] ?? ""}
                                  onChange={(e) =>
                                    setNewPermissionByRole((prev) => ({ ...prev, [role.id]: e.target.value }))
                                  }
                                  onKeyDown={(e) => e.key === "Enter" && handleAddPermission(role.id)}
                                  placeholder="New permission (e.g. users:read)"
                                  className="w-64 rounded-md bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                />
                                <button
                                  onClick={() => handleAddPermission(role.id)}
                                  className="flex items-center gap-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5"
                                >
                                  <Plus size={13} />
                                  Add
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RolesPermissionsPage