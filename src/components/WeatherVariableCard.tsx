import type { WeatherVariableEvaluation } from "../types/wash";

interface WeatherVariableCardProps {
  variable: WeatherVariableEvaluation;
  selected: boolean;
  onSelect: (key: string) => void;
}

const shortNames: Record<string, string> = {
  rain: "Lluvia",
  humidity: "Humedad",
  temperature: "Temp.",
  wind: "Viento",
  sun: "Sol / UV",
  cloud: "Nubes",
  dew: "Rocío",
  air: "Aire"
};

export function WeatherVariableCard({
  variable,
  selected,
  onSelect
}: WeatherVariableCardProps) {
  const statusLabel =
    variable.status === "good"
      ? "óptimo"
      : variable.status === "caution"
        ? "precaución"
        : "riesgo";

  return (
    <button
      className={`metric-card status-${variable.status} ${selected ? "selected" : ""}`}
      type="button"
      onClick={() => onSelect(variable.key)}
      aria-pressed={selected}
      aria-label={`${variable.name}: ${variable.value}. Estado: ${statusLabel}. Tocar para ver detalle.`}
    >
      <span className="metric-name">
        {shortNames[variable.key] ?? variable.name}
      </span>

      <strong>
        {variable.value}
      </strong>

      <span className="status-dot" aria-hidden="true" />
    </button>
  );
}