export function formatDateTime(dateLike: string | Date, timezone?: string): string {
  const date = typeof dateLike === "string" ? new Date(dateLike) : dateLike;
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone
  }).format(date);
}

export function formatHour(dateLike: string | Date, timezone?: string): string {
  const date = typeof dateLike === "string" ? new Date(dateLike) : dateLike;
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone
  }).format(date);
}

export function formatDay(dateLike: string | Date, timezone?: string): string {
  const date = typeof dateLike === "string" ? new Date(dateLike) : dateLike;
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: timezone
  }).format(date);
}

export function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMin = Math.max(0, Math.round(diffMs / 60000));
  if (diffMin < 1) return "recién";
  if (diffMin === 1) return "hace 1 minuto";
  if (diffMin < 60) return `hace ${diffMin} minutos`;
  const hours = Math.round(diffMin / 60);
  if (hours === 1) return "hace 1 hora";
  return `hace ${hours} horas`;
}

export function toLocalDateKey(dateLike: string | Date): string {
  const date = typeof dateLike === "string" ? new Date(dateLike) : dateLike;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
