"use client";
import { useState } from "react";
import CameraComponent from "../(camera)/camera";
import { Texts } from "../(reusable)/texts";
import { useTranslations } from "next-intl";
import { ProgressBar } from "./progressBar";
import { Button } from "../ui/button";
import { useUserStore } from "@/app/lib/store/userStore";
import { apiRequest } from "@/app/lib/utils/api-Utils";
import { Capacitor } from "@capacitor/core";

type prop = {
  userId: string;
  handleNextStep: () => void;
  totalSteps: number;
  currentStep: number;
};

export default function ProfilePictureSetup({
  userId,
  handleNextStep,
  totalSteps,
  currentStep,
}: prop) {
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const ios = Capacitor.getPlatform() === "ios";
  const android = Capacitor.getPlatform() === "android";
  const t = useTranslations("SignUpProfilePicture");

  const handleUpload = async (file: Blob) => {
    if (!userId) {
      console.warn("No user id");
      return;
    }
    if (!userId) {
      console.warn("No user id");
      return;
    }

    try {
      // Debug: log blob info
      console.log("[handleUpload] file (blob):", file);
      console.log("[handleUpload] file instanceof Blob:", file instanceof Blob);
      if (file instanceof Blob) {
        console.log("[handleUpload] blob size:", file.size);
        if (file instanceof File) {
          console.log("[handleUpload] file name:", file.name);
        }
      }

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("file", file, "profile.png");
      formData.append("folder", "profileImages");

      // Debug: log FormData contents
      for (const [key, value] of formData.entries()) {
        if (value instanceof Blob) {
          console.log(
            `[handleUpload] FormData field '${key}': Blob, size`,
            value.size
          );
        } else {
          console.log(`[handleUpload] FormData field '${key}':`, value);
        }
      }

      // Use apiRequest utility, which supports FormData
      const res = await apiRequest("/api/storage/upload", "POST", formData);
      console.log("[handleUpload] upload response:", res);
      if (!res.url) {
        throw new Error("Failed to upload image url");
      }
      // Add cache-busting param to break browser cache
      const cacheBustedUrl = `${res.url}?t=${Date.now()}`;
      const dbRes = await apiRequest(`/api/v1/user/${userId}`, "PUT", {
        image: cacheBustedUrl,
      });

      if (!dbRes.success) {
        throw new Error("Error updating url in DB");
      }
      // Update user store with new image
      useUserStore.getState().setImage(cacheBustedUrl);

      return cacheBustedUrl;
    } catch (err) {
      console.error("[Error uploading new image or updating DB:", err);
    }
  };

  const handleSubmitImage = async () => {
    // Check that we have an image blob
    if (!imageBlob) {
      return;
    }

    setIsSubmitting(true);
    try {
      await handleUpload(imageBlob);
      localStorage.setItem("userProfileImage", "Updating");
      handleNextStep(); // Proceed to the next step only if the image upload is successful
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`h-dvh w-full flex flex-col bg-app-dark-blue ${
        ios ? "pt-8" : android ? "pt-4" : ""
      }`}
    >
      {/*Header - fixed at top*/}
      <div className="w-full h-[10%] flex flex-col justify-end py-3">
        <Texts text={"white"} className="justify-end" size={"sm"}>
          {t("AddProfilePicture")}
        </Texts>
      </div>
      <div className="bg-white w-full h-10 border border-slate-200 flex flex-col justify-center gap-1">
        <div className="w-[95%] max-w-[600px] mx-auto">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar bg-white ">
        <div className="max-w-[600px] w-[95%] p-4 px-2 flex flex-col mx-auto gap-4">
          <div className=" h-full max-h-[50vh] flex flex-col items-center">
            <CameraComponent setImageBlob={setImageBlob} />
          </div>
        </div>
      </div>
      <div className="w-full h-[10%] bg-white border-t border-slate-200 px-4 py-2">
        <Button
          className={
            imageBlob ? "bg-app-dark-blue w-full" : "bg-gray-300 w-full"
          }
          onClick={handleSubmitImage}
          disabled={isSubmitting}
        >
          <p className="text-white  font-semibold text-base">
            {isSubmitting ? `${t("Submitting")}` : `${t("Next")}`}
          </p>
        </Button>
      </div>
    </div>
  );
}
