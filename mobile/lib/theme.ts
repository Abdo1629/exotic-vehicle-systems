export const palettes = {
  dark: {
    background: "#111317", surface: "#191c21", surfaceRaised: "#24282e",
    border: "#353a41", text: "#f1f0eb", muted: "#a7a9a8", subtle: "#7c8287",
    accent: "#c5a875", blue: "#9db8ad", warning: "#d9b77a", danger: "#cf8982",
  },
  light: {
    background: "#f5f3ee", surface: "#fffefa", surfaceRaised: "#eeece5",
    border: "#dcd9d0", text: "#292b27", muted: "#686c65", subtle: "#85877f",
    accent: "#8c6a35", blue: "#426d65", warning: "#8c6a35", danger: "#a44f48",
  },
} as const;

export type ThemeMode = keyof typeof palettes;
export type Palette = (typeof palettes)[ThemeMode];

export const theme = {
  colors: palettes.dark,
  radius: { card: 9, control: 6, pill: 999 },
  spacing: { xs: 6, sm: 10, md: 16, lg: 22, xl: 30 },
  fonts: {
    ios: { body: "Avenir Next", mono: "Menlo" },
    android: { body: "sans-serif", mono: "monospace" },
  },
} as const;
