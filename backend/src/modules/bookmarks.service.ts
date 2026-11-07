import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AppLogger, QueryBusService, DomainMetadata, TenantScopedCrudService } from '@r3/backend';
import {
  Bookmark,
  CreateBookmarkCommand,
  UpdateBookmarkCommand,
  BookmarkCreatedEvent,
  BookmarkUpdatedEvent,
  BookmarkDeletedEvent,
} from '../contracts';

@Injectable()
// NOSONAR(typescript:S101): the module-name placeholder in this class name is a
// scaffold token; scaffold-module.cjs substitutes it with a real PascalCase
// module name (e.g. `WidgetsService`) when this blueprint is copied into a
// generated module.
export class BookmarksService extends TenantScopedCrudService<Bookmark> {
  private readonly logger = new AppLogger(BookmarksService.name);
  protected readonly entityLabel = 'Bookmark';

  constructor(
    @InjectRepository(Bookmark)
    repository: Repository<Bookmark>,
    queryBus: QueryBusService,
  ) {
    super(repository, queryBus);
  }

  async findBookmarks(tenantId: string, search?: string): Promise<Bookmark[]> {
    if (!search?.trim()) {
      // No search term: reuse the base's tenant-scoped, paginated list.
      return this.list(tenantId);
    }

    return this.repository
      .createQueryBuilder('bookmark')
      .where('bookmark.tenantId = :tenantId', { tenantId })
      .andWhere('bookmark.name ILIKE :search', { search: `%${search.trim()}%` })
      .orderBy('bookmark.updatedAt', 'DESC')
      .getMany();
  }

  async findById(id: string, tenantId: string): Promise<Bookmark> {
    return this.findOne(id, tenantId);
  }

  // Named distinctly from the inherited `create` (which takes a plain DeepPartial)
  // since this variant also queues the module's own domain event.
  async createEntity(request: CreateBookmarkCommand.Request): Promise<Bookmark> {
    const id = uuidv4();
    const now = new Date();

    return this.queryBus.withTransaction(async (tx) => {
      const entity = tx.manager.create(Bookmark, {
        id,
        name: request.name,
        url: request.url,
        createdById: request.createdById,
        tenantId: request.tenantId,
      });

      const saved = await tx.manager.save(Bookmark, entity);

      const domain: DomainMetadata = {
        entity: 'bookmark',
        entityId: id,
        operation: 'created',
        tenantId: request.tenantId,
        userId: request.createdById,
      };
      const payload: BookmarkCreatedEvent.Payload = {
        name: request.name,
        url: request.url,
        createdById: request.createdById,
        createdAt: now,
      };

      await tx.queueEvent(BookmarkCreatedEvent.key, new BookmarkCreatedEvent(domain, payload));
      return saved;
    });
  }

  // Named distinctly from the inherited `update` (which takes a plain patch) since
  // this variant also queues the module's own domain event, not just a history entry.
  async updateEntity(request: UpdateBookmarkCommand.Request): Promise<Bookmark> {
    // Tenant-scoped 404 lookup delegated to the base (findTenantScopedOrThrow).
    const existing = await this.findOne(request.id, request.tenantId);

    const now = new Date();

    return this.queryBus.withTransaction(async (tx) => {
      if (request.name !== undefined) {
        existing.name = request.name;
      }
      if (request.url !== undefined) {
        existing.url = request.url;
      }

      const saved = await tx.manager.save(Bookmark, existing);

      const domain: DomainMetadata = {
        entity: 'bookmark',
        entityId: request.id,
        operation: 'updated',
        tenantId: request.tenantId,
        userId: request.updatedById,
      };
      const payload: BookmarkUpdatedEvent.Payload = {
        name: saved.name,
        url: saved.url,
        updatedAt: now,
      };

      await tx.queueEvent(BookmarkUpdatedEvent.key, new BookmarkUpdatedEvent(domain, payload));
      return saved;
    });
  }

  async delete(id: string, tenantId: string, deletedById: string): Promise<void> {
    const existing = await this.findOne(id, tenantId);

    await this.queryBus.withTransaction(async (tx) => {
      const domain: DomainMetadata = {
        entity: 'bookmark',
        entityId: id,
        operation: 'deleted',
        tenantId,
        userId: deletedById,
      };
      const payload: BookmarkDeletedEvent.Payload = {
        name: existing.name,
        deletedById,
        deletedAt: new Date(),
      };

      await tx.queueEvent(BookmarkDeletedEvent.key, new BookmarkDeletedEvent(domain, payload));
      await tx.manager.remove(Bookmark, existing);
    });
  }
}
