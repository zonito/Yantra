import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Yantra runs on 3011. Sibling apps already hold 3000, 3005, 3007, 3008,
// 3009, 3010, 8000 and 8400.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3011,
  },
})
