import { Container } from 'inversify';
import { ModuleDefinition } from '../../shared/di';
import './controllers/welcome.controller.inversify';

/**
 * Welcome Module Definition
 * Simple module for demonstration purposes
 */
export class WelcomeModule implements ModuleDefinition {
  readonly name = 'Welcome';

  /**
   * Configure the container with welcome module dependencies
   */
  configure(_: Container): void {
    // Presentation bindings handled by controller decorators.
  }

  /**
   * No exports needed for this simple module
   */
  exports = [];
}
