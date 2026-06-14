import { useMemo, useState } from "react";
import { washItems } from "../data/washItems";
import type { WashItemType, WashRecommendation } from "../types/wash";
import { CategoryCarousel } from "./CategoryCarousel";
import { WashItemDetail } from "./WashItemDetail";

interface WashItemGridProps {
  recommendations: Record<WashItemType, WashRecommendation>;
}

export function WashItemGrid({ recommendations }: WashItemGridProps) {
  const [selectedType, setSelectedType] = useState<WashItemType>("light_clothes");

  const selectedItem = useMemo(() => {
    return washItems.find((item) => item.type === selectedType) ?? washItems[0];
  }, [selectedType]);

  const selectedRecommendation = recommendations[selectedItem.type];

  return (
    <section className="panel">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Categorías</p>
        <h2>¿Qué querés lavar?</h2>
        <p>Deslizá o tocá una categoría para ver la recomendación.</p>
      </div>

      <CategoryCarousel
        recommendations={recommendations}
        selectedType={selectedType}
        onSelect={setSelectedType}
      />

      {selectedRecommendation ? (
        <WashItemDetail
          item={selectedItem}
          recommendation={selectedRecommendation}
        />
      ) : null}
    </section>
  );
}