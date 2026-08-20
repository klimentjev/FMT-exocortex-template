# Base — Sync Log

## Синхронизация FPF/SPF/ZP

> Журнал синхронизаций с upstream (ailev/FPF). Обновляется еженедельно при week-close.

### 2026-08-19

**Действие:** Синхронизация `Base/FPF` с `origin/main` (ailev/FPF, А. Левинчук).

**FPF версия:** 20260816 (commit `3d09862`, 2026-08-16)
- Последний коммит: «C.17 rewrited».
- Подтянуто 12 коммитов с `8b727cb` (журнал с 2026-08-04; локально часть уже была на `b7ec5a0` без записи).

**Ключевые изменения upstream:**
- C.17 rewrite (Characterising Generative Novelty and Value)
- ontological refactoring of relations (22 patterns + next batch)
- role now SystemRole (`U.SystemRoleAssignment`, local system-role kind)
- less of wrong agency like "governed patterns"
- E.4.PFAD / E.4.DPF / E.18.1 correction

**Побочные обновления:** `Base/FPF-VERSION.txt`, `memory/fpf-reference.md` (якорь SHA), `memory/fpf-term-map.yaml`.

**SPF:** уже актуален (`de4590c`, без изменений). **ZP:** не трогали.

---

### 2026-08-04

**Действие:** Синхронизация `Base/FPF` с `origin/main` (ailev/FPF, А. Левинчук).

**FPF версия:** 20260804 (commit `8b727cb`, 2026-08-04)
- Последний коммит: «A.6.3.CSC language repairing».
- Подтянуто 5 коммитов с `373c879` (measurement relations correction).

**Ключевые изменения upstream:**
- A.6.3.CSC language repairing
- relation ontological adjustments
- process relations adjustment
- architectural patterns ontological adjustment
- problem relation

**Побочные обновления:** `Base/FPF-VERSION.txt`, `memory/fpf-reference.md` (якорь SHA).

**SPF:** уже актуален (`6a9d637`, без изменений). **ZP:** не трогали.

---

### 2026-07-04

**Действие:** Синхронизация `Base/FPF` с `origin/main` (ailev/FPF, А. Левинчук).

**FPF версия:** 20260704 (commit `f7c7e93`, 2026-07-04)
- Последний коммит: «non-holonic roles, holonic methods».
- Подтянуто 6 коммитов с `02a8b4b` (2026-06-26).

**Ключевые изменения upstream:**
- non-holonic roles, holonic methods
- «carrier» word-using precision restoration
- carrier word-using precision restoration
- first publication of narrativization DPF
- rendering remark and E.4.FPF mention
- Structure-to-Narrative Rendering and PDF format

**Побочные обновления:** `Base/FPF-VERSION.txt`, `memory/fpf-reference.md`.

**SPF / ZP:** без изменений.

---

### 2026-06-28

**Действие:** Синхронизация `Base/FPF` с `origin/main` (ailev/FPF, А. Левинчук).

**FPF версия:** 20260626 (commit `02a8b4b`, 2026-06-26)
- Последний коммит: «loop-engineering harmonization».
- Подтянуто 11 коммитов с `fe0df9d` (2026-06-21).

**Ключевые изменения upstream:**
- NQD OEE flows and cultural evolution
- MOVE precision restoration, move disambiguation full corpus scan
- Architecture synthesis campaign, PAD/ADR/ADA (architectural decision)
- P2S architecturing transformation flow
- Structural information adequacy (epiplexity)
- FPF ecosystem architecture (E.4 cluster)
- Readme and preface amendments
- Loop-engineering harmonization

**Побочные обновления:** `Base/FPF-VERSION.txt`, `memory/fpf-reference.md`.

**SPF / ZP:** без изменений.

---

### 2026-06-21

**Действие:** Синхронизация `Base/FPF` с `origin/main` (ailev/FPF, А. Левинчук).

**FPF версия:** 20260621 (commit `fe0df9d`, 2026-06-21)
- Последний коммит: «holons and meta-holon transition normalization».
- Подтянуто 39 коммитов с `136be3b` (2026-05-10).
- Локальный коммит `a2bd85a` (ручной sync May 2026) и незакоммиченные правки `FPF-Spec.md` сброшены через `git reset --hard origin/main` для соответствия официальной линии.

**Ключевые изменения upstream:**
- Онтическая миграция: `entityOfConcernRef`, I/D/S elimination, role/method ontic refactoring
- Новые/обновлённые паттерны: C.29 (mathematical lens adequacy), C.30 (grounded architecture), C.22.2 (ProblemCard@Context), E.24 (ontic), E.18.1 (P2W), E.21, F.19
- SEMIO-кампании (E.10.SEMIO), quality loop, anti-Goodhart (E.13)
- Обновлён Readme.md (June 2026, first practical entries)

**Побочные обновления:** `Base/FPF-VERSION.txt`, `memory/fpf-reference.md`.

**SPF / ZP:** без изменений.

---

### 2026-05-12

**Действие:** Синхронизация `Base/FPF` с `origin/main` (ailev/FPF, А. Левинчук).

**FPF версия:** 20260510 (commit `136be3b`, 2026-05-10)
- Последний коммит: «A.6.P terminology cleanup»; также подтянут `1f7c9e5` («authority-looking reliance tuning»).
- Локальная ветка расходилась с upstream (локально был коммит `8ce4b36` dissertation subset); для соответствия официальной линии выполнен `git reset --hard origin/main`.

**Побочные обновления:** `Base/FPF-VERSION.txt`, `memory/fpf-reference.md` (якорь C.28, путь к `FPF-Spec.md`, размер файла).

**SPF / ZP:** без изменений.

---

### 2026-04-03

**Действие:** Переименование `Principles/` → `Base/` (РП 7)

**FPF версия:** 20260319 (commit a25a0a7, 2026-03-19)
- Последний коммит: "surface precision restoration (semio)"
- Синхронизирован: ✅
- Статус: Актуален

**SPF версия:** локально поддерживается
**ZP версия:** локально поддерживается

**Действия:**
- [x] Переименовано Principles/ → Base/
- [x] Обновлены пути в Base/SPF/CLAUDE.md
- [x] Обновлена memory/fpf-reference.md
- [x] Создан FPF-VERSION.txt
- [x] Создан SYNC-LOG.md

**Следующая синхронизация:** 2026-04-10 (при week-close W14)

---

## Процедура синхронизации FPF

**Когда:** Еженедельно при week-close (пятница) или при необходимости.

**Как:**
```bash
cd "$IWE_WORKSPACE/Base/FPF"   # or: cd Base/FPF from IWE root
git pull origin main
```

**Проверка обновлений:**
```bash
git log --oneline -5
```

**При breaking changes в FPF:**
1. Прочитать коммиты (что изменилось)
2. Обновить FPF-VERSION.txt
3. Проверить, нарушена ли структура Base/SPF/ или Base/ZP/
4. Обновить `memory/fpf-reference.md` если нужно
5. Создать коммит: "chore: sync FPF to {COMMIT}"

---

## Troubleshooting

**Q: FPF субмодуль не обновляется?**
A: Проверьте, что репо инициализирован как submodule или cloned repo. Если забыли — см. MIGRATION.md.

**Q: Конфликт при pull FPF?**
A: FPF — read-only копия. Конфликтов быть не должно. Если возникли — напишите сообщение об ошибке.

---

*Last updated: 2026-06-28*
