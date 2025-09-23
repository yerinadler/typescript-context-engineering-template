// InversifyJS-based exports
export { WelcomeModule } from './module';
export { WelcomeController } from './controllers/welcome.controller.inversify';

// Legacy exports (for backward compatibility during migration)
export { WelcomeController as LegacyWelcomeController } from './controllers/welcome.controller';
