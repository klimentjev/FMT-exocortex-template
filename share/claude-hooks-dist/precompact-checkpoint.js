const fs = require('fs');

try {
  const input = fs.readFileSync(0, 'utf-8');
  const data = JSON.parse(input);
  const cwd = data.cwd || process.cwd();

  console.log(JSON.stringify({
    additionalContext: "⚠️ PRECOMPACT: Контекст будет сжат. Перед продолжением прочитай .claude/checkpoint.md если он есть. Запиши в него: (1) Над каким РП работаешь, (2) Что осталось сделать, (3) Какой протокол выполняешь и на каком шаге, (4) Незавершённые шаги протокола (включая верификацию)."
  }));
} catch (e) {
  console.log(JSON.stringify({}));
}