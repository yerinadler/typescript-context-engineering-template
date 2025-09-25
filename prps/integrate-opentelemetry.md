name: "Integrate Opentelemetry SDK to the project"
description: |
  Setup and integrate Opentelemetry to the project.

## Goal
To enable fully-fledged observability capability to the project by enabling logs (we have done that in Winston with abstracted logger interface), traces, and metrics.

## Why
Though this is simply a modular monolith, it is essential to include observability to the project as a foundational framework so we can understand more about our system behaviours and metrics in production.

## What


### Success Criteria
- [ ] All controllers use express-async-handler for async route handlers
- [ ] Zero try-catch blocks remain in controller methods
- [ ] All controllers follow consistent Router pattern structure
- [ ] Input validation still throws appropriate errors
- [ ] All existing functionality preserved (same responses, same validation)
- [ ] Error handling is centralized in middleware

## All Needed Context

### Documentation & References
```yaml
- file: examples/inventory/controllers/inventory_item.controller.ts
  why: Target pattern to follow - shows correct Router usage with express-async-handler
  
- file: examples/clean/todo/infrastructure/web/todo.controller.ts  
  why: Current problematic pattern with manual try-catch blocks to be refactored

- docfile: src/shared/controller/base.ts
  why: BaseController pattern that should be replaced with Router pattern

- docfile: src/shared/errors/index.ts
  why: Error classes that should continue to be thrown (not caught in controllers)
```

### Current Codebase Structure
```bash
# Controllers are located in:
examples/
├── clean/todo/infrastructure/web/todo.controller.ts
├── inventory/controllers/inventory_item.controller.ts
└── other example controllers...

src/contexts/
├── [bounded-context-1]/infrastructure/web/*.controller.ts
├── [bounded-context-2]/infrastructure/web/*.controller.ts
└── other bounded contexts...

src/shared/
├── controller/base.ts (BaseController - to be phased out)
├── errors/index.ts (Error classes - keep using these)
└── api/index.ts (Response helpers - keep using these)
```

### Desired Pattern (Target Architecture)
```typescript
// Standard controller structure to implement
export class ExampleController {
  public readonly basePath: string = '/your-path';
  private _router: Router;

  get router() { return this._router; }

  constructor(dependencies) {
    this._router = ExpressRouter();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this._router.post('/', expressAsyncHandler(this.create.bind(this)));
    this._router.get('/:id', expressAsyncHandler(this.getById.bind(this)));
  }

  private async create(req: Request, res: Response) {
    // Only business logic - no try-catch
    const dto = this.validateAndCreateDTO(req.body);
    const result = await this.useCase.execute(dto);
    res.status(201).json(createSuccessResponse('CREATED', 'Resource created', result));
  }
}
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: express-async-handler automatically catches async errors
// GOTCHA: Must bind methods with .bind(this) when registering routes
// GOTCHA: Don't wrap non-async handlers with expressAsyncHandler
// CRITICAL: Validation methods should throw errors, not return them
// GOTCHA: BaseController extends Router internally - new pattern uses composition
// CRITICAL: Error middleware must be registered AFTER all routes in server setup
```

## Implementation Blueprint

### Data Models and Structure
No new data models needed - preserving existing DTOs, entities, and error classes.

### List of Tasks (in order)

```yaml
Task 1: "Identify All Controller Files"
SCAN directories:
  - examples/**/*controller*.ts 
  - examples/**/*Controller*.ts
  - src/contexts/**/*controller*.ts
  - src/contexts/**/*Controller*.ts
CREATE list of files to process

Task 2: "Update Imports and Dependencies"  
MODIFY each controller file:
  - ADD import: "import { Router as ExpressRouter } from 'express'"
  - ADD import: "import expressAsyncHandler from 'express-async-handler'"
  - REMOVE import: BaseController related imports
  - PRESERVE: All business logic imports (DTOs, use cases, services)

Task 3: "Replace Class Structure"
MODIFY class definition:
  - REMOVE: "extends BaseController"
  - ADD: "public readonly basePath: string = '/your-path'"
  - ADD: "private _router: Router"
  - ADD: "get router() { return this._router; }"

Task 4: "Refactor Constructor and Route Registration"
MODIFY constructor:
  - REMOVE: super() call
  - ADD: "this._router = ExpressRouter()"
  - REPLACE: this.addRoute() calls with this._router.METHOD() calls
  - WRAP: All async handlers with expressAsyncHandler()
  - BIND: All methods with .bind(this)

Task 5: "Remove Error Handling from Methods"
MODIFY all controller methods:
  - REMOVE: try-catch blocks entirely
  - REMOVE: handleError method calls
  - PRESERVE: Business logic, validation, DTO creation
  - PRESERVE: Response creation (createSuccessResponse, etc.)

Task 6: "Clean Up Dead Code"
REMOVE from each file:
  - handleError methods
  - Any error response creation in controllers
  - Unused error handling imports
```

### Per Task Pseudocode

```typescript
// Task 4: Route Registration Pattern
private initializeRoutes(): void {
  // OLD PATTERN (remove):
  // this.addRoute('post', '/', this.create);
  
  // NEW PATTERN (implement):
  this._router.post('/', expressAsyncHandler(this.create.bind(this)));
  this._router.get('/:id', expressAsyncHandler(this.getById.bind(this)));
  this._router.put('/:id', expressAsyncHandler(this.update.bind(this)));
  this._router.delete('/:id', expressAsyncHandler(this.delete.bind(this)));
}

// Task 5: Method Refactoring Pattern  
private async create(req: Request, res: Response) {
  // REMOVE this entire try-catch wrapper:
  // try {
    const payload = req.body ?? {};
    const dto = new CreateDTO(
      this.getRequiredString(payload.field1, 'field1'),
      this.getRequiredString(payload.field2, 'field2')
    );
    const result = await this.useCase.execute(dto);
    res.status(201).json(createSuccessResponse('CREATED', 'Resource created'));
  // } catch (error) {
  //   this.handleError(error, res);  // REMOVE
  // }
}
```

### Integration Points
```yaml
SERVER_SETUP:
  - verify: Error middleware is registered after all routes
  - pattern: "app.use(errorHandler)" comes after all controller registrations

CONTROLLER_INTERFACE:
  - ensure: All controllers expose { basePath, router }
  - pattern: "server.registerController(controller)" expects this interface

VALIDATION:
  - preserve: getRequiredString and similar validation methods
  - ensure: These methods throw BadRequestError (don't catch)
```

## Validation Loop

### Level 1: Syntax & Type Checking
```bash
# Run after each file modification
npm run lint                    # or yarn lint
npm run type-check             # or tsc --noEmit
npx eslint src/ examples/      # if using ESLint

# Expected: No errors. Fix TypeScript/lint errors before proceeding.
```

### Level 2: Unit Tests (Preserve Existing)
```typescript
// Verify existing controller tests still pass
// Tests should not need modification since business logic unchanged
// Only test setup might need adjustment for new controller structure

// Run existing tests:
npm test -- --grep "Controller"
# or
yarn test controllers/

# If failing: Check if test setup needs Router pattern instead of BaseController
```

### Level 3: Integration Testing
```bash
# Start development server
npm run dev
# or
yarn dev

# Test each refactored endpoint manually:
curl -X POST http://localhost:3000/examples/clean/todo \
  -H "Content-Type: application/json" \
  -d '{"title": "test", "description": "test desc"}'

# Expected: Same responses as before refactoring
# Error cases should still return proper error responses via middleware
```

### Level 4: Error Handling Validation
```bash
# Test that errors are properly handled by middleware
curl -X POST http://localhost:3000/examples/clean/todo \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'

# Expected: 400 Bad Request with proper error format
# Verify error comes from middleware, not controller
```

## Final Validation Checklist
- [ ] All controller files in examples/ and src/contexts/ processed
- [ ] No try-catch blocks remain in any controller methods
- [ ] All async route handlers wrapped with expressAsyncHandler()
- [ ] All methods properly bound with .bind(this)
- [ ] BaseController imports removed from all files
- [ ] Server starts without errors: `npm run dev`
- [ ] Existing API functionality preserved (same endpoints work)
- [ ] Error responses still properly formatted
- [ ] All existing tests pass: `npm test`
- [ ] TypeScript compilation succeeds: `npm run type-check`
- [ ] Linting passes: `npm run lint`

## Anti-Patterns to Avoid
- ❌ Don't add new try-catch blocks - let express-async-handler handle it
- ❌ Don't remove validation logic - keep throwing BadRequestError etc.
- ❌ Don't change response formats - preserve createSuccessResponse usage
- ❌ Don't modify business logic - only change error handling structure  
- ❌ Don't forget .bind(this) on route handlers - will cause method binding issues
- ❌ Don't wrap non-async handlers with expressAsyncHandler
- ❌ Don't change basePath values - preserve existing routing structure