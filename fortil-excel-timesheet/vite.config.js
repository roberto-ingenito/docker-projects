import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/timesheet/',
  preview: {
    port: 5002,
    strictPort: true,
  },
  // Server dev (opzionale, per sviluppo locale)
  server: {
    port: 5002,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:5002",
  },
})
