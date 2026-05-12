import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/app/**",
        "src/components/**",
        "src/i18n/navigation.ts",
        "src/i18n/request.ts",
        "src/lib/supabase/browser.ts",
        "src/lib/supabase/server.ts",
        "src/types/**"
      ]
    }
  }
});
