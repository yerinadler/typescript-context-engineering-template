import { Server as HttpServer } from 'http';
import express, { Application, urlencoded, json } from 'express';
import { Controller } from '../controller/controller.interface';

export class Server {
  private _app: Application;
  private _server: HttpServer | null = null;
  private _isShuttingDown = false;

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
    this._server = this._app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log('the application is listening to the port %s', port);
    });

    this.setupGracefulShutdown();
  }

  private setupGracefulShutdown(): void {
    // Handle graceful shutdown signals
    process.on('SIGINT', this.gracefulShutdown.bind(this));
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
  }

  private gracefulShutdown(signal: string): void {
    if (this._isShuttingDown) {
      return;
    }

    this._isShuttingDown = true;
    // eslint-disable-next-line no-console
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

    if (!this._server) {
      // eslint-disable-next-line no-console
      console.log('No server instance found. Exiting immediately.');
      process.exit(0);
      return;
    }

    // Set timeout for forced shutdown (15 seconds)
    const forceShutdownTimer = setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('Graceful shutdown timeout reached. Forcing shutdown...');
      process.exit(1);
    }, 15000);

    // Stop accepting new connections and close existing ones
    this._server.close((err) => {
      clearTimeout(forceShutdownTimer);

      if (err) {
        // eslint-disable-next-line no-console
        console.error('Error during graceful shutdown:', err);
        process.exit(1);
      } else {
        // eslint-disable-next-line no-console
        console.log('Graceful shutdown completed successfully.');
        process.exit(0);
      }
    });
  }
}
