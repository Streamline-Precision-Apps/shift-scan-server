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
        <main className="relative min-h-screen bg-app-gradient bg-to-br from-app-dark-blue via-app-blue to-app-blue px-2 md:px-8 py-0 flex flex-col items-center justify-center"></main>
      </div>
    );

  return (
    <main className="relative min-h-screen w-full bg-white  overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-app-gradient bg-to-br from-app-dark-blue via-app-blue to-app-blue overflow-hidden">
        {/* Animated Gradient Background Overlay */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-br from-app-dark-blue via-app-blue to-app-blue animate-gradient-move opacity-80" />
          <div className="absolute left-1/2 top-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-app-blue opacity-20 rounded-full blur-3xl" />
          <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-app-blue opacity-10 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center py-12 md:py-20 px-4">
          <img
            src="/windows11/StoreLogo.scale-400.png"
            alt="Shift Scan Store Logo"
            className="h-32 md:h-40 w-auto mb-6 drop-shadow-2xl rounded-2xl bg-white-90 border-4 border-white shadow-lg animate-fade-in"
          />

          {/* App Store Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in delay-100">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-black hover:bg-gray-800 text-white font-semibold py-2.5 px-5 rounded-lg shadow-lg transition-all duration-200"
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
              className="flex items-center bg-black hover:bg-gray-800 text-white font-semibold py-2.5 px-5 rounded-lg shadow-lg transition-all duration-200"
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

          <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center mb-4 drop-shadow-lg animate-fade-in delay-200">
            The Most Powerful QR-Based
            <br />
            Workforce Management System
          </h1>
          <p className="text-lg md:text-2xl text-white/90 text-center mb-6 max-w-3xl animate-fade-in delay-100">
            Track time, manage shifts, and streamline payroll with secure QR
            technology for construction and field service teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in delay-300">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="bg-white hover:bg-gray-100 text-app-dark-blue font-bold py-4 px-10 rounded-xl shadow-lg text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                  type="button"
                >
                  Get Started
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" sideOffset={8} className="text-center">
                <span className="block text-app-dark-blue font-semibold mb-1">
                  Start Your Free Trial Today
                </span>
              </PopoverContent>
            </Popover>
            <button
              onClick={() => router.push("/signin")}
              className="bg-app-dark-blue hover:bg-app-dark-blue/90 text-white font-bold py-4 px-10 rounded-xl shadow-lg text-lg transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-app-dark-blue mb-4">
              Workforce Management Features
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Track productivity, attendance, and billable hours with QR-based
              time tracking and comprehensive reporting
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Timekeeping */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold text-app-dark-blue mb-3">
                QR Time Tracking
              </h3>
              <p className="text-gray-600 mb-4">
                Instant clock-in/out with secure QR codes. Real-time tracking
                with GPS verification for jobsite accuracy.
              </p>
              <a
                href="#"
                className="text-app-blue hover:underline font-semibold"
              >
                Learn more →
              </a>
            </div>

            {/* Scheduling */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-app-dark-blue mb-3">
                Shift Scheduling
              </h3>
              <p className="text-gray-600 mb-4">
                Plan shifts, manage assignments, and track team availability
                with our intuitive scheduling tools.
              </p>
              <a
                href="#"
                className="text-app-blue hover:underline font-semibold"
              >
                Learn more →
              </a>
            </div>

            {/* Reporting */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-app-dark-blue mb-3">
                Advanced Reports
              </h3>
              <p className="text-gray-600 mb-4">
                Generate detailed reports for payroll, job costing, and
                productivity analysis with one click.
              </p>
              <a
                href="#"
                className="text-app-blue hover:underline font-semibold"
              >
                Learn more →
              </a>
            </div>

            {/* Equipment Tracking */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🚜</div>
              <h3 className="text-xl font-bold text-app-dark-blue mb-3">
                Equipment Tracking
              </h3>
              <p className="text-gray-600 mb-4">
                Monitor equipment usage, maintenance schedules, and location
                tracking for all your assets.
              </p>
              <a
                href="#"
                className="text-app-blue hover:underline font-semibold"
              >
                Learn more →
              </a>
            </div>

            {/* Jobsite Management */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-xl font-bold text-app-dark-blue mb-3">
                Jobsite Management
              </h3>
              <p className="text-gray-600 mb-4">
                Track multiple jobsites, manage crew assignments, and monitor
                project progress in real-time.
              </p>
              <a
                href="#"
                className="text-app-blue hover:underline font-semibold"
              >
                Learn more →
              </a>
            </div>

            {/* Cost Code Tracking */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-app-dark-blue mb-3">
                Cost Code Tracking
              </h3>
              <p className="text-gray-600 mb-4">
                Accurately track labor costs by project phase and activity for
                precise job costing.
              </p>
              <a
                href="#"
                className="text-app-blue hover:underline font-semibold"
              >
                Learn more →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-app-dark-blue mb-4">
              Why Choose Shift Scan?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for construction and field service teams who
              need reliable, secure time tracking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-app-blue/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-app-dark-blue mb-2">
                    QR Code Security
                  </h3>
                  <p className="text-gray-600">
                    Prevent time theft with unique QR codes that verify employee
                    location and prevent buddy punching.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-app-blue/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-app-dark-blue mb-2">
                    GPS Verification
                  </h3>
                  <p className="text-gray-600">
                    Ensure workers are on-site with automatic GPS location
                    tracking for every clock-in and clock-out.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-app-blue/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-app-dark-blue mb-2">
                    Real-Time Sync
                  </h3>
                  <p className="text-gray-600">
                    All data syncs instantly across devices so managers have
                    up-to-the-minute information on crew status.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-app-blue/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-app-dark-blue mb-2">
                    Offline Mode
                  </h3>
                  <p className="text-gray-600">
                    Workers can clock in/out even without internet. Data syncs
                    automatically when connection is restored.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-app-blue to-app-dark-blue p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4">
                See Shift Scan in Action
              </h3>
              <p className="mb-6">
                Watch how easy it is to track time, manage crews, and generate
                reports with Shift Scan.
              </p>
              <div className="bg-white/10 rounded-lg p-8 text-center backdrop-blur">
                <div className="text-6xl mb-4">▶️</div>
                <p className="text-sm">Video Demo Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-app-gradient bg-to-br from-app-dark-blue via-app-blue to-app-blue text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Simplify Your Payroll?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            Start managing your workforce more efficiently with QR-based time
            tracking
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <button className="bg-white hover:bg-gray-100 text-app-dark-blue font-bold py-4 px-10 rounded-xl shadow-lg text-lg transition-all duration-200">
                  Get Started
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" sideOffset={8} className="text-center">
                <span className="block text-app-dark-blue font-semibold mb-1">
                  Get Started Today
                </span>
              </PopoverContent>
            </Popover>
            <button
              onClick={() => router.push("/contact")}
              className="bg-app-dark-blue border-2 border-white hover:bg-app-dark-blue/90 text-white font-bold py-4 px-10 rounded-xl shadow-lg text-lg transition-all duration-200"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Updates
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Tutorials
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition">
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="hover:text-white transition"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Download</h3>
            <div className="space-y-3">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
              >
                <span>iOS App</span>
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
              >
                <span>Android App</span>
              </a>
              <a
                href="https://shiftscan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
              >
                <span>Desktop App</span>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            © 2025 Shift Scan by Streamline Precision LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
