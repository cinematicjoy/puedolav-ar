# Data Safety - puedolav.ar

## Resumen de datos

La app usa ubicación para consultar clima y generar recomendaciones sobre si conviene lavar al aire libre.

La ubicación puede obtenerse mediante permiso de GPS del navegador o mediante búsqueda manual de ciudad/código postal.

La app no requiere cuenta de usuario.

La app no solicita nombre, email, teléfono, contactos, fotos, archivos, datos financieros ni información de salud.

La app no usa datos para publicidad personalizada.

La app no vende datos personales.

La app usa almacenamiento local del navegador para preferencias de interfaz, modo compacto, últimos datos o caché básica.

## Data types

### Location

Collected: Sí.

Shared: Sí, si la consulta climática se realiza contra servicios externos de clima.

Data types:
- Approximate location.
- Precise location, cuando el usuario acepta GPS.

Purpose:
- App functionality.

Required:
- La ubicación es necesaria para calcular recomendaciones climáticas.
- El permiso GPS es opcional porque el usuario puede buscar ubicación manualmente.

Ephemeral:
- Sí, la ubicación se usa para resolver la consulta climática y no se conserva en servidor propio.

## Security practices

Data encrypted in transit:
- Sí, mediante HTTPS.

Data deletion:
- La app no mantiene cuenta ni conserva datos personales en servidor propio.
- El usuario puede borrar datos locales desde la configuración del navegador/app.
- Para consultas: contacto@puedolav.ar

## Third parties

Servicios externos:
- Proveedor de clima para obtener pronóstico según ubicación.
- Hosting web de la PWA.

## Declaraciones negativas

La app no recolecta:
- Nombre.
- Email.
- Teléfono.
- Contactos.
- Fotos.
- Videos.
- Archivos.
- Datos financieros.
- Datos de salud.
- Mensajes.
- Calendario.
- Identificadores publicitarios.