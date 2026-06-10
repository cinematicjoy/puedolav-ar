interface AdSlotProps {
  title?: string;
}

export function AdSlot({ title = "Espacio publicitario" }: AdSlotProps) {
  return (
    <div className="ad-slot" aria-label="Espacio publicitario">
      <span>{title}</span>
      {/* Futuro: integrar Google AdSense o un servidor propio de banners en este componente. */}
    </div>
  );
}
