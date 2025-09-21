import { User } from '../../domain/entities/user';
import { GenderType } from '../../domain/value-objects/gender';

export type UserDto = {
  id: string;
  fullName: string;
  email: string;
  gender: GenderType;
  birthDate: string;
  age: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserDto = {
  fullName: string;
  email: string;
  gender: string;
  birthDate: string;
};

export type UpdateUserProfileDto = {
  fullName?: string;
  email?: string;
  gender?: string;
  birthDate?: string;
};

export type UpdateUserStatusDto = {
  status: string;
};

export const toUserDto = (user: User): UserDto => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  gender: user.gender,
  birthDate: user.birthDate.toISOString(),
  age: user.age,
  status: user.status,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});
