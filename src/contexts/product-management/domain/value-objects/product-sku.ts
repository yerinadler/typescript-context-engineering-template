import { DomainError } from '../errors/domain-error';

const SKU_PATTERN = /^[A-Z0-9-]{4,32}$/;

export class ProductSku {
  private constructor(private readonly _value: string) {}

  static create(rawSku: string): ProductSku {
    if (typeof rawSku !== 'string') {
      throw new DomainError('product SKU must be a string');
    }

    const normalized = rawSku.trim().toUpperCase();

    if (normalized.length === 0) {
      throw new DomainError('product SKU is required');
    }

    if (!SKU_PATTERN.test(normalized)) {
      throw new DomainError('product SKU must be 4-32 characters and use letters, numbers, or dashes');
    }

    return new ProductSku(normalized);
  }

  get value(): string {
    return this._value;
  }
}

export { SKU_PATTERN as PRODUCT_SKU_PATTERN };
