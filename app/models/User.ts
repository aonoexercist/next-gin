export interface User {
  id?: string
  name: string;
  email: string;
  roles: Role[];
}

export interface Role {
  name: string;
  permissions: string[];
}


export interface UserRole {
  id: number;
  name: string;
}

export interface Permission {
  id?: string
  name: string
}

// Admin app types (migrated from app/admin/_data.ts)
export interface AdminRole {
  id: string
  name: string
  permissions: string[] // permission ids
}

export interface AdminUser {
  id: string
  name: string
  email: string
  roles: string[] // role names
}
