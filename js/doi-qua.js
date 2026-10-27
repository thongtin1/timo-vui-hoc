/* Đổi quà: bé dùng ⭐ đang có để đổi quà thật do bố mẹ đặt */
(function () {
  'use strict';
  const { $, $$, esc, rand } = TV;

  function render() {
    const have = TV.available(), list = TV.getRewards(), st = TV.getState();
    $('#giftTalk').textContent = `Con đang có ${have} ngôi sao. Con muốn đổi quà gì nào?`;
    $('#gifts').innerHTML = list.map((r, i) => {
      const lack = r.cost - have;
      return `<div class="gift ${lack > 0 ? 'lack' : ''}">
          <span class="gift-icon">${esc(r.icon)}</span>
          <b class="say">${esc(r.name)}</b>
          <span class="gift-cost">⭐ ${r.cost}</span>
          ${lack > 0
            ? `<div class="progress"><div class="progress-bar" style="width:${Math.round((have / r.cost) * 100)}%"></div></div><small>Còn thiếu ${lack} ⭐</small>`
            : `<button class="btn gift-btn" data-i="${i}">Đổi quà 🎉</button>`}
        </div>`;
    }).join('') || '<p class="muted">Bố mẹ chưa đặt quà nào.</p>';
    $$('.gift-btn').forEach(b => b.addEventListener('click', () => {
      const r = list[Number(b.dataset.i)];
      TV.ask(`<div class="sticker-new">${esc(r.icon)}</div><h2>Đổi ${esc(r.name)}?</h2><p>Con sẽ dùng ${r.cost} ⭐.</p>`, 'Đổi quà', 'Để sau', () => {
        if (!TV.redeem(r)) return;
        TV.confetti(120);
        TV.sfx.ting();
        TV.modal(`<div class="sticker-new">${esc(r.icon)}</div><h2>Đổi quà thành công!</h2><p>Con đưa màn hình này cho bố mẹ để nhận ${esc(r.name)} nhé!</p>`, 'Yeah!');
        render();
      });
    }));
    $('#history').innerHTML = st.redeemed.length
      ? `<ul class="gift-log">${st.redeemed.slice(0, 20).map(h => `<li>${esc(h.icon)} <b>${esc(h.name)}</b> · ⭐ ${h.cost} <small class="muted">${new Date(h.at).toLocaleDateString('vi-VN')}</small></li>`).join('')}</ul>`
      : '<p class="muted">Chưa đổi quà nào. Làm bài để có sao nhé!</p>';
  }

  // ---------- Bố mẹ: qua câu hỏi khó rồi mới được sửa quà ----------
  function gate() {
    const a = rand(23, 59), b = rand(14, 39);
    $('#parent').innerHTML = `<p>Phần này dành cho bố mẹ. Trả lời câu hỏi để mở:</p>
      <div class="gate"><b>${a} + ${b} = </b><input type="number" inputmode="numeric" id="gateIn" aria-label="Kết quả"><button class="btn" id="gateBtn">Mở</button></div>
      <p class="muted" id="gateMsg"></p>`;
    const go = () => {
      if (Number($('#gateIn').value) === a + b) editor();
      else { $('#gateMsg').textContent = 'Chưa đúng, thử lại nhé.'; TV.sfx.oops(); }
    };
    $('#gateBtn').addEventListener('click', go);
    $('#gateIn').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  }

  function editor() {
    const rows = TV.getRewards().map(r => ({ ...r }));
    function draw() {
      $('#parent').innerHTML = `<p class="muted">Sửa tên quà, biểu tượng và số ⭐ cần để đổi. Bấm Lưu khi xong.</p>
        <div class="gift-edit">${rows.map((r, i) => `<div class="ge-row" data-i="${i}">
            <input class="ge-icon" value="${esc(r.icon)}" aria-label="Biểu tượng" maxlength="4">
            <input class="ge-name" value="${esc(r.name)}" aria-label="Tên quà">
            <input class="ge-cost" type="number" inputmode="numeric" min="1" value="${r.cost}" aria-label="Số sao">
            <button class="btn btn-ghost ge-del" aria-label="Xóa">🗑️</button>
          </div>`).join('')}</div>
        <div class="btn-row" style="justify-content:flex-start">
          <button class="btn btn-ghost" id="geAdd">➕ Thêm quà</button>
          <button class="btn" id="geSave">💾 Lưu</button>
          <button class="btn btn-ghost" id="geClose">Đóng</button>
        </div>
        <p class="muted">Tổng sao bé đã kiếm: ${TV.getState().stars} ⭐ · Đã đổi: ${TV.getState().spent} ⭐</p>`;
      const read = () => $$('.ge-row').forEach(row => {
        const r = rows[Number(row.dataset.i)];
        r.icon = $('.ge-icon', row).value.trim() || '🎁';
        r.name = $('.ge-name', row).value.trim() || 'Quà';
        r.cost = Math.max(1, Math.round(Number($('.ge-cost', row).value) || 1));
      });
      $$('.ge-del').forEach(b => b.addEventListener('click', () => { read(); rows.splice(Number(b.closest('.ge-row').dataset.i), 1); draw(); }));
      $('#geAdd').addEventListener('click', () => { read(); rows.push({ id: 'r' + Date.now(), icon: '🎁', name: 'Quà mới', cost: 10 }); draw(); });
      $('#geSave').addEventListener('click', () => { read(); rows.sort((x, y) => x.cost - y.cost); TV.setRewards(rows); render(); TV.sfx.ting(); gate(); });
      $('#geClose').addEventListener('click', gate);
    }
    draw();
  }

  render();
  gate();
})();
