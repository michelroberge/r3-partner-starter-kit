import { Bookmark } from '../../modules/entities/bookmark.entity';

export namespace CreateBookmarkCommand {
  export const key = 'bookmarks.command.create';

  export interface Request {
    name: string;
    url: string;
    createdById: string;
    tenantId: string;
  }

  export type Response = Bookmark;
}
