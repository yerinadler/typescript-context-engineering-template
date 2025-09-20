import { TodoRepository } from '../../application/todo.repository';
import { Todo } from '../../domain/todo';

export class TodoRepositoryImpl implements TodoRepository {
  private _todos: Todo[] = [];

  public save(todo: Todo): void {
    const existingIndex = this._todos.findIndex((t) => t.id === todo.id);

    if (existingIndex >= 0) {
      // Update existing todo
      this._todos[existingIndex] = todo;
    } else {
      // Add new todo
      this._todos.push(todo);
    }
  }
}
