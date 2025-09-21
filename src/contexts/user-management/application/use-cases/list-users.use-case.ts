import { toUserDto, UserDto } from '../dto/user.dto';
import { UserRepository } from '../ports/user-repository.port';

export class ListUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(toUserDto);
  }
}
