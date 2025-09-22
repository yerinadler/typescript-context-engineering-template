import type { Request, Response } from 'express';
import { Router as ExpressRouter } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { createSuccessResponse } from '../../../../src/shared/api';
import { BadRequestError } from '../../../../src/shared/errors';
import { CreateTodoDTO } from '../../application/todo.dto';
import { CreateTodoUseCase } from '../../application/todo.usecase';

type TodoControllerDependencies = {
  createTodoUseCase: CreateTodoUseCase;
};

export class TodoController {
  public readonly basePath: string = '/examples/clean/todo';
  private readonly _router: ExpressRouter;

  constructor(private readonly dependencies: TodoControllerDependencies) {
    this._router = ExpressRouter();
    this.initializeRoutes();
  }

  get router(): ExpressRouter {
    return this._router;
  }

  private initializeRoutes(): void {
    this._router.post('/', expressAsyncHandler(this.createTodo.bind(this)));
  }

  private async createTodo(req: Request, res: Response): Promise<void> {
    const payload = req.body ?? {};

    const dto = new CreateTodoDTO(
      this.getRequiredString(payload.title, 'title'),
      this.getRequiredString(payload.description, 'description'),
    );

    await this.dependencies.createTodoUseCase.execute(dto);

    res.status(201).json(createSuccessResponse('TODO_CREATED', 'todo created'));
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
