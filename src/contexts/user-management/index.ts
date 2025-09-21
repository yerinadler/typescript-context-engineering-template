import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { UpdateUserProfileUseCase } from './application/use-cases/update-user-profile.use-case';
import { UpdateUserStatusUseCase } from './application/use-cases/update-user-status.use-case';
import { InMemoryUserRepository } from './infrastructure/repositories/in-memory-user.repository';
import { UserController } from './presentation/controllers/user.controller';

export const createUserManagementController = (): UserController => {
  const repository = new InMemoryUserRepository();

  const createUserUseCase = new CreateUserUseCase(repository);
  const listUsersUseCase = new ListUsersUseCase(repository);
  const getUserByIdUseCase = new GetUserByIdUseCase(repository);
  const updateUserProfileUseCase = new UpdateUserProfileUseCase(repository);
  const updateUserStatusUseCase = new UpdateUserStatusUseCase(repository);

  return new UserController({
    createUserUseCase,
    listUsersUseCase,
    getUserByIdUseCase,
    updateUserProfileUseCase,
    updateUserStatusUseCase,
  });
};

export { UserController } from './presentation/controllers/user.controller';
