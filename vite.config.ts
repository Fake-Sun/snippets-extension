import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json' with { type: 'json' }
import path from 'node:path'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'

export default defineConfig({
  plugins: [
    vue(),
    crx({ manifest })
  ],
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  legacy: {
    skipWebSocketTokenCheck: true
    },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})
