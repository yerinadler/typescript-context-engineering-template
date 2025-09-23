import { Container } from 'inversify';
import { ModuleDefinition, TYPES } from '../../shared/di';
import { WelcomeController } from './controllers/welcome.controller.inversify';

/**
 * Welcome Module Definition
 * Simple module for demonstration purposes
 */
export class WelcomeModule implements ModuleDefinition {
  readonly name = 'Welcome';

  /**
   * Configure the container with welcome module dependencies
   */
  configure(container: Container): void {
    // Presentation layer - Controllers
    container.bind<WelcomeController>(TYPES.WelcomeController).to(WelcomeController);
  }

  /**
   * No exports needed for this simple module
   */
  exports = [];
}
