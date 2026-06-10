import { useMemo, useState } from "react";
import { washItems } from "../data/washItems";
import type { WashItemType, WashRecommendation } from "../types/wash";
import { WashItemCard } from "./WashItemCard";
import { WashItemDetail } from "./WashItemDetail";

interface WashItemGridProps {
  recommendations: Record<WashItemType, WashRecommendation>;
}

export function WashItemGrid({ recommendations }: WashItemGridProps) {
  const [selectedType, setSelectedType] = useState<WashItemType>("light_clothes");
  const selectedItem = useMemo(() => washItems.find((item) => item.type === selectedType) ?? washItems[0], [selectedType]);
  const selectedRecommendation = recommendations[selectedItem.type];

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Categorías</p>
        <h2>¿Qué querés lavar?</h2>
        <p>Cada caso pesa distinto la lluvia, humedad, viento, sol y polvo.</p>
      </div>
      <div className="wash-grid">
        {washItems.map((item) => (
          <WashItemCard
            key={item.type}
            item={item}
            recommendation={recommendations[item.type]}
            selected={item.type === selectedType}
            onSelect={setSelectedType}
          />
        ))}
      </div>
      {selectedRecommendation ? <WashItemDetail item={selectedItem} recommendation={selectedRecommendation} /> : null}
    </section>
  );
}
