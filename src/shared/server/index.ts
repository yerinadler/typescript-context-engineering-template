import express, { Application, urlencoded, json } from 'express';
import { Controller } from '../controller/controller.interface';

export class Server {
  private _app: Application;

  constructor() {
    this._app = express();
    this.configure();
  }

  private configure(): void {
    this._app.use(urlencoded({ extended: true }));
    this._app.use(json());
  }

  public registerController(controller: Controller) {
    this._app.use(controller.basePath, controller.router);
  }

  public run(port: number): void {
    this._app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log('the application is listening to the port %s', port);
    });
  }
}
