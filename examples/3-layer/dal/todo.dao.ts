export class Todo {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly complete: boolean,
  ) {}
}

export class TodoDAO {
  private _todos: Todo[] = [];

  public add(todo: Todo): void {
    const index = this._todos.findIndex((existing: Todo) => existing.id === todo.id);
    if (index >= 0) {
      this._todos[index] = todo;
      return;
    }
  }
}
