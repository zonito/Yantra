import { defineConfig } from 'vitest/config'

// Fast lane only: unit tests for the data model. Per-test hard timeout so a
// hung test fails the commit instead of hanging it.
export default defineConfig({
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    testTimeout: 10_000,
    hookTimeout: 10_000,
  },
})
