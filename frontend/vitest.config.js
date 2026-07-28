import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
var stdin_default = defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['app/**/*.{test,spec}.{js,jsx}']
  }
})
export { stdin_default as default }
