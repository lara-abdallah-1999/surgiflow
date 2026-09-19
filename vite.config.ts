import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: { proxy: { '/api/copilot': { target: 'http://127.0.0.1:8787', changeOrigin: true } } },
  preview: { proxy: { '/api/copilot': { target: 'http://127.0.0.1:8787', changeOrigin: true } } },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
