import { BaseUseCase } from '../../shared/application/base.use-case';
import { ProductDto, toProductDto } from '../dto/product.dto';
import { ProductRepository } from '../ports/product-repository';

export class ListProductsUseCase extends BaseUseCase<void, ProductDto[]> {
  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  async execute(): Promise<ProductDto[]> {
    const products = await this.productRepository.list();
    return products.map(toProductDto);
  }
}
