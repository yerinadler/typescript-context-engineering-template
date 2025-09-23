import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { json, urlencoded } from 'express';
import { ApplicationContainer } from '../di/container';
import { ModuleDefinition } from '../di/module.interface';
import { errorHandler } from '../api/error-handler';

/**
 * InversifyJS-based server
 * Manages modules and their controllers through dependency injection
 */
export class InversifyServer {
  private _appContainer: ApplicationContainer;
  private _server: InversifyExpressServer | null = null;

  constructor() {
    this._appContainer = new ApplicationContainer();
  }

  /**
   * Register a module with the application
   */
  async registerModule(module: ModuleDefinition): Promise<void> {
    await this._appContainer.registerModule(module);
  }

  /**
   * Start the server
   */
  async start(port: number): Promise<void> {
    // Create InversifyJS Express server
    this._server = new InversifyExpressServer(this._appContainer.container);

    // Configure Express middleware
    this._server.setConfig((app) => {
      app.use(urlencoded({ extended: true }));
      app.use(json());
    });

    // Configure error handling (must be last)
    this._server.setErrorConfig((app) => {
      app.use(errorHandler);
    });

    // Build and start the application
    const app = this._server.build();
    
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`InversifyJS server listening on port ${port}`);
      this.logRegisteredModules();
    });
  }

  private logRegisteredModules(): void {
    const modules = this._appContainer.getRegisteredModules();
    
    if (modules.length === 0) {
      // eslint-disable-next-line no-console
      console.log('No modules registered.');
      return;
    }

    // eslint-disable-next-line no-console
    console.log('\nRegistered Modules:');
    modules.forEach(moduleName => {
      // eslint-disable-next-line no-console
      console.log(`  - ${moduleName}`);
    });
  }
}
