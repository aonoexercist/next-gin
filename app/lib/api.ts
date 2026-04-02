import { logout } from "./auth";

let isRefreshing = false;

type PendingRequest = {
  resolve: (res: Response) => void;
  reject: (err: unknown) => void;
  url: string;
  options: RequestInit;
};

let pendingRequests: PendingRequest[] = [];

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `/api${endpoint}`;

  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  const res = await fetch(url, fetchOptions);

  if (res.status !== 401) {
    return res;
  }

  const data = await res.clone().json().catch(() => ({}));

  if (data.error !== "missing_token" && data.error !== "token_expired") {
    return res;
  }

  // 🔹 Create retry promise for THIS specific request
  const retryPromise = new Promise<Response>((resolve, reject) => {
    pendingRequests.push({
      resolve,
      reject,
      url,
      options: fetchOptions,
    });
  });

  if (!isRefreshing) {
    isRefreshing = true;

    try {
      const refreshRes = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        await logout();
        throw new Error("Refresh failed");
      }

      // ✅ Refresh success → retry ALL requests individually
      const queue = [...pendingRequests];
      pendingRequests = [];
      isRefreshing = false;

      await Promise.all(
        queue.map(async (req) => {
          try {
            const retryRes = await fetch(req.url, req.options);
            req.resolve(retryRes);
          } catch (err) {
            req.reject(err);
          }
        })
      );
    } catch (err) {
      isRefreshing = false;

      // ❌ Reject all pending requests
      pendingRequests.forEach((req) => req.reject(err));
      pendingRequests = [];

      await logout();
    }
  }

  return retryPromise;
}