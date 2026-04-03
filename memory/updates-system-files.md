# Обновление системных файлов: FPF, SPF, шаблон, CLAUDE.md, memory

> Когда: периодически или по необходимости. Перед работой с принципами — обновить FPF/SPF.

---

## 1. Шаблон экзокортекса (DS-exocortex)

**Обновляет:** upstream → твой fork: протоколы, memory/*.md (кроме MEMORY.md), CLAUDE.md, промпты ролей, MCP-конфиг.

```bash
cd /mnt/c/Users/admin/IWE/DS-exocortex
bash update.sh
```

| Команда | Действие |
|---------|----------|
| `bash update.sh` | fetch upstream → merge → копия CLAUDE.md в корень workspace → копия memory/* в ~/.claude/.../memory/ → обновление .claude/settings.local.json → переустановка ролей при изменении их файлов |
| `bash update.sh --check` | Показать, есть ли коммиты в upstream |
| `bash update.sh --dry-run` | Показать, что изменится, без применения |

**Не трогается:** MEMORY.md (твои РП), DS-strategy/, PACK-*.

> **После обновления:** если добавились новые файлы шаблона, часть из них может содержать незаменённые `{{...}}` переменные — `update.sh` не перезапускает `setup.sh`. Проверить: `bash -c "grep -rl '{{[A-Z_]*}}' /mnt/c/Users/admin/IWE/DS-exocortex/ --include='*.md' --include='*.sh' --include='*.yaml' --include='*.plist'"`. Исправить: ручной sed с известными значениями (GITHUB_USER, CLAUDE_PATH, TIMEZONE_HOUR, TIMEZONE_DESC, CLAUDE_PROJECT_SLUG).

> Если папка называется `DS-exocortex`, скрипт берёт её как exocortex (есть CLAUDE.md и memory/).

---

## 2. FPF (First Principles Framework)

**Обновляет:** репозиторий FPF (принципы, мета-онтология).

```bash
cd ~/Github/Principles/FPF
git pull
```

Справка: `memory/fpf-reference.md`.

---

## 3. SPF (Second Principles Framework)

**Обновляет:** репозиторий SPF (форма и процесс Pack, контракты).

```bash
cd ~/Github/Principles/SPF
git pull
```

Справка: `Principles/SPF/CLAUDE.md`.

---

## 4. CLAUDE.md и memory (в рабочем пространстве)

- **Из шаблона:** после `update.sh` они уже скопированы в корень workspace и в `~/.claude/.../memory/`.
- **Ручная копия** (если update.sh не использовался):
  - CLAUDE.md: `cp DS-exocortex/CLAUDE.md ~/Github/CLAUDE.md`
  - memory: `cp DS-exocortex/memory/*.md ~/.claude/projects/<slug>/memory/` — **не перезаписывать MEMORY.md**, если там твои РП.

---

## 5. DS-strategy (личные планы)

Не обновляется извне. Перед работой и на Close:

```bash
cd ~/Github/DS-strategy
git pull --rebase
```

---

## Порядок при полном обновлении

1. DS-exocortex: `bash update.sh` (включает CLAUDE.md + memory + MCP).
2. FPF: `cd ~/Github/Principles/FPF && git pull`.
3. SPF: `cd ~/Github/Principles/SPF && git pull`.
4. DS-strategy: `cd ~/Github/DS-strategy && git pull --rebase`.

Backup на Close: `memory/ + CLAUDE.md → DS-strategy/exocortex/` (протокол Close).
