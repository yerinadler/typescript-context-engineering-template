import { Container } from 'inversify';

/**
 * Interface for module definitions inspired by NestJS
 * Each bounded context should implement this interface
 */
export interface ModuleDefinition {
  /**
   * Module name for identification
   */
  name: string;

  /**
   * Configure the container with module-specific bindings
   * @param container - Child container for this module
   * @returns Promise<void> or void
   */
  configure(container: Container): Promise<void> | void;

  /**
   * Optional: Export symbols that other modules can use
   * This enables cross-module communication
   */
  exports?: symbol[];

  /**
   * Optional: Import other modules
   * This creates dependencies between modules
   */
  imports?: ModuleDefinition[];
}
