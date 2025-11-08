"use client";

import React, { useEffect, useState, useContext, createContext } from "react";
import { IntlProvider } from "next-intl";
import { Device } from "@capacitor/device";
import { loadMessages, defaultLocale, type Locale } from "./i18n-client";
import defaultMessages from "../messages/en.json";
import { readLocaleCookie, setLocaleCookie } from "./cookie-utils";

export async function persistLocale(value: Locale) {
  try {
    await setLocaleCookie(value);
  } catch (e) {
    console.error("persistLocale failed", e);
  }
  if (typeof window !== "undefined") window.location.reload();
}

export const LocaleContext = createContext<{
  locale: Locale;
  resetLocale: (newLocale: Locale) => Promise<void>;
} | undefined>(undefined);

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within ClientIntlProvider");
  return ctx;
}

export default function ClientIntlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<any>(defaultMessages);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initLocale() {
      try {
        // 1) Try reading cookie / preferences (cookie-utils handles both)
        const persisted = await readLocaleCookie();
        let detected: string | null = persisted ?? null;

        // 2) Capacitor Device API if nothing persisted
        if (!detected) {
          try {
            // Device.getLanguageCode() may return an object with a `value` field
            const deviceLang = await Device.getLanguageCode();
            if (deviceLang && (deviceLang as any).value) {
              detected = (deviceLang as any).value as string;
            }
          } catch (e) {
            // ignore device errors
          }
        }

        // 3) Browser navigator fallback
        if (!detected && typeof navigator !== "undefined") {
          detected =
            navigator.language ||
            (navigator.languages && navigator.languages[0]) ||
            null;
        }

        const finalLocale = (
          detected ? detected.split("-")[0] : defaultLocale
        ) as Locale;

        if (!mounted) return;

        setLocale(finalLocale);

        // Load messages only if not the default (we already have defaultMessages)
        if (finalLocale && finalLocale !== defaultLocale) {
          try {
            const msgs = await loadMessages(finalLocale);
            if (mounted && msgs) setMessages(msgs);
          } catch (err) {
            console.error("Failed loading messages for", finalLocale, err);
          }
        } else {
          setMessages(defaultMessages);
        }
      } catch (err) {
        console.error("initLocale error", err);
      } finally {
        if (mounted) setIsReady(true);
      }
    }

    initLocale();

    return () => {
      mounted = false;
    };
  }, []);

  // Manual locale reset function
  const resetLocale = async (newLocale: Locale) => {
    setLocale(newLocale);
    if (newLocale !== defaultLocale) {
      try {
        const msgs = await loadMessages(newLocale);
        setMessages(msgs);
      } catch (err) {
        console.error("Failed loading messages for", newLocale, err);
      }
    } else {
      setMessages(defaultMessages);
    }
    await setLocaleCookie(newLocale);
  };

  // Show minimal loading state while initializing
  if (!isReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-linear-to-br from-app-dark-blue via-app-blue to-app-blue">
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, resetLocale }}>
      <IntlProvider
        locale={locale ?? defaultLocale}
        messages={messages}
        // Provide a stable default timezone to avoid environment fallback errors
        // and potential hydration/markup mismatches between server and client.
        timeZone="UTC"
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}
