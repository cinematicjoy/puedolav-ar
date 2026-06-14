import type { WashItem, WashItemType, WashRecommendation } from "../types/wash";

interface WashItemCardProps {
  item: WashItem;
  recommendation: WashRecommendation;
  selected: boolean;
  onSelect: (type: WashItemType) => void;
  tabIndex?: number;
  visualOnly?: boolean;
}

export function WashItemCard({
  item,
  recommendation,
  selected,
  onSelect,
  tabIndex,
  visualOnly = false
}: WashItemCardProps) {
  return (
    <button
      className={`wash-card status-${recommendation.status} ${selected ? "selected" : ""}`}
      type="button"
      onClick={() => onSelect(item.type)}
      aria-expanded={selected}
      aria-hidden={visualOnly ? true : undefined}
      tabIndex={tabIndex}
    >
      <span className="wash-icon" aria-hidden="true">
        {item.icon}
      </span>

      <span className="wash-name">
        {item.name}
      </span>

      <span className="wash-label">
        {recommendation.label}
      </span>

      <span className="score-pill">
        {recommendation.score}/100
      </span>
    </button>
  );
}