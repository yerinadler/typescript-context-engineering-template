import { Request, Response } from 'express';
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
    res.json({
      message: `hello ${name}`,
    });
  }
}
