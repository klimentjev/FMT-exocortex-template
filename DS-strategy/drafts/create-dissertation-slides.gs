/**
 * Презентация отчёта по диссертации (январь — март 2026)
 * ИНСТРУКЦИЯ:
 * 1. script.google.com → Новый проект → вставить этот код
 * 2. Выбрать функцию createPresentation → ▶ Выполнить → дать разрешение
 * 3. Ссылка на презентацию — в логах (Вид → Логи)
 *
 * Слайд Google Slides = 720 x 405 pt. Поля: ML=18, MR=18, CW=684
 */

var W   = 720;
var H   = 405;
var ML  = 18;
var MR  = 18;
var CW  = W - ML - MR;

var BG    = '#1a1a2e';
var BG2   = '#16213e';
var WHITE = '#ffffff';
var GOLD  = '#e2b96f';
var CYAN  = '#4fc3f7';
var GREEN = '#81c784';
var RED   = '#e57373';
var GREY  = '#9999bb';

function createPresentation() {
  var prs = SlidesApp.create('Отчёт по диссертации. Март 2026');

  slide1_title(prs.getSlides()[0]);
  slide2_about(_addSlide(prs));
  slide3_target(_addSlide(prs));
  slide4_22jan(_addSlide(prs));
  slide5_feb_ep(_addSlide(prs));
  slide6_path(_addSlide(prs));
  slide7_examples(_addSlide(prs));
  slide8_watershed(_addSlide(prs));
  slide9_four(_addSlide(prs));
  slide10_perspectives(_addSlide(prs));
  slide11_conclusion(_addSlide(prs));

  Logger.log('Готово: ' + prs.getUrl());
}

// ── СЛАЙД 1: Титульный ─────────────────────────────────
function slide1_title(s) {
  _bg(s, BG);
  _rect(s, 0, 0, W, H, BG);
  _rect(s, ML, 90, CW, 3, GOLD);

  _t(s, 'ОТЧЁТ О РАБОТЕ ПО ДИССЕРТАЦИИ', ML, 28, CW, 55,
    {sz:26, bold:true, color:GOLD, align:'CENTER'});
  _t(s, 'Январь — начало марта 2026', ML, 100, CW, 32,
    {sz:18, color:WHITE, align:'CENTER'});
  _t(s, 'Владимир Климентьев · 7 марта 2026', ML, 138, CW, 26,
    {sz:13, color:GREY, align:'CENTER'});

  _rect(s, ML, 180, CW, 3, GOLD);
  _t(s, '«Туман не может держаться бесконечно, если жечь костёр познания.»', ML, 194, CW, 28,
    {sz:12, italic:true, color:WHITE, align:'CENTER'});
  _t(s, '— из рабочего журнала, 22 января 2026', ML, 224, CW, 22,
    {sz:11, color:GREY, align:'CENTER'});
  _t(s, '7 марта 2026', ML, 370, CW, 22, {sz:11, color:GREY, align:'CENTER'});
}

// ── СЛАЙД 2: О чём отчёт ───────────────────────────────
function slide2_about(s) {
  _bg(s, BG);
  _title(s, 'О чём отчёт');

  _t(s, 'Период: январь — начало марта 2026', ML, 58, CW, 22, {sz:13, bold:true, color:CYAN});
  _rect(s, ML, 84, CW, 72, BG2);
  _t(s,
    '«Туман не может держаться бесконечно, если жечь костёр познания.»\n' +
    '— из рабочего журнала, 22 января 2026',
    ML+8, 90, CW-16, 60, {sz:12, italic:true, color:WHITE});
  _t(s, 'Содержание:', ML, 168, CW, 22, {sz:13, bold:true, color:CYAN});
  _t(s,
    'процесс → ключевые находки (ЭП, корневой водораздел) → перспективы → итог',
    ML, 192, CW, 44, {sz:12, color:WHITE});
}

// ── СЛАЙД 3: Целевой результат ───────────────────────────
function slide3_target(s) {
  _bg(s, BG);
  _title(s, 'Целевой результат диссертации');

  _t(s, 'Нормативно-методологическая модель Aufhebung:', ML, 58, CW, 22,
    {sz:12, bold:true, color:CYAN});
  _rect(s, ML, 82, CW, 68, '#0d1b2a');
  _t(s,
    'воспроизводимая логико-познавательная процедура разрешения противоречий:\n' +
    '• структура\n• этапы\n• условия применимости\n• критерии корректности результата',
    ML+8, 88, CW-16, 56, {sz:12, color:WHITE});
  _t(s, 'Почему формулировка устойчива:', ML, 158, CW, 22,
    {sz:12, bold:true, color:CYAN});
  _t(s,
    'объект (метод Aufhebung), тип результата (модель), область (противоречия), критерии проверки — всё задано.',
    ML, 182, CW, 52, {sz:12, color:WHITE});
}

// ── СЛАЙД 4: Перелом 22 января ──────────────────────────
function slide4_22jan(s) {
  _bg(s, BG);
  _title(s, 'Перелом: 22 января');

  _t(s, 'Сдвиг фокуса (журнал):', ML, 58, CW, 20, {sz:12, bold:true, color:CYAN});
  _rect(s, ML, 80, CW, 56, BG2);
  _t(s,
    '"В прошлой версии фокус был на описании «что это». В новой — на процедуре получения: что делать, чтобы получить это?"',
    ML+8, 86, CW-16, 44, {sz:12, italic:true, color:WHITE});
  _t(s, 'Следствие:', ML, 146, CW, 22, {sz:13, bold:true, color:CYAN});
  _t(s,
    '• Было: герменевтический проект («что имел в виду Гегель»)\n' +
    '• Стало: методический («как воспроизвести метод как строгую процедуру»)\n' +
    '• Переход от описательного режима к нормативному',
    ML, 170, CW, 78, {sz:12, color:WHITE});
}

// ── СЛАЙД 5: Февраль — ЭП ───────────────────────────────
function slide5_feb_ep(s) {
  _bg(s, BG);
  _title(s, 'Февраль: центральный объект — ЭП');

  _t(s, '2 февраля — в цепочке научных результатов появился эпистемическое противоречие.', ML, 58, CW, 40, {sz:12, color:WHITE});
  _t(s, 'Первый заход: противоречия в суждениях → конфликт с принципом взрыва (ex contradictione quodlibet).', ML, 102, CW, 36, {sz:11, color:GREY});
  _t(s, 'Ключевое открытие:', ML, 146, CW, 22, {sz:13, bold:true, color:CYAN});
  _rect(s, ML, 170, CW, 88, '#0e2a0e');
  _t(s,
    'ЭП — это НЕ одновременное утверждение P и ¬P об одном субъекте суждения.\n\n' +
    'ЭП — это два разных ОПРЕДЕЛЕНИЯ одного объекта познания.\n\n' +
    'Предмет метода — отношение между дефинициями, а не между пропозициями.',
    ML+8, 178, CW-16, 72, {sz:12, color:WHITE});
  _rect(s, ML, 268, CW, 3, GOLD);
  _t(s, '→ Предмет приложения Aufhebung: определения, не суждения.', ML, 276, CW, 26, {sz:13, bold:true, color:GOLD});
}

// ── СЛАЙД 6: Путь к определению ЭП ──────────────────────
function slide6_path(s) {
  _bg(s, BG);
  _title(s, 'Путь к определению ЭП');

  _t(s, 'Переключение на уровень определений:', ML, 58, CW, 20, {sz:12, bold:true, color:CYAN});
  _t(s,
    '• Атрибутивно-реляционные родо-видовые дефиниции\n' +
    '• В них: Den, Dfd, Dfn → в дефиниенсе: Ext, Int (род IntG, признаки IntV₁, IntV₂...)\n' +
    '• Сравнение Dfn₁ и Dfn₂ при одном Dfd, Den, контексте С → эквивалентность → комплементарность → противоречие',
    ML, 80, CW, 72, {sz:11, color:WHITE});
  _t(s, 'Определение ЭП (25.02):', ML, 158, CW, 20, {sz:12, bold:true, color:CYAN});
  _rect(s, ML, 180, CW, 88, '#0d1b2a');
  _t(s,
    'Логико-семантическое отношение между двумя эксплицитными родо-видовыми сущностными дефинициями одного и того же предмета, при котором их интенсиональные структуры содержат взаимоисключающие сущностные предикаты при сохранении идентичности денотата.',
    ML+8, 188, CW-16, 72, {sz:11, color:WHITE});
}

// ── СЛАЙД 7: Примеры трёх отношений ─────────────────────
function slide7_examples(s) {
  _bg(s, BG);
  _title(s, 'Примеры трёх отношений');

  var rows = [
    ['Отношение', 'Пример'],
    ['Эквивалентность', '«Человек — животное с разумом» / «Человек — разумное животное» — один интенсионал'],
    ['Комплементарность', '«Вода — масса 18 а.е.м.» / «Вода — кипит при 100°C» — разные предикаты, один денотат'],
    ['Противоречие (а)', '«Человек по природе добр» / «по природе зол» — противоположные предикаты'],
    ['Противоречие (б)', '«Сущность задана» / «Существование предшествует сущности» — противоречие определений'],
  ];
  _table(s, rows, ML, 58, CW, 200);
  _rect(s, ML, 268, CW, 3, GOLD);
  _t(s, 'ЭП — отношение между дефинициями; предмет анализа и снятия — определения.', ML, 276, CW, 36, {sz:12, bold:true, color:GOLD});
}

// ── СЛАЙД 8: Корневой водораздел ────────────────────────
function slide8_watershed(s) {
  _bg(s, BG);
  _title(s, 'Корневой водораздел');

  _t(s, 'Центральная ось научной работы:', ML, 58, CW, 22, {sz:13, bold:true, color:CYAN});
  _rect(s, ML, 82, CW, 36, BG2);
  _t(s, 'Показать возможности и ограничения формальной и содержательной логик для познания.', ML+8, 88, CW-16, 24, {sz:12, italic:true, color:GOLD});
  _t(s, 'Формальная логика:', ML, 126, CW, 20, {sz:12, bold:true, color:CYAN});
  _t(s, 'истинностные значения высказываний; безупречна в своей области.', ML, 148, CW, 36, {sz:12, color:WHITE});
  _t(s, 'Содержательная (диалектическая):', ML, 188, CW, 20, {sz:12, bold:true, color:CYAN});
  _t(s, 'движение понятий, противоречие как источник развития; там, где формальная умолкает или даёт ложные тревоги.', ML, 210, CW, 40, {sz:12, color:WHITE});
  _rect(s, ML, 258, CW, 3, GOLD);
  _t(s, 'Диссертация картографирует ГРАНИЦУ между ними. Aufhebung — процедура на этой границе.', ML, 266, CW, 44, {sz:13, bold:true, color:GOLD});
}

// ── СЛАЙД 9: Четыре прорыва ──────────────────────────────
function slide9_four(s) {
  _bg(s, BG);
  _title(s, 'Четыре прорыва');

  var items = [
    '1. Нормативная реконструкция = спецификация, не описание. «Как воспроизвести?»; инженерные критерии.',
    '2. ЭП — специфический объект. Два несовместимых определения при одном предмете; нужен Aufhebung: поднять оба в понятие выше.',
    '3. Три момента Aufhebung = критерии корректности. Отрицание, сохранение/вычленение, возведение; отсутствие одного → не снятие.',
    '4. Aufhebung в НЛ — структурный принцип. Три формы: переход (Бытие), рефлексия (Сущность), развитие (Понятие) = три типа ЭП.',
  ];
  var y = 58;
  items.forEach(function(txt) {
    _rect(s, ML, y, CW, 52, BG2);
    _t(s, txt, ML+8, y+10, CW-16, 34, {sz:11, color:WHITE});
    y += 58;
  });
}

// ── СЛАЙД 10: Март и перспективы ─────────────────────────
function slide10_perspectives(s) {
  _bg(s, BG);
  _title(s, 'Март и перспективы');

  _t(s, 'Сейчас: дедлайн «доклад до февраля» прошёл без текста; есть понимание, что писать.', ML, 58, CW, 40, {sz:12, color:WHITE});
  _t(s, 'Ближайший рубеж:', ML, 106, CW, 22, {sz:13, bold:true, color:CYAN});
  _t(s, 'Доклад «Философия как логика снятия: нормативная реконструкция мыслительной процедуры» — статья до 16 апреля.', ML, 128, CW, 28, {sz:12, color:GOLD});
  _t(s, 'До июня: структура диссертации. Ось — корневой водораздел. Главы: I Кризис и ЭП; II Три формы; III Нормативная модель; IV Методика.', ML, 162, CW, 52, {sz:11, color:WHITE});
  _t(s, 'До конца 2026: подготовка к защите (октябрь–декабрь). Условие: нагрузка не должна поглощать время диссертации.', ML, 220, CW, 44, {sz:12, color:WHITE});
}

// ── СЛАЙД 11: Итог и диагноз ────────────────────────────
function slide11_conclusion(s) {
  _bg(s, BG);
  _rect(s, 0, 0, W, H, BG);
  _t(s, 'ИТОГ И ДИАГНОЗ', ML, 18, CW, 38, {sz:28, bold:true, color:GOLD, align:'CENTER'});
  _rect(s, ML, 58, CW, 3, GOLD);

  _t(s, 'Три результата месяца:', ML, 68, CW, 24, {sz:13, bold:true, color:CYAN});
  var results = [
    '① Предмет стабилизирован — впервые за два года без желания переформулировать',
    '② Ключевой концепт определён строго — ЭП с рабочим определением',
    '③ Тип задачи изменился — от описания к спецификации («что это» → «как воспроизвести»)',
  ];
  results.forEach(function(r, i) {
    _rect(s, ML, 96 + i * 52, CW, 44, BG2);
    _t(s, r, ML+8, 106 + i * 52, CW-16, 24, {sz:12, color:WHITE});
  });

  _rect(s, ML, 262, CW, 3, GOLD);
  _t(s, 'Диагноз: концептуально — месяц продуктивный. Текстово — работа не начата.', ML, 272, CW, 28, {sz:13, bold:true, color:WHITE});
  _t(s, 'Апрель — переход от мышления О диссертации к её ТЕКСТУ.', ML, 304, CW, 32, {sz:14, bold:true, color:GOLD});
}

// ── УТИЛИТЫ ──────────────────────────────────────────────
function _addSlide(prs) {
  var s = prs.appendSlide();
  _bg(s, BG);
  return s;
}

function _bg(slide, hex) {
  slide.getBackground().setSolidFill(hex);
}

function _title(slide, text) {
  _t(slide, text, ML, 10, CW, 36, {sz:18, bold:true, color:GOLD});
  _rect(slide, ML, 48, CW, 2, GOLD);
}

function _t(slide, text, x, y, w, h, opts) {
  var box = slide.insertTextBox(text, x, y, w, h);
  var ts  = box.getText().getTextStyle();
  ts.setFontFamily('Roboto');
  ts.setFontSize(opts.sz || 12);
  ts.setBold(opts.bold || false);
  ts.setItalic(opts.italic || false);
  ts.setForegroundColor(opts.color || WHITE);
  if (opts.align === 'CENTER') {
    box.getText().getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  }
  box.getFill().setTransparent();
  box.getBorder().setTransparent();
  return box;
}

function _rect(slide, x, y, w, h, color) {
  var r = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, x, y, w, h);
  r.getFill().setSolidFill(color);
  r.getBorder().setTransparent();
  return r;
}

function _table(slide, rows, x, y, w, h) {
  var nRows = rows.length;
  var nCols = rows[0].length;
  var tbl   = slide.insertTable(nRows, nCols, x, y, w, h);
  rows.forEach(function(row, ri) {
    row.forEach(function(txt, ci) {
      var cell = tbl.getCell(ri, ci);
      cell.getText().setText(txt);
      var ts = cell.getText().getTextStyle();
      ts.setFontFamily('Roboto');
      if (ri === 0) {
        ts.setFontSize(10); ts.setBold(true); ts.setForegroundColor(CYAN);
        cell.getFill().setSolidFill('#0d1b2a');
      } else {
        ts.setFontSize(10); ts.setBold(false); ts.setForegroundColor(WHITE);
        cell.getFill().setSolidFill(ri % 2 === 0 ? BG2 : BG);
      }
    });
  });
  return tbl;
}
