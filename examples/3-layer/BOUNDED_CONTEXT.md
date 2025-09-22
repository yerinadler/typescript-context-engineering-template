---
boundedContext: 3 Layer
architecture: 3 Layer Architecture
strategicClassification: example
---

# 3-Layer Architecture Example

This is an example project demonstrating the traditional 3-Layer Architecture pattern for a Todo Management System. This serves as a reference implementation for layered architecture in TypeScript.

## Architecture Overview

This implementation follows the traditional 3-layer architecture pattern with clear separation of concerns:

### Layer 1: Presentation Layer (Controllers)
- **Location**: `controllers/`
- **Responsibility**: HTTP request/response handling
- **Pattern**: RESTful API endpoints
- **Dependencies**: Service layer only

### Layer 2: Business Logic Layer (Services)
- **Location**: `services/`
- **Responsibility**: Business logic, validation, and orchestration
- **Pattern**: Service pattern with dependency injection
- **Dependencies**: Data Access layer only

### Layer 3: Data Access Layer (DAOs)
- **Location**: `dal/`
- **Responsibility**: Data persistence and retrieval
- **Pattern**: Data Access Object (DAO) pattern
- **Dependencies**: In-memory storage (simulating database)

## Key Principles

1. **Downward Dependencies**: Controller → Service → DAO
2. **Single Responsibility**: Each layer has a distinct purpose
3. **Separation of Concerns**: Clear boundaries between layers
4. **Business Logic Centralization**: All business rules in service layer

## Implementation Features

- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **UUID Generation**: Unique identifiers for all entities
- **Input Validation**: Business rule validation in service layer
- **Error Handling**: Consistent error handling across all layers
- **TypeScript**: Strict typing with proper interfaces
- **In-Memory Storage**: Simulates database operations

## Usage

This example demonstrates how to structure a medium-complexity application using traditional layered architecture, suitable for enterprise applications where Clean Architecture might be too heavy.