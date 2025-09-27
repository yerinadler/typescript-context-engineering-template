import { diag } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { defaultResource, resourceFromAttributes } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

import { configureTelemetryDiagnostics, createTelemetryConfig } from './config';

export interface TelemetryRuntime {
  readonly ready: Promise<void>;
  shutdown(): Promise<void>;
  readonly enabled: boolean;
}

let runtime: TelemetryRuntime | null = null;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const createSampler = (ratio: number): ParentBasedSampler =>
  new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(clamp(ratio, 0, 1)),
  });

const createResource = (serviceName: string, serviceVersion: string, environment: string) => {
  const custom = resourceFromAttributes({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
  });

  return defaultResource().merge(custom);
};

const registerProcessHooks = (shutdown: () => Promise<void>) => {
  const gracefulShutdown = async (signal: NodeJS.Signals) => {
    try {
      diag.info(`Received ${signal}. Shutting down OpenTelemetry SDK.`);
      await shutdown();
      diag.info('OpenTelemetry SDK shut down successfully.');
    } catch (error) {
      diag.error('Failed to shut down OpenTelemetry SDK gracefully.', error);
    }
  };

  process.once('SIGTERM', () => {
    void gracefulShutdown('SIGTERM');
  });

  process.once('SIGINT', () => {
    void gracefulShutdown('SIGINT');
  });
};

export const initializeTelemetry = (): TelemetryRuntime => {
  if (runtime) {
    return runtime;
  }

  const config = createTelemetryConfig();
  configureTelemetryDiagnostics(config.diagLogLevel);

  if (!config.enabled) {
    runtime = {
      enabled: false,
      ready: Promise.resolve(),
      async shutdown() {
        /* noop */
      },
    };
    diag.info('OpenTelemetry SDK is disabled via configuration.');
    return runtime;
  }

  const resource = createResource(config.serviceName, config.serviceVersion, config.environment);
  const sampler = createSampler(config.traceSamplerRatio);

  const instrumentations = getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-http': {
      enabled: config.tracingEnabled,
    },
    '@opentelemetry/instrumentation-express': {
      enabled: config.tracingEnabled,
    },
    '@opentelemetry/instrumentation-pg': {
      enabled: config.tracingEnabled,
    },
  });

  const traceExporter = config.tracingEnabled
    ? new OTLPTraceExporter({
        url: config.traceExporterEndpoint,
        headers: config.exporterHeaders,
      })
    : undefined;

  const metricReader = config.metricsEnabled
    ? new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: config.metricsExporterEndpoint,
          headers: config.exporterHeaders,
        }),
        exportIntervalMillis: config.metricExportIntervalMillis,
        exportTimeoutMillis: config.metricExportTimeoutMillis,
      })
    : undefined;

  const sdk = new NodeSDK({
    resource,
    sampler,
    ...(traceExporter ? { traceExporter } : {}),
    ...(metricReader ? { metricReader } : {}),
    instrumentations,
  });

  const ready = (async () => {
    try {
      await sdk.start();
      diag.info('OpenTelemetry SDK initialised successfully.');
    } catch (error: unknown) {
      diag.error('Failed to initialise OpenTelemetry SDK.', error);
      throw error;
    }
  })();

  const shutdown = async () => {
    await sdk.shutdown();
  };

  registerProcessHooks(shutdown);

  runtime = {
    enabled: true,
    ready,
    shutdown,
  };

  return runtime;
};
