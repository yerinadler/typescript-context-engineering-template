import { NextFunction, Request, Response } from 'express';
import { ApplicationError, errorCodes, resolveHttpStatus } from '../errors';
import { frameworkLogger } from '../logging';
import { createErrorResponse } from './base-response';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof ApplicationError) {
    const statusCode = resolveHttpStatus(err.errorCode);
    frameworkLogger.error(err.message);
    res.status(statusCode).json(createErrorResponse(err.errorCode, err.message));
    return;
  }

  if (err instanceof Error) {
    frameworkLogger.error(err.message);
    res
      .status(resolveHttpStatus(errorCodes.INTERNAL_ERROR))
      .json(createErrorResponse(errorCodes.INTERNAL_ERROR, err.message));
    return;
  }

  res
    .status(resolveHttpStatus(errorCodes.INTERNAL_ERROR))
    .json(createErrorResponse(errorCodes.INTERNAL_ERROR, 'unknown error type detected'));
};
