import {
  ApiResponse,
  BaseErrorResponse,
  BaseResponse,
  createErrorResponse,
  createSuccessResponse,
} from './base-response';

describe('Base API response helpers', () => {
  it('creates a success response without data', () => {
    const response = createSuccessResponse('000', 'Ok');

    const expected: BaseResponse = {
      code: '000',
      message: 'Ok',
    };

    expect(response).toEqual(expected);
  });

  it('creates a success response with data', () => {
    const response = createSuccessResponse('000', 'Get user list', [{ name: 'John' }]);

    const expected: BaseResponse<Array<{ name: string }>> = {
      code: '000',
      message: 'Get user list',
      data: [{ name: 'John' }],
    };

    expect(response).toEqual(expected);
  });

  it('creates an error response', () => {
    const response = createErrorResponse('USER_NOT_FOUND', 'User not found');

    const expected: BaseErrorResponse = {
      code: 'USER_NOT_FOUND',
      error: 'User not found',
    };

    expect(response).toEqual(expected);
  });

  it('narrows to ApiResponse union type', () => {
    const success: ApiResponse = createSuccessResponse('000', 'Ok');
    const error: ApiResponse = createErrorResponse('500', 'Internal error');

    expect(success.code).toBe('000');
    expect(error).toHaveProperty('error', 'Internal error');
  });
});
