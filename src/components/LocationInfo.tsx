import type { WeatherData } from "../types/weather";
import { formatHour } from "../utils/dateFormat";
import { getWeatherDescription } from "../utils/weatherCodes";

interface LocationInfoProps {
  data: WeatherData;
  onRefresh: () => void;
  onChangeLocation: () => void;
  loading?: boolean;
}

function formatCurrentDay(dateLike: Date, timezone?: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    timeZone: timezone
  }).format(dateLike);
}

function formatCurrentDate(dateLike: Date, timezone?: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    timeZone: timezone
  }).format(dateLike);
}

export function LocationInfo({
  data,
  onRefresh,
  onChangeLocation,
  loading
}: LocationInfoProps) {
  const current = data.forecast.current;
  const timezone = data.forecast.timezone ?? data.location.timezone;
  const now = new Date();

  return (
    <section className="panel hero-panel compact-hero">
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
            {formatCurrentDate(now, timezone)} · {formatHour(now, timezone)}
          </p>

          <p className="muted hero-weather-text">
            {getWeatherDescription(current?.weather_code)}
          </p>
        </div>

        <div className="weather-mini-card" aria-label="Temperatura actual">
          <span className="weather-temp-small">
            {current?.temperature_2m !== undefined
              ? `${Math.round(current.temperature_2m)}°`
              : "--"}
          </span>
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