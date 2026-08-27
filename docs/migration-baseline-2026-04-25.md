# Migration Baseline (2026-04-25)

- Integration branch: `migration/upstream-sync-2026-04-25`
- Rollback tag: `migration-baseline-2026-04-25`
- Divergence vs upstream: `82 415` (`git rev-list --left-right --count HEAD...upstream/main`)
- Rebase dry-run result: stops on commit `43fe925` with `add/add` conflicts

## Non-clean repo state before migration

- `Base/FPF` (gitlink has local content changes)
- `DS-exocortex` (gitlink has modified/untracked content)
- `DS-strategy` (gitlink has modified/untracked content)

## Dry-run artifacts

- Conflict list: `docs/migration-baseline-conflicts.txt`
- Full rebase output: `docs/migration-baseline-dryrun.txt`
