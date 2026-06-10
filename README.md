# puedolav.ar

Demo MVP de una web/PWA mobile-first para responder una pregunta simple: **¿conviene lavar hoy?**

La app consulta clima real y pronóstico horario para recomendar si conviene lavar ropa, auto, zapatillas, acolchados, textiles y otros elementos al aire libre.

## Stack

- React
- Vite
- TypeScript
- CSS puro
- PWA instalable con `vite-plugin-pwa`
- Open-Meteo Forecast API
- Open-Meteo Geocoding API
- Open-Meteo Air Quality API
- Deploy estático en GitHub Pages
- Sin backend, sin base de datos y sin autenticación para este MVP

## Instalación local

```bash
npm install
npm run dev
```

Abrí la URL que muestra Vite, normalmente:

```bash
http://localhost:5173/
```

## Compilar

```bash
npm run build
npm run preview
```

## Estructura principal

```text
puedolav-ar/
  public/
    icons/
    ads/
    manifest.webmanifest
  src/
    components/
    data/
    hooks/
    services/
    types/
    utils/
    App.tsx
    main.tsx
    styles.css
  .github/workflows/deploy.yml
  index.html
  package.json
  tsconfig.json
  vite.config.ts
```

## Cómo funciona la ubicación

1. Al entrar, la app intenta pedir ubicación con la Geolocation API del navegador.
2. Si el usuario acepta, consulta Open-Meteo con latitud y longitud.
3. Si el usuario rechaza o falla la ubicación, muestra búsqueda manual por localidad, ciudad o código postal.
4. La última ubicación elegida se guarda en `localStorage` como `lastLocation`.
5. Los últimos datos climáticos se guardan como `lastWeatherData` para mostrarlos si no hay conexión.

## APIs usadas

### Forecast API

Se consulta:

- Clima actual: temperatura, humedad, sensación térmica, precipitación, lluvia, código climático, nubosidad, viento y ráfagas.
- Pronóstico horario: temperatura, humedad, punto de rocío, probabilidad de precipitación, lluvia, nubosidad, viento, ráfagas y UV.
- Pronóstico diario: código climático, temperatura mínima/máxima, probabilidad de precipitación máxima, lluvia y viento máximo.

Archivo:

```text
src/services/openMeteo.ts
```

### Geocoding API

Se usa para buscar ubicaciones manuales.

Archivo:

```text
src/services/geocoding.ts
```

### Air Quality API

Se consulta PM10, PM2.5, dust, UV y European AQI si están disponibles.

Archivo:

```text
src/services/airQuality.ts
```

## Cómo cambiar contacto y créditos

Editar:

```text
src/components/CreditsModal.tsx
```

Valores actuales:

- `contacto@puedolav.ar`
- `4593`

## Cómo cambiar banners

Los banners están en:

```text
public/ads/
```

La configuración está en:

```text
src/data/adBanners.ts
```

Ejemplo:

```ts
export const adBanners = [
  {
    id: "banner-1",
    title: "Espacio publicitario",
    image: "ads/banner-1.png",
    url: "#"
  }
];
```

El componente preparado para publicidad está en:

```text
src/components/AdSlot.tsx
```

Ahí se puede integrar Google AdSense más adelante.

## Cómo cambiar reglas de scoring

Reglas centrales:

```text
src/utils/scoring.ts
```

Funciones importantes:

```ts
calculateWashRecommendation(itemType, weatherData)
evaluateWeatherVariables(weatherData)
calculateAllRecommendations(weatherData)
```

Ventana horaria recomendada:

```text
src/utils/washWindow.ts
```

Función principal:

```ts
calculateBestWashWindow(weatherData)
```

## Deploy en GitHub Pages

### 1. Crear repositorio

Crear un repositorio llamado:

```text
puedolav-ar
```

### 2. Inicializar Git y subir

```bash
git init
git add .
git commit -m "MVP inicial puedolav.ar"
git branch -M main
git remote add origin https://github.com/USUARIO/puedolav-ar.git
git push -u origin main
```

### 3. Configurar Pages

En GitHub:

```text
Settings > Pages > Build and deployment > Source > GitHub Actions
```

El workflow está en:

```text
.github/workflows/deploy.yml
```

Cuando hagas push a `main`, GitHub Actions compila y publica `dist`.

La URL quedará similar a:

```text
https://USUARIO.github.io/puedolav-ar/
```

## Subcarpeta vs dominio propio

Mientras uses GitHub Pages con URL de repositorio:

```text
https://USUARIO.github.io/puedolav-ar/
```

Vite debe usar:

```ts
base: "/puedolav-ar/"
```

Este proyecto ya lo hace por defecto en `vite.config.ts`.

Cuando uses dominio propio:

```text
https://puedolav.ar/
```

Vite debe usar:

```ts
base: "/"
```

Para compilar con dominio propio:

```bash
VITE_CUSTOM_DOMAIN=true npm run build
```

En Windows PowerShell:

```powershell
$env:VITE_CUSTOM_DOMAIN="true"; npm run build
```

Para automatizar eso en GitHub Actions, podés agregar en el paso `Build`:

```yaml
env:
  VITE_CUSTOM_DOMAIN: "true"
```

## Dominio propio puedolav.ar

Pasos generales:

1. Registrar `puedolav.ar` en NIC Argentina.
2. Usar DNS propio de NIC o delegar a un proveedor DNS.
3. En GitHub, ir a:

```text
Settings > Pages > Custom domain
```

4. Ingresar:

```text
puedolav.ar
```

5. Crear en el DNS los registros que indique GitHub Pages.
6. Para dominio apex, GitHub Pages suele requerir registros `A` apuntando a las IP oficiales de GitHub Pages.
7. Para `www`, crear un `CNAME` hacia:

```text
USUARIO.github.io
```

8. Agregar un archivo:

```text
public/CNAME
```

Con este contenido:

```text
puedolav.ar
```

9. Activar `Enforce HTTPS` en GitHub Pages cuando GitHub valide el dominio.
10. Cambiar el build a `base: "/"` usando `VITE_CUSTOM_DOMAIN=true`.

No agregué `public/CNAME` todavía para evitar que GitHub intente publicar un dominio que aún no está configurado.

## Checklist de prueba funcional

- [ ] En celular, la app pide ubicación.
- [ ] Si aceptás, carga clima real.
- [ ] Si rechazás, permite buscar por localidad/código postal.
- [ ] Se guarda la última ubicación.
- [ ] El botón “Cambiar ubicación” funciona.
- [ ] El botón “Actualizar clima” consulta nuevamente.
- [ ] Se ven variables climáticas con semáforo.
- [ ] Se ve grilla de elementos lavables.
- [ ] Al tocar un elemento, aparece detalle con motivos.
- [ ] Se ve mejor ventana horaria.
- [ ] Se ven próximas 12 horas.
- [ ] Se ven próximos 7 días.
- [ ] El modal de créditos abre y cierra.
- [ ] El modo Día/Noche/Sistema cambia visualmente.
- [ ] El footer de publicidad rota banners.
- [ ] La app puede instalarse como PWA.
- [ ] Si no hay conexión, muestra últimos datos guardados si existen.

## Checklist de deploy

- [ ] `npm install`
- [ ] `npm run dev`
- [ ] `npm run build`
- [ ] `git add .`
- [ ] `git commit -m "MVP inicial puedolav.ar"`
- [ ] `git push -u origin main`
- [ ] GitHub Pages configurado en `GitHub Actions`
- [ ] Workflow terminado en verde
- [ ] Sitio visible en `https://USUARIO.github.io/puedolav-ar/`

## Pendientes post-MVP

- Google AdSense.
- Panel simple para cargar flyers publicitarios.
- Métricas de visitas.
- Historial de consultas.
- Notificaciones push.
- Favoritos: casa, trabajo, lavadero.
- Sección SEO con artículos útiles.
- Contraste contra SMN para Argentina.
- Sistema de confianza entre fuentes.
- Directorio de lavaderos y lavanderías.
- Monetización por banners directos.
- Cupones o convenios con negocios locales.
