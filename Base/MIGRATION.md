# Base — Migration & Versioning

## Миграция при breaking changes FPF

> Когда Левенчук обновит структуру FPF-Spec.md кардинально, следуйте этому процессу.

### Сценарий 1: Добавлены новые Part-ы (например, Part H)

1. **Обновить FPF:**
   ```bash
   cd Base/FPF && git pull
   ```

2. **Обновить memory/fpf-reference.md:**
   - Добавить новый Part в таблицу структуры FPF
   - Добавить в таблицу "когда нужно"

3. **Проверить Base/SPF/ и Base/ZP/:**
   - Нарушена ли структура Pack-template?
   - Нарушены ли ссылки (A.*, B.*, Part G)?

4. **Обновить Base/SYNC-LOG.md:**
   - Добавить запись о breaking change
   - Описать что изменилось

5. **Коммит:**
   ```bash
   git add FPF-VERSION.txt SYNC-LOG.md memory/fpf-reference.md
   git commit -m "chore: sync FPF breaking change — added Part H"
   ```

### Сценарий 2: Перенумерация кодов (например, A.7 → A.8)

1. **Обновить FPF** (как выше)

2. **Grep по всем файлам:**
   ```bash
   grep -r "A.7" Base/SPF/ memory/
   ```

3. **Обновить все ссылки:**
   - Base/SPF/pack-template/
   - Base/SPF/process/
   - Base/SPF/spec/
   - memory/fpf-reference.md
   - memory/hard-distinctions.md (если есть)

4. **Коммит:**
   ```bash
   git add Base/SPF/ memory/ FPF-VERSION.txt SYNC-LOG.md
   git commit -m "chore: migrate FPF code references A.7 → A.8"
   ```

### Сценарий 3: Изменена структура Part (например, Part B разделена)

1. **Прочитать FPF коммиты:**
   ```bash
   cd Base/FPF && git log --oneline origin/main HEAD..
   ```

2. **Понять новую структуру** (может потребоваться обсуждение с Левенчуком)

3. **Обновить memory/fpf-reference.md§3 (таблица структуры)**

4. **Проверить все ссылки** (как в Сценарий 2)

5. **Коммит:** `"chore: migrate FPF Part B restructure"`

---

## Процедура обновления версии FPF

**При каждой синхронизации:**

1. Запустить в Base/FPF:
   ```bash
   git log --format="%h %ai %s" -1
   ```

2. Обновить Base/FPF-VERSION.txt:
   ```
   FPF-VERSION: 20YYMMDD
   COMMIT: {HASH}
   DATE: YYYY-MM-DD
   SYNC-DATE: {today}
   ```

3. Добавить запись в Base/SYNC-LOG.md:
   ```
   ### YYYY-MM-DD
   **FPF версия:** 20YYMMDD (commit {HASH})
   **Изменения:** [description or "no changes"]
   ```

4. Коммит:
   ```bash
   git commit -m "chore: sync FPF to {HASH}"
   ```

---

## Rollback процедура

Если что-то сломалось после обновления FPF:

```bash
# 1. Вернуться к предыдущей версии FPF
cd Base/FPF
git log --oneline -10
git checkout {PREVIOUS_COMMIT}

# 2. Обновить FPF-VERSION.txt
# 3. Коммит: "chore: rollback FPF to {COMMIT}"

cd ../..
git add Base/FPF-VERSION.txt Base/FPF
git commit -m "chore: rollback FPF to {COMMIT} — issue: {description}"
```

---

*Created: 2026-04-03*
