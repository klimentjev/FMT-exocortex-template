# Резюме: хуки Claude Code и вкладки в Cursor (Windows)

Краткая инструкция по симптому, причинам и стабильным обходным путям в IWE.

## Симптом

При работе Claude Code/Cursor на **Windows** в редакторе открываются **вкладки с файлами** из `.claude/hooks/*.sh` или похожим путям.

## Причины (обычно вместе)

1. **`command` в конфигурации хуков** указывает на **` .claude/hooks/имя.sh`** внутри воркспейса. Среде удобно «привязать» эти файлы к проекту как открытые ресурсы.
2. **`permissions.additionalDirectories`** в `.claude/settings.json` содержит **`.claude/hooks`** — это усиливает эффект.
3. **`bash update.sh` [0]** подтягивает с GitHub **новый `update.sh`**, локальный хвост (вызовы нормализации) **пропадает**.
4. **Манифест обновлений** снова кладёт в репо **`.claude/settings.json`** с путями **`.claude/hooks/...`**.

Идея исправления: **исполнять тела скриптов не из дерева `.claude/hooks/` в репозитории**, а из пользовательского каталога **`%USERPROFILE%\.iwe\claude-hooks`** (установка через `scripts/install-claude-hooks.ps1`, эталон в `share/claude-hooks-dist/`), а в настройках указывать **`bash scripts/run-claude-hook.sh имя.sh`**.

## Архитектура, которая заложена в IWE

| Компонент | Назначение |
|-----------|------------|
| `scripts/run-claude-hook.sh` | Обёртка: `exec` скрипта из `CLAUDE_HOOKS_HOME` или `~/.iwe/claude-hooks`. |
| `scripts/install-claude-hooks.ps1` | Копирует `share/claude-hooks-dist/*.sh` в `%USERPROFILE%\.iwe\claude-hooks`. |
| `scripts/normalize-claude-settings-cursor.js` | Переписывает команды с `.claude/hooks/foo.sh` на `bash scripts/run-claude-hook.sh foo.sh`, чистит `additionalDirectories`, **дублирует `hooks` в `.claude/settings.local.json`**. |
| `scripts/run-post-update-cursor-normalize.sh` | Прогоняет Node-скрипт по спискам путей: репо, родитель воркспейса, `WORKSPACE_DIR` из `.exocortex.env`, `HOME`/`USERPROFILE/.claude/settings.json`. |
| `scripts/exocortex-update.sh` | Запускает `update.sh`, затем **всегда** вызывает `run-post-update-cursor-normalize.sh`. |
| `.claude/settings.local.json` | **Overlay**: блок `hooks` с правильными командами; ваши `permissions` / `mcpServers` в том же файле **сохраняются** скриптом (merge `{ ...local, hooks: patched }`). |
| `.iwe-skip-update-sh-bootstrap` | Маркер в корне репо: **отключить шаг [0]**, который затирает локальный патченый `update.sh` с upstream. |

## Что делать по ситуации

### Сразу починить настройки (после любого апдейта)

Из корня экзокортекс-репо (Git Bash или WSL, нужен **Node.js**):

```bash
bash scripts/run-post-update-cursor-normalize.sh
powershell -ExecutionPolicy Bypass -File scripts/install-claude-hooks.ps1
```

При необходимости укажите пути к `settings.json` вручную одной строкой через `node`:

```bash
node scripts/normalize-claude-settings-cursor.js "$(pwd)/.claude/settings.json"
```

На Windows второй файл часто нужен для глобального Claude Code: `$USERPROFILE/.claude/settings.json`.

Затем **перезапустите Claude Code/Cursor**.

### Обновление платформы без потери починки

Предпочтительно **не** `bash update.sh` в одиночестве на долгую перспективу, если у вас снова затирается хвост; используйте:

```bash
bash scripts/exocortex-update.sh
```

Или держите в репозитории **`.iwe-skip-update-sh-bootstrap`**, чтобы **шаг [0] не заменял** ваш `update.sh`.

### После `git pull` / merge

При `git config core.hooksPath .githooks` должны вызываться **`.githooks/post-merge`** и **`.githooks/post-checkout`** и снова гонять нормализацию. Если вкладки вернулись — выполните вручную блок «Сразу починить».

### Агент в Cursor не должен триггерить вкладки

В правилах: не дергать **Read / Grep / Glob / Semantic Search** по путям `.claude/hooks/`, `share/claude-hooks-dist/`, `%USERPROFILE%\.iwe\claude-hooks` без явного запроса пользователя. Правка хуков только через **`share/claude-hooks-dist/`** (+ при необходимости снова `install-claude-hooks.ps1`).

## Критерий готовности

- В активных конфигах хуков (**`settings.json`** и желательно **`settings.local.json`**) для команд указано **`bash scripts/run-claude-hook.sh …`**, а не **`.claude/hooks/*.sh`**.
- В **`permissions.additionalDirectories`** нет **`.claude/hooks`**.
- В **`~/.iwe/claude-hooks`** лежат актуальные копии скриптов (после добавления нового `*.sh` на платформе — снова `install-claude-hooks.ps1`).

---

*Этот документ — резюме рабочей линии в чатах по IWE/Cursor/hooks; детали платформы смотрите в CHANGELOG и в `.cursor/rules/iwe-claude-hooks-legacy.mdc`.*
