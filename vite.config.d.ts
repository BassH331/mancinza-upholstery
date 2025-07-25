import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/mancinza-upholstery/', // 👈 IMPORTANT for GitHub Pages
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@/components": path.resolve(__dirname, "./components"),
      "@/styles": path.resolve(__dirname, "./styles"),
      "@/lib": path.resolve(__dirname, "./lib"),  // <--- add this line
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
