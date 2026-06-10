import type { DailyPoint } from "../types/weather";
import { formatDay } from "../utils/dateFormat";
import { getGeneralStatusForDay } from "../utils/scoring";
import { getWeatherDescription } from "../utils/weatherCodes";

interface ForecastDaysProps {
  days: DailyPoint[];
}

export function ForecastDays({ days }: ForecastDaysProps) {
  return (
    <section className="forecast-block">
      <h3>Próximos días</h3>
      <div className="days-grid">
        {days.map((day) => {
          const status = getGeneralStatusForDay(
            day.precipitationProbabilityMax,
            day.avgHumidity,
            day.windSpeedMax,
            day.maxTemp,
            day.minTemp
          );
          const label = status === "good" ? "Buen día para lavar" : status === "caution" ? "Día regular" : "No recomendable";
          return (
            <article key={day.date} className={`day-card status-${status}`}>
              <strong>{formatDay(day.date)}</strong>
              <span>{day.minTemp !== undefined && day.maxTemp !== undefined ? `${Math.round(day.minTemp)}° / ${Math.round(day.maxTemp)}°` : "--"}</span>
              <small>{day.precipitationProbabilityMax !== undefined ? `${Math.round(day.precipitationProbabilityMax)}% lluvia máx.` : "s/d lluvia"}</small>
              <small>{day.avgHumidity !== undefined ? `${day.avgHumidity}% humedad prom.` : "humedad s/d"}</small>
              <small>{day.windSpeedMax !== undefined ? `${Math.round(day.windSpeedMax)} km/h viento` : "viento s/d"}</small>
              <small>{getWeatherDescription(day.weatherCode)}</small>
              <span className="day-label">{label}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
