import { useEffect, useState } from "react";
import type { WeatherData } from "../types/weather";
import { supabase } from "../lib/supabase";

interface WashPushToggleProps {
  data: WeatherData;
  variant?: "home" | "modal";
  hideAfterDecision?: boolean;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

function getPushSupportError() {
  if (!("serviceWorker" in navigator)) {
    return "Este navegador no soporta service worker.";
  }

  if (!("PushManager" in window)) {
    return "Este navegador no soporta notificaciones push.";
  }

  if (!("Notification" in window)) {
    return "Este navegador no soporta notificaciones.";
  }

  return null;
}

export function WashPushToggle({
  data,
  variant = "home",
  hideAfterDecision = false
}: WashPushToggleProps) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [dismissedFromHome, setDismissedFromHome] = useState(() => {
  if (variant !== "home") return false;
  return localStorage.getItem("puedolav:push-home-dismissed") === "true";
});

  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

  useEffect(() => {
    async function checkExistingSubscription() {
      const supportError = getPushSupportError();

      if (supportError) return;

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      setEnabled(Boolean(subscription));
    }

    checkExistingSubscription().catch(() => {
      setEnabled(false);
    });
  }, []);

  async function enableNotifications() {
    setLoading(true);
    setMessage(null);

    if (hideAfterDecision) {
        localStorage.setItem("puedolav:push-home-dismissed", "true");
        setDismissedFromHome(true);
        }

    try {
      const supportError = getPushSupportError();

      if (supportError) {
        setMessage(supportError);
        return;
      }

      if (!supabase) {
        setMessage("Falta configurar Supabase.");
        return;
      }

      if (!vapidPublicKey) {
        setMessage("Falta configurar la clave pública VAPID.");
        return;
      }

      const permission = await Notification.requestPermission();

        if (permission !== "granted") {
        setMessage("No se activaron las notificaciones porque no se otorgó el permiso.");

        if (hideAfterDecision) {
            localStorage.setItem("puedolav:push-home-dismissed", "true");
            setDismissedFromHome(true);
        }

        return;
        }

      const registration = await navigator.serviceWorker.ready;

      const existingSubscription = await registration.pushManager.getSubscription();

      const subscription =
        existingSubscription ??
        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });

      const subscriptionJson = subscription.toJSON();

      const p256dh = subscriptionJson.keys?.p256dh;
      const auth = subscriptionJson.keys?.auth;

      if (!subscription.endpoint || !p256dh || !auth) {
        setMessage("No se pudo generar la suscripción push.");
        return;
      }

      const { error } = await supabase.rpc("register_push_subscription", {
        p_endpoint: subscription.endpoint,
        p_p256dh: p256dh,
        p_auth: auth,
        p_latitude: data.location.latitude,
        p_longitude: data.location.longitude,
        p_timezone: data.forecast.timezone ?? data.location.timezone ?? null
      });

      if (error) {
        console.error(error);
        setMessage("No pudimos guardar la suscripción.");
        return;
      }

      setEnabled(true);
      setMessage("Listo. Te avisaremos cuando las condiciones sean buenas para lavar.");
    } catch (error) {
      console.error(error);
      setMessage("No se pudieron activar las notificaciones.");
    } finally {
      setLoading(false);
    }
  }

  async function disableNotifications() {
    setLoading(true);
    setMessage(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }

      setEnabled(false);
      setMessage("Notificaciones desactivadas en este dispositivo.");
    } catch (error) {
      console.error(error);
      setMessage("No se pudieron desactivar las notificaciones.");
    } finally {
      setLoading(false);
    }
  }

  if (variant === "home" && dismissedFromHome) {
    return null;
    }

  return (
    <section className={`push-toggle-panel push-toggle-panel--${variant}`}>
      <div>
        <strong>
            {variant === "modal"
                ? "Notificaciones de lavado"
                : "Avisarme cuando convenga lavar"}
            </strong>

            <p>
            {variant === "modal"
                ? "Activá o desactivá los avisos cuando el clima pase a estar favorable."
                : "Recibí una notificación cuando el clima pase a estar favorable."}
            </p>
        {message ? <small>{message}</small> : null}
      </div>

      <button
        type="button"
        onClick={enabled ? disableNotifications : enableNotifications}
        disabled={loading}
      >
        {loading
          ? "Procesando..."
          : enabled
            ? "Desactivar"
            : "Activar aviso"}
      </button>
    </section>
  );
}