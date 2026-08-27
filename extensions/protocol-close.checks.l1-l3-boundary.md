# Protocol Close — L1/L3 boundary check

Перед завершением сессии проверить, что изменения не смешали слои.

Опора выбора режима: `DS-strategy/exocortex/l1-l3-mode-runbook.md`.

## Выбери режим закрытия

| Режим работы сессии | Какой mode использовать |
|---|---|
| Обычная личная работа (по умолчанию) | `l3-default` |
| Обслуживание платформы/шаблона | `l1-maintenance` |
| Явно согласованное смешение слоёв | `mixed-approved` |

## Обязательная проверка

1. Выполнить проверку staged-набора в `DS-strategy`:

```powershell
powershell -ExecutionPolicy Bypass -File "DS-strategy/exocortex/l1-l3-boundary-check.ps1" -Mode <mode> -Scope staged -RepoPath "DS-strategy"
```

2. Если в этой сессии были изменения в корне `IWE` (вне `DS-strategy`), выполнить проверку staged-набора для корня:

```powershell
powershell -ExecutionPolicy Bypass -File "DS-strategy/exocortex/l1-l3-boundary-check.ps1" -Mode <mode> -Scope staged -RepoPath "."
```

3. Если проверка упала — сессию не закрывать до разведения набора по слоям или до явного переключения режима.

## Короткая запись в закрытие сессии

После успешной проверки фиксировать строку:

```text
L1/L3 gate: mode=<...>, DS=<pass|fail>, root=<pass|n/a|fail>
```
