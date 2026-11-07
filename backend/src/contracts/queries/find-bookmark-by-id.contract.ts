import { Bookmark } from '../../modules/entities/bookmark.entity';

export namespace FindBookmarkByIdQuery {
  export const key = 'bookmarks.query.findById';

  export interface Request {
    id: string;
    tenantId: string;
  }

  export type Response = Bookmark | null;
}
