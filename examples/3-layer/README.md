# 3-Layer Architecture Example

This directory contains a complete implementation of the traditional 3-Layer Architecture pattern demonstrating a Todo Management System in TypeScript.

## Overview

The 3-Layer Architecture is a proven architectural pattern that separates application concerns into three distinct layers, each with a specific responsibility:

1. **Presentation Layer** (Controllers) - Handles HTTP requests/responses
2. **Business Logic Layer** (Services) - Contains business rules and validation
3. **Data Access Layer** (DAOs) - Manages data persistence and retrieval

## Directory Structure

```
examples/3-layer/
├── controllers/           # Presentation Layer
│   ├── todo.controller.ts
│   └── todo.controller.spec.ts
├── services/             # Business Logic Layer
│   ├── todo.service.ts
│   └── todo.service.spec.ts
├── dal/                  # Data Access Layer
│   ├── todo.dao.ts
│   └── todo.dao.spec.ts
├── types.ts              # Shared interfaces and DTOs
├── example-usage.ts      # Usage examples
├── BOUNDED_CONTEXT.md    # Architecture documentation
└── README.md            # This file
```

## Layer Responsibilities

### 1. Data Access Layer (DAL)
- **File**: `dal/todo.dao.ts`
- **Purpose**: Handles data persistence and retrieval operations
- **Responsibilities**:
  - CRUD operations (Create, Read, Update, Delete)
  - Data storage management (in-memory array)
  - ID generation for entities
  - Returns pure data entities

### 2. Business Logic Layer (Services)
- **File**: `services/todo.service.ts`
- **Purpose**: Contains business rules, validation, and orchestration
- **Responsibilities**:
  - Input validation (required fields, format checks)
  - Business rule enforcement
  - Orchestrating DAO operations
  - Error handling for business logic violations

### 3. Presentation Layer (Controllers)
- **File**: `controllers/todo.controller.ts`
- **Purpose**: Handles HTTP request/response lifecycle
- **Responsibilities**:
  - HTTP request parsing
  - Response formatting (JSON)
  - HTTP status code management
  - Error response handling

## Data Models

### Core Entity
```typescript
interface Todo {
  id: string;           // Unique identifier
  title: string;        // Todo title
  description: string;  // Todo description
  isComplete: boolean;  // Completion status
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

### Data Transfer Objects (DTOs)
```typescript
interface CreateTodoDTO {
  title: string;        // Required input
  description: string;  // Required input
}

interface UpdateTodoDTO {
  title?: string;       // Optional update
  description?: string; // Optional update
  isComplete?: boolean; // Optional completion status
}
```

## API Endpoints

The controller provides RESTful endpoints:

- `POST /todos` - Create a new todo
- `GET /todos` - Get all todos
- `GET /todos/:id` - Get todo by ID
- `PUT /todos/:id` - Update todo by ID
- `DELETE /todos/:id` - Delete todo by ID

## Usage Examples

### Basic Usage
```typescript
import { TodoDAO } from './dal/todo.dao';
import { TodoService } from './services/todo.service';
import { TodoController } from './controllers/todo.controller';

// Initialize layers (bottom-up)
const dao = new TodoDAO();
const service = new TodoService(dao);
const controller = new TodoController(service);

// Direct service usage
const todo = await service.createTodo({
  title: 'Learn Architecture',
  description: 'Understand 3-layer pattern'
});
```

### Express Integration
```typescript
import express from 'express';
import { app } from './example-usage';

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Todo API running on port ${PORT}`);
});
```

## Dependency Flow

The architecture enforces a strict downward dependency flow:

```
Controller → Service → DAO
```

- Controllers depend only on Services
- Services depend only on DAOs
- DAOs have no dependencies on upper layers
- Each layer is isolated and testable

## Testing

Comprehensive test coverage with 37 tests:
- **DAO Tests**: Data persistence operations
- **Service Tests**: Business logic validation
- **Controller Tests**: HTTP request/response handling

Run tests:
```bash
npm test examples/3-layer
```

## Architecture Principles

### Single Responsibility Principle
- Each layer has one clear purpose
- Controllers handle HTTP concerns only
- Services handle business logic only
- DAOs handle data operations only

### Separation of Concerns
- Clear boundaries between layers
- No business logic in controllers
- No HTTP concerns in services
- No business rules in DAOs

### Dependency Inversion
- Higher layers depend on abstractions (interfaces)
- Dependencies flow in one direction (downward)
- Easy to test and mock dependencies

## When to Use This Pattern

**Good fit for**:
- Medium complexity applications
- Business applications with moderate logic
- Teams familiar with traditional layered architecture
- Projects requiring faster delivery with acceptable trade-offs

**Consider alternatives for**:
- Simple CRUD applications (use presentation-only)
- Complex domain-heavy applications (use Clean Architecture)
- Microservices requiring strict domain boundaries

## Key Benefits

1. **Familiar Pattern**: Well-understood by most developers
2. **Clear Structure**: Easy to navigate and understand
3. **Testable**: Each layer can be tested independently
4. **Maintainable**: Changes are isolated to appropriate layers
5. **Pragmatic**: Good balance of structure and simplicity

## Implementation Quality

- ✅ TypeScript strict mode compliance
- ✅ Comprehensive error handling
- ✅ Complete test coverage
- ✅ Proper layer separation
- ✅ RESTful API design
- ✅ Documentation and examples