import { ApplicationErrorCode, errorCodes } from './error-codes';

export class ApplicationError extends Error {
  constructor(
    public readonly errorCode: ApplicationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'ApplicationError';
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, new.target);
  }
}

export class BadRequestError extends ApplicationError {
  constructor(message = 'the request payload is invalid') {
    super(errorCodes.BAD_REQUEST, message);
    this.name = 'BadRequestError';
  }
}

export class NotAuthenticatedError extends ApplicationError {
  constructor(message = 'authentication is required to access this resource') {
    super(errorCodes.NOT_AUTHENTICATED, message);
    this.name = 'NotAuthenticatedError';
  }
}

export class NotAuthorizedError extends ApplicationError {
  constructor(message = 'you are not allowed to perform this action') {
    super(errorCodes.NOT_AUTHORIZED, message);
    this.name = 'NotAuthorizedError';
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = 'the requested resource was not found') {
    super(errorCodes.NOT_FOUND, message);
    this.name = 'NotFoundError';
  }
}

export class MethodNotAllowedError extends ApplicationError {
  constructor(message = 'the requested method is not supported for this resource') {
    super(errorCodes.METHOD_NOT_ALLOWED, message);
    this.name = 'MethodNotAllowedError';
  }
}

export class ConflictError extends ApplicationError {
  constructor(message = 'a conflict occurred while processing the request') {
    super(errorCodes.CONFLICT, message);
    this.name = 'ConflictError';
  }
}

export class ValidationError extends ApplicationError {
  constructor(message = 'the request failed business validation rules') {
    super(errorCodes.VALIDATION_ERROR, message);
    this.name = 'ValidationError';
  }
}

export class TooManyRequestsError extends ApplicationError {
  constructor(message = 'too many requests were made in a short period of time') {
    super(errorCodes.TOO_MANY_REQUESTS, message);
    this.name = 'TooManyRequestsError';
  }
}

export class InternalError extends ApplicationError {
  constructor(message = 'an unexpected error occurred') {
    super(errorCodes.INTERNAL_ERROR, message);
    this.name = 'InternalError';
  }
}

export class NotImplementedError extends ApplicationError {
  constructor(message = 'this functionality has not been implemented yet') {
    super(errorCodes.NOT_IMPLEMENTED, message);
    this.name = 'NotImplementedError';
  }
}

export class BadGatewayError extends ApplicationError {
  constructor(message = 'an upstream service returned an invalid response') {
    super(errorCodes.BAD_GATEWAY, message);
    this.name = 'BadGatewayError';
  }
}

export class ServiceUnavailableError extends ApplicationError {
  constructor(message = 'the service is temporarily unavailable') {
    super(errorCodes.SERVICE_UNAVAILABLE, message);
    this.name = 'ServiceUnavailableError';
  }
}

export class GatewayTimeoutError extends ApplicationError {
  constructor(message = 'the service took too long to respond') {
    super(errorCodes.GATEWAY_TIMEOUT, message);
    this.name = 'GatewayTimeoutError';
  }
}
