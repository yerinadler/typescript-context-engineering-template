import { DomainError } from '../errors/domain-error';

const MIN_LENGTH = 3;
const MAX_LENGTH = 120;

export class ProductName {
  private constructor(private readonly _value: string) {}

  static create(rawName: string): ProductName {
    if (typeof rawName !== 'string') {
      throw new DomainError('product name must be a string');
    }

    const normalized = rawName.trim();

    if (normalized.length === 0) {
      throw new DomainError('product name is required');
    }

    if (normalized.length < MIN_LENGTH) {
      throw new DomainError(`product name must be at least ${MIN_LENGTH} characters long`);
    }

    if (normalized.length > MAX_LENGTH) {
      throw new DomainError(`product name must be at most ${MAX_LENGTH} characters long`);
    }

    return new ProductName(normalized);
  }

  get value(): string {
    return this._value;
  }
}

export { MIN_LENGTH as PRODUCT_NAME_MIN_LENGTH, MAX_LENGTH as PRODUCT_NAME_MAX_LENGTH };
