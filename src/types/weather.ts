export interface LocationOption {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  countryCode?: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  timezone?: string;
  postalCode?: string;
  source: "gps" | "manual" | "cached";
}

export interface ForecastCurrent {
  time: string;
  interval?: number;
  temperature_2m?: number;
  relative_humidity_2m?: number;
  apparent_temperature?: number;
  precipitation?: number;
  rain?: number;
  weather_code?: number;
  cloud_cover?: number;
  wind_speed_10m?: number;
  wind_gusts_10m?: number;
}

export interface ForecastHourly {
  time: string[];
  temperature_2m?: number[];
  relative_humidity_2m?: number[];
  dew_point_2m?: number[];
  precipitation_probability?: number[];
  precipitation?: number[];
  rain?: number[];
  weather_code?: number[];
  cloud_cover?: number[];
  wind_speed_10m?: number[];
  wind_gusts_10m?: number[];
  uv_index?: number[];
}

export interface ForecastDaily {
  time: string[];
  weather_code?: number[];
  temperature_2m_max?: number[];
  temperature_2m_min?: number[];
  precipitation_probability_max?: number[];
  precipitation_sum?: number[];
  rain_sum?: number[];
  wind_speed_10m_max?: number[];
}

export interface ForecastApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms?: number;
  utc_offset_seconds?: number;
  timezone?: string;
  timezone_abbreviation?: string;
  elevation?: number;
  current?: ForecastCurrent;
  hourly?: ForecastHourly;
  daily?: ForecastDaily;
}

export interface AirQualityHourly {
  time: string[];
  pm10?: number[];
  pm2_5?: number[];
  dust?: number[];
  uv_index?: number[];
  european_aqi?: number[];
}

export interface AirQualityApiResponse {
  latitude: number;
  longitude: number;
  timezone?: string;
  hourly?: AirQualityHourly;
}

export interface WeatherData {
  location: LocationOption;
  forecast: ForecastApiResponse;
  airQuality?: AirQualityApiResponse;
  fetchedAt: string;
  fromCache?: boolean;
  offline?: boolean;
}

export interface HourlyPoint {
  time: string;
  temperature?: number;
  humidity?: number;
  dewPoint?: number;
  precipitationProbability?: number;
  precipitation?: number;
  rain?: number;
  weatherCode?: number;
  cloudCover?: number;
  windSpeed?: number;
  windGust?: number;
  uvIndex?: number;
}

export interface DailyPoint {
  date: string;
  weatherCode?: number;
  minTemp?: number;
  maxTemp?: number;
  precipitationProbabilityMax?: number;
  precipitationSum?: number;
  rainSum?: number;
  windSpeedMax?: number;
  avgHumidity?: number;
}
