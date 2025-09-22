import { Request, Response } from 'express';
import { createSuccessResponse, createErrorResponse } from '../../../src/shared/api';
import { BaseController } from '../../../src/shared/controller/base';
import { ApplicationError, resolveHttpStatus, errorCodes } from '../../../src/shared/errors';
import { TodoService } from '../services/todo.service';

export class TodoController extends BaseController {
  constructor(private readonly _service: TodoService) {
    super('/examples/3-layer/todo');
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.addRoute('post', '/', this.addTodo);
  }

  private addTodo(req: Request, res: Response) {
    try {
      this._service.addTodo(req.body.title, req.body.description);
      res.json(createSuccessResponse('success', 'added new todo'));
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    if (error instanceof ApplicationError) {
      const httpStatus = resolveHttpStatus(error.errorCode);
      res.status(httpStatus).json(createErrorResponse(error.errorCode, error.message));
      return;
    }

    const message = error instanceof Error ? error.message : 'unexpected error';
    res
      .status(resolveHttpStatus(errorCodes.INTERNAL_ERROR))
      .json(createErrorResponse(errorCodes.INTERNAL_ERROR, message));
  }
}
