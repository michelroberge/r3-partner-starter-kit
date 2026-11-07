import { Bookmark } from '../../modules/entities/bookmark.entity';

export namespace FindBookmarksQuery {
  export const key = 'bookmarks.query.find';

  export interface Request {
    tenantId: string;
    search?: string;
  }

  export type Response = Bookmark[];
}
