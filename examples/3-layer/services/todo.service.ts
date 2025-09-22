import { TodoDAO } from '../dal/todo.dao';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../types';

export class TodoService {
  constructor(private readonly todoDAO: TodoDAO) {}

  async createTodo(todoData: CreateTodoDTO): Promise<Todo> {
    // PATTERN: Business validation
    if (!todoData.title?.trim()) {
      throw new Error('Title is required');
    }
    if (!todoData.description?.trim()) {
      throw new Error('Description is required');
    }

    // PATTERN: Delegate to DAO for persistence
    return await this.todoDAO.create(todoData);
  }

  async getAllTodos(): Promise<Todo[]> {
    return await this.todoDAO.findAll();
  }

  async getTodoById(id: string): Promise<Todo | null> {
    if (!id?.trim()) {
      throw new Error('ID is required');
    }

    return await this.todoDAO.findById(id);
  }

  async updateTodo(id: string, updates: UpdateTodoDTO): Promise<Todo | null> {
    if (!id?.trim()) {
      throw new Error('ID is required');
    }

    // PATTERN: Business validation for updates
    if (updates.title !== undefined && !updates.title.trim()) {
      throw new Error('Title cannot be empty');
    }

    return await this.todoDAO.update(id, updates);
  }

  async deleteTodo(id: string): Promise<boolean> {
    if (!id?.trim()) {
      throw new Error('ID is required');
    }

    return await this.todoDAO.delete(id);
  }
}
