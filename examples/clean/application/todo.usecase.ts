import { UseCase } from '../core/usecase.interface';
import { Todo } from '../domain/todo';
import { CreateTodoDTO } from './todo.dto';
import { TodoRepository } from './todo.repository';

export class CreateTodoUseCase implements UseCase<CreateTodoDTO, void> {
  constructor(private readonly _repository: TodoRepository) {}

  public async execute(dto: CreateTodoDTO): Promise<void> {
    const todo: Todo = new Todo(dto.title, dto.description);
    this._repository.save(todo);
  }
}
