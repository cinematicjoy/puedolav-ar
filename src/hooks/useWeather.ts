import { useCallback, useEffect, useState } from "react";
import { fetchAirQuality } from "../services/airQuality";
import { fetchForecast } from "../services/openMeteo";
import type { LocationOption, WeatherData } from "../types/weather";

const CACHE_KEY = "lastWeatherData";

interface UseWeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useWeather(location: LocationOption | null): UseWeatherState {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCached = useCallback((): WeatherData | null => {
    try {
      const raw = window.localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as WeatherData;
    } catch {
      return null;
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    setError(null);

    if (!navigator.onLine) {
      const cached = loadCached();
      if (cached) {
        setData({ ...cached, fromCache: true, offline: true });
        setError("Sin conexión. Mostrando últimos datos guardados.");
      } else {
        setError("Sin conexión y sin datos guardados. Conectate a internet para consultar el clima.");
      }
      setLoading(false);
      return;
    }

    try {
      const [forecast, airQualityResult] = await Promise.allSettled([fetchForecast(location), fetchAirQuality(location)]);

      if (forecast.status === "rejected") throw forecast.reason;

      const nextData: WeatherData = {
        location: {
          ...location,
          timezone: location.timezone ?? forecast.value.timezone
        },
        forecast: forecast.value,
        airQuality: airQualityResult.status === "fulfilled" ? airQualityResult.value : undefined,
        fetchedAt: new Date().toISOString()
      };

      setData(nextData);
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(nextData));
      if (airQualityResult.status === "rejected") {
        setError("No llegó calidad de aire. La recomendación usa el resto del pronóstico.");
      }
    } catch (error) {
      const cached = loadCached();
      if (cached) {
        setData({ ...cached, fromCache: true });
        setError("No pudimos actualizar el clima. Mostrando últimos datos guardados.");
      } else {
        setError(error instanceof Error ? error.message : "No pudimos obtener el clima. Probá nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  }, [loadCached, location]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
