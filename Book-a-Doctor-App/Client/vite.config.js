import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    allowedHosts: [
      'stoop-reshuffle-subtract.ngrok-free.dev'
    ]
  }
})