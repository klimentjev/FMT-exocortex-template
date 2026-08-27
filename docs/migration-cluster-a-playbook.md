# Cluster A Conflict Playbook

Scope: `.claude/hooks/*`, `.claude/skills/*`, `.claude/rules/*`, `CLAUDE.md`.

## Resolution policy

1. Keep platform files from `upstream/main` as baseline.
2. Never overwrite user-space files:
   - `.claude/settings.local.json`
   - `extensions/*`
   - `.secrets/*`
3. For `CLAUDE.md`:
   - accept upstream platform section updates,
   - preserve author/user sections where they exist,
   - verify no merge markers remain.

## Verification checklist

- `git status --short` only contains intended Cluster A files.
- `rg '<<<<<<<|=======|>>>>>>>'` returns no conflicts in `.claude/*` and `CLAUDE.md`.
- Hooks and skill files are present and executable where required.
