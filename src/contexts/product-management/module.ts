import { Container } from 'inversify';
import { ModuleDefinition, TYPES } from '../../shared/di';
import { ProductRepository } from './application/ports/product-repository';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductByIdUseCase } from './application/use-cases/get-product-by-id.use-case';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case';
import { UpdateProductPriceUseCase } from './application/use-cases/update-product-price.use-case';
import { InMemoryProductRepository } from './infrastructure/persistence/in-memory-product-repository';
import { ProductController } from './presentation/controllers/product.controller.inversify';

/**
 * Product Management Module Definition
 * Configures all dependencies for the product management bounded context
 */
export class ProductManagementModule implements ModuleDefinition {
  readonly name = 'ProductManagement';

  /**
   * Configure the container with product management dependencies
   */
  configure(container: Container): void {
    // Infrastructure layer - Repositories
    container.bind<ProductRepository>(TYPES.ProductRepository).to(InMemoryProductRepository);

    // Application layer - Use cases
    container.bind<CreateProductUseCase>(TYPES.CreateProductUseCase).to(CreateProductUseCase);
    container.bind<GetProductByIdUseCase>(TYPES.GetProductByIdUseCase).to(GetProductByIdUseCase);
    container.bind<ListProductsUseCase>(TYPES.ListProductsUseCase).to(ListProductsUseCase);
    container.bind<UpdateProductPriceUseCase>(TYPES.UpdateProductPriceUseCase).to(UpdateProductPriceUseCase);

    // Presentation layer - Controllers
    container.bind<ProductController>(TYPES.ProductController).to(ProductController);
  }

  /**
   * Export services that other modules can use
   */
  exports = [
    TYPES.ProductRepository,
    TYPES.CreateProductUseCase,
    TYPES.GetProductByIdUseCase,
    TYPES.ListProductsUseCase,
    TYPES.UpdateProductPriceUseCase,
  ];
}
