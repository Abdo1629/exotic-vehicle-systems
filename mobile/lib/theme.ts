import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const palettes = {
  dark: {
    background: "#111317", surface: "#191c21", surfaceRaised: "#24282e",
    border: "#353a41", text: "#f1f0eb", muted: "#a7a9a8", subtle: "#858a88",
    accent: "#e53935", blue: "#25a56a", warning: "#d9b77a", danger: "#cf8982",
  },
  light: {
    background: "#f5f6f3", surface: "#ffffff", surfaceRaised: "#eef1ed",
    border: "#dce2dd", text: "#20231f", muted: "#59635d", subtle: "#727a73",
    accent: "#d9302b", blue: "#087844", warning: "#8a642d", danger: "#a44f48",
  },
} as const;

export type ThemeMode = keyof typeof palettes;
export type ThemeColors = (typeof palettes)[ThemeMode];
type ThemeContextValue = { mode: ThemeMode; colors: ThemeColors; toggle: () => void };
const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark", colors: palettes.dark, toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem("evs-theme").then((saved) => {
      if (active && (saved === "dark" || saved === "light")) setMode(saved);
    }).catch(() => {}).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem("evs-theme", mode).catch(() => {});
  }, [mode, ready]);
  const toggle = useCallback(() => setMode((current) => current === "dark" ? "light" : "dark"), []);
  const value = useMemo(() => ({ mode, colors: palettes[mode], toggle }), [mode, toggle]);
  return createElement(ThemeContext.Provider, { value }, children);
}
export function useTheme() { return useContext(ThemeContext); }
