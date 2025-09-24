import { Container } from 'inversify';
import { ModuleDefinition, TYPES } from '../../shared/di';
import { UserRepository } from './application/ports/user-repository.port';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { UpdateUserProfileUseCase } from './application/use-cases/update-user-profile.use-case';
import { UpdateUserStatusUseCase } from './application/use-cases/update-user-status.use-case';
import { InMemoryUserRepository } from './infrastructure/repositories/in-memory-user.repository';
import { UserController } from './presentation/controllers/user.controller.inversify';

/**
 * User Management Module Definition
 * Configures all dependencies for the user management bounded context
 */
export class UserManagementModule implements ModuleDefinition {
  readonly name = 'UserManagement';

  /**
   * Configure the container with user management dependencies
   */
  configure(container: Container): void {
    // Infrastructure layer - Repositories
    container.bind<UserRepository>(TYPES.UserRepository).to(InMemoryUserRepository);

    // Application layer - Use cases
    container.bind<CreateUserUseCase>(TYPES.CreateUserUseCase).to(CreateUserUseCase);
    container.bind<GetUserByIdUseCase>(TYPES.GetUserByIdUseCase).to(GetUserByIdUseCase);
    container.bind<ListUsersUseCase>(TYPES.ListUsersUseCase).to(ListUsersUseCase);
    container.bind<UpdateUserProfileUseCase>(TYPES.UpdateUserProfileUseCase).to(UpdateUserProfileUseCase);
    container.bind<UpdateUserStatusUseCase>(TYPES.UpdateUserStatusUseCase).to(UpdateUserStatusUseCase);

    // Presentation layer - Controllers
    container.bind<UserController>(TYPES.UserController).to(UserController);
  }

  /**
   * Export services that other modules can use
   * Only application layer components should be exported for modular monolith
   */
  exports = [
    TYPES.CreateUserUseCase,
    TYPES.GetUserByIdUseCase,
    TYPES.ListUsersUseCase,
    TYPES.UpdateUserProfileUseCase,
    TYPES.UpdateUserStatusUseCase,
  ];
}
