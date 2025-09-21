import { DomainError } from '../errors/domain-error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTH = 254; // RFC 5321 standard

export class Email {
  private constructor(private readonly _value: string) {}

  static create(rawEmail: string): Email {
    if (typeof rawEmail !== 'string') {
      throw new DomainError('email must be a string');
    }

    const normalized = rawEmail.trim().toLowerCase();

    if (normalized.length === 0) {
      throw new DomainError('email is required');
    }

    if (normalized.length > MAX_LENGTH) {
      throw new DomainError(`email must be at most ${MAX_LENGTH} characters long`);
    }

    if (!EMAIL_REGEX.test(normalized)) {
      throw new DomainError('email format is invalid');
    }

    return new Email(normalized);
  }

  get value(): string {
    return this._value;
  }
}

export { MAX_LENGTH as EMAIL_MAX_LENGTH };
