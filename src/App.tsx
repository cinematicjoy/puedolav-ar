import { useEffect, useMemo, useState } from "react";
import { AdFooter } from "./components/AdFooter";
import { BestWindowPanel } from "./components/BestWindowPanel";
import { CreditsModal } from "./components/CreditsModal";
import { ErrorState } from "./components/ErrorState";
import { ForecastSection } from "./components/ForecastSection";
import { Header } from "./components/Header";
import { LoadingState } from "./components/LoadingState";
import { LocationInfo } from "./components/LocationInfo";
import { LocationPanel } from "./components/LocationPanel";
import { WashItemGrid } from "./components/WashItemGrid";
import { WeatherVariables } from "./components/WeatherVariables";
import { useGeolocation } from "./hooks/useGeolocation";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useThemeMode } from "./hooks/useThemeMode";
import { useWeather } from "./hooks/useWeather";
import { searchLocations } from "./services/geocoding";
import type { LocationOption } from "./types/weather";
import { calculateAllRecommendations, evaluateWeatherVariables } from "./utils/scoring";
import { getDailyPoints, getNextHourlyPoints } from "./utils/weatherData";
import { getWeatherTheme, isNightTime } from "./utils/weatherCodes";
import { calculateBestWashWindow } from "./utils/washWindow";
import { useCollapsedSections } from "./hooks/useCollapsedSections";
import { MainWashSummary } from "./components/MainWashSummary";
import { InstallAppButton } from "./components/InstallAppButton";
import { LegalLinks } from "./components/LegalLinks";
import { PrivacyPage } from "./components/PrivacyPage";
import { SupportPage } from "./components/SupportPage";
import { useHashRoute } from "./hooks/useHashRoute";
import { WashPushToggle } from "./components/WashPushToggle";

function App() {
  const { mode, resolvedMode, setMode } = useThemeMode();
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [location, setLocation, removeLocation] = useLocalStorage<LocationOption | null>("lastLocation", null);
  const geolocation = useGeolocation();
  const weather = useWeather(location);
  const [autoLocationAttempted, setAutoLocationAttempted] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<LocationOption[]>([]);
  const { route, navigate } = useHashRoute();
  const {
  collapsedSections,
  isCompactMode,
  setSectionCollapsed,
  toggleCompactMode
} = useCollapsedSections();

  useEffect(() => {
    if (!location && !autoLocationAttempted) {
      setAutoLocationAttempted(true);
      void handleUseMyLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, autoLocationAttempted]);

  async function handleUseMyLocation() {
    try {
      const gpsLocation = await geolocation.requestLocation();
      setLocation(gpsLocation);
      setSearchResults([]);
    } catch {
      // El mensaje ya se muestra desde el hook. La búsqueda manual queda disponible.
    }
  }

  async function handleSearch(query: string) {
    const cleanQuery = query.trim();
    if (cleanQuery.length < 2) return;
    setSearchLoading(true);
    setSearchError(null);
    try {
      const results = await searchLocations(cleanQuery);
      setSearchResults(results);
      if (!results.length) {
        setSearchError("No encontramos esa ubicación. Probá con ciudad + provincia, por ejemplo: Palermo CABA o Córdoba Argentina.");
      }
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "No pudimos buscar la ubicación.");
    } finally {
      setSearchLoading(false);
    }
  }

  function handleChangeLocation() {
    removeLocation();
    setSearchResults([]);
    setSearchError(null);
    setAutoLocationAttempted(true);
  }

  const weatherTheme = useMemo(() => {
    const current = weather.data?.forecast.current;
    return getWeatherTheme(current?.weather_code, isNightTime(), current?.temperature_2m);
  }, [weather.data]);

  const variables = useMemo(() => (weather.data ? evaluateWeatherVariables(weather.data) : []), [weather.data]);
  const recommendations = useMemo(() => (weather.data ? calculateAllRecommendations(weather.data) : null), [weather.data]);
  const bestWindow = useMemo(() => (weather.data ? calculateBestWashWindow(weather.data) : null), [weather.data]);
  const nextHours = useMemo(() => (weather.data ? getNextHourlyPoints(weather.data, 12) : []), [weather.data]);
  const nextDays = useMemo(() => (weather.data ? getDailyPoints(weather.data).slice(0, 7) : []), [weather.data]);

  if (route === "privacy") {
    return (
      <div className={`app-shell theme-${resolvedMode}`}>
        <Header
          themeMode={mode}
          resolvedThemeMode={resolvedMode}
          weatherCode={weather.data?.forecast.current?.weather_code}
          onThemeChange={setMode}
          onOpenCredits={() => setCreditsOpen(true)}
          compactMode={isCompactMode}
          onToggleCompactMode={toggleCompactMode}
        />
        <PrivacyPage onBack={() => navigate("home")} />
        <CreditsModal
          open={creditsOpen}
          onClose={() => setCreditsOpen(false)}
          onPrivacy={() => navigate("privacy")}
          onSupport={() => navigate("support")}
          notificationControl={
            weather.data ? (
              <WashPushToggle
                data={weather.data}
                variant="modal"
              />
            ) : null
          }
        />
      </div>
    );
  }

  if (route === "support") {
    return (
      <div className={`app-shell theme-${resolvedMode}`}>
        <Header
          themeMode={mode}
          resolvedThemeMode={resolvedMode}
          weatherCode={weather.data?.forecast.current?.weather_code}
          onThemeChange={setMode}
          onOpenCredits={() => setCreditsOpen(true)}
          compactMode={isCompactMode}
          onToggleCompactMode={toggleCompactMode}
        />
        <SupportPage onBack={() => navigate("home")} />
        <CreditsModal
          open={creditsOpen}
          onClose={() => setCreditsOpen(false)}
          onPrivacy={() => navigate("privacy")}
          onSupport={() => navigate("support")}
          notificationControl={
            weather.data ? (
              <WashPushToggle
                data={weather.data}
                variant="modal"
              />
            ) : null
          }
        />
      </div>
    );
  }

  return (
    <div className={`app-shell ${weatherTheme}`}>
    <Header
      themeMode={mode}
      resolvedThemeMode={resolvedMode}
      weatherCode={weather.data?.forecast.current?.weather_code}
      onThemeChange={setMode}
      onOpenCredits={() => setCreditsOpen(true)}
      compactMode={isCompactMode}
      onToggleCompactMode={toggleCompactMode}
    />
      <main className="app-main">
        {!location ? (
          <LocationPanel
            geolocationLoading={geolocation.loading}
            geolocationError={geolocation.error}
            searchLoading={searchLoading}
            searchError={searchError}
            results={searchResults}
            onUseMyLocation={handleUseMyLocation}
            onSearch={handleSearch}
            onSelect={(nextLocation) => setLocation(nextLocation)}
          />
        ) : null}

        {location && weather.loading && !weather.data ? <LoadingState message="Consultando clima real y pronóstico horario..." /> : null}
        {location && weather.error ? <ErrorState message={weather.error} onRetry={weather.refresh} /> : null}

        {weather.data && recommendations && bestWindow ? (
          <>

            <InstallAppButton />

            <MainWashSummary
              recommendations={recommendations}
              variables={variables}
              bestWindow={bestWindow}
            />

            <WashPushToggle
              data={weather.data}
              variant="home"
              hideAfterDecision
            />

            <LocationInfo
              data={weather.data}
              onRefresh={weather.refresh}
              onChangeLocation={handleChangeLocation}
              loading={weather.loading}
              collapsed={collapsedSections.currentWeather}
              onToggleCollapsed={() =>
                setSectionCollapsed("currentWeather", !collapsedSections.currentWeather)
              }
            />

            <WeatherVariables
              variables={variables}
              collapsed={collapsedSections.trafficLight}
              onToggleCollapsed={() =>
                setSectionCollapsed("trafficLight", !collapsedSections.trafficLight)
              }
            />

            <WashItemGrid
              recommendations={recommendations}
              detailCollapsed={collapsedSections.categoryDetail}
              onToggleDetailCollapsed={() =>
                setSectionCollapsed("categoryDetail", !collapsedSections.categoryDetail)
              }
            />

            <BestWindowPanel window={bestWindow} />
            <ForecastSection hours={nextHours} days={nextDays} />
            
          </>
        ) : null}
      </main>
      <AdFooter />
      <CreditsModal
        open={creditsOpen}
        onClose={() => setCreditsOpen(false)}
        onPrivacy={() => navigate("privacy")}
        onSupport={() => navigate("support")}
        notificationControl={
          weather.data ? (
            <WashPushToggle
              data={weather.data}
              variant="modal"
            />
          ) : null
        }
      />
    </div>
  );
}

export default App;
