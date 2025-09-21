import { DomainError } from '../errors/domain-error';

const MIN_LENGTH = 2;
const MAX_LENGTH = 100;

export class FullName {
  private constructor(private readonly _value: string) {}

  static create(rawName: string): FullName {
    if (typeof rawName !== 'string') {
      throw new DomainError('full name must be a string');
    }

    const normalized = rawName.trim();

    if (normalized.length === 0) {
      throw new DomainError('full name is required');
    }

    if (normalized.length < MIN_LENGTH) {
      throw new DomainError(`full name must be at least ${MIN_LENGTH} characters long`);
    }

    if (normalized.length > MAX_LENGTH) {
      throw new DomainError(`full name must be at most ${MAX_LENGTH} characters long`);
    }

    // Validate that name contains at least first and last name
    const nameParts = normalized.split(/\s+/);
    if (nameParts.length < 2) {
      throw new DomainError('full name must include at least first and last name');
    }

    return new FullName(normalized);
  }

  get value(): string {
    return this._value;
  }
}

export { MIN_LENGTH as FULL_NAME_MIN_LENGTH, MAX_LENGTH as FULL_NAME_MAX_LENGTH };
