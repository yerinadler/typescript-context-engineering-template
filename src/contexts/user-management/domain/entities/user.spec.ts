import { BirthDate } from '../value-objects/birth-date';
import { Email } from '../value-objects/email';
import { FullName } from '../value-objects/full-name';
import { Gender } from '../value-objects/gender';
import { User } from './user';

describe('User', () => {
  const createValidUser = () => {
    return User.create({
      id: 'user-123',
      fullName: FullName.create('John Doe'),
      email: Email.create('john.doe@example.com'),
      gender: Gender.create('male'),
      birthDate: BirthDate.create('1990-01-01'),
    });
  };

  describe('create', () => {
    it('should create a user with valid properties', () => {
      const user = createValidUser();

      expect(user.id).toBe('user-123');
      expect(user.fullName).toBe('John Doe');
      expect(user.email).toBe('john.doe@example.com');
      expect(user.gender).toBe('male');
      expect(user.status).toBe('active');
      expect(user.age).toBeGreaterThan(30);
    });

    it('should throw error for empty id', () => {
      expect(() =>
        User.create({
          id: '',
          fullName: FullName.create('John Doe'),
          email: Email.create('john.doe@example.com'),
          gender: Gender.create('male'),
          birthDate: BirthDate.create('1990-01-01'),
        }),
      ).toThrow('user id is required');
    });

    it('should set default status to active', () => {
      const user = createValidUser();
      expect(user.status).toBe('active');
    });

    it('should accept custom status', () => {
      const user = User.create({
        id: 'user-123',
        fullName: FullName.create('John Doe'),
        email: Email.create('john.doe@example.com'),
        gender: Gender.create('male'),
        birthDate: BirthDate.create('1990-01-01'),
        status: 'suspended',
      });

      expect(user.status).toBe('suspended');
    });
  });

  describe('updateProfile', () => {
    it('should update full name', () => {
      const user = createValidUser();
      const newName = FullName.create('Jane Smith');

      user.updateProfile({ fullName: newName });

      expect(user.fullName).toBe('Jane Smith');
    });

    it('should update email', () => {
      const user = createValidUser();
      const newEmail = Email.create('jane.smith@example.com');

      user.updateProfile({ email: newEmail });

      expect(user.email).toBe('jane.smith@example.com');
    });

    it('should update multiple fields', () => {
      const user = createValidUser();
      const newName = FullName.create('Jane Smith');
      const newEmail = Email.create('jane.smith@example.com');
      const newGender = Gender.create('female');

      user.updateProfile({
        fullName: newName,
        email: newEmail,
        gender: newGender,
      });

      expect(user.fullName).toBe('Jane Smith');
      expect(user.email).toBe('jane.smith@example.com');
      expect(user.gender).toBe('female');
    });

    it('should update updatedAt when profile is changed', () => {
      const user = createValidUser();
      const originalUpdatedAt = user.updatedAt;

      // Wait a bit to ensure different timestamps
      setTimeout(() => {
        user.updateProfile({ fullName: FullName.create('Jane Smith') });
        expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      }, 10);
    });
  });

  describe('suspend', () => {
    it('should change status from active to suspended', () => {
      const user = createValidUser();

      user.suspend();

      expect(user.status).toBe('suspended');
    });

    it('should throw error if already suspended', () => {
      const user = User.create({
        id: 'user-123',
        fullName: FullName.create('John Doe'),
        email: Email.create('john.doe@example.com'),
        gender: Gender.create('male'),
        birthDate: BirthDate.create('1990-01-01'),
        status: 'suspended',
      });

      expect(() => user.suspend()).toThrow('user is already suspended');
    });
  });

  describe('activate', () => {
    it('should change status from suspended to active', () => {
      const user = User.create({
        id: 'user-123',
        fullName: FullName.create('John Doe'),
        email: Email.create('john.doe@example.com'),
        gender: Gender.create('male'),
        birthDate: BirthDate.create('1990-01-01'),
        status: 'suspended',
      });

      user.activate();

      expect(user.status).toBe('active');
    });

    it('should throw error if already active', () => {
      const user = createValidUser();

      expect(() => user.activate()).toThrow('user is already active');
    });
  });

  describe('toSnapshot', () => {
    it('should return complete snapshot of user data', () => {
      const user = createValidUser();
      const snapshot = user.toSnapshot();

      expect(snapshot.id).toBe('user-123');
      expect(snapshot.fullName).toBe('John Doe');
      expect(snapshot.email).toBe('john.doe@example.com');
      expect(snapshot.gender).toBe('male');
      expect(snapshot.status).toBe('active');
      expect(snapshot.birthDate).toBeInstanceOf(Date);
      expect(snapshot.createdAt).toBeInstanceOf(Date);
      expect(snapshot.updatedAt).toBeInstanceOf(Date);
    });
  });
});
