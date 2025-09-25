import { z } from 'zod';
import { BadRequestError } from '../errors';
import { optionalString, requiredString } from './fields.schema';
import { parseWithSchema, validateRequest } from './request.validator';

describe('parseWithSchema', () => {
  const schema = z.object({
    name: requiredString('name'),
    description: optionalString('description'),
  });

  it('returns parsed data when validation succeeds', () => {
    const result = parseWithSchema(schema, { name: '  Ada ', description: '  Pioneer ' });

    expect(result).toEqual({ name: 'Ada', description: 'Pioneer' });
  });

  it('throws BadRequestError with field-specific messages on failure', () => {
    expect.assertions(3);

    try {
      parseWithSchema(schema, { description: 10 });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      expect((error as Error).message).toContain('name is required');
      expect((error as Error).message).toContain('description must be a string');
    }
  });
});

describe('validateRequest', () => {
  const paramsSchema = z.object({ id: requiredString('id') });
  const bodySchema = z.object({
    title: requiredString('title'),
    notes: optionalString('notes'),
  });
  const querySchema = z.object({ search: optionalString('search') });

  it('parses the provided request parts and returns trimmed values', () => {
    const requestLike = {
      params: { id: ' 123 ' },
      body: { title: '  Example ', notes: '   ' },
      query: { search: undefined },
    };

    const { params, body, query } = validateRequest(requestLike, {
      params: paramsSchema,
      body: bodySchema,
      query: querySchema,
    });

    expect(params.id).toBe('123');
    expect(body.title).toBe('Example');
    expect(body.notes).toBeUndefined();
    expect(query.search).toBeUndefined();
  });

  it('propagates validation failures from params', () => {
    expect.assertions(2);

    const requestLike = {
      params: {},
      body: { title: 10 },
      query: {},
    };

    try {
      validateRequest(requestLike, {
        params: paramsSchema,
        body: bodySchema,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      expect((error as Error).message).toContain('id is required');
    }
  });

  it('propagates validation failures from the body when params are valid', () => {
    expect.assertions(2);

    const requestLike = {
      params: { id: '123' },
      body: { title: 10 },
      query: {},
    };

    try {
      validateRequest(requestLike, {
        params: paramsSchema,
        body: bodySchema,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      expect((error as Error).message).toContain('title must be a string');
    }
  });
});
