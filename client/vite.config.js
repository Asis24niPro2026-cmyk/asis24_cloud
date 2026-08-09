import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
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