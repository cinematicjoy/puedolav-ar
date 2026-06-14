import type { BestWashWindow } from "../types/wash";
import { formatHour } from "../utils/dateFormat";

interface BestWindowPanelProps {
  window: BestWashWindow;
}

export function BestWindowPanel({ window }: BestWindowPanelProps) {
  const rainRiskLabel =
    window.rainRisk === "good"
      ? "Bajo"
      : window.rainRisk === "caution"
        ? "Medio"
        : "Alto";

  return (
    <section className="panel best-window-panel">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Plan del día</p>
        <h2>Mejor momento para lavar</h2>
      </div>

      <article className="day-plan-card">
        <div className="day-plan-main">
          <strong>
            {window.bestStart && window.bestEnd
              ? `${formatHour(window.bestStart)} a ${formatHour(window.bestEnd)}`
              : "Sin ventana clara"}
          </strong>

          <p>{window.message}</p>
        </div>

        <div className="day-plan-metrics">
          <div className="mini-metric">
            <strong>{window.goodHours}</strong>
            <span>horas buenas</span>
          </div>

          <div className={`mini-metric status-${window.rainRisk}`}>
            <strong>{rainRiskLabel}</strong>
            <span>riesgo lluvia</span>
          </div>

          <div className="mini-metric">
            <strong>
              {window.deadline ? formatHour(window.deadline) : "--"}
            </strong>
            <span>límite</span>
          </div>
        </div>
      </article>

      {window.shouldWaitTomorrow ? (
        <p className="inline-warning compact-warning">
          Para piezas pesadas, probablemente convenga esperar a mañana.
        </p>
      ) : null}
    </section>
  );
}