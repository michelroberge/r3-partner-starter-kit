import { Injectable } from '@nestjs/common';
import { ICommandHandler, CommandHandler } from '@r3/backend';
import { BookmarksService } from '../bookmarks.service';
import { CreateBookmarkCommand } from '../../contracts';

@Injectable()
@CommandHandler(CreateBookmarkCommand)
// NOSONAR(typescript:S101): the entity-name placeholder in this class name is a
// scaffold token; scaffold-module.cjs substitutes it with a real PascalCase
// entity name (e.g. `CreateWidgetHandler`) when this blueprint is copied into a
// generated module.
export class CreateBookmarkHandler
  implements ICommandHandler<CreateBookmarkCommand.Request, CreateBookmarkCommand.Response>
{
  constructor(private readonly bookmarksService: BookmarksService) {}

  async handle(request: CreateBookmarkCommand.Request): Promise<CreateBookmarkCommand.Response> {
    return this.bookmarksService.createEntity(request);
  }
}
