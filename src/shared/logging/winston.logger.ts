import winston from 'winston';

import { LogContext, LogLevel, Logger, LoggerOptions } from './logger.interface';

const SUPPORTED_LOG_LEVELS: readonly LogLevel[] = ['error', 'warn', 'info', 'debug'] as const;
const PRODUCTION_LIKE_ENVIRONMENTS = new Set(['production', 'staging', 'preproduction']);

const resolveLogLevel = (): LogLevel => {
  const configuredLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel | undefined;
  if (configuredLevel && SUPPORTED_LOG_LEVELS.includes(configuredLevel)) {
    return configuredLevel;
  }

  const env = process.env.NODE_ENV?.toLowerCase();
  if (env && PRODUCTION_LIKE_ENVIRONMENTS.has(env)) {
    return 'info';
  }

  return 'debug';
};

const baseLogger = winston.createLogger({
  level: resolveLogLevel(),
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [new winston.transports.Console()],
});

const hasEntries = (value: Record<string, unknown>): boolean => Object.keys(value).length > 0;

const normaliseError = (error: unknown): unknown => {
  if (error instanceof Error) {
    const serialised: Record<string, unknown> = {
      message: error.message,
      name: error.name,
    };

    if (error.stack) {
      serialised.stack = error.stack;
    }

    if ('cause' in error && (error as { cause?: unknown }).cause !== undefined) {
      const cause = (error as { cause?: unknown }).cause;
      if (cause && cause !== error) {
        serialised.cause = normaliseError(cause);
      }
    }

    return serialised;
  }

  return error;
};

const mapContextToPayload = (context?: LogContext): Record<string, unknown> => {
  if (!context) {
    return {};
  }

  const payload: Record<string, unknown> = {};

  if (context.traceId) {
    payload.trace_id = context.traceId;
  }

  if (context.spanId) {
    payload.span_id = context.spanId;
  }

  if (context.attributes && hasEntries(context.attributes)) {
    Object.assign(payload, context.attributes);
  }

  if (context.error !== undefined) {
    payload.error = normaliseError(context.error);
  }

  return payload;
};

const mergeContexts = (base?: LogContext, override?: LogContext): LogContext | undefined => {
  if (!base && !override) {
    return undefined;
  }

  const mergedAttributes = {
    ...(base?.attributes ?? {}),
    ...(override?.attributes ?? {}),
  };

  const merged: LogContext = {
    ...base,
    ...override,
  };

  if (hasEntries(mergedAttributes)) {
    merged.attributes = mergedAttributes;
  } else {
    delete merged.attributes;
  }

  delete merged.error;
  if (override?.error !== undefined) {
    merged.error = override.error;
  }

  return merged;
};

class WinstonLogger implements Logger {
  private readonly defaultContext?: LogContext;

  constructor(
    private readonly logger: winston.Logger,
    options: LoggerOptions = {},
  ) {
    this.defaultContext = options.defaultContext;
  }

  log(level: LogLevel, message: string, context?: LogContext): void {
    const mergedContext = mergeContexts(this.defaultContext, context);
    this.logger.log({
      level,
      message,
      ...mapContextToPayload(mergedContext),
    });
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  child(defaultContext: LogContext): Logger {
    const mergedContext = mergeContexts(this.defaultContext, defaultContext);
    return new WinstonLogger(this.logger, { defaultContext: mergedContext });
  }
}

export const frameworkLogger: Logger = new WinstonLogger(baseLogger);

export const createLogger = (options?: LoggerOptions): Logger => new WinstonLogger(baseLogger, options);

export { WinstonLogger };
