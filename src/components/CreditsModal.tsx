interface CreditsModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreditsModal({ open, onClose }: CreditsModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="modal-card credits-card"
        role="dialog"
        aria-modal="true"
        aria-label="Información de puedolav.ar"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Cerrar información"
        >
          ×
        </button>

        <div className="credits-icon" aria-hidden="true">
          🌿
        </div>

        <p className="credits-main">
          Cada lavado responsable ayuda a cuidar el agua, la energía y el ambiente.
        </p>

        <p className="credits-contact">
          contacto@puedolav.ar
        </p>

        <p className="credits-lavados">
          <em>Lavá mejor, usando el clima a tu favor.</em>
        </p>

        <p className="credits-number">
          4593
        </p>

        <p className="credits-disclaimer">
          <strong><em>Disclaimer:</em></strong> recomendación basada en pronóstico horario.
          Puede variar por microclima, sombra, balcón o patio.
        </p>
      </section>
    </div>
  );
}