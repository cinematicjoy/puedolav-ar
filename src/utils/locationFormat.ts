import type { LocationOption } from "../types/weather";

export function formatLocation(location: LocationOption): string {
  const parts = [
    location.name,
    location.admin3,
    location.admin2,
    location.admin1,
    location.country
  ].filter(Boolean);

  const unique = [...new Set(parts)];
  if (unique.length > 0) return unique.join(", ");

  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
}

export function formatLocationDetails(location: LocationOption): string[] {
  const details = [
    location.postalCode ? `CP ${location.postalCode}` : undefined,
    location.timezone ? `Zona horaria: ${location.timezone}` : undefined,
    `Lat ${location.latitude.toFixed(4)} · Lon ${location.longitude.toFixed(4)}`
  ];
  return details.filter(Boolean) as string[];
}
