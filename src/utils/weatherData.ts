import type { DailyPoint, HourlyPoint, WeatherData } from "../types/weather";

export function getCurrentHourlyIndex(data: WeatherData): number {
  const hourly = data.forecast.hourly;
  if (!hourly?.time?.length) return 0;

  const currentTime = data.forecast.current?.time;
  if (currentTime) {
    const exact = hourly.time.findIndex((time) => time === currentTime);
    if (exact >= 0) return exact;
  }

  const now = Date.now();
  let bestIndex = 0;
  let bestDiff = Number.POSITIVE_INFINITY;
  hourly.time.forEach((time, index) => {
    const diff = Math.abs(new Date(time).getTime() - now);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = index;
    }
  });
  return bestIndex;
}

export function getHourlyPoint(data: WeatherData, index: number): HourlyPoint | null {
  const hourly = data.forecast.hourly;
  const time = hourly?.time?.[index];
  if (!hourly || !time) return null;

  const aqIndex = data.airQuality?.hourly?.time?.findIndex((aqTime) => aqTime === time) ?? -1;

  return {
    time,
    temperature: hourly.temperature_2m?.[index],
    humidity: hourly.relative_humidity_2m?.[index],
    dewPoint: hourly.dew_point_2m?.[index],
    precipitationProbability: hourly.precipitation_probability?.[index],
    precipitation: hourly.precipitation?.[index],
    rain: hourly.rain?.[index],
    weatherCode: hourly.weather_code?.[index],
    cloudCover: hourly.cloud_cover?.[index],
    windSpeed: hourly.wind_speed_10m?.[index],
    windGust: hourly.wind_gusts_10m?.[index],
    uvIndex: data.airQuality?.hourly?.uv_index?.[aqIndex] ?? hourly.uv_index?.[index]
  };
}

export function getNextHourlyPoints(data: WeatherData, count = 12): HourlyPoint[] {
  const start = getCurrentHourlyIndex(data);
  const points: HourlyPoint[] = [];
  for (let index = start; index < start + count; index += 1) {
    const point = getHourlyPoint(data, index);
    if (point) points.push(point);
  }
  return points;
}

export function getAirQualityNow(data: WeatherData): { pm10?: number; pm2_5?: number; dust?: number; europeanAqi?: number; uvIndex?: number } {
  const currentIndex = getCurrentHourlyIndex(data);
  const currentTime = data.forecast.hourly?.time?.[currentIndex];
  const aqHourly = data.airQuality?.hourly;
  const aqIndex = currentTime && aqHourly?.time ? aqHourly.time.findIndex((time) => time === currentTime) : -1;
  const safeIndex = aqIndex >= 0 ? aqIndex : 0;

  return {
    pm10: aqHourly?.pm10?.[safeIndex],
    pm2_5: aqHourly?.pm2_5?.[safeIndex],
    dust: aqHourly?.dust?.[safeIndex],
    europeanAqi: aqHourly?.european_aqi?.[safeIndex],
    uvIndex: aqHourly?.uv_index?.[safeIndex] ?? data.forecast.hourly?.uv_index?.[currentIndex]
  };
}

export function getDailyPoints(data: WeatherData): DailyPoint[] {
  const daily = data.forecast.daily;
  if (!daily?.time?.length) return [];

  return daily.time.map((date, index) => ({
    date,
    weatherCode: daily.weather_code?.[index],
    minTemp: daily.temperature_2m_min?.[index],
    maxTemp: daily.temperature_2m_max?.[index],
    precipitationProbabilityMax: daily.precipitation_probability_max?.[index],
    precipitationSum: daily.precipitation_sum?.[index],
    rainSum: daily.rain_sum?.[index],
    windSpeedMax: daily.wind_speed_10m_max?.[index],
    avgHumidity: averageHumidityForDate(data, date)
  }));
}

function averageHumidityForDate(data: WeatherData, dateKey: string): number | undefined {
  const hourly = data.forecast.hourly;
  if (!hourly?.time?.length || !hourly.relative_humidity_2m?.length) return undefined;

  const values = hourly.time
    .map((time, index) => ({ time, humidity: hourly.relative_humidity_2m?.[index] }))
    .filter((point): point is { time: string; humidity: number } => point.time.startsWith(dateKey) && typeof point.humidity === "number")
    .map((point) => point.humidity);

  if (!values.length) return undefined;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
