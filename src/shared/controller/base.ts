import { Router, Request, Response } from 'express';
import { Controller } from './controller.interface';

export abstract class BaseController implements Controller {
  public readonly basePath: string;
  private readonly _router: Router;

  constructor(basePath: string) {
    this.basePath = basePath;
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  protected addRoute(
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    handler: (req: Request, res: Response) => void,
  ): void {
    switch (method) {
      case 'get':
        this._router.get(path, handler.bind(this));
        break;
      case 'post':
        this._router.post(path, handler.bind(this));
        break;
      case 'put':
        this._router.put(path, handler.bind(this));
        break;
      case 'delete':
        this._router.delete(path, handler.bind(this));
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }

  // Optionally, an abstract method can force child classes to register routes.
  protected abstract initializeRoutes(): void;
}
