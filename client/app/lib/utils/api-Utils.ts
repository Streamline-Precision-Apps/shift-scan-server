import { Capacitor } from "@capacitor/core";
const isNative = Capacitor.isNativePlatform();

export function getApiUrl() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  return API_URL;
}

// Utility to get token from localStorage
export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || "";
  }
  return "";
}

export function getUserId() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userId") || "";
  }
  return "";
}

// Helper for API requests with enhanced error handling
export async function apiRequest(
  path: string,
  method: string,
  body?: Record<string, unknown> | FormData
) {
  const url = `${getApiUrl()}${path}`;
  const token = getToken();

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  let fetchBody: string | FormData | undefined;

  // Only attach body for non-GET/HEAD requests
  let includeBody = body && method !== "GET" && method !== "HEAD";

  if (includeBody && body instanceof FormData) {
    // Don't set Content-Type header - browser will set it with boundary
    fetchBody = body;
  } else if (includeBody && body) {
    // Regular JSON request
    headers["Content-Type"] = "application/json";
    fetchBody = JSON.stringify(body);
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: "include", // ✅ CRITICAL: Allow cookies to be sent and received
  };
  if (includeBody) {
    fetchOptions.body = fetchBody;
  }

  try {
    const res = await fetch(url, fetchOptions);
    if (res.status === 204) return []; // or return [] if you expect an array
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }
    return res.json();
  } catch (error) {
    // Log cookie-related errors for debugging
    console.error(`❌ API request failed [${method} ${path}]:`, error);
    throw error;
  }
}

// Helper for API requests without response status check
export async function apiRequestNoResCheck(
  path: string,
  method: string,
  body?: Record<string, unknown> | FormData
) {
  const url = `${getApiUrl()}${path}`;
  const token = getToken();

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  let fetchBody: string | FormData | undefined;

  // Check if body is FormData
  if (body instanceof FormData) {
    // Don't set Content-Type header - browser will set it with boundary
    fetchBody = body;
  } else if (body) {
    // Regular JSON request
    headers["Content-Type"] = "application/json";
    fetchBody = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: fetchBody,
      credentials: "include", // ✅ CRITICAL: Allow cookies to be sent and received
    });

    return res;
  } catch (error) {
    console.error(`❌ API request failed [${method} ${path}]:`, error);
    throw error;
  }
}
