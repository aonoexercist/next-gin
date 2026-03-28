export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  return fetch(`/api${endpoint}`, {
    ...options,
    credentials: "include", // still needed
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })
}