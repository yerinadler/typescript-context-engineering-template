import { v7 } from 'uuid';
import { Todo, TodoDAO } from '../dal/todo.dao';

export class TodoService {
  constructor(private readonly _dao: TodoDAO) {}

  public addTodo(title: string, description: string): void {
    const todo: Todo = new Todo(v7(), title, description, false);
    this._dao.add(todo);
  }
}
