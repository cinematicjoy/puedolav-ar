import { washItems } from "../data/washItems";
import type {
  BestWashWindow,
  Status,
  WashItemType,
  WashRecommendation,
  WeatherVariableEvaluation
} from "../types/wash";
import { formatHour } from "../utils/dateFormat";

interface MainWashSummaryProps {
  recommendations: Record<WashItemType, WashRecommendation>;
  variables: WeatherVariableEvaluation[];
  bestWindow: BestWashWindow;
}

interface SummaryResult {
  status: Status;
  icon: string;
  title: string;
  subtitle: string;
  helper: string;
}

function getStatusPoints(status: Status): number {
  if (status === "good") return 2;
  if (status === "caution") return 1;
  return 0;
}

function getWeatherAverage(variables: WeatherVariableEvaluation[]): number {
  if (!variables.length) return 0;

  const total = variables.reduce((sum, variable) => {
    return sum + getStatusPoints(variable.status);
  }, 0);

  return total / variables.length;
}

function getRainVariable(variables: WeatherVariableEvaluation[]) {
  return variables.find((variable) => variable.key === "rain");
}

function getWorstVariables(variables: WeatherVariableEvaluation[]) {
  return variables
    .filter((variable) => variable.status === "bad")
    .slice(0, 2)
    .map((variable) => variable.name.toLowerCase());
}

function getBestRecommendation(
  recommendations: Record<WashItemType, WashRecommendation>
) {
  const ranked = washItems
    .map((item) => ({
      item,
      recommendation: recommendations[item.type]
    }))
    .filter((entry) => Boolean(entry.recommendation))
    .sort((a, b) => b.recommendation.score - a.recommendation.score);

  return ranked[0];
}

function calculateMainSummary(
  recommendations: Record<WashItemType, WashRecommendation>,
  variables: WeatherVariableEvaluation[],
  bestWindow: BestWashWindow
): SummaryResult {
  const best = getBestRecommendation(recommendations);
  const weatherAverage = getWeatherAverage(variables);
  const badVariables = getWorstVariables(variables);
  const rainVariable = getRainVariable(variables);

  if (!best) {
    return {
      status: "caution",
      icon: "⚠️",
      title: "No hay datos suficientes",
      subtitle: "Probá actualizar el clima.",
      helper: "La recomendación necesita datos actuales para ser confiable."
    };
  }

  const bestItemName = best.item.name.toLowerCase();
  const bestScore = best.recommendation.score;

  if (bestScore >= 75 && weatherAverage >= 1.5) {
    return {
      status: "good",
      icon: "✅",
      title: `Sí, conviene lavar ${bestItemName}`,
      subtitle: `${best.recommendation.score}/100 · ${best.recommendation.label}`,
      helper:
        bestWindow.goodHours > 0
          ? `Tenés aproximadamente ${bestWindow.goodHours} horas favorables.`
          : "Las condiciones generales acompañan."
    };
  }

  if (bestScore >= 55 || weatherAverage >= 0.8) {
    return {
      status: "caution",
      icon: "⚠️",
      title: "Se puede lavar, con atención",
      subtitle: `Mejor opción: ${best.item.name.toLowerCase()} · ${bestScore}/100`,
      helper:
        badVariables.length > 0
          ? `Prestá atención a ${badVariables.join(" y ")}.`
          : "Elegí piezas simples y evitá lavados pesados."
    };
  }

  return {
    status: "bad",
    icon: "⛔",
    title: "Mejor evitar lavar hoy",
    subtitle:
      rainVariable?.value !== undefined
        ? `Riesgo climático alto · lluvia ${rainVariable.value}`
        : "Las condiciones no acompañan.",
    helper:
      bestWindow.shouldWaitTomorrow
        ? "Para piezas pesadas, probablemente convenga esperar a mañana."
        : "Si necesitás lavar, elegí algo chico y fácil de entrar rápido."
  };
}

function getRainRiskLabel(status: Status): string {
  if (status === "good") return "Bajo";
  if (status === "caution") return "Medio";
  return "Alto";
}

export function MainWashSummary({
  recommendations,
  variables,
  bestWindow
}: MainWashSummaryProps) {
  const summary = calculateMainSummary(recommendations, variables, bestWindow);

  const windowLabel =
    bestWindow.bestStart && bestWindow.bestEnd
      ? `${formatHour(bestWindow.bestStart)} a ${formatHour(bestWindow.bestEnd)}`
      : "Sin ventana clara";

  return (
    <section className={`main-wash-summary status-${summary.status}`}>
      <div className="main-summary-icon" aria-hidden="true">
        {summary.icon}
      </div>

      <div className="main-summary-content">
        <p className="eyebrow">Respuesta rápida</p>
        <h2>{summary.title}</h2>
        <p className="main-summary-subtitle">{summary.subtitle}</p>
        <p className="main-summary-helper">{summary.helper}</p>

        <div className="main-summary-pills" aria-label="Resumen del día">
          <span>
            <strong>{windowLabel}</strong>
            <small>mejor ventana</small>
          </span>

          <span>
            <strong>{bestWindow.goodHours}</strong>
            <small>horas buenas</small>
          </span>

          <span>
            <strong>{getRainRiskLabel(bestWindow.rainRisk)}</strong>
            <small>riesgo lluvia</small>
          </span>
        </div>
      </div>
    </section>
  );
}