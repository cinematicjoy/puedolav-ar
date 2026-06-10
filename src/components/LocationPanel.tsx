import { FormEvent, useState } from "react";
import type { LocationOption } from "../types/weather";

interface LocationPanelProps {
  geolocationLoading: boolean;
  geolocationError: string | null;
  searchLoading: boolean;
  searchError: string | null;
  results: LocationOption[];
  onUseMyLocation: () => void;
  onSearch: (query: string) => void;
  onSelect: (location: LocationOption) => void;
}

export function LocationPanel({
  geolocationLoading,
  geolocationError,
  searchLoading,
  searchError,
  results,
  onUseMyLocation,
  onSearch,
  onSelect
}: LocationPanelProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(query);
  }

  return (
    <section className="panel location-panel">
      <div className="panel-heading">
        <p className="eyebrow">Ubicación</p>
        <h2>¿Desde dónde querés consultar?</h2>
        <p>Para mayor precisión, usá ubicación actual. Si no, ingresá localidad, ciudad o código postal.</p>
      </div>

      <button className="primary-button" type="button" onClick={onUseMyLocation} disabled={geolocationLoading}>
        {geolocationLoading ? "Detectando ubicación..." : "Usar mi ubicación"}
      </button>

      {geolocationError ? <p className="inline-warning">{geolocationError}</p> : null}

      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="location-search">Código postal, ciudad o localidad</label>
        <div className="search-row">
          <input
            id="location-search"
            type="search"
            placeholder="Ej: Palermo, CABA, Córdoba, 5000"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="secondary-button" type="submit" disabled={searchLoading || query.trim().length < 2}>
            {searchLoading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </form>

      {searchError ? <p className="inline-warning">{searchError}</p> : null}

      {results.length > 0 ? (
        <div className="location-results">
          <h3>Elegí una coincidencia</h3>
          {results.map((location) => (
            <button key={location.id} className="location-result" type="button" onClick={() => onSelect(location)}>
              <strong>{location.name}</strong>
              <span>{[location.admin2, location.admin1, location.country, location.postalCode ? `CP ${location.postalCode}` : undefined].filter(Boolean).join(" · ")}</span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
