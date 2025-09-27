import { telemetryReady } from './shared/telemetry';

async function bootstrap() {
  await telemetryReady;
  await import('reflect-metadata');

  const [{ InversifyServer }, { WelcomeModule }, { UserManagementModule }, { ProductManagementModule }] =
    await Promise.all([
      import('./shared/server/inversify-server'),
      import('./contexts/welcome/module'),
      import('./contexts/user-management/module'),
      import('./contexts/product-management/module'),
    ]);

  const server = new InversifyServer();

  // Register modules
  await server.registerModule(new WelcomeModule());
  await server.registerModule(new UserManagementModule());
  await server.registerModule(new ProductManagementModule());

  // Start server
  await server.start(3000);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error);
  process.exit(1);
});
