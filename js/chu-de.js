/* Trang chủ đề dùng chung: chu-de.html?id=<mã chủ đề>
   Dựng 4 tab (Học từ, Ví dụ, Luyện tập, Bài tự làm) từ dữ liệu trong js/topics/. */
(function () {
  'use strict';
  const { $, esc, shuffle } = TV;
  const id = new URLSearchParams(location.search).get('id');
  const topic = (window.TVTopics || []).find(t => t.id === id);
  if (!topic) {
    $('#main').innerHTML = '<section class="card"><h2>Không tìm thấy bài học 😢</h2><p><a class="btn" href="index.html">🏠 Về trang chủ</a></p></section>';
    return;
  }
  const part = TVData.PARTS.find(p => p.id === topic.part);
  document.title = topic.title;

  // ---------- Học từ ----------
  $('#tIntro').textContent = topic.intro;
  $('#tWords').innerHTML = topic.words.map(w =>
    `<button class="word-card" style="--c:${part.color}" data-en="${esc(w.en)}" data-vi="${esc(w.vi)}">
      <span class="wc-icon emoji">${w.icon}</span><span class="wc-en">${esc(w.en)}</span><span class="wc-vi">${esc(w.vi)}</span></button>`).join('');
  $('#tTips').innerHTML = topic.tips.map(t => `<li class="say">${t}</li>`).join('');
  if (topic.play) {
    $('#tPlayCard').hidden = false;
    $('#tPlayTitle').textContent = topic.play.title;
    topic.play.mount($('#tPlay'));
  }

  // ---------- Ví dụ: Zoombe giải từng bước, hình chạy theo ----------
  $('#tExamples').innerHTML = topic.examples.map((q, i) => `<div class="card example">
      <h3>${esc(q.title)}</h3>
      ${q.en ? `<p class="q-en say" data-lang="en">${esc(q.en)}</p>` : ''}
      <p class="say">${esc(q.vi)}</p>
      <div class="${q.visual ? 'ex-layout' : ''}">${q.visual ? `<div class="q-visual" id="exV${i}"></div>` : ''}<div id="exS${i}"></div></div>
    </div>`).join('');
  topic.examples.forEach((q, i) => TV.solve($(`#exS${i}`), q, $(`#exV${i}`)));

  // ---------- Luyện tập: trắc nghiệm 3 lựa chọn, biết đúng sai ngay ----------
  const ABC = TV.vis.ABC;
  function choicesOf(q) {
    if (q.type === 'oddeven') return TV.ODD_EVEN;
    if (q.type === 'choice') return shuffle(q.choices);
    const near = q.type === 'letter'
      ? [1, -1, 2, -2].map(d => ABC[ABC.indexOf(q.answer) + d])
      : [1, -1, 2, 10].map(d => q.answer + d);
    const out = [q.answer];
    for (const c of (q.wrong || []).concat(near)) {
      if (out.length < 3 && c != null && !(typeof c === 'number' && c < 0) && !out.includes(c)) out.push(c);
    }
    return shuffle(out).map(v => ({ value: v, html: `<b>${esc(v)}</b>` }));
  }
  // Hình vẽ lúc làm bài, đúng rồi thì chạy hết các bước để hình hiện lời giải
  function toQuiz(q) {
    return { ...q, choices: choicesOf(q), steps: q.steps.map(s => (typeof s === 'string' ? s : s.text)), runs: q.steps.filter(s => s.run).map(s => s.run) };
  }
  TV.quiz($('#tPractice'), {
    lessonId: `${id}-luyen`,
    total: 8,
    get: () => toQuiz(topic.gen()),
    visual: (box, q) => (q.visual ? q.visual(box) : null),
    onCorrect: (tool, q) => { if (tool) q.runs.forEach(run => run(tool)); },
  });

  // ---------- Bài tự làm ----------
  TV.selfTest($('#tTest'), { lessonId: `${id}-test`, questions: topic.test });
})();
