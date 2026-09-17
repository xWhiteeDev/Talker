import { describe, expect, it, vi } from 'vitest';
import { friendshipService } from '../../dependencies/Friendship/friendshipService.js';
import type { FriendsRelation } from '../../dependencies/Friendship/types.js';

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
  it('should pass arguments recevived correctly by function', async () => {
    const fakeRepo = {
      findRelationBetween: vi.fn().mockResolvedValue(null),
    };
    const service = new friendshipService(fakeRepo as any);
    await service.findRelationBetween(1, 2, 'pending');
    expect(fakeRepo.findRelationBetween).toHaveBeenCalledWith(1, 2, 'pending');
  });
});
