import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../shared/di';
import { toUserDto, UserDto } from '../dto/user.dto';
import { UserRepository } from '../ports/user-repository.port';

@injectable()
export class ListUsersUseCase {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  async execute(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(toUserDto);
  }
}
