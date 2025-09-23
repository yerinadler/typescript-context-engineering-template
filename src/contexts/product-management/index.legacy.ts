import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductByIdUseCase } from './application/use-cases/get-product-by-id.use-case';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case';
import { UpdateProductPriceUseCase } from './application/use-cases/update-product-price.use-case';
import { InMemoryProductRepository } from './infrastructure/persistence/in-memory-product-repository';
import { ProductController } from './presentation/controllers/product.controller';

export const createProductManagementController = (): ProductController => {
  const repository = new InMemoryProductRepository();

  const createProductUseCase = new CreateProductUseCase(repository);
  const getProductByIdUseCase = new GetProductByIdUseCase(repository);
  const listProductsUseCase = new ListProductsUseCase(repository);
  const updateProductPriceUseCase = new UpdateProductPriceUseCase(repository);

  return new ProductController({
    createProductUseCase,
    getProductByIdUseCase,
    listProductsUseCase,
    updateProductPriceUseCase,
  });
};

export { ProductController } from './presentation/controllers/product.controller';
