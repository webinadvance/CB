// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'

// vite.config.js
export default defineConfig(({ mode }) => ({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.js'],
  },
  resolve: {
    conditions: mode === 'test' ? ['browser'] : [],
    alias: {
      $lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
    },
  },
}))
