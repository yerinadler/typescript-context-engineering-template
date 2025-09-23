import 'reflect-metadata';
import { InversifyServer } from './shared/server/inversify-server';
import { UserManagementModule } from './contexts/user-management/module';

async function bootstrap() {
  const server = new InversifyServer();
  
  // Register modules
  await server.registerModule(new UserManagementModule());
  
  // Start server
  await server.start(3001);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error);
  process.exit(1);
});
