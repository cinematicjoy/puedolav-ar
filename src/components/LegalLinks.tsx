interface LegalLinksProps {
  onPrivacy: () => void;
  onSupport: () => void;
}

export function LegalLinks({ onPrivacy, onSupport }: LegalLinksProps) {
  return (
    <nav className="legal-links" aria-label="Enlaces legales y soporte">
      <button type="button" onClick={onPrivacy}>
        Privacidad
      </button>
      <span aria-hidden="true">·</span>
      <button type="button" onClick={onSupport}>
        Soporte
      </button>
    </nav>
  );
}