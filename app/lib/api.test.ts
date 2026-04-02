import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

// Reset module state and mocks before every test so the
// module-level `isRefreshing` / `pendingRequests` variables start fresh.
let apiFetch: (endpoint: string, options?: RequestInit) => Promise<Response>
let mockLogout: ReturnType<typeof vi.fn>

beforeEach(async () => {
  vi.resetModules()
  mockLogout = vi.fn()
  vi.doMock("./auth", () => ({ logout: mockLogout }))
  const mod = await import("./api")
  apiFetch = mod.apiFetch
})

afterEach(() => {
  vi.unstubAllGlobals()
})

// ── helpers ──────────────────────────────────────────────────────────────────

function makeResponse(status: number, body: Record<string, unknown> = {}) {
  const r = {
    ok: status >= 200 && status < 300,
    status,
    clone: () => ({ json: () => Promise.resolve(body) }),
    json: () => Promise.resolve(body),
  }
  return r
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe("apiFetch", () => {
  it("prepends /api and returns response for successful request", async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeResponse(200, { data: "ok" }))
    vi.stubGlobal("fetch", fetchMock)

    const res = await apiFetch("/users")

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/users",
      expect.objectContaining({ credentials: "include" })
    )
    expect(res.ok).toBe(true)
  })

  it("passes through 401 that is not a token error", async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeResponse(401, { error: "forbidden" }))
    vi.stubGlobal("fetch", fetchMock)

    const res = await apiFetch("/users")

    expect(res.status).toBe(401)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("refreshes token and retries on missing_token 401", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(401, { error: "missing_token" })) // original request
      .mockResolvedValueOnce({ ok: true })                                  // token refresh
      .mockResolvedValueOnce(makeResponse(200, { data: "retried" }))        // retry

    vi.stubGlobal("fetch", fetchMock)

    const res = await apiFetch("/users")

    expect(res.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/auth/refresh",
      expect.objectContaining({ method: "POST" })
    )
  })

  it("refreshes token and retries on token_expired 401", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(401, { error: "token_expired" }))
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce(makeResponse(200, {}))

    vi.stubGlobal("fetch", fetchMock)

    const res = await apiFetch("/profile")

    expect(res.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it("calls logout and rejects all requests when refresh fails", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(401, { error: "missing_token" }))
      .mockResolvedValueOnce({ ok: false }) // refresh fails

    vi.stubGlobal("fetch", fetchMock)

    await expect(apiFetch("/users")).rejects.toThrow("Refresh failed")
    expect(mockLogout).toHaveBeenCalled()
  })

  it("queues concurrent 401 requests and retries all after one refresh", async () => {
    // First two requests return 401; refresh succeeds; both retries return 200.
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(makeResponse(401, { error: "missing_token" })) // req A
      .mockResolvedValueOnce(makeResponse(401, { error: "missing_token" })) // req B
      .mockResolvedValueOnce({ ok: true })                                  // refresh
      .mockResolvedValue(makeResponse(200, {}))                             // retries

    vi.stubGlobal("fetch", fetchMock)

    const [a, b] = await Promise.all([apiFetch("/a"), apiFetch("/b")])

    expect(a.ok).toBe(true)
    expect(b.ok).toBe(true)
    // only one refresh call
    const refreshCalls = (fetchMock.mock.calls as [string][]).filter(
      ([url]) => url === "/api/auth/refresh"
    )
    expect(refreshCalls).toHaveLength(1)
  })
})
