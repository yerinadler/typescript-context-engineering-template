import { ProductRepository } from '../../application/ports/product-repository';
import { Product } from '../../domain/entities/product';
import { BaseRepository } from '../../shared/core/base.repository';

export class InMemoryProductRepository extends BaseRepository<Product> implements ProductRepository {
  private readonly byId = new Map<string, Product>();
  private readonly skuIndex = new Map<string, string>();

  async findById(id: string): Promise<Product | null> {
    return this.byId.get(id) ?? null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const productId = this.skuIndex.get(sku);
    return productId ? (this.byId.get(productId) ?? null) : null;
  }

  async save(product: Product): Promise<void> {
    this.byId.set(product.id, product);
    this.skuIndex.set(product.sku, product.id);
  }

  async update(product: Product): Promise<void> {
    await this.save(product);
  }

  async list(): Promise<Product[]> {
    return Array.from(this.byId.values());
  }
}
