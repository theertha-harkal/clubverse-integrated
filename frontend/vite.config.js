import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Optional convenience: lets the frontend call same-origin "/api/..."
    // during `npm run dev` and have Vite forward it to the Spring Boot
    // backend, avoiding CORS entirely in dev. The app itself talks to the
    // backend via VITE_API_BASE_URL (see src/lib/api.js / .env), so this
    // proxy is not required for the app to work - it's a fallback for
    // tooling (curl, Postman-via-browser, etc.) that hits the Vite origin.
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
