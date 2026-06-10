import type { AirQualityApiResponse, LocationOption } from "../types/weather";

const hourlyVariables = ["pm10", "pm2_5", "dust", "uv_index", "european_aqi"];

export async function fetchAirQuality(location: LocationOption): Promise<AirQualityApiResponse> {
  const url = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  url.searchParams.set("latitude", String(location.latitude));
  url.searchParams.set("longitude", String(location.longitude));
  url.searchParams.set("hourly", hourlyVariables.join(","));
  url.searchParams.set("forecast_days", "2");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("No pudimos obtener calidad de aire. Seguimos con el pronóstico climático.");
  }

  return (await response.json()) as AirQualityApiResponse;
}
