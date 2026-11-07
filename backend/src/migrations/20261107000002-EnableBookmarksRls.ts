import { MigrationInterface, QueryRunner } from 'typeorm';
import { enableTenantRls, disableTenantRls, TenantRlsTableConfig } from '@r3/backend';

// `bookmarks.tenantId` has no `name` override on the entity (see
// modules/entities/bookmark.entity.ts), so the physical Postgres column is
// the same camelCase `tenantId`. The column is NOT NULL, so the default
// fail-closed `nullTreatment` applies.
const RLS_TABLES: TenantRlsTableConfig[] = [{ table: 'bookmarks', column: 'tenantId' }];

/**
 * Enables Postgres row level security on bookmarks' tenant column. The
 * platform's own `EnableTenantRowLevelSecurity` migration only covers tables
 * that existed when it ran, so any module adding a tenant-scoped table
 * afterwards enables RLS itself, in its own migration — see `@r3/backend`'s
 * `enableTenantRls` helper and `templates/modules/notes`'s
 * `EnableNotesRls` migration for the pattern this follows.
 */
export class EnableBookmarksRls20261107000002 implements MigrationInterface {
  name = 'EnableBookmarksRls20261107000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const config of RLS_TABLES) {
      await enableTenantRls(queryRunner, config);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const config of [...RLS_TABLES].reverse()) {
      await disableTenantRls(queryRunner, config);
    }
  }
}
