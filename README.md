# Bookmarks — R3 partner module starter kit

A shared library of saved links: tenant members save and browse bookmarks in
one place. It's deliberately small and boring — one entity, CRUD through its
own repository, its own permissions, no cross-module dependencies — but it's
a real, installable module, not a `hello-world`. Fork it, rename it, and
replace `Bookmark` with whatever your module is actually about.

This is the worked example for
[`docs/partner-module-submission.md`](https://github.com/michelroberge/r3-platform/blob/main/docs/partner-module-submission.md):
a module laid out exactly the way that doc describes, with CI that runs the
same checks a reviewer will run. See also
[`docs/partner-module-review-policy.md`](https://github.com/michelroberge/r3-platform/blob/main/docs/partner-module-review-policy.md)
for what a reviewer checks beyond CI.

**This repo is the canonical, forkable copy.** It's mirrored from
[`r3-platform`](https://github.com/michelroberge/r3-platform)'s own
`starter-kit/bookmarks/` directory (kept there so platform docs and this
worked example change together in one PR) — see that repo's
`.github/workflows/mirror-starter-kit.yml` for how. You don't need access to
`r3-platform` to use this repo; everything it needs is in this tree and the
published `@r3/*`/`@r3m/*` packages on the registry.

## Fork this and make it yours

1. **Rename the module id.** `bookmarks` appears in: `module.json`'s `id`,
   `package.json`'s `name` (`@r3m/bookmarks`), every file name and class name
   under `backend/src` and `frontend/src`, and the translation keys in
   `frontend/src/i18n/locales/*.json`. There's no automated renamer for an
   already-scaffolded module — this is the one genuinely manual step.
2. **Set `name` and `description`** in `module.json` to your module's real
   display name and what it does.
3. **Set `publisher`** in `module.json` — `name` is required; `url`/`contact`
   are optional but expected for a `verified-partner` submission.
4. **Replace the `Bookmark` entity** with your own: edit
   `backend/src/modules/entities/bookmark.entity.ts`, the DTOs, the CQRS
   contracts under `backend/src/contracts/`, and the migration under
   `backend/src/migrations/` (the migration is hand-written here, following
   `enableTenantRls`'s pattern for a new tenant-scoped table — TypeORM's
   `migration:generate` needs a real app checkout to diff against, which this
   standalone repo doesn't have).
5. **Keep `category`, `permissions`, `featureFlags`, `entities`, and
   `agentHints`** in `module.json` in sync with whatever you change — `r3
   verify` (see below) checks every one of them against your actual source.

## What CI runs vs. what a reviewer adds

This repo's own [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs,
against the **published** `@r3/*`/`@r3m/*` packages only (this repo's
`.npmrc` points those scopes at the registry; no step here reads or restores
any other repo's source or `node_modules`):

| When | Command | What it catches |
| --- | --- | --- |
| Every push | `npx tsc --noEmit` | Type errors |
| Every push | `npx vitest run` | This module's own unit tests |
| Every push | `npx r3 verify .` | Manifest schema, identity fields, SDK surface contract (denied imports, undeclared cross-module imports/entities/permissions) — the fast checks |
| Pull requests | `npx r3 verify . --build` | A sandboxed rebuild of `backend/src` from only what the manifest declares, plus your `r3Compat` range checked against what the registry actually serves right now |
| Pull requests | `npx r3 pack .` | Builds the `@r3m/bookmarks` tarball a reviewer would receive |
| Pull requests | `npx r3 verify dist/r3m/*.tgz --build` | The same checks, run against the packed tarball itself — exactly what the reviewer sees |

**A green CI run is not a review.** The partner review policy is explicit
that fast-checks-only CI must not be mistaken for a full review — a human
reviewer runs `r3 verify --build --baseline <previous-release>` and reads the
`sdk-surface-exceptions.json` justification for any declared exception (this
module ships none), decides whether your `trustLevel` request holds, and
checks things no script can: whether the module is actually useful, whether
its permissions are scoped sensibly, and whether a `manifest-diff` escalation
(a new permission, a wider `r3Compat`, …) is deliberate. See
[`docs/partner-module-review-policy.md`](https://github.com/michelroberge/r3-platform/blob/main/docs/partner-module-review-policy.md).

## Try it locally

```bash
npm install
npx tsc --noEmit
npx vitest run
npx r3 verify .
npx r3 verify . --build          # slow; rebuilds backend/src in a sandbox
npx r3 pack .
npx r3 verify dist/r3m/*.tgz --build
```

## What's in here

- `module.json` — the manifest: identity (`publisher`, `trustLevel:
  community`, `r3Compat`), permissions, feature flag, `agentHints`.
- `backend/src/` — a NestJS module: entity, controller, service, CQRS
  contracts (commands/queries/events) and handlers, a migration pair
  (create table + enable row-level security), and a starter MCP skill
  (`bookmarks.skills.seed.ts`) so an AI client can list bookmarks.
- `frontend/src/` — a `CrudPage`-based admin page and its i18n strings.
- `backend/src/modules/__tests__/bookmarks.service.test.ts` — unit coverage
  for the service's own write-path logic (create/update, and that an id from
  another tenant is rejected), with `@r3/backend` faked at the handful of
  symbols actually touched — this repo has no access to the platform's
  source, only its published surface.

## Submit it for real

Once it's yours: follow
[`docs/partner-module-submission.md`](https://github.com/michelroberge/r3-platform/blob/main/docs/partner-module-submission.md)
from step 3 onward (self-check → pack → submit). Steps 1–2 (scaffold, develop
against the SDK surface contract) are already done for you by this fork.

