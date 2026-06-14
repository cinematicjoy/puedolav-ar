import { useEffect, useMemo, useRef, useState } from "react";
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
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);

  const duplicatedItems = useMemo(() => {
    return [...washItems, ...washItems];
  }, []);

  function pauseTemporarily(duration = 5000) {
    setPaused(true);

    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = window.setTimeout(() => {
      setPaused(false);
      resumeTimerRef.current = null;
    }, duration);
  }

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || paused) return;

    if (carousel.scrollWidth <= carousel.clientWidth) return;

    let intervalId: number | null = null;

    intervalId = window.setInterval(() => {
      const halfWidth = carousel.scrollWidth / 2;

      carousel.scrollLeft += 1;

      if (carousel.scrollLeft >= halfWidth) {
        carousel.scrollLeft = carousel.scrollLeft - halfWidth;
      }
    }, 28);

    return () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [paused]);

  return (
    <div
      ref={carouselRef}
      className="wash-carousel"
      aria-label="Categorías lavables"
      onPointerDown={() => pauseTemporarily()}
      onTouchStart={() => pauseTemporarily()}
      onWheel={() => pauseTemporarily()}
    >
      {duplicatedItems.map((item, index) => {
        const isDuplicate = index >= washItems.length;

        return (
          <div className="wash-carousel-item" key={`${item.type}-${index}`}>
            <WashItemCard
              item={item}
              recommendation={recommendations[item.type]}
              selected={item.type === selectedType}
              onSelect={(type) => {
                pauseTemporarily();
                onSelect(type);
              }}
              tabIndex={isDuplicate ? -1 : undefined}
              visualOnly={isDuplicate}
            />
          </div>
        );
      })}
    </div>
  );
}