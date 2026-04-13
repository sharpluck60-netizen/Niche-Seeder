import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeId = "light" | "neon" | "dark";

export const themes: Array<{ id: ThemeId; label: string; description: string }> = [
  { id: "light", label: "White", description: "Clean high-contrast workspace" },
  { id: "neon", label: "Neon", description: "Bright cyber campaign mode" },
  { id: "dark", label: "Dark", description: "Original Seeder OS look" },
];

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const storageKey = "niche-seeder-theme";

function getInitialTheme(): ThemeId {
  const stored = localStorage.getItem(storageKey);
  return themes.some((theme) => theme.id === stored) ? (stored as ThemeId) : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(storageKey, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: setThemeState,
    }),
    [theme]
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