import {describe, expect, it, vi} from 'vitest';
import {friendshipController} from '../../../dependencies/Friendship/friendshipController.js';
import type {IFriendshipService} from '../../../dependencies/Friendship/types.js';

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

describe('areInRelation', () => {
  it('should throw unauthorised when user does not have currentUser object', async () => {
    const fakeService = {} as IFriendshipService;
    const controller = new friendshipController(fakeService);
    const http = createHttpMock({currentUser: undefined}) as any;
    await controller.areInRelation(http.req, http.res, http.next);
    expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Unauthorised'}));
  });

  it('should call findRelationBetween with currentUser id and otherId', async () => {
    const fakeService = {
      findRelationBetween: vi.fn().mockResolvedValue({userId: 4, friendId: 1})
    };
    const controller = new friendshipController(fakeService as any);
    const http = createHttpMock({
      currentUser: {id: 4},
      body: {data: {otherId: 1}}
    }) as any;
    await controller.areInRelation(http.req, http.res, http.next);
    expect(fakeService.findRelationBetween).toHaveBeenCalledWith(4, 1);
  });

  it('should return status 400 when otherId is not a number', async () => {
    const fakeService = {
      findRelationBetween: vi.fn(),
    };
    const controller = new friendshipController(fakeService as any);
    const http = createHttpMock({currentUser: {id: 4}, body: {data: {otherId: '5'}}}) as any;
    await controller.areInRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({success: false});
    expect(fakeService.findRelationBetween).not.toHaveBeenCalled();
  });

  it('should return status 400 when otherId is negative', async () => {
    const fakeService = {
      findRelationBetween: vi.fn(),
    };
    const controller = new friendshipController(fakeService as any);
    const http = createHttpMock({currentUser: {id: 4}, body: {data: {otherId: -2}}}) as any;
    await controller.areInRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({success: false});
    expect(fakeService.findRelationBetween).not.toHaveBeenCalled();
  });

  it('should return status 400 when otherId is not passed', async () => {
    const fakeService = {
      findRelationBetween: vi.fn(),
    };
    const controller = new friendshipController(fakeService as any);
    const http = createHttpMock({currentUser: {id: 4}, body: {data: {otherId: undefined}}}) as any;
    await controller.areInRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({success: false});
    expect(fakeService.findRelationBetween).not.toHaveBeenCalled();
  });

  it('should return status 200 and success true when succeed', async () => {
    const fakeService = {
      findRelationBetween: vi.fn(),
    };
    const controller = new friendshipController(fakeService as any);
    const http = createHttpMock({currentUser: {id: 1}, body: {data: {otherId: 4}}}) as any;
    await controller.areInRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(200);
    expect(http.res.json).toHaveBeenCalledWith({success: true});
  });
});

describe('setRelation', () => {
  it('should throw unauthorised when user does not have currentUser object', async () => {
    const fakeService = {} as IFriendshipService;
    const controller = new friendshipController(fakeService);
    const http = createHttpMock({currentUser: undefined}) as any;
    await controller.setRelation(http.req, http.res, http.next);
    expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Unauthorised'}));
  });

  it('should return status code 400 and json with success false when otherId is not a number', async () => {
    const fakeService = {};
    const http = createHttpMock({
      currentUser: {id: 1},
      body: {data: {otherId: '5'}}
    }) as any;
    const controller = new friendshipController(fakeService as any);
    await controller.setRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({success: false});
  });

  it('should return status code 400 and json with success false when otherId is negative', async () => {
    const fakeService = {};
    const http = createHttpMock({
      currentUser: {id: 1},
      body: {data: {otherId: -2}}
    }) as any;
    const controller = new friendshipController(fakeService as any);
    await controller.setRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({success: false});
  });

  it('should return status code 400 and json with success false when otherId is not passed', async () => {
    const fakeService = {};
    const http = createHttpMock({
      currentUser: {id: 1},
      body: {data: {otherId: undefined}}
    }) as any;
    const controller = new friendshipController(fakeService as any);
    await controller.setRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({success: false});
  });

  it('should return status code 400 and json with success false when user is actually in relation with that user', async () => {
    const http = createHttpMock({
      currentUser: {id: 1},
      body: {data: {otherId: 2}}
    }) as any;
    const fakeService = {
      findRelationBetween: vi.fn().mockResolvedValue({userId: 1, friendId: 2}),
      insertRelation: vi.fn(),
    };
    const controller = new friendshipController(fakeService as any);
    await controller.setRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({success: false});
    expect(fakeService.insertRelation).not.toHaveBeenCalled();
  });

  it('should return status code 201 and json with success true when succeed', async () => {
    const http = createHttpMock({
      currentUser: {id: 1},
      body: {data: {otherId: 2}}
    }) as any;
    const fakeService = {
      findRelationBetween: vi.fn().mockResolvedValue(null),
      insertRelation: vi.fn().mockResolvedValue(true)
    };
    const controller = new friendshipController(fakeService as any);
    await controller.setRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(201);
    expect(http.res.json).toHaveBeenCalledWith(expect.objectContaining({success: true}));
    expect(fakeService.insertRelation).toHaveBeenCalled();
  });
});

describe('removeRelation', () => {
  it('should throw unauthorised when currentUser is not passed', async () => {
    const fakeService = {};
    const http = createHttpMock({currentUser: undefined}) as any;
    const controller = new friendshipController(fakeService as any);
    await controller.removeRelation(http.req, http.res, http.next);
    expect(http.next).toHaveBeenCalledWith(expect.objectContaining({message: 'Unauthorised'}));
  });

  it('should return status 400 and success false when otherId is not a number', async () => {
    const fakeService = {};
    const http = createHttpMock({
      currentUser: {id: 5},
      body: {data: {otherId: '5'}}
    }) as any;
    const controller = new friendshipController(fakeService as any);
    await controller.removeRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({success: false});
  });

  it('should return status 400 and success false when otherId is negative', async () => {
    const fakeService = {};
    const http = createHttpMock({
      currentUser: {id: 5},
      body: {data: {otherId: -5}}
    }) as any;
    const controller = new friendshipController(fakeService as any);
    await controller.removeRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(400);
    expect(http.res.json).toHaveBeenCalledWith({success: false});
  });

  it('should return status 200 and success true when succeed', async () => {
    const fakeService = {
      removeRelation: vi.fn().mockReturnValue(true)
    };
    const http = createHttpMock({
      currentUser: {id: 5},
      body: {data: {otherId: 4}}
    }) as any;
    const controller = new friendshipController(fakeService as any);
    await controller.removeRelation(http.req, http.res, http.next);
    expect(http.res.status).toHaveBeenCalledWith(200);
    expect(http.res.json).toHaveBeenCalledWith(expect.objectContaining({success: true}));
    expect(fakeService.removeRelation).toHaveBeenCalledWith(5, 4);
  });
});