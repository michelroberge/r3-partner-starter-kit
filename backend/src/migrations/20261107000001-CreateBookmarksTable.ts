import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * Creates the `bookmarks` table (see `../modules/entities/bookmark.entity.ts`)
 * ahead of this module's own `EnableBookmarksRls` migration below.
 * `queryRunner.createTable(new Table(...), true)` — the trailing `true` is
 * `createIfNotExists`, a safe no-op if a dev database already has the table
 * from `synchronize: true`. Columns mirror the entity's `@Column` decorators
 * exactly, including nullability.
 */
export class CreateBookmarksTable20261107000001 implements MigrationInterface {
  name = 'CreateBookmarksTable20261107000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bookmarks',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'name', type: 'text', isNullable: false },
          { name: 'url', type: 'text', isNullable: false },
          { name: 'createdById', type: 'uuid', isNullable: false },
          { name: 'tenantId', type: 'uuid', isNullable: false },
          { name: 'createdAt', type: 'timestamptz', isNullable: false, default: 'now()' },
          { name: 'updatedAt', type: 'timestamptz', isNullable: false, default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_bookmarks_tenantId" ON "bookmarks" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_bookmarks_createdById" ON "bookmarks" ("createdById")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('bookmarks', true);
  }
}
