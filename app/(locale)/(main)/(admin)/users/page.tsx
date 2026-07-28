"use client"

import { useEffect, useRef, useState, useLayoutEffect } from "react"
import { createPortal } from "react-dom"
import { useUsersStore } from "@/hooks/useUsersStore"
import { useRolesStore } from "@/hooks/useRolesStore"
import { User } from "@/models/User"

type MenuPosition = { top: number; left: number; openUpward: boolean }

const UserPage = () => {
  const users = useUsersStore((state) => state.users)
  const loadUsers = useUsersStore((state) => state.load)
  const deleteUser = useUsersStore((state) => state.deleteUser)
  const updateUser = useUsersStore((state) => state.updateUser)
  const assignRoles = useUsersStore((state) => state.assignRoles)

  const roles = useRolesStore((state) => state.roles) // e.g. [{ id, name }]
  const loadRoles = useRolesStore((state) => state.load)

  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Dropdown menu (which row's menu is open)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  // Assign-role modal
  const [assignModalUser, setAssignModalUser] = useState<User | null>(null)
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([])
  const [isSavingRoles, setIsSavingRoles] = useState(false)

  // Edit-user modal
  const [editModalUser, setEditModalUser] = useState<User | null>(null)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  useEffect(() => {
    Promise.all([loadUsers(), loadRoles?.()]).finally(() => setIsLoading(false))
  }, [loadUsers, loadRoles])

  // Close dropdown when clicking outside of it (checks both the button and the portal menu)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const clickedButton = openMenuId ? buttonRefs.current[openMenuId]?.contains(target) : false
      const clickedMenu = menuRef.current?.contains(target)
      if (!clickedButton && !clickedMenu) {
        setOpenMenuId(null)
        setMenuPosition(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openMenuId])

  // Reposition/close on scroll or resize so the menu never drifts from its button
  useEffect(() => {
    if (!openMenuId) return
    const close = () => {
      setOpenMenuId(null)
      setMenuPosition(null)
    }
    window.addEventListener("scroll", close, true)
    window.addEventListener("resize", close)
    return () => {
      window.removeEventListener("scroll", close, true)
      window.removeEventListener("resize", close)
    }
  }, [openMenuId])

  const MENU_WIDTH = 160 // matches w-40
  const MENU_HEIGHT_ESTIMATE = 130 // ~3 items + divider, used to decide open-up vs open-down

  const toggleMenu = (userId: string) => {
    if (openMenuId === userId) {
      setOpenMenuId(null)
      setMenuPosition(null)
      return
    }

    const btn = buttonRefs.current[userId]
    if (btn) {
      const rect = btn.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const openUpward = spaceBelow < MENU_HEIGHT_ESTIMATE && rect.top > MENU_HEIGHT_ESTIMATE

      setMenuPosition({
        top: openUpward ? rect.top - 4 : rect.bottom + 4,
        left: Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8),
        openUpward,
      })
    }
    setOpenMenuId(userId)
  }

  const handleDelete = async (user: User) => {
    setOpenMenuId(null)
    setMenuPosition(null)
    if (!user.id) return // guard against missing id
    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return
    try {
      setDeletingId(String(user.id))
      await deleteUser(String(user.id))
    } catch (err) {
      console.error("Failed to delete user", err)
      alert("Failed to delete user.")
    } finally {
      setDeletingId(null)
    }
  }

  const openEditModal = (user: User) => {
    setOpenMenuId(null)
    setMenuPosition(null)
    setEditModalUser(user)
    setEditName(user.name)
    setEditEmail(user.email)
  }

  const closeEditModal = () => {
    setEditModalUser(null)
    setEditName("")
    setEditEmail("")
  }

  const handleSaveEdit = async () => {
    if (!editModalUser?.id) return
    try {
      setIsSavingEdit(true)
      await updateUser(String(editModalUser.id), { name: editName, email: editEmail })
      closeEditModal()
    } catch (err) {
      console.error("Failed to update user", err)
      alert("Failed to update user.")
    } finally {
      setIsSavingEdit(false)
    }
  }

  const openAssignModal = (user: User) => {
    setOpenMenuId(null)
    setMenuPosition(null)
    setAssignModalUser(user)
    setSelectedRoleIds(user.roles?.map((r: any) => Number(r.id)) ?? [])
  }

  const closeAssignModal = () => {
    setAssignModalUser(null)
    setSelectedRoleIds([])
  }

  const toggleRole = (roleId: number) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    )
  }

  const handleSaveRoles = async () => {
    if (!assignModalUser?.id) return
    try {
      setIsSavingRoles(true)
      await assignRoles(String(assignModalUser.id), selectedRoleIds)
      closeAssignModal()
    } catch (err) {
      console.error("Failed to assign roles", err)
      alert("Failed to assign roles.")
    } finally {
      setIsSavingRoles(false)
    }
  }

  const openMenuUser = users.find((u) => String(u.id) === openMenuId) ?? null
  const buildRolesTooltip = (userRoles: any[]) =>
    userRoles
      .map((r) => `${r.name}: ${r.permissions?.length ? r.permissions.join(", ") : "no permissions"}`)
      .join("\n")

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
              <th className="px-4 py-3 text-left font-medium">Roles</th>
              <th className="px-4 py-3 text-right font-medium w-16">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {isLoading && (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={4}>
                  Loading users...
                </td>
              </tr>
            )}

            {!isLoading && users.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={4}>
                  No users found.
                </td>
              </tr>
            )}

            {!isLoading &&
              users.map((user) => {
                const userId = String(user.id ?? "")
                const hasRoles = (user.roles?.length ?? 0) > 0

                return (
                  <tr key={user.id ?? `${user.email}-${user.name}`} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {hasRoles ? (
                        <span
                          className="cursor-default underline decoration-dotted decoration-slate-600 underline-offset-4"
                          title={buildRolesTooltip(user.roles as any[])}
                        >
                          {(user.roles as any[])
                            .map((role) => role?.name)
                            .filter((name: any): name is string => Boolean(name))
                            .join(", ")}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 text-right relative">
                      <button
                        ref={(el) => {
                          buttonRefs.current[userId] = el
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleMenu(userId)
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        aria-label="Open actions menu"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-5 w-5"
                        >
                          <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {/* Actions dropdown — rendered in a portal so it can never be clipped by the
          table's scroll container (overflow-x-auto implicitly makes overflow-y "auto" too,
          which was cutting the menu off at the container edge). */}
      {openMenuId &&
        menuPosition &&
        openMenuUser &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuPosition.openUpward ? undefined : menuPosition.top,
              bottom: menuPosition.openUpward ? window.innerHeight - menuPosition.top : undefined,
              left: menuPosition.left,
              width: 160,
            }}
            className="z-50 rounded-md border border-slate-700 bg-slate-800 shadow-lg py-1"
          >
            <button
              onClick={() => openEditModal(openMenuUser)}
              className="block w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700"
            >
              Edit user
            </button>
            <button
              onClick={() => openAssignModal(openMenuUser)}
              className="block w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700"
            >
              Assign role
            </button>
            <div className="my-1 border-t border-slate-700" />
            <button
              onClick={() => handleDelete(openMenuUser)}
              disabled={deletingId === String(openMenuUser.id)}
              className="block w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-950/40 disabled:opacity-50"
            >
              {deletingId === String(openMenuUser.id) ? "Deleting..." : "Delete user"}
            </button>
          </div>,
          document.body
        )}

      {/* Assign Role modal */}
      {assignModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-lg font-semibold text-white mb-1">Assign Roles</h2>
            <p className="text-sm text-slate-400 mb-4">
              Select roles for <span className="text-slate-200">{assignModalUser.name}</span>
            </p>

            <div className="max-h-56 overflow-y-auto space-y-2 mb-4">
              {roles?.length ? (
                roles.map((role: any) => (
                  <label
                    key={role.id}
                    className="flex items-center gap-2 rounded-md border border-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/60 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoleIds.includes(Number(role.id))}
                      onChange={() => toggleRole(Number(role.id))}
                      className="accent-blue-600"
                    />
                    {role.name}
                  </label>
                ))
              ) : (
                <p className="text-sm text-slate-500">No roles available.</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeAssignModal}
                className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoles}
                disabled={isSavingRoles}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {isSavingRoles ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User modal */}
      {editModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Edit User</h2>

            <label className="block text-xs text-slate-400 mb-1">Name</label>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 mb-3"
            />

            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={closeEditModal}
                className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {isSavingEdit ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserPage