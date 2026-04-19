const fs = require('fs');

try {
  const input = fs.readFileSync(0, 'utf-8');
  const data = JSON.parse(input);
  const toolName = data.tool_name || '';
  const filePath = data.tool_input?.file_path || '';
  const skillName = data.tool_input?.skill || '';

  if (toolName === 'Read' && filePath.includes('protocol-')) {
    const protocolName = filePath.split(/[\\/]/).pop().replace('.md', '');
    console.log(JSON.stringify({
      additionalContext: `📝 ПРОТОКОЛ ЗАГРУЖЕН: ${protocolName}. ОБЯЗАТЕЛЬНО: (1) Выполни ВСЕ шаги алгоритма. (2) После завершения запусти /verify для верификации по чеклисту (Haiku R23). НЕ пропускай верификацию.`
    }));
  } else if (toolName === 'Skill' && /^(day-open|day-close|run-protocol|wp-new)$/.test(skillName)) {
    console.log(JSON.stringify({
      additionalContext: `📝 СКИЛЛ ЗАГРУЖЕН: ${skillName}. ОБЯЗАТЕЛЬНО: (1) Используй TodoWrite — создай таск-лист ВСЕХ шагов скилла ДО начала исполнения. (2) Выполни ВСЕ шаги последовательно, отмечая каждый. (3) После завершения запусти /verify (Haiku R23). НЕ пропускай шаги и верификацию.`
    }));
  } else {
    console.log(JSON.stringify({}));
  }
} catch (e) {
  console.log(JSON.stringify({}));
}