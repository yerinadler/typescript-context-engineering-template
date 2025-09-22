name: Example 3 Layer with Todo list
description: An example application in a modular monolith for todo list using 3 Layer Architecture

## Purpose
Build a Todo Management System demonstrating the traditional 3-layer architecture pattern with clear separation between presentation, business logic, and data access layers. This showcases a straightforward layered approach commonly used in enterprise applications.

## Core Principles
1. **3-Layer Architecture**: Clear separation of concerns across presentation, business, and data layers
2. **Layered Dependencies**: Each layer only depends on the layer directly below it
3. **Business Logic Centralization**: All business rules contained within the service layer
4. **Data Access Abstraction**: DAO pattern for data persistence operations

---

## Goal
Create a functional Todo Management System that demonstrates traditional 3-layer architecture implementation in TypeScript, with proper layer separation and dependency flow.

## Why
- **Architecture Demonstration**: Showcase traditional 3-layer patterns in TypeScript
- **Learning Resource**: Provide reference implementation for layered architecture
- **Business Value**: Functional todo management with clear layer boundaries
- **Simplicity**: Demonstrate straightforward architecture without complex abstractions

## What
A layered Todo Management System featuring:
- Controllers for handling HTTP requests and responses
- Services containing business logic and validation
- Data Access Objects (DAO) for data operations
- In-memory data storage implementation
- TypeScript implementation with proper typing

### Success Criteria
- [ ] Presentation layer with todo controllers
- [ ] Business logic layer with todo services
- [ ] Data access layer with in-memory DAO
- [ ] CRUD operations for todo management
- [ ] Proper layer separation and dependencies
- [ ] TypeScript strict mode compliance
- [ ] Basic error handling and validation

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://martinfowler.com/eaaCatalog/serviceLayer.html
  why: Service layer patterns and best practices
  
- url: https://martinfowler.com/eaaCatalog/dataAccessObject.html
  why: Data Access Object pattern implementation
  
- url: https://www.typescriptlang.org/docs/handbook/2/classes.html
  why: TypeScript class patterns and method definitions
  
- file: ../../../docs/ARCHITECTURE.md
  why: Project-wide architectural guidelines
  
- file: ../../../AGENTS.md 
  why: Development workflow and conventions
  
- file: ../BOUNDED_CONTEXT.md
  why: Context-specific architectural patterns

- url: https://en.wikipedia.org/wiki/Multitier_architecture
  why: 3-tier/3-layer architecture principles and patterns
```

### Current Codebase Structure (TO BE IMPLEMENTED)
```bash
examples/3-layer/
├── BOUNDED_CONTEXT.md           # ✅ Context documentation
├── controllers/                 # 🔄 Presentation layer (HTTP handling)
│   └── todo.controller.ts       # 🔄 Todo HTTP operations
├── services/                    # 🔄 Business logic layer
│   └── todo.service.ts          # 🔄 Todo business operations
├── dal/                         # 🔄 Data access layer
│   └── todo.dao.ts              # 🔄 Todo data operations (in-memory)
└── prps/                        # ✅ Product requirements
    └── initial_feature.md       # ✅ This PRP document
```

### Architecture Implementation Summary
```bash
# 3-LAYER ARCHITECTURE STRUCTURE
Presentation Layer (Controllers):
├── Todo Controller              # 🔄 HTTP request/response handling
│   ├── GET /todos              # 🔄 List all todos
│   ├── POST /todos             # 🔄 Create new todo
│   ├── PUT /todos/:id          # 🔄 Update existing todo
│   └── DELETE /todos/:id       # 🔄 Delete todo

Business Logic Layer (Services):
├── Todo Service               # 🔄 Business logic orchestration
│   ├── Input validation       # 🔄 Business rule validation
│   ├── Business operations    # 🔄 Todo CRUD logic
│   └── DAO interaction        # 🔄 Data persistence calls

Data Access Layer (DAL):
└── Todo DAO                   # 🔄 In-memory data operations
    ├── CRUD operations        # 🔄 Create, Read, Update, Delete
    ├── Data storage           # 🔄 In-memory array storage
    └── Data retrieval         # 🔄 Query and filter operations
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: TypeScript strict mode requires proper type annotations
// CRITICAL: Controllers should only handle HTTP concerns (request/response)
// CRITICAL: Services contain ALL business logic and validation
// CRITICAL: DAOs handle ONLY data persistence and retrieval
// CRITICAL: Dependencies flow downward: Controller -> Service -> DAO
// CRITICAL: Use proper error handling at each layer
// CRITICAL: In-memory storage should simulate real database operations
// CRITICAL: Each layer should have single responsibility
```

## Implementation Blueprint

### Data models and structure

```typescript
// Shared Todo model across all layers
export interface Todo {
  id: string;                        // 🔄 UUID for unique identification
  title: string;                     // 🔄 Todo title
  description: string;               // 🔄 Todo description
  isComplete: boolean;               // 🔄 Completion status
  createdAt: Date;                   // 🔄 Creation timestamp
  updatedAt: Date;                   // 🔄 Last update timestamp
}

// DTOs for API operations
export interface CreateTodoDTO {
  title: string;                     // 🔄 Required input
  description: string;               // 🔄 Required input
}

export interface UpdateTodoDTO {
  title?: string;                    // 🔄 Optional update
  description?: string;              // 🔄 Optional update
  isComplete?: boolean;              // 🔄 Optional completion status
}

// API Response types
export interface TodoResponse {
  success: boolean;                  // 🔄 Operation result
  data?: Todo | Todo[];              // 🔄 Response data
  message?: string;                  // 🔄 Error or success message
}
```

### List of implementation tasks

```yaml
Task 1: Data Access Layer (DAL) Implementation
CREATE dal/todo.dao.ts:
  - 🔄 PATTERN: Data Access Object with in-memory storage
  - 🔄 UUID generation for unique identifiers
  - 🔄 CRUD operations (Create, Read, Update, Delete)
  - 🔄 In-memory array for data persistence
  - 🔄 Async/await pattern for consistency

Task 2: Business Logic Layer Implementation  
CREATE services/todo.service.ts:
  - 🔄 PATTERN: Service layer with business logic
  - 🔄 Input validation and business rules
  - 🔄 DAO dependency injection
  - 🔄 Error handling and business exceptions
  - 🔄 Todo lifecycle management

Task 3: Presentation Layer Implementation
CREATE controllers/todo.controller.ts:
  - 🔄 PATTERN: HTTP request/response handling
  - 🔄 Service layer dependency injection
  - 🔄 RESTful API endpoints (GET, POST, PUT, DELETE)
  - 🔄 Request validation and response formatting
  - 🔄 HTTP status code management

Task 4: Data Transfer Objects
CREATE shared types and interfaces:
  - 🔄 PATTERN: Input/output data contracts
  - 🔄 Request/response type definitions
  - 🔄 Proper TypeScript interface definitions
  - 🔄 Validation-ready structure

Task 5: Error Handling
CREATE error handling across layers:
  - 🔄 PATTERN: Consistent error handling strategy
  - 🔄 Business logic exceptions
  - 🔄 HTTP error responses
  - 🔄 Validation error messages

Task 6: Architecture Documentation
UPDATE BOUNDED_CONTEXT.md:
  - 🔄 PATTERN: Context documentation with frontmatter
  - 🔄 3-Layer Architecture principles explanation
  - 🔄 Strategic classification as example context
  - 🔄 Implementation guidelines and patterns
```

### Per task implementation details

```typescript
// Task 1: DAL Implementation - todo.dao.ts
export class TodoDAO {
  private todos: Todo[] = [];

  async create(todoData: CreateTodoDTO): Promise<Todo> {
    // 🔄 PATTERN: Data persistence with auto-generated fields
    const todo: Todo = {
      id: v4(),                        // 🔄 UUID generation
      title: todoData.title,
      description: todoData.description,
      isComplete: false,               // 🔄 Default state
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.todos.push(todo);
    return todo;
  }

  async findAll(): Promise<Todo[]> {
    return [...this.todos];            // 🔄 Return defensive copy
  }

  async findById(id: string): Promise<Todo | null> {
    return this.todos.find(t => t.id === id) || null;
  }

  async update(id: string, updates: UpdateTodoDTO): Promise<Todo | null> {
    const todoIndex = this.todos.findIndex(t => t.id === id);
    if (todoIndex === -1) return null;
    
    this.todos[todoIndex] = {
      ...this.todos[todoIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    return this.todos[todoIndex];
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter(t => t.id !== id);
    return this.todos.length < initialLength;
  }
}

// Task 2: Service Layer Implementation - todo.service.ts  
export class TodoService {
  constructor(private readonly todoDAO: TodoDAO) {}

  async createTodo(todoData: CreateTodoDTO): Promise<Todo> {
    // 🔄 PATTERN: Business validation
    if (!todoData.title?.trim()) {
      throw new Error('Title is required');
    }
    if (!todoData.description?.trim()) {
      throw new Error('Description is required');
    }
    
    // 🔄 PATTERN: Delegate to DAO for persistence
    return await this.todoDAO.create(todoData);
  }

  async getAllTodos(): Promise<Todo[]> {
    return await this.todoDAO.findAll();
  }

  async getTodoById(id: string): Promise<Todo | null> {
    if (!id?.trim()) {
      throw new Error('ID is required');
    }
    
    return await this.todoDAO.findById(id);
  }

  async updateTodo(id: string, updates: UpdateTodoDTO): Promise<Todo | null> {
    if (!id?.trim()) {
      throw new Error('ID is required');
    }
    
    // 🔄 PATTERN: Business validation for updates
    if (updates.title !== undefined && !updates.title.trim()) {
      throw new Error('Title cannot be empty');
    }
    
    return await this.todoDAO.update(id, updates);
  }

  async deleteTodo(id: string): Promise<boolean> {
    if (!id?.trim()) {
      throw new Error('ID is required');
    }
    
    return await this.todoDAO.delete(id);
  }
}

// Task 3: Controller Implementation - todo.controller.ts
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  async createTodo(req: Request, res: Response): Promise<void> {
    try {
      // 🔄 PATTERN: HTTP request handling
      const todoData: CreateTodoDTO = req.body;
      const todo = await this.todoService.createTodo(todoData);
      
      res.status(201).json({
        success: true,
        data: todo,
        message: 'Todo created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllTodos(req: Request, res: Response): Promise<void> {
    try {
      const todos = await this.todoService.getAllTodos();
      
      res.status(200).json({
        success: true,
        data: todos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getTodoById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const todo = await this.todoService.getTodoById(id);
      
      if (!todo) {
        res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: todo
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateTodoDTO = req.body;
      
      const todo = await this.todoService.updateTodo(id, updates);
      
      if (!todo) {
        res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: todo,
        message: 'Todo updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.todoService.deleteTodo(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: 'Todo deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
```

### Integration Points
```yaml
DEPENDENCIES (TO BE IMPLEMENTED):
  - TypeScript: Strict type checking and ES2022 target
  - UUID: v4 generation for unique identifiers
  - Express: HTTP server framework (optional for controllers)
  - ESLint: Code quality and style enforcement
  - Prettier: Consistent code formatting

ARCHITECTURE COMPLIANCE:
  - 3-Layer Architecture: 🔄 Proper layer separation
  - Downward Dependencies: 🔄 Controller -> Service -> DAO
  - Single Responsibility: 🔄 Each layer has distinct purpose
  - Separation of Concerns: 🔄 Clear boundaries between layers
  
LAYER RESPONSIBILITIES:
  - Controllers: 🔄 HTTP handling, request/response formatting
  - Services: 🔄 Business logic, validation, orchestration
  - DAOs: 🔄 Data persistence, CRUD operations
  - Models: 🔄 Data structure definitions and types
```

## Validation Loop

### Level 1: Syntax & Style (TO BE VALIDATED)
```bash
# TypeScript compilation and linting
pnpm lint --fix                 # 🔄 ESLint auto-fix to be applied
pnpm format                     # 🔄 Prettier formatting to be applied  
tsc --noEmit                    # 🔄 TypeScript compilation to be verified

# Expected Results: 🔄 No errors, all style guidelines followed
```

### Level 2: Unit Tests (TO BE IMPLEMENTED)
```typescript
// todo.dao.spec.ts - Data access layer tests
describe('TodoDAO', () => {
  test('should create todo with UUID and timestamps', async () => {
    const dao = new TodoDAO();
    const todo = await dao.create({
      title: 'Test Todo',
      description: 'Test Description'
    });
    
    expect(todo.id).toBeDefined();                    // 🔄 UUID generated
    expect(todo.title).toBe('Test Todo');            // 🔄 Title set
    expect(todo.description).toBe('Test Description'); // 🔄 Description set
    expect(todo.isComplete).toBe(false);             // 🔄 Default incomplete
    expect(todo.createdAt).toBeInstanceOf(Date);     // 🔄 Timestamp set
  });

  test('should find todo by id', async () => {
    const dao = new TodoDAO();
    const created = await dao.create({
      title: 'Find Test',
      description: 'Find Description'
    });
    
    const found = await dao.findById(created.id);
    expect(found).toEqual(created);                  // 🔄 Todo retrieved
  });
});

// todo.service.spec.ts - Business logic tests
describe('TodoService', () => {
  test('should validate input and create todo', async () => {
    const mockDAO = new TodoDAO();
    const service = new TodoService(mockDAO);
    
    const todo = await service.createTodo({
      title: 'Service Test',
      description: 'Service Description'
    });
    
    expect(todo.title).toBe('Service Test');         // 🔄 Business logic applied
  });

  test('should throw error for invalid input', async () => {
    const mockDAO = new TodoDAO();
    const service = new TodoService(mockDAO);
    
    await expect(service.createTodo({
      title: '',
      description: 'Description'
    })).rejects.toThrow('Title is required');        // 🔄 Validation working
  });
});

// todo.controller.spec.ts - Presentation layer tests
describe('TodoController', () => {
  test('should handle HTTP request and return proper response', async () => {
    const mockDAO = new TodoDAO();
    const service = new TodoService(mockDAO);
    const controller = new TodoController(service);
    
    const mockReq = {
      body: { title: 'Controller Test', description: 'Controller Description' }
    } as Request;
    
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    
    await controller.createTodo(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(201); // 🔄 HTTP status correct
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.any(Object)
      })
    );                                                // 🔄 Response format correct
  });
});
```

```bash
# Test Results: 🔄 TO BE IMPLEMENTED
jest --coverage
# Expected Coverage: 90%+ statements, branches, functions, lines
```

### Level 3: Integration Test (TO BE IMPLEMENTED)
```typescript
// Integration test demonstrating full 3-layer flow
describe('Todo Management 3-Layer Integration', () => {
  test('should handle complete request flow through all layers', async () => {
    // 🔄 Data Access Layer
    const dao = new TodoDAO();
    
    // 🔄 Business Logic Layer
    const service = new TodoService(dao);
    
    // 🔄 Presentation Layer
    const controller = new TodoController(service);
    
    // 🔄 Simulate HTTP request
    const mockReq = {
      body: {
        title: 'Integration Test Todo',
        description: 'Testing complete 3-layer flow'
      }
    } as Request;
    
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    
    // 🔄 Execute complete flow
    await controller.createTodo(mockReq, mockRes);
    
    // 🔄 Verify response through controller
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          title: 'Integration Test Todo',
          description: 'Testing complete 3-layer flow',
          isComplete: false
        })
      })
    );
    
    // 🔄 Verify persistence through DAO
    const allTodos = await dao.findAll();
    expect(allTodos).toHaveLength(1);
    expect(allTodos[0].title).toBe('Integration Test Todo');
  });
});

# Integration Test Results: 🔄 TO BE IMPLEMENTED
# - Controllers: HTTP handling working properly 🔄
# - Services: Business logic orchestrating correctly 🔄  
# - DAOs: Data persistence functioning 🔄
```

## Final Validation Checklist (TO BE COMPLETED)
- [ ] All tests pass: `jest --coverage` 🔄 90%+ coverage target
- [ ] No linting errors: `pnpm lint --fix` 🔄 All style issues to be resolved  
- [ ] No type errors: `tsc --noEmit` 🔄 TypeScript compilation to be verified
- [ ] 3-Layer Architecture compliance 🔄 Proper layer separation to be maintained
- [ ] Controller HTTP handling 🔄 Request/response properly managed
- [ ] Service business logic 🔄 Validation and orchestration properly implemented
- [ ] DAO data operations 🔄 CRUD operations working correctly
- [ ] In-memory storage 🔄 Data persistence functioning
- [ ] BOUNDED_CONTEXT.md documentation 🔄 Context to be properly documented
- [ ] Integration testing 🔄 Full architectural flow to be validated

---

## Anti-Patterns to Avoid 🔄
- 🔄 Controllers should not contain business logic
- 🔄 Services should not handle HTTP concerns
- 🔄 DAOs should not contain business validation
- 🔄 Avoid circular dependencies between layers
- 🔄 Dependencies must flow downward only
- 🔄 TypeScript strict mode to be enforced throughout
- 🔄 Proper error handling at each layer boundary
- 🔄 Clear separation of concerns maintained across layers

## Implementation Quality Score: To Be Determined

Implementation confidence will be based on:
- 🔄 Complete 3-Layer Architecture implementation
- 🔄 All layer responsibilities properly separated
- 🔄 Comprehensive test coverage achieved
- 🔄 TypeScript best practices followed
- 🔄 Traditional layered architecture patterns implemented
- 🔄 DAO pattern correctly implemented
- 🔄 Service layer properly orchestrated
- 🔄 Full documentation and validation completed

This implementation will serve as a reference example for traditional 3-Layer Architecture in TypeScript, demonstrating clear layer separation and straightforward enterprise patterns.