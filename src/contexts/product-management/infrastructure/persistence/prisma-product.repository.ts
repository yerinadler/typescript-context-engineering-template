import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { PrismaClient } from '../../../../generated/prisma';
import { TYPES } from '../../../../shared/di';
import { ProductRepository } from '../../application/ports/product-repository';
import { Product, ProductSnapshot, ProductStatus } from '../../domain/entities/product';
import { Money } from '../../domain/value-objects/money';
import { ProductName } from '../../domain/value-objects/product-name';
import { ProductSku } from '../../domain/value-objects/product-sku';
import { BaseRepository } from '../../shared/core/base.repository';

type PrismaProductRecord = {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  priceAmountCents: number;
  priceCurrency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

@injectable()
export class PrismaProductRepository extends BaseRepository<Product> implements ProductRepository {
  constructor(@inject(TYPES.PrismaClient) private readonly prisma: PrismaClient) {
    super();
  }

  async findById(id: string): Promise<Product | null> {
    const record = await this.prisma.product.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const normalizedSku = sku.trim().toUpperCase();
    const record = await this.prisma.product.findUnique({ where: { sku: normalizedSku } });
    return record ? this.toDomain(record) : null;
  }

  async save(product: Product): Promise<void> {
    const snapshot = this.toPersistence(product.toSnapshot());
    await this.prisma.product.create({ data: snapshot });
  }

  async update(product: Product): Promise<void> {
    const snapshot = this.toPersistence(product.toSnapshot());
    await this.prisma.product.update({
      where: { id: snapshot.id },
      data: {
        name: snapshot.name,
        sku: snapshot.sku,
        description: snapshot.description,
        priceAmountCents: snapshot.priceAmountCents,
        priceCurrency: snapshot.priceCurrency,
        status: snapshot.status,
        updatedAt: snapshot.updatedAt,
      },
    });
  }

  async list(): Promise<Product[]> {
    const records = (await this.prisma.product.findMany({ orderBy: { createdAt: 'asc' } })) as PrismaProductRecord[];
    return records.map((record) => this.toDomain(record));
  }

  private toPersistence(snapshot: ProductSnapshot) {
    return {
      id: snapshot.id,
      name: snapshot.name,
      sku: snapshot.sku,
      description: snapshot.description ?? null,
      priceAmountCents: snapshot.price.amountCents,
      priceCurrency: snapshot.price.currency,
      status: snapshot.status,
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt,
    } satisfies PrismaProductRecord;
  }

  private toDomain(record: PrismaProductRecord): Product {
    return Product.create({
      id: record.id,
      name: ProductName.create(record.name),
      sku: ProductSku.create(record.sku),
      ...(record.description ? { description: record.description } : {}),
      price: Money.fromCents(record.priceAmountCents, record.priceCurrency),
      status: record.status as ProductStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
