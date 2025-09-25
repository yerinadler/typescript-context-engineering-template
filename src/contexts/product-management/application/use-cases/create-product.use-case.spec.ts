import { ConflictError, ValidationError } from '../../../../shared/errors';
import { Product } from '../../domain/entities/product';
import { InMemoryProductRepositoryDouble } from '../../test-utils/in-memory-product.repository.double';
import { CreateProductDTO } from '../dto/create-product.dto';
import { CreateProductUseCase } from './create-product.use-case';

describe('CreateProductUseCase', () => {
  const buildUseCase = () => {
    const repository = new InMemoryProductRepositoryDouble();
    const useCase = new CreateProductUseCase(repository);
    return { repository, useCase };
  };

  it('creates a product with canonicalized fields', async () => {
    const { repository, useCase } = buildUseCase();

    const result = await useCase.execute(
      new CreateProductDTO('  Deluxe Chair  ', 'chr-001', 12999, 'usd', 'Ergonomic chair'),
    );

    expect(result.id).toBeDefined();
    expect(result.name).toBe('Deluxe Chair');
    expect(result.sku).toBe('CHR-001');
    expect(result.price.amountCents).toBe(12999);
    expect(result.price.currency).toBe('USD');

    const stored = await repository.findById(result.id);
    expect(stored).not.toBeNull();
  });

  it('throws validation error when SKU violates rules', async () => {
    const { useCase } = buildUseCase();

    await expect(
      useCase.execute(new CreateProductDTO('Test Product', 'invalid sku', 5000, 'USD', 'Sample')),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects duplicate SKUs', async () => {
    const { useCase } = buildUseCase();

    await useCase.execute(new CreateProductDTO('First Product', 'dup-001', 1000, 'USD', 'Original'));

    await expect(
      useCase.execute(new CreateProductDTO('Second Product', 'dup-001', 1500, 'USD', 'Duplicate')),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
