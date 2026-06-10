import { idealConditions } from "../data/idealConditions";
import { washItems } from "../data/washItems";
import type { Status, WashItem, WashItemType, WashRecommendation, WeatherVariableEvaluation } from "../types/wash";
import type { HourlyPoint, WeatherData } from "../types/weather";
import { getAirQualityNow, getCurrentHourlyIndex, getHourlyPoint, getNextHourlyPoints } from "./weatherData";
import { calculateBestWashWindow } from "./washWindow";

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function statusFromScore(score: number): Status {
  if (score >= 75) return "good";
  if (score >= 50) return "caution";
  return "bad";
}

function labelFromStatus(status: Status): "Conviene" | "Con cuidado" | "No conviene" {
  if (status === "good") return "Conviene";
  if (status === "caution") return "Con cuidado";
  return "No conviene";
}

function currentPoint(data: WeatherData): HourlyPoint {
  const index = getCurrentHourlyIndex(data);
  return (
    getHourlyPoint(data, index) ?? {
      time: data.forecast.current?.time ?? new Date().toISOString(),
      temperature: data.forecast.current?.temperature_2m,
      humidity: data.forecast.current?.relative_humidity_2m,
      precipitation: data.forecast.current?.precipitation,
      rain: data.forecast.current?.rain,
      weatherCode: data.forecast.current?.weather_code,
      cloudCover: data.forecast.current?.cloud_cover,
      windSpeed: data.forecast.current?.wind_speed_10m,
      windGust: data.forecast.current?.wind_gusts_10m
    }
  );
}

function rainStatus(value = 0): Status {
  if (value <= 20) return "good";
  if (value <= 45) return "caution";
  return "bad";
}

function humidityStatus(value = 70): Status {
  if (value < 60) return "good";
  if (value <= 75) return "caution";
  return "bad";
}

function temperatureStatus(value = 16): Status {
  if (value >= 18 && value <= 30) return "good";
  if ((value >= 12 && value <= 17) || (value >= 31 && value <= 34)) return "caution";
  return "bad";
}

function windStatus(value = 0): Status {
  if (value >= 8 && value <= 25) return "good";
  if ((value >= 1 && value <= 7) || (value >= 26 && value <= 35)) return "caution";
  return "bad";
}

function cloudStatus(value = 80): Status {
  if (value <= 50) return "good";
  if (value <= 75) return "caution";
  return "bad";
}

function dewPointStatus(value = 18): Status {
  if (value < 12) return "good";
  if (value <= 17) return "caution";
  return "bad";
}

function uvStatus(value?: number): Status {
  if (value === undefined) return "caution";
  if (value >= 3 && value <= 6) return "good";
  if (value < 3 || (value > 6 && value <= 8)) return "caution";
  return "bad";
}

function airStatus(europeanAqi?: number, pm10?: number, dust?: number): Status {
  if (europeanAqi !== undefined) {
    if (europeanAqi <= 40) return "good";
    if (europeanAqi <= 80) return "caution";
    return "bad";
  }
  const proxy = Math.max(pm10 ?? 0, dust ?? 0);
  if (proxy <= 25) return "good";
  if (proxy <= 50) return "caution";
  return "bad";
}

function percentageForStatus(status: Status, rawValue: number, targetDescription: string): number {
  if (status === "good") return Math.round(clamp(85 + Math.min(15, rawValue % 15)));
  if (status === "caution") return Math.round(clamp(35 - Math.min(25, rawValue % 25)));
  return -Math.round(clamp(45 + Math.min(45, rawValue % 45)));
}

export function evaluateWeatherVariables(data: WeatherData): WeatherVariableEvaluation[] {
  const point = currentPoint(data);
  const aq = getAirQualityNow(data);
  const rainProbability = point.precipitationProbability ?? 0;
  const humidity = point.humidity ?? data.forecast.current?.relative_humidity_2m ?? 70;
  const temperature = point.temperature ?? data.forecast.current?.temperature_2m ?? 16;
  const wind = point.windSpeed ?? data.forecast.current?.wind_speed_10m ?? 0;
  const cloud = point.cloudCover ?? data.forecast.current?.cloud_cover ?? 80;
  const dewPoint = point.dewPoint ?? temperature - (100 - humidity) / 5;
  const uv = aq.uvIndex ?? point.uvIndex;
  const air = airStatus(aq.europeanAqi, aq.pm10, aq.dust);

  const rows: Array<{
    key: string;
    name: string;
    value: string;
    ideal: string;
    status: Status;
    raw: number;
    helpsWhenHigher?: boolean;
    explanation: string;
  }> = [
    {
      key: "rain",
      name: "Probabilidad de lluvia",
      value: `${Math.round(rainProbability)}%`,
      ideal: idealConditions.rainProbability,
      status: rainStatus(rainProbability),
      raw: rainProbability,
      helpsWhenHigher: false,
      explanation: rainProbability <= 20 ? "Riesgo bajo para colgar afuera." : "Puede complicar el secado o mojar lo lavado."
    },
    {
      key: "humidity",
      name: "Humedad relativa",
      value: `${Math.round(humidity)}%`,
      ideal: idealConditions.humidity,
      status: humidityStatus(humidity),
      raw: humidity,
      helpsWhenHigher: false,
      explanation: humidity < 60 ? "La ropa pierde humedad con más facilidad." : "La humedad alta vuelve lento el secado."
    },
    {
      key: "temperature",
      name: "Temperatura",
      value: `${Math.round(temperature)}°C`,
      ideal: idealConditions.temperature,
      status: temperatureStatus(temperature),
      raw: temperature,
      helpsWhenHigher: temperature < 24,
      explanation: temperature >= 18 && temperature <= 30 ? "Rango cómodo para secado al aire." : "Fuera del rango ideal, el secado puede ser lento o agresivo."
    },
    {
      key: "wind",
      name: "Viento",
      value: `${Math.round(wind)} km/h`,
      ideal: idealConditions.wind,
      status: windStatus(wind),
      raw: wind,
      helpsWhenHigher: wind < 8,
      explanation: wind >= 8 && wind <= 25 ? "Ayuda a renovar aire sin ensuciar demasiado." : "Muy poco viento seca lento; demasiado viento levanta polvo."
    },
    {
      key: "sun",
      name: "Sol / UV",
      value: uv === undefined ? "Sin dato" : `UV ${uv.toFixed(1)}`,
      ideal: idealConditions.sun,
      status: uvStatus(uv),
      raw: uv ?? 5,
      helpsWhenHigher: (uv ?? 0) < 3,
      explanation: uv === undefined ? "No llegó dato UV; usamos el resto de variables." : uv >= 3 && uv <= 6 ? "Sol moderado, útil sin ser extremo." : "Sol bajo o muy fuerte exige más cuidado."
    },
    {
      key: "cloud",
      name: "Nubosidad",
      value: `${Math.round(cloud)}%`,
      ideal: idealConditions.cloudCover,
      status: cloudStatus(cloud),
      raw: cloud,
      helpsWhenHigher: false,
      explanation: cloud <= 50 ? "Hay buena entrada de sol." : "Mucha nube reduce energía de secado."
    },
    {
      key: "dew",
      name: "Punto de rocío",
      value: `${Math.round(dewPoint)}°C`,
      ideal: idealConditions.dewPoint,
      status: dewPointStatus(dewPoint),
      raw: dewPoint,
      helpsWhenHigher: false,
      explanation: dewPoint < 12 ? "Ambiente menos pesado para secar." : "Punto de rocío alto indica aire cargado de humedad."
    },
    {
      key: "air",
      name: "Calidad de aire / polvo",
      value: aq.europeanAqi !== undefined ? `AQI ${Math.round(aq.europeanAqi)}` : aq.pm10 !== undefined ? `PM10 ${Math.round(aq.pm10)}` : "Sin dato",
      ideal: idealConditions.airQuality,
      status: air,
      raw: aq.europeanAqi ?? aq.pm10 ?? 50,
      helpsWhenHigher: false,
      explanation: air === "good" ? "Bajo riesgo de que polvo o partículas ensucien." : "Puede haber partículas o polvo en suspensión."
    }
  ];

  return rows.map((row) => ({
    key: row.key,
    name: row.name,
    value: row.value,
    ideal: row.ideal,
    status: row.status,
    direction: row.status === "good" ? "up" : row.helpsWhenHigher ? "up" : "down",
    percentage: percentageForStatus(row.status, row.raw, row.ideal),
    explanation: row.explanation
  }));
}

interface ItemRules {
  requiredDryHours: number;
  rainLookAhead: number;
  humiditySensitivity: number;
  windNeed: number;
  heatSensitivity: number;
  uvSensitivity: number;
  dustSensitivity: number;
  dryingBase: string;
}

const rulesByType: Record<WashItemType, ItemRules> = {
  light_clothes: { requiredDryHours: 3, rainLookAhead: 6, humiditySensitivity: 1.0, windNeed: 1.0, heatSensitivity: 0.8, uvSensitivity: 0.5, dustSensitivity: 0.3, dryingBase: "2 a 4 horas" },
  heavy_clothes: { requiredDryHours: 5, rainLookAhead: 8, humiditySensitivity: 1.4, windNeed: 1.2, heatSensitivity: 0.8, uvSensitivity: 0.5, dustSensitivity: 0.4, dryingBase: "5 a 8 horas" },
  sneakers: { requiredDryHours: 5, rainLookAhead: 8, humiditySensitivity: 1.2, windNeed: 1.0, heatSensitivity: 0.7, uvSensitivity: 1.2, dustSensitivity: 0.5, dryingBase: "6 a 10 horas" },
  sheets: { requiredDryHours: 3, rainLookAhead: 6, humiditySensitivity: 1.0, windNeed: 1.2, heatSensitivity: 0.7, uvSensitivity: 0.5, dustSensitivity: 0.3, dryingBase: "2 a 5 horas" },
  towels: { requiredDryHours: 5, rainLookAhead: 8, humiditySensitivity: 1.5, windNeed: 1.2, heatSensitivity: 0.7, uvSensitivity: 0.5, dustSensitivity: 0.4, dryingBase: "5 a 9 horas" },
  quilts: { requiredDryHours: 7, rainLookAhead: 12, humiditySensitivity: 1.8, windNeed: 1.4, heatSensitivity: 0.7, uvSensitivity: 0.6, dustSensitivity: 0.5, dryingBase: "8 a 14 horas" },
  rugs: { requiredDryHours: 7, rainLookAhead: 12, humiditySensitivity: 1.8, windNeed: 1.4, heatSensitivity: 0.7, uvSensitivity: 0.6, dustSensitivity: 0.8, dryingBase: "8 a 16 horas" },
  curtains: { requiredDryHours: 4, rainLookAhead: 8, humiditySensitivity: 1.1, windNeed: 1.1, heatSensitivity: 0.6, uvSensitivity: 0.5, dustSensitivity: 0.5, dryingBase: "3 a 6 horas" },
  sofa_covers: { requiredDryHours: 6, rainLookAhead: 10, humiditySensitivity: 1.5, windNeed: 1.2, heatSensitivity: 0.7, uvSensitivity: 0.7, dustSensitivity: 0.5, dryingBase: "6 a 10 horas" },
  outdoor_textiles: { requiredDryHours: 5, rainLookAhead: 10, humiditySensitivity: 1.4, windNeed: 1.2, heatSensitivity: 0.8, uvSensitivity: 0.8, dustSensitivity: 0.6, dryingBase: "5 a 9 horas" },
  car: { requiredDryHours: 1, rainLookAhead: 6, humiditySensitivity: 0.3, windNeed: 0.2, heatSensitivity: 1.2, uvSensitivity: 1.5, dustSensitivity: 1.6, dryingBase: "30 a 90 minutos" },
  bike: { requiredDryHours: 1, rainLookAhead: 6, humiditySensitivity: 0.8, windNeed: 0.3, heatSensitivity: 0.7, uvSensitivity: 0.5, dustSensitivity: 0.9, dryingBase: "30 a 90 minutos" },
  motorcycle: { requiredDryHours: 1, rainLookAhead: 6, humiditySensitivity: 0.8, windNeed: 0.3, heatSensitivity: 0.8, uvSensitivity: 0.6, dustSensitivity: 1.0, dryingBase: "45 a 120 minutos" },
  scooter: { requiredDryHours: 1, rainLookAhead: 6, humiditySensitivity: 0.9, windNeed: 0.2, heatSensitivity: 0.7, uvSensitivity: 0.5, dustSensitivity: 0.8, dryingBase: "45 a 120 minutos" },
  toys: { requiredDryHours: 3, rainLookAhead: 6, humiditySensitivity: 1.0, windNeed: 0.8, heatSensitivity: 0.8, uvSensitivity: 0.9, dustSensitivity: 0.5, dryingBase: "2 a 5 horas" },
  plushies: { requiredDryHours: 6, rainLookAhead: 10, humiditySensitivity: 1.6, windNeed: 1.1, heatSensitivity: 0.7, uvSensitivity: 1.0, dustSensitivity: 0.5, dryingBase: "6 a 12 horas" },
  pet_beds: { requiredDryHours: 7, rainLookAhead: 12, humiditySensitivity: 1.8, windNeed: 1.2, heatSensitivity: 0.7, uvSensitivity: 0.7, dustSensitivity: 0.7, dryingBase: "8 a 14 horas" },
  backpacks: { requiredDryHours: 5, rainLookAhead: 8, humiditySensitivity: 1.3, windNeed: 0.9, heatSensitivity: 0.7, uvSensitivity: 1.0, dustSensitivity: 0.5, dryingBase: "5 a 10 horas" }
};

export function calculateWashRecommendation(itemType: WashItemType, data: WeatherData): WashRecommendation {
  const item = washItems.find((candidate) => candidate.type === itemType);
  if (!item) throw new Error(`Item no soportado: ${itemType}`);

  const rules = rulesByType[itemType];
  const point = currentPoint(data);
  const nextHours = getNextHourlyPoints(data, Math.max(12, rules.rainLookAhead));
  const aq = getAirQualityNow(data);
  const bestWindow = calculateBestWashWindow(data);

  const rainRisk = Math.max(...nextHours.slice(0, rules.rainLookAhead).map((hour) => hour.precipitationProbability ?? 0), 0);
  const humidity = point.humidity ?? data.forecast.current?.relative_humidity_2m ?? 70;
  const temperature = point.temperature ?? data.forecast.current?.temperature_2m ?? 16;
  const wind = point.windSpeed ?? data.forecast.current?.wind_speed_10m ?? 0;
  const gust = point.windGust ?? data.forecast.current?.wind_gusts_10m ?? wind;
  const cloud = point.cloudCover ?? data.forecast.current?.cloud_cover ?? 70;
  const uv = aq.uvIndex ?? point.uvIndex ?? 4;
  const aqi = aq.europeanAqi ?? 35;
  const dryHours = nextHours.filter((hour) => {
    const hourDate = new Date(hour.time).getHours();
    const day = hourDate >= 7 && hourDate <= 19;
    return day && (hour.precipitationProbability ?? 0) <= 35 && (hour.humidity ?? 100) <= 78;
  }).length;

  let score = 100;
  const reasons: string[] = [];
  const variables = new Set<string>();
  const warnings: string[] = [];

  function penalize(amount: number, reason: string, variable: string, warning?: string) {
    score -= amount;
    reasons.push(reason);
    variables.add(variable);
    if (warning) warnings.push(warning);
  }

  if (rainRisk > 45) penalize(36, `Hay riesgo de lluvia alto en las próximas ${rules.rainLookAhead} horas (${Math.round(rainRisk)}%).`, "Lluvia", "Evitá iniciar si no podés entrar lo lavado rápido.");
  else if (rainRisk > 20) penalize(16, `Hay algo de riesgo de lluvia (${Math.round(rainRisk)}%).`, "Lluvia");
  else reasons.push(`Riesgo de lluvia bajo (${Math.round(rainRisk)}%).`);

  if (humidity > 75) penalize(24 * rules.humiditySensitivity, `Humedad alta (${Math.round(humidity)}%) complica el secado.`, "Humedad", "Puede quedar olor a humedad si no seca completo.");
  else if (humidity >= 60) penalize(10 * rules.humiditySensitivity, `Humedad moderada (${Math.round(humidity)}%).`, "Humedad");
  else reasons.push(`Humedad favorable (${Math.round(humidity)}%).`);

  if (temperature < 12 || temperature > 34) penalize(18 * rules.heatSensitivity, `Temperatura fuera de rango cómodo (${Math.round(temperature)}°C).`, "Temperatura");
  else if (temperature < 18 || temperature > 30) penalize(7 * rules.heatSensitivity, `Temperatura aceptable pero no ideal (${Math.round(temperature)}°C).`, "Temperatura");
  else reasons.push(`Temperatura favorable (${Math.round(temperature)}°C).`);

  if (wind === 0 || wind > 35 || gust > 45) penalize(16 * rules.windNeed, `Viento desfavorable (${Math.round(wind)} km/h, ráfagas ${Math.round(gust)} km/h).`, "Viento", "Asegurá broches o evitá lavar vehículos con polvo/viento fuerte.");
  else if (wind < 8 || wind > 25) penalize(7 * rules.windNeed, `Viento aceptable pero no ideal (${Math.round(wind)} km/h).`, "Viento");
  else reasons.push(`Viento bueno para secar (${Math.round(wind)} km/h).`);

  if (cloud > 75) penalize(10, `Nubosidad alta (${Math.round(cloud)}%) reduce el secado.`, "Nubosidad");
  else if (cloud > 50) penalize(4, `Nubosidad media (${Math.round(cloud)}%).`, "Nubosidad");

  if (uv > 8) penalize(14 * rules.uvSensitivity, `Sol/UV muy fuerte (UV ${uv.toFixed(1)}).`, "Sol / UV", "Para ropa oscura, zapatillas o auto, preferí sombra o sol indirecto.");
  else if (uv < 2 && item.category !== "vehicle") penalize(5 * rules.uvSensitivity, `Poco sol disponible (UV ${uv.toFixed(1)}).`, "Sol / UV");

  if (aqi > 80) penalize(16 * rules.dustSensitivity, `Calidad de aire mala o partículas elevadas (AQI ${Math.round(aqi)}).`, "Calidad de aire", "Puede ensuciarse rápido con polvo o partículas.");
  else if (aqi > 40) penalize(8 * rules.dustSensitivity, `Calidad de aire moderada (AQI ${Math.round(aqi)}).`, "Calidad de aire");

  if (dryHours < rules.requiredDryHours) {
    penalize(18, `Hay solo ${dryHours} horas secas útiles y este caso necesita cerca de ${rules.requiredDryHours}.`, "Horas secas", "Si empezás tarde, puede quedar húmedo de noche.");
  } else {
    reasons.push(`Hay unas ${dryHours} horas útiles para secado.`);
  }

  if (item.category === "vehicle" && temperature > 30 && uv > 6) {
    penalize(12, "Para vehículos, el sol directo puede dejar marcas de agua o secar jabón demasiado rápido.", "Sol directo", "Lavá a la sombra o en primeras/últimas horas del día.");
  }

  if (["scooter", "bike", "motorcycle"].includes(itemType) && humidity > 75) {
    warnings.push("Secá bien cadenas, frenos, tornillería y partes metálicas. En monopatín, evitá mojar zonas eléctricas.");
  }

  score = Math.round(clamp(score));
  const status = statusFromScore(score);
  const label = labelFromStatus(status);
  const title = status === "good" ? `Sí, conviene lavar ${item.name.toLowerCase()}` : status === "caution" ? `Se puede lavar ${item.name.toLowerCase()}, pero con precaución` : `No conviene lavar ${item.name.toLowerCase()} ahora`;

  const recommendation = buildRecommendation(item, status, bestWindow.shouldWaitTomorrow, bestWindow.bestStart);

  return {
    score,
    status,
    label,
    title,
    reasons: reasons.slice(0, 5),
    variables: [...variables].slice(0, 5),
    recommendation,
    dryingTime: rules.dryingBase,
    warnings: [...new Set(warnings)].slice(0, 4)
  };
}

function buildRecommendation(item: WashItem, status: Status, shouldWaitTomorrow: boolean, bestStart?: string): string {
  const bestHour = bestStart ? new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" }).format(new Date(bestStart)) : "la próxima ventana favorable";

  if (status === "good") {
    if (item.category === "vehicle") return `Buen momento. Idealmente lavá en sombra o sol suave y terminá de secar antes de que cambie el viento.`;
    return `Aprovechá desde ${bestHour}. Colgá con separación entre prendas y priorizá las piezas más pesadas primero.`;
  }

  if (status === "caution") {
    return shouldWaitTomorrow
      ? "Se puede hacer, pero mañana parece mejor. Si lavás hoy, elegí prendas livianas o asegurá un plan B bajo techo."
      : "Se puede hacer con control: revisá lluvia próxima, usá broches y evitá empezar tarde con textiles pesados.";
  }

  return shouldWaitTomorrow
    ? "Mejor esperar. El pronóstico sugiere una ventana más favorable mañana."
    : "No lo recomiendo ahora. Esperá una ventana con menos humedad, menos lluvia o viento más estable.";
}

export function calculateAllRecommendations(data: WeatherData): Record<WashItemType, WashRecommendation> {
  return washItems.reduce((acc, item) => {
    acc[item.type] = calculateWashRecommendation(item.type, data);
    return acc;
  }, {} as Record<WashItemType, WashRecommendation>);
}

export function getGeneralStatusForHour(point: HourlyPoint): Status {
  let score = 100;
  const rain = point.precipitationProbability ?? 0;
  const humidity = point.humidity ?? 70;
  const temp = point.temperature ?? 15;
  const wind = point.windSpeed ?? 0;

  if (rain > 45) score -= 40;
  else if (rain > 20) score -= 18;
  if (humidity > 75) score -= 25;
  else if (humidity >= 60) score -= 10;
  if (temp < 12 || temp > 34) score -= 22;
  else if (temp < 18 || temp > 30) score -= 8;
  if (wind === 0 || wind > 35) score -= 18;
  else if (wind < 8 || wind > 25) score -= 7;

  return statusFromScore(score);
}

export function getGeneralStatusForDay(maxRain = 0, avgHumidity = 70, maxWind = 0, maxTemp = 20, minTemp = 12): Status {
  let score = 100;
  if (maxRain > 45) score -= 40;
  else if (maxRain > 20) score -= 18;
  if (avgHumidity > 75) score -= 24;
  else if (avgHumidity >= 60) score -= 10;
  if (maxWind === 0 || maxWind > 35) score -= 18;
  else if (maxWind < 8 || maxWind > 25) score -= 7;
  if (maxTemp < 12 || minTemp > 34) score -= 18;
  return statusFromScore(score);
}
