type Level = "debug" | "info" | "warn" | "error";

/**
 * Minimal logger wrapper to centralize logging.
 * Replace console.* with a vendor SDK (e.g., Sentry, Datadog) for production.
 */
class Logger {
  private prefix = "[HotelHub]";

  log(level: Level, ...args: unknown[]) {
    // eslint-disable-next-line no-console
    (console as any)[level]?.(this.prefix, ...args);
  }
  debug(...args: unknown[]) {
    if (import.meta.env.DEV) this.log("debug", ...args);
  }
  info(...args: unknown[]) {
    this.log("info", ...args);
  }
  warn(...args: unknown[]) {
    this.log("warn", ...args);
  }
  error(...args: unknown[]) {
    this.log("error", ...args);
  }
}

export const logger = new Logger();