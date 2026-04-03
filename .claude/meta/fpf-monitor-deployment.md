# FPF Version Monitor — Развертывание завершено

**Дата создания:** 28 марта 2026  
**Статус:** ✅ Готово к использованию

---

## Что создано

### 1. Основной скрипт
**Файл:** `.claude/scripts/monitor-fpf-version.ps1`
- PowerShell скрипт для проверки синхронизации
- Периодичность: не чаще 1 раза в 3 дня
- Проверяет: локальную копию vs GitHub (ailev/FPF)

### 2. Документация
**Файл:** `.claude/scripts/README-monitor-fpf.md`
- Полное руководство по использованию
- Примеры вывода
- Trouble-shooting guide
- Интеграция с рабочим процессом

### 3. Интеграция в CLAUDE.md
**Обновлено:** `CLAUDE.md` (§10 Авторское)
```markdown
- **FPF Version Monitor:** Проверка актуальности раз в 3 дня.
  - Скрипт: `.claude/scripts/monitor-fpf-version.ps1`
  - Запуск: `pwsh .\.claude\scripts\monitor-fpf-version.ps1`
  - Источник истины: https://github.com/ailev/FPF
  - Локальная копия: `c:\Users\admin\IWE\Principles\FPF\FPF-Spec.md`
  - Метаданные: `.claude\meta\fpf-last-check.txt`
```

### 4. Метаданные
**Файл:** `.claude/meta/fpf-last-check.txt`
- Создается автоматически при первом запуске
- Содержит: время последней проверки (ISO 8601)
- Текущее значение: `2026-03-28T12:40:57.6633376Z`

---

## Текущий статус

| Компонент | Статус | Последняя проверка |
|-----------|--------|------------------|
| **Локальная версия** | ✅ March 2026 | 28 марта 2026, 15:40 UTC |
| **GitHub версия** | ✅ March 2026 | 28 марта 2026, 15:40 UTC |
| **Синхронизация** | ✅ SYNCHRONIZED | — |
| **Следующая проверка** | 31 марта 2026 | Или вручную, удалив `.claude/meta/fpf-last-check.txt` |

---

## Как использовать

### Рекомендуемый способ: периодический запуск вручную

```powershell
# Перед началом работы или еженедельно
powershell -NoProfile -ExecutionPolicy Bypass -File ".\.claude\scripts\monitor-fpf-version.ps1"
```

### Быстрый запуск в VS Code терминале

```powershell
& ".\.claude\scripts\monitor-fpf-version.ps1"
```

### Принудительная переопроверка (игнорируя 3-дневный интервал)

```powershell
Remove-Item ".\.claude\meta\fpf-last-check.txt"
& ".\.claude\scripts\monitor-fpf-version.ps1"
```

---

## Возможные сценарии

### Сценарий 1: Все синхронизировано (нормально)

```
=== FPF Version Monitor ===
Check interval: 3 days

Local version: March 2026
Remote version on GitHub: March 2026

SYNCHRONIZED
   Your local copy is up to date.
```

**Действие:** никакого. Продолжай работу.

### Сценарий 2: Обнаружена рассинхронизация

```
=== FPF Version Monitor ===

Local version: March 2026
Remote version on GitHub: April 2026

DESYNCHRONIZATION DETECTED
   Local: March 2026
   GitHub: April 2026
```

**Действие:**
```powershell
cd c:\Users\admin\IWE\Principles\FPF
git pull
```

### Сценарий 3: Проверка еще не требуется

```
Next check in: 2 days (last: 1.3 days ago)
   To force check now, delete: c:\Users\admin\IWE\.claude\meta\fpf-last-check.txt
```

**Действие:** никакого. Скрипт запустится автоматически через 2 дня.

---

## Правила и ограничения

✅ **Каждый запуск сохраняет время проверки**  
✅ **Интернет требуется только для проверки GitHub**  
✅ **При отсутствии интернета скрипт корректно завершается**  
✅ **Нет внешних зависимостей (встроенные PowerShell командлеты)**  
✅ **Работает на Windows 10+ с PowerShell 5.1+**  

---

## Интеграция с рабочим процессом

### Опция 1: Вручную перед работой с FPF (РЕКОМЕНДУЕТСЯ)
```powershell
# Перед работой с FPF или SPF
& ".\.claude\scripts\monitor-fpf-version.ps1"
```

### Опция 2: Еженедельно (через Task Scheduler)
Требует PowerShell (admin):
```powershell
$action = New-ScheduledTaskAction -Execute 'powershell.exe' `
  -Argument '-NoProfile -ExecutionPolicy Bypass -File "c:\Users\admin\IWE\.claude\scripts\monitor-fpf-version.ps1"'
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 9am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "FPF-Monitor"
```

### Опция 3: Pre-commit hook
Добавь в `.git/hooks/pre-commit`:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ".\.claude\scripts\monitor-fpf-version.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }
```

---

## Файловая структура

```
.claude/
├── scripts/
│   ├── monitor-fpf-version.ps1      ← Основной скрипт
│   └── README-monitor-fpf.md        ← Подробная документация
└── meta/
    └── fpf-last-check.txt           ← Метаданные (создается автоматически)

CLAUDE.md                            ← Обновлено (§10)
```

---

## Что дальше?

1. **Готово к использованию:** запускай скрипт вручную или интегрируй в рабочий процесс
2. **Мониторинг:** скрипт будет проверять GitHub раз в 3 дня
3. **Оповещения:** выводит четкое сообщение при рассинхронизации
4. **Документация:** полная инструкция в README-monitor-fpf.md

---

## Контрольный список

- ✅ Скрипт создан и работает
- ✅ GitHub проверен (версия синхронизирована)
- ✅ Метаданные сохранены
- ✅ CLAUDE.md обновлен
- ✅ Документация создана
- ✅ Интеграция описана

**Статус:** 🟢 ГОТОВО

---

*Последнее обновление: 28 марта 2026*
