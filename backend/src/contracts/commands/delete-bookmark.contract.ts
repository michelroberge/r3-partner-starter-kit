export namespace DeleteBookmarkCommand {
  export const key = 'bookmarks.command.delete';

  export interface Request {
    id: string;
    tenantId: string;
    deletedById: string;
  }
}
