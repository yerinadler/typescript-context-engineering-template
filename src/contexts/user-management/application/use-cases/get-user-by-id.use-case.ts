import { NotFoundError } from '../../../../shared/errors/application-error';
import { toUserDto, UserDto } from '../dto/user.dto';
import { UserRepository } from '../ports/user-repository.port';

export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`user with id ${id} not found`);
    }

    return toUserDto(user);
  }
}
