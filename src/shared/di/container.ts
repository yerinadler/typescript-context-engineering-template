import { Container } from 'inversify';
import { ModuleDefinition } from './module.interface';

/**
 * Application container manager
 * Manages the main container and child containers for each module
 */
export class ApplicationContainer {
  private readonly _container: Container;
  private readonly _moduleContainers: Map<string, Container> = new Map();
  
  constructor() {
    this._container = new Container({ defaultScope: 'Singleton' });
  }
  
  /**
   * Get the main application container
   */
  get container(): Container {
    return this._container;
  }
  
  /**
   * Register a module with its own child container
   * @param module - Module definition to register
   */
  async registerModule(module: ModuleDefinition): Promise<void> {
    // Create child container for this module
    const moduleContainer = this._container.createChild();
    
    // Configure the module's container
    await module.configure(moduleContainer);
    
    // Store the module container
    this._moduleContainers.set(module.name, moduleContainer);
    
    // If module has imports, resolve them first
    if (module.imports) {
      for (const importedModule of module.imports) {
        await this.registerModule(importedModule);
      }
    }
    
    // If module exports services, bind them to the main container
    if (module.exports) {
      for (const exportedSymbol of module.exports) {
        if (moduleContainer.isBound(exportedSymbol)) {
          // Re-bind the service from module container to main container
          const service = moduleContainer.get(exportedSymbol);
          this._container.bind(exportedSymbol).toConstantValue(service);
        }
      }
    }
  }
  
  /**
   * Get a module's container by name
   * @param moduleName - Name of the module
   * @returns Container for the module or undefined if not found
   */
  getModuleContainer(moduleName: string): Container | undefined {
    return this._moduleContainers.get(moduleName);
  }
  
  /**
   * Get all registered module names
   */
  getRegisteredModules(): string[] {
    return Array.from(this._moduleContainers.keys());
  }
}
