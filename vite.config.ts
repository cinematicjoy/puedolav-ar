import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const repoBase = "/puedolav-ar/";
const base = process.env.VITE_CUSTOM_DOMAIN === "true" ? "/" : repoBase;

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: false,
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
        navigateFallback: `${base}index.html`,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/(api|geocoding-api|air-quality-api)\.open-meteo\.com\/.*$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "open-meteo-api-cache",
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60
              },
              networkTimeoutSeconds: 6
            }
          }
        ]
      }
    })
  ]
});
