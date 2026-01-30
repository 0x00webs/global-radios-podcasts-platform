import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Note: Proxy removed — frontend expects a full backend URL in VITE_API_URL (e.g. http://localhost:3000/api/v1)
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
})
