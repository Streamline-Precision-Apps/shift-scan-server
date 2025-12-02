"use client";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/lib/store/userStore";
import { getApiUrl } from "../utils/api-Utils";

/**
 * Signs the user out by clearing user state, removing relevant cookies, and redirecting to /signin.
 */
export function useSignOut() {
  const router = useRouter();
  const url = getApiUrl();

  return async function signOut() {
    try {
      // Remove token and userId from localStorage, preserve locale and biometric credentials
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("profit-store");
        localStorage.removeItem("equipment-store");
        localStorage.removeItem("cost-code-store");
        localStorage.removeItem("user-store");
      }
      // Use API to request cookie removal, passing which cookies to remove
      await fetch(`${url}/api/auth/signout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          removeCookies: ["session", "userId", "token"],
        }),
      });
    } catch (e) {
      // Ignore errors, just ensure local state is cleared
    }

    // Redirect to sign-in page
    router.replace("/signin");
  };
}
