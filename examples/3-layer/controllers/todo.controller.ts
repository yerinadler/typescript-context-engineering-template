import type { Request, Response } from 'express';
import { Router as ExpressRouter } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { createSuccessResponse } from '../../../src/shared/api';
import { TodoService } from '../services/todo.service';

export class TodoController {
  public readonly basePath: string = '/examples/3-layer/todo';
  private readonly _router: ExpressRouter;

  constructor(private readonly _service: TodoService) {
    this._router = ExpressRouter();
    this.initializeRoutes();
  }

  get router(): ExpressRouter {
    return this._router;
  }

  private initializeRoutes(): void {
    this._router.post('/', expressAsyncHandler(this.addTodo.bind(this)));
  }

  private async addTodo(req: Request, res: Response): Promise<void> {
    this._service.addTodo(req.body.title, req.body.description);
    res.json(createSuccessResponse('success', 'added new todo'));
  }
}
