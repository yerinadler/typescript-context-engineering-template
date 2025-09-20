import { ApplicationError, BadRequestError, errorCodes } from './index';

describe('ApplicationError', () => {
  it('extends the native Error object', () => {
    const error = new ApplicationError(errorCodes.INTERNAL_ERROR, 'test');

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ApplicationError');
    expect(error.errorCode).toBe(errorCodes.INTERNAL_ERROR);
    expect(error.message).toBe('test');
  });

  it('allows overriding default messages in specialised errors', () => {
    const error = new BadRequestError('custom message');

    expect(error.message).toBe('custom message');
    expect(error.errorCode).toBe(errorCodes.BAD_REQUEST);
  });

  it('provides a sensible default message', () => {
    const error = new BadRequestError();

    expect(error.message).toBe('the request payload is invalid');
  });
});
