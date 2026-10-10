import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Yantra runs on 3014. Sibling apps already hold 3000-3013, 8000 and 8400
// (Smriti 3011, Panchang 3012, Sadhana 3013).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3014,
  },
})
