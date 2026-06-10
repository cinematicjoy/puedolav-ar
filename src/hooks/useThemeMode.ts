import { useEffect, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type ThemeMode = "day" | "night" | "system";

export function useThemeMode() {
  const [mode, setMode] = useLocalStorage<ThemeMode>("theme-mode", "system");

  const prefersDark = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const resolved = mode === "system" ? (systemDark ? "night" : "day") : mode;
      document.documentElement.dataset.theme = resolved;
    };

    applyTheme();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [mode]);

  const resolvedMode: "day" | "night" = mode === "system" ? (prefersDark ? "night" : "day") : mode;

  return { mode, resolvedMode, setMode };
}
