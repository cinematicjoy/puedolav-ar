import { useCallback, useState } from "react";
import { locationFromCoordinates } from "../services/geocoding";
import type { LocationOption } from "../types/weather";

interface UseGeolocationResult {
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<LocationOption>;
}

export function useGeolocation(): UseGeolocationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    setError(null);

    if (!navigator.geolocation) {
      const message = "Tu navegador no permite detectar ubicación. Ingresá una localidad o código postal.";
      setError(message);
      throw new Error(message);
    }

    setLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000 * 60 * 10
        });
      });

      return locationFromCoordinates(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      const message = geolocationErrorMessage(error);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, requestLocation };
}

function geolocationErrorMessage(error: unknown): string {
  const code = typeof error === "object" && error !== null && "code" in error ? Number((error as { code: number }).code) : undefined;
  if (code === 1) {
    return "No pudimos detectar tu ubicación porque rechazaste el permiso. Ingresá tu código postal o localidad.";
  }
  if (code === 2) {
    return "No se pudo obtener tu ubicación actual. Probá buscando por localidad.";
  }
  if (code === 3) {
    return "La ubicación tardó demasiado. Probá buscando por localidad o código postal.";
  }
  return "No pudimos detectar tu ubicación. Ingresá tu código postal o localidad para consultar el clima.";
}
