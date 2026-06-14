import { useState } from "react";
import type { DailyPoint, HourlyPoint } from "../types/weather";
import { ForecastDays } from "./ForecastDays";
import { ForecastHours } from "./ForecastHours";

interface ForecastSectionProps {
  hours: HourlyPoint[];
  days: DailyPoint[];
}

type ForecastTab = "hours" | "days";

export function ForecastSection({ hours, days }: ForecastSectionProps) {
  const [activeTab, setActiveTab] = useState<ForecastTab>("hours");

  return (
    <section className="panel forecast-panel">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Pronóstico</p>
        <h2>Próximas horas y días</h2>
      </div>

      <div className="forecast-tabs" role="tablist" aria-label="Cambiar pronóstico">
        <button
          className={activeTab === "hours" ? "active" : ""}
          type="button"
          role="tab"
          aria-selected={activeTab === "hours"}
          onClick={() => setActiveTab("hours")}
        >
          Próximas horas
        </button>

        <button
          className={activeTab === "days" ? "active" : ""}
          type="button"
          role="tab"
          aria-selected={activeTab === "days"}
          onClick={() => setActiveTab("days")}
        >
          Próximos días
        </button>
      </div>

      <div className="forecast-tab-panel" role="tabpanel">
        {activeTab === "hours" ? (
          <ForecastHours hours={hours} />
        ) : (
          <ForecastDays days={days} />
        )}
      </div>
    </section>
  );
}