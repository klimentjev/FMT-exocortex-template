const fs = require('fs');
const child_process = require('child_process');
const path = require('path');

try {
  const input = fs.readFileSync(0, 'utf-8');
  const data = JSON.parse(input);
  const cwd = data.cwd || '';
  const event = data.hook_event_name || '';
  const tool = data.tool_name || '';

  let project = 'Unknown';
  if (cwd) {
    project = path.basename(cwd);
  }

  let category = 'ai coding';
  if (event === 'PostToolUse') {
    if (['WebSearch', 'WebFetch'].includes(tool)) category = 'researching';
    else if (['Read', 'Grep', 'Glob'].includes(tool)) category = 'code reviewing';
    else if (['Edit', 'Write'].includes(tool)) category = 'coding';
  }

  // Запуск WakaTime в фоне (fire and forget)
  // На Windows путь к wakatime-cli обычно в %USERPROFILE%\.wakatime\wakatime-cli\wakatime-cli.exe
  const home = process.env.USERPROFILE || process.env.HOME;
  const wakatimePath = path.join(home, '.wakatime', 'wakatime-cli', 'wakatime-cli.exe');
  
  if (fs.existsSync(wakatimePath)) {
    child_process.spawn(wakatimePath, [
      '--entity-type', 'app',
      '--entity', 'Claude Code',
      '--category', category,
      '--project', project,
      '--plugin', 'claude-code-wakatime/0.1.0',
      '--write'
    ], {
      detached: true,
      stdio: 'ignore'
    }).unref();
  }

  console.log(JSON.stringify({}));
} catch (e) {
  console.log(JSON.stringify({}));
}