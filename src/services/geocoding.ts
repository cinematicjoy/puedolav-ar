import type { LocationOption } from "../types/weather";

interface OpenMeteoGeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1_id?: number;
  admin2_id?: number;
  admin3_id?: number;
  admin4_id?: number;
  timezone?: string;
  population?: number;
  country?: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
  postcodes?: string[];
}

interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoGeocodingResult[];
  generationtime_ms?: number;
}

export async function searchLocations(query: string): Promise<LocationOption[]> {
  const cleanQuery = query.trim();
  if (cleanQuery.length < 2) return [];

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", cleanQuery);
  url.searchParams.set("count", "10");
  url.searchParams.set("language", "es");
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("No pudimos buscar esa ubicación. Probá con ciudad o localidad.");
  }

  const json = (await response.json()) as OpenMeteoGeocodingResponse;
  return (json.results ?? []).map((place) => ({
    id: String(place.id),
    name: place.name,
    latitude: place.latitude,
    longitude: place.longitude,
    country: place.country,
    countryCode: place.country_code,
    admin1: place.admin1,
    admin2: place.admin2,
    admin3: place.admin3,
    timezone: place.timezone,
    postalCode: place.postcodes?.[0],
    source: "manual"
  }));
}

export function locationFromCoordinates(latitude: number, longitude: number): LocationOption {
  return {
    id: `gps-${latitude.toFixed(4)}-${longitude.toFixed(4)}`,
    name: "Ubicación detectada por GPS",
    latitude,
    longitude,
    source: "gps"
  };
}
