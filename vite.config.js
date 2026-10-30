import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Backend target for the dev-server proxy. Override via VITE_BACKEND_URL in .env
const BACKEND = process.env.VITE_BACKEND_URL || "http://localhost:8000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
    // Proxy API, WebSocket and uploaded files to the FastAPI backend so the
    // frontend can use same-origin relative URLs (/api, /ws, /uploads).
    proxy: {
      "/api": { target: BACKEND, changeOrigin: true },
      "/uploads": { target: BACKEND, changeOrigin: true },
      "/ws": { target: BACKEND.replace(/^http/, "ws"), ws: true },
    },
  },
});
