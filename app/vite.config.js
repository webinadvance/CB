// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
    },
  },
})
