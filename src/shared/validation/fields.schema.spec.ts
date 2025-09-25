import { requiredNumber, requiredString, optionalString } from './fields.schema';

describe('requiredString', () => {
  it('returns a trimmed string when input is valid', () => {
    expect(requiredString('fullName').parse('  Ada Lovelace  ')).toBe('Ada Lovelace');
  });

  it('raises when the value is not a string', () => {
    const result = requiredString('fullName').safeParse(42 as unknown);

    expect(result.success).toBe(false);
    expect(result.success ? undefined : result.error.issues[0]?.message).toBe('fullName must be a string');
  });

  it('raises when the value is blank after trimming', () => {
    const result = requiredString('fullName').safeParse('   ');

    expect(result.success).toBe(false);
    expect(result.success ? undefined : result.error.issues[0]?.message).toBe('fullName is required');
  });
});

describe('optionalString', () => {
  it('returns a trimmed string when present', () => {
    expect(optionalString('nickname').parse('  Ada  ')).toBe('Ada');
  });

  it('normalises blank strings to undefined', () => {
    expect(optionalString('nickname').parse('   ')).toBeUndefined();
  });

  it('normalises nullish values to undefined', () => {
    expect(optionalString('nickname').parse(null)).toBeUndefined();
    expect(optionalString('nickname').parse(undefined)).toBeUndefined();
  });

  it('raises when the value is not a string', () => {
    const result = optionalString('nickname').safeParse(10 as unknown);

    expect(result.success).toBe(false);
    expect(result.success ? undefined : result.error.issues[0]?.message).toBe('nickname must be a string');
  });
});

describe('requiredNumber', () => {
  it('accepts numeric values and passes them through', () => {
    expect(requiredNumber('priceCents').parse(1999)).toBe(1999);
  });

  it('coerces numeric strings', () => {
    expect(requiredNumber('priceCents').parse('2499')).toBe(2499);
  });

  it('raises when the value is missing', () => {
    const result = requiredNumber('priceCents').safeParse(undefined);

    expect(result.success).toBe(false);
    expect(result.success ? undefined : result.error.issues[0]?.message).toBe('priceCents is required');
  });

  it('raises when the value cannot be coerced to a finite number', () => {
    const result = requiredNumber('priceCents').safeParse('abc');

    expect(result.success).toBe(false);
    expect(result.success ? undefined : result.error.issues[0]?.message).toBe('priceCents must be a valid number');
  });
});
