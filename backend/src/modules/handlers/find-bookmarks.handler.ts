import { Injectable } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@r3/backend';
import { BookmarksService } from '../bookmarks.service';
import { FindBookmarksQuery } from '../../contracts';

@Injectable()
@CommandHandler(FindBookmarksQuery)
// NOSONAR(typescript:S101): the entity-name placeholder in this class name is a
// scaffold token; scaffold-module.cjs substitutes it with a real PascalCase
// plural entity name (e.g. `FindWidgetsHandler`) when this blueprint is copied
// into a generated module.
export class FindBookmarksHandler
  implements ICommandHandler<FindBookmarksQuery.Request, FindBookmarksQuery.Response>
{
  constructor(private readonly bookmarksService: BookmarksService) {}

  async handle(request: FindBookmarksQuery.Request): Promise<FindBookmarksQuery.Response> {
    return this.bookmarksService.findBookmarks(request.tenantId, request.search);
  }
}
