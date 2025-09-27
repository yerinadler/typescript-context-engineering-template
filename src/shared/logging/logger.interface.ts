export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogContext {
  traceId?: string | undefined;
  spanId?: string | undefined;
  traceFlags?: string | undefined;
  /**
   * Additional structured attributes to enrich the log entry.
   */
  attributes?: Record<string, unknown> | undefined;
  /**
   * Optional error instance or serialisable error information to include in the log entry.
   */
  error?: unknown;
}

export interface Logger {
  log(level: LogLevel, message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  child(defaultContext: LogContext): Logger;
}

export interface LoggerOptions {
  /**
   * Optional context that will be merged to every log call.
   */
  defaultContext?: LogContext;
}
