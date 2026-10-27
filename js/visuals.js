/* TIMO Vui Học – hình minh họa dùng chung cho các chủ đề.
   Mỗi hàm vẽ vào một ô (box) và trả về "đồ dùng" để các bước giải điều khiển (tô màu, điền số…).
   Cần nạp js/common.js trước file này. */
(function () {
  'use strict';
  const { $, $$, esc } = TV;
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // ---------- Dãy ô: dãy số, dãy chữ ----------
  // items: giá trị, null là ô "?". opts: { group?(i) → 0 | 1 (tô 2 màu cho dãy xen kẽ), ord?: ghi "thứ 1, thứ 2…" }
  function seq(box, items, opts) {
    opts = opts || {};
    box.innerHTML = `<div class="seq">${items.map((v, i) => `${i ? '<span class="hop"></span>' : ''}<div class="pad g${opts.group ? opts.group(i) : 0} ${v == null ? 'blank' : ''}">
        ${opts.ord ? `<small>thứ ${i + 1}</small>` : ''}<b>${v == null ? '?' : esc(v)}</b></div>`).join('')}</div>`;
    const pads = $$('.pad', box), hops = $$('.hop', box);
    return {
      // labels[i] = chữ ghi giữa ô i và ô i+1 (vd "+5"), bỏ trống thì ẩn
      hops(labels) { hops.forEach((h, i) => { const t = labels[i] || ''; h.textContent = t; h.classList.toggle('on', !!t); h.classList.toggle('down', t.startsWith('−')); }); },
      fill(i, v) {
        const p = pads[i];
        p.classList.remove('blank');
        TV.$('b', p).textContent = v;
        p.classList.remove('new');
        void p.offsetWidth;
        p.classList.add('new');
        TV.sfx.hop();
      },
      mark(list, cls) { list.forEach(i => { if (pads[i]) pads[i].classList.add(cls || 'hl'); }); },
    };
  }

  // ---------- Bảng chữ cái có số thứ tự ----------
  // Bấm vào chữ để nghe đọc tiếng Anh.
  function alpha(box) {
    box.innerHTML = `<div class="abc">${ABC.map((c, i) => `<button class="abc-cell" data-c="${c}" data-say="${c}" data-lang="en"><b>${c}</b><small>${i + 1}</small></button>`).join('')}</div>`;
    const cell = c => $(`.abc-cell[data-c="${c}"]`, box);
    let timers = [];
    return {
      mark(letters, cls) { letters.forEach(c => { const e = cell(c); if (e) e.classList.add(cls || 'hl'); }); },
      // Đếm từ chữ a tới chữ b: các chữ đi qua hiện số 1, 2, 3… để bé đếm theo
      count(a, b) {
        timers.forEach(clearTimeout);
        timers = [];
        $$('.abc-cell.cnt', box).forEach(e => { e.classList.remove('cnt'); delete e.dataset.n; });
        const i = ABC.indexOf(a), j = ABC.indexOf(b);
        if (i < 0 || j < 0 || i === j) return;
        const d = j > i ? 1 : -1;
        for (let k = i + d, s = 1; ; k += d, s++) {
          const e = cell(ABC[k]), last = k === j, n = s;
          timers.push(setTimeout(() => { e.classList.add('cnt'); e.dataset.n = n; if (last) e.classList.add('ans'); TV.sfx.hop(); }, n * 450));
          if (last) break;
        }
      },
    };
  }

  // ---------- Thẻ số: dãy số hoặc phép tính ----------
  // tokens: ['21', '+', '7', …]. Dấu + − = vẽ nhỏ. Thẻ số được đánh số 0, 1, 2… (chỉ đếm thẻ số, bỏ qua dấu).
  function chips(box, tokens) {
    let k = 0;
    box.innerHTML = `<div class="chips">${tokens.map(t => (/^[+−=]$/.test(t)
      ? `<span class="op">${t}</span>`
      : `<span class="chip" data-i="${k++}"><b>${esc(t)}</b><i></i></span>`)).join('')}</div>`;
    const at = i => $(`.chip[data-i="${i}"]`, box);
    return {
      // Tô cùng màu một nhóm thẻ, ghi chú nhỏ dưới thẻ cuối của nhóm (vd "= 60")
      group(idxs, color, label) {
        idxs.forEach((i, k) => {
          const c = at(i);
          if (!c) return;
          c.style.setProperty('--g', color);
          c.classList.add('grp');
          if (k === idxs.length - 1) $('i', c).textContent = label || '';
        });
        TV.sfx.pop();
      },
      mark(idxs, cls) { idxs.forEach(i => { if (at(i)) at(i).classList.add(cls); }); },
    };
  }
  const GROUP_COLORS = ['#fcc419', '#69db7c', '#74c0fc', '#f783ac', '#b197fc'];

  // ---------- Sơ đồ đoạn thẳng (tìm số chưa biết) ----------
  // rows: [{ total: '26', parts: [{ label: 'A', value: 19, hide?: true, c?: 0 }, …] }]
  // Phần có hide là ô cần tìm (tô sọc). Tổng cũng có thể là ô cần tìm (totalHide).
  function bar(box, rows) {
    box.innerHTML = rows.map(r => `<div class="barm">
        <div class="barm-total ${r.totalHide ? 'unk' : ''}"><span>${esc(r.total)}</span></div>
        <div class="barm-row">${r.parts.map((p, i) => `<div class="seg s${p.c != null ? p.c : i % 3} ${p.hide ? 'unk' : ''}" style="flex:${p.value}"><b>${esc(p.label)}</b></div>`).join('')}</div>
      </div>`).join('');
    const bars = $$('.barm', box);
    return {
      reveal(row, i, text) {
        const s = $$('.seg', bars[row])[i];
        s.classList.remove('unk');
        s.classList.add('new');
        $('b', s).textContent = text;
        TV.sfx.pop();
      },
      total(row, text) {
        const t = $('.barm-total', bars[row]);
        t.classList.remove('unk');
        t.classList.add('new');
        $('span', t).textContent = text;
        TV.sfx.pop();
      },
    };
  }

  // ---------- Chấm tròn xếp đôi (chẵn – lẻ) ----------
  // Số chẵn: chấm nào cũng có bạn. Số lẻ: thừa 1 chấm lẻ loi.
  function pairs(box, n, hideAnswer) {
    const odd = n % 2;
    box.innerHTML = `<div class="pairs">${'<span class="pair"><i></i><i></i></span>'.repeat(Math.floor(n / 2))}${odd ? '<span class="pair lone"><i></i></span>' : ''}</div>
      <p class="pairs-say" ${hideAnswer ? 'hidden' : ''}><b>${n}</b> là số <b class="${odd ? 'odd-t' : 'even-t'}">${odd ? 'lẻ (odd)' : 'chẵn (even)'}</b>: ${odd ? 'còn 1 chấm lẻ loi' : 'chấm nào cũng có bạn'}</p>`;
    return { show() { $('.pairs-say', box).hidden = false; $$('.lone', box).forEach(e => e.classList.add('hl')); TV.sfx.pop(); } };
  }

  TV.vis = { ABC, seq, alpha, chips, bar, pairs, GROUP_COLORS };
})();
