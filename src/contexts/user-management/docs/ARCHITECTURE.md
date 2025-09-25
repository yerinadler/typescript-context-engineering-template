---
boundedContext: user-management
architecture: Clean Architecture
status: active
---

# User Management Context Architecture

The user management bounded context governs user profile lifecycle concerns such as
user registration, profile updates, and status management. The context follows Clean Architecture
so business rules remain independent from web frameworks and infrastructure.

## Layering Overview
- **Domain** – Aggregates (`User`) and value objects (`FullName`, `Email`,
  `Gender`, `BirthDate`) encapsulate invariants like name validation, email formatting,
  gender constraints, and age validation.
- **Application** – Use cases coordinate domain objects and depend on abstract ports
  only (`UserRepository`). They translate the domain to DTOs consumed by outer
  layers.
- **Infrastructure** – Adapters (Prisma-backed repository) satisfy
  application ports. Swapping to Prisma/Postgres only requires replacing the
  repository implementation.
- **Presentation** – The `UserController` exposes HTTP endpoints that invoke
  use cases and maps responses with the shared API helpers.

## Use Cases
- `CreateUserUseCase` – Validates input, enforces email uniqueness, and creates a
  new user aggregate.
- `ListUsersUseCase` – Returns a read model for all users held by the
  repository.
- `GetUserByIdUseCase` – Fetches a single user or raises a not-found error.
- `UpdateUserStatusUseCase` – Applies new status while preserving domain
  invariants.
- `UpdateUserProfileUseCase` – Updates user profile information while validating
  business rules.

## Dependency Rules
1. Inner layers never import from outer layers (e.g. domain is unaware of Express).
2. Application services rethrow domain exceptions as shared `ValidationError`
   instances for consistent API contracts.
3. Controllers only depend on use cases and shared framework utilities.

## Testing Guidance
- Unit test use cases and domain value objects when adding new rules.
- Replace the infrastructure repository with specialised doubles in tests to isolate
  behaviour.
- Avoid testing HTTP controllers here; rely on integration tests at the
  application level instead.
