import { Request, Response } from 'express';
import { TodoDAO } from '../dal/todo.dao';
import { TodoService } from '../services/todo.service';
import { TodoController } from './todo.controller';

// Mock Express Request and Response
const mockRequest = (body: unknown = {}, params: unknown = {}) =>
  ({
    body,
    params,
  }) as Request;

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;
  let dao: TodoDAO;

  beforeEach(() => {
    dao = new TodoDAO();
    service = new TodoService(dao);
    controller = new TodoController(service);
  });

  describe('createTodo', () => {
    test('should create todo and return 201', async () => {
      const req = mockRequest({
        title: 'Controller Test',
        description: 'Controller Description',
      });
      const res = mockResponse();

      await controller.createTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          title: 'Controller Test',
          description: 'Controller Description',
          isComplete: false,
        }),
        message: 'Todo created successfully',
      });
    });

    test('should return 400 for validation error', async () => {
      const req = mockRequest({
        title: '',
        description: 'Description',
      });
      const res = mockResponse();

      await controller.createTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Title is required',
      });
    });
  });

  describe('getAllTodos', () => {
    test('should return all todos with 200', async () => {
      // Create some test data
      await service.createTodo({
        title: 'Todo 1',
        description: 'Description 1',
      });
      await service.createTodo({
        title: 'Todo 2',
        description: 'Description 2',
      });

      const req = mockRequest();
      const res = mockResponse();

      await controller.getAllTodos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({ title: 'Todo 1' }),
          expect.objectContaining({ title: 'Todo 2' }),
        ]),
      });
    });
  });

  describe('getTodoById', () => {
    test('should return todo when found', async () => {
      const created = await service.createTodo({
        title: 'Find Me',
        description: 'Find Description',
      });

      const req = mockRequest({}, { id: created.id });
      const res = mockResponse();

      await controller.getTodoById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: created,
      });
    });

    test('should return 404 when todo not found', async () => {
      const req = mockRequest({}, { id: 'non-existent-id' });
      const res = mockResponse();

      await controller.getTodoById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Todo not found',
      });
    });

    test('should return 400 for validation error', async () => {
      const req = mockRequest({}, { id: '' });
      const res = mockResponse();

      await controller.getTodoById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'ID parameter is required',
      });
    });
  });

  describe('updateTodo', () => {
    test('should update todo and return 200', async () => {
      const created = await service.createTodo({
        title: 'Original',
        description: 'Original Description',
      });

      const req = mockRequest({ title: 'Updated', isComplete: true }, { id: created.id });
      const res = mockResponse();

      await controller.updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          title: 'Updated',
          isComplete: true,
        }),
        message: 'Todo updated successfully',
      });
    });

    test('should return 404 when todo not found', async () => {
      const req = mockRequest({ title: 'Updated' }, { id: 'non-existent-id' });
      const res = mockResponse();

      await controller.updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Todo not found',
      });
    });

    test('should return 400 for validation error', async () => {
      const created = await service.createTodo({
        title: 'Original',
        description: 'Original Description',
      });

      const req = mockRequest({ title: '' }, { id: created.id });
      const res = mockResponse();

      await controller.updateTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Title cannot be empty',
      });
    });
  });

  describe('deleteTodo', () => {
    test('should delete todo and return 200', async () => {
      const created = await service.createTodo({
        title: 'To Delete',
        description: 'Delete Description',
      });

      const req = mockRequest({}, { id: created.id });
      const res = mockResponse();

      await controller.deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Todo deleted successfully',
      });
    });

    test('should return 404 when todo not found', async () => {
      const req = mockRequest({}, { id: 'non-existent-id' });
      const res = mockResponse();

      await controller.deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Todo not found',
      });
    });

    test('should return 400 for validation error', async () => {
      const req = mockRequest({}, { id: '' });
      const res = mockResponse();

      await controller.deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'ID parameter is required',
      });
    });
  });
});
