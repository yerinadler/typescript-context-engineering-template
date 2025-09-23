import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { NotFoundError, ValidationError } from '../../../../shared/errors/application-error';
import { TYPES } from '../../../../shared/di';
import { DomainError } from '../../domain/errors/domain-error';
import { UpdateUserStatusDto, toUserDto, UserDto } from '../dto/user.dto';
import { UserRepository } from '../ports/user-repository.port';

@injectable()
export class UpdateUserStatusUseCase {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async execute(id: string, dto: UpdateUserStatusDto): Promise<UserDto> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundError(`user with id ${id} not found`);
      }

      // Apply status change
      if (dto.status === 'active') {
        user.activate();
      } else if (dto.status === 'suspended') {
        user.suspend();
      } else {
        throw new ValidationError('status must be either "active" or "suspended"');
      }

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
