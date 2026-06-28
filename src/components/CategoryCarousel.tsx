import { washItems } from "../data/washItems";
import type { WashItemType, WashRecommendation } from "../types/wash";
import { WashItemCard } from "./WashItemCard";

interface CategoryCarouselProps {
  recommendations: Record<WashItemType, WashRecommendation>;
  selectedType: WashItemType;
  onSelect: (type: WashItemType) => void;
}

export function CategoryCarousel({
  recommendations,
  selectedType,
  onSelect
}: CategoryCarouselProps) {
  return (
    <div className="wash-carousel" aria-label="Categorías lavables">
      {washItems.map((item) => (
        <div className="wash-carousel-item" key={item.type}>
          <WashItemCard
            item={item}
            recommendation={recommendations[item.type]}
            selected={item.type === selectedType}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  );
}