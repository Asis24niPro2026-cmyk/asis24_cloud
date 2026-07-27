import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  preview: {
    port: 4173,
    allowedHosts: [
      "asis24-cloud-1.onrender.com"
    ]
  }
})
