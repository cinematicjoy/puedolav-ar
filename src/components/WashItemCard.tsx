import type { WashItem, WashRecommendation, WashItemType } from "../types/wash";

interface WashItemCardProps {
  item: WashItem;
  recommendation: WashRecommendation;
  selected: boolean;
  onSelect: (type: WashItemType) => void;
}

export function WashItemCard({ item, recommendation, selected, onSelect }: WashItemCardProps) {
  return (
    <button
      className={`wash-card status-${recommendation.status} ${selected ? "selected" : ""}`}
      type="button"
      onClick={() => onSelect(item.type)}
      aria-expanded={selected}
    >
      <span className="wash-icon" aria-hidden="true">{item.icon}</span>
      <span className="wash-name">{item.name}</span>
      <span className="wash-label">{recommendation.label}</span>
      <span className="score-pill">{recommendation.score}/100</span>
    </button>
  );
}
