import type { WeatherData } from "../types/weather";
import { formatHour } from "../utils/dateFormat";
import { getWeatherDescription } from "../utils/weatherCodes";
import { SectionCollapseButton } from "./SectionCollapseButton";

interface LocationInfoProps {
  data: WeatherData;
  onRefresh: () => void;
  onChangeLocation: () => void;
  loading?: boolean;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

function formatCurrentDay(dateLike: Date, timezone?: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    timeZone: timezone
  }).format(dateLike);
}

function formatCurrentDateLong(dateLike: Date, timezone?: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    timeZone: timezone
  }).format(dateLike);
}

function formatCurrentDateShort(dateLike: Date, timezone?: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: timezone
  }).format(dateLike);
}

export function LocationInfo({
  data,
  onRefresh,
  onChangeLocation,
  loading,
  collapsed,
  onToggleCollapsed
}: LocationInfoProps) {
  const current = data.forecast.current;
  const timezone = data.forecast.timezone ?? data.location.timezone;
  const now = new Date();

  const temperature =
    current?.temperature_2m !== undefined
      ? `${Math.round(current.temperature_2m)}°`
      : "--";

  if (collapsed) {
    return (
      <section className="panel hero-panel compact-hero collapsible-shell collapsed-section">
        <SectionCollapseButton
          collapsed={collapsed}
          label="consulta actual"
          onToggle={onToggleCollapsed}
        />

        <div className="current-weather-collapsed">
          <strong>{formatCurrentDay(now, timezone)}</strong>
          <span>{formatCurrentDateShort(now, timezone)}</span>
          <span>{formatHour(now, timezone)}</span>
          <span>{temperature}</span>
        </div>
      </section>
    );
  }

  return (
    <section className="panel hero-panel compact-hero collapsible-shell">
      <SectionCollapseButton
        collapsed={collapsed}
        label="consulta actual"
        onToggle={onToggleCollapsed}
      />

      {data.offline ? (
        <div className="offline-pill">
          Sin conexión · últimos datos guardados
        </div>
      ) : null}

      {data.fromCache && !data.offline ? (
        <div className="offline-pill">
          Datos guardados
        </div>
      ) : null}

      <div className="hero-current-row">
        <div>
          <p className="eyebrow">Consulta actual</p>

          <h2>{formatCurrentDay(now, timezone)}</h2>

          <p className="date-line">
            {formatCurrentDateLong(now, timezone)} · {formatHour(now, timezone)}
          </p>

          <p className="muted hero-weather-text">
            {getWeatherDescription(current?.weather_code)}
          </p>
        </div>

        <div className="weather-mini-card" aria-label="Temperatura actual">
          <span className="weather-temp-small">{temperature}</span>
        </div>
      </div>

      <div className="action-row hero-actions">
        <button
          className="primary-button"
          type="button"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </button>

        <button
          className="secondary-button"
          type="button"
          onClick={onChangeLocation}
        >
          Cambiar ubicación
        </button>
      </div>
    </section>
  );
}