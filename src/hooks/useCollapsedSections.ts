import { useEffect, useMemo, useState } from "react";

export type CollapsedSectionKey =
  | "currentWeather"
  | "trafficLight"
  | "categoryDetail";

export interface CollapsedSections {
  currentWeather: boolean;
  trafficLight: boolean;
  categoryDetail: boolean;
}

const STORAGE_KEY = "puedolav-collapsed-sections-v1";

const DEFAULT_COLLAPSED_SECTIONS: CollapsedSections = {
  currentWeather: false,
  trafficLight: false,
  categoryDetail: false
};

function isValidCollapsedSections(value: unknown): value is CollapsedSections {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<CollapsedSections>;

  return (
    typeof candidate.currentWeather === "boolean" &&
    typeof candidate.trafficLight === "boolean" &&
    typeof candidate.categoryDetail === "boolean"
  );
}

function readCollapsedSections(): CollapsedSections {
  if (typeof window === "undefined") {
    return DEFAULT_COLLAPSED_SECTIONS;
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return DEFAULT_COLLAPSED_SECTIONS;
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!isValidCollapsedSections(parsedValue)) {
      return DEFAULT_COLLAPSED_SECTIONS;
    }

    return parsedValue;
  } catch {
    return DEFAULT_COLLAPSED_SECTIONS;
  }
}

export function useCollapsedSections() {
  const [collapsedSections, setCollapsedSections] = useState<CollapsedSections>(() =>
    readCollapsedSections()
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsedSections));
    } catch {
      // Si localStorage falla, la app sigue funcionando sin persistencia.
    }
  }, [collapsedSections]);

  const isCompactMode = useMemo(() => {
    return Object.values(collapsedSections).every(Boolean);
  }, [collapsedSections]);

  function setSectionCollapsed(section: CollapsedSectionKey, collapsed: boolean) {
    setCollapsedSections((current) => ({
      ...current,
      [section]: collapsed
    }));
  }

  function setAllSectionsCollapsed(collapsed: boolean) {
    setCollapsedSections({
      currentWeather: collapsed,
      trafficLight: collapsed,
      categoryDetail: collapsed
    });
  }

  function toggleCompactMode() {
    setAllSectionsCollapsed(!isCompactMode);
  }

  return {
    collapsedSections,
    isCompactMode,
    setSectionCollapsed,
    setAllSectionsCollapsed,
    toggleCompactMode
  };
}