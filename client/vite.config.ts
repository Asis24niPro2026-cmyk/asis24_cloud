import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'a': path.resolve(__dirname, './src'), // Este arregla tu error actual
    },
  },
  build: {
    outDir: 'dist'
  }
})
