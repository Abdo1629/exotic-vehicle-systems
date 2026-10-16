"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useLocale } from "@/components/LocaleProvider";

type Theme = "dark" | "light";
const getSnapshot = (): Theme => document.documentElement.dataset.theme === "light" ? "light" : "dark";
const getServerSnapshot = (): Theme => "dark";

export default function ThemeToggle() {
  const { locale } = useLocale();
  const subscribe = useCallback((notify: () => void) => {
    window.addEventListener("evs-theme-change", notify);
    window.addEventListener("storage", notify);
    return () => {
      window.removeEventListener("evs-theme-change", notify);
      window.removeEventListener("storage", notify);
    };
  }, []);
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    try { window.localStorage.setItem("evs-theme", nextTheme); } catch {}
    window.dispatchEvent(new Event("evs-theme-change"));
  }
  const label = theme === "dark" ? (locale === "ar" ? "الوضع الفاتح" : "Light mode") : (locale === "ar" ? "الوضع الداكن" : "Dark mode");
  const ariaLabel = theme === "dark" ? (locale === "ar" ? "التبديل للوضع الفاتح" : "Switch to light mode") : (locale === "ar" ? "التبديل للوضع الداكن" : "Switch to dark mode");
  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={ariaLabel} title={ariaLabel}>
      <span aria-hidden="true">{theme === "dark" ? "☼" : "☾"}</span>
      <span>{label}</span>
    </button>
  );
}
