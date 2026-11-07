import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';

/**
 * `@r3/backend` is consumed here only as a published dependency (this module
 * has no access to the platform's own source tree — see the repo README),
 * so this test fakes the handful of exported symbols `BookmarksService`
 * actually touches, instead of reaching into platform internals. The fake
 * `TenantScopedCrudService.findOne` mirrors the real base class's contract
 * (throws when the row isn't found for this id+tenant) closely enough to
 * exercise `updateEntity`/`delete`'s own logic, which is what this suite
 * covers.
 */
vi.mock('@r3/backend', () => {
  class AppLogger {
    constructor(_name: string) {}
    log() {}
    warn() {}
    error() {}
    debug() {}
  }

  class TenantScopedCrudService<T extends { id: string; tenantId: string }> {
    constructor(
      protected readonly repository: { findOne: (opts: unknown) => Promise<T | null> },
      protected readonly queryBus: unknown,
    ) {}

    async findOne(id: string, tenantId: string): Promise<T> {
      const row = await this.repository.findOne({ where: { id, tenantId } });
      if (!row) throw new Error('Not found');
      return row;
    }
  }

  class User {}

  class BaseEvent {
    constructor(protected readonly occurredAt?: Date) {}
  }

  // Never constructed in this suite — `@Injectable()`'s emitted design:paramtypes
  // metadata references the constructor parameter's *type* as a runtime value,
  // so it has to resolve to something, even though the test supplies its own
  // fake queryBus object directly.
  class QueryBusService {}

  return { AppLogger, TenantScopedCrudService, User, BaseEvent, QueryBusService };
});

import { BookmarksService } from '../bookmarks.service';
import { Bookmark } from '../entities/bookmark.entity';

function makeQueryBus() {
  const queuedEvents: Array<{ key: string; event: unknown }> = [];
  const manager = {
    create: (_entity: unknown, data: Partial<Bookmark>) => ({ ...data }) as Bookmark,
    save: async (_entity: unknown, data: Bookmark) => data,
    remove: async () => undefined,
  };
  const queryBus = {
    queuedEvents,
    withTransaction: async (cb: (tx: { manager: typeof manager; queueEvent: (key: string, event: unknown) => Promise<void> }) => unknown) =>
      cb({
        manager,
        queueEvent: async (key: string, event: unknown) => {
          queuedEvents.push({ key, event });
        },
      }),
  };
  return queryBus;
}

describe('BookmarksService', () => {
  it('createEntity persists the name and url, and queues a created event with both', async () => {
    const queryBus = makeQueryBus();
    const repository = { findOne: vi.fn() };
    const service = new BookmarksService(repository as never, queryBus as never);

    const saved = await service.createEntity({
      name: 'R3 Platform docs',
      url: 'https://example.com/docs',
      createdById: 'user-1',
      tenantId: 'tenant-1',
    });

    expect(saved.name).toBe('R3 Platform docs');
    expect(saved.url).toBe('https://example.com/docs');
    expect(saved.tenantId).toBe('tenant-1');
    expect(queryBus.queuedEvents).toHaveLength(1);
    expect(queryBus.queuedEvents[0].key).toBe('bookmarks.event.created');
  });

  it('updateEntity changes only the field provided, leaving the other untouched', async () => {
    const existing: Bookmark = {
      id: 'bm-1',
      name: 'Old name',
      url: 'https://old.example.com',
      createdById: 'user-1',
      tenantId: 'tenant-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Bookmark;
    const queryBus = makeQueryBus();
    const repository = { findOne: vi.fn().mockResolvedValue(existing) };
    const service = new BookmarksService(repository as never, queryBus as never);

    const saved = await service.updateEntity({
      id: 'bm-1',
      url: 'https://new.example.com',
      tenantId: 'tenant-1',
      updatedById: 'user-1',
    });

    expect(saved.name).toBe('Old name');
    expect(saved.url).toBe('https://new.example.com');
  });

  it('updateEntity rejects an id from another tenant (no cross-tenant read)', async () => {
    const queryBus = makeQueryBus();
    const repository = { findOne: vi.fn().mockResolvedValue(null) };
    const service = new BookmarksService(repository as never, queryBus as never);

    await expect(
      service.updateEntity({ id: 'bm-1', tenantId: 'other-tenant', updatedById: 'user-1' }),
    ).rejects.toThrow();
  });
});
