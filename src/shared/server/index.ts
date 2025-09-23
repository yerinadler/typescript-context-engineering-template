import { Server as HttpServer } from 'http';
import express, { Application, json, urlencoded } from 'express';
import type { Router as ExpressRouter } from 'express';
import { errorHandler } from '../api/error-handler';
import { Controller } from '../controller/controller.interface';

export class Server {
  private _app: Application;
  private _server: HttpServer | null = null;
  private _isShuttingDown = false;
  private readonly controllers: Controller[] = [];

  constructor() {
    this._app = express();
    this.configure();
  }

  private configure(): void {
    this._app.use(urlencoded({ extended: true }));
    this._app.use(json());
  }

  public registerController(controller: Controller) {
    this.controllers.push(controller);
    this._app.use(controller.basePath, controller.router);
  }

  public run(port: number): void {
    this._app.use(errorHandler);
    this._server = this._app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log('Application is listening on port %s', port);
      this.logRegisteredRoutes();
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

  private logRegisteredRoutes(): void {
    const routes = this.collectRegisteredRoutes();

    if (routes.length === 0) {
      // eslint-disable-next-line no-console
      console.log('No HTTP routes registered.');
      return;
    }

    const table = this.buildRoutesTable(routes);

    // eslint-disable-next-line no-console
    console.log('\nRegistered HTTP Routes');
    // eslint-disable-next-line no-console
    console.log(table);
  }

  private collectRegisteredRoutes(): RouteDefinition[] {
    const routes: RouteDefinition[] = [];

    for (const controller of this.controllers) {
      const router = controller.router as ExpressRouterWithStack;
      const routerRoutes = this.extractRoutesFromRouter(router, controller.basePath);
      routes.push(...routerRoutes);
    }

    return routes.sort((a, b) => {
      if (a.path === b.path) {
        return this.getMethodRank(a.method) - this.getMethodRank(b.method);
      }

      return a.path.localeCompare(b.path);
    });
  }

  private extractRoutesFromRouter(router: ExpressRouterWithStack, basePath: string): RouteDefinition[] {
    if (!Array.isArray(router.stack)) {
      return [];
    }

    const routes: RouteDefinition[] = [];

    for (const layer of router.stack) {
      if (layer.route) {
        const routePath = this.combinePaths(basePath, layer.route.path);
        const methods = Object.entries(layer.route.methods ?? {})
          .filter(([, isEnabled]) => Boolean(isEnabled))
          .map(([method]) => method.toUpperCase());

        for (const method of methods) {
          routes.push({ method, path: routePath });
        }
        continue;
      }

      if (layer.name === 'router' && layer.handle) {
        routes.push(...this.extractRoutesFromRouter(layer.handle, basePath));
      }
    }

    return routes;
  }

  private combinePaths(basePath: string, routePath: string): string {
    const trimmedBase = basePath === '/' ? '' : basePath.replace(/\/+$/, '');
    const trimmedRoute = routePath === '/' ? '' : routePath.replace(/^\/+/, '');

    const combined = [trimmedBase, trimmedRoute].filter(Boolean).join('/');

    if (!combined) {
      return '/';
    }

    return combined.startsWith('/') ? combined : `/${combined}`;
  }

  private buildRoutesTable(routes: RouteDefinition[]): string {
    const methodHeader = 'Method';
    const pathHeader = 'Path';
    const methodWidth = Math.max(methodHeader.length, ...routes.map((route) => route.method.length));
    const pathWidth = Math.max(pathHeader.length, ...routes.map((route) => route.path.length));

    const horizontalBorder = `+${'-'.repeat(methodWidth + 2)}+${'-'.repeat(pathWidth + 2)}+`;
    const headerRow = `| ${methodHeader.padEnd(methodWidth)} | ${pathHeader.padEnd(pathWidth)} |`;
    const routeRows = routes.map(
      (route) => `| ${route.method.padEnd(methodWidth)} | ${route.path.padEnd(pathWidth)} |`,
    );

    return [horizontalBorder, headerRow, horizontalBorder, ...routeRows, horizontalBorder].join('\n');
  }

  private getMethodRank(method: string): number {
    const index = METHOD_ORDER.indexOf(method);
    return index === -1 ? METHOD_ORDER.length : index;
  }
}

const METHOD_ORDER: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD', 'ALL'];

type RouteDefinition = {
  method: string;
  path: string;
};

type ExpressRoute = {
  path: string;
  methods: Record<string, boolean>;
};

type ExpressLayer = {
  route?: ExpressRoute;
  name?: string;
  handle?: ExpressRouterWithStack;
};

type ExpressRouterWithStack = ExpressRouter & {
  stack?: ExpressLayer[];
};
