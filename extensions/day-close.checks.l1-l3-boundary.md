# Day Close — L1/L3 boundary gate

На закрытии дня проверить, что staged-изменения соответствуют режиму дня и не смешивают L1/L3.

Опора выбора режима: `DS-strategy/exocortex/l1-l3-mode-runbook.md`.  
Шаблоны записи: `DS-strategy/exocortex/templates-dayplan.md` и `DS-strategy/exocortex/templates-weekreport.md`.

## Шаги

1. Определи режим дня:
   - если день был обычный (личная операционная работа) -> `l3-default`;
   - если был день сопровождения платформы -> `l1-maintenance`;
   - если заранее согласовано смешение слоёв -> `mixed-approved`.

2. Запусти проверку для `DS-strategy`:

```powershell
powershell -ExecutionPolicy Bypass -File "DS-strategy/exocortex/l1-l3-boundary-check.ps1" -Mode <mode> -Scope staged -RepoPath "DS-strategy"
```

3. Если были staged-изменения в корне `IWE` вне `DS-strategy`, запусти проверку для корня:

```powershell
powershell -ExecutionPolicy Bypass -File "DS-strategy/exocortex/l1-l3-boundary-check.ps1" -Mode <mode> -Scope staged -RepoPath "."
```

4. При нарушении границы:
   - остановить закрытие;
   - развести набор изменений по слоям;
   - повторить проверку до прохождения.

## Запись в итоги дня (обязательно)

Добавь в Day Close блок:

```text
L1/L3 gate:
- mode: <l3-default|l1-maintenance|mixed-approved>
- DS-strategy check: <pass|fail>
- root check (if needed): <pass|n/a|fail>
- decision note: <why this mode was selected in one sentence>
```

Если была ошибка и исправление, допиши:

```text
L1/L3 gate fix:
- issue: <what violated boundary>
- action: <how changes were split/switch approved>
- re-check: <pass|fail>
```

## WeekReport (обязательно)

В блок `Итоги <день>` текущего `WeekReport` добавить строку:

```text
L1/L3 gate: mode=<...>, DS=<pass|fail>, root=<pass|n/a|fail>, note=<one sentence>
```

Если было нарушение и исправление, добавить:

```text
L1/L3 gate fix: issue=<...>, action=<...>, re-check=<pass|fail>
```
