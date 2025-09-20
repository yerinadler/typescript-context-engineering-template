import { Product } from '../../domain/entities/product';
import { Repository } from '../../shared/core/base.repository';

export interface ProductRepository extends Repository<Product> {
  findBySku(sku: string): Promise<Product | null>;
}
