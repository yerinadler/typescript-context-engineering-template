import { User } from '../../domain/entities/user';
import { GenderType } from '../../domain/value-objects/gender';

export class UserDto {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly gender: GenderType,
    public readonly birthDate: string,
    public readonly age: number,
    public readonly status: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}
}

export class CreateUserDto {
  constructor(
    public readonly fullName: string,
    public readonly email: string,
    public readonly gender: string,
    public readonly birthDate: string,
  ) {}
}

export class UpdateUserProfileDto {
  constructor(
    public readonly fullName?: string,
    public readonly email?: string,
    public readonly gender?: string,
    public readonly birthDate?: string,
  ) {}
}

export class UpdateUserStatusDto {
  constructor(public readonly status: string) {}
}

export const toUserDto = (user: User): UserDto =>
  new UserDto(
    user.id,
    user.fullName,
    user.email,
    user.gender,
    user.birthDate.toISOString(),
    user.age,
    user.status,
    user.createdAt.toISOString(),
    user.updatedAt.toISOString(),
  );
