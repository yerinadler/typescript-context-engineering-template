# Tools and Frameworks
This document describes the tech stack and custom frameworks used to power this project.

## Tech Stack
This section explains the foundational tech stack used in this project

- **Express** - Web / API Framework that powers an entire application
- **Postgres** - The primary database
- **Prisma** - The primary ORM for data modeling and migrations
- **Redis** - Simply for caching
- **Kafka** - Event broker for event-driven architecture

## Web Server
The `src/shared/server` contains the base web server which in turns register `API Controllers` that exposes services or use cases through HTTP API

## Controller
The `src/shared/controller` contains a router interface in `controller.interface.ts` file and the abstract base controller in `base.ts` file

## API Utilities
The `src/shared/api` folder centralises API response helpers. Use `createSuccessResponse` and `createErrorResponse` to ensure responses follow the documented `BaseResponse` and `BaseErrorResponse` shapes.
