import { CreateTodoUseCase } from './application/todo.usecase';
import { TodoRepositoryImpl } from './infrastructure/repositories/todo.repository';
import { TodoController } from './interface-adapters/controllers/todo.controller';

export const createCleanExampleTodoController = (): TodoController => {
  const repository = new TodoRepositoryImpl();
  const createTodoUseCase = new CreateTodoUseCase(repository);

  return new TodoController({
    createTodoUseCase,
  });
};

export { TodoController } from './interface-adapters/controllers/todo.controller';
