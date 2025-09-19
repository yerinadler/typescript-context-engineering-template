# Architecture
This project is a modular monolith where the application is decomposed into independent modules based on `Bounded Contexts` in Domain-Driven Design. The modules communicate with the others through well-defined interfaces which in this case, an in-memory method call to an `Application or Use Case Layer` of the other modules. No direct integrations to the internal components of other modules is allowed.

The goal of this architecture is to allow each bounded context to be managed by a single team for scalability and flexbility in development without having to rely on distributed architecture like microservices

For more decoupled integration method, an in-memory event bus is used as an event channel for a module to publish an event notifying that something happened e.g. `CustomerOnboarded` or `OrderPlaced` and the other modules or event handlers in the same module can take these events and process it accordingly.

Each bounded context or module is free to choose the architecture of choice e.g. A simpler module can simply uses `3 Layer Architecture` while more complex modules can leverage `Clean/Onion/Hexagonal Architecture`. There is no rule on this. However, it is advisable to check out the `AGENTS.md` for detailed instruction for each module.

## Key Architectural Principles
- Flexibility over rigid structure - the module can choose any patterns or conventions without relying on a single rigid structure.
- Scalable as one

## Project Structure
- The `src` folder contains all the code related to the project
- The `src/contexts` houses all modules or bounded contexts
- The `src/shared` contains shared components or framework-level components that power an application e.g. API Server. Check @./FRAMEWORKS.md for detailed information

For detailed information about the recommended structure of the modules. Check out @./PROJECT_STRUCTURE.md
