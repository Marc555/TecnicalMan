import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // <- Esto permite que el servidor escuche en la IP local
    port: 5173,  // (opcional) puedes cambiar el puerto si lo deseas
  }
})
