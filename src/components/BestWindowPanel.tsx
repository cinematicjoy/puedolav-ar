import type { BestWashWindow } from "../types/wash";
import { formatHour } from "../utils/dateFormat";

interface BestWindowPanelProps {
  window: BestWashWindow;
}

export function BestWindowPanel({ window }: BestWindowPanelProps) {
  return (
    <section className="panel best-window-panel">
      <div className="panel-heading">
        <p className="eyebrow">Plan del día</p>
        <h2>Mejor momento para lavar</h2>
      </div>
      <div className="best-window-grid">
        <div className="big-reco">
          <span>{window.bestStart && window.bestEnd ? `${formatHour(window.bestStart)} a ${formatHour(window.bestEnd)}` : "Sin ventana clara"}</span>
          <p>{window.message}</p>
        </div>
        <div className="metric-box">
          <strong>{window.goodHours}</strong>
          <span>horas buenas</span>
        </div>
        <div className={`metric-box status-${window.rainRisk}`}>
          <strong>{window.rainRisk === "good" ? "Bajo" : window.rainRisk === "caution" ? "Medio" : "Alto"}</strong>
          <span>riesgo de lluvia</span>
        </div>
        <div className="metric-box">
          <strong>{window.deadline ? formatHour(window.deadline) : "--"}</strong>
          <span>límite sugerido</span>
        </div>
      </div>
      {window.shouldWaitTomorrow ? <p className="inline-warning">Para piezas pesadas, probablemente convenga esperar a mañana.</p> : null}
    </section>
  );
}
