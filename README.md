# TypeScript Context Engineering Template

This repository is a starter kit for building context-engineered modular monoliths with TypeScript. It illustrates how to apply bounded contexts, Clean Architecture, and shared frameworks without shipping business-specific logic. The template is designed to pair well with GPT-5 Codex driven workflows.

> [!IMPORTANT]
> Use Claude Code? Good luck with that!

## Highlights
- Modular monolith foundation with explicit bounded contexts and shared framework layer.
- Context engineering guidelines that keep cross-context interactions behind application-level interfaces.
- Architecture docs describing Clean, 3-layer, and presentation-only options so each context can choose the right depth.
- Ready-to-use tooling: pnpm, TypeScript 5.9, Jest, ESLint, Prettier, and ts-node for rapid iteration.
- Event-driven example via in-memory bus to demonstrate decoupled integrations without microservices.

## Getting Started
1. Ensure you have Node.js 20+ and pnpm installed (`npm install -g pnpm` if needed).
2. Install dependencies with `pnpm install`.
3. Duplicate `.env_example` to `.env` and adjust values when adding integrations.
4. Start the sample application with `pnpm dev` (runs `ts-node src/index.ts`).
5. Run tests anytime with `pnpm test` or `pnpm test:watch`.

## Available Scripts
- `pnpm dev` – Run the entrypoint with hot reload through ts-node.
- `pnpm test` – Execute the Jest suite in band (see `jest.config.ts`).
- `pnpm lint` / `pnpm lint:fix` – Apply ESLint rules defined in `eslint.config.mjs`.
- `pnpm format` / `pnpm format:check` – Enforce Prettier formatting rules (`prettier.config.cjs`).
- `pnpm build` – Emit production-ready TypeScript build into `dist/`.

## Project Layout
- `src/contexts` – Bounded contexts (modules) that own their domain logic.
- `src/shared` – Framework and cross-cutting utilities shared across contexts.
- `docs/` – Global documentation (`ARCHITECTURE.md`, `PROJECT_STRUCTURE.md`, `API.md`, `FRAMEWORKS.md`).
- `contexts/*/docs/` – Context-specific guidance; consult before adding or extending code.
- `TASKS.md` files – Track active work and discoveries at the root and per-context level.

## Bounded Contexts Included
- `welcome` – Presentation-only demo confirming controllers and shared wiring.
- `product-management` – Clean Architecture sample for registering products and updating price. Read `src/contexts/product-management/docs/ARCHITECTURE.md` for the detailed flow.

## Architecture Primer
The template favors a hybrid Clean/Onion approach: modules expose application-layer ports, internal dependencies point inward, and an in-memory event bus keeps contexts decoupled. Review `docs/ARCHITECTURE.md` for principles, `docs/PROJECT_STRUCTURE.md` for recommended folder shapes, and `docs/API.md` for response contracts.

## Working With The Template
- Follow trunk-based development: branch from `main`, keep changes small, and prefer squash merges.
- Update `TASKS.md` whenever you start or finish work and log new findings under "Discovered During Work".
- Add tests alongside the core business logic (`*.spec.ts`) and skip presentation-layer coverage.
- Use the `AGENTS.md` instructions when contributing via AI agents to stay aligned with repository conventions.

## Customizing For Your Domain
When introducing a new bounded context:
- Create a directory under `src/contexts/<context-name>` using either Clean Architecture or 3-layer structure as documented.
- Provide context-specific docs in `src/contexts/<context-name>/docs/`.
- Wire shared integrations through interfaces defined at the application layer so other contexts interact only via contracts.
- Expand the README and docs as you add noteworthy behaviors or architectural decisions.

This template intentionally stays business-agnostic. Treat it as a sandbox for experimenting with context engineering patterns and as a foundation to bootstrap production-grade modular monoliths with GPT-5 Codex.