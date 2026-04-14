import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type AppFont, appFonts, applyBodyFont, DEFAULT_FONT_ID, FONT_KEY } from "./fonts";

export type ThemeId = "light" | "neon" | "dark";
export type ScaleId = "sm" | "md" | "lg";

export const themes: Array<{
  id: ThemeId;
  label: string;
  description: string;
  swatch: string;
}> = [
  { id: "dark",  label: "Dark",  description: "Original Seeder OS look",      swatch: "#00ffff" },
  { id: "neon",  label: "Neon",  description: "Bright cyber campaign mode",    swatch: "#ff00ff" },
  { id: "light", label: "White", description: "Clean high-contrast workspace", swatch: "#0d9488" },
];

export const scales: Array<{ id: ScaleId; label: string }> = [
  { id: "sm", label: "S" },
  { id: "md", label: "M" },
  { id: "lg", label: "L" },
];

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  scale: ScaleId;
  setScale: (scale: ScaleId) => void;
  font: AppFont;
  setFont: (font: AppFont) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const themeKey = "niche-seeder-theme";
const scaleKey = "niche-seeder-scale";

function getInitialTheme(): ThemeId {
  const stored = localStorage.getItem(themeKey);
  return themes.some((t) => t.id === stored) ? (stored as ThemeId) : "dark";
}

function getInitialScale(): ScaleId {
  const stored = localStorage.getItem(scaleKey);
  return scales.some((s) => s.id === stored) ? (stored as ScaleId) : "md";
}

function getInitialFont(): AppFont {
  const stored = localStorage.getItem(FONT_KEY);
  return appFonts.find((f) => f.id === stored) ?? appFonts.find((f) => f.id === DEFAULT_FONT_ID) ?? appFonts[0];
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(getInitialTheme);
  const [scale, setScaleState] = useState<ScaleId>(getInitialScale);
  const [font, setFontState] = useState<AppFont>(getInitialFont);

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.theme = theme;
    html.classList.toggle("dark", theme === "dark");
    localStorage.setItem(themeKey, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.scale = scale;
    localStorage.setItem(scaleKey, scale);
  }, [scale]);

  useEffect(() => {
    applyBodyFont(font);
    localStorage.setItem(FONT_KEY, font.id);
  }, [font]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: setThemeState,
      scale,
      setScale: setScaleState,
      font,
      setFont: setFontState,
    }),
    [theme, scale, font]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
