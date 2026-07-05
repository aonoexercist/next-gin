export type SidebarItem = {
  name: string
  path: string
  requiredPermission?: string
}

export const sidebarConfig: SidebarItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "Users",
    path: "/users",
    requiredPermission: "user:manage",
  },
  {
    name: "Roles & Permissions",
    path: "/roles-permissions",
    requiredPermission: "role:manage",
  },
  {
    name: "Todos",
    path: "/todos",
    requiredPermission: "todo:read",
  },
]
