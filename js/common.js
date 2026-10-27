/* TIMO Vui Học – phần dùng chung cho mọi trang:
   Zoombe, đọc to, âm thanh, sao & sticker, tab, ví dụ từng bước, quiz, game lật thẻ.
   Cần nạp js/data.js trước file này. */
(function () {
  'use strict';
  const { rand, pick, shuffle } = window.TVData;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  // ---------- Lưu tiến độ (chỉ trong trình duyệt này) ----------
  const KEY = 'timo-vui-hoc-v1';
  // marks[lessonId][câu] = 'ok' (đúng ngay lần đầu) | 'retry' (đúng sau khi thử lại)
  // tests[lessonId] = { ans, done, got, score, best } – bài tự làm; spent = số sao đã đổi quà
  const fresh = () => ({ stars: 0, stickers: 0, log: {}, marks: {}, tests: {}, spent: 0, rewards: null, redeemed: [] });
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && typeof s === 'object') return Object.assign(fresh(), s);
    } catch (e) { /* trình duyệt chặn lưu trữ: vẫn chơi được, chỉ không nhớ */ }
    return fresh();
  }
  let state = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* bỏ qua */ } }

  // ---------- Zoombe ----------
  function zoombe(mood) {
    mood = mood || 'happy';
    const look = mood === 'think' ? -4 : 2;
    let mouth;
    if (mood === 'think') mouth = '<ellipse cx="60" cy="74" rx="6" ry="5" fill="#5b2121"/>';
    else if (mood === 'party') mouth = '<path d="M44 68 Q60 90 76 68 Z" fill="#5b2121"/><rect x="54" y="68" width="8" height="7" rx="1.5" fill="#fff"/>';
    else if (mood === 'oops') mouth = '<path d="M48 77 Q60 68 72 77" stroke="#3b2a1a" stroke-width="4" fill="none" stroke-linecap="round"/>';
    else mouth = '<path d="M46 69 Q60 82 74 69" stroke="#3b2a1a" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="55" y="73" width="7" height="6" rx="1.5" fill="#fff"/>';
    const hat = mood === 'party'
      ? '<path d="M44 20 L60 -8 L76 20 Z" fill="#f06595"/><path d="M49 11 L71 11" stroke="#fff" stroke-width="3"/><circle cx="60" cy="-8" r="5" fill="#fcc419"/>'
      : '';
    const extra = mood === 'think' ? '<text x="100" y="22" font-size="24" font-weight="800" fill="#7048e8">?</text>'
      : mood === 'oops' ? '<path d="M100 30 q4 8 0 12 q-4 -4 0 -12z" fill="#74c0fc"/>' : '';
    return `<svg class="zoombe-svg" viewBox="0 -12 120 152" aria-hidden="true">
      <rect x="6" y="94" width="36" height="14" rx="7" fill="#8bc34a" stroke="#558b2f" stroke-width="2"/>
      <rect x="78" y="94" width="36" height="14" rx="7" fill="#8bc34a" stroke="#558b2f" stroke-width="2"/>
      <path d="M34 88 H86 V136 L79 130 L72 136 L65 130 L58 136 L51 130 L44 136 L37 130 L34 133 Z" fill="#4dabf7" stroke="#1c7ed6" stroke-width="2"/>
      <rect x="22" y="14" width="76" height="76" rx="30" fill="#a9d86e" stroke="#558b2f" stroke-width="3"/>
      <path d="M26 32 Q32 8 46 22 Q52 4 62 20 Q70 4 80 22 Q92 10 95 34 Q80 23 62 27 Q44 22 26 32 Z" fill="#33691e"/>
      <path d="M84 36 L92 42 M86 42 L90 36" stroke="#558b2f" stroke-width="2" stroke-linecap="round"/>
      <circle cx="45" cy="52" r="12" fill="#fff" stroke="#558b2f" stroke-width="1.5"/>
      <circle cx="47" cy="${52 + look}" r="5.5" fill="#222"/><circle cx="49" cy="${50 + look}" r="1.8" fill="#fff"/>
      <circle cx="77" cy="53" r="9" fill="#fff" stroke="#558b2f" stroke-width="1.5"/>
      <circle cx="76" cy="${53 + look}" r="4.5" fill="#222"/><circle cx="78" cy="${51 + look}" r="1.5" fill="#fff"/>
      <circle cx="33" cy="69" r="5" fill="#ff8a80" opacity=".6"/><circle cx="87" cy="69" r="5" fill="#ff8a80" opacity=".6"/>
      ${mouth}${hat}${extra}
    </svg>`;
  }
  function mountZoombe(root) { $$('[data-zoombe]', root).forEach(el => { el.innerHTML = zoombe(el.dataset.zoombe); }); }
  function setMood(el, mood) { el.dataset.zoombe = mood; el.innerHTML = zoombe(mood); restart(el, 'bounce'); }
  // Cho Zoombe nói trong bong bóng (và đọc to)
  function talk(guide, html, mood, speakText) {
    const b = $('.bubble', guide);
    b.innerHTML = html;
    if (mood) setMood($('.zb', guide), mood);
    say(speakText != null ? speakText : b.textContent);
  }

  // ---------- Đọc to ----------
  let voices = [];
  const voiceListeners = [];
  function loadVoices() {
    try { voices = speechSynthesis.getVoices(); } catch (e) { voices = []; }
    voiceListeners.forEach(fn => fn());
  }
  if ('speechSynthesis' in window) {
    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
  }
  function pickVoice(lang) {
    const p = lang.slice(0, 2).toLowerCase();
    const mine = voices.filter(v => v.lang.replace('_', '-').toLowerCase().startsWith(p));
    // Ưu tiên giọng "Natural"/"Online" (Edge) hoặc Google vì nghe tự nhiên hơn
    return mine.find(v => /natural|online|google/i.test(v.name)) || mine[0] || null;
  }
  function clean(text, lang) {
    let t = String(text)
      .replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}️‍]/gu, ' ')
      .replace(/[→←↺]/g, ' ');
    t = lang === 'en'
      ? t.replace(/\+/g, ' plus ').replace(/=/g, ' equals ')
      : t.replace(/\+/g, ' cộng ').replace(/−/g, ' trừ ').replace(/=/g, ' bằng ');
    return t.replace(/\s+/g, ' ').trim();
  }
  function speakAll(parts) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    parts.forEach(p => {
      const text = clean(p.text, p.lang);
      if (!text) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = p.lang === 'en' ? 'en-US' : 'vi-VN';
      const v = pickVoice(u.lang);
      if (v) u.voice = v;
      u.rate = p.lang === 'en' ? 0.85 : 0.95;
      speechSynthesis.speak(u);
    });
  }
  const say = (text, lang) => speakAll([{ text, lang: lang || 'vi' }]);
  function voiceInfo() {
    return { supported: 'speechSynthesis' in window, vi: pickVoice('vi-VN'), en: pickVoice('en-US') };
  }

  // Bấm vào chữ nào có đánh dấu là đọc chữ đó
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-en], [data-say], .say');
    if (!el) return;
    if (el.dataset.en) speakAll([{ text: el.dataset.en, lang: 'en' }, { text: el.dataset.vi || '', lang: 'vi' }]);
    else say(el.dataset.say || el.textContent, el.dataset.lang || 'vi');
    restart(el, 'speaking');
  });

  // ---------- Âm thanh ----------
  let ac = null;
  function tone(freqs, dur, type, vol) {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume(); // iPhone: tiếng chỉ chạy sau khi bé chạm màn hình
      const t0 = ac.currentTime;
      freqs.forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain(), s = t0 + i * dur;
        o.type = type || 'sine';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, s);
        g.gain.exponentialRampToValueAtTime(vol || 0.2, s + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, s + dur);
        o.connect(g).connect(ac.destination);
        o.start(s);
        o.stop(s + dur + 0.05);
      });
    } catch (e) { /* không có âm thanh cũng không sao */ }
  }
  const sfx = {
    ting: () => tone([660, 880, 1320], 0.12),
    oops: () => tone([330, 247], 0.16, 'triangle'),
    hop: () => tone([440, 660], 0.07, 'triangle', 0.15),
    pop: () => tone([990], 0.08),
  };

  // ---------- Pháo giấy ----------
  function confetti(n) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#fa5252', '#fcc419', '#40c057', '#228be6', '#7950f2', '#e64980'];
    const box = document.createElement('div');
    box.className = 'confetti';
    for (let i = 0; i < (n || 70); i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      p.style.background = pick(colors);
      p.style.animationDelay = Math.random() * 0.4 + 's';
      p.style.animationDuration = 1.6 + Math.random() * 1.2 + 's';
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3400);
  }

  // ---------- Hộp thông báo ----------
  function modal(html, btnText, onClose) {
    const ov = document.createElement('div');
    ov.className = 'modal-ov';
    ov.innerHTML = `<div class="modal card pop-in"><div class="zb modal-zb" data-zoombe="party"></div>${html}<button class="btn btn-big">${btnText || 'OK'}</button></div>`;
    mountZoombe(ov);
    document.body.appendChild(ov);
    say($('.modal', ov).textContent.replace(btnText || 'OK', ''));
    $('button', ov).addEventListener('click', () => { ov.remove(); if (onClose) onClose(); });
  }

  // Hộp hỏi có 2 nút (Có / Không)
  function ask(html, yesText, noText, onYes, onNo) {
    const ov = document.createElement('div');
    ov.className = 'modal-ov';
    ov.innerHTML = `<div class="modal card pop-in"><div class="zb modal-zb" data-zoombe="think"></div><div class="ask-body">${html}</div>
      <div class="btn-row"><button class="btn btn-ghost btn-big m-no">${noText}</button><button class="btn btn-big m-yes">${yesText}</button></div></div>`;
    mountZoombe(ov);
    document.body.appendChild(ov);
    say($('.ask-body', ov).textContent);
    $('.m-yes', ov).addEventListener('click', () => { ov.remove(); if (onYes) onYes(); });
    $('.m-no', ov).addEventListener('click', () => { ov.remove(); if (onNo) onNo(); });
  }

  // ---------- Sao & sticker ----------
  // Sticker tính theo tổng sao đã kiếm (stars). Đổi quà chỉ trừ vào sao đang có (stars − spent).
  const available = () => Math.max(0, state.stars - state.spent);
  const STICKERS = ['🦁', '🐼', '🦄', '🐯', '🐨', '🦊', '🐸', '🐙', '🦖', '🐳', '🦋', '🐝', '🦉', '🐧', '🐬', '🦒', '🐘', '🦜', '🐞', '🐢'];
  const STARS_PER_STICKER = 10;

  function renderTopbar(pop) {
    const bar = $('#topbar');
    if (!bar) return;
    if (!bar.dataset.ready) {
      bar.innerHTML = `<a class="tb-home" href="index.html">🏠<span> Trang chủ</span></a>
        <span class="tb-title">TIMO Vui Học</span>
        <a class="tb-stars" href="album.html" title="Album sticker">⭐ <b id="tbStars">0</b><span class="tb-sep">🎁</span><b id="tbStickers">0</b></a>`;
      bar.dataset.ready = '1';
    }
    $('#tbStars').textContent = available();
    $('#tbStickers').textContent = state.stickers;
    if (pop) restart($('.tb-stars'), 'pop');
  }

  function addStars(n) {
    state.stars += n;
    const earned = Math.min(STICKERS.length, Math.floor(state.stars / STARS_PER_STICKER));
    const gotNew = earned > state.stickers;
    if (gotNew) state.stickers = earned;
    save();
    renderTopbar(true);
    if (gotNew) {
      setTimeout(() => {
        confetti(120);
        sfx.ting();
        modal(`<div class="sticker-new">${STICKERS[earned - 1]}</div><h2>Con nhận được sticker mới!</h2><p>Vào Album sticker để xem nhé.</p>`, 'Tuyệt vời!');
      }, 1400);
    }
  }

  // Ghi lại kết quả cho Góc phụ huynh
  function record(lessonId, label, firstTry) {
    const l = state.log[lessonId] || (state.log[lessonId] = { right: 0, wrong: 0, miss: {} });
    if (firstTry) l.right++;
    else { l.wrong++; l.miss[label] = (l.miss[label] || 0) + 1; }
    save();
  }
  // Quà bố mẹ đặt ra; giữ lại khi xóa tiến độ của bé
  const DEFAULT_REWARDS = [
    { id: 'r1', icon: '📺', name: '15 phút xem hoạt hình', cost: 15 },
    { id: 'r2', icon: '🍦', name: 'Một cây kem', cost: 20 },
    { id: 'r3', icon: '🏞️', name: 'Đi chơi công viên', cost: 40 },
    { id: 'r4', icon: '🧸', name: 'Một món đồ chơi nhỏ', cost: 60 },
  ];
  const getRewards = () => state.rewards || DEFAULT_REWARDS;
  function setRewards(list) { state.rewards = list; save(); }
  function redeem(r) {
    if (available() < r.cost) return false;
    state.spent += r.cost;
    state.redeemed.unshift({ icon: r.icon, name: r.name, cost: r.cost, at: Date.now() });
    save();
    renderTopbar(true);
    return true;
  }
  function resetAll() { state = Object.assign(fresh(), { rewards: state.rewards }); save(); renderTopbar(); }

  // ---------- Tab trong một bài ----------
  function tabs() {
    const btns = $$('[data-tab]');
    if (!btns.length) return;
    function open(id, scroll) {
      if (!id || !document.getElementById(id)) id = btns[0].dataset.tab;
      btns.forEach(b => b.classList.toggle('active', b.dataset.tab === id));
      // Điện thoại: thanh tab cuộn ngang, kéo tab đang mở vào trong màn hình
      const on = btns.find(b => b.dataset.tab === id), bar = $('#tabs');
      if (on && bar) bar.scrollLeft = Math.max(0, on.offsetLeft - bar.offsetLeft - 16);
      $$('.panel').forEach(p => p.classList.toggle('active', p.id === id));
      // Dùng "#tab-…" (không trùng id) để trình duyệt không tự cuộn xuống khi mở lại trang
      try { history.replaceState(null, '', '#tab-' + id); } catch (e) { /* file:// có thể chặn */ }
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      if (scroll) $('#tabs').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    btns.forEach(b => b.addEventListener('click', () => open(b.dataset.tab, false)));
    $$('[data-goto]').forEach(b => b.addEventListener('click', () => open(b.dataset.goto, true)));
    open(location.hash.replace(/^#(tab-)?/, ''), false);
  }

  // ---------- Ví dụ từng bước ----------
  // list: [{ text, run?, cls? }] – mỗi lần bấm "Tiếp theo" hiện thêm 1 bước
  function steps(el, list, opts) {
    opts = opts || {};
    el.innerHTML = '<ol class="step-list"></ol><div class="btn-row"><button class="btn btn-big step-next">Tiếp theo ▶</button><button class="btn btn-ghost step-again">↺ Làm lại</button></div>';
    const ol = $('ol', el), next = $('.step-next', el);
    let i = 0;
    function show(silent) {
      const s = list[i++];
      $$('li', ol).forEach(li => li.classList.remove('current'));
      const li = document.createElement('li');
      li.className = 'say current pop-in ' + (s.cls || '');
      li.innerHTML = s.text;
      ol.appendChild(li);
      if (s.run) s.run();
      if (!silent) say(li.textContent);
      if (i >= list.length) {
        next.disabled = true;
        next.textContent = 'Xong rồi! 🎉';
        if (!silent) { confetti(40); sfx.ting(); }
      }
    }
    function reset(silent) {
      ol.innerHTML = '';
      i = 0;
      next.disabled = false;
      next.textContent = 'Tiếp theo ▶';
      if (opts.onReset) opts.onReset();
      show(silent);
    }
    next.addEventListener('click', () => show(false));
    $('.step-again', el).addEventListener('click', () => reset(false));
    reset(true);
  }

  // ---------- Quiz ----------
  // cfg: { lessonId, total, get(i) → câu hỏi, visual?(box, q) → đồ dùng, onCorrect?(đồ dùng, q),
  //        picker? – hiện hàng nút số để bé tự chọn câu, nhớ câu đã làm }
  // câu hỏi: { en?, vi, tag?, choices: [{ value, html }], answer, steps: [html], hint? }
  const CHEER_OK = ['Đúng rồi! Con giỏi quá!', 'Tuyệt vời! Zoombe nhảy cẫng lên nè!', 'Chính xác! Con là siêu sao!', 'Hoan hô! Đúng rồi nha!'];
  const CHEER_TRY = ['Gần đúng rồi! Mình thử lại nhé!', 'Không sao đâu! Bấm Gợi ý xem nha.', 'Zoombe tin con làm được! Thử lần nữa nào!'];

  function quiz(el, cfg) {
    let idx = 0, firstTry = 0;

    const marks = () => state.marks[cfg.lessonId] || (state.marks[cfg.lessonId] = {});
    function numHtml(k) {
      const m = marks()[k];
      return `<button class="q-num ${k === idx ? 'cur' : ''} ${m || ''}" data-k="${k}" aria-label="Câu ${k + 1}">${k + 1}${m === 'ok' ? '<i>⭐</i>' : m === 'retry' ? '<i>✓</i>' : ''}</button>`;
    }
    function pickerHtml() {
      if (!cfg.picker) return '';
      return `<p class="tip q-picker-tip">👆 Bấm số để chọn câu. ⭐ = đúng ngay lần đầu · ✓ = đã làm đúng</p>
        <div class="q-picker">${Array.from({ length: cfg.total }, (_, k) => numHtml(k)).join('')}</div>`;
    }
    function bindPicker() {
      $$('.q-num', el).forEach(b => b.addEventListener('click', () => {
        idx = Number(b.dataset.k);
        render();
        sfx.pop();
      }));
    }
    function mark(firstGo) {
      if (!cfg.picker) return;
      const m = marks();
      if (m[idx] !== 'ok') m[idx] = firstGo ? 'ok' : 'retry';
      save();
      const old = $(`.q-num[data-k="${idx}"]`, el);
      if (old) { old.outerHTML = numHtml(idx); bindPicker(); }
    }

    function render() {
      if (idx >= cfg.total) { finish(); return; }
      const q = cfg.get(idx);
      const hintMax = q.hint != null ? q.hint : q.steps.length - 1;
      let tries = 0, shown = 0, done = false;
      el.innerHTML = `
        <div class="quiz pop-in">
          ${pickerHtml()}
          <div class="quiz-top"><span class="q-progress">Câu ${idx + 1}/${cfg.total}</span>${q.tag ? `<span class="q-tag">${esc(q.tag)}</span>` : ''}</div>
          ${q.en ? `<p class="q-en say" data-lang="en">${esc(q.en)}</p>` : ''}
          <p class="q-vi say">${esc(q.vi)}</p>
          <div class="q-visual"></div>
          <div class="choices"></div>
          <div class="guide guide-sm"><div class="zb" data-zoombe="think"></div><div class="bubble">Con chọn đáp án đúng nhé!</div></div>
          <ol class="q-hint step-list"></ol>
          <div class="btn-row">
            <button class="btn btn-ghost q-hint-btn">💡 Gợi ý</button>
            <button class="btn btn-big q-next" hidden>${idx + 1 >= cfg.total ? 'Xem kết quả 🏆' : 'Câu tiếp ➡️'}</button>
          </div>
        </div>`;
      mountZoombe(el);
      bindPicker();
      const guide = $('.guide', el), hint = $('.q-hint', el), hintBtn = $('.q-hint-btn', el);
      const nextBtn = $('.q-next', el), box = $('.choices', el);
      const tool = cfg.visual ? cfg.visual($('.q-visual', el), q) : null;

      function addStep() {
        const li = document.createElement('li');
        li.className = 'say pop-in';
        li.innerHTML = q.steps[shown++];
        hint.appendChild(li);
        return li;
      }
      hintBtn.disabled = hintMax <= 0;
      hintBtn.addEventListener('click', () => {
        if (shown < hintMax) say(addStep().textContent);
        if (shown >= hintMax) hintBtn.disabled = true;
      });

      q.choices.forEach(c => {
        const b = document.createElement('button');
        b.className = 'choice';
        b.innerHTML = c.html;
        b.addEventListener('click', () => {
          if (done) return;
          if (c.value === q.answer) {
            done = true;
            b.classList.add('right');
            $$('.choice', box).forEach(x => { x.disabled = true; });
            const got = tries === 0 ? 2 : 1;
            if (tries === 0) firstTry++;
            record(cfg.lessonId, q.vi, tries === 0);
            mark(tries === 0);
            sfx.ting();
            confetti(40);
            const cheer = pick(CHEER_OK);
            talk(guide, `${cheer} <b>+${got} ⭐</b>`, 'party', cheer);
            while (shown < q.steps.length) addStep();
            hintBtn.disabled = true;
            nextBtn.hidden = false;
            addStars(got);
            if (cfg.onCorrect) cfg.onCorrect(tool, q);
          } else {
            tries++;
            b.classList.add('wrong');
            b.disabled = true;
            sfx.oops();
            talk(guide, pick(CHEER_TRY), 'oops');
          }
        });
        box.appendChild(b);
      });

      nextBtn.addEventListener('click', () => {
        idx++;
        render();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    function finish() {
      el.innerHTML = `<div class="quiz quiz-end pop-in">
          ${pickerHtml()}
          <div class="zb zb-big" data-zoombe="party"></div>
          <h3>Con làm xong ${cfg.total} câu rồi! 🎉</h3>
          <p class="say">Đúng ngay lần đầu: ${firstTry} trên ${cfg.total} câu.</p>
          <button class="btn btn-big">Chơi lại ↺</button>
        </div>`;
      mountZoombe(el);
      bindPicker();
      confetti();
      sfx.ting();
      say(`Con làm xong rồi! Đúng ngay lần đầu ${firstTry} câu.`);
      $('button', el).addEventListener('click', () => { idx = 0; firstTry = 0; render(); });
    }

    render();
  }

  // ---------- Lời giải từng bước có hình ----------
  // Bước giải: html hoặc { text, run?(đồ dùng), cls? }. Bước có 🎉 được tô xanh (đáp án).
  // Mỗi lần "Làm lại", hình được vẽ lại từ đầu bằng q.visual(box).
  function solve(stepsEl, q, box) {
    let tool = null;
    const list = q.steps.map(s => (typeof s === 'string' ? { text: s } : s)).map(s => ({
      text: s.text,
      cls: s.cls || (/🎉/.test(s.text) ? 'answer' : ''),
      run: s.run ? () => s.run(tool) : null,
    }));
    steps(stepsEl, list, { onReset: () => { if (q.visual && box) tool = q.visual(box); } });
  }

  // ---------- Bài tự làm ----------
  // Bé làm hết các câu rồi mới nộp. Nộp xong mới chấm và xem cách giải từng bước.
  // cfg: { lessonId, questions: [câu] }
  // câu: { en?, vi, src?, type: 'num' | 'letter' | 'oddeven' | 'choice', answer, choices?: [{ value, html }],
  //        visual?(box) → đồ dùng, steps: [bước giải] }
  // Mỗi câu chỉ được cộng ⭐ một lần, làm lại không cộng thêm. Bài làm dở được nhớ lại.
  const ODD_EVEN = [{ value: 'even', html: '<b>Chẵn</b><small>even</small>' }, { value: 'odd', html: '<b>Lẻ</b><small>odd</small>' }];
  const norm = v => String(v).trim().toUpperCase();
  const filled = v => v != null && v !== '';
  const isRight = (q, v) => filled(v) && norm(v) === norm(q.answer);
  const listOf = q => (q.type === 'oddeven' ? ODD_EVEN : q.type === 'choice' ? q.choices : null);
  function answerHtml(q, v) {
    if (!filled(v)) return '<span class="muted">chưa làm</span>';
    const c = (listOf(q) || []).find(x => norm(x.value) === norm(v));
    return c ? `<span class="ans-chip">${c.html}</span>` : `<b class="ans-val">${esc(v)}</b>`;
  }

  // Ô điền đáp án: bàn phím số, bàn phím chữ, hoặc các nút chọn
  function answerPad(box, q, value, onChange) {
    let v = filled(value) ? String(value) : '';
    const list = listOf(q);
    if (list) {
      box.innerHTML = `<div class="choices" style="--cols:${list.length <= 4 ? list.length : 3}">${list.map(c =>
        `<button class="choice ${norm(c.value) === norm(v) ? 'picked' : ''}" data-v="${esc(c.value)}">${c.html}</button>`).join('')}</div>`;
      box.addEventListener('click', e => {
        const b = e.target.closest('.choice');
        if (!b) return;
        $$('.choice', box).forEach(x => x.classList.toggle('picked', x === b));
        v = b.dataset.v;
        sfx.pop();
        onChange(v);
      });
      return;
    }
    const keys = q.type === 'letter' ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').concat('⌫') : '1 2 3 4 5 6 7 8 9 ⌫ 0'.split(' ');
    box.innerHTML = `<div class="ans-show"><span>✏️ Con điền:</span><b class="ans-box">${v ? esc(v) : '?'}</b></div>
      <div class="keypad ${q.type}">${keys.map(k => `<button class="key-btn ${k === '⌫' ? 'del' : ''}" data-k="${k}">${k}</button>`).join('')}</div>`;
    box.addEventListener('click', e => {
      const b = e.target.closest('.key-btn');
      if (!b) return;
      const k = b.dataset.k;
      if (k === '⌫') v = v.slice(0, -1);
      else if (q.type === 'letter') { v = k; say(k, 'en'); }
      else if (v.length < 5) v = (v === '0' ? '' : v) + k;
      $('.ans-box', box).textContent = v || '?';
      restart($('.ans-box', box), 'pop');
      sfx.pop();
      onChange(v);
    });
  }

  function qHead(q, i, n) {
    return `<div class="quiz-top"><span class="q-progress">Câu ${i + 1}/${n}</span>${q.src ? `<span class="q-tag">${esc(q.src)}</span>` : ''}</div>
      ${q.en ? `<p class="q-en say" data-lang="en">${esc(q.en)}</p>` : ''}
      <p class="q-vi say">${esc(q.vi)}</p>`;
  }

  function selfTest(el, cfg) {
    const qs = cfg.questions, n = qs.length;
    const rec = () => state.tests[cfg.lessonId] || (state.tests[cfg.lessonId] = { ans: {}, done: false, got: {}, score: 0, best: 0 });
    let idx = 0;
    const toTop = () => { if (el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

    // mode: 'work' (đang làm) | 'result' (bảng điểm) | 'review' (xem cách giải)
    function picker(mode) {
      const r = rec();
      return `<div class="q-picker">${qs.map((q, k) => {
        let cls = '', mark = '';
        if (mode === 'work') cls = filled(r.ans[k]) ? 'filled' : '';
        else { const ok = isRight(q, r.ans[k]); cls = ok ? 'ok' : 'bad'; mark = `<i>${ok ? '⭐' : '✗'}</i>`; }
        if (mode !== 'result' && k === idx) cls += ' cur';
        return `<button class="q-num ${cls}" data-k="${k}" aria-label="Câu ${k + 1}">${k + 1}${mark}</button>`;
      }).join('')}</div>`;
    }
    function bindNums(go) {
      $$('.q-num', el).forEach(b => b.addEventListener('click', () => { idx = Number(b.dataset.k); sfx.pop(); go(); }));
    }
    function navRow(go, extra) {
      return `<div class="btn-row">
          <button class="btn btn-ghost t-prev" ${idx === 0 ? 'disabled' : ''}>⬅️ Câu trước</button>
          <button class="btn btn-ghost t-next" ${idx === n - 1 ? 'disabled' : ''}>Câu sau ➡️</button>
        </div>${extra || ''}`;
    }
    function bindNav(go) {
      $('.t-prev', el).addEventListener('click', () => { idx--; go(); toTop(); });
      $('.t-next', el).addEventListener('click', () => { idx++; go(); toTop(); });
    }

    function work() {
      const r = rec(), q = qs[idx];
      el.innerHTML = `<div class="quiz pop-in">
          <p class="tip q-picker-tip">👆 Bấm số để chuyển câu. Câu đã làm có màu xanh.</p>
          ${picker('work')}
          ${qHead(q, idx, n)}
          <div class="q-visual"></div>
          <div class="ans-area"></div>
          ${navRow(work, '<div class="btn-row"><button class="btn btn-big t-submit">📮 Nộp bài</button></div>')}
        </div>`;
      bindNums(work);
      bindNav(work);
      if (q.visual) q.visual($('.q-visual', el));
      answerPad($('.ans-area', el), q, r.ans[idx], v => {
        r.ans[idx] = v;
        save();
        $(`.q-num[data-k="${idx}"]`, el).classList.toggle('filled', filled(v));
      });
      $('.t-submit', el).addEventListener('click', () => {
        const blank = qs.filter((_, k) => !filled(r.ans[k])).length;
        if (blank) ask(`<h2>Còn ${blank} câu chưa làm</h2><p>Con muốn nộp bài luôn không?</p>`, '📮 Nộp bài', 'Làm tiếp', grade);
        else ask('<h2>Con làm hết rồi!</h2><p>Con nộp bài nhé?</p>', '📮 Nộp bài', 'Xem lại', grade);
      });
    }

    function grade() {
      const r = rec();
      let right = 0, gain = 0;
      qs.forEach((q, k) => {
        const ok = isRight(q, r.ans[k]);
        if (ok) { right++; if (!r.got[k]) { r.got[k] = true; gain += 2; } }
        record(cfg.lessonId, q.vi, ok);
      });
      Object.assign(r, { done: true, score: right, best: Math.max(r.best || 0, right) });
      save();
      result(gain, true);
      toTop();
      if (gain) addStars(gain);
    }

    function result(gain, justNow) {
      const r = rec(), right = r.score, good = right * 2 >= n;
      let msg = right === n ? 'Đúng hết luôn! Con giỏi quá!' : 'Mình cùng xem cách giải các câu ✗ nhé!';
      if (justNow) msg = (gain ? `Con nhận được ${gain} ⭐! ` : right ? 'Các câu đúng này con đã nhận ⭐ rồi. ' : '') + msg;
      el.innerHTML = `<div class="quiz quiz-end pop-in">
          <div class="zb zb-big" data-zoombe="${good ? 'party' : 'think'}"></div>
          <h3 class="say">Con đúng ${right} trên ${n} câu!</h3>
          <p class="say">${msg}</p>
          <p class="tip">👆 Bấm vào số câu để xem cách giải. ⭐ = đúng · ✗ = chưa đúng</p>
          ${picker('result')}
          <div class="btn-row"><button class="btn btn-big t-review">🔍 Xem cách giải</button><button class="btn btn-ghost t-again">↺ Làm lại bài</button></div>
        </div>`;
      mountZoombe(el);
      bindNums(review);
      if (justNow) {
        say(`Con đúng ${right} trên ${n} câu! ${msg}`);
        if (right) { confetti(); sfx.ting(); }
      }
      $('.t-review', el).addEventListener('click', () => {
        const wrong = qs.findIndex((q, k) => !isRight(q, r.ans[k]));
        idx = wrong < 0 ? 0 : wrong;
        review();
      });
      $('.t-again', el).addEventListener('click', () => ask('<h2>Làm lại bài từ đầu nhé?</h2><p>Các câu đã làm sẽ được xóa trắng.</p>', 'Làm lại', 'Thôi', () => {
        Object.assign(r, { ans: {}, done: false });
        save();
        idx = 0;
        work();
      }));
    }

    function review() {
      const r = rec(), q = qs[idx], v = r.ans[idx], ok = isRight(q, v);
      el.innerHTML = `<div class="quiz pop-in">
          ${picker('review')}
          ${qHead(q, idx, n)}
          <div class="verdict ${ok ? 'ok' : 'bad'}">
            <div>Con trả lời: ${answerHtml(q, v)} ${ok ? '✅' : '❌'}</div>
            ${ok ? '' : `<div>Đáp án đúng: ${answerHtml(q, q.answer)}</div>`}
          </div>
          <h3 class="sol-title">🪄 Cách giải <small class="tip">(bấm "Tiếp theo" để xem từng bước)</small></h3>
          <div class="${q.visual ? 'ex-layout' : ''}">${q.visual ? '<div class="q-visual"></div>' : ''}<div class="t-steps"></div></div>
          ${navRow(review, '<div class="btn-row"><button class="btn btn-big t-board">🏆 Về bảng điểm</button></div>')}
        </div>`;
      bindNums(review);
      bindNav(review);
      solve($('.t-steps', el), q, $('.q-visual', el));
      $('.t-board', el).addEventListener('click', () => { result(0, false); toTop(); });
    }

    if (rec().done) result(0, false);
    else work();
  }

  // ---------- Game lật thẻ ghép đôi ----------
  // cfg: { lessonId, pairs: [{ a: { text, lang, icon? }, b: {...} }], count }
  function memory(el, cfg) {
    function start() {
      const pairs = shuffle(cfg.pairs).slice(0, cfg.count || 6);
      const cards = shuffle(pairs.flatMap((p, id) => [{ id, ...p.a }, { id, ...p.b }]));
      let first = null, lock = false, matched = 0, misses = 0;
      el.innerHTML = `<p class="mem-info">Lật 2 thẻ cùng nghĩa nhé! Đã ghép: <b>0</b>/${pairs.length}</p>
        <div class="mem-grid"></div>
        <div class="btn-row"><button class="btn btn-ghost mem-again">↺ Chơi ván mới</button></div>`;
      const grid = $('.mem-grid', el), info = $('.mem-info', el);
      cards.forEach(c => {
        const b = document.createElement('button');
        b.className = 'mem-card';
        b.innerHTML = `<span class="mem-front">?</span><span class="mem-back ${c.lang === 'en' ? 'en' : ''}">${c.icon ? `<i>${c.icon}</i>` : ''}${esc(c.text)}</span>`;
        b.addEventListener('click', () => {
          if (lock || b.classList.contains('open')) return;
          b.classList.add('open');
          say(c.text, c.lang);
          if (!first) { first = { b, c }; return; }
          const f = first;
          first = null;
          if (f.c.id === c.id) {
            f.b.classList.add('matched');
            b.classList.add('matched');
            matched++;
            $('b', info).textContent = matched;
            sfx.ting();
            if (matched === pairs.length) {
              record(cfg.lessonId, 'Lật thẻ ghép đôi', misses <= pairs.length);
              setTimeout(() => {
                info.innerHTML = '🎉 Con ghép xong hết rồi! <b>+3 ⭐</b>';
                say('Con ghép xong hết rồi! Giỏi quá!');
                confetti();
                addStars(3);
              }, 700);
            }
          } else {
            misses++;
            lock = true;
            setTimeout(() => { f.b.classList.remove('open'); b.classList.remove('open'); lock = false; }, 1100);
          }
        });
        grid.appendChild(b);
      });
      $('.mem-again', el).addEventListener('click', start);
    }
    start();
  }

  // ---------- Nhắc nghỉ mắt sau 15 phút ----------
  function breakReminder() {
    const LIMIT = 15 * 60 * 1000;
    try {
      let t0 = Number(sessionStorage.getItem('tvh-start'));
      if (!t0) { t0 = Date.now(); sessionStorage.setItem('tvh-start', String(t0)); }
      setTimeout(() => {
        modal('<h2>Con học chăm quá!</h2><p>Mình nghỉ mắt 5 phút, uống nước rồi quay lại nhé.</p>', 'Vâng ạ!');
        sessionStorage.setItem('tvh-start', String(Date.now()));
      }, Math.max(LIMIT - (Date.now() - t0), 60 * 1000));
    } catch (e) { /* bỏ qua */ }
  }

  window.TV = {
    $, $$, esc, rand, pick, shuffle,
    zoombe, mountZoombe, setMood, talk,
    say, speakAll, voiceInfo, onVoices: fn => voiceListeners.push(fn),
    sfx, confetti, modal, ask,
    STICKERS, STARS_PER_STICKER, addStars, record, resetAll, getState: () => state,
    available, getRewards, setRewards, redeem,
    steps, solve, quiz, selfTest, memory, ODD_EVEN,
  };

  renderTopbar();
  mountZoombe();
  tabs();
  breakReminder();

  // Lưu trang để mở trên điện thoại khi không có mạng (chỉ chạy khi mở qua http/https)
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { /* bỏ qua */ }));
  }
})();
