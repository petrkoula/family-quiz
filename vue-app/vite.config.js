import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { photoCatalogPlugin } from './scripts/photo-catalog-plugin.mjs'

// Candidate image roots; first existing wins.
// ../images = repo root (local dev), ./public/images = docker volume mount.
const imageRoots = [
  fileURLToPath(new URL('../images', import.meta.url)),
  fileURLToPath(new URL('./public/images', import.meta.url)),
]

export default defineConfig({
  plugins: [
    vue(),
    photoCatalogPlugin({ roots: imageRoots })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.spec.js']
  }
})
