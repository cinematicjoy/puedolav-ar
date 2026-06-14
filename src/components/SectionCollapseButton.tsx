interface SectionCollapseButtonProps {
  collapsed: boolean;
  label: string;
  onToggle: () => void;
}

export function SectionCollapseButton({
  collapsed,
  label,
  onToggle
}: SectionCollapseButtonProps) {
  const actionLabel = collapsed ? `Expandir ${label}` : `Contraer ${label}`;

  return (
    <button
      className="section-collapse-button"
      type="button"
      onClick={onToggle}
      aria-expanded={!collapsed}
      aria-label={actionLabel}
      title={actionLabel}
    >
      <span
        className={`section-chevron ${collapsed ? "is-collapsed" : "is-expanded"}`}
        aria-hidden="true"
      />
    </button>
  );
}