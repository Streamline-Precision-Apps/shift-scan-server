"use client";

import { useState } from "react";

export default function DataSubjectAccessRequestPage() {
  const [form, setForm] = useState({
    website: "",
    name: "",
    email: "",
    submitterType: "",
    law: "",
    details: "",
    confirm1: false,
    confirm2: false,
    confirm3: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const isFormComplete =
    form.website &&
    form.name &&
    form.email &&
    form.submitterType &&
    form.law &&
    form.details &&
    form.confirm1 &&
    form.confirm2 &&
    form.confirm3;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (
      !form.website ||
      !form.name ||
      !form.email ||
      !form.submitterType ||
      !form.law ||
      !form.details ||
      !form.confirm1 ||
      !form.confirm2 ||
      !form.confirm3
    ) {
      setError("Please complete all required fields and confirmations.");
      return;
    }
    setError("");
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-app-gradient bg-to-br from-app-dark-blue via-app-blue to-app-blue px-4 py-8 md:py-0 md:max-h-screen flex flex-col items-center justify-center">
      {/* Animated Gradient Background Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-app-dark-blue via-app-blue to-app-blue animate-gradient-move opacity-80" />
        <div className="absolute left-1/2 top-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-app-blue opacity-20 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-app-blue opacity-10 rounded-full blur-2xl" />
      </div>

      {/* Data Subject Access Request Form Card */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-white/98 backdrop-blur-sm border-b border-gray-200 p-6 md:p-8 z-10">
            <div className="text-center">
              <img
                src="/windows11/StoreLogo.scale-400.png"
                alt="Shift Scan Logo"
                className="h-16 w-auto mx-auto mb-4 rounded-lg"
              />
              <h1 className="text-2xl font-bold text-app-dark-blue mb-2">
                Data Subject Access Request
              </h1>
              <p className="text-gray-600">
                Please complete this form to submit a data subject access
                request.
              </p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <form
              id="data-subject-form"
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="website"
                  placeholder="Website"
                  value={form.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What email address do you use to access the above Website/app?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  You are submitting this request as{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="submitterType"
                  value={form.submitterType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-blue"
                  required
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="person">
                    The person, or the parent/guardian of the person, whose name
                    appears above
                  </option>
                  <option value="agent">
                    An agent authorized by the consumer to make this request on
                    their behalf
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Under the rights of which law are you making this request?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="law"
                  value={form.law}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-blue"
                  required
                >
                  <option value="" disabled>
                    Select a law
                  </option>
                  <option value="GDPR">GDPR</option>
                  <option value="CCPA">CCPA</option>
                  <option value="CPA">CPA</option>
                  <option value="CTDPA">CTDPA</option>
                  <option value="UCPA">UCPA</option>
                  <option value="VCDPA">VCDPA</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Please leave details regarding your action request or question{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="details"
                  placeholder="Please leave details regarding your action request or question."
                  value={form.details}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-blue min-h-[100px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  I confirm that <span className="text-red-500">*</span>
                </p>
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="confirm1"
                    checked={form.confirm1}
                    onChange={handleChange}
                    required
                  />
                  <span className="text-xs text-gray-700">
                    Under penalty of perjury, I declare all the above
                    information to be true and accurate.
                  </span>
                </label>
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="confirm2"
                    checked={form.confirm2}
                    onChange={handleChange}
                    required
                  />
                  <span className="text-xs text-gray-700">
                    I understand that the deletion or restriction of my personal
                    data is irreversible and may result in the termination of
                    services with My Great New Website / App.
                  </span>
                </label>
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="confirm3"
                    checked={form.confirm3}
                    onChange={handleChange}
                    required
                  />
                  <span className="text-xs text-gray-700">
                    I understand that I will be required to validate my request
                    by email, and I may be contacted in order to complete the
                    request.
                  </span>
                </label>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {submitted && (
                <p className="text-green-600 text-center font-semibold">
                  Thank you for submitting your data subject access request! We
                  will be in touch soon.
                </p>
              )}
            </form>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 bg-white/98 backdrop-blur-sm border-t border-gray-200 p-4 z-10">
            <div className="flex items-center justify-between">
              <a
                href="/"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                ← Back to Home
              </a>
              {!submitted && (
                <button
                  type="submit"
                  form="data-subject-form"
                  disabled={!isFormComplete}
                  className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                    isFormComplete
                      ? "bg-app-blue text-white hover:bg-app-dark-blue cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Submit Request
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
