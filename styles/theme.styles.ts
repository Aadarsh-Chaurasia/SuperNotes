export type ThemeKey = "light" | "dark";

export type ThemePalette = {
  background: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  accentHover: string;
  accentStrong: string;
  placeholder: string;
  inputBackground: string;
  inputText: string;
  icon: string;
  surfaceText: string;
  selectedText: string;
  highlightBackground: string;
};

export const themePalette: Record<ThemeKey, ThemePalette> = {
  light: {
    background: "#ffffff",
    surface: "#ffffff",
    surfaceAlt: "#f6f7f9",
    card: "#ffffff",
    border: "rgba(15, 23, 42, 0.06)",
    text: "#0f172a",
    muted: "rgba(15,23,42,0.6)",
    // minimal black accent for neutral look
    accent: "#111827",
    accentHover: "#0b1724",
    accentStrong: "#000000",
    placeholder: "#94a3b8",
    inputBackground: "#ffffff",
    inputText: "#0f172a",
    icon: "#0f172a",
    surfaceText: "#0f172a",
    selectedText: "#ffffff",
    highlightBackground: "rgba(0,0,0,0.12)",
  },
  dark: {
    background: "#0b1220",
    surface: "#0f1724",
    surfaceAlt: "#0b1320",
    card: "#0f1724",
    border: "rgba(255,255,255,0.06)",
    text: "#e6eef8",
    muted: "rgba(230,238,248,0.65)",
    // light accents for visibility on dark background
    accent: "#e6eef8",
    accentHover: "#c5d5e8",
    accentStrong: "#ffffff",
    placeholder: "#9fb3cc",
    inputBackground: "#0b1220",
    inputText: "#e6eef8",
    icon: "#e6eef8",
    surfaceText: "#e6eef8",
    selectedText: "#000000",
    highlightBackground: "rgba(0,0,0,0.12)",
  },
};

export const themeOptions = [
  {
    key: "light" as const,
    label: "Light",
    description: "Minimal, high-contrast light theme.",
  },
  {
    key: "dark" as const,
    label: "Dark",
    description: "Minimal, soft dark theme.",
  },
];
