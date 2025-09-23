import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../shared/di';
import { NotFoundError, ValidationError } from '../../../../shared/errors';
import { DomainError } from '../../domain/errors/domain-error';
import { Money } from '../../domain/value-objects/money';
import { BaseUseCase } from '../../shared/application/base.use-case';
import { ProductDto, toProductDto } from '../dto/product.dto';
import { UpdateProductPriceDTO } from '../dto/update-product-price.dto';
import { ProductRepository } from '../ports/product-repository';

@injectable()
export class UpdateProductPriceUseCase extends BaseUseCase<UpdateProductPriceDTO, ProductDto> {
  constructor(@inject(TYPES.ProductRepository) private readonly productRepository: ProductRepository) {
    super();
  }

  async execute(dto: UpdateProductPriceDTO): Promise<ProductDto> {
    const productId = dto.productId?.trim();

    if (!productId) {
      throw new ValidationError('product id is required');
    }

    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError(`product with id ${productId} was not found`);
    }

    try {
      const price = Money.fromCents(dto.priceCents, dto.currency);
      product.updatePrice(price);
      await this.productRepository.update(product);
      return toProductDto(product);
    } catch (error) {
      if (error instanceof DomainError) {
        throw new ValidationError(error.message);
      }

      throw error;
    }
  }
}
