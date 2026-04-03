# Base — Sync Log

## Синхронизация FPF/SPF/ZP

> Журнал синхронизаций с upstream (ailev/FPF). Обновляется еженедельно при week-close.

### 2026-04-03 (сегодня)

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
cd /mnt/c/Users/admin/IWE/Base/FPF
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

*Last updated: 2026-04-03*
