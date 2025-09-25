import { Product } from '../domain/entities/product';
import { ProductRepository } from '../application/ports/product-repository';

export class InMemoryProductRepositoryDouble implements ProductRepository {
  private readonly byId = new Map<string, Product>();
  private readonly bySku = new Map<string, string>();

  async findById(id: string): Promise<Product | null> {
    return this.byId.get(id) ?? null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const productId = this.bySku.get(sku);
    return productId ? this.byId.get(productId) ?? null : null;
  }

  async save(product: Product): Promise<void> {
    this.byId.set(product.id, product);
    this.bySku.set(product.sku, product.id);
  }

  async update(product: Product): Promise<void> {
    await this.save(product);
  }

  async list(): Promise<Product[]> {
    return Array.from(this.byId.values());
  }
}
