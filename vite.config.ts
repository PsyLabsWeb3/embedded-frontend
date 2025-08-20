import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
   optimizeDeps: {
    include: ["buffer", "process"],
  },
  define: {
    // Evita errores de process.env.* si alguna lib los lee
    "process.env": {},
  },
  plugins: [react()],
})
