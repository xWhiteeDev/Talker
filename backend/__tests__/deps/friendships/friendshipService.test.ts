import {describe, expect, it, vi} from 'vitest';
import {friendshipService} from '../../../dependencies/Friendship/friendshipService.js';
import type {FriendsRelation, FriendsRelationInsertDTO, FriendsRelationRow} from '../../../dependencies/Friendship/types.js';

describe('findRelationBetween', () => {
  it('should return null when relation not found', async () => {
    const fakeRepo = {
      findRelationBetween: vi.fn().mockResolvedValue(null),
    };
    const service = new friendshipService(fakeRepo as any);
    await expect(service.findRelationBetween(1, 2, 'accepted')).resolves.toBeNull();
  });

  it('should return relation', async () => {
    const payload: FriendsRelation = {
      id: 3,
      userId: 1,
      friendId: 2,
      status: 'accepted',
      created_at: 0,
    } as FriendsRelation;

    const fakeRepo = {
      findRelationBetween: vi.fn().mockResolvedValue(payload),
    };

    const service = new friendshipService(fakeRepo as any);
    await expect(service.findRelationBetween(1, 2, 'accepted')).resolves.toEqual(payload);
  });

  it('should pass arguments received correctly by function', async () => {
    const fakeRepo = {
      findRelationBetween: vi.fn(),
    };
    const service = new friendshipService(fakeRepo as any);
    await service.findRelationBetween(1, 2, 'pending');
    expect(fakeRepo.findRelationBetween).toHaveBeenCalledWith(1, 2, 'pending');
  });

  it('should return null when passed status argument is not allowed', async () => {
    const fakeRepo = {};
    const service = new friendshipService(fakeRepo as any);
    await expect(service.findRelationBetween(1, 2, 'anyOtherStatus')).resolves.toBe(null);
  });
});

describe('insertRelation', () => {
  it('should throw an error when relation with that user exists', async () => {
    const payload: FriendsRelationInsertDTO = {
      userId: 1,
      friendId: 2,
      status: 'accepted',
    };
    const fakeRepo = {
      findRelationBetween: vi.fn().mockResolvedValue({userId: 1, friendId: 2, status: 'accepted'}),
      insert: vi.fn(),
    };
    const service = new friendshipService(fakeRepo as any);
    await expect(service.insertRelation(payload)).rejects.toThrow('Relation found with exact user');
    expect(fakeRepo.insert).not.toHaveBeenCalled();
  });

  it('should return true when record inserted', async () => {
    const payload: FriendsRelationInsertDTO = {
      userId: 1,
      friendId: 2,
      status: 'accepted',
    };
    const fakeRepo = {
      findRelationBetween: vi.fn().mockResolvedValue(null),
      insert: vi.fn().mockResolvedValue(true),
    };
    const service = new friendshipService(fakeRepo as any);
    await expect(service.insertRelation(payload)).resolves.toBe(true);
    expect(fakeRepo.insert).toHaveBeenCalledWith(payload);
  });

  it('should throw an error when trying to add yourself', async () => {
    const payload: FriendsRelationInsertDTO = {
      userId: 1,
      friendId: 1,
      status: 'accepted',
    };
    const fakeRepo = {};
    const service = new friendshipService(fakeRepo as any);
    await expect(service.insertRelation(payload)).rejects.toThrow('Cannot add yourself as friend');
  });
});

describe('updateRelation', () => {
  it('should throw an error when try to update relation which is not found', async () => {
    const fakeRepo = {
      findRelationBetween: vi.fn().mockResolvedValue(null),
    };
    const service = new friendshipService(fakeRepo as any);
    await expect(service.updateRelation(1, 2, {status: 'accepted'})).rejects.toThrow('Relation not found with exact user');
  });

  it('should return true when update succeed', async () => {
    const fakeRepo = {
      findRelationBetween: vi.fn().mockResolvedValue({userId: 2, friendId: 1} as FriendsRelationRow),
      update: vi.fn().mockResolvedValue(true),
    };
    const service = new friendshipService(fakeRepo as any);
    await expect(service.updateRelation(1, 2, {status: 'accepted'})).resolves.toBe(true);
    expect(fakeRepo.update).toHaveBeenCalled();
  });

  it('should throw an error when initiator trying to accept sent request', async () => {
    const fakeRepo = {
      findRelationBetween: vi.fn().mockResolvedValue({userId: 1, friendId: 2} as FriendsRelationRow),
      update: vi.fn(),
    };
    const service = new friendshipService(fakeRepo as any);
    await expect(service.updateRelation(1, 2, {status: 'accepted'})).rejects.toThrow('Cannot accept yourself');
    expect(fakeRepo.update).not.toHaveBeenCalled();
  });

  it('should return false when status is not allowed', async () => {
    const fakeRepo = {};
    const service = new friendshipService(fakeRepo as any);
    await expect(service.updateRelation(1, 2, {status: 'blocked'})).resolves.toBe(false);
  });
});

describe('acceptRelation', () => {
  it('should throw an error when try to accept relation which is not found', async () => {
    const fakeRepo = {
      findRelationBetween: vi.fn().mockResolvedValue(null),
    };
    const service = new friendshipService(fakeRepo as any);
    await expect(service.acceptRelation(1, 2)).rejects.toThrow('Relation not found with exact user');
  });

  it('should return true when relation accepted', async () => {
    const fakeRepo = {
      findRelationBetween: vi.fn().mockResolvedValue({userId: 2, friendId: 1} as FriendsRelationRow),
      update: vi.fn().mockResolvedValue(true),
    };
    const service = new friendshipService(fakeRepo as any);
    await expect(service.acceptRelation(1, 2)).resolves.toBe(true);
    expect(fakeRepo.update).toHaveBeenCalled();
  });

  it('should throw an error when initiator trying to accept sent request', async () => {
    const fakeRepo = {
      findRelationBetween: vi.fn().mockResolvedValue({userId: 1, friendId: 2} as FriendsRelationRow),
      update: vi.fn(),
    };
    const service = new friendshipService(fakeRepo as any);
    await expect(service.acceptRelation(1, 2)).rejects.toThrow('You cannot accept relation offer sent by you');
    expect(fakeRepo.update).not.toHaveBeenCalled();
  });
});

describe('removeRelation', () => {
  it('should throw an error when such relation not found', async () => {
    const fakeRepo = {
      findRelationBetween: vi.fn().mockResolvedValue(null),
      delete: vi.fn(),
    };
    const service = new friendshipService(fakeRepo as any);
    await expect(service.removeRelation(1, 2)).rejects.toThrow('Relation not found with exact user');
    expect(fakeRepo.delete).not.toHaveBeenCalled();
  });

  it('should return true when relation removed', async () => {
    const fakeRepo = {
      findRelationBetween: vi.fn().mockResolvedValue({userId: 1, friendId: 2}),
      delete: vi.fn().mockResolvedValue(true),
    };
    const service = new friendshipService(fakeRepo as any);
    await expect(service.removeRelation(1, 2)).resolves.toBe(true);
    expect(fakeRepo.delete).toHaveBeenCalled();
  });
});