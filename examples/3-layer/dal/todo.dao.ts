import { CreateTodoDTO, Todo, UpdateTodoDTO } from '../types';

// Simple ID generator for example purposes
const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export class TodoDAO {
  private todos: Todo[] = [];

  async create(todoData: CreateTodoDTO): Promise<Todo> {
    // PATTERN: Data persistence with auto-generated fields
    const todo: Todo = {
      id: generateId(), // ID generation
      title: todoData.title,
      description: todoData.description,
      isComplete: false, // Default state
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.todos.push(todo);
    return todo;
  }

  async findAll(): Promise<Todo[]> {
    return [...this.todos]; // Return defensive copy
  }

  async findById(id: string): Promise<Todo | null> {
    return this.todos.find((t) => t.id === id) || null;
  }

  async update(id: string, updates: UpdateTodoDTO): Promise<Todo | null> {
    const todoIndex = this.todos.findIndex((t) => t.id === id);
    if (todoIndex === -1) return null;

    const currentTodo = this.todos[todoIndex];
    if (!currentTodo) return null;

    this.todos[todoIndex] = {
      ...currentTodo,
      ...updates,
      updatedAt: new Date(),
    };

    return this.todos[todoIndex] || null;
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((t) => t.id !== id);
    return this.todos.length < initialLength;
  }
}
