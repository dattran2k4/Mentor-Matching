import { fileURLToPath, URL } from 'node:url'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
var stdin_default = defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url))
    },
    tsconfigPaths: true
  }
})
export { stdin_default as default }
