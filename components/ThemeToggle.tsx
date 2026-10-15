"use client";

import { useCallback, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";
const getServerSnapshot = (): Theme => "dark";

export default function ThemeToggle() {
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
    try { window.localStorage.setItem("evs-theme", nextTheme); } catch { /* Theme still changes for this page view. */ }
    window.dispatchEvent(new Event("evs-theme-change"));
  }

  return (
    <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
      <span aria-hidden="true">{theme === "dark" ? "☼" : "☾"}</span>
      <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
