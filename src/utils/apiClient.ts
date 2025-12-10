import { toast } from "sonner";
import { redirectToLogin } from "./utils";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const extractErrorMessage = (data: any, fallback: string) => {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  if (Array.isArray(data.message)) return data.message.join(", ");
  if (data.error) return String(data.error);
  return fallback;
};

interface RequestOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTTL?: number; // Time to live in milliseconds
  dedupe?: boolean;
  timeout?: number;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

// Simple in-memory cache
const cache = new Map<string, CacheEntry>();
const inFlightRequests = new Map<string, Promise<any>>();

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

const serializeBody = (body: BodyInit | null | undefined) => {
  if (!body) return "";
  if (typeof body === "string") return body;
  if (body instanceof URLSearchParams) return body.toString();
  try {
    return JSON.stringify(body);
  } catch {
    return `[unserializable:${body.constructor?.name ?? "body"}]`;
  }
};

const ERROR_NOTIFIED = Symbol("api-error-notified");

const notifyRequestError = (error: unknown, url: string) => {
  if (!error) return;
  const errObj = error as Record<string | symbol, unknown>;
  if (errObj && errObj[ERROR_NOTIFIED]) return;

  const message =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Request failed";

  toast.error(message || "Request failed", {
    description: url,
  });

  if (errObj) {
    errObj[ERROR_NOTIFIED] = true;
  }
};

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
    dedupe = true,
    timeout,
    ...fetchOptions
  } = options;

  const normalizedMethod = (fetchOptions.method || "GET").toUpperCase();
  const serializedBody = serializeBody(fetchOptions.body);
  const requestKey = `${normalizedMethod}:${path}:${serializedBody}`;

  // Check cache for GET requests
  const cacheKey = requestKey;
  if (useCache && (fetchOptions.method === undefined || fetchOptions.method === "GET")) {
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

  if (dedupe) {
    const inFlight = inFlightRequests.get(requestKey);
    if (inFlight) {
      return inFlight;
    }
  }

  const executeRequest = async (): Promise<T> => {
    const controller = timeout ? new AbortController() : null;
    const userSignal = fetchOptions.signal;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (controller && userSignal) {
      if (userSignal.aborted) {
        controller.abort(userSignal.reason);
      } else {
        const onAbort = () => controller.abort(userSignal.reason);
        userSignal.addEventListener("abort", onAbort, { once: true });
      }
    }

    if (controller && timeout) {
      timeoutId = setTimeout(() => {
        controller.abort(new Error("Request timed out"));
      }, timeout);
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller ? controller.signal : fetchOptions.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Handle 401 Unauthorized - authentication expired
        if (response.status === 401) {
          const errorMessage = extractErrorMessage(
            data,
            "Unauthorized - Your session has expired"
          );
          
          // Check if we're not already on a public route
          const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
          const isPublicRoute = currentPath === "/login" || currentPath === "/signup" || currentPath === "/";
          
          if (!isPublicRoute) {
            // Redirect to login with a message
            redirectToLogin("Your session has expired. Please login again.");
          }
          
          throw new ApiError(errorMessage, response.status, data);
        }
        
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
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };

  while (attempt <= retries) {
    try {
      const promise = executeRequest();
      if (dedupe) {
        inFlightRequests.set(requestKey, promise);
      }
      const data = await promise;
      return data;
    } catch (error) {
      lastError = error as Error;

      // Handle network errors (offline scenarios)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        // Check if user is offline
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          toast.error("You are offline. Please check your internet connection.");
        }
        // Note: We don't redirect on network errors as they could be due to various reasons
        // (server down, network issues, etc.). Only 401 errors trigger redirect to login.
      }

      // Don't retry on 4xx errors (client errors)
      if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
        // Don't notify 401 errors again as we already handled the redirect
        if (error.status !== 401) {
          notifyRequestError(error, url);
        }
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
    } finally {
      if (dedupe) {
        inFlightRequests.delete(requestKey);
      }
    }
  }

  const finalError = lastError || new Error("Request failed after retries");
  notifyRequestError(finalError, url);
  throw finalError;
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

