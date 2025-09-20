import { Todo } from '../domain/todo';

export interface TodoRepository {
  save(todo: Todo): void | Promise<void>;
}
