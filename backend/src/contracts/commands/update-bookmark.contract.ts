import { Bookmark } from '../../modules/entities/bookmark.entity';

export namespace UpdateBookmarkCommand {
  export const key = 'bookmarks.command.update';

  export interface Request {
    id: string;
    name?: string;
    url?: string;
    tenantId: string;
    updatedById: string;
  }

  export type Response = Bookmark;
}
