import { ConflictError, ValidationError } from '../../../../shared/errors/application-error';
import { User } from '../../domain/entities/user';
import { BirthDate } from '../../domain/value-objects/birth-date';
import { Email } from '../../domain/value-objects/email';
import { FullName } from '../../domain/value-objects/full-name';
import { Gender } from '../../domain/value-objects/gender';
import { UserRepository } from '../ports/user-repository.port';
import { CreateUserUseCase } from './create-user.use-case';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateUserUseCase(mockRepository);
  });

  describe('execute', () => {
    const validDto = {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      gender: 'male',
      birthDate: '1990-01-01',
    };

    it('should create a user successfully', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.save.mockResolvedValue();

      const result = await useCase.execute(validDto);

      expect(result.fullName).toBe('John Doe');
      expect(result.email).toBe('john.doe@example.com');
      expect(result.gender).toBe('male');
      expect(result.status).toBe('active');
      expect(result.id).toBeDefined();
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(User));
    });

    it('should throw ConflictError if email already exists', async () => {
      const existingUser = User.create({
        id: 'existing-user',
        fullName: FullName.create('Jane Smith'),
        email: Email.create('john.doe@example.com'),
        gender: Gender.create('female'),
        birthDate: BirthDate.create('1985-01-01'),
      });
      mockRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(useCase.execute(validDto)).rejects.toThrow(ConflictError);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid email', async () => {
      const invalidDto = {
        ...validDto,
        email: 'invalid-email',
      };

      await expect(useCase.execute(invalidDto)).rejects.toThrow(ValidationError);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid full name', async () => {
      const invalidDto = {
        ...validDto,
        fullName: 'J', // too short
      };

      await expect(useCase.execute(invalidDto)).rejects.toThrow(ValidationError);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid gender', async () => {
      const invalidDto = {
        ...validDto,
        gender: 'invalid-gender',
      };

      await expect(useCase.execute(invalidDto)).rejects.toThrow(ValidationError);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid birth date', async () => {
      const invalidDto = {
        ...validDto,
        birthDate: '2030-01-01', // future date
      };

      await expect(useCase.execute(invalidDto)).rejects.toThrow(ValidationError);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should call repository methods correctly', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.save.mockResolvedValue();

      await useCase.execute(validDto);

      expect(mockRepository.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});
