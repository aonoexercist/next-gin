let isRefreshing = false;
let pendingRequests: ((res: Response) => void)[] = [];

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `/api${endpoint}`;
  const fetchOptions = {
    ...options,
    credentials: "include" as const,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  const res = await fetch(url, fetchOptions);

  if (res.status !== 401) {
    return res;
  }

  // Clone to check if it's a refreshable error without consuming the stream
  const data = await res.clone().json().catch(() => ({}));

  if (data.error !== "missing_token" && data.error !== "token_expired") {
    return res; 
  }

  // --- REFRESH LOGIC ---
  
  // 1. Create a promise that will resolve once the refresh is done
  const retryPromise = new Promise<Response>((resolve) => {
    pendingRequests.push((res: Response) => {
      resolve(res);
    });
  });

  // 2. Only one request starts the refresh process
  if (!isRefreshing) {
    isRefreshing = true;

    try {
      const refreshRes = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        isRefreshing = false;
        // 3. Execute all queued retries
        const queue = [...pendingRequests];
        pendingRequests = []; // Clear queue before running to avoid loops
        const retryRes = await fetch(url, fetchOptions);
        queue.forEach((callback) => callback(retryRes));
      } else {
        throw new Error("Refresh failed");
      }
    } catch (err) {
      isRefreshing = false;
      pendingRequests = [];
      // window.location.href = "/login"; // Or your logout logic
      throw err;
    }
  }

  // 4. All 401 requests (the first one AND simultaneous ones) wait here
  return retryPromise;
}