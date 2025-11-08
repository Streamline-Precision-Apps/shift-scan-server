// client/app/lib/client/cookie-utils.ts
import { CapacitorCookies } from "@capacitor/core";
import { Device } from "@capacitor/device";
const COOKIE_KEY = "locale";

// Sanitize cookie value - reject nested objects or malformed data
function isCookieValueValid(value: unknown): boolean {
  if (typeof value !== "string") return false;
  if (value.length === 0) return false;
  // Reject if it looks like a malformed nested object (contains %3A or multiple nested "value")
  if (value.includes("value%22%3A%7B%22value%22")) return false;
  if (value.includes("j%3A%7B")) return false; // URL-encoded malformed JSON
  return true;
}

// Read cookies using CapacitorCookies when available, otherwise document.cookie
export async function readLocaleCookie(): Promise<string | null> {
  // 1) Try CapacitorCookies (native/webview) if available
  try {
    if (
      typeof CapacitorCookies !== "undefined" &&
      CapacitorCookies &&
      typeof CapacitorCookies.getCookies === "function" &&
      typeof window !== "undefined"
    ) {
      const url = window.location.origin;
      // Capacitor may return a map of cookies: Record<string, { value?: string }>
      const map = (await CapacitorCookies.getCookies({ url })) as
        | Record<string, { value?: string }>
        | null
        | undefined;
      if (map) {
        const entry = map[COOKIE_KEY];
        if (
          entry &&
          typeof entry.value === "string" &&
          entry.value.length > 0 &&
          isCookieValueValid(entry.value)
        ) {
          return entry.value;
        }
      }
    }
  } catch (e) {
    // swallow and try other fallbacks
  }

  // 2) Fallback to document.cookie (web or patched webview)
  if (typeof document !== "undefined" && typeof document.cookie === "string") {
    const cookies = document.cookie.split("; ").map((c) => c.trim());
    const match = cookies.find((c) =>
      c.startsWith(`${encodeURIComponent(COOKIE_KEY)}=`)
    );
    if (match) {
      const parts = match.split("=");
      const raw = parts.slice(1).join("=") || "";
      if (raw.length > 0) return decodeURIComponent(raw);
    }
  }

  // 3) Fallback to Device.getLanguageTag()
  try {
    const deviceLang = await Device.getLanguageTag();
    if (
      deviceLang &&
      typeof deviceLang.value === "string" &&
      deviceLang.value.length > 0
    ) {
      return deviceLang.value;
    }
  } catch (e) {
    // ignore
  }

  return null;
}

export async function setLocaleCookie(value: string) {
  // Validate input before storing
  if (!isCookieValueValid(value)) {
    console.warn("❌ Attempted to set invalid cookie value:", value);
    return; // Don't set malformed cookies
  }

  const url =
    typeof window !== "undefined" ? window.location.origin : "http://localhost"; // pick sensible default
  try {
    if (CapacitorCookies && typeof CapacitorCookies.setCookie === "function") {
      // set native cookie (you can pass path/expires if needed)
      await CapacitorCookies.setCookie({ url, key: COOKIE_KEY, value });
    } else if (typeof document !== "undefined") {
      const expires = new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toUTCString();
      document.cookie = `${encodeURIComponent(COOKIE_KEY)}=${encodeURIComponent(
        value
      )}; path=/; expires=${expires};`;
    }
  } catch (e) {
    // ignore
  }
}

export async function deleteLocaleCookie() {
  const url =
    typeof window !== "undefined" ? window.location.origin : "http://localhost";
  try {
    if (
      CapacitorCookies &&
      typeof CapacitorCookies.deleteCookie === "function"
    ) {
      await CapacitorCookies.deleteCookie({ url, key: COOKIE_KEY });
    } else if (typeof document !== "undefined") {
      document.cookie = `${encodeURIComponent(
        COOKIE_KEY
      )}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    }
  } catch (e) {}
}
