import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  base: "./", // base relativa
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "a": fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": fileURLToPath(new URL("../shared", import.meta.url)),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: {
          // separa React en su propio chunk
          react: ["react", "react-dom"],
          // separa Radix UI en otro chunk
          radix: [
            "@radix-ui/react-select",
            "@radix-ui/react-dialog",
            "@radix-ui/react-slot"
          ],
          // separa TRPC y React Query
          trpc: [
            "@trpc/client",
            "@trpc/react-query",
            "@tanstack/react-query"
          ]
        }
      }
    },
    // opcional: subir el límite de advertencia
    chunkSizeWarningLimit: 1000
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT || 4173,
    allowedHosts: ["asis24-cloud-1.onrender.com"]
  }
});
