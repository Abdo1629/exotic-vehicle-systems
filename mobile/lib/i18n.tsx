import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Locale = "en" | "ar";
const LocaleContext = createContext<{ locale: Locale; toggle: () => void; tr: (en: string, ar: string) => string }>({
  locale: "en", toggle: () => {}, tr: (en) => en,
});
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  useEffect(() => { void AsyncStorage.getItem("evs.mobile.locale").then((saved) => { if (saved === "ar" || saved === "en") setLocale(saved); }).catch(() => {}); }, []);
  useEffect(() => {
    void AsyncStorage.setItem("evs.mobile.locale", locale).catch(() => {});
    // Avoid forcing an app restart via I18nManager; direction is applied to individual layouts.
  }, [locale]);
  const toggle = useCallback(() => setLocale((current) => current === "en" ? "ar" : "en"), []);
  const tr = useCallback((en: string, ar: string) => locale === "ar" ? ar : en, [locale]);
  return <LocaleContext.Provider value={{ locale, toggle, tr }}>{children}</LocaleContext.Provider>;
}
export function useLocale() { return useContext(LocaleContext); }
