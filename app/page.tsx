"use client";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import { useUserStore } from "./lib/store/userStore";
import { useProfitStore } from "./lib/store/profitStore";
import { useEquipmentStore } from "./lib/store/equipmentStore";
import { useCostCodeStore } from "./lib/store/costCodeStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./v1/components/ui/popover";
import { getApiUrl } from "./lib/utils/api-Utils";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const isNative = Capacitor.isNativePlatform();

  const redirectAfterAuth = () => {
    const target = isNative ? "/v1" : "/admins";
    router.push(target);
  };

  useEffect(() => {
    const redirectIfMobile = async () => {
      if (isNative) {
        const token = localStorage.getItem("jwt");
        const userId = localStorage.getItem("userId");
        const url = getApiUrl();

        if (token && userId) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (Date.now() < payload.exp * 1000) {
              // User logged in → call init API
              const response = await fetch(`${url}/api/v1/init`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ token, userId }),
              });
              const data = await response.json();
              if (data.user) {
                useUserStore.getState().setUser(data.user);
              }
              if (data.jobsites) {
                useProfitStore.getState().setJobsites(data.jobsites);
              }
              if (data.equipments) {
                useEquipmentStore.getState().setEquipments(data.equipments);
              }
              if (data.costCodes) {
                useCostCodeStore.getState().setCostCodes(data.costCodes);
              }
              if (useUserStore.getState().user?.accountSetup === false) {
                router.replace("/signin/signup");
                return;
              }

              redirectAfterAuth();
              return;
            }
          } catch {
            localStorage.removeItem("jwt");
          }
        }

        router.replace("/signin"); // not logged in
      }

      setLoading(false); // web shows landing page
    };

    redirectIfMobile();
  }, [isNative]);

  if (isNative && loading) return null;

  if (loading)
    return (
      <div>
        <main className="relative min-h-screen max-h-screen overflow-hidden bg-app-gradient bg-to-br from-app-dark-blue via-app-blue to-app-blue px-2 md:px-8 py-0 flex flex-col items-center justify-center"></main>
      </div>
    );

  return (
    <main className="relative min-h-screen w-full bg-white  overflow-x-hidden">
      {/* Hero Section */}

      {/* Animated Gradient Background Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-app-dark-blue via-app-blue to-app-blue animate-gradient-move opacity-80" />
        <div className="absolute left-1/2 top-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-app-blue opacity-20 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-app-blue opacity-10 rounded-full blur-2xl" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 w-full flex flex-col items-center justify-center py-8 md:py-20 max-h-full overflow-y-auto">
        <img
          src="/windows11/StoreLogo.scale-400.png"
          alt="Shift Scan Store Logo"
          className="h-32 md:h-56 w-auto mb-6 mt-2 drop-shadow-2xl rounded-2xl bg-white-90 border-4 border-white shadow-lg animate-fade-in"
          style={{ maxWidth: "220px", height: "auto", objectFit: "contain" }}
        />
        <h1 className="text-3xl md:text-6xl font-extrabold text-white text-center mb-3 drop-shadow-lg animate-fade-in">
          Payroll Made Simple
        </h1>
        <h2 className="text-xl md:text-3xl font-bold text-custom-dark-blue text-center mb-4 animate-fade-in delay-100">
          with QR Technology
        </h2>
        <p className="text-base md:text-xl text-white text-center mb-6 max-w-xs md:max-w-2xl animate-fade-in delay-200">
          <span className="font-semibold text-custom-dark-blue">
            Revolutionize your workforce management and payroll
          </span>{" "}
          with instant, secure, and verifiable timekeeping—powered by QR codes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in delay-300 relative w-full max-w-xs sm:max-w-none justify-center items-stretch">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="relative bg-app-dark-blue hover:bg-app-dark-blue/80 text-white font-bold py-3 px-8 rounded-xl shadow-lg text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-app-blue cursor-pointer"
                type="button"
              >
                Book a Demo today!
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" sideOffset={8} className="text-center">
              <span className="block text-app-dark-blue font-semibold mb-1">
                Book a Demo Today
              </span>
            </PopoverContent>
          </Popover>
        </div>

        {/* App Store Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in delay-400 justify-center items-center">
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-black hover:bg-gray-800 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200"
          >
            <svg
              className="w-7 h-7 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <div className="text-xs">Available on the</div>
              <div className="text-sm font-bold">App Store</div>
            </div>
          </a>
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-black hover:bg-gray-800 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200"
          >
            <svg
              className="w-7 h-7 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <div className="text-left">
              <div className="text-xs">GET IT ON</div>
              <div className="text-sm font-bold">Google Play</div>
            </div>
          </a>
        </div>

        <div className="mt-3 animate-fade-in delay-500">
          <span className="text-white text-sm">Already a member?</span>
          <a
            href="/signin"
            className="ml-2 text-app-dark-blue hover:text-app-dark-blue/80 font-semibold underline underline-offset-2 transition"
          >
            Sign In
          </a>
        </div>
        {/* Privacy Policy Link */}
        <div className="mt-6 text-center animate-fade-in delay-600">
          <a
            href="/privacy-policy"
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors underline underline-offset-2"
          >
            View Privacy Policy
          </a>
        </div>
        {/* Privacy Policy Link */}
        <div className="mt-6 text-center animate-fade-in delay-600">
          <a
            href="/privacy-policy"
            className="text-white  text-sm transition-colors underline underline-offset-2"
          >
            View Privacy Policy
          </a>
        </div>
      </section>
    </main>
  );
}
