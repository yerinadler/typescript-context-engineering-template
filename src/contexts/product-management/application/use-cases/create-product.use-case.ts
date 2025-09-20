import { randomUUID } from 'crypto';
import { ConflictError, ValidationError } from '../../../../shared/errors';
import { Product } from '../../domain/entities/product';
import { DomainError } from '../../domain/errors/domain-error';
import { Money } from '../../domain/value-objects/money';
import { ProductName } from '../../domain/value-objects/product-name';
import { ProductSku } from '../../domain/value-objects/product-sku';
import { BaseUseCase } from '../../shared/application/base.use-case';
import { CreateProductDTO } from '../dto/create-product.dto';
import { ProductDto, toProductDto } from '../dto/product.dto';
import { ProductRepository } from '../ports/product-repository';

export class CreateProductUseCase extends BaseUseCase<CreateProductDTO, ProductDto> {
  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  async execute(dto: CreateProductDTO): Promise<ProductDto> {
    if (dto.description !== undefined && typeof dto.description !== 'string') {
      throw new ValidationError('description must be a string when provided');
    }

    try {
      const name = ProductName.create(dto.name);
      const sku = ProductSku.create(dto.sku);
      const price = Money.fromCents(dto.priceCents, dto.currency);

      const existing = await this.productRepository.findBySku(sku.value);
      if (existing) {
        throw new ConflictError(`product with SKU ${sku.value} already exists`);
      }

      const product = Product.create({
        id: randomUUID(),
        name,
        sku,
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        price,
      });

      await this.productRepository.save(product);

      return toProductDto(product);
    } catch (error) {
      if (error instanceof DomainError) {
        throw new ValidationError(error.message);
      }

      throw error;
    }
  }
}
