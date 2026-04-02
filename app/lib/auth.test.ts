import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockApiFetch } = vi.hoisted(() => ({ mockApiFetch: vi.fn() }))

vi.mock("./api", () => ({ apiFetch: mockApiFetch }))

import { login, register, getMe, logout, googleLogin } from "./auth"

function makeResponse(ok: boolean, body: Record<string, unknown> = {}) {
  return { ok, json: () => Promise.resolve(body) }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("login", () => {
  it("returns data on success", async () => {
    mockApiFetch.mockResolvedValue(makeResponse(true, { id: 1 }))
    const data = await login("user@test.com", "pass")
    expect(data).toEqual({ id: 1 })
    expect(mockApiFetch).toHaveBeenCalledWith(
      "/auth/login",
      expect.objectContaining({ method: "POST" })
    )
  })

  it("throws on failure", async () => {
    mockApiFetch.mockResolvedValue(makeResponse(false))
    await expect(login("user@test.com", "wrongpass")).rejects.toThrow("Login failed")
  })
})

describe("register", () => {
  it("returns data on success", async () => {
    mockApiFetch.mockResolvedValue(makeResponse(true, { id: 2 }))
    const data = await register("John", "john@test.com", "pass")
    expect(data).toEqual({ id: 2 })
    expect(mockApiFetch).toHaveBeenCalledWith(
      "/auth/register",
      expect.objectContaining({ method: "POST" })
    )
  })

  it("throws on failure", async () => {
    mockApiFetch.mockResolvedValue(makeResponse(false))
    await expect(register("John", "john@test.com", "pass")).rejects.toThrow("Register failed")
  })
})

describe("getMe", () => {
  it("returns user data on success", async () => {
    mockApiFetch.mockResolvedValue(makeResponse(true, { id: 1, name: "John" }))
    const user = await getMe()
    expect(user).toEqual({ id: 1, name: "John" })
  })

  it("returns null when request fails", async () => {
    mockApiFetch.mockResolvedValue(makeResponse(false))
    const user = await getMe()
    expect(user).toBeNull()
  })
})

describe("logout", () => {
  it("calls the logout endpoint", async () => {
    mockApiFetch.mockResolvedValue(makeResponse(true))
    await logout()
    expect(mockApiFetch).toHaveBeenCalledWith("/auth/logout", { method: "POST" })
  })
})

describe("googleLogin", () => {
  it("returns data on success", async () => {
    mockApiFetch.mockResolvedValue(makeResponse(true, { id: 1 }))
    const data = await googleLogin("google-token")
    expect(data).toEqual({ id: 1 })
    expect(mockApiFetch).toHaveBeenCalledWith(
      "/auth/google/login",
      expect.objectContaining({ method: "POST" })
    )
  })

  it("throws on failure", async () => {
    mockApiFetch.mockResolvedValue(makeResponse(false))
    await expect(googleLogin("bad-token")).rejects.toThrow("Google login failed")
  })
})
