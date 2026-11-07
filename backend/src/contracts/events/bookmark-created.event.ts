import { BaseEvent, DomainMetadata } from '@r3/backend';

// NOSONAR(typescript:S101): the entity-name placeholder in this class name is a
// scaffold token; scaffold-module.cjs substitutes it with a real PascalCase
// entity name (e.g. `WidgetCreatedEvent`) when this blueprint is copied into a
// generated module.
export class BookmarkCreatedEvent extends BaseEvent {
  static readonly key = 'bookmarks.event.created';

  static readonly meta = {
    eventKey: 'bookmarks.event.created',
    description: 'Emitted when a Bookmark is created',
    category: 'bookmarks',
    subcategory: 'lifecycle',
    version: '1.0.0',
    tags: ['bookmark', 'create'],
  };

  constructor(
    private readonly domain: DomainMetadata,
    private readonly payload: BookmarkCreatedEvent.Payload,
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

export namespace BookmarkCreatedEvent {
  export interface Payload {
    name: string;
    url: string;
    createdById: string;
    createdAt: Date;
  }
}
