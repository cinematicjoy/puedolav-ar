interface CompactModeToggleProps {
  compact: boolean;
  onToggle: () => void;
}

export function CompactModeToggle({ compact, onToggle }: CompactModeToggleProps) {
  return (
    <div className="compact-mode-row">
      <button
        className={`compact-mode-toggle ${compact ? "is-compact" : ""}`}
        type="button"
        onClick={onToggle}
        aria-pressed={compact}
      >
        <span aria-hidden="true">{compact ? "▣" : "▤"}</span>
        {compact ? "Modo completo" : "Modo compacto"}
      </button>
    </div>
  );
}