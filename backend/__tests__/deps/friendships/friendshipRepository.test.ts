import {describe, expect, it, vi} from 'vitest';
import {friendshipRepository} from '../../../dependencies/Friendship/friendshipRepository.js';

describe('findById', () => {
  it('should pass id to WHERE clause', async () => {
    const fakePool = {
      query: vi.fn().mockResolvedValue([[]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await repo.findById(3);
    expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id=:id'), {id: 3});
  });

  it('should return undefined when relation not found', async () => {
    const fakePool = {
      query: vi.fn().mockResolvedValue([[]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.findById(3)).resolves.toBeUndefined();
  });

  it('should return relation when found', async () => {
    const row = {id: 3, userId: 1, friendId: 2, status: 'accepted'};
    const fakePool = {
      query: vi.fn().mockResolvedValue([[row]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.findById(3)).resolves.toBe(row);
  });
});

describe('findByUserId', () => {
  it('should search relation on both sides', async () => {
    const fakePool = {
      query: vi.fn().mockResolvedValue([[]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await repo.findByUserId(1);
    expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE userId=:userId OR friendId=:userId'), {userId: 1});
  });

  it('should return all found relations', async () => {
    const rows = [{id: 1}, {id: 2}];
    const fakePool = {
      query: vi.fn().mockResolvedValue([rows]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.findByUserId(1)).resolves.toBe(rows);
  });
});

describe('findRelationBetween', () => {
  it('should include status in query when status is provided', async () => {
    const fakePool = {
      query: vi.fn().mockResolvedValue([[]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await repo.findRelationBetween(1, 2, 'accepted');
    expect(fakePool.query).toHaveBeenCalledWith(
      expect.stringContaining('(userId=:userId AND friendId=:otherId AND status=:status)'),
      {userId: 1, otherId: 2, status: 'accepted'},
    );
  });

  it('should not include status in query when status is not provided', async () => {
    const fakePool = {
      query: vi.fn().mockResolvedValue([[]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await repo.findRelationBetween(1, 2);
    const [query, params] = fakePool.query.mock.calls[0]!;
    expect(query).toContain('(userId=:userId AND friendId=:otherId) OR (userId=:otherId AND friendId=:userId)');
    expect(query).not.toContain('status=:status');
    expect(params).toEqual({userId: 1, otherId: 2, status: undefined});
  });

  it('should return undefined when relation not found', async () => {
    const fakePool = {
      query: vi.fn().mockResolvedValue([[]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.findRelationBetween(1, 2)).resolves.toBeUndefined();
  });

  it('should return relation when found', async () => {
    const row = {id: 3, userId: 1, friendId: 2, status: 'pending'};
    const fakePool = {
      query: vi.fn().mockResolvedValue([[row]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.findRelationBetween(1, 2)).resolves.toBe(row);
  });
});

describe('findAllAcceptedRelations', () => {
  it('should query only accepted relations of user', async () => {
    const fakePool = {
      query: vi.fn().mockResolvedValue([[]]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await repo.findAllAcceptedRelations(1);
    expect(fakePool.query).toHaveBeenCalledWith(expect.stringContaining("STATUS='accepted'"), {userId: 1});
  });

  it('should return found relations', async () => {
    const rows = [{otherUserId: 2, fullName: 'Max Harris', id: 1}];
    const fakePool = {
      query: vi.fn().mockResolvedValue([rows]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.findAllAcceptedRelations(1)).resolves.toBe(rows);
  });
});

describe('insert', () => {
  const dto = {userId: 1, friendId: 2, status: 'pending' as const};

  it('should pass dto values to query', async () => {
    const fakePool = {
      execute: vi.fn().mockResolvedValue([{affectedRows: 1}]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await repo.insert(dto);
    expect(fakePool.execute).toHaveBeenCalledWith(
      expect.stringContaining('(userId,friendId,status) VALUES (:userId,:friendId,:status)'),
      dto,
    );
  });

  it('should return true when row inserted', async () => {
    const fakePool = {
      execute: vi.fn().mockResolvedValue([{affectedRows: 1}]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.insert(dto)).resolves.toBe(true);
  });

  it('should return false when row not inserted', async () => {
    const fakePool = {
      execute: vi.fn().mockResolvedValue([{affectedRows: 0}]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.insert(dto)).resolves.toBe(false);
  });
});

describe('update', () => {
  it('should update status of relation on both sides', async () => {
    const fakePool = {
      execute: vi.fn().mockResolvedValue([{affectedRows: 1}]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await repo.update(1, 2, {status: 'accepted'});
    expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('SET status=:status'), {
      userId: 1,
      otherId: 2,
      status: 'accepted',
    });
  });

  it('should return true when row updated', async () => {
    const fakePool = {
      execute: vi.fn().mockResolvedValue([{affectedRows: 1}]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.update(1, 2, {status: 'accepted'})).resolves.toBe(true);
  });

  it('should return false when row not updated', async () => {
    const fakePool = {
      execute: vi.fn().mockResolvedValue([{affectedRows: 0}]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.update(1, 2, {status: 'accepted'})).resolves.toBe(false);
  });
});

describe('delete', () => {
  it('should delete relation on both sides', async () => {
    const fakePool = {
      execute: vi.fn().mockResolvedValue([{affectedRows: 1}]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await repo.delete(1, 2);
    expect(fakePool.execute).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM friendships'), {userId: 1, otherId: 2});
  });

  it('should return true when row deleted', async () => {
    const fakePool = {
      execute: vi.fn().mockResolvedValue([{affectedRows: 1}]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.delete(1, 2)).resolves.toBe(true);
  });

  it('should return false when row not deleted', async () => {
    const fakePool = {
      execute: vi.fn().mockResolvedValue([{affectedRows: 0}]),
    };
    const repo = new friendshipRepository(fakePool as any);
    await expect(repo.delete(1, 2)).resolves.toBe(false);
  });
});
