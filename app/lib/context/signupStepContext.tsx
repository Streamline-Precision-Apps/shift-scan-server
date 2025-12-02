"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

// Key for localStorage
const SIGNUP_STEP_KEY = "signup_step";

// Context type
type SignupStepContextType = {
  step: number;
  setStep: (step: number) => void;
  resetStep: () => void;
};

const SignupStepContext = createContext<SignupStepContextType | undefined>(
  undefined
);

export function useSignupStep() {
  const ctx = useContext(SignupStepContext);
  if (!ctx)
    throw new Error("useSignupStep must be used within SignupStepProvider");
  return ctx;
}

export function SignupStepProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [step, setStepState] = useState<number>(1);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(SIGNUP_STEP_KEY);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed)) setStepState(parsed);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(SIGNUP_STEP_KEY, String(step));
    }
  }, [step]);

  const setStep = (newStep: number) => {
    setStepState(newStep);
  };

  const resetStep = () => {
    setStepState(1);
    if (typeof window !== "undefined") {
      localStorage.removeItem(SIGNUP_STEP_KEY);
    }
  };

  return (
    <SignupStepContext.Provider value={{ step, setStep, resetStep }}>
      {children}
    </SignupStepContext.Provider>
  );
}
