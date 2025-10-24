import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig(({ mode }) => ({
  base: "/Hotel-Management-System/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Only tag components in development
    mode === "development" && componentTagger(),
    // Enable Sentry sourcemap upload in production if env provided
    mode === "production" &&
      sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        release: process.env.SENTRY_RELEASE || process.env.GITHUB_SHA,
        telemetry: false,
        disable: !process.env.SENTRY_AUTH_TOKEN,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
