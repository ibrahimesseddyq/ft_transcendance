import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api/main': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/api/quiz': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/api/ai': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/api/rag': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})