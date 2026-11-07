export { Bookmark } from '../modules/entities/bookmark.entity';

export { FindBookmarksQuery } from './queries/find-bookmarks.contract';
export { FindBookmarkByIdQuery } from './queries/find-bookmark-by-id.contract';

export { CreateBookmarkCommand } from './commands/create-bookmark.contract';
export { UpdateBookmarkCommand } from './commands/update-bookmark.contract';
export { DeleteBookmarkCommand } from './commands/delete-bookmark.contract';

export * from './events';
