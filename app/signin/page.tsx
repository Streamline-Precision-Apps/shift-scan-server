"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOff, Fingerprint } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import {
  NativeBiometric,
  BiometryType,
} from "@capgo/capacitor-native-biometric";

import { useTranslations } from "next-intl";
import { useUserStore } from "../lib/store/userStore";
import { useProfitStore } from "../lib/store/profitStore";
import { useEquipmentStore } from "../lib/store/equipmentStore";
import { useCostCodeStore } from "../lib/store/costCodeStore";
import { getApiUrl } from "../lib/utils/api-Utils";
import Spinner from "../v1/components/(animations)/spinner";

export default function SignInPage() {
  const isNative = Capacitor.isNativePlatform();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [animateFields, setAnimateFields] = useState(false);
  const [error, setError] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("signIn");

  const redirectAfterAuth = useCallback(() => {
    const target = isNative ? "/v1" : "/admins";
    router.push(target);
  }, [isNative, router]);

  // Check biometric availability
  useEffect(() => {
    if (!isNative) return;

    const checkBiometry = async () => {
      try {
        const info = await NativeBiometric.isAvailable({ useFallback: true });
        setBiometricAvailable(info.isAvailable);
      } catch (err) {
        console.warn("Biometric check failed:", err);
        setBiometricAvailable(false);
      }
    };

    checkBiometry();
  }, [isNative]);

  // Check once if user is already signed in
  useEffect(() => {
    const checkAndHideSplash = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const userId =
          typeof window !== "undefined" ? localStorage.getItem("userId") : null;

        if (token && userId) {
          // User has credentials, attempt auto sign-in
          const url = getApiUrl();

          try {
            const res = await fetch(`${url}/api/v1/init`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
              body: JSON.stringify({ token, userId: String(userId) }),
            });

            if (!res.ok) {
              throw new Error("Auth failed");
            }

            const dataJson = await res.json();

            if (dataJson.user) {
              useUserStore.getState().setUser(dataJson.user);
              if (dataJson.jobsites) {
                useProfitStore.getState().setJobsites(dataJson.jobsites);
              }
              if (dataJson.equipments) {
                useEquipmentStore.getState().setEquipments(dataJson.equipments);
              }
              if (dataJson.costCodes) {
                useCostCodeStore.getState().setCostCodes(dataJson.costCodes);
              }
              // Successfully authenticated, redirect

              if (!dataJson.user?.accountSetup) {
                router.push("/signin/signUp");
                return;
              }

              redirectAfterAuth();
              return;
            }
          } catch (err) {
            // Auth check failed, clear invalid credentials and show sign-in form
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
          }
        }
        // Show sign-in form
        setCheckingAuth(false);
      } finally {
        // Wait 2 seconds then hide splash screen
        setTimeout(async () => {
          try {
            await SplashScreen.hide();
          } catch (e) {
            console.warn("Failed to hide splash screen:", e);
          }
        }, 2000);
      }
    };

    checkAndHideSplash();
  }, [redirectAfterAuth]);

  const performLogin = async (username: string, password: string) => {
    try {
      const API_URL = getApiUrl();
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          (data && (data.error || data.message)) ||
            res.statusText ||
            "Sign in failed"
        );
      }

      if (data && data.error) {
        throw new Error(data.error || "Sign in failed");
      }

      const userId = data.user?.id || data.userId || data.id;
      const accountSetup = data.user?.accountSetup;

      if (!data.token) {
        throw new Error("No token received from server");
      }

      if (!userId) {
        throw new Error("User ID not found in response");
      }

      // Store token, userId, and username with error handling
      try {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", String(userId));
        localStorage.setItem("username", username);
        const storedToken = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");
        const storedUsername = localStorage.getItem("username");
        if (
          storedToken !== data.token ||
          storedUserId !== String(userId) ||
          storedUsername !== username
        ) {
          console.error("❌ localStorage values do not match what was set", {
            storedToken,
            storedUserId,
            storedUsername,
          });
        }
      } catch (storageErr) {
        console.error(
          "Failed to set token/userId/username in localStorage:",
          storageErr
        );
        throw new Error("Failed to save credentials locally.");
      }

      // Save credentials for biometrics on native
      if (isNative && biometricAvailable) {
        try {
          await NativeBiometric.setCredentials({
            username,
            password,
            server: "shift-scan",
          });
        } catch (bioErr) {
          console.warn("Failed to store biometric credentials:", bioErr);
        }
      }

      const url = getApiUrl();
      const response = await fetch(`${url}/api/v1/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          token: data.token,
          userId: String(userId),
        }),
      });
      const dataJson = await response.json();
      if (dataJson.user) {
        useUserStore.getState().setUser(dataJson.user);
      }
      if (dataJson.jobsites) {
        useProfitStore.getState().setJobsites(dataJson.jobsites);
      }
      if (dataJson.equipments) {
        useEquipmentStore.getState().setEquipments(dataJson.equipments);
      }
      if (dataJson.costCodes) {
        useCostCodeStore.getState().setCostCodes(dataJson.costCodes);
      }

      // If account setup is false, redirect to sign up page
      if (accountSetup === false) {
        router.push("/signin/signUp");
        return;
      }

      redirectAfterAuth();
    } catch (err: any) {
      console.error("performLogin error:", err);
      throw err;
    }
  };

  // Biometric login
  const handleBiometricLogin = async () => {
    setBiometricLoading(true);
    setError("");
    try {
      await NativeBiometric.verifyIdentity({
        reason: "Log in to Shift Scan",
        title: "Biometric Login",
        description: "Authenticate to continue",
        negativeButtonText: "Cancel",
        useFallback: true,
      });

      const creds = await NativeBiometric.getCredentials({
        server: "shift-scan",
      });
      if (!creds?.username || !creds?.password) {
        setError("No saved credentials. Sign in with username/password first.");
        return;
      }
      //animate filling the fields
      setAnimateFields(true);
      setUsername(creds.username);
      const masked = "*".repeat(creds.password.length);
      setPassword(masked);

      await performLogin(creds.username, creds.password);
    } catch (err: any) {
      const code = err.errorCode ?? err.code;
      switch (code) {
        case 1:
          setError("Biometrics not available");
          break;
        case 3:
          setError("No biometric data enrolled");
          break;
        // handle other codes based on their doc
        default:
          setError("Biometric error: " + code);
      }
      console.error("Biometric error:", err);
    } finally {
      setAnimateFields(false);
      setBiometricLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await performLogin(username, password);
    } catch (err: any) {
      // Network or unexpected errors
      console.error("auth error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen while checking authentication
  if (checkingAuth) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-app-gradient bg-to-br from-app-dark-blue via-app-blue to-app-blue px-4 py-8 md:py-0 md:max-h-screen flex flex-col items-center justify-center">
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-br from-app-dark-blue via-app-blue to-app-blue animate-gradient-move opacity-80" />
          <div className="absolute left-1/2 top-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-app-blue opacity-20 rounded-full blur-3xl" />
          <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-app-blue opacity-10 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10 text-white text-center">
          <Spinner size={40} color="border-white" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-app-gradient bg-to-br from-app-dark-blue via-app-blue to-app-blue px-4 py-8 md:py-0 md:max-h-screen flex flex-col items-center justify-center">
      {/* Animated Gradient Background Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-app-dark-blue via-app-blue to-app-blue animate-gradient-move opacity-80" />
        <div className="absolute left-1/2 top-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-app-blue opacity-20 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-app-blue opacity-10 rounded-full blur-2xl" />
      </div>

      {/* Sign In Form */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 space-y-8 md:space-y-6">
          <div className="text-center mb-8">
            <img
              src="/windows11/StoreLogo.scale-400.png"
              alt="Shift Scan Logo"
              className="h-16 w-auto mx-auto mb-4 rounded-lg"
            />
            <h1 className="text-2xl font-bold text-app-dark-blue mb-2">
              {t("title")}
            </h1>
            <p className="text-gray-600">{t("welcome")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("username")}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 md:py-3 border border-gray-300 rounded-xl text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-app-blue focus:border-transparent transition-all duration-200"
                placeholder={t("usernamePlaceholder")}
                autoCapitalize="off"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 md:py-3 border border-gray-300 text-gray-700  placeholder:text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-app-blue focus:border-transparent transition-all duration-200"
                  placeholder={t("passwordPlaceholder")}
                  minLength={6}
                  autoCapitalize="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-pressed={showPassword}
                  aria-label={
                    showPassword ? t("hidePassword") : t("showPassword")
                  }
                  disabled={animateFields}
                  className="absolute inset-y-0 right-2 top-1/2 -translate-y-1/2 text-sm text-app-dark-blue/80 hover:text-app-dark-blue focus:outline-none"
                >
                  {showPassword ? (
                    <EyeIcon className="w-8 h-4" />
                  ) : (
                    <EyeOff className="w-8 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a
                href="/signin/forgot-password"
                className="text-sm text-app-dark-blue hover:text-app-blue transition-colors font-medium"
              >
                {t("forgotPassword")}
              </a>
            </div>

            {error && (
              <div className="bg-app-red/10 border border-app-red/20 text-app-red px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            <div className="flex flex-row gap-2">
              {isNative && biometricAvailable && (
                <button
                  type="button"
                  onClick={handleBiometricLogin}
                  disabled={biometricLoading || loading}
                  className="w-20   border border-app-dark-blue text-white font-bold p-1 rounded-xl shadow-lg text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-app-dark-blue flex items-center justify-center gap-2"
                >
                  <Fingerprint className="w-4 h-4" color="black" />
                </button>
              )}
              <button
                type="submit"
                disabled={loading || animateFields}
                className="w-full bg-app-dark-blue hover:bg-app-dark-blue/80 disabled:bg-app-dark-blue/50 text-white font-bold py-3 px-8 rounded-xl shadow-lg text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-app-blue"
              >
                <div className="flex flex-row  items-center justify-center gap-2">
                  {loading || animateFields ? t("loading") : t("submit")}
                  {loading || animateFields ? (
                    <Spinner size={20} color={"border-white"} />
                  ) : null}
                </div>
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            {!isNative && (
              <a
                href="/"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                ← {t("backToHome")}
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
