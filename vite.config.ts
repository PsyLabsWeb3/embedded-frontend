import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
   optimizeDeps: {
    include: ["buffer", "process"],
  },
  define: {
    // Evita errores de process.env.* si alguna lib los lee
    global: "window", 
    "process.env": {},
  },
  plugins: [react(), nodePolyfills()],
})
