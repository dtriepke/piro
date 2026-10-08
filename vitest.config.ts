import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["piro/tooling/**/*.{test,spec}.ts"],
  },
});
