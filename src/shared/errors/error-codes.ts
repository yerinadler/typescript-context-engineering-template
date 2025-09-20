export const errorCodes = {
  BAD_REQUEST: 'bad_request',
  NOT_AUTHENTICATED: 'not_authenticated',
  NOT_AUTHORIZED: 'not_authorized',
  NOT_FOUND: 'not_found',
  METHOD_NOT_ALLOWED: 'method_not_allowed',
  CONFLICT: 'conflict',
  VALIDATION_ERROR: 'validation_error',
  TOO_MANY_REQUESTS: 'too_many_requests',
  INTERNAL_ERROR: 'internal_error',
  NOT_IMPLEMENTED: 'not_implemented',
  BAD_GATEWAY: 'bad_gateway',
  SERVICE_UNAVAILABLE: 'service_unavailable',
  GATEWAY_TIMEOUT: 'gateway_timeout',
} as const;

export type ApplicationErrorCode = (typeof errorCodes)[keyof typeof errorCodes];
