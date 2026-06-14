import { useState } from "react";
import type { WeatherVariableEvaluation } from "../types/wash";
import { WeatherVariableCard } from "./WeatherVariableCard";

interface WeatherVariablesProps {
  variables: WeatherVariableEvaluation[];
}

export function WeatherVariables({ variables }: WeatherVariablesProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const selectedVariable =
    variables.find((variable) => variable.key === selectedKey) ?? null;

  return (
    <section className="panel weather-metrics-panel">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Semáforo climático</p>
{/*         <h2>Variables para lavar</h2>
 */}        <p>Tocá una variable para ver detalles.</p>
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