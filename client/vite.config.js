import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  base: './', //
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'a': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist'
  },
   preview: {
   host: '0.0.0.0',  
    port: process.env.PORT || 4173,
    allowedHosts: ["asis24-cloud-1.onrender.com"]
  }
})
