# Project Structures
Inside `src/contexts`, there lives Domain-Driven modules called `bounded contexts`. An implementation, 

### Clean Architecture
This is the preferred approach for contexts with **moderate to high complexity**, where business rules must remain independent from frameworks, databases, or external interfaces.  

- **Domain Layer (Core)**: Entities, Value Objects, Aggregates, and Use Cases (Application Services). Pure business rules with no external dependencies.  
- **Application Layer**: Defines contracts (ports) for repositories, event buses, external services. Orchestrates use cases.  
- **Infrastructure Layer**: Implements contracts from the Application Layer (e.g., database repositories, Kafka producers, HTTP clients).  
- **Presentation Layer**: Controllers/handlers that map incoming requests into commands/queries, pass them into the Application Layer, and map responses back to clients.  

**Rules**
- Dependencies point **inward only** toward the Domain Layer.  
- Domain is **completely framework-agnostic**.  
- Testing: Domain logic can be unit tested without database or framework setup.  

**Use this when**  
- The context has significant business rules.  
- You expect long-term maintainability, team growth, or frequent changes in infrastructure.  
- Example contexts: `inventory`, `order`, `payment`.  

**Note on Non-CQRS Bounded Contexts**
- For non-CQRS project, only use `DTO` to communicate with the use cases.
- Do not create `commands` or `queries` separation as it will confuse people (I know it is the best practise to do that, but this is my style you know?)

---

### 3 Layer Architecture
This is a simpler version suited for **medium complexity** contexts where strict Clean Architecture separation may be too heavy.  

- **Presentation Layer**: Controllers/handlers for HTTP or message endpoints. Handles request/response lifecycle.  
- **Business/Service Layer**: Contains application logic and business rules. Services coordinate tasks but may not enforce strict DDD boundaries.  
- **Data Access Layer**: Handles persistence (repositories, DAOs) and infrastructure concerns.  

**Rules**
- Controllers must delegate to services, not directly to repositories.  
- Services may call multiple repositories, apply rules, and transform data.  
- Business rules and logic are not tightly coupled with infrastructure but are not as strictly isolated as Clean Architecture.  

**Use this when**  
- The context has **some business logic**, but not enough to justify full DDD layering.  
- You need faster delivery with acceptable trade-offs in testability and decoupling.  
- Example contexts: `customer-profile`, `notifications`.
--- 
### Simple Presentation-Only Architecture
### Simple Presentation-Only Architecture
This is inspired by the traditional, old-world **MVC pattern**, where the business logic lives inside the controller and interacts directly with the model or data model.  

- **Controller**: Handles both request/response lifecycle and business logic.  
- **Model**: Represents the data structure or database model, directly accessed by the controller.  
- **View/Response**: Returns output directly to the client.  

**Rules**
- Controllers directly perform logic and interact with models.  
- Minimal layering and abstraction—no service or domain layers.  
- Not recommended for scaling or complex domains.  

**Use this when**  
- The context is trivial, only requires simple input/output, and has **no meaningful business logic**.  
- Serves as a demo, proof of concept, or utility context.  
- Example context: `welcome` (prints out messages and nothing more).  