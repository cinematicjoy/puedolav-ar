import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
  NOTIFICATION_BASE_URL
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
}

if (SUPABASE_URL.includes("/rest/v1") || SUPABASE_URL.includes("/auth/v1")) {
  throw new Error(
    "SUPABASE_URL debe ser la URL base del proyecto, No debe incluir /rest/v1 ni /auth/v1."
  );
}

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  throw new Error("Faltan VAPID_PUBLIC_KEY o VAPID_PRIVATE_KEY.");
}

const baseUrl = NOTIFICATION_BASE_URL ?? "https://cinematicjoy.github.io/puedolav-ar/";

webpush.setVapidDetails(
  "mailto:puedolav.ar@gmail.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function isRecentlyNotified(lastNotifiedAt) {
  if (!lastNotifiedAt) return false;

  const lastTime = new Date(lastNotifiedAt).getTime();
  const sixHours = 6 * 60 * 60 * 1000;

  return Date.now() - lastTime < sixHours;
}

function calculateGoodConditions(current) {
  const rainProbability = Number(current.precipitation_probability ?? 100);
  const humidity = Number(current.relative_humidity_2m ?? 100);
  const temperature = Number(current.temperature_2m ?? 0);
  const wind = Number(current.wind_speed_10m ?? 0);
  const cloudCover = Number(current.cloud_cover ?? 100);

  const checks = {
    rain: rainProbability <= 20,
    humidity: humidity <= 65,
    temperature: temperature >= 12 && temperature <= 32,
    wind: wind >= 6 && wind <= 28,
    cloudCover: cloudCover <= 75
  };

  const passed = Object.values(checks).filter(Boolean).length;

  return {
    isGood: passed >= 4 && checks.rain,
    passed,
    checks,
    rainProbability,
    humidity,
    temperature,
    wind,
    cloudCover
  };
}

async function getWeather(latitude, longitude, timezone) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "precipitation_probability",
      "cloud_cover",
      "wind_speed_10m"
    ].join(","),
    timezone: timezone || "auto",
    forecast_days: "1"
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Open-Meteo respondió ${response.status}`);
  }

  return response.json();
}

async function sendNotification(subscription, weatherResult) {
  const payload = {
    title: "Buen momento para lavar",
    body: `Condiciones favorables: ${Math.round(weatherResult.temperature)}°C, lluvia ${Math.round(weatherResult.rainProbability)}%, humedad ${Math.round(weatherResult.humidity)}%.`,
    url: baseUrl,
    icon: `${baseUrl}icons/icon-192.png`,
    badge: `${baseUrl}icons/icon-192.png`
  };

  await webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth
      }
    },
    JSON.stringify(payload)
  );
}

async function main() {
  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("enabled", true);

  if (error) {
    throw error;
  }

  console.log(`Suscripciones activas: ${subscriptions.length}`);

  for (const subscription of subscriptions) {
    try {
      const weather = await getWeather(
        subscription.latitude,
        subscription.longitude,
        subscription.timezone
      );

      const weatherResult = calculateGoodConditions(weather.current);
      const previousStatus = subscription.last_status;
      const currentStatus = weatherResult.isGood ? "good" : "not_good";

      const shouldNotify =
        currentStatus === "good" &&
        previousStatus !== "good" &&
        !isRecentlyNotified(subscription.last_notified_at);

      if (shouldNotify) {
        await sendNotification(subscription, weatherResult);

        await supabase
          .from("push_subscriptions")
          .update({
            last_status: currentStatus,
            last_checked_at: new Date().toISOString(),
            last_notified_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("id", subscription.id);

        console.log(`Notificación enviada: ${subscription.id}`);
      } else {
        await supabase
          .from("push_subscriptions")
          .update({
            last_status: currentStatus,
            last_checked_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("id", subscription.id);

        console.log(`Sin notificar: ${subscription.id} estado=${currentStatus}`);
      }
    } catch (error) {
      console.error(`Error en suscripción ${subscription.id}`, error);

      if (error.statusCode === 404 || error.statusCode === 410) {
        await supabase
          .from("push_subscriptions")
          .update({
            enabled: false,
            updated_at: new Date().toISOString()
          })
          .eq("id", subscription.id);

        console.log(`Suscripción desactivada: ${subscription.id}`);
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});