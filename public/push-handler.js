self.addEventListener("push", (event) => {
  let payload = {
    title: "Buen momento para lavar",
    body: "Las condiciones acompañan. Aprovechá mientras el clima ayuda.",
    url: "/puedolav-ar/",
    icon: "/puedolav-ar/icons/notification-default.svg",
    badge: "/puedolav-ar/icons/notification-badge.svg"
  };

  if (event.data) {
    try {
      payload = {
        ...payload,
        ...event.data.json()
      };
    } catch {
      payload.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon,
      badge: payload.badge,
      data: {
        url: payload.url
      },
      tag: "wash-good-conditions",
      renotify: false
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/puedolav-ar/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.focus();
          return;
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});