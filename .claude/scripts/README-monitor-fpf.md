# FPF Version Monitor

Автоматический мониторинг актуальности локальной копии FPF.

## Что это делает

Скрипт проверяет, синхронизирована ли твоя локальная копия FPF с официальным репозиторием GitHub:

```
Локальная копия           GitHub (ailev/FPF)
c:\Users\admin\IWE\       https://github.com/ailev/FPF
Principles\FPF\
FPF-Spec.md               → Сравнивает версии (дата)
                          → Информирует о несоответствии
```

## Характеристики

- ✅ **Периодическая проверка:** максимум раз в 3 дня (не перегружает GitHub)
- ✅ **Локальное кеширование:** время последней проверки сохраняется в `.claude/meta/`
- ✅ **Информативный вывод:** четкий статус синхронизации
- ✅ **Graceful handling:** корректно обрабатывает отсутствие интернета
- ✅ **PowerShell 5.1 compatible:** работает на всех версиях Windows

## Установка

Скрипт уже создан и интегрирован в CLAUDE.md:
```
.claude/scripts/monitor-fpf-version.ps1
```

## Использование

### Запуск скрипта вручную

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ".\.claude\scripts\monitor-fpf-version.ps1"
```

### Запуск в VS Code терминале

```powershell
& ".\.claude\scripts\monitor-fpf-version.ps1"
```

### Пример вывода (синхронизировано)

```
=== FPF Version Monitor ===
Check interval: 3 days

Local version: March 2026
   File: c:\Users\admin\IWE\Principles\FPF\FPF-Spec.md

Checking GitHub (ailev/FPF)...
Remote version on GitHub: March 2026

SYNCHRONIZED
   Your local copy is up to date.

Last check saved
```

### Пример вывода (рассинхронизация)

```
Remote version on GitHub: April 2026

DESYNCHRONIZATION DETECTED
   Local: March 2026
   GitHub: April 2026
   -> Consider updating your local copy
```

### Пример вывода (следующая проверка позже)

```
Next check in: 2 days (last: 1.3 days ago)
   To force check now, delete: c:\Users\admin\IWE\.claude\meta\fpf-last-check.txt
```

## Где хранятся данные

| Файл | Описание |
|------|----------|
| `.claude/scripts/monitor-fpf-version.ps1` | Сам скрипт |
| `.claude/meta/fpf-last-check.txt` | Время последней проверки (ISO 8601) |

## Принудительная проверка

Чтобы переопроверить GitHub до истечения 3 дней, удали файл метаданных:

```powershell
Remove-Item ".\.claude\meta\fpf-last-check.txt"
```

Или просто запусти скрипт снова после удаления.

## Интеграция с рабочим процессом

### Вариант 1: Проверка перед коммитом

Добавь в pre-commit hook:
```powershell
& ".\.claude\scripts\monitor-fpf-version.ps1"
```

### Вариант 2: Периодический запуск через Task Scheduler

```powershell
# PowerShell (admin)
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-NoProfile -ExecutionPolicy Bypass -File "c:\Users\admin\IWE\.claude\scripts\monitor-fpf-version.ps1"'
$trigger = New-ScheduledTaskTrigger -AtStartup
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "FPF-Monitor" -Description "Check FPF version"
```

### Вариант 3: Запуск вручную (как рекомендуется)

Запускай перед работой с FPF:
```powershell
& ".\.claude\scripts\monitor-fpf-version.ps1"
```

## Когда нужно обновить локальную копию

Если скрипт вывел **DESYNCHRONIZATION DETECTED**:

```powershell
# Если это обновление существующей копии
cd c:\Users\admin\IWE\Principles\FPF
git pull

# Или переклонировать
git clone https://github.com/ailev/FPF.git c:\Users\admin\IWE\Principles\FPF
```

## Правило в CLAUDE.md

Правило интегрировано в **§10 (Авторское)**:

```markdown
- **FPF Version Monitor:** Проверка актуальности локальной копии FPF раз в 3 дня.
  - Скрипт: `.claude/scripts/monitor-fpf-version.ps1`
  - Запуск: `pwsh .\.claude\scripts\monitor-fpf-version.ps1`
  - Источник истины: https://github.com/ailev/FPF
```

## Технические детали

- **Язык:** PowerShell 5.1+
- **Зависимости:** встроенные командлеты (нет внешних пакетов)
- **Интернет:** требуется для проверки GitHub
- **Кеш:** локальный, в `.claude/meta/`

## Trouble-shooting

| Проблема | Решение |
|----------|---------|
| `Invoke-WebRequest: The underlying connection was closed` | Проверь интернет-соединение |
| `Access denied` при сохранении метаданных | Убедись, что `.claude/meta/` доступна для записи |
| `Version not found` в локальной копии | Переклонируй FPF из GitHub |

---

**Последнее обновление:** 28 марта 2026
**Проверено на:** Windows 10+, PowerShell 5.1+
