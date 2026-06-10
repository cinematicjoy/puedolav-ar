import type { BestWashWindow, Status } from "../types/wash";
import type { HourlyPoint, WeatherData } from "../types/weather";
import { formatHour } from "./dateFormat";
import { getNextHourlyPoints } from "./weatherData";

export function scoreHourForWashing(point: HourlyPoint): number {
  const hour = new Date(point.time).getHours();
  const isDay = hour >= 7 && hour <= 19;
  let score = isDay ? 72 : 38;

  const rainProbability = point.precipitationProbability ?? 0;
  const precipitation = point.precipitation ?? 0;
  const humidity = point.humidity ?? 70;
  const temperature = point.temperature ?? 15;
  const wind = point.windSpeed ?? 0;
  const cloud = point.cloudCover ?? 60;

  if (rainProbability > 45 || precipitation > 0.2) score -= 36;
  else if (rainProbability > 20) score -= 15;

  if (humidity > 75) score -= 22;
  else if (humidity >= 60) score -= 10;
  else score += 8;

  if (temperature >= 18 && temperature <= 30) score += 12;
  else if ((temperature >= 12 && temperature < 18) || (temperature > 30 && temperature <= 34)) score += 2;
  else score -= 18;

  if (wind >= 8 && wind <= 25) score += 12;
  else if ((wind >= 1 && wind < 8) || (wind > 25 && wind <= 35)) score += 2;
  else score -= 15;

  if (cloud <= 50) score += 8;
  else if (cloud <= 75) score += 2;
  else score -= 10;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function calculateBestWashWindow(data: WeatherData): BestWashWindow {
  const points = getNextHourlyPoints(data, 24);
  if (!points.length) {
    return {
      goodHours: 0,
      rainRisk: "bad",
      shouldWaitTomorrow: true,
      message: "No hay pronóstico horario suficiente para recomendar una ventana de lavado."
    };
  }

  const scored = points.map((point) => ({ ...point, score: scoreHourForWashing(point) }));
  const goodIndexes = scored.map((point, index) => (point.score >= 65 ? index : -1)).filter((index) => index >= 0);

  let bestStart = -1;
  let bestEnd = -1;
  let currentStart = -1;
  let currentEnd = -1;

  scored.forEach((point, index) => {
    if (point.score >= 65) {
      if (currentStart === -1) currentStart = index;
      currentEnd = index;
    } else if (currentStart !== -1) {
      if (currentEnd - currentStart > bestEnd - bestStart) {
        bestStart = currentStart;
        bestEnd = currentEnd;
      }
      currentStart = -1;
      currentEnd = -1;
    }
  });

  if (currentStart !== -1 && currentEnd - currentStart > bestEnd - bestStart) {
    bestStart = currentStart;
    bestEnd = currentEnd;
  }

  const maxRain = Math.max(...points.map((point) => point.precipitationProbability ?? 0));
  const rainRisk: Status = maxRain <= 20 ? "good" : maxRain <= 45 ? "caution" : "bad";
  const goodHours = goodIndexes.length;
  const tomorrowPoints = scored.filter((point) => {
    const date = new Date(point.time);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  });
  const tomorrowAvg = tomorrowPoints.length
    ? tomorrowPoints.reduce((sum, point) => sum + point.score, 0) / tomorrowPoints.length
    : 0;
  const todayAvg = scored.slice(0, 12).reduce((sum, point) => sum + point.score, 0) / Math.min(scored.length, 12);
  const shouldWaitTomorrow = tomorrowAvg > todayAvg + 12;

  if (bestStart < 0 || bestEnd < 0) {
    return {
      goodHours,
      rainRisk,
      shouldWaitTomorrow: true,
      message: shouldWaitTomorrow
        ? "Hoy viene flojo para lavar. Mañana pinta mejor según las próximas horas disponibles."
        : "No aparece una ventana suficientemente favorable en las próximas 24 horas."
    };
  }

  const start = scored[bestStart];
  const end = scored[bestEnd];
  const deadline = scored[Math.max(bestStart, bestEnd - 1)]?.time ?? end.time;

  return {
    bestStart: start.time,
    bestEnd: end.time,
    goodHours: bestEnd - bestStart + 1,
    rainRisk,
    deadline,
    shouldWaitTomorrow,
    message: `Mejor ventana: ${formatHour(start.time)} a ${formatHour(end.time)}. Tenés aproximadamente ${bestEnd - bestStart + 1} horas favorables.`
  };
}
