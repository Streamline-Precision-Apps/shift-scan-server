"use client";

import { useUserStore } from "@/app/lib/store/userStore";
import { Buttons } from "@/app/v1/components/(reusable)/buttons";
import { Forms } from "@/app/v1/components/(reusable)/forms";
import { Holds } from "@/app/v1/components/(reusable)/holds";
import { Selects } from "@/app/v1/components/(reusable)/selects";
import { Texts } from "@/app/v1/components/(reusable)/texts";
import { Titles } from "@/app/v1/components/(reusable)/titles";
import { useState, useEffect, FormEvent } from "react";
import { useTranslations } from "next-intl";

import { setLocale } from "@/app/lib/actions/cookieActions";
import { updateSettings } from "@/app/lib/actions/hamburgerActions";

type Props = {
  setIsOpenLanguageSelector: () => void;
};

export default function LanguageModal({ setIsOpenLanguageSelector }: Props) {
  const { user } = useUserStore((state) => ({ user: state.user }));
  const userId = user?.id;
  const t = useTranslations("Admins");
  // language selector modal
  const [language, setLanguage] = useState("en");
  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const response = await fetch(`/api/getSettings`);
        if (response.ok) {
          const data = await response.json();
          setLanguage(data.language);
        } else {
          console.error(
            { error: t("ErrorFetchingLanguage") },
            response.statusText
          );
        }
      } catch (error) {
        console.error(t("ErrorFetchingLanguage"), error);
      }
    };
    fetchLanguage();
  }, [userId, t]);

  const handleLanguageChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const selectedLanguage = formData.get("language") as string;

      // Update settings via API
      const response = await updateSettings({
        userId: userId ?? "",
        language: selectedLanguage,
      });

      if (response.success) {
        // Update locale cookie based on language
        if (selectedLanguage === "en") {
          await setLocale(false);
        } else {
          await setLocale(true);
        }
        setIsOpenLanguageSelector();
      }
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  // end of language selector modal

  return (
    <Holds background={"white"} className=" h-full w-full p-4">
      <Forms onSubmit={handleLanguageChange} className="h-full w-full">
        <Texts size={"p4"} className="mb-4">
          {t("SelectALanguage")}
        </Texts>
        <Holds className="my-auto h-1/3">
          <Selects
            id="language"
            name="language"
            className="w-full"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
            }}
          >
            <option value="en">{t("English")}</option>
            <option value="es">{t("Spanish")}</option>
          </Selects>
        </Holds>
        <Holds className="flex justify-between gap-5">
          <Buttons background={"green"} type="submit" className="py-2">
            <Titles size="h4">{t("ChangeLanguage")}</Titles>
          </Buttons>
          <Buttons
            background={"lightBlue"}
            type="button" // Prevents triggering form submission
            className="py-2"
            onClick={() => {
              // Logic to close the modal or reset form
              setIsOpenLanguageSelector();
            }}
          >
            <Titles size="h4">{t("Cancel")}</Titles>
          </Buttons>
        </Holds>
      </Forms>
    </Holds>
  );
}
