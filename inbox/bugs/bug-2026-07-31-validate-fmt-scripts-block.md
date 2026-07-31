# Bug: pre-commit validate-fmt-scripts блокирует коммит 2026-07-31

**Дата:** 2026-07-31
**Контекст:** пилот дал команду «закоммить и пуш всё». Коммит в корневом репо (IWE / FMT-exocortex-template, ветка migration/upstream-sync-2026-04-25) остановлен pre-commit хуком.

## Нарушения (3)

1. `.claude/scripts/memory-drift-scan.py:25` — литерал `DS-strategy` без env fallback (хук требует `$IWE_GOVERNANCE_REPO`). Файл новый, в защищённом пути `.claude/scripts/`.
2. `setup.sh:309,768-769` — хардкод `GOVERNANCE_REPO="DS-strategy"` / `MY_STRATEGY_DIR="$WORKSPACE_DIR/DS-strategy"` без env fallback.
3. `.claude/skills/diagnose-iwe/SKILL.md` — L1 SKILL.md без маркера `<!-- USER-SPACE -->` (хук предлагает `bash $IWE_SCRIPTS/add-skill-markers.sh`).

Дополнительно: `jq не найден` — проверка `.claude/settings.json` пропущена (warning, не блокер).

## Состояние

- Все изменения корневого репо остаются staged (коммит не создан, ничего не потеряно).
- DS-strategy закоммичен и запушен отдельно: `53d7b1a docs(myiwe): sync Strategy/resumeNEP, zametki 31.07, add Cascade-2026`.

## Варианты

- А: исправить 3 нарушения (затрагивает защищённые пути `.claude/scripts/`, `.claude/skills/`, `setup.sh` — нужно разрешение пилота), затем обычный коммит.
- Б: `git commit --no-verify` (escape hatch, предложенный самим хуком), нарушения остаются на будущее.

**Статус:** частично resolved — см. второй блокер ниже.

## Блокер 2: INTEGRATION-CONTRACT-VALIDATOR (2026-07-31, та же попытка коммита)

После исправления первых 3 нарушений коммит повторно остановлен: `setup/integration-contract-validator.sh` (шаг [1/11] manifest_paths) требует `python`, а на машине Python не установлен (только Store-заглушка; проверено: `python`, `python3`, `py`, стандартные пути установки — отсутствуют). Это не нарушение в файлах, а отсутствие рантайма окружения: валидатор физически не может отработать на этом Windows-хосте.

Варианты: (А) `git commit --no-verify` — escape hatch из текста самого хука; (Б) установить Python через winget и коммитить штатно; (В) патч валидатора: пропуск с warning при отсутствии python (защищённый путь `setup/`).

**Статус блокера 2:** ждёт решения пилота.

**Блокер 1 — resolved:** пилот выбрал вариант А. Исправлено: `memory-drift-scan.py` (docstring → env-fallback форма), `setup.sh` (16 строк: литерал → `$GOVERNANCE_REPO` / `${IWE_GOVERNANCE_REPO:-...}`), `diagnose-iwe/SKILL.md` (добавлен маркер USER-SPACE). Валидатор: нарушений нет.
