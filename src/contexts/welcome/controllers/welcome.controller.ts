import type { Request, Response } from 'express';
import { Router as ExpressRouter } from 'express';
import { createSuccessResponse } from '../../../shared/api';

export class WelcomeController {
  public readonly basePath: string = '/';
  private readonly _router: ExpressRouter;

  constructor() {
    this._router = ExpressRouter();
    this.initializeRoutes();
  }

  get router(): ExpressRouter {
    return this._router;
  }

  private initializeRoutes(): void {
    this._router.get('/hello/:name', this.hello.bind(this));
  }

  private hello(req: Request, res: Response): void {
    const name = req.params.name;
    const response = createSuccessResponse('WELCOME_000', `hello ${name}`);
    res.json(response);
  }
}
