// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, // `describe` や `it` を import せずに使えるようにする
    environment: 'node',
    // DB統合テストの競合を防ぐため、ファイル間の並列実行を無効化
    fileParallelism: false,
  },
})