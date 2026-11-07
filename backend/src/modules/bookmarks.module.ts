import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleService } from '@r3/backend';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from './entities/bookmark.entity';
import { CreateBookmarkHandler } from './handlers/create-bookmark.handler';
import { FindBookmarksHandler } from './handlers/find-bookmarks.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookmark]),
  ],
  controllers: [BookmarksController],
  providers: [
    BookmarksService,
    CreateBookmarkHandler,
    FindBookmarksHandler,
  ],
  exports: [BookmarksService],
})
// NOSONAR(typescript:S101): the module-name placeholder in this class name is a
// scaffold token; scaffold-module.cjs substitutes it with a real PascalCase
// module name (e.g. `WidgetsModule`) when this blueprint is copied into a
// generated module.
export class BookmarksModule implements OnModuleInit {
  constructor(private readonly moduleService: ModuleService) {}

  async onModuleInit() {
    await this.moduleService.declareFromModuleJson(__filename);
  }
}
