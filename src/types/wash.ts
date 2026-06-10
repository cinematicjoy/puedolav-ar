export type Status = "good" | "caution" | "bad";

export type WashItemType =
  | "light_clothes"
  | "heavy_clothes"
  | "sneakers"
  | "sheets"
  | "towels"
  | "quilts"
  | "rugs"
  | "curtains"
  | "sofa_covers"
  | "outdoor_textiles"
  | "car"
  | "bike"
  | "motorcycle"
  | "scooter"
  | "toys"
  | "plushies"
  | "pet_beds"
  | "backpacks";

export interface WashItem {
  type: WashItemType;
  name: string;
  icon: string;
  shortDescription: string;
  category: "clothes" | "textile" | "vehicle" | "object";
}

export interface WashRecommendation {
  score: number;
  status: Status;
  label: "Conviene" | "Con cuidado" | "No conviene";
  title: string;
  reasons: string[];
  variables: string[];
  recommendation: string;
  dryingTime?: string;
  warnings: string[];
}

export interface WeatherVariableEvaluation {
  key: string;
  name: string;
  value: string;
  ideal: string;
  status: Status;
  direction: "up" | "down" | "neutral";
  percentage: number;
  explanation: string;
}

export interface BestWashWindow {
  bestStart?: string;
  bestEnd?: string;
  goodHours: number;
  rainRisk: Status;
  deadline?: string;
  shouldWaitTomorrow: boolean;
  message: string;
}
