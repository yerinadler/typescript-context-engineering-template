# Tools and Frameworks
This document describes the tech stack and custom frameworks used to power this project.

## Tech Stack
This project utilises the following tools, frameworks, and libraries to build a foundational framework of the application

- **Express** - Web / API Framework that powers an entire application
- **Postgres** - The primary database
- **Prisma** - The primary ORM for data modeling and migrations

### Prisma models
Since this project is a modular monolith, the main `prisma.schema` acts only as an entrypoint that imports other schema. In the early stage, only a single prisma schema file is used.

## Foundational Framework
The foundational framework is the fundamental building blocks that enable this modular monolith application. All the components of the foundational framework is located in the `src/shared/` directory.

### The Base Application
The base application is the main building block that orchestrates application startup, dependency wiring across different bounded contexts (modules).

This component lives inside the `src/shared/app` directory.

### Web Server
The `src/shared/server` contains the base web server which in turns register `API Controllers` that exposes services or use cases through HTTP API. It is implemented on top of the well-known web framework `Express.js`

#### Graceful Shutdown
The Server class implements graceful shutdown functionality to ensure consistent application state during termination:

- **Signal Handling**: Listens for SIGINT and SIGTERM process signals
- **Graceful Termination**: Allows pending requests to complete before shutdown
- **Timeout Protection**: Forces shutdown after 15 seconds to prevent hanging processes
- **Error Handling**: Properly handles server close errors and edge cases
- **Multiple Attempt Protection**: Prevents multiple shutdown attempts with internal state tracking

The graceful shutdown ensures that the server can be safely terminated without leaving requests in an inconsistent state.

### Controller
The `src/shared/controller` contains a router interface in `controller.interface.ts` file and the abstract base controller in `base.ts` file

### API Utilities
The `src/shared/api` folder centralises API response helpers. Use `createSuccessResponse` and `createErrorResponse` to ensure responses follow the documented `BaseResponse` and `BaseErrorResponse` shapes.

### Validation
The `src/shared/validation` module standardises request parsing with Zod schemas. Use the shared field helpers (e.g. `requiredString`, `requiredNumber`) together with `validateRequest` to replace manual parameter trimming and type coercion in controllers. All validation failures are converted to `BadRequestError` for consistent API responses.

### Observability
The observability for this project relies on `OpenTelemetry`, which ships with automatic tracing and metrics instrumentation.

#### Telemetry Runtime
- `src/shared/telemetry` initialises the `NodeSDK` with OTLP trace and metric exporters the moment the application starts (`src/index.ts` awaits telemetry before loading Express).
- Automatic instrumentations cover HTTP, Express, PostgreSQL, and Prisma. Use environment toggles (`OTEL_TRACES_ENABLED`, `OTEL_METRICS_ENABLED`, `OTEL_SDK_DISABLED`) to disable specific signals when needed.
- Sampling defaults to `1.0` outside production-like environments and can be tuned via `OTEL_TRACES_SAMPLER_RATIO`.
- Hooks on `SIGINT`/`SIGTERM` flush exporters before shutdown to avoid dropping telemetry data.

#### Manual Tracing Helpers
- Import `getTracer`, `withSpan`, or `withSpanSync` from `src/shared/telemetry` to wrap domain logic in custom spans.
- Helper functions automatically manage span lifecycle, attach optional attributes, and set `SpanStatusCode.ERROR` with recorded exceptions when handlers throw.

#### Logging
The `src/shared/logging` directory contains the framework-wide logging abstraction. It provides a type-safe interface that hides the Winston implementation details while supporting:

- **Structured JSON output** for consistent log ingestion.
- **Environment-aware log levels**, defaulting to `debug` locally and `info` in production-like environments.
- **Trace correlation** fields (`trace_id`, `span_id`, `trace_flags`) sourced from the active OpenTelemetry context so all logs align with distributed traces.

The module exports a singleton `frameworkLogger` instance, ensuring the Winston logger is only initialised once and reused across the application. Use `createLogger` to create child loggers with additional contextual metadata when needed.
