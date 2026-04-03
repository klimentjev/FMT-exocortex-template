# DP.AGENT.001 §3.2 — Каталог ролей платформы

> **Копия из:** [PACK-digital-platform](https://github.com/TserenTserenov/PACK-digital-platform) — `pack/digital-platform/02-domain-entities/DP.AGENT.001-ai-agents.md`, раздел 3.2.  
> **Дата копии:** 2025-03-07. Source-of-truth — оригинальный файл в репо.

---

### 3.2. Каталог ролей платформы

> Каждая роль описана по шаблону DP.D.033. Тип: **agential** (требует Grade 2+, автономия в выборе КАК действовать) или **functional** (Grade 0+, исполнение по алгоритму).

#### Агентские роли (Grade 2+)

> Исполнители (кто играет роль) — см. Таблица РА §3.5 в полном документе.

| # | Роль | Suprasystem | Сервисы (описания методов) | Вход | Выход (РП) |
|---|------|-------------|---------------------------|------|------------|
| R1 | **Стратег** | Экзокортекс | Day-plan, Session-prep, Note-review, Week-review, Interactive | WeekPlan, inbox, коммиты, MAPSTRATEGIC | WeekPlan, DayPlan, WeekReport |
| R2 | **Экстрактор** | Экзокортекс | Knowledge Extraction, Inbox Check, Ontology Sync | captures.md, сессионные артефакты, Pack | Pack-сущности, Extraction Report |
| R3 | **Консультант** | Платформа DP | Q&A, DZ-Check, Content Pre-Gen, Feed Delivery | Вопрос ученика, knowledge-mcp, DT | Ответы, оценки, контент |
| R4 | **Автор** | Экосистема | Post-Writing, Presentation, Description | Content plan, knowledge-mcp | Посты (md), презентации (Marp) |
| R5 | **Архитектор** | Платформа DP | ArchGate, BC-Mapping, ADR, SOTA-Update | Арх. предложение, Pack, SOTA | ADR, оценки ЭМОГССБ, BC-маппинг |
| R6 | **Кодировщик** | Платформа DP | Implementation, Refactoring, Bug-Fix | Архитектура (R5), backlog (R7) | Код (коммиты), captures |
| R7 | **Триажёр техдолга** | Платформа DP | Auto-Triage, Triage-Session | feedback_triage DB, inbox | Приоритизированный backlog, алерты |
| R22 | **Продуктолог** | Платформа DP / Экосистема | Discovery, Spec-Writing, Roadmap | Dissatisfactions.md, feedback, Pack | Feature Spec, Product Roadmap, Backlog |

> **R1, R2** — полное описание роли: `DS-ai-systems/strategist/system.yaml`, `DS-ai-systems/extractor/system.yaml`
>
> **Реализация в шаблоне:** Роли, поставляемые с FMT-exocortex-template, следуют формальному [контракту роли](https://github.com/TserenTserenov/FMT-exocortex-template/blob/main/roles/ROLE-CONTRACT.md) — спецификации структуры директории (`role.yaml` манифест, `install.sh`, `prompts/`). Контракт обеспечивает автодискавери и модульное добавление новых ролей.

**R3 Консультант** — полное описание (DP.D.033)

```yaml
name: "Консультант"
type: agential
suprasystem: "Платформа DP"
context: "Диалог с учеником: ответы на вопросы, проверка ДЗ, генерация контента"

obligations:
  - "Отвечать на вопросы ученика по материалу курса (knowledge-mcp)"
  - "Проверять домашние задания с Bloom-aware обратной связью"
  - "Генерировать ленту и марафон-контент по расписанию"
  - "Использовать DT для персонализации ответов (proactive injection)"
  - "Удерживать latency <3 сек для пользовательского опыта"

expectations:
  - from: "R16 Ученик"
    expects: "Понятные ответы, соответствующие уровню ученика"
  - from: "R12 Оценщик"
    expects: "Оценки встроены в диалог (inline evaluation)"
  - from: "R13 Проводник"
    expects: "Контент соответствует текущему FSM-состоянию ученика"

methods:
  - name: "Knowledge-MCP Search"
    description: "Поиск по 9 источникам (semantic + keyword) для ответа на вопрос"
  - name: "DT Injection"
    description: "Чтение цифрового двойника ученика → персонализация промпта"
  - name: "Content Budget Model"
    description: "Адаптация объёма ответа к tier + контексту (DP.D.027)"
  - name: "Streaming SSE"
    description: "Потоковая генерация ответа для минимизации воспринимаемой задержки"

work_products:
  - product: "Ответ на вопрос"
    recipient: "R16 Ученик (TG message)"
    trigger: "Ученик задал вопрос"
  - product: "Проверка ДЗ"
    recipient: "R16 Ученик (TG message + оценка)"
    trigger: "Ученик отправил ДЗ"
  - product: "Лента/Марафон контент"
    recipient: "R16 Ученик (scheduled TG message)"
    trigger: "Scheduler (pre-gen за 3ч)"

current_holders:
  - holder: "A1 Claude Haiku (via I1 Bot, Claude API)"
    grade: 3
    covers_scenarios: [Q&A, DZ-Check, Content-Generation]
    instruments: [Claude API (Haiku), knowledge-mcp, guides-mcp, digital-twin-mcp, TG Bot API (messages + keyboards)]

failure_modes:
  - "Hallucination — ответ не основан на Pack/knowledge-mcp"
  - "Tier Mismatch — контент не соответствует уровню ученика"

related_roles:
  - role: "R12 Оценщик"
    interaction: "Оценщик оценивает ответы, Консультант встраивает оценку в диалог"
  - role: "R13 Проводник"
    interaction: "Проводник определяет FSM-контекст → Консультант адаптирует контент"
  - role: "R16 Ученик"
    interaction: "Прямой диалог: вопрос → ответ"
```

**R4 Автор** — полное описание (DP.D.033)

```yaml
name: "Автор"
type: agential
suprasystem: "Экосистема"
context: "Создание контента: посты, презентации, питчи, описания"

obligations:
  - "Писать посты по content-плану Стратега"
  - "Готовить презентации для семинаров (Marp + PDF)"
  - "Создавать описания мероприятий и продуктовые материалы"
  - "Соблюдать стиль и тон автора (голос владельца экзокортекса)"

expectations:
  - from: "R1 Стратег"
    expects: "Content plan с темами, аудиторией, приоритетами"
  - from: "R14 Заказчик"
    expects: "Текст соответствует замыслу, не нужно существенно переписывать"
  - from: "R15 Валидатор"
    expects: "Пост готов к публикации после review"

methods:
  - name: "Topic Research"
    description: "knowledge-mcp + Pack → сбор материала для поста"
  - name: "Structured Writing"
    description: "Заголовок → тезис → аргументация → вывод → CTA"
  - name: "Marp Slides"
    description: "Markdown → Marp → PDF для презентаций"

work_products:
  - product: "Пост (markdown)"
    recipient: "R15 Валидатор → DS-Knowledge-Index/docs/"
    trigger: "Content plan item"
  - product: "Презентация (Marp + PDF)"
    recipient: "R14 Заказчик (семинар)"
    trigger: "Семинар запланирован"
  - product: "Описание мероприятия"
    recipient: "Платформа (systemsworld.club, TG)"
    trigger: "Новое мероприятие"

current_holders:
  - holder: "A1 Claude (CLI interactive)"
    grade: 3
    covers_scenarios: [Post-Writing, Presentation, Description]
    instruments: [Claude Code CLI, knowledge-mcp, DS-Knowledge-Index repo, Marp CLI]

failure_modes:
  - "Voice Drift — стиль не соответствует голосу автора"

related_roles:
  - role: "R1 Стратег"
    interaction: "Стратег → content plan → Автор реализует"
  - role: "R15 Валидатор"
    interaction: "Валидатор проверяет текст перед публикацией"
```

**R5 Архитектор** — полное описание (DP.D.033)

```yaml
name: "Архитектор"
type: agential
suprasystem: "Платформа DP"
context: "Архитектурные решения, АрхГейт-оценки, структура экосистемы"

obligations:
  - "Оценивать каждое архитектурное предложение по ЭМОГССБ (7 характеристик)"
  - "Предлагать ТОЛЬКО решения с оценкой ≥8 по ArchGate"
  - "Определять BC-маппинг: знание → какой Pack"
  - "Поддерживать SOTA-справочник (memory/sota-reference.md)"
  - "Проверять приоритетную тройку: Context Engineering, DDD Strategic, Coupling Model"

expectations:
  - from: "R6 Кодировщик"
    expects: "Архитектура определена ДО начала кодирования"
  - from: "R2 Экстрактор"
    expects: "BC-маппинг и routing.md консистентны"
  - from: "R14 Заказчик"
    expects: "Обоснованные решения с таблицей ЭМОГССБ"

methods:
  - name: "ArchGate (ЭМОГССБ)"
    description: "7 характеристик: Эволюционируемость, Масштабируемость, Обучаемость, Генеративность, Скорость, Современность, Безопасность"
  - name: "SOTA Check"
    description: "Проверка по sota-reference.md: 18 практик (12 Platform + 6 Pack)"
  - name: "BC Mapping"
    description: "Определение Bounded Context → маршрутизация в правильный Pack"
  - name: "ADR (Architectural Decision Record)"
    description: "Формализация решения: контекст, варианты, выбор, обоснование"

work_products:
  - product: "ADR / ArchGate оценка"
    recipient: "R14 Заказчик, R6 Кодировщик"
    trigger: "Архитектурное решение требуется"
  - product: "BC-маппинг (routing.md update)"
    recipient: "R2 Экстрактор"
    trigger: "Новая предметная область или реорганизация Pack"
  - product: "SOTA-обновления"
    recipient: "memory/sota-reference.md → все роли"
    trigger: "Обнаружена новая SOTA-практика"

current_holders:
  - holder: "A1 Claude (CLI interactive)"
    grade: 3
    covers_scenarios: [ArchGate, BC-Mapping, ADR, SOTA-Update]
    instruments: [Claude Code CLI, CLAUDE.md + memory/sota-reference.md, knowledge-mcp, Pack repos (read)]

failure_modes:
  - "Weak Architecture — решение с оценкой ≤7 принято без обоснования"
  - "SOTA Ignorance — решение не учитывает доступные SOTA-практики"

related_roles:
  - role: "R6 Кодировщик"
    interaction: "Архитектор → архитектура → Кодировщик реализует"
  - role: "R2 Экстрактор"
    interaction: "Архитектор определяет BC → Экстрактор маршрутизирует знание"
  - role: "R1 Стратег"
    interaction: "Стратег определяет приоритеты → Архитектор решает HOW"
```

**R6 Кодировщик** — полное описание (DP.D.033)

```yaml
name: "Кодировщик"
type: agential
suprasystem: "Платформа DP"
context: "Реализация кода, рефакторинг, баг-фиксы по архитектуре R5"

obligations:
  - "Реализовывать код по утверждённой архитектуре (R5)"
  - "Следовать CLAUDE.md репо (exit protocol, code style)"
  - "Не вводить security vulnerabilities (OWASP Top 10)"
  - "Capture-to-Pack при обнаружении паттернов/антипаттернов"
  - "Коммитить с осмысленными сообщениями, пушить с подтверждением"

expectations:
  - from: "R5 Архитектор"
    expects: "Архитектура определена, ArchGate пройден"
  - from: "R15 Валидатор"
    expects: "Код работает, тесты проходят"
  - from: "R14 Заказчик"
    expects: "Минимальные изменения — не over-engineer"

methods:
  - name: "Incremental Implementation"
    description: "Мелкие коммиты, каждый — рабочее состояние"
  - name: "Read-Before-Edit"
    description: "Понять существующий код ДО модификации"
  - name: "Pilot-First Deployment"
    description: "new-architecture → pilot branch → тестирование → prod"

work_products:
  - product: "Код (коммиты)"
    recipient: "Git repo → R15 Валидатор (review) → prod"
    trigger: "РП назначен, архитектура определена"
  - product: "Capture (паттерн/антипаттерн)"
    recipient: "R2 Экстрактор (через capture-to-pack)"
    trigger: "Обнаружен при кодировании"

current_holders:
  - holder: "A1 Claude (CLI interactive)"
    grade: 3
    covers_scenarios: [Implementation, Refactoring, Bug-Fix]
    instruments: [Claude Code CLI (git, bash, file ops), repo CLAUDE.md, knowledge-mcp]

failure_modes:
  - "Over-Engineering — добавлены фичи, не запрошенные заказчиком"
  - "Security Hole — введена OWASP-уязвимость"

related_roles:
  - role: "R5 Архитектор"
    interaction: "Архитектор → решение → Кодировщик реализует"
  - role: "R7 Триажёр"
    interaction: "Триажёр приоритизирует backlog → Кодировщик берёт задачи"
  - role: "R11 Наладчик"
    interaction: "Наладчик L4 → GitHub Issue → Кодировщик фиксит"
```

**R7 Триажёр техдолга** — полное описание (DP.D.033)

```yaml
name: "Триажёр техдолга"
type: agential
suprasystem: "Платформа DP"
context: "Двухуровневый триаж: auto-classify (Grade 1) + review (Grade 3)"

obligations:
  - "Auto-triage: классифицировать каждый helpful=false / ✏️ comment в реальном времени"
  - "Review: при открытии сессии техдолга проверить предклассифицированный backlog"
  - "Категоризировать: L(atency), C(orrectness), U(sability), K(nowledge)"
  - "Оценивать severity: low/medium/high/critical"
  - "Кластеризовать: группировать похожие проблемы (onboarding, content, ...)"
  - "Алертить: severity >= high ИЛИ user_comment → TG alert в реальном времени"
  - "Обновлять WP-debt backlog (приоритизированный список)"

expectations:
  - from: "R6 Кодировщик"
    expects: "Backlog приоритизирован, задачи конкретны"
  - from: "R14 Заказчик"
    expects: "Критичное — алерт сразу, некритичное — не копится"
  - from: "R8 Синхронизатор"
    expects: "Weekly report (unsatisfied-questions.md) из feedback_triage DB"

methods:
  - name: "Auto-Triage (Grade 1)"
    description: "helpful=false → Haiku classify → feedback_triage DB → TG alert if high"
  - name: "Issue Funnel Review (Grade 3)"
    description: "feedback_triage DB + fleeting-notes + captures → review → prioritize → backlog"
  - name: "Impact Assessment"
    description: "Сколько пользователей затронуто × severity × effort"

work_products:
  - product: "feedback_triage DB record"
    recipient: "R7 Review, R8 Синхронизатор (отчёт)"
    trigger: "Каждый helpful=false или ✏️ comment"
  - product: "TG alert"
    recipient: "R14 Заказчик"
    trigger: "severity >= high ИЛИ user_comment"
  - product: "Приоритизированный backlog (WP-debt)"
    recipient: "R6 Кодировщик, R14 Заказчик"
    trigger: "Открытие сессии техдолга"

scenarios:
  - name: "Auto-Triage"
    trigger: "helpful=false callback OR user_comment saved"
    min_agency_grade: 1
    method: "Auto-Triage (Grade 1)"
    inputs: [qa_history record]
    work_product: "feedback_triage DB record + TG alert"
  - name: "Triage-Session"
    trigger: "Открытие сессии техдолга (WP-7)"
    min_agency_grade: 3
    method: "Issue Funnel Review (Grade 3)"
    inputs: [feedback_triage DB, fleeting-notes.md, captures.md]
    work_product: "Приоритизированный backlog"

current_holders:
  - holder: "Bot process (core/feedback_triage.py, Haiku)"
    grade: 1
    covers_scenarios: [Auto-Triage]
    instruments: [feedback_triage.py, Claude Haiku API, Neon DB (feedback_triage table), TG Bot API (alert)]
  - holder: "A1 Claude (CLI interactive)"
    grade: 3
    covers_scenarios: [Triage-Session]
    instruments: [Claude Code CLI, feedback_triage DB (read), inbox files (fleeting-notes, captures), GitHub API]

failure_modes:
  - "Backlog Bloat — замечания копятся без review (mitigated by auto-triage + alerts)"
  - "Alert Fatigue — слишком много high-severity алертов (monitor, tune threshold)"

related_roles:
  - role: "R6 Кодировщик"
    interaction: "Триажёр приоритизирует → Кодировщик реализует"
  - role: "R8 Синхронизатор"
    interaction: "Синхронизатор генерирует weekly report из feedback_triage DB"
  - role: "R11 Наладчик"
    interaction: "L4 escalations → попадают в triage"
```

**R22 Продуктолог** — полное описание (DP.D.033)

```yaml
name: "Продуктолог"
type: agential
suprasystem: "Платформа DP / Экосистема"
context: "Продуктовое мышление: что строить, для кого, зачем; мост между неудовлетворённостями и архитектурой"

obligations:
  - "Переводить неудовлетворённости (Dissatisfactions.md) в продуктовые гипотезы"
  - "Определять целевые сегменты и Jobs-to-be-Done"
  - "Формировать и приоритизировать product backlog"
  - "Писать Feature Spec для R5 Архитектора — проблема, гипотеза, DoD, метрика"
  - "Вести Product Roadmap на горизонт 3-6 месяцев"

expectations:
  - from: "R1 Стратег"
    expects: "Неудовлетворённости и стратегические приоритеты как входные данные"
  - from: "R5 Архитектор"
    expects: "Feature Spec оформлена до начала архитектурной работы"
  - from: "R14 Заказчик"
    expects: "Roadmap согласован, backlog отражает реальные приоритеты"

methods:
  - name: "Dissatisfaction Mining"
    description: "Dissatisfactions.md + fleeting-notes → кластеризация болей → продуктовые гипотезы"
  - name: "JTBD Analysis"
    description: "Jobs-to-be-Done: формулировка «When... I want to... So I can...»"
  - name: "Value × Effort Matrix"
    description: "Приоритизация backlog: ценность для пользователя × усилие реализации"
  - name: "Feature Spec"
    description: "Описание фичи: проблема → гипотеза → критерии готовности (DoD) → метрика успеха"

work_products:
  - product: "Feature Spec (md)"
    recipient: "R5 Архитектор, R6 Кодировщик"
    trigger: "Backlog item готов к реализации"
  - product: "Product Roadmap (md)"
    recipient: "R1 Стратег, R14 Заказчик"
    trigger: "Стратегическая сессия или квартальный review"
  - product: "Приоритизированный backlog"
    recipient: "R1 Стратег, R5 Архитектор"
    trigger: "После Dissatisfaction Mining или новой обратной связи"

current_holders:
  - holder: "A1 Claude (CLI interactive)"
    grade: 3
    covers_scenarios: [Discovery, Spec-Writing, Roadmap]
    instruments: [Claude Code CLI, Dissatisfactions.md, knowledge-mcp, Pack repos (read), fleeting-notes.md]

failure_modes:
  - "Scope Creep — backlog растёт без приоритизации"
  - "Solution Bias — фича описана как решение, а не как проблема"
  - "Orphan Spec — Feature Spec написана, но не передана R5 Архитектору"

related_roles:
  - role: "R1 Стратег"
    interaction: "Стратег формирует неудовлетворённости и приоритеты → Продуктолог переводит в продуктовые гипотезы и backlog"
  - role: "R5 Архитектор"
    interaction: "Продуктолог пишет Feature Spec → Архитектор проектирует решение"
  - role: "R7 Триажёр"
    interaction: "Триажёр передаёт кластеризованный feedback → Продуктолог обновляет гипотезы"
  - role: "R14 Заказчик"
    interaction: "Заказчик согласует Roadmap и приоритеты backlog"
```

#### Функциональные роли (Grade 0+, со смешанными сценариями)

| # | Роль | Suprasystem | Сервисы (описания методов) | Вход | Выход (РП) |
|---|------|-------------|---------------------------|------|------------|
| R8 | **Синхронизатор** | Экзокортекс | Scheduler Dispatch, Code-Scan, Pack Projection, Notify, Consistency Check, Unsatisfied Report | Время + config, git repos, Pack frontmatter | Projections, TG Notifications, Consistency Report |
| R9 | **Шаблонизатор** | Экзокортекс | Template Sync, Drift Detection, Semantic Validation, First-Time Setup | Platform files (CLAUDE.md, prompts, memory/) | Актуальный шаблон, Drift Report |
| R10 | **Статистик** | Платформа DP | Metrics Collection, Analytics Report, Time Tracking | qa_history, user_profiles, WakaTime API | Агрегированные метрики, /analytics |
| R11 | **Наладчик** | Платформа DP | L1 Unstick, L2 Auto-fix, L3 Restart, L4 Escalate | FSM timeout, error_logs, health check | FSM reset, Fix PRs, GitHub Issues |
| R12 | **Оценщик** | Платформа DP | Bloom Eval, WP Validation, Fixation | Ответ ученика + эталон, Pack entity draft | Bloom-оценка, валидация по SPF |
| R13 | **Проводник** | Платформа DP | FSM Routing, Tier Gating, Progressive Disclosure | Запрос пользователя, user_profile.tier | FSM Transition, Access Control Decision |
| R21 | **Публикатор** | Экосистема | Daily Scan, Scheduled Publish, Manual Publish, Comment Check | DS-Knowledge-Index (status=ready), scheduled_publications | Опубликованные посты, расписание, уведомления |

> **R8-R12, R21** — полное описание роли: `DS-ai-systems/ /system.yaml` (synchronizer, setup, pulse, fixer, evaluator, publisher)

#### R13 Проводник — полное описание (DP.D.033)

```yaml
name: "Проводник"
type: functional
suprasystem: "Платформа DP"
context: "Маршрутизация пользователя по FSM-сценариям, контроль доступа по tier"

obligations:
  - "Маршрутизировать пользователя между FSM-состояниями (марафон/лента/Q&A)"
  - "Контролировать доступ к функциям по tier (T1-T5)"
  - "Показывать кнопки и команды соответственно tier"
  - "Не допускать dead-ends в FSM (все состояния имеют выход)"
  - "Перенаправлять на оплату при попытке доступа к закрытым функциям"

expectations:
  - from: "R16 Ученик"
    expects: "Понятная навигация, кнопки соответствуют контексту"
  - from: "R3 Консультант"
    expects: "FSM-контекст корректно передан для генерации"
  - from: "R12 Оценщик"
    expects: "После оценки FSM переходит к следующему шагу"

methods:
  - name: "FSM Routing"
    description: "aiogram FSM → определение текущего состояния → доступные переходы"
  - name: "Tier Gating"
    description: "user_profile.tier → набор доступных команд и кнопок"
  - name: "Progressive Disclosure"
    description: "Показывать функции постепенно по мере роста tier"

work_products:
  - product: "FSM Transition"
    recipient: "R16 Ученик (TG keyboard/inline buttons)"
    trigger: "Пользователь нажал кнопку или ввёл команду"
  - product: "Access Control Decision"
    recipient: "R3 Консультант, R12 Оценщик (разрешение/запрет)"
    trigger: "Каждый запрос пользователя"

current_holders:
  - holder: "I1 Бот (aiogram FSM, middleware)"
    grade: 1
    covers_scenarios: [FSM-Routing, Access-Control, Tier-Gating]
    instruments: [aiogram FSM, middleware (tier_gate, auth), TG Bot API (keyboards, inline buttons), Neon DB (user_profiles)]

failure_modes:
  - "Dead-End State — пользователь застрял без кнопок выхода"
  - "Tier Leak — пользователь получил доступ к функции выше своего tier"

related_roles:
  - role: "R3 Консультант"
    interaction: "Проводник определяет контекст → Консультант генерирует контент"
  - role: "R12 Оценщик"
    interaction: "Оценщик завершает оценку → Проводник переводит в следующее состояние"
  - role: "R11 Наладчик"
    interaction: "Наладчик L1 расклинивает застрявших пользователей"
  - role: "R16 Ученик"
    interaction: "Прямое взаимодействие: кнопки, команды, навигация"
```

**R21 Публикатор** — полное описание (DP.D.033)

```yaml
name: "Публикатор"
type: functional
suprasystem: "Экосистема"
context: "Автономная публикация готовых постов на внешние платформы по расписанию и по команде"

obligations:
  - "Сканировать индекс знаний на посты с status=ready и target=club"
  - "Составлять расписание публикаций (каденция: ежедневно 10:00, настраиваемо через PUBLISHER_DAYS)"
  - "Публиковать посты по расписанию через Discourse API"
  - "Публиковать конкретный пост по команде пользователя — вне расписания"
  - "Перестраивать график после ручной публикации и согласовывать с пользователем"
  - "Уведомлять пользователя о каждой публикации (TG + ссылка)"
  - "Запрашивать новые посты, когда в очереди < 2"
  - "Отслеживать комментарии к опубликованным постам (polling)"
  - "Обновлять frontmatter поста (status→published) после публикации"

expectations:
  - from: "R4 Автор"
    expects: "Посты в индексе знаний со status: ready и target: club"
  - from: "R14 Заказчик"
    expects: "Публикация по расписанию без ручного вмешательства; уведомления; запрос новых постов при истощении очереди"
  - from: "R1 Стратег"
    expects: "Контент-план определяет порядок и приоритет публикаций"

methods:
  - name: "Index Scan"
    description: "GitHub API → DS-Knowledge-Index/docs/ → frontmatter filter (status=ready, target=club) → сравнение с published_posts"
  - name: "Auto-Schedule"
    description: "Новые ready-посты → распределение по ближайшим свободным слотам (FIFO по дате создания)"
  - name: "Schedule Rebuild"
    description: "При ручной публикации: опубликовать указанный пост → сдвинуть остальные → показать новый график → ждать подтверждения"
  - name: "Queue Watch"
    description: "После каждой публикации: pending < 2 → TG-уведомление с подсказкой draft-постов для R4 Автора"
  - name: "Comment Polling"
    description: "Каждые 15 мин: get_topic → сравнить posts_count → уведомить при изменении"

work_products:
  - product: "Опубликованный пост (Discourse topic)"
    recipient: "systemsworld.club → R14 Заказчик (TG notification + ссылка)"
    trigger: "schedule_time <= NOW() или команда пользователя"
  - product: "Расписание публикаций"
    recipient: "R14 Заказчик (/club schedule)"
    trigger: "Новый ready-пост обнаружен или ручная команда"
  - product: "Запрос новых постов"
    recipient: "R14 Заказчик → R4 Автор"
    trigger: "Очередь < 2 постов"
  - product: "Уведомление о комментарии"
    recipient: "R14 Заказчик (TG)"
    trigger: "posts_count изменился"

scenarios:
  - name: "Daily Scan + Auto-Schedule"
    trigger: "Scheduler (daily 03:00 MSK)"
    min_agency_grade: 1
    method: "Index Scan + Auto-Schedule"
    inputs: [github_api_contents, published_posts_db]
    work_product: "Расписание публикаций + TG-уведомление о новых постах в графике"
  - name: "Scheduled Publish"
    trigger: "Scheduler (*/30 min, schedule_time <= NOW())"
    min_agency_grade: 0
    method: "Discourse API create_topic"
    inputs: [scheduled_publications]
    work_product: "Опубликованный пост + обновлённый frontmatter"
  - name: "Manual Publish"
    trigger: "Пользователь: /club publish «Title»"
    min_agency_grade: 1
    method: "Schedule Rebuild"
    inputs: [user_command, scheduled_publications]
    work_product: "Опубликованный пост + пересмотренный график (с согласованием)"
  - name: "Comment Check"
    trigger: "Scheduler (*/15 min)"
    min_agency_grade: 0
    method: "Comment Polling"
    inputs: [published_posts]
    work_product: "TG-уведомление о новом комментарии + ссылка"

current_holders:
  - holder: "I1 Бот (scheduler + handlers/discourse.py)"
    grade: 1
    covers_scenarios: [Scheduled-Publish, Manual-Publish, Comment-Check]
    instruments: [handlers/discourse.py, Discourse API, Neon DB (published_posts, scheduled_publications), TG Bot API]
  - holder: "I9 Публикатор (DS-ai-systems/publisher/)"
    grade: 1
    covers_scenarios: [Daily-Scan, Auto-Schedule]
    instruments: [publisher/scripts/*, GitHub API (contents), Neon DB (published_posts)]

failure_modes:
  - "Queue Starvation — очередь пуста, публикация прекращается без уведомления"
  - "Ghost Publish — пост опубликован, но frontmatter не обновлён (status drift)"
  - "Schedule Desync — расписание не соответствует реальным публикациям"

related_roles:
  - role: "R4 Автор"
    interaction: "Автор пишет пост (status: ready, target: club) → Публикатор подхватывает и публикует"
  - role: "R1 Стратег"
    interaction: "Стратег определяет content plan → приоритет публикаций"
  - role: "R8 Синхронизатор"
    interaction: "Синхронизатор может вызывать Daily Scan по расписанию (scheduler dispatch)"
  - role: "R14 Заказчик"
    interaction: "Заказчик получает уведомления, даёт команды на публикацию, согласует перестроенный график"
```

#### Роли Пользователя (A2) — 7 ролей

| # | Роль | Контекст |
|---|------|----------|
| R14 | Заказчик | Формулирует задачи для Claude |
| R15 | Валидатор | Human-in-the-loop: одобряет KE, решения, PR |
| R16 | Ученик | Учится в боте (марафон/лента) |
| R17 | Стратег (интерактив) | Участвует в strategy-session |
| R18 | Автор заметок | Пишет .заметки в TG → fleeting-notes |
| R19 | Тестировщик | Проверяет бот (pilot) |
| R20 | Рецензент | Просматривает отчёты, дайджесты |

> **Ключевое:** Стратег (R1) и Экстрактор (R2) не могут работать одновременно (один Claude Code process). Консультант (R3) работает через отдельный Claude API в боте — может параллельно.

**Статистика:** 2 агента (A1 Claude, A2 Пользователь), 9 инструментов (I1-I9), 22 роли (8 агентских + 7 функциональных + 7 пользовательских), ~42 сценария. Репо: DS-ai-systems (монорепо, 8 систем).
