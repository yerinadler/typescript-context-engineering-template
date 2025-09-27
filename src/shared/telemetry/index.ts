import { initializeTelemetry, TelemetryRuntime } from './sdk';

export type { TelemetryRuntime } from './sdk';
export { getTracer, getActiveSpan, withSpan, withSpanSync } from './tracer';

const runtime: TelemetryRuntime = initializeTelemetry();

export const telemetryEnabled = runtime.enabled;
export const telemetryReady = runtime.ready;
export const shutdownTelemetry = runtime.shutdown;
