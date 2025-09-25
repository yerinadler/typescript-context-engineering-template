import type { Request } from 'express';
import type { ZodSchema } from 'zod';
import { BadRequestError } from '../errors';

const formatIssues = (issues: readonly { message: string }[]): string =>
  Array.from(new Set(issues.map((issue) => issue.message))).join(', ');

export const parseWithSchema = <T>(schema: ZodSchema<T>, payload: unknown): T => {
  const result = schema.safeParse(payload);

  if (!result.success) {
    throw new BadRequestError(formatIssues(result.error.issues));
  }

  return result.data;
};

type RequestLike = Pick<Request, 'params' | 'query' | 'body'>;

type RequestSchema<P, B, Q> = {
  params?: ZodSchema<P>;
  body?: ZodSchema<B>;
  query?: ZodSchema<Q>;
};

type RequestValidationResult<P, B, Q> = {
  params: P;
  body: B;
  query: Q;
};

export const validateRequest = <P = unknown, B = unknown, Q = unknown>(
  req: RequestLike,
  schema: RequestSchema<P, B, Q>,
): RequestValidationResult<P, B, Q> => {
  const params = schema.params ? parseWithSchema(schema.params, req.params) : ({} as P);
  const body = schema.body ? parseWithSchema(schema.body, req.body ?? {}) : ({} as B);
  const query = schema.query ? parseWithSchema(schema.query, req.query ?? {}) : ({} as Q);

  return { params, body, query };
};
