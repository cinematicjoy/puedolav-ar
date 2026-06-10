import type { WeatherData } from "../types/weather";
import { formatDateTime, timeAgo } from "../utils/dateFormat";
import { formatLocation, formatLocationDetails } from "../utils/locationFormat";
import { getWeatherDescription } from "../utils/weatherCodes";

interface LocationInfoProps {
  data: WeatherData;
  onRefresh: () => void;
  onChangeLocation: () => void;
  loading?: boolean;
}

export function LocationInfo({ data, onRefresh, onChangeLocation, loading }: LocationInfoProps) {
  const current = data.forecast.current;
  const timezone = data.forecast.timezone ?? data.location.timezone;
  const details = formatLocationDetails(data.location);

  return (
    <section className="panel hero-panel">
      {data.offline ? <div className="offline-pill">Sin conexión · últimos datos guardados</div> : null}
      {data.fromCache && !data.offline ? <div className="offline-pill">Datos guardados</div> : null}
      <div className="hero-grid">
        <div>
          <p className="eyebrow">Consulta actual</p>
          <h2>Estás consultando desde {formatLocation(data.location)}</h2>
          <p className="muted">{details.join(" · ")}</p>
          <p className="date-line">{formatDateTime(new Date(), timezone)}</p>
        </div>
        <div className="weather-summary-card">
          <span className="weather-temp">{current?.temperature_2m !== undefined ? `${Math.round(current.temperature_2m)}°C` : "--"}</span>
          <span>{getWeatherDescription(current?.weather_code)}</span>
          <small>Actualizado {timeAgo(data.fetchedAt)}</small>
        </div>
      </div>
      <div className="action-row">
        <button className="primary-button" type="button" onClick={onRefresh} disabled={loading}>{loading ? "Actualizando..." : "Actualizar clima"}</button>
        <button className="secondary-button" type="button" onClick={onChangeLocation}>Cambiar ubicación</button>
      </div>
    </section>
  );
}
