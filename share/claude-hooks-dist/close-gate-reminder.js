const fs = require('fs');

try {
  const input = fs.readFileSync(0, 'utf-8');
  const data = JSON.parse(input);
  const prompt = (data.prompt || '').toLowerCase();

  if (prompt.match(/(итоги дня|закрываю день|закрывай день)/)) {
    console.log(JSON.stringify({
      additionalContext: "⛔ БЛОКИРУЮЩЕЕ: Day Close выполняется ТОЛЬКО через skill /run-protocol с аргументом 'day-close'. ПЕРВОЕ И ЕДИНСТВЕННОЕ действие = вызвать Skill tool: skill='run-protocol', args='day-close'. НЕ читать protocol-close.md вручную. НЕ выполнять шаги самостоятельно. НЕ писать итоги без /run-protocol. Причина: 5 инцидентов пропуска шагов при ручном исполнении (15, 18, 19, 27 мар). /run-protocol гарантирует пошаговый TodoList + верификацию Haiku R23."
    }));
  } else if (prompt.match(/(закрывай|закрываю|заливай|запуши|закрывай сессию)/)) {
    console.log(JSON.stringify({
      additionalContext: "⛔ БЛОКИРУЮЩЕЕ: Session Close выполняется ТОЛЬКО через skill /run-protocol с аргументом 'close'. ПЕРВОЕ И ЕДИНСТВЕННОЕ действие = вызвать Skill tool: skill='run-protocol', args='close'. НЕ выполнять шаги самостоятельно. /run-protocol гарантирует пошаговый TodoList + верификацию."
    }));
  } else {
    console.log(JSON.stringify({}));
  }
} catch (e) {
  console.log(JSON.stringify({}));
}