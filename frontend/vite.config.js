import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
  ],
  server: {
    port: 5173,  // kunci port ke 5173
    strictPort: true, // kalau port sedang dipakai, Vite akan gagal jalan (bukan pindah port)
  },
})
