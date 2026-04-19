# Claude Code hooks (исполнение вне репозитория)

Исполняемые скрипты лежат в **`%USERPROFILE%\.iwe\claude-hooks\`** (копия из `share/claude-hooks-dist/`).

После клона: `powershell -ExecutionPolicy Bypass -File scripts/install-claude-hooks.ps1`

Переопределить каталог: `CLAUDE_HOOKS_HOME` (см. `scripts/run-claude-hook.sh`).

Ранее в settings были ссылки на extensions-gate / protocol-artifact-validate / protocol-stop-gate — файлов в репо не было; восстановление — отдельно.
