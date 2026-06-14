import type { HourlyPoint } from "../types/weather";
import { formatHour } from "../utils/dateFormat";
import { getGeneralStatusForHour } from "../utils/scoring";
import { getWeatherDescription } from "../utils/weatherCodes";

interface ForecastHoursProps {
  hours: HourlyPoint[];
}

export function ForecastHours({ hours }: ForecastHoursProps) {
  return (
    <div className="forecast-strip" aria-label="Pronóstico próximas 12 horas">
      {hours.map((hour) => {
        const status = getGeneralStatusForHour(hour);

        return (
          <article key={hour.time} className={`hour-card status-${status}`}>
            <strong>{formatHour(hour.time)}</strong>

            <span>
              {hour.temperature !== undefined
                ? `${Math.round(hour.temperature)}°C`
                : "--"}
            </span>

            <small>
              {hour.precipitationProbability !== undefined
                ? `${Math.round(hour.precipitationProbability)}% lluvia`
                : "s/d lluvia"}
            </small>

            <small>
              {hour.humidity !== undefined
                ? `${Math.round(hour.humidity)}% hum.`
                : "s/d hum."}
            </small>

            <small>
              {hour.windSpeed !== undefined
                ? `${Math.round(hour.windSpeed)} km/h`
                : "s/d viento"}
            </small>

            <small>{getWeatherDescription(hour.weatherCode)}</small>

            <span className="confidence">
              Confianza: {status === "good" ? "alta" : status === "caution" ? "media" : "baja"}
            </span>
          </article>
        );
      })}
    </div>
  );
}