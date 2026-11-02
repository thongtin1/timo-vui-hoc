/* Trang Bộ đề sách: các bài Luyện tập trong sách, chia theo 5 chủ đề.
   Mỗi bài làm như Thử thách TIMO: bé tự điền kết quả, đúng ngay lần đầu được 1 ⭐. */
(function () {
  'use strict';
  const { $, $$, esc } = TV;
  const LESSONS = window.TVBook || [];

  // Số câu đã làm đúng của một bài (kể cả câu làm lại mới đúng)
  function progress(L) {
    const m = TV.getState().marks[L.id] || {};
    return L.questions.filter((_, k) => m[k] === 'ok' || m[k] === 'retry').length;
  }
  function renderList() {
    $('#bookParts').innerHTML = TVData.PARTS.map(p => {
      const list = LESSONS.filter(L => L.part === p.id);
      if (!list.length) return '';
      return `<section class="part" style="--c:${p.color}">
          <h2 class="part-title"><span class="part-icon">${p.icon}</span> Topic ${'ABCDE'.indexOf(p.id) + 1}. ${p.vi} <small>${p.en}</small></h2>
          <div class="islands">${list.map(L => {
            const n = L.questions.length, got = progress(L);
            return `<a class="island" href="#${L.id}" data-id="${L.id}" style="--c:${p.color}">
                <span class="isl-icon">${L.icon}</span><span class="isl-tag">${esc(L.lesson)}</span>
                <b>${esc(L.title)}</b><small>${esc(L.en)}</small>
                <span class="isl-score ${got ? '' : 'todo'}">${got ? `✓ ${got}/${n}${got === n ? ' 🏆' : ''}` : `📘 ${n} câu`}</span></a>`;
          }).join('')}</div>
        </section>`;
    }).join('');
  }

  // Câu trong sách → câu cho quiz: lời giải chỉ còn chữ, các hình chạy (run) để dành lúc bé làm đúng
  const toQuiz = q => ({
    ...q,
    steps: q.steps.map(s => (typeof s === 'string' ? s : s.text)),
    runs: q.steps.filter(s => typeof s !== 'string' && s.run).map(s => s.run),
  });

  function open(id, scroll) {
    const L = LESSONS.find(x => x.id === id);
    if (!L) return;
    const part = TVData.PARTS.find(p => p.id === L.part);
    $('#bookQuizCard').hidden = false;
    $('#bookTitle').innerHTML = `${L.icon} ${esc(L.lesson)}: ${esc(L.title)} <small class="muted">${esc(part.vi)}</small>`;
    $('#bookNote').hidden = !L.note;
    $('#bookNote').textContent = L.note ? `📝 ${L.note}` : '';
    TV.quiz($('#bookQuiz'), {
      lessonId: L.id,
      total: L.questions.length,
      picker: true,
      stars: true,
      fill: true,
      get: i => toQuiz(L.questions[i]),
      visual: (box, q) => (q.visual ? q.visual(box) : null),
      onCorrect: (tool, q) => { if (tool) q.runs.forEach(run => run(tool)); },
    });
    $$('#bookParts .island').forEach(a => a.classList.toggle('cur', a.dataset.id === id));
    if (scroll) $('#bookQuizCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  renderList();
  $('#bookParts').addEventListener('click', e => {
    const a = e.target.closest('.island');
    if (!a) return;
    e.preventDefault();
    try { history.replaceState(null, '', '#' + a.dataset.id); } catch (err) { /* file:// có thể chặn */ }
    open(a.dataset.id, true);
  });
  // Làm xong câu nào thì cập nhật số câu đã đúng trên thẻ bài
  $('#bookQuiz').addEventListener('click', () => setTimeout(() => {
    const cur = location.hash.slice(1);
    renderList();
    $$('#bookParts .island').forEach(a => a.classList.toggle('cur', a.dataset.id === cur));
  }, 400));
  if (location.hash) open(location.hash.slice(1), false);
})();
