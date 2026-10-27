/* Bài 4: Thứ – ngày – tháng */
(function () {
  'use strict';
  const D = window.TVData;
  const { DAYS, MONTHS, TIME_WORDS, BOOK_DATE, mod7, cap } = D;
  const { $, $$, esc } = TV;

  // ---------- Thẻ từ vựng ----------
  function card(w) {
    return `<button class="word-card" style="--c:${w.color || '#7048e8'}" data-en="${esc(w.en)}" data-vi="${esc(w.vi)}">
      ${w.badge ? `<span class="wc-icon">${w.badge}</span>` : ''}${w.icon ? `<span class="wc-icon emoji">${w.icon}</span>` : ''}
      <span class="wc-en">${esc(w.en)}</span><span class="wc-vi">${esc(w.vi)}</span></button>`;
  }
  $('#dayCards').innerHTML = DAYS.map(d => card({ en: d.en, vi: cap(d.vi), color: d.color, badge: d.short })).join('');
  $('#timeWords').innerHTML = TIME_WORDS.map(card).join('');
  $('#monthCards').innerHTML = MONTHS.map((m, i) => card({ ...m, color: DAYS[i % 7].color })).join('');

  // ---------- Con đường 5 ngày ----------
  const LINE = [
    { off: -2, en: 'The day before yesterday', vi: 'Hôm kia' },
    { off: -1, en: 'Yesterday', vi: 'Hôm qua' },
    { off: 0, en: 'Today', vi: 'Hôm nay' },
    { off: 1, en: 'Tomorrow', vi: 'Ngày mai' },
    { off: 2, en: 'The day after tomorrow', vi: 'Ngày kia' },
  ];
  const realToday = (new Date().getDay() + 6) % 7; // JS: 0 = Chủ nhật → đổi về 0 = thứ Hai
  let lineToday = realToday, lineSel = 2;
  $('#realDay').textContent = `📆 Ngoài đời, hôm nay là ${DAYS[realToday].vi} (${DAYS[realToday].en}) đó!`;

  function renderPick() {
    $('#todayPick').innerHTML = DAYS.map((d, i) =>
      `<button class="chip-btn ${i === lineToday ? 'active' : ''}" style="--c:${d.color}" data-i="${i}">${d.short}</button>`).join('');
  }
  function renderLine() {
    $('#timeline').innerHTML = LINE.map((c, k) => {
      const d = DAYS[mod7(lineToday + c.off)];
      const off = c.off === 0 ? '🏠' : `${c.off > 0 ? '+' : '−'}${Math.abs(c.off)} ngày`;
      return `<button class="tl-cell ${k === lineSel ? 'sel' : ''} ${c.off === 0 ? 'today' : ''}" data-k="${k}" style="--c:${d.color}">
        <span class="tl-zb">${k === lineSel ? TV.zoombe('happy') : ''}</span>
        <b class="tl-vi">${c.vi}</b><small class="tl-en">${c.en}</small>
        <span class="tl-day">${cap(d.vi)}</span>
        <span class="tl-off ${c.off > 0 ? 'fwd' : c.off < 0 ? 'back' : ''}">${off}</span></button>`;
    }).join('');
  }
  $('#todayPick').addEventListener('click', e => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    lineToday = Number(b.dataset.i);
    lineSel = 2;
    renderPick();
    renderLine();
    TV.say(`Hôm nay là ${DAYS[lineToday].vi}`);
  });
  $('#timeline').addEventListener('click', e => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    lineSel = Number(b.dataset.k);
    renderLine();
    const c = LINE[lineSel], d = DAYS[mod7(lineToday + c.off)];
    TV.sfx.hop();
    TV.speakAll([{ text: `${c.vi} là ${d.vi}.`, lang: 'vi' }, { text: `${c.en}: ${d.en}.`, lang: 'en' }]);
  });
  renderPick();
  renderLine();

  // ---------- Vòng tròn 7 ngày ----------
  // Mọi bước nhảy đi qua một hàng đợi để Zoombe nhảy từng bước một, không bị chồng nhau.
  function makeWheel(el, opts) {
    opts = opts || {};
    const R = 39, RT = 21; // bán kính (%) của vòng ngày và vòng Zoombe đứng
    const xy = i => { const a = (-90 + i * 360 / 7) * Math.PI / 180; return [Math.cos(a), Math.sin(a)]; };
    el.classList.add('wheel-wrap');
    el.innerHTML = `<div class="wheel"><div class="wheel-ring"></div>
      ${DAYS.map((d, i) => {
        const [x, y] = xy(i);
        return `<button class="wnode" data-i="${i}" style="--c:${d.color};left:${50 + R * x}%;top:${50 + R * y}%">
          <b>${d.short}</b><small>${d.en.slice(0, 3)}</small><span class="whome">🏠</span><span class="wmark"></span></button>`;
      }).join('')}
      <div class="wtoken"><div class="wtoken-in">${TV.zoombe('happy')}</div></div>
      <div class="wcenter"><b class="wcount">0</b><small class="wlabel">bước</small></div></div>
      ${opts.controls ? `<div class="btn-row">
        <button class="btn back-btn" data-dir="-1">⬅️ Lùi</button>
        <button class="btn fwd-btn" data-dir="1">Tới ➡️</button>
        ${opts.seven ? '<button class="btn btn-ghost seven">✨ Nhảy 7 bước</button>' : ''}</div>` : ''}`;
    const nodes = $$('.wnode', el), token = $('.wtoken', el), inner = $('.wtoken-in', el);
    const count = $('.wcount', el), label = $('.wlabel', el);
    let cur = 0, hops = 0, busy = false;
    const queue = [];

    function place() {
      const [x, y] = xy(cur);
      token.style.left = 50 + RT * x + '%';
      token.style.top = 50 + RT * y + '%';
      nodes.forEach((n, i) => n.classList.toggle('here', i === cur));
    }
    function showCount() {
      count.textContent = Math.abs(hops);
      count.className = 'wcount ' + (hops > 0 ? 'fwd' : hops < 0 ? 'back' : '');
      label.textContent = hops > 0 ? 'bước tới' : hops < 0 ? 'bước lùi' : 'bước';
    }
    function setHome(i, silent) {
      cur = i;
      hops = 0;
      nodes.forEach((n, k) => {
        n.classList.toggle('home', k === i);
        const m = $('.wmark', n);
        m.textContent = '';
        m.className = 'wmark';
      });
      showCount();
      place();
      if (!silent) TV.say(cap(DAYS[i].vi));
    }
    function hop(dir, silent) {
      cur = mod7(cur + dir);
      hops += dir;
      const m = $('.wmark', nodes[cur]);
      m.textContent = Math.abs(hops);
      m.className = 'wmark ' + (dir > 0 ? 'fwd' : 'back');
      inner.classList.remove('jump');
      void inner.offsetWidth;
      inner.classList.add('jump');
      TV.sfx.hop();
      showCount();
      place();
      if (!silent) TV.say(cap(DAYS[cur].vi));
    }
    function pump() {
      if (busy || !queue.length) return;
      busy = true;
      queue.shift()();
      setTimeout(() => { busy = false; pump(); }, 550);
    }
    const later = fn => { queue.push(fn); pump(); };
    const idle = () => !busy && !queue.length;
    function play(start, offset, done) {
      later(() => setHome(start, true));
      for (let k = 0; k < Math.abs(offset); k++) later(() => hop(Math.sign(offset), true));
      if (done) later(done);
    }
    function reset(i) { queue.length = 0; setHome(i, true); }

    el.addEventListener('click', e => {
      if (opts.locked || !idle()) return;
      const nd = e.target.closest('.wnode');
      if (nd) { setHome(Number(nd.dataset.i)); return; }
      const b = e.target.closest('[data-dir]');
      if (b) { hop(Number(b.dataset.dir)); return; }
      if (e.target.closest('.seven')) {
        const from = cur;
        play(from, 7, () => TV.say(`Nhảy 7 bước, Zoombe về lại đúng ${DAYS[from].vi}!`));
      }
    });
    setHome(opts.start || 0, true);
    return { setHome, hop, play, later, reset };
  }

  makeWheel($('#wheelPlay'), { controls: true, seven: true, start: realToday });

  // ---------- Ví dụ từng bước ----------
  function example(id, start, makeSteps) {
    const w = makeWheel($(`#${id}Wheel`), { locked: true, start });
    TV.steps($(`#${id}Steps`), makeSteps(w), { onReset: () => w.reset(start) });
  }
  const jump = (w, dir) => () => w.later(() => w.hop(dir, true));

  example('ex1', 3, w => [
    { text: '🏠 Bước 1: Hôm nay là <b>thứ Năm</b>.', run: () => w.setHome(3, true) },
    { text: '➡️ Bước 2: “3 ngày nữa” (later) là <b class="fwd-t">đi tới</b>.' },
    { text: '🧟 Nhảy 1 bước → <b>thứ Sáu</b>', run: jump(w, 1) },
    { text: '🧟 Nhảy 2 bước → <b>thứ Bảy</b>', run: jump(w, 1) },
    { text: '🧟 Nhảy 3 bước → <b>Chủ nhật</b>', run: jump(w, 1) },
    { text: '🎉 Đáp án: <b>Chủ nhật (Sunday)</b>!', cls: 'answer' },
  ]);

  example('ex2', 4, w => [
    { text: '📍 Đề cho: ngày mai là <b>thứ Sáu</b>.', run: () => w.setHome(4, true) },
    { text: '🏠 Bước 1: Hôm nay đứng trước ngày mai 1 ngày → hôm nay là <b>thứ Năm</b>.', run: () => w.later(() => w.setHome(3, true)) },
    { text: '⬅️ Bước 2: “3 ngày trước” (before) là <b class="back-t">lùi lại</b>.' },
    { text: '🧟 Lùi 1 bước → <b>thứ Tư</b>', run: jump(w, -1) },
    { text: '🧟 Lùi 2 bước → <b>thứ Ba</b>', run: jump(w, -1) },
    { text: '🧟 Lùi 3 bước → <b>thứ Hai</b>', run: jump(w, -1) },
    { text: '🎉 Đáp án: <b>Thứ Hai (Monday)</b>!', cls: 'answer' },
  ]);

  example('ex3', 0, w => [
    { text: '🏠 Bước 1: Hôm nay là <b>thứ Hai</b>.', run: () => w.setHome(0, true) },
    { text: '⬅️ Bước 2: “8 ngày trước” (ago) là <b class="back-t">lùi lại</b> 8 bước.' },
    { text: '✨ Mẹo: lùi 7 bước là về đúng <b>thứ Hai</b>! Xem Zoombe nhảy nè.', run: () => w.play(0, -7) },
    { text: '🧟 Còn 1 bước nữa → lùi 1 bước là <b>Chủ nhật</b>.', run: jump(w, -1) },
    { text: '🎉 Đáp án: <b>Chủ nhật (Sunday)</b>!', cls: 'answer' },
  ]);

  // ---------- Quiz (game + thử thách) ----------
  const dayChoice = i => `<span class="day-chip" style="--c:${DAYS[i].color}">${cap(DAYS[i].vi)}</span><small>${DAYS[i].en}</small>`;
  const toQuiz = q => ({
    en: q.en, vi: q.vi, tag: q.tag, raw: q,
    answer: D.answerOf(q),
    choices: D.dateChoices(q).map(i => ({ value: i, html: dayChoice(i) })),
    steps: D.dateSteps(q),
    hint: D.dateHintCount(q),
  });
  // Vòng tròn nhỏ để bé tự thử nhảy; khi trả lời đúng, Zoombe nhảy lại lời giải.
  function wheelTool(box, q) {
    box.innerHTML = '<p class="tip say">🧟 Con có thể bấm vào vòng tròn để thử nhảy nhé!</p><div class="wheel-holder"></div>';
    return makeWheel($('.wheel-holder', box), { controls: true, start: q.raw.refDay });
  }
  function replay(w, q) {
    const t = D.todayOf(q.raw);
    w.reset(t);
    w.play(t, q.raw.offset);
  }

  let level = 1;
  function startGame() {
    TV.quiz($('#dayGame'), { lessonId: 'ngay-game', total: 8, get: () => toQuiz(D.genDate(level)), visual: wheelTool, onCorrect: replay });
  }
  $('#lvlPick').addEventListener('click', e => {
    const b = e.target.closest('[data-lvl]');
    if (!b) return;
    level = Number(b.dataset.lvl);
    $$('#lvlPick .chip-btn').forEach(x => x.classList.toggle('active', x === b));
    startGame();
  });
  startGame();

  const pairs = DAYS.map(d => ({ a: { text: d.en, lang: 'en' }, b: { text: cap(d.vi), lang: 'vi' } }))
    .concat(TIME_WORDS.slice(0, 5).map(w => ({ a: { text: w.en, lang: 'en' }, b: { text: w.vi, lang: 'vi' } })));
  TV.memory($('#memDate'), { lessonId: 'ngay-the', pairs, count: 6 });

  TV.quiz($('#bookDate'), { lessonId: 'ngay-timo', total: BOOK_DATE.length, picker: true, get: i => toQuiz(BOOK_DATE[i]), visual: wheelTool, onCorrect: replay });

  // ---------- Bài tự làm: chọn 1 trong 7 thứ, nộp bài xong mới xem cách giải ----------
  TV.selfTest($('#testDate'), {
    lessonId: 'ngay-test',
    questions: D.TEST_DATE.map(q => ({
      ...q,
      type: 'choice',
      answer: D.answerOf(q),
      choices: DAYS.map((_, i) => ({ value: i, html: dayChoice(i) })),
      steps: D.dateSteps(q),
    })),
  });
})();
