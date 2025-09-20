import { Request, Response } from 'express';
import { createSuccessResponse } from '../../../shared/api';
import { BaseController } from '../../../shared/controller/base';

export class WelcomeController extends BaseController {
  constructor() {
    super('/');
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.addRoute('get', '/hello/:name', this.hello);
  }

  private hello(req: Request, res: Response) {
    const name = req.params.name;
    const response = createSuccessResponse('WELCOME_000', `hello ${name}`);
    res.json(response);
  }
}
