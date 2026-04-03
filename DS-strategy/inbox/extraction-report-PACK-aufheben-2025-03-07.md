# Extraction Report — PACK-aufheben

**Дата:** 2025-03-07  
**Целевой Pack:** PACK-aufheben (домен: Aufhebung, НЛ, диссертация)  
**Источник:** те же сессии, что и ретро-экстракт (agent-transcripts, в т.ч. [4dbaa4c1])  
**Префикс:** AUF

---

## Выполнено

Создан **PACK-aufheben** и заполнен экстрактом по домену снятия/ЭП/формальная–содержательная логика.

| # | Сущность | Файл | Тип |
|---|----------|------|-----|
| 1 | Корневой водораздел (формальная ≠ содержательная логика) | AUF.DISTINCTION.001-formal-vs-substantive-logic.md | distinction |
| 2 | Эпистемическое противоречие (ЭП) | AUF.ENTITY.001-epistemic-contradiction.md | entity |
| 3 | Релевантная логика | AUF.ENTITY.002-relevant-logic.md | entity |
| 4 | Локализация в паранепротиворечивой логике | AUF.ENTITY.003-paraconsistent-localization.md | entity |
| 5 | Три момента Aufhebung | AUF.METHOD.001-aufhebung-three-moments.md | method |
| 6 | FPF-линзы для рефлексии по диссертации | AUF.METHOD.002-fpf-lenses-dissertation.md | method |

**Структура Pack:**
- `REPO-TYPE.md` — тип Pack, домен, префикс AUF
- `00-pack-manifest.md` — границы и именование
- 6 карточек с перекрёстными ссылками (related) внутри Pack

---

## Рекомендация

Добавить в `FMT-exocortex-template/roles/extractor/config/routing.md`:

```markdown
| Домен (Aufhebung, НЛ, ЭП, диссертация) | PACK-aufheben | AUF | c:\Users\admin\IWE\PACK\PACK-aufheben\ |
```

Тогда при следующих экстракциях кандидаты по этой области будут маршрутизироваться в PACK-aufheben автоматически.
