import { NotFoundError, ConflictError, ValidationError } from '../../../../shared/errors/application-error';
import { DomainError } from '../../domain/errors/domain-error';
import { BirthDate } from '../../domain/value-objects/birth-date';
import { Email } from '../../domain/value-objects/email';
import { FullName } from '../../domain/value-objects/full-name';
import { Gender } from '../../domain/value-objects/gender';
import { UpdateUserProfileDto, toUserDto, UserDto } from '../dto/user.dto';
import { UserRepository } from '../ports/user-repository.port';

export class UpdateUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, dto: UpdateUserProfileDto): Promise<UserDto> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundError(`user with id ${id} not found`);
      }

      // Check if email is being changed and if new email already exists
      if (dto.email && dto.email !== user.email) {
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
          throw new ConflictError('user with this email already exists');
        }
      }

      // Create value objects for provided fields
      const updateParams: {
        fullName?: FullName;
        email?: Email;
        gender?: Gender;
        birthDate?: BirthDate;
      } = {};

      if (dto.fullName) {
        updateParams.fullName = FullName.create(dto.fullName);
      }
      if (dto.email) {
        updateParams.email = Email.create(dto.email);
      }
      if (dto.gender) {
        updateParams.gender = Gender.create(dto.gender);
      }
      if (dto.birthDate) {
        updateParams.birthDate = BirthDate.create(dto.birthDate);
      }

      // Update user
      user.updateProfile(updateParams);

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
