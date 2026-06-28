import { useMemo } from "react";
import type { ThemeMode } from "../hooks/useThemeMode";

function CollapseAllIcon() {
  return (
    <svg
      className="compact-mode-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="5" y="4" width="14" height="3" rx="1.5" />
      <rect x="5" y="10.5" width="14" height="3" rx="1.5" />
      <rect x="5" y="17" width="14" height="3" rx="1.5" />

      <path
        className="compact-mode-icon-stroke"
        d="M3.5 8.5L6 11L3.5 13.5"
      />
      <path
        className="compact-mode-icon-stroke"
        d="M20.5 8.5L18 11L20.5 13.5"
      />
    </svg>
  );
}

function ExpandAllIcon() {
  return (
    <svg
      className="compact-mode-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="6" y="5" width="12" height="2.5" rx="1.25" />
      <rect x="6" y="10.75" width="12" height="2.5" rx="1.25" />
      <rect x="6" y="16.5" width="12" height="2.5" rx="1.25" />

      <path
        className="compact-mode-icon-stroke"
        d="M6 3.5L3.5 6L6 8.5"
      />
      <path
        className="compact-mode-icon-stroke"
        d="M18 3.5L20.5 6L18 8.5"
      />
      <path
        className="compact-mode-icon-stroke"
        d="M6 15.5L3.5 18L6 20.5"
      />
      <path
        className="compact-mode-icon-stroke"
        d="M18 15.5L20.5 18L18 20.5"
      />
    </svg>
  );
}

interface HeaderProps {
  themeMode: ThemeMode;
  resolvedThemeMode: "day" | "night";
  weatherCode?: number;
  onThemeChange: (mode: ThemeMode) => void;
  onOpenCredits: () => void;
  compactMode: boolean;
  onToggleCompactMode: () => void;
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
  onOpenCredits,
  compactMode,
  onToggleCompactMode
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
          className={`header-control-button compact-header-button ${compactMode ? "is-compact" : ""}`}
          type="button"
          onClick={onToggleCompactMode}
          aria-label={compactMode ? "Expandir secciones" : "Compactar secciones"}
          title={compactMode ? "Modo completo" : "Modo compacto"}
        >
          {compactMode ? <ExpandAllIcon /> : <CollapseAllIcon />}
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