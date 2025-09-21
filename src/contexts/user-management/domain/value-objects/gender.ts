import { DomainError } from '../errors/domain-error';

export type GenderType = 'male' | 'female' | 'other' | 'prefer-not-to-say';

const VALID_GENDERS: GenderType[] = ['male', 'female', 'other', 'prefer-not-to-say'];

export class Gender {
  private constructor(private readonly _value: GenderType) {}

  static create(rawGender: string): Gender {
    if (typeof rawGender !== 'string') {
      throw new DomainError('gender must be a string');
    }

    const normalized = rawGender.trim().toLowerCase() as GenderType;

    if (!VALID_GENDERS.includes(normalized)) {
      throw new DomainError(`gender must be one of: ${VALID_GENDERS.join(', ')}`);
    }

    return new Gender(normalized);
  }

  get value(): GenderType {
    return this._value;
  }
}

export { VALID_GENDERS };
