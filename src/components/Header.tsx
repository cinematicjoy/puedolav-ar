import { useMemo } from "react";
import type { ThemeMode } from "../hooks/useThemeMode";

interface HeaderProps {
  themeMode: ThemeMode;
  resolvedThemeMode: "day" | "night";
  weatherCode?: number;
  onThemeChange: (mode: ThemeMode) => void;
  onOpenCredits: () => void;
}

const fallbackWeatherEmojis = ["☀️", "🌤️", "⛅", "☁️", "🌧️", "⛈️", "🌦️", "🌈", "💨"];

function getHeaderWeatherEmoji(weatherCode?: number): string {
  if (weatherCode === undefined) {
    return fallbackWeatherEmojis[Math.floor(Math.random() * fallbackWeatherEmojis.length)] ?? "🌤️";
  }

  if (weatherCode === 0) return "☀️";
  if ([1, 2].includes(weatherCode)) return "🌤️";
  if (weatherCode === 3) return "☁️";
  if ([45, 48].includes(weatherCode)) return "🌫️";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return "❄️";
  if ([95, 96, 99].includes(weatherCode)) return "⛈️";

  return "🌦️";
}

export function Header({
  themeMode,
  resolvedThemeMode,
  weatherCode,
  onThemeChange,
  onOpenCredits
}: HeaderProps) {
  const weatherEmoji = useMemo(() => getHeaderWeatherEmoji(weatherCode), [weatherCode]);

  const nextTheme: ThemeMode = resolvedThemeMode === "night" ? "day" : "night";
  const themeIcon = resolvedThemeMode === "night" ? "🌙" : "☀️";

  const themeLabel =
    resolvedThemeMode === "night"
      ? "Modo noche activo. Cambiar a modo día"
      : "Modo día activo. Cambiar a modo noche";

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon" aria-hidden="true">
          {weatherEmoji}
        </div>

        <div>
          <h1>puedolav.ar</h1>
          <p>¿Conviene lavar hoy?</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="icon-button theme-toggle"
          type="button"
          onClick={() => onThemeChange(nextTheme)}
          aria-label={themeLabel}
          title={themeLabel}
          data-mode={themeMode}
        >
          <span aria-hidden="true">{themeIcon}</span>
        </button>

        <button
          className="icon-button"
          type="button"
          onClick={onOpenCredits}
          aria-label="Información"
          title="Información"
        >
          <span aria-hidden="true">ⓘ</span>
        </button>
      </div>
    </header>
  );
}