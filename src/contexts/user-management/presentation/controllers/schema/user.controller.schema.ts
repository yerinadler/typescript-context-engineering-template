import { z } from 'zod';
import { optionalString, requiredString } from '../../../../../shared/validation';

export const userIdParamsSchema = z.object({
  id: requiredString('user id'),
});

export const createUserBodySchema = z.object({
  fullName: requiredString('fullName'),
  email: requiredString('email'),
  gender: requiredString('gender'),
  birthDate: requiredString('birthDate'),
});

export const updateUserProfileBodySchema = z.object({
  fullName: optionalString('fullName'),
  email: optionalString('email'),
  gender: optionalString('gender'),
  birthDate: optionalString('birthDate'),
});

export const updateUserStatusBodySchema = z.object({
  status: requiredString('status'),
});
