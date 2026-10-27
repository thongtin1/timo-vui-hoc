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
      count(a, b) { this.walk(a, ABC.indexOf(b) - ABC.indexOf(a)); },
      // Đi d bước từ chữ a (d âm là lùi). Hết Z thì vòng lại A, lùi quá A thì vòng về Z.
      walk(a, d) {
        timers.forEach(clearTimeout);
        timers = [];
        $$('.abc-cell.cnt', box).forEach(e => { e.classList.remove('cnt'); delete e.dataset.n; });
        const i = ABC.indexOf(a), go = d > 0 ? 1 : -1;
        if (i < 0 || !d) return;
        for (let s = 1; s <= Math.abs(d); s++) {
          const e = cell(ABC[(((i + go * s) % 26) + 26) % 26]), last = s === Math.abs(d), n = s;
          timers.push(setTimeout(() => { e.classList.add('cnt'); e.dataset.n = n; if (last) e.classList.add('ans'); TV.sfx.hop(); }, n * 450));
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

  const NS = 'http://www.w3.org/2000/svg';
  // Thêm một hình SVG con (vd đoạn thẳng, nhãn số) vào hình có sẵn
  function addSvg(svg, tag, attrs, text) {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    if (text != null) el.textContent = text;
    svg.appendChild(el);
    return el;
  }
  // Nhãn số tròn nhỏ (dùng để đếm 1, 2, 3… trên hình)
  function badge(svg, x, y, n, color) {
    addSvg(svg, 'circle', { cx: x, cy: y, r: 10, fill: color || '#e8590c', class: 'v-pop' });
    addSvg(svg, 'text', { x, y: y + 4, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: '#fff', class: 'v-pop' }, n);
  }
  // Chạy lần lượt các việc, mỗi việc cách nhau ms (để bé kịp đếm theo)
  function stagger(list, ms, timers) {
    list.forEach((fn, i) => timers.push(setTimeout(() => { fn(); TV.sfx.hop(); }, (i + 1) * (ms || 450))));
  }

  // ---------- Đồng hồ: kim giờ nhảy từng giờ ----------
  function clock(box, h) {
    const nums = Array.from({ length: 12 }, (_, i) => {
      const n = i + 1, a = (n * 30 - 90) * Math.PI / 180;
      return `<text class="ck-n" data-n="${n}" x="${100 + 72 * Math.cos(a)}" y="${106 + 72 * Math.sin(a)}" text-anchor="middle">${n}</text>`;
    }).join('');
    const ticks = Array.from({ length: 60 }, (_, i) => {
      const a = i * 6 * Math.PI / 180, r1 = i % 5 ? 88 : 84;
      return `<line x1="${100 + r1 * Math.sin(a)}" y1="${100 - r1 * Math.cos(a)}" x2="${100 + 92 * Math.sin(a)}" y2="${100 - 92 * Math.cos(a)}" stroke="#adb5bd" stroke-width="${i % 5 ? 1 : 2.5}"/>`;
    }).join('');
    box.innerHTML = `<div class="v-clock"><svg viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="96" fill="#fff" stroke="#7048e8" stroke-width="6"/>${ticks}${nums}
        <g class="ck-min"><line x1="100" y1="100" x2="100" y2="26" stroke="#74c0fc" stroke-width="5" stroke-linecap="round"/></g>
        <g class="ck-hour" style="transform: rotate(${(h % 12) * 30}deg)"><line x1="100" y1="100" x2="100" y2="48" stroke="#e8590c" stroke-width="8" stroke-linecap="round"/></g>
        <circle cx="100" cy="100" r="7" fill="#2b2d42"/>
      </svg><p class="ck-say"><b>${h}</b> giờ</p></div>`;
    let deg = (h % 12) * 30, cur = h, timers = [];
    const hand = $('.ck-hour', box);
    return {
      // Kim giờ đi d giờ (d âm là lùi), số đi qua được tô màu và đếm
      walk(d) {
        timers.forEach(clearTimeout);
        timers = [];
        $$('.ck-n', box).forEach(e => e.classList.remove('cnt', 'ans'));
        const go = d > 0 ? 1 : -1;
        stagger(Array.from({ length: Math.abs(d) }, (_, s) => () => {
          deg += go * 30;
          cur = ((cur - 1 + go + 12) % 12) + 1;
          hand.style.transform = `rotate(${deg}deg)`;
          const n = $(`.ck-n[data-n="${cur}"]`, box);
          n.classList.add('cnt');
          if (s === Math.abs(d) - 1) n.classList.add('ans');
          $('.ck-say', box).innerHTML = `${go > 0 ? 'Đếm tiếp' : 'Đếm lùi'} ${s + 1}: <b>${cur}</b> giờ`;
        }), 550, timers);
      },
    };
  }

  // ---------- Hàng người xếp hàng dọc ----------
  // total bạn, bạn thứ "at" (đếm từ đầu hàng, từ 1) là nhân vật chính. Đầu hàng ở bên trái.
  function queue(box, total, at) {
    box.innerHTML = `<div class="queue"><span class="q-head">⬅️ Đầu hàng</span>${Array.from({ length: total }, (_, i) =>
      `<span class="kid ${i + 1 === at ? 'me' : ''}" data-i="${i + 1}">${i + 1 === at ? '🧒' : '🙂'}</span>`).join('')}<span class="q-head">Cuối hàng ➡️</span></div>`;
    return {
      // Tô các bạn từ vị trí a tới b (tính từ 1), đánh số đếm 1, 2, 3…
      mark(a, b, cls) {
        for (let i = a, n = 1; i <= b; i++, n++) {
          const k = $(`.kid[data-i="${i}"]`, box);
          if (k) { k.classList.add(cls); k.dataset.n = n; }
        }
        TV.sfx.pop();
      },
    };
  }

  // ---------- Các nhóm đồ vật (hộp trứng, gói kẹo, nhóm ngôi sao…) ----------
  // list: [{ icon, n, label }]. Mỗi nhóm là 1 khung, trong khung có n đồ vật.
  function groups(box, list) {
    box.innerHTML = '<div class="groups"></div>';
    const wrap = $('.groups', box);
    const tool = {
      add(items, cls) {
        items.forEach(g => {
          const d = document.createElement('div');
          d.className = `grp-box ${cls || ''} ${g.cls || ''}`;
          d.innerHTML = `<div class="grp-items">${g.n > 20 ? `<span class="grp-big">${g.icon} × ${g.n}</span>` : esc(g.icon).repeat(g.n)}</div>${g.label ? `<small>${esc(g.label)}</small>` : ''}`;
          wrap.appendChild(d);
        });
        if (cls) TV.sfx.pop();
      },
      mark(idxs, cls) { idxs.forEach(i => { const g = wrap.children[i]; if (g) g.classList.add(cls || 'hl'); }); TV.sfx.pop(); },
      label(i, text) { const g = wrap.children[i]; if (g) { let s = $('small', g); if (!s) { s = document.createElement('small'); g.appendChild(s); } s.textContent = text; } },
    };
    tool.add(list);
    return tool;
  }

  // ---------- Que chục và khối đơn vị (cấu tạo số) ----------
  function blocks(box, n) {
    const t = Math.floor(n / 10) % 10, u = n % 10, h = Math.floor(n / 100);
    box.innerHTML = `<div class="blocks">
        ${h ? `<div class="blk-part blk-h">${'<span class="hund"></span>'.repeat(h)}<small><b>${h}</b> trăm</small></div>` : ''}
        <div class="blk-part blk-t">${'<span class="ten"></span>'.repeat(t)}<small><b>${t}</b> chục</small></div>
        <div class="blk-part blk-u"><div class="units">${'<span class="unit"></span>'.repeat(u)}</div><small><b>${u}</b> đơn vị</small></div>
      </div>`;
    return { mark(part) { const e = $(`.blk-${part}`, box); if (e) e.classList.add('hl'); TV.sfx.pop(); } };
  }

  // ---------- Đoạn thẳng: các điểm trên một đường thẳng ----------
  // lines: [['A','B','C'], ['M','N']] – mỗi đường thẳng một hàng điểm
  const SEG_COLORS = ['#e64980', '#7048e8', '#1c7ed6', '#2f9e44', '#e8590c', '#0c8599'];
  function segs(box, lines) {
    const W = 300, rowH = 110;
    box.innerHTML = `<div class="v-svg"><svg viewBox="0 0 ${W} ${rowH * lines.length}" aria-hidden="true"></svg></div>`;
    const svg = $('svg', box), pos = {};
    lines.forEach((pts, r) => {
      const y = r * rowH + 82, gap = (W - 40) / Math.max(1, pts.length - 1);
      addSvg(svg, 'line', { x1: 20, y1: y, x2: W - 20, y2: y, stroke: '#2b2d42', 'stroke-width': 3 });
      pts.forEach((p, i) => {
        const x = 20 + i * gap;
        pos[p] = { x, y };
        addSvg(svg, 'circle', { cx: x, cy: y, r: 6, fill: '#2b2d42' });
        addSvg(svg, 'text', { x, y: y + 24, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800 }, p);
      });
    });
    let k = 0, timers = [];
    return {
      // Vẽ các đoạn từ điểm p tới mọi điểm phía sau nó trên cùng đường thẳng (vòng cung để bé đếm)
      from(p) {
        const line = lines.find(l => l.includes(p)), color = SEG_COLORS[k++ % SEG_COLORS.length];
        const rest = line.slice(line.indexOf(p) + 1), a = pos[p];
        stagger(rest.map((q, i) => () => {
          const b = pos[q], mid = (a.x + b.x) / 2, hgt = 14 + (b.x - a.x) * 0.22;
          addSvg(svg, 'path', { d: `M${a.x} ${a.y - 8} Q${mid} ${a.y - 8 - hgt * 2} ${b.x} ${b.y - 8}`, fill: 'none', stroke: color, 'stroke-width': 3, class: 'v-draw' });
          badge(svg, mid, a.y - 8 - hgt, i + 1, color);
        }), 400, timers);
      },
    };
  }

  // ---------- Lưới ô vuông: đếm hình vuông ----------
  function grid(box, rows, cols) {
    const s = 40, pad = 6;
    const W = cols * s + pad * 2, H = rows * s + pad * 2;
    let cells = '';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells += `<rect x="${pad + c * s}" y="${pad + r * s}" width="${s}" height="${s}" fill="#fff" stroke="#2b2d42" stroke-width="2.5"/>`;
    box.innerHTML = `<div class="v-svg v-grid"><svg viewBox="0 0 ${W} ${H}" style="max-width:${Math.min(W * 1.6, 320)}px" aria-hidden="true">${cells}<rect class="g-mark" x="0" y="0" width="0" height="0" fill="rgba(252,196,25,.45)" stroke="#e8590c" stroke-width="4" rx="4"/></svg><p class="g-say"></p></div>`;
    const svg = $('svg', box), mk = $('.g-mark', box), say = $('.g-say', box);
    let timers = [];
    return {
      // Lần lượt tô từng hình vuông cạnh k ô, đếm 1, 2, 3…
      show(k) {
        timers.forEach(clearTimeout);
        timers = [];
        const spots = [];
        for (let r = 0; r + k <= rows; r++) for (let c = 0; c + k <= cols; c++) spots.push([r, c]);
        stagger(spots.map(([r, c], i) => () => {
          Object.entries({ x: pad + c * s + 3, y: pad + r * s + 3, width: k * s - 6, height: k * s - 6 }).forEach(([a, v]) => mk.setAttribute(a, v));
          if (k === 1) addSvg(svg, 'text', { x: pad + c * s + s / 2, y: pad + r * s + s / 2 + 6, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: '#e8590c' }, i + 1);
          say.innerHTML = `Hình vuông ${k} × ${k} ô: <b>${i + 1}</b>`;
        }), 500, timers);
      },
    };
  }

  // ---------- Đa giác: đếm cạnh, đếm góc ----------
  // pts: các đỉnh [[x, y], …] trong khung 0..100
  function poly(box, pts) {
    const sc = 2.2, P = pts.map(([x, y]) => [x * sc + 20, y * sc + 20]);
    const cx = P.reduce((a, p) => a + p[0], 0) / P.length, cy = P.reduce((a, p) => a + p[1], 0) / P.length;
    box.innerHTML = `<div class="v-svg"><svg viewBox="0 0 260 260" style="max-width:280px" aria-hidden="true">
        <polygon points="${P.map(p => p.join(',')).join(' ')}" fill="#e5dbff" stroke="#2b2d42" stroke-width="3" stroke-linejoin="round"/></svg></div>`;
    const svg = $('svg', box);
    let timers = [];
    return {
      sides() {
        stagger(P.map((a, i) => () => {
          const b = P[(i + 1) % P.length];
          addSvg(svg, 'line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#e8590c', 'stroke-width': 6, 'stroke-linecap': 'round', class: 'v-draw' });
          badge(svg, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, i + 1);
        }), 450, timers);
      },
      // Đánh số mỗi góc ở phía trong, gần đỉnh
      angles() {
        stagger(P.map((a, i) => () => {
          const dx = cx - a[0], dy = cy - a[1], d = Math.hypot(dx, dy) || 1;
          addSvg(svg, 'circle', { cx: a[0], cy: a[1], r: 7, fill: '#1c7ed6', class: 'v-pop' });
          badge(svg, a[0] + (dx / d) * 22, a[1] + (dy / d) * 22, i + 1, '#1c7ed6');
        }), 450, timers);
      },
    };
  }

  // ---------- Khối lập phương xếp chồng (vẽ nghiêng 3D) ----------
  // h[r][c] = số khối chồng lên nhau ở ô hàng r, cột c (hàng 0 ở phía sau)
  function cubes(box, h) {
    const s = 26, P = (x, y, z) => [(x - y) * 0.866 * s, (x + y) * 0.5 * s - z * s];
    const list = [];
    h.forEach((row, r) => row.forEach((n, c) => { for (let z = 0; z < n; z++) list.push({ x: c, y: r, z }); }));
    list.sort((a, b) => (a.x + a.y) - (b.x + b.y) || a.z - b.z);
    const pts = [];
    const face = (cs, fill, z) => {
      const p = cs.map(([x, y, zz]) => P(x, y, zz));
      pts.push(...p);
      return `<polygon class="cb z${z}" points="${p.map(q => q.join(',')).join(' ')}" fill="${fill}" stroke="#2b2d42" stroke-width="1.5" stroke-linejoin="round"/>`;
    };
    const body = list.map(({ x, y, z }) => face([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], '#d0bfff', z)
      + face([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]], '#9775fa', z)
      + face([[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], '#b197fc', z)).join('');
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x0 = Math.min(...xs) - 4, y0 = Math.min(...ys) - 4, w = Math.max(...xs) - x0 + 4, hh = Math.max(...ys) - y0 + 4;
    box.innerHTML = `<div class="v-svg v-cubes"><svg viewBox="${x0} ${y0} ${w} ${hh}" style="max-width:${Math.min(w * 1.5, 300)}px" aria-hidden="true">${body}</svg></div>`;
    return {
      // Tô vàng các khối ở tầng z (tầng dưới cùng là 0)
      layer(z) { $$(`.cb.z${z}`, box).forEach(p => p.classList.add('hl')); TV.sfx.pop(); },
    };
  }

  // ---------- Tiền xu ----------
  // list: [{ v: 1, n: 8 }, { v: 2, n: 4 }]
  function coins(box, list) {
    const row = (v, n, cls) => `<div class="coin-row">${Array.from({ length: n }, () => `<span class="coin c${v} ${cls || ''}">$${v}</span>`).join('')}</div>`;
    box.innerHTML = `<div class="coins">${list.map(c => row(c.v, c.n)).join('')}<div class="coin-out"></div></div>`;
    return {
      // Đổi ra n đồng mệnh giá to (mặc định $5), còn thừa r đô
      change(n, r, to) {
        $('.coin-out', box).innerHTML = `<p>Đổi được:</p>${row(to || 5, n, 'v-pop')}${r ? `<p class="muted">Còn thừa ${r} đô</p>` : ''}`;
        TV.sfx.ting();
      },
    };
  }

  // ---------- Cái cân ----------
  // list: [{ left: '🍎', right: '🍊🍊', tilt: 0 }] – tilt: 0 thăng bằng, -1 bên trái nặng hơn, 1 bên phải nặng hơn
  function scales(box, list) {
    box.innerHTML = `<div class="scales">${list.map((s, i) => {
      const t = (s.tilt || 0) * -10;
      return `<div class="scale-one"><svg viewBox="0 0 220 150" aria-hidden="true">
          <polygon points="110,62 92,140 128,140" fill="#adb5bd"/><rect x="60" y="138" width="100" height="8" rx="4" fill="#868e96"/>
          <g style="transform: rotate(${t}deg); transform-origin: 110px 62px">
            <rect x="18" y="58" width="184" height="8" rx="4" fill="#495057"/>
            <path d="M14 66 Q50 96 86 66" fill="#ffe8cc" stroke="#495057" stroke-width="3"/>
            <path d="M134 66 Q170 96 206 66" fill="#ffe8cc" stroke="#495057" stroke-width="3"/>
            <text x="50" y="58" text-anchor="middle" font-size="${s.left.length > 6 ? 18 : 26}">${esc(s.left)}</text>
            <text x="170" y="58" text-anchor="middle" font-size="${s.right.length > 6 ? 18 : 26}">${esc(s.right)}</text>
          </g><circle cx="110" cy="62" r="6" fill="#2b2d42"/></svg><small>Cân ${i + 1}</small></div>`;
    }).join('')}</div>`;
    return { mark(i) { const e = $$('.scale-one', box)[i]; if (e) e.classList.add('hl'); TV.sfx.pop(); } };
  }

  TV.vis = { ABC, seq, alpha, chips, bar, pairs, GROUP_COLORS, clock, queue, groups, blocks, segs, grid, poly, cubes, coins, scales };
})();
