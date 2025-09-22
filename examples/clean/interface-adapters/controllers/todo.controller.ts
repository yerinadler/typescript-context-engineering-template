import type { Request, Response } from 'express';
import { createErrorResponse, createSuccessResponse } from '../../../../src/shared/api';
import { BaseController } from '../../../../src/shared/controller/base';
import { ApplicationError, BadRequestError, errorCodes, resolveHttpStatus } from '../../../../src/shared/errors';
import { CreateTodoDTO } from '../../application/todo.dto';
import { CreateTodoUseCase } from '../../application/todo.usecase';

type TodoControllerDependencies = {
  createTodoUseCase: CreateTodoUseCase;
};

export class TodoController extends BaseController {
  constructor(private readonly dependencies: TodoControllerDependencies) {
    super('/examples/clean/todo');
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.addRoute('post', '/', this.createTodo);
  }

  private async createTodo(req: Request, res: Response) {
    try {
      const payload = req.body ?? {};

      const dto = new CreateTodoDTO(
        this.getRequiredString(payload.title, 'title'),
        this.getRequiredString(payload.description, 'description'),
      );

      await this.dependencies.createTodoUseCase.execute(dto);

      res.status(201).json(createSuccessResponse('TODO_CREATED', 'todo created'));
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

  private getRequiredString(value: unknown, fieldName: string): string {
    if (typeof value !== 'string') {
      throw new BadRequestError(`${fieldName} is required`);
    }

    const trimmed = value.trim();

    if (!trimmed) {
      throw new BadRequestError(`${fieldName} is required`);
    }

    return trimmed;
  }
}
