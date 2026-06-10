import type { WeatherVariableEvaluation } from "../types/wash";

interface WeatherVariableCardProps {
  variable: WeatherVariableEvaluation;
}

export function WeatherVariableCard({ variable }: WeatherVariableCardProps) {
  return (
    <article className={`variable-card status-${variable.status}`}>
      <div className="card-topline">
        <h3>{variable.name}</h3>
        <span className="status-dot" aria-label={`Estado ${variable.status}`} />
      </div>
      <div className="variable-value">{variable.value}</div>
      <p><strong>Ideal:</strong> {variable.ideal}</p>
      <div className="trend-line">
        <span className={`trend-arrow ${variable.direction}`}>{variable.direction === "neutral" ? "→" : variable.direction === "up" ? "↑" : "↓"}</span>
        <span>{variable.percentage > 0 ? "+" : ""}{variable.percentage}% vs ideal</span>
      </div>
      <p className="muted">{variable.explanation}</p>
    </article>
  );
}
