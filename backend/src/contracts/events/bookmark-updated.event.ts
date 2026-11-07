import { BaseEvent, DomainMetadata } from '@r3/backend';

// NOSONAR(typescript:S101): the entity-name placeholder in this class name is a
// scaffold token; scaffold-module.cjs substitutes it with a real PascalCase
// entity name (e.g. `WidgetUpdatedEvent`) when this blueprint is copied into a
// generated module.
export class BookmarkUpdatedEvent extends BaseEvent {
  static readonly key = 'bookmarks.event.updated';

  static readonly meta = {
    eventKey: 'bookmarks.event.updated',
    description: 'Emitted when a Bookmark is updated',
    category: 'bookmarks',
    subcategory: 'lifecycle',
    version: '1.0.0',
    tags: ['bookmark', 'update'],
  };

  constructor(
    private readonly domain: DomainMetadata,
    private readonly payload: BookmarkUpdatedEvent.Payload,
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
  get url() { return this.payload.url; }
  get tenantId() { return this.domain.tenantId; }
}

export namespace BookmarkUpdatedEvent {
  export interface Payload {
    name: string;
    url: string;
    updatedAt: Date;
  }
}
