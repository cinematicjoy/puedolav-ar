import type { ForecastApiResponse, LocationOption } from "../types/weather";

const currentVariables = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "precipitation",
  "rain",
  "weather_code",
  "cloud_cover",
  "wind_speed_10m",
  "wind_gusts_10m"
];

const hourlyVariables = [
  "temperature_2m",
  "relative_humidity_2m",
  "dew_point_2m",
  "precipitation_probability",
  "precipitation",
  "rain",
  "weather_code",
  "cloud_cover",
  "wind_speed_10m",
  "wind_gusts_10m",
  "uv_index"
];

const dailyVariables = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_probability_max",
  "precipitation_sum",
  "rain_sum",
  "wind_speed_10m_max"
];

export async function fetchForecast(location: LocationOption): Promise<ForecastApiResponse> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(location.latitude));
  url.searchParams.set("longitude", String(location.longitude));
  url.searchParams.set("current", currentVariables.join(","));
  url.searchParams.set("hourly", hourlyVariables.join(","));
  url.searchParams.set("daily", dailyVariables.join(","));
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("wind_speed_unit", "kmh");

  const response = await fetch(url.toString());
  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message || "Open-Meteo no respondió correctamente.");
  }

  return (await response.json()) as ForecastApiResponse;
}

async function safeErrorMessage(response: Response): Promise<string | null> {
  try {
    const json = (await response.json()) as { reason?: string; error?: boolean };
    return json.reason ?? null;
  } catch {
    return null;
  }
}
