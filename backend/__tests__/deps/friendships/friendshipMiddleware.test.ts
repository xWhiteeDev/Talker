import {describe, expect, it, vi} from 'vitest';
import {validateOtherUser} from '../../../dependencies/Friendship/friendshipMiddleware.js';

function createHttpMock(overrides: {}) {
  return {
    req: {...overrides},
    res: {},
    next: vi.fn(),
  };
}

describe('validateOtherUser', () => {
  it('should call next with an error when otherId is not a number', async () => {
    const http = createHttpMock({body: {data: {otherId: 'abc'}}}) as any;
    await validateOtherUser()(http.req, http.res, http.next);
    expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'The otherId param is not a number!'}));
  });

  it('should call next with an error when otherId is missing', async () => {
    const http = createHttpMock({body: {data: {}}}) as any;
    await validateOtherUser()(http.req, http.res, http.next);
    expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'The otherId param is not a number!'}));
  });

  it('should call next without arguments when otherId is a number', async () => {
    const http = createHttpMock({body: {data: {otherId: 5}}}) as any;
    await validateOtherUser()(http.req, http.res, http.next);
    expect(http.next).toHaveBeenCalledWith();
  });

  it('should accept numeric string as otherId', async () => {
    const http = createHttpMock({body: {data: {otherId: '5'}}}) as any;
    await validateOtherUser()(http.req, http.res, http.next);
    expect(http.next).toHaveBeenCalledWith();
  });
});
