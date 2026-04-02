"use client"

import { useEffect, useState } from "react"
import { AdminRole, Permission } from "@/models/User"
import { createRole, updateRole, deleteRole, getPermissionsByRole, savePermissions } from "@/lib/adminApi"

interface Props {
  roles: AdminRole[]
  onAddRole: (role: { id: string; name: string }) => void
  onRenameRole: (roleId: string, newName: string) => void
  onDeleteRole: (roleId: string) => void
}

export default function AccessControl({ roles, onAddRole, onRenameRole, onDeleteRole }: Props) {
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(roles[0] ?? null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [pendingPerms, setPendingPerms] = useState<string[]>([])
  const [loadingPerms, setLoadingPerms] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const [newRoleName, setNewRoleName] = useState("")
  const [submittingRole, setSubmittingRole] = useState(false)

  const [editingRoleId, setEditingRoleId] = useState<string | null>(null)
  const [editRoleName, setEditRoleName] = useState("")

  const [newPermName, setNewPermName] = useState("")
  const [addingPerm, setAddingPerm] = useState(false)

  // Fetch permissions whenever selected role changes
  useEffect(() => {
    if (!selectedRole) return
    setLoadingPerms(true)
    setIsDirty(false)
    getPermissionsByRole(String(selectedRole.id))
      .then((data) => {
        setPermissions(data)
        setPendingPerms(data.map((p) => p.name))
      })
      .catch(() => {
        setPermissions([])
        setPendingPerms([])
      })
      .finally(() => setLoadingPerms(false))
  }, [selectedRole?.id])

  // Auto-select first role when list populates initially
  useEffect(() => {
    if (!selectedRole && roles.length > 0) {
      setSelectedRole(roles[0])
    }
  }, [roles, selectedRole])

  const togglePerm = (name: string) => {
    setPendingPerms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    )
    setIsDirty(true)
  }

  const handleAddCustomPerm = () => {
    const trimmed = newPermName.trim().toLowerCase().replace(/\s+/g, "_")
    if (!trimmed || pendingPerms.includes(trimmed)) return
    setPermissions((prev) => [...prev, { id: trimmed, name: trimmed, description: "" }])
    setPendingPerms((prev) => [...prev, trimmed])
    setNewPermName("")
    setAddingPerm(false)
    setIsDirty(true)
  }

  const handleSave = async () => {
    if (!selectedRole) return
    setSaving(true)
    console.log('selectedRole', selectedRole)
    try {
      await savePermissions(String(selectedRole.name), pendingPerms)
      setIsDirty(false)
    } catch (err) {
      console.error("Save permissions failed", err)
    } finally {
      setSaving(false)
    }
  }

  const handleAddRole = async () => {
    const trimmed = newRoleName.trim()
    if (!trimmed) return
    setSubmittingRole(true)
    try {
      const created = await createRole(trimmed)
      onAddRole({ id: String(created.id), name: created.name })
      setSelectedRole({ id: String(created.id), name: created.name, permissions: [] })
      setNewRoleName("")
    } catch (err) {
      console.error("Create role failed", err)
    } finally {
      setSubmittingRole(false)
    }
  }

  const handleRenameRole = async (roleId: string) => {
    const trimmed = editRoleName.trim()
    setEditingRoleId(null)
    if (!trimmed) return
    try {
      const updated = await updateRole(roleId, trimmed)
      onRenameRole(roleId, updated.name)
      if (selectedRole?.id === roleId) {
        setSelectedRole((prev) => prev ? { ...prev, name: updated.name } : prev)
      }
    } catch (err) {
      console.error("Rename role failed", err)
    }
  }

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (!confirm(`Delete role "${roleName}"?`)) return
    try {
      await deleteRole(roleId)
      onDeleteRole(roleId)
      if (selectedRole?.id === roleId) {
        setSelectedRole(roles.find((r) => r.id !== roleId) ?? null)
      }
    } catch (err) {
      console.error("Delete role failed", err)
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Access Control</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Roles panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-600 uppercase mb-3">Roles</h3>
          <ul className="space-y-1 mb-4">
            {roles.map((role) => (
              <li
                key={role.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  selectedRole?.id === role.id
                    ? "bg-indigo-50 border border-indigo-200"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
                onClick={() => {
                  if (editingRoleId !== role.id) setSelectedRole(role)
                }}
              >
                {editingRoleId === role.id ? (
                  <input
                    autoFocus
                    value={editRoleName}
                    onChange={(e) => setEditRoleName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameRole(role.id)
                      if (e.key === "Escape") setEditingRoleId(null)
                    }}
                    onBlur={() => handleRenameRole(role.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 text-sm border border-indigo-300 rounded px-2 py-0.5 focus:outline-none"
                  />
                ) : (
                  <span
                    className={`flex-1 text-sm font-medium truncate ${
                      selectedRole?.id === role.id ? "text-indigo-700" : "text-slate-700"
                    }`}
                    onDoubleClick={(e) => {
                      if (role.name === "super_admin") return
                      e.stopPropagation()
                      setEditingRoleId(role.id)
                      setEditRoleName(role.name)
                    }}
                    title={role.name !== "super_admin" ? "Double-click to rename" : undefined}
                  >
                    {role.name}
                  </span>
                )}
                {role.name !== "super_admin" && editingRoleId !== role.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteRole(role.id, role.name)
                    }}
                    className="text-slate-400 hover:text-red-500 text-xs ml-2 shrink-0"
                    title="Delete role"
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New role name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddRole()}
              className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={handleAddRole}
              disabled={submittingRole}
              className="px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg"
            >
              {submittingRole ? "…" : "Add"}
            </button>
          </div>
        </div>

        {/* Permissions panel */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-4">
          {selectedRole ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-600 uppercase">
                  Permissions —{" "}
                  <span className="text-indigo-600">{selectedRole.name}</span>
                </h3>
                <div className="flex items-center gap-2">
                  {isDirty && (
                    <span className="text-xs text-amber-500">Unsaved changes</span>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={saving || !isDirty}
                    className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>

              {loadingPerms ? (
                <div className="flex items-center justify-center h-24">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
                </div>
              ) : (
                <>
                  {permissions.length === 0 ? (
                    <p className="text-slate-400 text-sm mb-4">No permissions defined for this role.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {permissions.map((perm) => {
                        const assigned = pendingPerms.includes(perm.name)
                        return (
                          <label
                            key={perm.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              assigned
                                ? "bg-indigo-50 border-indigo-200"
                                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={assigned}
                              onChange={() => togglePerm(perm.name)}
                              className="mt-0.5 rounded border-slate-300 text-indigo-600"
                            />
                            <div>
                              <p className="text-sm font-medium text-slate-800">{perm.name}</p>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {addingPerm ? (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        type="text"
                        placeholder="Permission name (e.g. view_reports)"
                        value={newPermName}
                        onChange={(e) => setNewPermName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddCustomPerm()
                          if (e.key === "Escape") { setAddingPerm(false); setNewPermName("") }
                        }}
                        className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                      <button
                        onClick={handleAddCustomPerm}
                        className="px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => { setAddingPerm(false); setNewPermName("") }}
                        className="px-3 py-1.5 text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingPerm(true)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      + Add permission
                    </button>
                  )}
                </>
              )}
            </>
          ) : (
            <p className="text-slate-400 text-sm">Select a role to manage permissions</p>
          )}
        </div>
      </div>
    </div>
  )
}
