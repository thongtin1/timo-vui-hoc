/* Album sticker + Góc phụ huynh */
(function () {
  'use strict';
  const { $, esc } = TV;
  const LESSONS = {
    'ngay-game': 'Bài 4 · Game Zoombe nhảy ngày',
    'ngay-the': 'Bài 4 · Lật thẻ',
    'ngay-timo': 'Bài 4 · Thử thách TIMO',
    'tuoi-game': 'Bài 5 · Game thổi nến',
    'tuoi-the': 'Bài 5 · Lật thẻ',
    'tuoi-timo': 'Bài 5 · Thử thách TIMO',
    'ngay-test': 'Bài 4 · Bài tự làm',
    'tuoi-test': 'Bài 5 · Bài tự làm',
  };
  (window.TVTopics || []).forEach(t => {
    LESSONS[t.id + '-luyen'] = t.title + ' · Luyện tập';
    LESSONS[t.id + '-test'] = t.title + ' · Bài tự làm';
  });

  function render() {
    const st = TV.getState(), per = TV.STARS_PER_STICKER, all = TV.STICKERS.length;
    const full = st.stickers >= all, into = st.stars % per;
    $('#albumTalk').textContent = `Con đã kiếm được ${st.stars} ngôi sao và ${st.stickers} sticker rồi đó!`;
    $('#nextBar').style.width = (full ? 100 : (into / per) * 100) + '%';
    $('#nextText').textContent = full ? 'Con đã mở hết sticker rồi! Siêu quá!' : `Còn ${per - into} ⭐ nữa là mở sticker mới!`;
    $('#stickers').innerHTML = TV.STICKERS.map((s, i) => (i < st.stickers
      ? `<div class="sticker">${s}</div>`
      : `<div class="sticker locked">🔒<small>${(i + 1) * per} ⭐</small></div>`)).join('');

    const rows = Object.keys(LESSONS).map(id => {
      const l = st.log[id];
      if (!l) return `<tr><td>${LESSONS[id]}</td><td colspan="3" class="muted">Chưa làm</td></tr>`;
      const miss = Object.entries(l.miss || {}).sort((a, b) => b[1] - a[1]).slice(0, 3)
        .map(([q, c]) => `<li>${esc(q)} <b>(${c} lần)</b></li>`).join('');
      return `<tr><td>${LESSONS[id]}</td><td>${l.right}</td><td>${l.wrong}</td><td>${miss ? `<ul>${miss}</ul>` : '—'}</td></tr>`;
    }).join('');
    $('#report').innerHTML = `<table class="report">
      <tr><th>Phần</th><th>Đúng ngay lần đầu</th><th>Phải làm lại</th><th>Câu hay sai</th></tr>${rows}</table>`;
  }

  function renderVoice() {
    const v = TV.voiceInfo();
    if (!v.supported) {
      $('#voiceInfo').innerHTML = '<span class="voice-warn">⚠️ Trình duyệt này không đọc to được. Hãy dùng Microsoft Edge hoặc Google Chrome.</span>';
    } else if (v.vi) {
      $('#voiceInfo').innerHTML = `<span class="voice-ok">✅ Có giọng tiếng Việt: ${esc(v.vi.name)}</span>`;
    } else {
      $('#voiceInfo').innerHTML = '<span class="voice-warn">⚠️ Máy chưa có giọng đọc tiếng Việt.</span> Cách sửa: mở trang bằng <b>Microsoft Edge</b> (có sẵn giọng tiếng Việt), hoặc vào Cài đặt Windows → Thời gian &amp; ngôn ngữ → Giọng nói → Thêm giọng → Tiếng Việt.';
    }
  }

  $('#stickers').addEventListener('click', e => {
    const s = e.target.closest('.sticker:not(.locked)');
    if (!s) return;
    s.classList.remove('pop');
    void s.offsetWidth;
    s.classList.add('pop');
    TV.sfx.pop();
  });
  $('#testVoice').addEventListener('click', () => TV.speakAll([
    { text: 'Xin chào! Tớ là Zoombe.', lang: 'vi' },
    { text: 'Hello! Today is Monday.', lang: 'en' },
  ]));
  $('#resetAll').addEventListener('click', () => {
    if (!confirm('Xóa hết sao, sticker và kết quả của bé?')) return;
    TV.resetAll();
    render();
  });

  TV.onVoices(renderVoice);
  renderVoice();
  render();
})();
