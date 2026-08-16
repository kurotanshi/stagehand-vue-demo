import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/e2e/**/*.test.ts"],
    // Stagehand 的每個自然語言操作都是一次 LLM 推論,放寬逾時設定
    testTimeout: 180_000,
    hookTimeout: 120_000,
    fileParallelism: false,
  },
});
