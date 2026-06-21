import { useEffect, useState } from "react";

export type AppRoute = "home" | "privacy" | "support";

function getCurrentRoute(): AppRoute {
  const hash = window.location.hash.replace("#", "");

  if (hash === "/privacidad") return "privacy";
  if (hash === "/soporte") return "support";

  return "home";
}

export function useHashRoute() {
  const [route, setRoute] = useState<AppRoute>(() => getCurrentRoute());

  useEffect(() => {
    function handleHashChange() {
      setRoute(getCurrentRoute());
    }

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  function navigate(routeToGo: AppRoute) {
    if (routeToGo === "home") {
      window.location.hash = "/";
      setRoute("home");
      return;
    }

    if (routeToGo === "privacy") {
      window.location.hash = "/privacidad";
      return;
    }

    if (routeToGo === "support") {
      window.location.hash = "/soporte";
    }
  }

  return { route, navigate };
}