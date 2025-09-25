import { PrismaProductRepository } from './prisma-product.repository';
import { Product } from '../../domain/entities/product';
import { Money } from '../../domain/value-objects/money';
import { ProductName } from '../../domain/value-objects/product-name';
import { ProductSku } from '../../domain/value-objects/product-sku';

type PrismaProductDelegateMock = {
  findUnique: jest.Mock;
  findMany: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
};

type PrismaClientMock = {
  product: PrismaProductDelegateMock;
};

const createPrismaMock = (): PrismaClientMock => ({
  product: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
});

const buildProduct = (overrides: Partial<{ id: string; sku: string; status: 'draft' | 'active' | 'archived' }> = {}): Product => {
  const createdAt = new Date('2024-01-01T00:00:00.000Z');
  const updatedAt = new Date('2024-01-01T00:00:00.000Z');

  return Product.create({
    id: overrides.id ?? 'prod-1',
    name: ProductName.create('Adjustable Desk'),
    sku: ProductSku.create(overrides.sku ?? 'desk-001'),
    description: 'Solid wood desk',
    price: Money.fromCents(49900, 'USD'),
    status: overrides.status ?? 'draft',
    createdAt,
    updatedAt,
  });
};

const toPersistenceRecord = (product: Product) => ({
  id: product.id,
  name: product.name,
  sku: product.sku,
  description: product.description ?? null,
  priceAmountCents: product.price.amountCents,
  priceCurrency: product.price.currency,
  status: product.status,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

describe('PrismaProductRepository', () => {
  it('creates new products with full snapshot payloads', async () => {
    const prisma = createPrismaMock();
    const repository = new PrismaProductRepository(prisma as unknown as any);
    const product = buildProduct();
    const persisted = toPersistenceRecord(product);

    prisma.product.create.mockResolvedValue(persisted);

    await repository.save(product);

    expect(prisma.product.create).toHaveBeenCalledWith({
      data: persisted,
    });
  });

  it('maps persisted records back to domain entities', async () => {
    const prisma = createPrismaMock();
    const repository = new PrismaProductRepository(prisma as unknown as any);
    const product = buildProduct({ status: 'active' });

    prisma.product.findUnique.mockResolvedValue(toPersistenceRecord(product));

    const found = await repository.findById(product.id);

    expect(found).not.toBeNull();
    expect(found?.id).toBe(product.id);
    expect(found?.status).toBe('active');
  });

  it('normalises SKU lookups to uppercase', async () => {
    const prisma = createPrismaMock();
    const repository = new PrismaProductRepository(prisma as unknown as any);
    const product = buildProduct();

    prisma.product.findUnique.mockResolvedValue(toPersistenceRecord(product));

    await repository.findBySku(' desk-001 ');

    expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { sku: 'DESK-001' } });
  });

  it('updates existing products through update operation', async () => {
    const prisma = createPrismaMock();
    const repository = new PrismaProductRepository(prisma as unknown as any);
    const product = buildProduct({ status: 'active' });
    const persisted = toPersistenceRecord(product);

    prisma.product.update.mockResolvedValue(persisted);

    await repository.update(product);

    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: persisted.id },
      data: {
        name: persisted.name,
        sku: persisted.sku,
        description: persisted.description,
        priceAmountCents: persisted.priceAmountCents,
        priceCurrency: persisted.priceCurrency,
        status: persisted.status,
        updatedAt: persisted.updatedAt,
      },
    });
  });

  it('lists products ordered by creation time', async () => {
    const prisma = createPrismaMock();
    const repository = new PrismaProductRepository(prisma as unknown as any);
    const first = buildProduct({ id: 'prod-1', sku: 'desk-001' });
    const second = buildProduct({ id: 'prod-2', sku: 'desk-002', status: 'archived' });

    prisma.product.findMany.mockResolvedValue([toPersistenceRecord(first), toPersistenceRecord(second)]);

    const products = await repository.list();

    expect(prisma.product.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'asc' } });
    expect(products).toHaveLength(2);
    const [, secondProduct] = products as [Product, Product];
    expect(secondProduct.status).toBe('archived');
  });
});
