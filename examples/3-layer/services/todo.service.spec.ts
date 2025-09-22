import { TodoDAO } from '../dal/todo.dao';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let mockDAO: TodoDAO;

  beforeEach(() => {
    mockDAO = new TodoDAO();
    service = new TodoService(mockDAO);
  });

  describe('createTodo', () => {
    test('should validate input and create todo', async () => {
      const todo = await service.createTodo({
        title: 'Service Test',
        description: 'Service Description',
      });

      expect(todo.title).toBe('Service Test'); // Business logic applied
      expect(todo.description).toBe('Service Description');
      expect(todo.isComplete).toBe(false);
    });

    test('should throw error for empty title', async () => {
      await expect(
        service.createTodo({
          title: '',
          description: 'Description',
        }),
      ).rejects.toThrow('Title is required'); // Validation working
    });

    test('should throw error for whitespace-only title', async () => {
      await expect(
        service.createTodo({
          title: '   ',
          description: 'Description',
        }),
      ).rejects.toThrow('Title is required'); // Validation working
    });

    test('should throw error for empty description', async () => {
      await expect(
        service.createTodo({
          title: 'Title',
          description: '',
        }),
      ).rejects.toThrow('Description is required');
    });

    test('should throw error for whitespace-only description', async () => {
      await expect(
        service.createTodo({
          title: 'Title',
          description: '   ',
        }),
      ).rejects.toThrow('Description is required');
    });
  });

  describe('getAllTodos', () => {
    test('should return all todos', async () => {
      await service.createTodo({
        title: 'Todo 1',
        description: 'Description 1',
      });
      await service.createTodo({
        title: 'Todo 2',
        description: 'Description 2',
      });

      const todos = await service.getAllTodos();

      expect(todos).toHaveLength(2);
    });
  });

  describe('getTodoById', () => {
    test('should return todo when found', async () => {
      const created = await service.createTodo({
        title: 'Find Me',
        description: 'Find Description',
      });

      const found = await service.getTodoById(created.id);

      expect(found).toEqual(created);
    });

    test('should return null when not found', async () => {
      const found = await service.getTodoById('non-existent-id');

      expect(found).toBeNull();
    });

    test('should throw error for empty id', async () => {
      await expect(service.getTodoById('')).rejects.toThrow('ID is required');
    });

    test('should throw error for whitespace-only id', async () => {
      await expect(service.getTodoById('   ')).rejects.toThrow('ID is required');
    });
  });

  describe('updateTodo', () => {
    test('should update todo successfully', async () => {
      const created = await service.createTodo({
        title: 'Original',
        description: 'Original Description',
      });

      const updated = await service.updateTodo(created.id, {
        title: 'Updated',
        isComplete: true,
      });

      expect(updated).not.toBeNull();
      expect(updated!.title).toBe('Updated');
      expect(updated!.isComplete).toBe(true);
    });

    test('should throw error for empty id', async () => {
      await expect(service.updateTodo('', { title: 'Updated' })).rejects.toThrow('ID is required');
    });

    test('should throw error for empty title update', async () => {
      const created = await service.createTodo({
        title: 'Original',
        description: 'Original Description',
      });

      await expect(service.updateTodo(created.id, { title: '' })).rejects.toThrow('Title cannot be empty');
    });

    test('should return null for non-existent todo', async () => {
      const updated = await service.updateTodo('non-existent-id', {
        title: 'Updated',
      });

      expect(updated).toBeNull();
    });
  });

  describe('deleteTodo', () => {
    test('should delete todo successfully', async () => {
      const created = await service.createTodo({
        title: 'To Delete',
        description: 'Delete Description',
      });

      const deleted = await service.deleteTodo(created.id);

      expect(deleted).toBe(true);
    });

    test('should throw error for empty id', async () => {
      await expect(service.deleteTodo('')).rejects.toThrow('ID is required');
    });

    test('should return false for non-existent todo', async () => {
      const deleted = await service.deleteTodo('non-existent-id');

      expect(deleted).toBe(false);
    });
  });
});
