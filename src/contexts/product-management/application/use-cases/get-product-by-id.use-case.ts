import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../shared/di';
import { NotFoundError, ValidationError } from '../../../../shared/errors';
import { BaseUseCase } from '../../shared/application/base.use-case';
import { ProductDto, toProductDto } from '../dto/product.dto';
import { ProductRepository } from '../ports/product-repository';

@injectable()
export class GetProductByIdUseCase extends BaseUseCase<string, ProductDto> {
  constructor(@inject(TYPES.ProductRepository) private readonly productRepository: ProductRepository) {
    super();
  }

  async execute(productId: string): Promise<ProductDto> {
    const normalizedId = productId?.trim();

    if (!normalizedId) {
      throw new ValidationError('product id is required');
    }

    const product = await this.productRepository.findById(normalizedId);

    if (!product) {
      throw new NotFoundError(`product with id ${normalizedId} was not found`);
    }

    return toProductDto(product);
  }
}
