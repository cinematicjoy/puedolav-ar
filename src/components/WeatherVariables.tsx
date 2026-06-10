import type { WeatherVariableEvaluation } from "../types/wash";
import { WeatherVariableCard } from "./WeatherVariableCard";

interface WeatherVariablesProps {
  variables: WeatherVariableEvaluation[];
}

export function WeatherVariables({ variables }: WeatherVariablesProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Semáforo climático</p>
        <h2>Variables para lavar al aire libre</h2>
        <p>Estas variables se combinan para decidir cada categoría lavable.</p>
      </div>
      <div className="variables-grid">
        {variables.map((variable) => <WeatherVariableCard key={variable.key} variable={variable} />)}
      </div>
    </section>
  );
}
