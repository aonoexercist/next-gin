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
  const res = await apiFetch("/services/me")

  if (!res.ok) return null

  return res.json()
}

export async function logout() {
  await apiFetch("/auth/logout", { method: "POST" })
}

export async function refreshToken() {
  const res = await apiFetch("/auth/refresh", { method: "POST" })

  if (!res.ok) {
    await logout()
    throw new Error("Session expired")
  }
}

export async function googleLogin(token: string) {
  const res = await apiFetch("/auth/google/login", {
    method: "POST",
    body: JSON.stringify({ token }),
  })

  if (!res.ok) throw new Error("Google login failed")

  return res.json()
}
