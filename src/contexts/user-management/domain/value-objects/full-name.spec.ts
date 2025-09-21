import { DomainError } from '../errors/domain-error';
import { FullName, FULL_NAME_MIN_LENGTH, FULL_NAME_MAX_LENGTH } from './full-name';

describe('FullName', () => {
  describe('create', () => {
    it('should create a valid full name', () => {
      const fullName = FullName.create('John Doe');
      expect(fullName.value).toBe('John Doe');
    });

    it('should trim whitespace', () => {
      const fullName = FullName.create('  Jane Smith  ');
      expect(fullName.value).toBe('Jane Smith');
    });

    it('should accept names with multiple parts', () => {
      const fullName = FullName.create('Mary Jane Watson');
      expect(fullName.value).toBe('Mary Jane Watson');
    });

    it('should throw error for non-string input', () => {
      expect(() => FullName.create(null as unknown as string)).toThrow(DomainError);
      expect(() => FullName.create(123 as unknown as string)).toThrow(DomainError);
    });

    it('should throw error for empty string', () => {
      expect(() => FullName.create('')).toThrow('full name is required');
      expect(() => FullName.create('   ')).toThrow('full name is required');
    });

    it('should throw error for names that are too short', () => {
      expect(() => FullName.create('A')).toThrow(`full name must be at least ${FULL_NAME_MIN_LENGTH} characters long`);
    });

    it('should throw error for names that are too long', () => {
      const longName = 'A'.repeat(FULL_NAME_MAX_LENGTH + 1);
      expect(() => FullName.create(longName)).toThrow(
        `full name must be at most ${FULL_NAME_MAX_LENGTH} characters long`,
      );
    });

    it('should throw error for single name (no last name)', () => {
      expect(() => FullName.create('John')).toThrow('full name must include at least first and last name');
    });

    it('should accept names with exactly minimum parts', () => {
      const fullName = FullName.create('AB CD');
      expect(fullName.value).toBe('AB CD');
    });
  });
});
