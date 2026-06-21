interface SupportPageProps {
  onBack: () => void;
}

export function SupportPage({ onBack }: SupportPageProps) {
  return (
    <main className="legal-page">
      <button className="secondary-button" type="button" onClick={onBack}>
        Volver
      </button>

      <section className="panel legal-panel">
        <p className="eyebrow">Soporte</p>
        <h1>Soporte y contacto</h1>

        <p>
          puedolav.ar ayuda a decidir si conviene lavar al aire libre según el clima y el
          pronóstico.
        </p>

        <h2>Contacto</h2>
        <p>
          Para consultas, sugerencias o reporte de errores, escribí a:
          puedolav.ar@gmail.com
        </p>

        <h2>Reportar un problema</h2>
        <p>
          Al reportar un error, incluí si estabas usando celular o computadora, navegador,
          ubicación aproximada consultada y una breve descripción del problema.
        </p>

        <h2>Aclaración</h2>
        <p>
          Las recomendaciones son orientativas. El clima puede cambiar y las condiciones
          reales pueden variar por microclima, sombra, patio, balcón o exposición al viento.
        </p>
      </section>
    </main>
  );
}