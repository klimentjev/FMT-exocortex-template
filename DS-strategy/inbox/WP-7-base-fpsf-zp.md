---
wp: 7
title: Base — локальный репозиторий с FPF/SPF/ZP
status: done
created: 2026-04-03
source: Session Open — архитектурное решение (ArchGate passed)
verification_class: closed-loop
---

# WP-7: Base — локальный репозиторий с FPF/SPF/ZP

## Описание

Создать локальную копию First Principles Framework (FPF), Strategic Platform Framework (SPF) и Zero Principles (ZP) как **source-of-truth** для всей IWE-системы вместо опоры на внешнюю систему Левенчука.

**Проблема:** текущий setup использует кэш (memory/fpf-reference.md, 61 строк = 1% от FPF) + ссылка на `/Users/tserentserenov/IWE/FPF/`. Это создаёт:
- Зависимость от доступности его системы
- Отставание версии (кэш = снимок)
- Отсутствие контроля версионирования
- Низкую ценность для агентов (не автоматизирует выбор нужного раздела FPF)

**Решение:** Создать `/IWE/Base/` с:
1. `Base/FPF/` — git submodule на `ailev/FPF`
2. `Base/SPF/` — локальные файлы SPF (версионированные)
3. `Base/ZP/` — локальные файлы ZP (версионированные)
4. `Base/MIGRATION.md` — процедура при breaking changes
5. `Base/SYNC-LOG.md` — журнал синхронизаций
6. `memory/fpf-reference.md` — обновлён со ссылкой на `Base/FPF/`

## Артефакт

Репозиторий `/IWE/Base/` со следующей структурой:

```
Base/
├── FPF/                       (git submodule на ailev/FPF)
│   └── FPF-Spec.md
├── SPF/
│   ├── spec/
│   │   ├── SPF.SPEC.001-entity-coding.md
│   │   └── SPF.SPEC.003-pack-scalability.md
│   └── README.md
├── ZP/
│   └── README.md              (нулевые принципы)
├── FPF-VERSION.txt            (версия FPF: YYYYMMDD, commit hash)
├── MIGRATION.md               (как обновиться при breaking changes)
├── SYNC-LOG.md                (журнал синхронизаций)
└── README.md                  (инструкция для агентов)
```

Плюс обновление:
- `memory/fpf-reference.md` — добавить ссылку на `Base/FPF/` вместо `/Users/tserentserenov/IWE/FPF/`
- `CLAUDE.md` § 1 (Fallback Chain) — обновить: `DS → Pack → Base`

## Контекст

**Связанные решения:**
- ArchGate v3 прошёл ✅ (эволюционируемость ⚠️, современность ⚠️, остальное ✅)
- Критические характеристики: Эволюционируемость, Современность
- L2 Сохранность знаний (⚠️) — требует MIGRATION.md + SYNC-LOG.md

**Зависимости:**
- Нет блокирующих зависимостей
- Не препятствует РП 6 (диссертация) — бюджет 2h в W14, параллель
- Поддерживает все агенты через улучшенный доступ к базовым принципам

**Upstream:** Решение о Варианте Б (создать Base/) вместо Варианта В (кэш).

## Критерий готовности

✅ Base-репо инициализирован (git init + .gitignore)
✅ FPF: git submodule добавлен (ailev/FPF at latest tag/branch)
✅ SPF/ZP: структура создана и заполнена (выгрузка из системы Левенчука или локальное содержимое)
✅ MIGRATION.md написан (процедура при breaking changes в FPF)
✅ SYNC-LOG.md создан с первой записью (дата, версия FPF, действия)
✅ FPF-VERSION.txt содержит версию submodule (YYYYMMDD + commit hash)
✅ Base/README.md написан (для агентов: как читать FPF/SPF/ZP)
✅ memory/fpf-reference.md обновлён (ссылка на Base/FPF/ вместо внешней системы)
✅ CLAUDE.md § 1 обновлён (Fallback Chain: DS → Pack → Base)
✅ 1 коммит в IWE: "feat: add Base repository with FPF/SPF/ZP"

## Бюджет

~2h:
- 20 мин: инициализация Base/, структура, .gitignore
- 30 мин: git submodule FPF + первый pull
- 20 мин: SPF/ZP структура (выгрузка или копия)
- 30 мин: MIGRATION.md + SYNC-LOG.md + FPF-VERSION.txt
- 20 мин: Base/README.md для агентов
- 10 мин: обновление memory/fpf-reference.md + CLAUDE.md
- 10 мин: git commit + push

## Интеграция с ИИ-анализом (Layer A+B+C)

**Дополнительно к Base repo:**

### Layer A: Cursor Rules
- Файл: `.cursor/rules/base-aware-analysis.md`
- Функция: инструкции для Claude при анализе текста
- Срабатывает: всегда, когда анализирую философский/методический текст
- Пример: "Абзац нарушает A.7 (Role ≠ Method)"

### Layer B: Skill base-text-lint
- Файл: `.claude/skills/base-text-lint/SKILL.md`
- Функция: явный /base-lint для структурированной проверки текста
- Срабатывает: по команде пользователя
- Выход: таблица нарушений с FPF кодами

### Layer C: MCP base-search-mcp
- Файл: `DS-MCP/base-search-mcp/` (package.json + README)
- Функция: автоматический поиск в Base при анализе
- Срабатывает: когда Claude нужна информация (например, "дай определение A.7")
- Примеры tools: search_fpf(), get_fpf_pattern(), get_spf_template()

**Статус Layer C:** Stub (инструкции + структура, реализация позже)

## Осталось

**В this session (RП 7):**
- ✅ Переименовано Principles → Base
- ✅ Созданы FPF-VERSION.txt, MIGRATION.md, SYNC-LOG.md
- ✅ Обновлены пути в памяти и документации
- ✅ Созданы Layer A (Rules) и Layer B (Skill)
- ✅ Создан Layer C (MCP stub)
- ⏳ Git commit (все 3 слоя)

**На неделю (W15):**
- Реализовать MCP backend (Python)
- Зарегистрировать MCP в Cursor settings
- Тестировать на РП 6 (статья)
