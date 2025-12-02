"use client";
import "@/app/globals.css";
import { useEffect, Suspense } from "react";

import { z } from "zod";

import { useRouter, useSearchParams } from "next/navigation";
import { EnterAccountInfo } from "@/app/v1/components/(signup)/EnterAccountInfo";
import ResetPassword from "@/app/v1/components/(signup)/resetPassword";
import NotificationSettings from "@/app/v1/components/(signup)/notificationSettings";
import ProfilePictureSetup from "@/app/v1/components/(signup)/profilePictureSetup";
import SignatureSetup from "@/app/v1/components/(signup)/signatureSetup";
import { useUserStore } from "@/app/lib/store/userStore";
import { apiRequest } from "@/app/lib/utils/api-Utils";
import { useSignOut } from "@/app/lib/hooks/useSignOut";
import {
  SignupStepProvider,
  useSignupStep,
} from "@/app/lib/context/signupStepContext";

// Define Zod schema for validating props
const propsSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  accountSetup: z.boolean(),
});

// Validation logic
function validateProps(userId: string | null, accountSetup: string | null) {
  try {
    const parsed = propsSchema.parse({
      userId: userId || undefined,
      accountSetup: accountSetup === "true",
    });
    return { valid: true, data: parsed };
  } catch (error) {
    console.error("Invalid props:", error);
    return { valid: false, data: null };
  }
}

function SignUpContent() {
  const router = useRouter();
  const { user } = useUserStore();
  const userId = user?.id;
  const accountSetup = user?.accountSetup;
  const userName = user?.firstName || "";
  const searchParams = useSearchParams();
  const { step, setStep, resetStep } = useSignupStep();
  const totalSteps = 6;
  const signOut = useSignOut();

  const handleComplete = async () => {
    try {
      const res = await apiRequest(`/api/v1/user/${userId}`, "PUT", {
        accountSetup: true,
      });

      if (!res) {
        throw new Error("Error updating account setup in DB");
      }
      localStorage.removeItem("signup_step");
      localStorage.removeItem("user-store");
      localStorage.removeItem("cost-code-store");
      localStorage.removeItem("equipment-store");
      localStorage.removeItem("profit-store");

      resetStep();
      // Sign out the user after setup is complete
      await signOut();
      // No need to push to /v1, signOut will redirect to /signin
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  return (
    <>
      {step === 1 && (
        <EnterAccountInfo
          userId={userId!}
          handleNextStep={handleNextStep}
          userName={userName}
          totalSteps={totalSteps}
          currentStep={step}
        />
      )}
      {step === 2 && (
        <ResetPassword
          userId={userId!}
          handleNextStep={handleNextStep}
          totalSteps={totalSteps}
          currentStep={step}
        />
      )}
      {step === 3 && (
        <NotificationSettings
          userId={userId!}
          handleNextStep={handleNextStep}
          totalSteps={totalSteps}
          currentStep={step}
        />
      )}
      {step === 4 && (
        <ProfilePictureSetup
          userId={userId!}
          handleNextStep={handleNextStep}
          totalSteps={totalSteps}
          currentStep={step}
        />
      )}
      {(step === 5 || step === 6) && (
        <SignatureSetup
          userId={userId!}
          handleNextStep={handleComplete}
          setStep={(value) => {
            if (typeof value === "function") {
              // value is (prev: number) => number
              setStep(value(step));
            } else {
              setStep(value);
            }
          }}
          totalSteps={totalSteps}
          currentStep={step}
        />
      )}
    </>
  );
}

export default function SignUp() {
  return (
    <SignupStepProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpContent />
      </Suspense>
    </SignupStepProvider>
  );
}
