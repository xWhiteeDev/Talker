import {describe, expect, it, vi} from 'vitest';
import {validateOtherUser} from '../../../dependencies/Friendship/friendshipMiddleware.js';
import {ErrorHandler} from '../../../handlers/errorHandler.js';

function createHttpMock(overrides: {}) {
  return {
    req: {...overrides},
    res: {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    },
    next: vi.fn()
  };
}

describe('validateOtherUser', () => {
  it('should call next without error when otherId is a number', async () => {
    const http = createHttpMock({body: {data: {otherId: 5}}}) as any;
    await validateOtherUser()(http.req, http.res, http.next);
    expect(http.next).toHaveBeenCalledTimes(1);
    expect(http.next).toHaveBeenCalledWith();
  });

  it('should call next without error when otherId is a numeric string', async () => {
    const http = createHttpMock({body: {data: {otherId: '12'}}}) as any;
    await validateOtherUser()(http.req, http.res, http.next);
    expect(http.next).toHaveBeenCalledTimes(1);
    expect(http.next).toHaveBeenCalledWith();
  });

  it('should pass error with code 400 to next when otherId is not a number', async () => {
    const http = createHttpMock({body: {data: {otherId: 'abc'}}}) as any;
    await validateOtherUser()(http.req, http.res, http.next);
    expect(http.next).toHaveBeenCalledTimes(1);
    const [error] = http.next.mock.calls[0];
    expect(error).toBeInstanceOf(ErrorHandler);
    expect(error.message).toBe('The otherId param is not a number!');
    expect(error.code).toBe(400);
  });

  it('should pass error to next when otherId is missing', async () => {
    const http = createHttpMock({body: {data: {}}}) as any;
    await validateOtherUser()(http.req, http.res, http.next);
    expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'The otherId param is not a number!'}));
  });

  it('should not send any response by itself', async () => {
    const http = createHttpMock({body: {data: {otherId: 'abc'}}}) as any;
    await validateOtherUser()(http.req, http.res, http.next);
    expect(http.res.status).not.toHaveBeenCalled();
    expect(http.res.json).not.toHaveBeenCalled();
  });
});
