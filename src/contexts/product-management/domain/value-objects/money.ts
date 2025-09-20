import { DomainError } from '../errors/domain-error';

const CURRENCY_PATTERN = /^[A-Z]{3}$/;

export class Money {
  private constructor(
    private readonly _amountCents: number,
    private readonly _currency: string,
  ) {}

  static fromCents(amountCents: number, currency: string): Money {
    if (!Number.isInteger(amountCents)) {
      throw new DomainError('price must be provided in whole cents');
    }

    if (amountCents < 0) {
      throw new DomainError('price must be zero or greater');
    }

    if (typeof currency !== 'string') {
      throw new DomainError('currency must be a string');
    }

    const normalizedCurrency = currency.trim().toUpperCase();

    if (!CURRENCY_PATTERN.test(normalizedCurrency)) {
      throw new DomainError('currency must be a three-letter ISO code');
    }

    return new Money(amountCents, normalizedCurrency);
  }

  get amountCents(): number {
    return this._amountCents;
  }

  get currency(): string {
    return this._currency;
  }
}

export { CURRENCY_PATTERN };
