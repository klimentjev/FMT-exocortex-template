# IWE на Cursor + Windows

> Дополняет [PORTABILITY](https://github.com/TserenTserenov/FMT-exocortex-template/blob/main/docs/PORTABILITY.md) и [PLATFORM-COMPAT](PLATFORM-COMPAT.md). Слой L3 (`extensions/`, правила Cursor) переносится как есть; ниже — рантайм shell, логи, карта скиллов и планировщик вместо **launchd** (только macOS).

---

## 1. Рантайм shell

Все bash-скрипты IWE (`roles/*/scripts/*.sh`, `scripts/*.sh`, `setup.sh`) ожидают **bash**, а не PowerShell.

| Вариант | Когда выбирать |
|---------|----------------|
| **Git for Windows** (`Git\bin\bash.exe`) | Минимальная установка; пути `C:\…` в bash выглядят как `/c/…`. |
| **WSL2** (Ubuntu и т.д.) | Если репозиторий и `IWE_WORKSPACE` живут внутри Linux FS (`~/IWE`); планировщик — `cron` внутри WSL (отдельно от раздела 4). |

Рекомендация для нативного `C:\Users\…\IWE`: **Git Bash** как единая точка входа для ролей и `update.sh`.

Задайте в профиле Git Bash (например `~/.bashrc`) или в `setup/windows/iwe-task-env.sh` (см. пример в каталоге `setup/windows/`):

- `IWE_WORKSPACE` — корень воркспейса (в Git Bash: `/c/Users/…/IWE`).
- `IWE_RUNTIME` — `.iwe-runtime` (после `build-runtime` / `migrate-to-runtime-target`).
- `IWE_TEMPLATE` — каталог шаблона FMT (если используется).

---

## 2. Корень логов (`IWE_LOG_ROOT`)

По умолчанию роли пишут в `$HOME/logs/…`. На Windows у Git Bash `$HOME` часто совпадает с `%USERPROFILE%`, но путь может разъезжаться с `{{HOME_DIR}}` из `.exocortex.env`.

Переменная **`IWE_LOG_ROOT`** (опционально) задаёт **общий** каталог логов без суффикса роли:

- Strategist: `$IWE_LOG_ROOT/strategist/`
- Extractor: `$IWE_LOG_ROOT/extractor/`
- Synchronizer (legacy `scheduler.sh`): `$IWE_LOG_ROOT/synchronizer/`

Если не задана, поведение как раньше: strategist — `$HOME/logs/strategist`, extractor — `{{HOME_DIR}}/logs/extractor` в подставленном скрипте.

**Практика для Cursor / Day Open:** положите логи рядом с репо, чтобы путь был предсказуем:

```bash
export IWE_LOG_ROOT="/c/Users/<you>/IWE/logs"
mkdir -p "$IWE_LOG_ROOT/strategist" "$IWE_LOG_ROOT/extractor"
```

Агенту в Day Open читать отчёт: `$IWE_LOG_ROOT/strategist/YYYY-MM-DD.log` (если задан `IWE_LOG_ROOT`), иначе `~/logs/strategist/YYYY-MM-DD.log`.

---

## 3. Карта скиллов (Cursor вместо слэш-команды Claude Code)

В Cursor нет встроенных `/day-open` и т.д. Режим работы: **прочитать соответствующий `SKILL.md` и выполнить по шагам** (см. `.cursor/rules/iwe-protocol-completion.mdc`).

Корень скиллов в репозитории: **`.claude/skills/<имя>/SKILL.md`**.

| Фраза / триггер (как в CLAUDE.md) | Файл скилла |
|-----------------------------------|-------------|
| `/day-open`, «открывай день» | `.claude/skills/day-open/SKILL.md` |
| `/run-protocol close`, закрытие сессии | `.claude/skills/run-protocol/SKILL.md` (аргумент `close`) + при необходимости `.claude/skills/verify/SKILL.md` |
| `/run-protocol day-close` | `.claude/skills/day-close/SKILL.md` (через run-protocol) |
| `/run-protocol week-close` | `.claude/skills/week-close/SKILL.md` |
| `/month-close` | `.claude/skills/month-close/SKILL.md` |
| `/archgate` | `.claude/skills/archgate/SKILL.md` |
| `/ke` | `.claude/skills/ke/SKILL.md` |
| `/verify` | `.claude/skills/verify/SKILL.md` |
| `/extend` | `.claude/skills/extend/SKILL.md` |
| `/audit-installation` | `.claude/skills/audit-installation/SKILL.md` |
| новый РП | `.claude/skills/wp-new/SKILL.md` |
| стратсессия | `.claude/skills/strategy-session/SKILL.md` |
| принципы (FPF) | `.claude/skills/fpf/SKILL.md` |
| ADI-цикл | `.claude/skills/think/SKILL.md` |
| apply captures | `.claude/skills/apply-captures/SKILL.md` |
| обновление IWE | `.claude/skills/iwe-update/SKILL.md` |
| баг платформы | `.claude/skills/iwe-bug-report/SKILL.md` |
| WakaTime | `.claude/skills/setup-wakatime/SKILL.md` |
| линт текста | `.claude/skills/base-text-lint/SKILL.md` |
| ревью правил IWE | `.claude/skills/iwe-rules-review/SKILL.md` |

Хуки Claude Code (`dry-run-gate`, PreToolUse) в Cursor **не дублируются** автоматически; гейты дублируются через `.cursor/rules` и дисциплину агента.

---

## 4. Планировщик заданий Windows вместо launchd

**launchd** и `~/Library/LaunchAgents` — только macOS. Эквивалент на Windows: **Планировщик заданий** + вызов `bash.exe -lc '…'`.

В репозитории:

- `setup/windows/iwe-task-env.example.sh` — скопируйте в `iwe-task-env.sh`, выставьте пути и `IWE_LOG_ROOT`.
- `setup/windows/register-iwe-role-tasks.ps1` — регистрирует три задачи (утренний Strategist, понедельный week-review, Extractor inbox-check каждые 3 ч), вызывая подставленные скрипты из `.iwe-runtime`.

Запуск PowerShell **от имени того же пользователя**, под которым работаете (интерактивные задачи). При первом запуске проверьте: `IWE_RUNTIME` существует, `strategist.sh` / `extractor.sh` исполняемы в Git Bash.

Если роли **не** используете — скрипт регистрации не обязателен; достаточно ручного запуска из терминала.

---

## 5. См. также

- [PLATFORM-COMPAT.md](PLATFORM-COMPAT.md) — запрещённые bash-конструкции и пометки по ОС.
- [extensions/README.md](../extensions/README.md) — extension points, `params.yaml`, MCP, dry-run (учёт Cursor).
- `setup/windows/README.md` — краткая инструкция по регистрации задач.

---

*Последнее обновление: 2026-05-14*
