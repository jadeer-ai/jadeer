import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { jadeerBackendApiPlugin } from './src/server/viteApiPlugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [jadeerBackendApiPlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    host: true,
    allowedHosts: true, // Allow all tunnel hosts (localtunnel, ngrok, pinggy, etc.)
  },
})

