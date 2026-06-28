import type { ReactNode } from "react";

interface CreditsModalProps {
  open: boolean;
  onClose: () => void;
  onPrivacy: () => void;
  onSupport: () => void;
  notificationControl?: ReactNode;
}

export function CreditsModal({
  open,
  onClose,
  onPrivacy,
  onSupport,
  notificationControl
}: CreditsModalProps) {
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
          puedolav.ar@gmail.com
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

        {notificationControl ? (
          <div className="credits-notification-control">
            {notificationControl}
          </div>
        ) : null}

        <div className="credits-modal-links" aria-label="Enlaces legales y soporte">
        <button
          type="button"
          className="credits-link-button"
          onClick={() => {
            onClose();
            onPrivacy();
          }}
        >
          Política de privacidad
        </button>

        <button
          type="button"
          className="credits-link-button"
          onClick={() => {
            onClose();
            onSupport();
          }}
        >
          Soporte / contacto
        </button>
      </div>
      </section>
    </div>
  );
}