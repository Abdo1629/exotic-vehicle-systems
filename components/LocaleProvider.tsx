"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Language = "en" | "ar";
const LanguageContext = createContext<{ language: Language; toggle: () => void }>({
  language: "en",
  toggle: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("evs-language");
      if (saved === "ar" || saved === "en") setLanguage(saved);
    } catch {
      // Keep the default language if storage is unavailable.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    try {
      window.localStorage.setItem("evs-language", language);
    } catch {
      // Language still works for this page view.
    }
  }, [language]);

  const toggle = useCallback(() => {
    setLanguage((current) => current === "en" ? "ar" : "en");
  }, []);

  return (
    <LanguageContext.Provider value={{ language, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function LanguageToggle() {
  const { language, toggle } = useContext(LanguageContext);
  return (
    <button className="language-toggle" type="button" onClick={toggle} aria-label={language === "en" ? "Switch to Arabic" : "Switch to English"} title={language === "en" ? "Switch to Arabic" : "Switch to English"}>
      {language === "en" ? "العربية" : "English"}
    </button>
  );
}

export function T({ en, ar }: { en: string; ar: string }) {
  const { language } = useContext(LanguageContext);
  return <>{language === "ar" ? ar : en}</>;
}
