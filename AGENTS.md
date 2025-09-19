# AGENTS Guideline for the repository
This file provides a guidance for AI coding agent for this project

## Common Commands

### Development
- `pnpm add` - Install dependencies
- `pnpm add -D` - Install development dependencies
- `pnpm dev` - Run in development mode with hot reload

### Linting and Formatting
- `pnpm lint --fix` - Run ESLint with auto-fix and auto-format on specified file(s)
- `pnpm format` - Run formatter using Prettier

### Building
- `pnpm build` - Build the application.

## High-Level Architecture
This project follows hybrid Clean & Onion Architecture; a dependency-inverted layered architecture. This means the communication between modules are done through abstraction (interfaces for this Typescript project)

For more details, check out the @/docs/ARCHITECTURE.md

## Code Structure & Modularity
- Never create a file longer than 500 lines of code. If the limit is approached, try to split the file into separate modules
- Follow the conventions defined in the `eslint.config.mjs` and `prettier.config.cjs` strictly.

## Testing & Quality Control
Be pragmatic on testing, 100% coverage is bullshit! Follow these guidelines:

- Use `jest` for testing
- Create a unit tests for **core components** e.g. business functions, use cases, domain models. The test cases should be placed alongside the source files
- Use `<filename>.spec.ts` convention for test file
- Do not test presentation layers, interface adapters, or API layer components! Leave it for integration tests.

## Task Completion
- When working on the new feature, be sure to create a new short-lived branch out of the trunk (main)
- Upon finishing the task, update the `TASKS.md` immediately.
- Commit the code atomically using `Conventional Commit` e.g. chore, feat, etc.

## Documentation
- Update the `README.md` file accordingly when new features are added to the project.
- If there is an architectural change, add it to the `docs/ARCHITECTURE.md` file.
- If there is a framework-level change (in the `shared` folder), add it to the `docs/FRAMEWORKS.md` file.

## Safety and Permissions

These commands are automatically allowed without prompting
- Reading files, listing files
- Running prettier or eslint for code linting and formatting
- Running tests

For the rest of the commands, do ask first!

## Branching & Workflow Guidelines

### Trunk-Based Development (TBD)

All code contributions MUST follow **Trunk-Based Development** practices.  
This applies to every bounded context/module in the modular monolith and to all teams contributing.

- **Main branch is the source of truth**  
  - All changes must be integrated into `main` frequently.  
  - Avoid long-lived branches (`develop`, `release/*`, `hotfix/*`) — they are not allowed.  

- **Short-lived feature branches**  
  - Create a branch from `main` for each feature, bugfix, or spike.  
  - Keep branches alive for **no more than a few days**.  
  - Rebase frequently to stay aligned with `main`.  

- **Merging**  
  - All merges must go back to `main` via **Pull Request (PR)** with automated checks (CI tests, lint, type checks).  
  - Prefer **squash merges** for clarity and to keep history clean.  

- **Releases**  
  - Releases are cut directly from `main` using **tags**.  
  - No release branches are permitted.  

- **Hotfixes**  
  - Fixes go directly into `main` (with a tag if urgent).  
  - Rollback is done via `git revert` or by redeploying a prior tag.  

- **Feature Flags**  
  - Incomplete features should be protected behind flags/configs.  
  - This allows merging early and often, without breaking production.  

> 🚫 **Do not use Git Flow.**  
> 🚫 **Do not maintain `develop`, `release/*`, or `hotfix/*` branches.**  
> ✅ **Always integrate early, always integrate often.**