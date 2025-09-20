import { ApplicationErrorCode, errorCodes } from './error-codes';

const DEFAULT_HTTP_STATUS = 500;

export const errorHttpStatusMap: Record<ApplicationErrorCode, number> = {
  [errorCodes.BAD_REQUEST]: 400,
  [errorCodes.NOT_AUTHENTICATED]: 401,
  [errorCodes.NOT_AUTHORIZED]: 403,
  [errorCodes.NOT_FOUND]: 404,
  [errorCodes.METHOD_NOT_ALLOWED]: 405,
  [errorCodes.CONFLICT]: 409,
  [errorCodes.VALIDATION_ERROR]: 422,
  [errorCodes.TOO_MANY_REQUESTS]: 429,
  [errorCodes.INTERNAL_ERROR]: 500,
  [errorCodes.NOT_IMPLEMENTED]: 501,
  [errorCodes.BAD_GATEWAY]: 502,
  [errorCodes.SERVICE_UNAVAILABLE]: 503,
  [errorCodes.GATEWAY_TIMEOUT]: 504,
};

export const resolveHttpStatus = (errorCode: ApplicationErrorCode): number =>
  errorHttpStatusMap[errorCode] ?? DEFAULT_HTTP_STATUS;

export { DEFAULT_HTTP_STATUS };
