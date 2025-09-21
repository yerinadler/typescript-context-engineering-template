import { DomainError } from '../errors/domain-error';

const MIN_AGE = 13; // Minimum age for user registration
const MAX_AGE = 120; // Reasonable maximum age

export class BirthDate {
  private constructor(private readonly _value: Date) {}

  static create(rawDate: string | Date): BirthDate {
    let date: Date;

    if (typeof rawDate === 'string') {
      date = new Date(rawDate);
      if (isNaN(date.getTime())) {
        throw new DomainError('birth date must be a valid date');
      }
    } else if (rawDate instanceof Date) {
      date = rawDate;
    } else {
      throw new DomainError('birth date must be a valid date string or Date object');
    }

    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    const monthDiff = now.getMonth() - date.getMonth();
    const dayDiff = now.getDate() - date.getDate();

    // Adjust age if birthday hasn't occurred this year
    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    if (date > now) {
      throw new DomainError('birth date cannot be in the future');
    }

    if (actualAge < MIN_AGE) {
      throw new DomainError(`user must be at least ${MIN_AGE} years old`);
    }

    if (actualAge > MAX_AGE) {
      throw new DomainError(`user cannot be older than ${MAX_AGE} years`);
    }

    return new BirthDate(date);
  }

  get value(): Date {
    return this._value;
  }

  get age(): number {
    const now = new Date();
    const age = now.getFullYear() - this._value.getFullYear();
    const monthDiff = now.getMonth() - this._value.getMonth();
    const dayDiff = now.getDate() - this._value.getDate();

    return monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
  }
}

export { MIN_AGE as BIRTH_DATE_MIN_AGE, MAX_AGE as BIRTH_DATE_MAX_AGE };
