import 'reflect-metadata';
import { ProductManagementModule } from './contexts/product-management/module';
import { UserManagementModule } from './contexts/user-management/module';
import { WelcomeModule } from './contexts/welcome/module';
import { InversifyServer } from './shared/server/inversify-server';

async function bootstrap() {
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
