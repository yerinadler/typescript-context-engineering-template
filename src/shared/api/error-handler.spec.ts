import { Request, Response } from 'express';
import { errorCodes, NotFoundError } from '../errors';
import { errorHandler } from './error-handler';

describe('errorHandler', () => {
  const createMockResponse = () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    return res;
  };

  it('handles ApplicationError instances', () => {
    const error = new NotFoundError();
    const res = createMockResponse();

    errorHandler(error, {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      code: errorCodes.NOT_FOUND,
      error: error.message,
    });
  });

  it('converts generic errors into internal error responses', () => {
    const error = new Error('boom');
    const res = createMockResponse();

    errorHandler(error, {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      code: errorCodes.INTERNAL_ERROR,
      error: error.message,
    });
  });

  it('returns a fallback response for unknown error types', () => {
    const res = createMockResponse();

    errorHandler('unknown', {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      code: errorCodes.INTERNAL_ERROR,
      error: 'unknown error type detected',
    });
  });
});
