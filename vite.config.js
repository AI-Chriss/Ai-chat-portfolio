import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['cc1da68f-73c6-4a55-bc1b-a6046adcf685-00-28hl9isojqt11.janeway.replit.dev'],
  }
})
