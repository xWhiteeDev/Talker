import { describe, expect, it, vi } from 'vitest';
import { friendshipController } from '../../../dependencies/Friendship/friendshipController.js';
import type { IFriendshipService } from '../../../dependencies/Friendship/types.js';

describe('areInRelation', () => {
  it('should throw unauthorised when user does not have currentUser object', async () => {
    const fakeService = {} as IFriendshipService;
    const controller = new friendshipController(fakeService);
    const http = {
      req: { currentUser: undefined },
      res: {},
      next: vi.fn(),
    } as any;
    await controller.areInRelation(http.req, http.res, http.next);
    expect(http.next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Unauthorised' }));
  });

  it('should return status 400 when otherId is not a number', async () => {
    const fakeService = {
      findRelationBetween: vi.fn(),
    };
    const controller = new friendshipController(fakeService as any);
    const http = {
      req: { currentUser: { id: 4 }, body: { data: { otherId: '5' } } },
      res: { status: vi.fn().mockReturnThis(), json: vi.fn() },
      next: vi.fn(),
    } as any;
    await controller.areInRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({ success: false });
  });

  it('should return status 400 when otherId is negative', async () => {
    const fakeService = {
      findRelationBetween: vi.fn(),
    };
    const controller = new friendshipController(fakeService as any);
    const http = {
      req: { currentUser: { id: 4 }, body: { data: { otherId: -2 } } },
      res: { status: vi.fn().mockReturnThis(), json: vi.fn() },
      next: vi.fn(),
    } as any;
    await controller.areInRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({ success: false });
  });

  it('should return status 400 when otherId is not passed', async () => {
    const fakeService = {
      findRelationBetween: vi.fn(),
    };
    const controller = new friendshipController(fakeService as any);
    const http = {
      req: { currentUser: { id: 4 }, body: { data: { otherId: undefined } } },
      res: { status: vi.fn().mockReturnThis(), json: vi.fn() },
      next: vi.fn(),
    } as any;
    await controller.areInRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({ success: false });
  });

  it('should return status 200 and success true when succeed', async () => {
    const fakeService = {
      findRelationBetween: vi.fn(),
    };
    const controller = new friendshipController(fakeService as any);
    const http = {
      req: { currentUser: { id: 1 }, body: { data: { otherId: 4 } } },
      res: { status: vi.fn().mockReturnThis(), json: vi.fn() },
      next: vi.fn(),
    } as any;
    await controller.areInRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(200);
    expect(http.res.json).toHaveBeenCalledWith({ success: true });
  });
});

describe('setRelation', () => {
  it('should throw unauthorised when user does not have currentUser object', async () => {
    const fakeService = {} as IFriendshipService;
    const controller = new friendshipController(fakeService);
    const http = {
      req: { currentUser: undefined },
      res: {},
      next: vi.fn(),
    } as any;
    await controller.setRelation(http.req, http.res, http.next);
    expect(http.next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Unauthorised' }));
  });
  it('should return status code 400 and json with success false when otherId is not a number', async () => {
    const fakeService = {};
    const http = {
      req: {
        currentUser: {
          id: 1,
        },
        body: {
          data: {
            otherId: '5',
          },
        },
      },
      res: {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      },
      next: vi.fn(),
    } as any;

    const controller = new friendshipController(fakeService as any);
    await controller.setRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({ success: false });
  });

  it('should return status code 400 and json with success false when otherId is negative', async () => {
    const fakeService = {};
    const http = {
      req: {
        currentUser: {
          id: 1,
        },
        body: {
          data: {
            otherId: -2,
          },
        },
      },
      res: {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      },
      next: vi.fn(),
    } as any;

    const controller = new friendshipController(fakeService as any);
    await controller.setRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({ success: false });
  });

  it('should return status code 400 and json with success false when otherId is not passed', async () => {
    const fakeService = {};
    const http = {
      req: {
        currentUser: {
          id: 1,
        },
        body: {
          data: {
            otherId: undefined,
          },
        },
      },
      res: {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      },
      next: vi.fn(),
    } as any;

    const controller = new friendshipController(fakeService as any);
    await controller.setRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({ success: false });
  });

  it('should return status code 400 and json with success false when user is actually in relation with that user', async () => {
    const http = {
      req: {
        currentUser: {
          id: 1,
        },
        body: {
          data: {
            otherId: 2,
          },
        },
      },
      res: {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      },
      next: vi.fn(),
    } as any;

    const fakeService = {
      findRelationBetween: vi.fn().mockResolvedValue({ userId: 1, friendId: 2 }),
    };
    const controller = new friendshipController(fakeService as any);
    await controller.setRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({ success: false });
  });

  it('should return status code 200 and json with success true when succeed', async () => {
    const http = {
      req: {
        currentUser: {
          id: 1,
        },
        body: {
          data: {
            otherId: 2,
          },
        },
      },
      res: {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      },
      next: vi.fn(),
    } as any;
    const fakeService = {
      findRelationBetween: vi.fn().mockResolvedValue(null),
      insertRelation: vi.fn().mockResolvedValue(true)
    };
    const controller = new friendshipController(fakeService as any);
    await controller.setRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(201);
    expect(http.res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
