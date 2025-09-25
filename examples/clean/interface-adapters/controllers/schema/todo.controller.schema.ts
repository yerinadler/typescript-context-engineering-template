import { z } from 'zod';
import { requiredString } from '../../../../../src/shared/validation';

export const createTodoBodySchema = z.object({
  title: requiredString('title'),
  description: requiredString('description'),
});
