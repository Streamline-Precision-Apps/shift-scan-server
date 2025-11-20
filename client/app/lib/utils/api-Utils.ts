export function getApiUrl() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  return API_URL;
}

// Utility to get token from localStorage
export function getToken() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token") || "";
    
    // Check if token exists and is valid JWT format
    if (token) {
      try {
        // Decode JWT to check expiration (without verification)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        
        if (expirationTime < currentTime) {
          console.warn("⚠️ JWT token has expired");
          console.warn("Token expired at:", new Date(expirationTime).toLocaleString());
          console.warn("Current time:", new Date(currentTime).toLocaleString());
          console.warn("Please sign in again to obtain a new token");
        }
      } catch (e) {
        // If token parsing fails, it's likely invalid
        console.error("⚠️ Invalid JWT token format in localStorage");
      }
    }
    
    return token;
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

  // Debug: Check if token exists
  if (!token) {
    console.warn("⚠️ No authentication token found in localStorage");
    console.warn("Please sign in again to obtain a valid token");
  }

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
      
      // Special handling for auth errors
      if (res.status === 401 || res.status === 403) {
        console.error("🔐 Authentication failed - token may be invalid or expired");
        console.error("Please sign out and sign in again to refresh your session");
        
        // Optionally redirect to signin (uncomment if desired)
        // if (typeof window !== 'undefined') {
        //   window.location.href = '/signin';
        // }
      }
      
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
