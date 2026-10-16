"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "en" | "ar";
const LocaleContext = createContext<{ locale: Locale; toggle: () => void }>({ locale: "en", toggle: () => {} });

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("evs-locale");
      if (saved === "ar" || saved === "en") setLocale(saved);
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.locale = locale;
    try { localStorage.setItem("evs-locale", locale); } catch {}
  }, [locale]);
  const toggle = useCallback(() => setLocale((current) => current === "en" ? "ar" : "en"), []);
  const value = useMemo(() => ({ locale, toggle }), [locale, toggle]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function T({ en, ar }: { en: string; ar: string }) {
  const { locale } = useLocale();
  return <>{locale === "ar" ? ar : en}</>;
}

export function LanguageToggle() {
  const { locale, toggle } = useLocale();
  return <button className="language-toggle" type="button" onClick={toggle} aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}>{locale === "ar" ? "EN" : "عربي"}</button>;
}
