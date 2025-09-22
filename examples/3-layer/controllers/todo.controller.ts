import { Request, Response } from 'express';
import { TodoService } from '../services/todo.service';
import { CreateTodoDTO, UpdateTodoDTO } from '../types';

export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  async createTodo(req: Request, res: Response): Promise<void> {
    try {
      // PATTERN: HTTP request handling
      const todoData: CreateTodoDTO = req.body;
      const todo = await this.todoService.createTodo(todoData);

      res.status(201).json({
        success: true,
        data: todo,
        message: 'Todo created successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async getAllTodos(req: Request, res: Response): Promise<void> {
    try {
      const todos = await this.todoService.getAllTodos();

      res.status(200).json({
        success: true,
        data: todos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async getTodoById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const todo = await this.todoService.getTodoById(id);

      if (!todo) {
        res.status(404).json({
          success: false,
          message: 'Todo not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateTodoDTO = req.body;

      const todo = await this.todoService.updateTodo(id, updates);

      if (!todo) {
        res.status(404).json({
          success: false,
          message: 'Todo not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: todo,
        message: 'Todo updated successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.todoService.deleteTodo(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Todo not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Todo deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}
