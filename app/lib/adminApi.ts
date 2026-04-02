import { apiFetch } from "./api"
import { Permission } from "@/models/User"

export async function createRole(name: string): Promise<{ id: number; name: string }> {
  const res = await apiFetch("/admin/roles", {
    method: "POST",
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error("Failed to create role")
  return res.json()
}

export async function updateRole(id: string, name: string): Promise<{ id: number; name: string }> {
  const res = await apiFetch(`/admin/roles/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error("Failed to update role")
  return res.json()
}

export async function deleteRole(id: string): Promise<void> {
  const res = await apiFetch(`/admin/roles/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete role")
}

export async function getPermissionsByRole(roleId: string): Promise<Permission[]> {
  const res = await apiFetch(`/admin/permissions/role/${roleId}`)
  if (!res.ok) throw new Error("Failed to fetch permissions")
  return res.json()
}

export async function savePermissions(role_name: string, permissions: string[]): Promise<void> {
  const res = await apiFetch("/admin/permissions/save", {
    method: "POST",
    body: JSON.stringify({ name: role_name, permissions }),
  })
  if (!res.ok) throw new Error("Failed to save permissions")
}

export async function updateUserRole(userId: string, roles: string[]): Promise<void> {
  const res = await apiFetch(`/admin/roles/update/user`, {
    method: "PUT",
    body: JSON.stringify({ user_id: userId, role_names: roles }),
  })
  if (!res.ok) throw new Error("Failed to update user role")
}
