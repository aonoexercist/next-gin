import { describe, it, expect, vi, beforeEach } from "vitest"
import type { NextRequest } from "next/server"

const { mockRedirect, mockNext } = vi.hoisted(() => ({
  mockRedirect: vi.fn(),
  mockNext: vi.fn(),
}))

vi.mock("next/server", () => ({
  NextResponse: {
    redirect: mockRedirect,
    next: mockNext,
  },
}))

import { proxy } from "./proxy"

function makeRequest(pathname: string, hasToken = false): NextRequest {
  return {
    nextUrl: { pathname },
    cookies: {
      get: (name: string) =>
        name === "access_token" && hasToken ? { value: "tok" } : undefined,
    },
    url: `http://localhost${pathname}`,
  } as unknown as NextRequest
}

beforeEach(() => {
  vi.clearAllMocks()
  mockNext.mockReturnValue({ type: "next" })
  mockRedirect.mockImplementation((url: URL) => ({ type: "redirect", pathname: url.pathname }))
})

describe("proxy middleware", () => {
  it("redirects unauthenticated user from /dashboard to /", async () => {
    await proxy(makeRequest("/dashboard"))
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/" })
    )
  })

  it("redirects authenticated user from /login to /dashboard", async () => {
    await proxy(makeRequest("/login", true))
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/dashboard" })
    )
  })

  it("redirects authenticated user from /register to /dashboard", async () => {
    await proxy(makeRequest("/register", true))
    expect(mockRedirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/dashboard" })
    )
  })

  it("allows authenticated user through /dashboard route", async () => {
    await proxy(makeRequest("/dashboard", true))
    expect(mockNext).toHaveBeenCalled()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it("allows unauthenticated user to access /login", async () => {
    await proxy(makeRequest("/login"))
    expect(mockNext).toHaveBeenCalled()
    expect(mockRedirect).not.toHaveBeenCalled()
  })

  it("allows unauthenticated user through unprotected routes", async () => {
    await proxy(makeRequest("/about"))
    expect(mockNext).toHaveBeenCalled()
    expect(mockRedirect).not.toHaveBeenCalled()
  })
})
