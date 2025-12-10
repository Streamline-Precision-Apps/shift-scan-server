"use client";

import { useState } from "react";

export default function DemoRequestPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.company) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error || "Failed to submit request. Please try again later."
        );
        setLoading(false);
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-app-gradient bg-to-br from-app-dark-blue via-app-blue to-app-blue px-4 py-8 md:py-0 md:max-h-screen flex flex-col items-center justify-center">
      {/* Animated Gradient Background Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-app-dark-blue via-app-blue to-app-blue animate-gradient-move opacity-80" />
        <div className="absolute left-1/2 top-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-app-blue opacity-20 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-app-blue opacity-10 rounded-full blur-2xl" />
      </div>

      {/* Contact Form Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 space-y-8 md:space-y-6">
          <div className="text-center mb-8">
            <img
              src="/windows11/StoreLogo.scale-400.png"
              alt="Shift Scan Logo"
              className="h-16 w-auto mx-auto mb-4 rounded-lg"
            />
            <h1 className="text-2xl font-bold text-app-dark-blue mb-2">
              Request a Demo
            </h1>
            <p className="text-gray-600">
              See Shift Scan in action! Schedule a personalized demo and
              discover how our QR-based workforce management system can
              streamline your payroll.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name *"
                value={form.firstName}
                onChange={handleChange}
                className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-blue"
                autoComplete="given-name"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name *"
                value={form.lastName}
                onChange={handleChange}
                className="w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-blue"
                autoComplete="family-name"
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Work Email *"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-blue"
              autoComplete="email"
              required
            />
            <input
              type="text"
              name="company"
              placeholder="Company Name *"
              value={form.company}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-blue"
              autoComplete="organization"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (Optional)"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-blue"
              autoComplete="tel"
            />
            <textarea
              name="message"
              placeholder="Tell us about your needs (Optional)"
              value={form.message}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-blue min-h-[100px]"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {submitted ? (
              <p className="text-green-600 text-center font-semibold">
                Thank you for your interest! We'll contact you shortly to
                schedule your demo.
              </p>
            ) : (
              <button
                type="submit"
                className="w-full bg-app-blue text-white font-bold py-2 rounded-lg hover:bg-app-dark-blue transition-colors disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Request Demo"}
              </button>
            )}
          </form>
          <div className="mt-4 text-center">
            <a
              href="/"
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
