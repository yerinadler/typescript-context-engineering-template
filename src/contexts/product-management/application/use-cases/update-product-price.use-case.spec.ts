import { NotFoundError, ValidationError } from '../../../../shared/errors';
import { Product } from '../../domain/entities/product';
import { Money } from '../../domain/value-objects/money';
import { ProductName } from '../../domain/value-objects/product-name';
import { ProductSku } from '../../domain/value-objects/product-sku';
import { InMemoryProductRepositoryDouble } from '../../test-utils/in-memory-product.repository.double';
import { UpdateProductPriceDTO } from '../dto/update-product-price.dto';
import { UpdateProductPriceUseCase } from './update-product-price.use-case';

describe('UpdateProductPriceUseCase', () => {
  const buildRepositoryWithProduct = async () => {
    const repository = new InMemoryProductRepositoryDouble();
    const product = Product.create({
      id: 'prod-1',
      name: ProductName.create('Standing Desk'),
      sku: ProductSku.create('desk-001'),
      price: Money.fromCents(25000, 'USD'),
    });

    await repository.save(product);
    return { repository, product };
  };

  it('updates the product price when provided valid input', async () => {
    const { repository, product } = await buildRepositoryWithProduct();
    const useCase = new UpdateProductPriceUseCase(repository);

    const result = await useCase.execute(new UpdateProductPriceDTO(product.id, 29900, 'usd'));

    expect(result.price.amountCents).toBe(29900);
    expect(result.price.currency).toBe('USD');

    const updated = await repository.findById(product.id);
    expect(updated?.price.amountCents).toBe(29900);
  });

  it('throws validation error when price is invalid', async () => {
    const { repository, product } = await buildRepositoryWithProduct();
    const useCase = new UpdateProductPriceUseCase(repository);

    await expect(useCase.execute(new UpdateProductPriceDTO(product.id, -1, 'USD'))).rejects.toBeInstanceOf(
      ValidationError,
    );
  });

  it('throws not found when product does not exist', async () => {
    const repository = new InMemoryProductRepositoryDouble();
    const useCase = new UpdateProductPriceUseCase(repository);

    await expect(useCase.execute(new UpdateProductPriceDTO('missing', 1000, 'USD'))).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
