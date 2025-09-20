---
boundedContext: product-management
architecture: Clean Architecture
status: experimental
---

# Product Management Context Architecture

The product management bounded context governs product lifecycle concerns such as
registration, catalog metadata, and pricing. The context follows Clean Architecture
so business rules remain independent from web frameworks and infrastructure.

## Layering Overview
- **Domain** – Aggregates (`Product`) and value objects (`ProductName`, `ProductSku`,
  `Money`) encapsulate invariants like naming conventions, SKU formatting, and
  supported currencies.
- **Application** – Use cases coordinate domain objects and depend on abstract ports
  only (`ProductRepository`). They translate the domain to DTOs consumed by outer
  layers.
- **Infrastructure** – Adapters (currently an in-memory repository) satisfy
  application ports. Swapping to Prisma/Postgres only requires replacing the
  repository implementation.
- **Presentation** – The `ProductController` exposes HTTP endpoints that invoke
  use cases and maps responses with the shared API helpers.

## Use Cases
- `CreateProductUseCase` – Validates input, enforces SKU uniqueness, and creates a
  new product aggregate.
- `ListProductsUseCase` – Returns a read model for all products held by the
  repository.
- `GetProductByIdUseCase` – Fetches a single product or raises a not-found error.
- `UpdateProductPriceUseCase` – Applies new pricing while preserving domain
  invariants.

## Dependency Rules
1. Inner layers never import from outer layers (e.g. domain is unaware of Express).
2. Application services rethrow domain exceptions as shared `ValidationError`
   instances for consistent API contracts.
3. Controllers only depend on use cases and shared framework utilities.

## Testing Guidance
- Unit test use cases and domain value objects when adding new rules.
- Replace the in-memory repository with specialised doubles in tests to isolate
  behaviour.
- Avoid testing HTTP controllers here; rely on integration tests at the
  application level instead.
