---
valid_from: 2026-04-13
updated: 2026-08-04
type: reference
horizon: warm
domains: [reference]
status: active
owner: user
schema_version: 1
name: "navigation"
description: "Операционная карта этой установки IWE (сверка с диском — L1/L3 фаза 5)"
---

# Навигация по репозиториям (эта установка)

> SoT факта дерева: то, что есть на диске. Устаревшие шаблонные пути сюда не копировать.
> Личная система жизнедеятельности: `DS-strategy/_my-pls/my-pls-map.md` + `my-pls-system.md`.

## Ключевые файлы платформы

| Тема | Файл |
|------|------|
| Различения (жёсткие пары) | `memory/hard-distinctions.md` |
| FPF (навигация) | `memory/fpf-reference.md` |
| Правила по типам репо | `memory/repo-type-rules.md` |
| Чеклисты | `memory/checklists.md` |
| SOTA | `memory/sota-reference.md` |
| Протокол Open | `memory/protocol-open.md` |
| Протокол Close | `memory/protocol-close.md` |
| Day Close | `.claude/skills/day-close/SKILL.md` |
| Week Close | `.claude/skills/week-close/SKILL.md` |
| Шаблоны DayPlan/WeekPlan | `memory/templates-dayplan.md` |
| FPF (полное дерево) | `Base/FPF/` |
| SPF (спеки / шаблон Pack) | `Base/SPF/` — напр. `Base/SPF/spec/SPF.SPEC.001-entity-coding.md` |
| Культура работы (L3) | `extensions/iwe-work-culture.md` |
| Куда писать знание (Capture) | `DS-strategy/exocortex/capture-routing.md` |

## Репозитории и зоны

| Зона | Путь | Заметка |
|------|------|---------|
| Платформа L1 | корень `IWE/` + `update.sh` | форк FMT; upstream Церена |
| Governance L3 | `DS-strategy/` | `_my-pls/`, `current/`, `inbox/`, `library/` |
| `DS-exocortex/` | dormant | не SoT; `inbox/decision-2026-08-04-ds-exocortex-dormant.md` |
| DS-MCP | `DS-MCP/` | локальные MCP-заготовки |
| Base | `Base/FPF`, `Base/SPF` | принципы / форма Pack |
| Расширения L3 | `extensions/`, `params.yaml` | не править skills «под себя» |

## Pack (есть на диске)

| Pack | Путь |
|------|------|
| PACK-personal | `PACK-personal/` |
| PACK-aufheben | `PACK/PACK-aufheben/` |
| PACK-bibliography | `PACK/PACK-bibliography/` |
| PACK-digital-platform | `PACK/PACK-digital-platform/` (частично; полный DP — через облачный поиск Pack) |
| PACK-education | `PACK/PACK-education/` |
| PACK-history-of-philosophy | `PACK/PACK-history-of-philosophy/` |
| PACK-logic | `PACK/PACK-logic/` |
| PACK-philosophy-of-cognition | `PACK/PACK-philosophy-of-cognition/` |

> Нет локально: `PACK-verification`, `PACK-autonomous-agents`, `DS-autonomous-agents`, `DS-agent-workspace`, `DS-principles-curriculum`, корневой `ZP/`, папка `FMT-exocortex-template/`.

## Стратегия и _my-pls

| Файл | Путь |
|------|------|
| Руководство по системе | `DS-strategy/_my-pls/my-pls-system.md` |
| Карта жанров | `DS-strategy/_my-pls/my-pls-map.md` |
| Стратегия | `DS-strategy/_my-pls/05-Strategy.md` |
| Неудовлетворённости | `DS-strategy/_my-pls/03-Dissatisfactions.md` |
| Реестр РП | `DS-strategy/_my-pls/WP-REGISTRY.md` |
| Бортовой журнал | `DS-strategy/current/08-logbook.md` |
| Протокол дня | `DS-strategy/current/07-operational-day-protocol.md` |
| WeekPlan / DayPlan | `DS-strategy/current/` |
| Каталог ролей (локальная копия) | `DS-strategy/docs/DP.AGENT.001-section-3.2-catalog-roles.md` |

## MCP

| Что | Как |
|-----|-----|
| База знаний Pack / guides | MCP `knowledge` / `iwe-knowledge` (облако aisystant) |
| Цифровой двойник | MCP `ddt` (если подключён) |
| Локальные заготовки | `DS-MCP/` |

## GitHub-организации (эта установка)

| Org | Роль |
|-----|------|
| `klimentjev` | ваши форки (FMT, DS-strategy, …) |
| upstream FMT | автор шаблона экзокортекса на GitHub (remote `upstream`) |
| `aisystant` | часть Pack (напр. PACK-personal) |
| `ailev` | FPF upstream |

> Ссылки генерировать по факту `git remote`, не подставлять org наугад.

## WP Context Files

> Часто: `DS-strategy/inbox/WP-{N}-{slug}.md` (плоский файл).  
> Канон шаблона (папка): `inbox/WP-{N}/WP-{N}.md` — если появится, не ломать.  
> Архив: `DS-strategy/archive/wp-contexts/`
