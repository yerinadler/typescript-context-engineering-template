export type BaseResponse<T = unknown> = {
  code: string;
  message: string;
  data?: T;
};

export type BaseErrorResponse = {
  code: string;
  error: string;
};

export type ApiResponse<T = unknown> = BaseResponse<T> | BaseErrorResponse;

export const createSuccessResponse = <T>(code: string, message: string, data?: T): BaseResponse<T> => ({
  code,
  message,
  ...(data !== undefined ? { data } : {}),
});

export const createErrorResponse = (code: string, error: string): BaseErrorResponse => ({
  code,
  error,
});
