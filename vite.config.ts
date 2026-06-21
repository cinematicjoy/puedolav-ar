import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const isCustomDomain = process.env.VITE_CUSTOM_DOMAIN === "true";
const base = isCustomDomain ? "/" : "/puedolav-ar/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifestFilename: "manifest.webmanifest",
      includeManifestIcons: false,
      includeAssets: [
        "offline.html",
        "icons/icon-192.png",
        "icons/icon-512.png",
        "icons/maskable-512.png",
        "icons/apple-touch-icon.png"
      ],
      manifest: {
        id: base,
        name: "puedolav.ar",
        short_name: "Puedo lavar",
        description: "Recomendaciones simples para saber si conviene lavar según el clima.",
        lang: "es-AR",
        dir: "ltr",
        start_url: base,
        scope: base,
        display: "standalone",
        orientation: "portrait",
        theme_color: "#10251d",
        background_color: "#10251d",
        categories: ["weather", "lifestyle", "utilities"],
        icons: [
          {
            src: `${base}icons/icon-192.png`,
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: `${base}icons/icon-512.png`,
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: `${base}icons/maskable-512.png`,
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2,json}"],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [
          /^\/puedolav-ar\/\.well-known\//,
          /^\/\.well-known\//
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "open-meteo-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/air-quality-api\.open-meteo\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "open-meteo-air-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html"
      }
    })
  ]
});