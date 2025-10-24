import * as Sentry from "@sentry/react";

// Initialize Sentry only if a DSN is provided
const dsn = import.meta.env.VITE_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    replaysSessionSampleRate: Number(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? 0.0),
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      // Enable session replay if desired
      ...(Number(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? 0) > 0
        ? [Sentry.replayIntegration()]
        : []),
    ],
  });
}

export const captureException = (error: unknown) => {
  try {
    if (dsn) Sentry.captureException(error);
  } catch {
    // no-op
  }
};