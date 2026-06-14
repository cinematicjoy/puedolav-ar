import { useMemo, useState } from "react";
import { washItems } from "../data/washItems";
import type { WashItemType, WashRecommendation } from "../types/wash";
import { CategoryCarousel } from "./CategoryCarousel";
import { SectionCollapseButton } from "./SectionCollapseButton";
import { WashItemDetail } from "./WashItemDetail";

interface WashItemGridProps {
  recommendations: Record<WashItemType, WashRecommendation>;
  detailCollapsed: boolean;
  onToggleDetailCollapsed: () => void;
}

export function WashItemGrid({
  recommendations,
  detailCollapsed,
  onToggleDetailCollapsed
}: WashItemGridProps) {
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
        <div className="category-detail-shell collapsible-shell">
          <SectionCollapseButton
            collapsed={detailCollapsed}
            label="detalle de categoría"
            onToggle={onToggleDetailCollapsed}
          />

          {detailCollapsed ? (
            <article className={`collapsed-category-detail status-${selectedRecommendation.status}`}>
              <span className="collapsed-category-icon" aria-hidden="true">
                {selectedItem.icon}
              </span>

              <div>
                <p className="eyebrow">Detalle</p>
                <strong>
                  {selectedItem.name} · {selectedRecommendation.score}/100
                </strong>
                <span>{selectedRecommendation.label}</span>
              </div>
            </article>
          ) : (
            <WashItemDetail
              item={selectedItem}
              recommendation={selectedRecommendation}
            />
          )}
        </div>
      ) : null}
    </section>
  );
}