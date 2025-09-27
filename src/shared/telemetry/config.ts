import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

type Environment = 'development' | 'test' | 'production' | string;

export interface TelemetryConfig {
  readonly enabled: boolean;
  readonly tracingEnabled: boolean;
  readonly metricsEnabled: boolean;
  readonly serviceName: string;
  readonly serviceVersion: string;
  readonly environment: Environment;
  readonly traceSamplerRatio: number;
  readonly traceExporterEndpoint: string;
  readonly metricsExporterEndpoint: string;
  readonly exporterHeaders: Record<string, string>;
  readonly metricExportIntervalMillis: number;
  readonly metricExportTimeoutMillis: number;
  readonly diagLogLevel: DiagLogLevel;
}

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'y', 'on'].includes(value.toLowerCase());
};

const parseNumber = (value: string | undefined, fallback: number): number => {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseHeaders = (value: string | undefined): Record<string, string> => {
  if (!value) {
    return {};
  }

  return value.split(',').reduce<Record<string, string>>((acc, header) => {
    const [rawKey, ...rawValue] = header.split('=');
    const key = rawKey?.trim();
    if (!key) {
      return acc;
    }
    const joinedValue = rawValue.join('=').trim();
    if (!joinedValue) {
      return acc;
    }
    acc[key.toLowerCase()] = joinedValue;
    return acc;
  }, {});
};

const mapDiagLogLevel = (value: string | undefined): DiagLogLevel => {
  switch (value?.toLowerCase()) {
    case 'all':
      return DiagLogLevel.ALL;
    case 'debug':
      return DiagLogLevel.DEBUG;
    case 'error':
      return DiagLogLevel.ERROR;
    case 'info':
      return DiagLogLevel.INFO;
    case 'none':
      return DiagLogLevel.NONE;
    case 'verbose':
      return DiagLogLevel.VERBOSE;
    case 'warn':
    default:
      return DiagLogLevel.WARN;
  }
};

const resolveSamplerRatio = (envName: Environment, configured?: string): number => {
  if (configured !== undefined) {
    return parseNumber(configured, 1);
  }

  if (envName === 'production' || envName === 'staging' || envName === 'preproduction') {
    return 0.1;
  }

  return 1;
};

const resolveEndpoint = (primary?: string, fallback?: string): string => {
  if (primary && primary.trim().length > 0) {
    return primary.trim();
  }

  if (fallback && fallback.trim().length > 0) {
    return fallback.trim();
  }

  return 'http://localhost:4318';
};

const resolveServiceVersion = (): string => process.env.npm_package_version ?? '0.0.0';

export const createTelemetryConfig = (): TelemetryConfig => {
  const envName = (process.env.NODE_ENV ?? 'development').toLowerCase();
  const enabled = !parseBoolean(process.env.OTEL_SDK_DISABLED, false);
  const tracingEnabled = enabled && parseBoolean(process.env.OTEL_TRACES_ENABLED, true);
  const metricsEnabled = enabled && parseBoolean(process.env.OTEL_METRICS_ENABLED, true);

  const traceEndpoint = resolveEndpoint(
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  );
  const metricsEndpoint = resolveEndpoint(
    process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  );

  return {
    enabled,
    tracingEnabled,
    metricsEnabled,
    serviceName: process.env.OTEL_SERVICE_NAME ?? 'typescript-context-engineering-template',
    serviceVersion: resolveServiceVersion(),
    environment: envName,
    traceSamplerRatio: resolveSamplerRatio(envName, process.env.OTEL_TRACES_SAMPLER_RATIO),
    traceExporterEndpoint: traceEndpoint,
    metricsExporterEndpoint: metricsEndpoint,
    exporterHeaders: parseHeaders(process.env.OTEL_EXPORTER_OTLP_HEADERS),
    metricExportIntervalMillis: parseNumber(process.env.OTEL_METRIC_EXPORT_INTERVAL_MS, 60000),
    metricExportTimeoutMillis: parseNumber(process.env.OTEL_METRIC_EXPORT_TIMEOUT_MS, 30000),
    diagLogLevel: mapDiagLogLevel(process.env.OTEL_LOG_LEVEL),
  };
};

export const configureTelemetryDiagnostics = (level: DiagLogLevel): void => {
  diag.setLogger(new DiagConsoleLogger(), level);
};
