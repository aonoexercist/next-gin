import { apiFetch } from "./api"

export async function login(email: string, password: string) {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) throw new Error("Login failed")

  return res.json()
}

export async function register(name: string, email: string, password: string) {
  const res = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  })

  if (!res.ok) throw new Error("Register failed")

  return res.json()
}

export async function getMe() {
  // const res = await apiFetch("/me")

  // if (!res.ok) return null

  // return res.json()

  return {
    id: 1,
    email: "john@example.com",
    name: "John Doe",
  }
}

export async function logout() {
  await apiFetch("/logout", { method: "POST" })
}