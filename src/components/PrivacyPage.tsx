interface LegalPageProps {
  onBack: () => void;
}

export function PrivacyPage({ onBack }: LegalPageProps) {
  return (
    <main className="legal-page">
      <button className="secondary-button" type="button" onClick={onBack}>
        Volver
      </button>

      <section className="panel legal-panel">
        <p className="eyebrow">Legal</p>
        <h1>Política de privacidad</h1>

        <p>
          puedolav.ar es una aplicación web que ayuda a estimar si conviene lavar ropa,
          vehículos u otros elementos al aire libre según el clima actual y el pronóstico.
        </p>

        <h2>Datos que usa la app</h2>
        <p>
          La app puede solicitar acceso a la ubicación del dispositivo para consultar el
          clima de la zona del usuario. La ubicación se usa únicamente para obtener datos
          climáticos relevantes.
        </p>

        <h2>Ubicación</h2>
        <p>
          Si el usuario acepta el permiso de ubicación, el navegador entrega latitud y
          longitud aproximadas. puedolav.ar no requiere crear una cuenta y no guarda la
          ubicación en un servidor propio.
        </p>

        <p>
          Si el usuario no acepta el permiso de ubicación, puede buscar manualmente una
          localidad o código postal.
        </p>

        <h2>Servicios externos</h2>
        <p>
          Para obtener información climática, la app consulta servicios externos de clima,
          como Open-Meteo. Esos servicios pueden procesar la consulta necesaria para
          devolver el pronóstico.
        </p>

        <h2>Almacenamiento local</h2>
        <p>
          La app puede usar almacenamiento local del navegador para recordar preferencias
          de interfaz, última consulta o datos recientes necesarios para mejorar la
          experiencia offline básica.
        </p>

        <h2>Recomendaciones climáticas</h2>
        <p>
          Las recomendaciones son orientativas y se basan en datos climáticos disponibles.
          Pueden variar por microclima, sombra, balcón, patio, viento local o cambios del
          pronóstico.
        </p>

        <h2>Contacto</h2>
        <p>
          Para consultas o pedidos relacionados con privacidad, escribí a:
          puedolav.ar@gmail.com
        </p>

        <p className="legal-note">
          Última actualización: junio de 2026. 4593.
        </p>
      </section>
    </main>
  );
}