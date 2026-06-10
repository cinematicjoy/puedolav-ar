interface CreditsModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreditsModal({ open, onClose }: CreditsModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="credits-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Cerrar créditos">×</button>
        <h2 id="credits-title">Créditos</h2>
        <p>Cada lavado responsable ayuda a cuidar el agua, la energía y el ambiente.</p>
        <p><strong>Contacto:</strong> contacto@puedolav.ar</p>
        <p><strong>4593</strong></p>
        <p className="trust-note">Recomendación basada en pronóstico horario. Puede variar por microclima, sombra, balcón o patio.</p>
      </section>
    </div>
  );
}
