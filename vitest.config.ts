// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, // `describe` や `it` を import せずに使えるようにする
    environment: 'node',
  },
})