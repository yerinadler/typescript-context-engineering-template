import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { NotFoundError } from '../../../../shared/errors/application-error';
import { TYPES } from '../../../../shared/di';
import { toUserDto, UserDto } from '../dto/user.dto';
import { UserRepository } from '../ports/user-repository.port';

@injectable()
export class GetUserByIdUseCase {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async execute(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`user with id ${id} not found`);
    }

    return toUserDto(user);
  }
}
