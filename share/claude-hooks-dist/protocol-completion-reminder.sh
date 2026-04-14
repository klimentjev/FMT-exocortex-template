#!/bin/bash
# Protocol Completion Reminder Hook
# Event: PostToolUse (matcher: Read | Skill)
# Ф2 WP-229: расширен на Skill tool (day-open, day-close, run-protocol, wp-new)
# После чтения протокола или вызова скилла напоминает: выполни ВСЕ шаги.
# Read-only: только возвращает JSON.

INPUT=$(cat)
TOOL=$(echo "$INPUT" | node -e "try { console.log(JSON.parse(require('fs').readFileSync(0, 'utf-8')).tool_name || ''); } catch(e) {}")
FILE_PATH=$(echo "$INPUT" | node -e "try { console.log(JSON.parse(require('fs').readFileSync(0, 'utf-8')).tool_input?.file_path || ''); } catch(e) {}")
SKILL_NAME=$(echo "$INPUT" | node -e "try { console.log(JSON.parse(require('fs').readFileSync(0, 'utf-8')).tool_input?.skill || ''); } catch(e) {}")

# Срабатываем на чтение протоколов (Read protocol-*.md)
if [ "$TOOL" = "Read" ] && echo "$FILE_PATH" | grep -q "protocol-"; then
  PROTOCOL_NAME=$(basename "$FILE_PATH" .md)
  cat <<EOF
{"additionalContext": "📝 ПРОТОКОЛ ЗАГРУЖЕН: $PROTOCOL_NAME. ОБЯЗАТЕЛЬНО: (1) Выполни ВСЕ шаги алгоритма. (2) После завершения запусти /verify для верификации по чеклисту (Haiku R23). НЕ пропускай верификацию."}
EOF

# Срабатываем на вызов протокольных скиллов (Skill tool)
elif [ "$TOOL" = "Skill" ] && echo "$SKILL_NAME" | grep -qE '^(day-open|day-close|run-protocol|wp-new)$'; then
  cat <<EOF
{"additionalContext": "📝 СКИЛЛ ЗАГРУЖЕН: $SKILL_NAME. ОБЯЗАТЕЛЬНО: (1) Используй TodoWrite — создай таск-лист ВСЕХ шагов скилла ДО начала исполнения. (2) Выполни ВСЕ шаги последовательно, отмечая каждый. (3) После завершения запусти /verify (Haiku R23). НЕ пропускай шаги и верификацию."}
EOF

else
  echo '{}'
fi
exit 0
