import { ZodIssueCode, z } from 'zod';

/**
 * Creates a required trimmed string schema that raises field-specific messages.
 */
export const requiredString = (fieldName: string): z.ZodType<string> =>
  z.unknown().transform((value, ctx) => {
    if (value === null || value === undefined) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: `${fieldName} is required`,
      });

      return z.NEVER;
    }

    if (typeof value !== 'string') {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: `${fieldName} must be a string`,
      });

      return z.NEVER;
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: `${fieldName} is required`,
      });

      return z.NEVER;
    }

    return trimmed;
  });

/**
 * Creates an optional trimmed string schema that normalises nullish and blank values to undefined.
 */
export const optionalString = (fieldName: string): z.ZodType<string | undefined> =>
  z.unknown().transform((value, ctx) => {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value !== 'string') {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: `${fieldName} must be a string`,
      });

      return z.NEVER;
    }

    const trimmed = value.trim();

    return trimmed.length === 0 ? undefined : trimmed;
  });

/**
 * Creates a required number schema that coerces numeric strings and enforces finiteness.
 */
export const requiredNumber = (fieldName: string): z.ZodType<number> =>
  z.unknown().transform((value, ctx) => {
    if (value === null || value === undefined || value === '') {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: `${fieldName} is required`,
      });

      return z.NEVER;
    }

    const coerced = typeof value === 'number' ? value : Number(value);

    if (!Number.isFinite(coerced)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: `${fieldName} must be a valid number`,
      });

      return z.NEVER;
    }

    return coerced;
  });
