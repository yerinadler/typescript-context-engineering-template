import 'reflect-metadata';
import { randomUUID } from 'crypto';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../shared/di';
import { ConflictError, ValidationError } from '../../../../shared/errors/application-error';
import { User } from '../../domain/entities/user';
import { DomainError } from '../../domain/errors/domain-error';
import { BirthDate } from '../../domain/value-objects/birth-date';
import { Email } from '../../domain/value-objects/email';
import { FullName } from '../../domain/value-objects/full-name';
import { Gender } from '../../domain/value-objects/gender';
import { CreateUserDto, toUserDto, UserDto } from '../dto/user.dto';
import { UserRepository } from '../ports/user-repository.port';

@injectable()
export class CreateUserUseCase {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async execute(dto: CreateUserDto): Promise<UserDto> {
    try {
      // Create value objects (this will validate the input)
      const fullName = FullName.create(dto.fullName);
      const email = Email.create(dto.email);
      const gender = Gender.create(dto.gender);
      const birthDate = BirthDate.create(dto.birthDate);

      // Check if user with email already exists
      const existingUser = await this.userRepository.findByEmail(email.value);
      if (existingUser) {
        throw new ConflictError('user with this email already exists');
      }

      // Create user entity
      const user = User.create({
        id: randomUUID(),
        fullName,
        email,
        gender,
        birthDate,
      });

      // Save user
      await this.userRepository.save(user);

      return toUserDto(user);
    } catch (error) {
      if (error instanceof DomainError) {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  }
}
