/* Bài 5: Tính tuổi */
(function () {
  'use strict';
  const { AGE_WORDS, BOOK_AGE, genAge } = window.TVData;
  const { $, esc } = TV;
  const PALETTE = ['#e64980', '#7950f2', '#228be6', '#40c057', '#fd7e14', '#e6a700'];

  // ---------- Thẻ từ vựng ----------
  $('#ageWords').innerHTML = AGE_WORDS.map((w, i) =>
    `<button class="word-card" style="--c:${PALETTE[i % PALETTE.length]}" data-en="${esc(w.en)}" data-vi="${esc(w.vi)}">
      <span class="wc-icon emoji">${w.icon}</span><span class="wc-en">${esc(w.en)}</span><span class="wc-vi">${esc(w.vi)}</span></button>`).join('');

  // ---------- Cột tuổi ----------
  // Mỗi người là một cột hộp, mỗi hộp = 1 tuổi. Phần chênh lệch được tô viền vàng.
  function makeBars(el, maxAge) {
    const unit = 220 / maxAge;
    let people = [];
    el.classList.add('bars');
    el.style.setProperty('--u', unit + 'px');
    function render(list) {
      people = list.map(p => ({ ...p }));
      el.innerHTML = people.map(p => `<div class="bar-col">
          <div class="bar-age"></div>
          <div class="bar" style="--c:${p.color}"><div class="bar-gap"></div></div>
          <div class="bar-name">${p.emoji} ${esc(p.name)}</div></div>`).join('');
      paint();
    }
    function update(ages) { ages.forEach((a, i) => { people[i].age = a; }); paint(); }
    function paint() {
      const ages = people.map(p => p.age), lo = Math.min(...ages), hi = Math.max(...ages);
      el.querySelectorAll('.bar-col').forEach((col, i) => {
        const a = people[i].age;
        col.querySelector('.bar-age').innerHTML = a === 0 ? '👶 <b>0</b> tuổi' : `<b>${a}</b> tuổi`;
        col.querySelector('.bar').style.height = a * unit + 'px';
        const gap = people.length > 1 && a === hi && hi > lo ? hi - lo : 0;
        const g = col.querySelector('.bar-gap');
        g.style.height = gap * unit + 'px';
        g.classList.toggle('on', gap > 0);
        g.innerHTML = gap ? `<span>hơn ${gap}</span>` : '';
      });
    }
    return { render, update };
  }

  const LACIE = { name: 'Lacie', emoji: '👧', color: '#e64980' };
  const SISTER = { name: 'Chị', emoji: '👩', color: '#7950f2' };

  // Sân chơi: kéo thời gian tới / lùi, khoảng cách luôn là 3
  const play = makeBars($('#agePlay'), 20);
  play.render([{ ...LACIE, age: 8 }, { ...SISTER, age: 11 }]);
  let year = 0;
  const yearVi = y => (y === 0 ? 'Bây giờ' : y > 0 ? `${y} năm sau` : `${-y} năm trước`);
  const yearEn = y => (y === 0 ? 'now' : `${Math.abs(y)} ${Math.abs(y) === 1 ? 'year' : 'years'} ${y > 0 ? 'later' : 'ago'}`);
  function moveYear(d) {
    const ny = year + d;
    if (8 + ny < 0 || ny > 8) return;
    year = ny;
    play.update([8 + year, 11 + year]);
    $('#yearLabel').textContent = `${yearVi(year)} (${yearEn(year)})`;
    $('#yearBack').disabled = 8 + year <= 0;
    $('#yearFwd').disabled = year >= 8;
    TV.sfx.hop();
    const lacie = 8 + year === 0 ? 'Lacie vừa sinh ra' : `Lacie ${8 + year} tuổi`;
    TV.say(`${yearVi(year)}. ${lacie}, chị ${11 + year} tuổi. Chị vẫn hơn Lacie 3 tuổi.`);
  }
  $('#yearBack').addEventListener('click', () => moveYear(-1));
  $('#yearFwd').addEventListener('click', () => moveYear(1));

  // ---------- Ví dụ từng bước ----------
  // Xem hết 2 ví dụ mới được làm Thử thách TIMO và Bài tự làm
  const seen = TV.exampleGate('tuoi', 2, [$('#bookAge'), $('#testAge')]);
  const b1 = makeBars($('#ex1Bars'), 14);
  TV.steps($('#ex1Steps'), [
    { text: '👧 Lacie <b>8 tuổi</b>.', run: () => b1.render([{ ...LACIE, age: 8 }]) },
    {
      text: '⬆️ Chị <b>hơn</b> Lacie 3 tuổi (older) → cột của chị cao hơn 3 hộp.',
      run: () => { b1.render([{ ...LACIE, age: 8 }, { ...SISTER, age: 8 }]); setTimeout(() => b1.update([8, 11]), 60); },
    },
    { text: '🧮 Tuổi chị: 8 + 3 = <b>11</b>.' },
    { text: '🎉 Đáp án: chị của Lacie <b>11 tuổi</b>!', cls: 'answer' },
  ], { onDone: () => seen(0) });

  const HARRY = { name: 'Harry', emoji: '👦', color: '#228be6' };
  const BROTHER = { name: 'Anh', emoji: '🧑', color: '#40c057' };
  const b2 = makeBars($('#ex2Bars'), 18);
  let growTimer = null;
  const stopGrow = () => { clearInterval(growTimer); growTimer = null; };
  TV.steps($('#ex2Steps'), [
    { text: '👶 Khi Harry vừa sinh ra, Harry <b>0 tuổi</b>, anh trai <b>5 tuổi</b>.', run: () => { stopGrow(); b2.render([{ ...HARRY, age: 0 }, { ...BROTHER, age: 5 }]); } },
    { text: '💡 Vậy anh luôn <b>hơn</b> Harry 5 tuổi. Năm nào cũng vậy!' },
    {
      text: '⏩ Các năm trôi qua… hai anh em cùng lớn lên.',
      run: () => {
        let h = 0;
        stopGrow();
        growTimer = setInterval(() => {
          h++;
          b2.update([h, h + 5]);
          TV.sfx.pop();
          if (h >= 11) stopGrow();
        }, 300);
      },
    },
    { text: '🧑 Bây giờ anh <b>16 tuổi</b>. Harry ít hơn anh 5 tuổi.', run: () => { stopGrow(); b2.update([11, 16]); } },
    { text: '🧮 Tuổi Harry: 16 − 5 = <b>11</b>.' },
    { text: '🎉 Đáp án: Harry <b>11 tuổi</b>!', cls: 'answer' },
  ], { onReset: stopGrow, onDone: () => seen(1) });

  // ---------- Bánh sinh nhật ----------
  function cakeHtml(n) {
    let top;
    if (n == null) top = '<div class="cake-q">?</div>';
    else if (n <= 15) top = `<div class="candles">${'<span class="candle"><i class="flame"></i></span>'.repeat(n)}</div>`;
    else top = `<div class="candles">${String(n).split('').map(d => `<span class="candle num"><i class="flame"></i><em>${d}</em></span>`).join('')}</div>`;
    return `<div class="cake">${top}<div class="cake-top"></div><div class="cake-body"></div><div class="cake-plate"></div></div><p class="cake-msg"></p>`;
  }
  function cakeTool(box) { box.innerHTML = cakeHtml(null); return box; }
  function lightAndBlow(box, q) {
    box.innerHTML = cakeHtml(q.answer);
    $('.cake-msg', box).textContent = `🕯️ ${q.answer} tuổi!`;
    setTimeout(() => {
      $('.cake', box).classList.add('blown');
      $('.cake-msg', box).textContent = '💨 Phùùù! Zoombe thổi tắt nến rồi! 🎉';
    }, 1600);
  }
  const ageChoice = n => ({ value: n, html: `<b>${n}</b><small>tuổi</small>` });
  const toQuiz = q => ({ ...q, choices: q.choices.map(ageChoice) });

  // ---------- Game & thử thách ----------
  TV.quiz($('#ageGame'), { lessonId: 'tuoi-game', total: 8, get: () => toQuiz(genAge()), visual: cakeTool, onCorrect: lightAndBlow });

  TV.memory($('#memAge'), {
    lessonId: 'tuoi-the',
    count: 6,
    pairs: AGE_WORDS.map(w => ({ a: { text: w.en, lang: 'en' }, b: { text: w.vi, lang: 'vi', icon: w.icon } })),
  });

  TV.quiz($('#bookAge'), {
    lessonId: 'tuoi-timo',
    total: BOOK_AGE.length,
    picker: true,
    stars: true,
    fill: true, // bé tự điền số tuổi, không chọn trong 3 đáp án
    get: i => ({ ...BOOK_AGE[i], type: 'num' }),
    visual: cakeTool,
    onCorrect: lightAndBlow,
  });

  // ---------- Bài tự làm ----------
  TV.selfTest($('#testAge'), { lessonId: 'tuoi-test', questions: TVData.TEST_AGE });
})();
