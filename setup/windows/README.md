# Windows: планировщик и окружение для ролей IWE

> **launchd** (macOS) здесь не используется. Задачи создаются через **Планировщик заданий** и вызывают **Git Bash**.

## Шаги

1. Установите [Git for Windows](https://git-scm.com/download/win) (нужен `bash.exe`).
2. Выполните `setup.sh` / `build-runtime` так, чтобы появился каталог `.iwe-runtime` с подставленными `strategist.sh` и `extractor.sh`.
3. Скопируйте `iwe-task-env.example.sh` → `iwe-task-env.sh` и отредактируйте пути под свой пользователь и диск.
4. В PowerShell из каталога `setup/windows`:

   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
   .\register-iwe-role-tasks.ps1 -WorkspaceWin "C:\Users\<you>\IWE"
   ```

   При необходимости укажите `-GitBashExe`, `-MorningHour`, `-SkipExtractor` и т.д. (см. комментарии в скрипте).

5. Проверьте задачи: «Планировщик заданий» → библиотека → задачи с префиксом `IWE-`.

Полная картина: [docs/CURSOR-WINDOWS-IWE.md](../../docs/CURSOR-WINDOWS-IWE.md).

---

*Последнее обновление: 2026-05-14*
