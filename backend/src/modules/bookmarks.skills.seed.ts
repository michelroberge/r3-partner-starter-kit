/**
 * MCP skills for the Bookmarks module.
 *
 * An MCP skill exposes this module's data to AI clients (e.g. Claude) over the
 * platform MCP JSON-RPC endpoint: `POST /api/mcp-server/mcp/:tenantId`.
 *
 * A skill is NOT code — it is a tenant-scoped row that binds:
 *   - one or more QueryBus `queryKey`s (run at call time, `tenantId` auto-injected),
 *   - a `context` template whose `{{assignTo.path}}` placeholders are filled from
 *     the query results (and any caller `parameters`), and
 *   - a `responseSchema` (a compact result shape) that the resolver converts to the
 *     MCP tool `outputSchema` / `structuredContent`.
 *
 * The skill below reuses this module's existing read query
 * (`FindBookmarksQuery`) — no new backend code required. Add more
 * skills for the questions an assistant should be able to answer about this module.
 *
 * Pattern reference: `libs/backend-common/src/modules/mcp-server/modules/
 * mcp-platform-skills.seed.ts` (the platform's own seeded skills).
 */
import type { McpSkillSeed } from '@r3/backend';
import { FindBookmarksQuery } from '../contracts';

export const bookmarksSkillSeeds: McpSkillSeed[] = [
  {
    // Tool name surfaced to the MCP client — keep it snake_case and verb-led.
    name: 'list_bookmarks',
    description:
      'List the bookmarks in this tenant. Use it to answer questions about ' +
      'what bookmarks exist.',
    context:
      'These are the bookmarks for this tenant.\n\n{{bookmarks}}',
    parameters: [],
    queries: [
      {
        queryKey: FindBookmarksQuery.key,
        assignTo: 'bookmarks',
        args: {}, // tenantId is injected automatically; add e.g. { search: '{{search}}' } if you declare a param
      },
    ],
    // Documents the result so the MCP client gets a typed `outputSchema`. Keyed by `assignTo`.
    responseSchema: {
      bookmarks: {
        description: 'The bookmarks visible in this tenant.',
        list: true,
        columns: [
          { name: 'id', type: 'uuid', description: 'Bookmark identifier.' },
          { name: 'name', type: 'string', description: 'Bookmark name.' },
          { name: 'url', type: 'string', description: 'Bookmark URL.' },
          { name: 'createdById', type: 'uuid', description: 'User who created it.' },
          { name: 'createdAt', type: 'datetime', description: 'Creation timestamp.' },
          { name: 'updatedAt', type: 'datetime', description: 'Last update timestamp.' },
        ],
      },
    },
    enabled: true,
  },
];

/*
 * ── How to seed these skills ──────────────────────────────────────────────
 * Skills are per-tenant rows, so seed them once per tenant. Extend
 * `McpSkillSeederBase` (from `@r3/backend`) — it handles registering the
 * `tenant.event.created` handler, resolving the system user (memoised), and
 * the idempotent create-if-missing loop. Your service only supplies data:
 *
 *   import { Injectable } from '@nestjs/common';
 *   import { McpSkillSeederBase, McpSkillSeed, QueryBusService, McpSkillService } from '@r3/backend';
 *   import { bookmarksSkillSeeds } from './bookmarks.skills.seed';
 *
 *   @Injectable()
 *   export class BookmarksMcpSkillSeeder extends McpSkillSeederBase {
 *     constructor(queryBus: QueryBusService, skills: McpSkillService) {
 *       super(queryBus, skills);
 *     }
 *
 *     protected seeds(): McpSkillSeed[] {
 *       return bookmarksSkillSeeds;
 *     }
 *   }
 *
 * Register the seeder as a provider in your module. Seeding stays defensive
 * (log + swallow) so it can never break tenant creation. Admins can also
 * create/edit skills from the MCP Server settings card at runtime.
 * Pattern reference: `McpPlatformSkillSeeder` and `NotesMcpSkillSeeder`.
 */
