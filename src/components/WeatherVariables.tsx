import { useMemo, useState } from "react";
import type { WeatherVariableEvaluation } from "../types/wash";
import { SectionCollapseButton } from "./SectionCollapseButton";
import { WeatherVariableCard } from "./WeatherVariableCard";

interface WeatherVariablesProps {
  variables: WeatherVariableEvaluation[];
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

type SummaryStatus = "good" | "caution" | "bad";

interface WeatherSummary {
  status: SummaryStatus;
  message: string;
  helper: string;
  icon: string;
  average: number;
}

function getStatusPoints(status: SummaryStatus): number {
  if (status === "good") return 2;
  if (status === "caution") return 1;
  return 0;
}

function calculateWeatherSummary(variables: WeatherVariableEvaluation[]): WeatherSummary {
  if (variables.length === 0) {
    return {
      status: "caution",
      message: "Sin datos suficientes",
      helper: "No pudimos calcular el semáforo general.",
      icon: "⚠️",
      average: 0
    };
  }

  const total = variables.reduce((sum, variable) => {
    return sum + getStatusPoints(variable.status);
  }, 0);

  const average = total / variables.length;

  if (average >= 1.5) {
    return {
      status: "good",
      message: "Sí, conviene lavar hoy",
      helper: "La mayoría de variables acompaña.",
      icon: "✅",
      average
    };
  }

  if (average >= 0.8) {
    return {
      status: "caution",
      message: "Se puede lavar, con atención",
      helper: "Hay condiciones mixtas. Revisá qué vas a lavar.",
      icon: "⚠️",
      average
    };
  }

  return {
    status: "bad",
    message: "Mejor evitar lavar hoy",
    helper: "Varias condiciones complican el secado.",
    icon: "⛔",
    average
  };
}

export function WeatherVariables({
  variables,
  collapsed,
  onToggleCollapsed
}: WeatherVariablesProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const selectedVariable =
    variables.find((variable) => variable.key === selectedKey) ?? null;

  const summary = useMemo(() => {
    return calculateWeatherSummary(variables);
  }, [variables]);

  if (collapsed) {
    return (
      <section className="panel weather-metrics-panel collapsible-shell collapsed-section">
        <SectionCollapseButton
          collapsed={collapsed}
          label="semáforo climático"
          onToggle={onToggleCollapsed}
        />

        <article className={`collapsed-weather-summary status-${summary.status}`}>
          <span className="collapsed-summary-icon" aria-hidden="true">
            {summary.icon}
          </span>

          <div>
            <p className="eyebrow">Semáforo climático</p>
            <strong>{summary.message}</strong>
            <small>
              {summary.helper} Promedio: {summary.average.toFixed(1)}/2.
            </small>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="panel weather-metrics-panel collapsible-shell">
      <SectionCollapseButton
        collapsed={collapsed}
        label="semáforo climático"
        onToggle={onToggleCollapsed}
      />

      <div className="panel-heading compact-heading">
        <p className="eyebrow">Semáforo climático</p>
        <h2>Variables para lavar</h2>
        <p>Tocá una variable para ver el motivo.</p>
      </div>

      <div className="metrics-grid">
        {variables.map((variable) => (
          <WeatherVariableCard
            key={variable.key}
            variable={variable}
            selected={variable.key === selectedKey}
            onSelect={(key) =>
              setSelectedKey((current) => current === key ? null : key)
            }
          />
        ))}
      </div>

      {selectedVariable ? (
        <article className={`metric-detail-panel status-${selectedVariable.status}`}>
          <div>
            <strong>{selectedVariable.name}</strong>
            <span>{selectedVariable.value}</span>
          </div>

          <p>
            <strong>Ideal:</strong> {selectedVariable.ideal}
          </p>

          <p>
            <strong>
              {selectedVariable.percentage > 0 ? "+" : ""}
              {selectedVariable.percentage}% vs ideal.
            </strong>{" "}
            {selectedVariable.explanation}
          </p>
        </article>
      ) : null}
    </section>
  );
}