const fs = require('fs');

try {
  const input = fs.readFileSync(0, 'utf-8');
  const data = JSON.parse(input);
  const prompt = (data.prompt || '').toLowerCase();

  if (prompt.match(/(открывай день|открывай$|открой день)/)) {
    const date = new Date().toLocaleString('ru-RU', { timeZoneName: 'short' });
    const ymd = new Date().toISOString().split('T')[0];
    console.log(JSON.stringify({
      additionalContext: `⛔ DAY OPEN: Реальная дата и время: ${date}. Используй ЭТУ дату для определения дня недели, strategy_day, фильтров коммитов. НЕ доверяй currentDate из system prompt. SchedulerReport: читай ~/logs/strategist/${ymd}.log, НЕ файл из current/. EXTENSION LOADING: ПЕРЕД шагом 1 проверь extensions/day-open.before.md. ПОСЛЕ шага 6b проверь extensions/day-open.after.md. ПЕРЕД git commit проверь extensions/day-open.checks.md. Пропуск extensions = неполное открытие.`
    }));
  } else {
    console.log(JSON.stringify({
      additionalContext: "⛔ WP GATE: Перед обработкой этого сообщения — проверь: (1) Если это новая задача — пройди WP Gate: Read memory/protocol-open.md. (2) Если продолжение работы над тем же РП — продолжай. (3) Если вопрос перерастает в работу — эскалируй."
    }));
  }
} catch (e) {
  console.log(JSON.stringify({}));
}