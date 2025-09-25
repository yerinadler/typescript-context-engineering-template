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

### Observability
The observability for this project relies on `Opentelemetry` which is an open-source unified frameworks for modern observability.
#### Logging
The `src/shared/logging` directory contains the framework-wide logging abstraction. It provides a type-safe interface that hides the Winston implementation details while supporting:

- **Structured JSON output** for consistent log ingestion.
- **Environment-aware log levels**, defaulting to `debug` locally and `info` in production-like environments.
- **Trace and span correlation** fields (`trace_id` and `span_id`) to integrate with future OpenTelemetry instrumentation.

The module exports a singleton `frameworkLogger` instance, ensuring the Winston logger is only initialised once and reused across the application. Use `createLogger` to create child loggers with additional contextual metadata when needed.
