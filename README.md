# Typescript boilerplate for Modular Monolith

## Testing
- Run `pnpm test` to execute the Jest test suite in band.
- Use `pnpm test:watch` during development for watch mode.
- Jest is configured via `jest.config.ts` with TypeScript support powered by `ts-jest`.

## Bounded Contexts
- `welcome` – simple presentation-only demo that verifies the shared controller wiring.
- `product-management` – Clean Architecture module that covers product registration
  and pricing. Documentation lives in
  `src/contexts/product-management/docs/ARCHITECTURE.md`.