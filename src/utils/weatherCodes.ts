export function getWeatherDescription(code?: number): string {
  if (code === undefined) return "Clima sin clasificar";

  const map: Record<number, string> = {
    0: "Despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna leve",
    53: "Llovizna moderada",
    55: "Llovizna intensa",
    56: "Llovizna helada leve",
    57: "Llovizna helada intensa",
    61: "Lluvia leve",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    66: "Lluvia helada leve",
    67: "Lluvia helada intensa",
    71: "Nieve leve",
    73: "Nieve moderada",
    75: "Nieve intensa",
    77: "Granos de nieve",
    80: "Chaparrones leves",
    81: "Chaparrones moderados",
    82: "Chaparrones fuertes",
    85: "Nevadas leves",
    86: "Nevadas fuertes",
    95: "Tormenta",
    96: "Tormenta con granizo leve",
    99: "Tormenta con granizo fuerte"
  };

  return map[code] ?? "Clima variable";
}

export function isRainCode(code?: number): boolean {
  return code !== undefined && ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95);
}

export function isNightTime(date = new Date()): boolean {
  const hour = date.getHours();
  return hour < 7 || hour >= 20;
}

export function getWeatherTheme(weatherCode?: number, isNight = false, temperature?: number): string {
  if (isNight) return "weather-night";
  if (weatherCode !== undefined && weatherCode >= 95) return "weather-storm";
  if (weatherCode !== undefined && isRainCode(weatherCode)) return "weather-rain";
  if (temperature !== undefined && temperature >= 32) return "weather-hot";
  if (temperature !== undefined && temperature <= 8) return "weather-cold";
  if (weatherCode === 0 || weatherCode === 1) return "weather-clear";
  if (weatherCode === 2) return "weather-partly-cloudy";
  if (weatherCode === 3 || weatherCode === 45 || weatherCode === 48) return "weather-cloudy";
  return "weather-default";
}
