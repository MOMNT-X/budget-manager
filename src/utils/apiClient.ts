import { BASE_URL, extractErrorMessage } from "@/config/api";

interface RequestOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTTL?: number; // Time to live in milliseconds
}

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

// Simple in-memory cache
const cache = new Map<string, CacheEntry>();

// Clean up expired cache entries
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > entry.ttl) {
      cache.delete(key);
    }
  }
};

// Run cleanup every 5 minutes
setInterval(cleanupCache, 5 * 60 * 1000);

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("access_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiClient = async <T = any>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const {
    retries = 3,
    retryDelay = 1000,
    cache: useCache = false,
    cacheTTL = 5 * 60 * 1000, // 5 minutes default
    ...fetchOptions
  } = options;

  // Check cache for GET requests
  const cacheKey = `${path}:${JSON.stringify(fetchOptions.body || {})}`;
  if (useCache && fetchOptions.method === undefined || fetchOptions.method === "GET") {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
  }

  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const headers = {
    ...getAuthHeaders(),
    ...(fetchOptions.headers || {}),
  };

  let lastError: Error | null = null;
  let attempt = 0;

  while (attempt <= retries) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = extractErrorMessage(
          data,
          `Request failed with status ${response.status}`
        );
        throw new ApiError(errorMessage, response.status, data);
      }

      // Cache successful GET responses
      if (useCache && (fetchOptions.method === undefined || fetchOptions.method === "GET")) {
        cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl: cacheTTL,
        });
      }

      return data;
    } catch (error) {
      lastError = error as Error;

      // Don't retry on 4xx errors (client errors)
      if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === retries) {
        break;
      }

      // Exponential backoff
      const delay = retryDelay * Math.pow(2, attempt);
      await sleep(delay);
      attempt++;
    }
  }

  throw lastError || new Error("Request failed after retries");
};

// Helper to cancel requests (for component unmounts)
export const createAbortController = () => {
  return new AbortController();
};

// Export convenience methods
export const apiGet = <T = any>(
  path: string,
  options?: Omit<RequestOptions, "method" | "body">
) => apiClient<T>(path, { ...options, method: "GET", cache: true });

export const apiPost = <T = any>(
  path: string,
  body?: any,
  options?: Omit<RequestOptions, "method" | "body">
) =>
  apiClient<T>(path, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });

export const apiPut = <T = any>(
  path: string,
  body?: any,
  options?: Omit<RequestOptions, "method" | "body">
) =>
  apiClient<T>(path, {
    ...options,
    method: "PUT",
    body: JSON.stringify(body),
  });

export const apiPatch = <T = any>(
  path: string,
  body?: any,
  options?: Omit<RequestOptions, "method" | "body">
) =>
  apiClient<T>(path, {
    ...options,
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const apiDelete = <T = any>(
  path: string,
  options?: Omit<RequestOptions, "method" | "body">
) => apiClient<T>(path, { ...options, method: "DELETE" });

