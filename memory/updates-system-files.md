# Обновление системных файлов: FPF, SPF, шаблон, CLAUDE.md, memory

> Когда: периодически или по необходимости. Перед работой с принципами — обновить FPF/SPF.

---

## 1. Шаблон экзокортекса (FMT / IWE)

**Источник:** репозиторий `TserenTserenov/FMT-exocortex-template` (манифест `update-manifest.json`), доставка через `update.sh` в **корне** экзокортекс-репо (рядом с `CLAUDE.md`).

**Текущая раскладка:** платформа лежит в корне `c:\Users\admin\IWE` — оттуда и запускать обновление.

```bash
cd /c/Users/admin/IWE
bash update.sh
# без интерактива:
bash update.sh --yes
# только превью:
bash update.sh --check
```

| Команда | Действие |
|---------|----------|
| `bash update.sh` | загрузка файлов по манифесту → применение изменений (с подтверждением, если не `--yes`) |
| `bash update.sh --check` | превью без записи |
| `bash update.sh --dry-run` | то же, что `--check` |

**Не трогается:** `memory/MEMORY.md` (личные РП), `DS-strategy/`, ваши `PACK-*`, кастом в `extensions/`.

> **Python:** шаг сравнения файлов парсит манифест через `python3`. В Git Bash на Windows путь `python3` часто указывает на заглушку Microsoft Store и **зависает**. Нужен нормальный Python в PATH (установка с python.org или WSL). Проверка: `python3 -c "import sys; print(sys.version)"` должна печатать версию, а не предложение установки из Store.

> **Bootstrap `update.sh`:** файл `.iwe-skip-update-sh-bootstrap` в корне отключает самообновление скрипта с GitHub ([0] в `update.sh`) — осознанный локальный режим.

> **После обновления:** новые файлы могут содержать `{{...}}` — `update.sh` не перезапускает `setup.sh`. Проверка плейсхолдеров: `grep -rE '{{[A-Z_]+}}' . --include='*.md' --include='*.sh'` из корня IWE (с осторожностью к ложным срабатываниям в тексте).

Старый вариант с вложенным репо `DS-exocortex` и путями `/mnt/c/.../DS-exocortex` **не используется** в текущей установке.

---

## 2. FPF (First Principles Framework)

**Обновляет:** репозиторий FPF (принципы, мета-онтология).

```bash
cd /c/Users/admin/IWE/Base/FPF
git pull
```

Справка: `memory/fpf-reference.md`.

---

## 3. SPF (Second Principles Framework)

**Обновляет:** репозиторий SPF (форма и процесс Pack, контракты).

```bash
cd /c/Users/admin/IWE/Base/SPF
git pull
```

Справка: `Base/SPF/CLAUDE.md`.

---

## 4. CLAUDE.md и memory (в рабочем пространстве)

- **Из шаблона:** после `update.sh` платформенные `memory/*.md` и `CLAUDE.md` обновляются в `c:\Users\admin\IWE` (и при необходимости дублируются инструментами Cursor/Claude в проектную память — см. свои правила среды).
- **Ручная подтяжка `CLAUDE.md`** (если `update.sh` недоступен): взять сырой файл с `https://raw.githubusercontent.com/TserenTserenov/FMT-exocortex-template/main/CLAUDE.md` и заменить локальный, сохранив при необходимости блок §9 «Авторское» из бэкапа.

---

## 5. DS-strategy (личные планы)

Не обновляется извне. Перед работой и на Close:

```bash
cd ~/Github/DS-strategy
git pull --rebase
```

---

## Порядок при полном обновлении

1. Экзокортекс: `cd /c/Users/admin/IWE && bash update.sh` (при рабочем `python3`, см. выше).
2. FPF: `cd /c/Users/admin/IWE/Base/FPF && git pull`.
3. SPF: `cd /c/Users/admin/IWE/Base/SPF && git pull`.
4. DS-strategy: `git pull --rebase` в каталоге клона `DS-strategy` (у вас может быть `c:\Users\admin\IWE\DS-strategy` или отдельный репо).

Backup на Close: `memory/ + CLAUDE.md → DS-strategy/exocortex/` (протокол Close).
