import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // opcional, si quieres fijar el puerto en local
  },
  preview: {
    allowedHosts: [
      "asis24-cloud-1.onrender.com" // tu backend en Render
    ]
  }
});
