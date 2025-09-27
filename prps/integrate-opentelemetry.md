name: "Implement OpenTelemetry SDK for Distributed Tracing"
description: |
  Implement comprehensive OpenTelemetry SDK integration for a TypeScript Modular Monolith, establishing distributed tracing capabilities with automatic trace_id and span_id injection into the existing Winston logging system.

## Goal
Establish enterprise-grade observability infrastructure by implementing OpenTelemetry SDK across all bounded contexts, enabling distributed tracing, metrics collection, and seamless integration with the existing Winston logging system for complete request lifecycle visibility.

## Why
- **Observability**: Full request tracing across bounded context boundaries within the modular monolith
- **Debugging**: Rapid issue identification and root cause analysis through distributed traces
- **Performance**: Monitor and optimize cross-context communication and database operations
- **Compliance**: Production-ready observability for enterprise monitoring and SLA tracking
- **Correlation**: Automatic trace_id/span_id injection into logs for unified request tracking
- **Future-Ready**: Foundation for microservice migration and multi-service tracing

## What
Implement OpenTelemetry SDK with auto-instrumentation, manual instrumentation capabilities, and seamless Winston logging integration, providing comprehensive observability across all application layers while maintaining existing logging patterns.

### Success Criteria
- [ ] OpenTelemetry SDK initialized with proper resource detection and configuration
- [ ] Auto-instrumentation enabled for Express.js, HTTP clients, and database operations
- [ ] Manual instrumentation helpers available for business logic tracing
- [ ] Winston logging automatically receives trace_id and span_id in all log entries
- [ ] Traces exported to OTLP-compatible backend (Jaeger/Zipkin/DataDog/etc.)
- [ ] Zero breaking changes to existing logging patterns
- [ ] Performance overhead < 5% in production environment
- [ ] All bounded contexts participate in distributed tracing

## All Needed Context

### Documentation & References
```yaml
- file: src/shared/logger/winston.config.ts
  why: Current Winston configuration that needs trace context integration
  
- file: src/shared/logger/logger.ts  
  why: Logger implementation that should receive trace_id and span_id automatically

- directory: src/contexts/
  why: All bounded contexts that need instrumentation coverage

- file: src/index.ts
  why: Application entry point where OpenTelemetry must be initialized first

- file: src/shared/telemetry/
  why: Framework-level OpenTelemetry configuration and utilities
```

### Current Codebase Structure
```bash
# Target directories for instrumentation:
src/
├── index.ts (Entry point - OTel initialization)
├── shared/
│   ├── logger/ (Winston integration target)
│   ├── telemetry/ (OpenTelemetry framework config and utilities)
│   ├── middleware/ (Context propagation)
│   ├── database/ (DB instrumentation)
│   └── api/ (HTTP instrumentation)
├── contexts/ (All bounded contexts need coverage)
│   ├── [bounded-context-1]/
│   ├── [bounded-context-2]/
│   └── [bounded-context-n]/
└── examples/ (Example implementations)
```

### Desired Pattern (Target Architecture)
```typescript
// OpenTelemetry initialization (must be first import)
import './instrumentation'; // Auto-instrumentation setup
import { trace, context, SpanStatusCode } from '@opentelemetry/api';

// Business logic with manual instrumentation
export class ExampleService {
  async processOrder(orderId: string): Promise<Order> {
    return trace.getTracer('order-service').startActiveSpan('process-order', async (span) => {
      try {
        span.setAttributes({ 'order.id': orderId });
        
        // Business logic - logs automatically get trace context
        this.logger.info('Processing order', { orderId }); // Gets trace_id/span_id automatically
        
        const order = await this.orderRepository.findById(orderId);
        span.setAttributes({ 'order.status': order.status });
        
        return order;
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: OpenTelemetry MUST be initialized before any other imports
// GOTCHA: Auto-instrumentation requires specific package versions
// CRITICAL: Context propagation must be maintained across async boundaries
// GOTCHA: Winston correlation requires custom formatter integration
// CRITICAL: Resource detection should include service name and version
// GOTCHA: Span lifecycle management in error scenarios
// CRITICAL: Export configuration must match backend requirements (OTLP/Jaeger/etc.)
```

## Implementation Blueprint

### Data Models and Structure
```typescript
// NO NEW INTERFACES - Preserve existing Winston logging interface
// OpenTelemetry will inject trace_id and span_id into existing log metadata
// without changing the current logging interface or structure

// OpenTelemetry Configuration
interface OTelConfig {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  exporterType: 'console' | 'jaeger' | 'otlp' | 'zipkin';
  exporterEndpoint?: string;
  samplingRatio: number;
}
```

### List of Tasks (in order)

```yaml
Task 1: "Install and Configure OpenTelemetry Dependencies"
INSTALL packages:
  - "@opentelemetry/api"
  - "@opentelemetry/sdk-node"
  - "@opentelemetry/auto-instrumentations-node"
  - "@opentelemetry/exporter-jaeger" # or preferred exporter
  - "@opentelemetry/instrumentation-winston"
CREATE configuration structure for different environments

Task 2: "Create Instrumentation Bootstrap"  
CREATE file: src/shared/telemetry/instrumentation.ts
IMPLEMENT:
  - OpenTelemetry SDK initialization
  - Resource detection (service name, version, environment)
  - Auto-instrumentation registration
  - Exporter configuration
  - Sampling strategy setup

Task 3: "Integrate Winston with OpenTelemetry"
MODIFY: src/shared/logger/winston.config.ts
IMPLEMENT:
  - Custom formatter to extract trace context
  - Automatic trace_id and span_id injection
  - Preserve existing log format and metadata
  - Context propagation handling

Task 4: "Update Application Bootstrap"
MODIFY: src/index.ts
ENSURE:
  - src/shared/telemetry/instrumentation.ts is first import
  - OpenTelemetry initializes before Express and other dependencies
  - Environment-specific configuration loading

Task 5: "Create Manual Instrumentation Helpers"
CREATE additional files in: src/shared/telemetry/
IMPLEMENT:
  - Tracer factory functions (tracer.ts)
  - Span management utilities (span-helpers.ts)  
  - Attribute setting helpers (attributes.ts)
  - Error recording utilities (error-handling.ts)
  - Context propagation helpers (context.ts)
  - Configuration management (config.ts)

Task 6: "Instrument Critical Paths"
MODIFY key services across bounded contexts:
  - Add manual spans for business operations
  - Instrument database queries
  - Add tracing to inter-context communication
  - Preserve existing error handling patterns

Task 7: "Environment Configuration"
CREATE configuration for:
  - Development: Console exporter
  - Staging: Jaeger/OTLP exporter
  - Production: Optimized sampling and export
  - Testing: Disabled or memory exporter
```

### Per Task Pseudocode

```typescript
// Task 2: Instrumentation Bootstrap Pattern
// src/shared/telemetry/instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  serviceName: process.env.OTEL_SERVICE_NAME || 'modular-monolith',
  serviceVersion: process.env.SERVICE_VERSION || '1.0.0',
  instrumentations: [getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-winston': {
      enabled: true,
      logHook: (span, record) => {
        // Custom log correlation logic
      }
    }
  })],
  // Exporter configuration based on environment
});

sdk.start();

// Task 3: Winston Integration Pattern
// src/shared/logger/winston.config.ts
import { trace, context } from '@opentelemetry/api';

const traceFormat = winston.format((info) => {
  const activeSpan = trace.getActiveSpan();
  if (activeSpan) {
    const spanContext = activeSpan.spanContext();
    // Inject into existing log metadata without changing interface
    info.trace_id = spanContext.traceId;
    info.span_id = spanContext.spanId;
    info.trace_flags = spanContext.traceFlags.toString(16);
  }
  return info;
});

// Task 5: Manual Instrumentation Helpers
// src/shared/telemetry/tracer.ts
export const createTracer = (name: string) => trace.getTracer(name);

export const withSpan = async <T>(
  tracer: Tracer,
  name: string,
  fn: (span: Span) => Promise<T>,
  attributes?: Record<string, string | number>
): Promise<T> => {
  return tracer.startActiveSpan(name, async (span) => {
    try {
      if (attributes) span.setAttributes(attributes);
      return await fn(span);
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
};
```

### Integration Points
```yaml
WINSTON_INTEGRATION:
  - ensure: All existing log calls automatically get trace context
  - preserve: Current log levels, formats, and transport configurations
  - pattern: "logger.info('message', metadata)" continues to work unchanged

MIDDLEWARE_INTEGRATION:
  - ensure: HTTP requests create root spans automatically
  - pattern: Express middleware propagates context to all downstream operations

DATABASE_INTEGRATION:
  - ensure: All DB queries are automatically instrumented
  - pattern: Connection pools and query operations create child spans

BOUNDED_CONTEXT_INTEGRATION:
  - ensure: Inter-context calls maintain trace continuity  
  - pattern: Service calls propagate context across boundaries
```

## Validation Loop

### Level 1: Initialization & Basic Setup
```bash
# Verify OpenTelemetry initializes without errors
pnpm run dev
# Expected: No OTel-related startup errors in console

# Check trace context in logs
# Start application and make a request
curl -X GET http://localhost:3000/health
# Expected: Logs show trace_id and span_id fields
```

### Level 2: Auto-Instrumentation Validation
```typescript
// Test that HTTP requests create spans
// Make API calls and verify spans are generated
curl -X POST http://localhost:3000/api/example \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

// Expected: Spans visible in exporter (console/Jaeger)
// Expected: Winston logs include trace_id and span_id
```

### Level 3: Manual Instrumentation Testing
```bash
# Test custom spans in business logic
# Verify nested span relationships
# Check span attributes and events

# Run business operations that use manual instrumentation
# Expected: Custom spans appear with correct parent-child relationships
```

### Level 4: Integration & Performance Testing
```bash
# Load testing with telemetry enabled
pnpm run test:load

# Performance impact measurement
pnpm run test:performance

# Expected: < 5% performance overhead
# Expected: Memory usage remains stable
# Expected: No span leaks or memory leaks
```

## Final Validation Checklist
- [ ] OpenTelemetry SDK initializes successfully in all environments
- [ ] All HTTP requests automatically generate traces
- [ ] Database operations create child spans automatically  
- [ ] Winston logs contain trace_id and span_id in all entries
- [ ] Manual instrumentation helpers work correctly
- [ ] Traces export successfully to configured backend
- [ ] No breaking changes to existing logging patterns
- [ ] Performance overhead meets < 5% requirement
- [ ] All bounded contexts participate in tracing
- [ ] Error scenarios properly recorded in spans
- [ ] Context propagation works across async boundaries
- [ ] Environment-specific configuration loads correctly
- [ ] TypeScript compilation succeeds: `pnpm run type-check`
- [ ] All existing tests pass: `pnpm test`
- [ ] Integration tests pass with tracing enabled

## Anti-Patterns to Avoid
- ❌ Don't initialize OpenTelemetry after other imports - must be first
- ❌ Don't manually manage span lifecycle without proper error handling
- ❌ Don't break existing Winston logging patterns or formats
- ❌ Don't create memory leaks by not ending spans properly
- ❌ Don't sample at 100% in production - use appropriate sampling rates
- ❌ Don't add manual instrumentation to already auto-instrumented operations
- ❌ Don't ignore context propagation in async operations
- ❌ Don't hardcode exporter configurations - use environment variables
- ❌ Don't create spans for every small operation - focus on business-critical paths
- ❌ Don't disable tracing in staging - test with production-like configuration