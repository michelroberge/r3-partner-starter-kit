import { BaseEvent, DomainMetadata } from '@r3/backend';

// NOSONAR(typescript:S101): the entity-name placeholder in this class name is a
// scaffold token; scaffold-module.cjs substitutes it with a real PascalCase
// entity name (e.g. `WidgetDeletedEvent`) when this blueprint is copied into a
// generated module.
export class BookmarkDeletedEvent extends BaseEvent {
  static readonly key = 'bookmarks.event.deleted';

  static readonly meta = {
    eventKey: 'bookmarks.event.deleted',
    description: 'Emitted when a Bookmark is deleted',
    category: 'bookmarks',
    subcategory: 'lifecycle',
    version: '1.0.0',
    tags: ['bookmark', 'delete'],
  };

  constructor(
    private readonly domain: DomainMetadata,
    private readonly payload: BookmarkDeletedEvent.Payload,
    occurredAt?: Date,
  ) {
    super(occurredAt);
  }

  getDomainMetadata(): DomainMetadata {
    return this.domain;
  }

  getPayload(): Record<string, any> {
    return this.payload;
  }

  get bookmarkId() { return this.domain.entityId; }
  get name() { return this.payload.name; }
  get tenantId() { return this.domain.tenantId; }
}

export namespace BookmarkDeletedEvent {
  export interface Payload {
    name: string;
    deletedById: string;
    deletedAt: Date;
  }
}
