import type { HourlyPoint } from "../types/weather";
import { formatHour } from "../utils/dateFormat";
import { getWeatherDescription } from "../utils/weatherCodes";
import { getGeneralStatusForHour } from "../utils/scoring";

interface ForecastHoursProps {
  hours: HourlyPoint[];
}

export function ForecastHours({ hours }: ForecastHoursProps) {
  return (
    <section className="forecast-block">
      <h3>Próximas horas</h3>
      <div className="hourly-strip" aria-label="Pronóstico próximas 12 horas">
        {hours.map((hour) => {
          const status = getGeneralStatusForHour(hour);
          return (
            <article key={hour.time} className={`hour-card status-${status}`}>
              <strong>{formatHour(hour.time)}</strong>
              <span>{hour.temperature !== undefined ? `${Math.round(hour.temperature)}°C` : "--"}</span>
              <small>{hour.precipitationProbability !== undefined ? `${Math.round(hour.precipitationProbability)}% lluvia` : "s/d lluvia"}</small>
              <small>{hour.humidity !== undefined ? `${Math.round(hour.humidity)}% hum.` : "s/d hum."}</small>
              <small>{hour.windSpeed !== undefined ? `${Math.round(hour.windSpeed)} km/h` : "s/d viento"}</small>
              <small>{getWeatherDescription(hour.weatherCode)}</small>
              <span className="confidence">Confianza simple: {status === "good" ? "alta" : status === "caution" ? "media" : "baja"}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
