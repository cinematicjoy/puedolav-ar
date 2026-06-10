import type { DailyPoint, HourlyPoint } from "../types/weather";
import { ForecastDays } from "./ForecastDays";
import { ForecastHours } from "./ForecastHours";

interface ForecastSectionProps {
  hours: HourlyPoint[];
  days: DailyPoint[];
}

export function ForecastSection({ hours, days }: ForecastSectionProps) {
  return (
    <section className="panel forecast-panel">
      <div className="panel-heading">
        <p className="eyebrow">Pronóstico</p>
        <h2>Próximas horas y próximos días</h2>
      </div>
      <ForecastHours hours={hours} />
      <ForecastDays days={days} />
    </section>
  );
}
