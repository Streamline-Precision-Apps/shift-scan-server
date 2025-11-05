"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOff, Fingerprint } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import {
  BiometricAuth,
  BiometryErrorType,
} from "@aparajita/capacitor-biometric-auth";
import type { CheckBiometryResult } from "@aparajita/capacitor-biometric-auth";
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
  const [error, setError] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("signIn");

  const redirectAfterAuth = useCallback(() => {
    const target = isNative ? "/v1" : "/admins";
    router.push(target);
  }, [isNative, router]);

  // Update biometry state and handle availability changes
  const updateBiometryInfo = useCallback((info: CheckBiometryResult): void => {
    if (info.isAvailable) {
      // Biometry is available, info.biometryType will tell you the primary type.
      setBiometricAvailable(true);
    } else {
      // Biometry is not available, info.reason and info.code will tell you why.
      console.log(
        `Biometry unavailable - Reason: ${info.reason}, Code: ${info.code}`
      );
      setBiometricAvailable(false);
    }
  }, []);

  // Check biometric availability
  useEffect(() => {
    const checkBiometryAvailability = async () => {
      if (isNative) {
        try {
          const biometryInfo = await BiometricAuth.checkBiometry();
          updateBiometryInfo(biometryInfo);
        } catch (err) {
          if (err instanceof Error) {
            console.error("Biometric check failed:", err.message);
          } else {
            console.error("Biometric check failed:", err);
          }
          setBiometricAvailable(false);
        }
      }
    };

    checkBiometryAvailability();
  }, [isNative, updateBiometryInfo]);

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
              redirectAfterAuth();
              return;
            }
          } catch (err) {
            // Auth check failed, clear invalid credentials and show sign-in form
            console.log("Auto sign-in failed:", err);
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

      if (!data.token) {
        throw new Error("No token received from server");
      }

      if (!userId) {
        throw new Error("User ID not found in response");
      }

      // Store token and userId
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", String(userId));

      // Save credentials for biometric login on native platforms (with delay to ensure storage)
      if (isNative && biometricAvailable) {
        try {
          localStorage.setItem("shift_scan_username", username);
          localStorage.setItem("shift_scan_password", password);
          console.log("✅ Biometric credentials saved");
          // Wait a bit to ensure credentials are persisted before continuing
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (bioErr) {
          console.error("Failed to save biometric credentials:", bioErr);
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

      redirectAfterAuth();
    } catch (err: any) {
      throw err;
    }
  };

  const handleBiometricLogin = async () => {
    setBiometricLoading(true);
    setError("");
    try {
      // Authenticate using biometry
      await BiometricAuth.authenticate({
        reason: "To access your Shift Scan account",
        cancelTitle: "Cancel",
        allowDeviceCredential: true,
        iosFallbackTitle: "Use passcode",
        androidTitle: "Biometric Sign In",
        androidSubtitle: "Authenticate to sign in",
        androidConfirmationRequired: false,
      });

      // Retrieve stored credentials
      const savedUsername = localStorage.getItem("shift_scan_username");
      const savedPassword = localStorage.getItem("shift_scan_password");

      if (!savedUsername || !savedPassword) {
        setError(
          "No stored credentials found. Please sign in with username and password first."
        );
        setBiometricLoading(false);
        return;
      }

      // Perform login with stored credentials
      await performLogin(savedUsername, savedPassword);
    } catch (err: any) {
      // Handle biometric errors
      if (err.code === BiometryErrorType.userCancel) {
        // User cancelled - silent fail, don't show error
        setError("");
      } else if (err.code === BiometryErrorType.biometryLockout) {
        setError("Too many failed attempts. Please try again later.");
      } else if (err.code === BiometryErrorType.biometryNotEnrolled) {
        setError(
          "No biometric data found. Please sign in with username and password."
        );
      } else if (err.code === BiometryErrorType.passcodeNotSet) {
        setError("Device passcode not set. Please set a device passcode.");
      } else {
        setError(err.message || "Biometric authentication failed.");
      }
      console.error("Biometric auth error:", err);
    } finally {
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
                disabled={loading}
                className="w-full bg-app-dark-blue hover:bg-app-dark-blue/80 disabled:bg-app-dark-blue/50 text-white font-bold py-3 px-8 rounded-xl shadow-lg text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-app-blue"
              >
                {loading ? t("loading") : t("submit")}
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
