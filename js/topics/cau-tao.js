/* Chủ đề: Cấu tạo số – chục, đơn vị, số có mấy chữ số (Number theory) */
(function (root) {
  'use strict';
  const { rand, pick, shuffle } = root.TVData;
  const V = () => root.TV.vis;

  // Ghép số từ trăm, chục, đơn vị
  function makeQ(o) {
    const { h = 0, t, u } = o, calc = h * 100 + t * 10 + u;
    const parts = [h ? `${h} trăm` : '', `${t} chục`, `${u} đơn vị`].filter(Boolean).join(', ');
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 1,
      en: `What number has ${h ? `${h} hundred${h > 1 ? 's' : ''}, ` : ''}${t} ten${t === 1 ? '' : 's'} and ${u} one${u === 1 ? '' : 's'}?`,
      vi: `Số gồm ${parts} là số nào?`,
      wrong: [h ? h * 100 + u * 10 + t : u * 10 + t, calc + 10, h + t + u],
      visual: box => V().blocks(box, calc),
      steps: [
        ...(h ? [{ text: `💯 ${h} trăm → chữ số hàng trăm là <b>${h}</b>.`, run: tl => tl.mark('h') }] : []),
        { text: `🟦 ${t} chục (${t} que chục) → chữ số hàng chục là <b>${t}</b>.`, run: tl => tl.mark('t') },
        { text: `🟨 ${u} đơn vị (${u} khối lẻ) → chữ số hàng đơn vị là <b>${u}</b>.`, run: tl => tl.mark('u') },
        { text: `✍️ Viết lần lượt từ trái sang phải: ${[h || '', t, u].join(' ').trim()} → <b>${calc}</b>` },
        { text: `🎉 Đáp án: <b>${calc}</b>` },
      ],
    };
  }

  // Số n có mấy chục (hoặc chữ số hàng chục / đơn vị)
  function tensQ(o) {
    const { n } = o, t = Math.floor(n / 10) % 10, u = n % 10, ask = o.ask || 'tens', calc = ask === 'tens' ? t : u;
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 1,
      en: ask === 'tens' ? `What is the tens digit of ${n}?` : `What is the ones digit of ${n}?`,
      vi: ask === 'tens' ? `Số ${n} có chữ số hàng chục là mấy?` : `Số ${n} có chữ số hàng đơn vị là mấy?`,
      wrong: [ask === 'tens' ? u : t, n],
      visual: box => V().blocks(box, n),
      steps: [
        { text: `🔢 ${n} gồm <b>${t}</b> chục và <b>${u}</b> đơn vị.`, run: tl => tl.mark(ask === 'tens' ? 't' : 'u') },
        { text: `👉 Chữ số bên trái là hàng chục (${t}), chữ số bên phải là hàng đơn vị (${u}).` },
        { text: `🎉 Đáp án: <b>${calc}</b>` },
      ],
    };
  }

  // Đếm các số có k chữ số trong dãy
  function digitsQ(o) {
    const { nums, k } = o, keep = nums.map((v, i) => i).filter(i => String(nums[i]).length === k), calc = keep.length;
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 1,
      en: `How many ${k}-digit numbers are there? ${nums.join(', ')}`,
      vi: `Cho các số: ${nums.join(', ')}. Có bao nhiêu số có ${k} chữ số?`,
      wrong: [nums.length - calc, calc + 1],
      visual: box => V().chips(box, nums.map(String)),
      steps: [
        { text: `🔢 Đếm số chữ số của từng số. Số có ${k} chữ số: ${keep.map(i => nums[i]).join(', ')}.`, run: tl => tl.mark(keep, 'pick') },
        { text: `🎉 Đáp án: có <b>${calc}</b> số` },
      ],
    };
  }

  // Câu hỏi "số lớn nhất / nhỏ nhất có k chữ số", "số tròn chục lớn nhất có 2 chữ số"…
  const SPECIAL = {
    max2: { calc: 99, en: 'What is the greatest 2-digit number?', vi: 'Số lớn nhất có 2 chữ số là số nào?', why: '⬆️ Muốn lớn nhất: chữ số nào cũng lớn nhất là 9 → 9 và 9.' },
    min2: { calc: 10, en: 'What is the smallest 2-digit number?', vi: 'Số nhỏ nhất có 2 chữ số là số nào?', why: '⬇️ Muốn nhỏ nhất: chữ số đầu nhỏ nhất là 1 (không được là 0), chữ số sau là 0.' },
    min3: { calc: 100, en: 'What is the smallest 3-digit number?', vi: 'Số nhỏ nhất có 3 chữ số là số nào?', why: '⬇️ Chữ số đầu nhỏ nhất là 1, hai chữ số sau là 0 và 0.' },
    max1: { calc: 9, en: 'What is the greatest 1-digit number?', vi: 'Số lớn nhất có 1 chữ số là số nào?', why: '🔢 Số có 1 chữ số là 0, 1, 2… 9. Lớn nhất là 9.' },
    tens2: { calc: 90, en: 'What is the greatest 2-digit tens number (ending in 0)?', vi: 'Số tròn chục lớn nhất có 2 chữ số là số nào?', why: '🔟 Số tròn chục có chữ số cuối là 0: 10, 20… 90. Lớn nhất là 90.' },
  };
  function specialQ(key, o) {
    const s = SPECIAL[key];
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : s.calc, calc: s.calc, hint: 1, en: s.en, vi: s.vi,
      wrong: [s.calc + 1, s.calc - 1, s.calc * 10],
      steps: [{ text: s.why }, { text: `🎉 Đáp án: <b>${s.calc}</b>` }],
    };
  }

  function gen() {
    const k = rand(1, 4);
    if (k === 1) return makeQ({ t: rand(1, 9), u: rand(0, 9) });
    if (k === 2) return tensQ({ n: rand(11, 99), ask: pick(['tens', 'ones']) });
    if (k === 3) return makeQ({ h: rand(1, 3), t: rand(0, 9), u: rand(0, 9) });
    const nums = shuffle([rand(1, 9), rand(10, 99), rand(10, 99), rand(100, 500), rand(10, 99), rand(100, 500), rand(1, 9)]);
    return digitsQ({ nums, k: pick([1, 2, 3]) });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'cau-tao', part: 'C', icon: '🧱', title: 'Cấu tạo số', sub: 'Chục và đơn vị',
    intro: 'Mỗi số được ghép từ các que chục và khối lẻ. Biết số có mấy chục, mấy đơn vị là hiểu số đó!',
    words: [
      { en: 'Digit', vi: 'Chữ số', icon: '🔢' },
      { en: 'Tens', vi: 'Hàng chục', icon: '🟦' },
      { en: 'Ones', vi: 'Hàng đơn vị', icon: '🟨' },
      { en: 'Hundreds', vi: 'Hàng trăm', icon: '💯' },
      { en: '2-digit number', vi: 'Số có 2 chữ số', icon: '2️⃣' },
      { en: '3-digit number', vi: 'Số có 3 chữ số', icon: '3️⃣' },
      { en: 'Greatest / Smallest', vi: 'Lớn nhất / Nhỏ nhất', icon: '↕️' },
    ],
    tips: [
      '🟦 1 chục = 10. 🟨 Đơn vị là các khối lẻ.',
      '✍️ 4 chục và 7 đơn vị viết là 47: chục bên trái, đơn vị bên phải.',
      '⚠️ Số có 2 chữ số không bắt đầu bằng 0. Số nhỏ nhất có 2 chữ số là 10.',
    ],
    examples: [
      makeQ({ title: 'Ví dụ 1 · Ghép số', t: 3, u: 5 }),
      tensQ({ title: 'Ví dụ 2 · Số có mấy chục?', n: 62 }),
      specialQ('min2', { title: 'Ví dụ 3 · Số nhỏ nhất có 2 chữ số' }),
    ],
    gen,
    test: [
      makeQ({ src: 'Giống đề TIMO', t: 4, u: 7, answer: 47 }),
      makeQ({ src: 'Giống đề TIMO', t: 6, u: 0, answer: 60 }),
      tensQ({ src: 'Giống đề TIMO', n: 58, answer: 5 }),
      makeQ({ src: 'Giống đề TIMO', h: 1, t: 2, u: 5, answer: 125 }),
      digitsQ({ src: 'Đề 1 · Câu 21', nums: [12, 117, 36, 41, 140, 53, 312, 96], k: 3, answer: 3 }),
      specialQ('max2', { src: 'Giống đề TIMO', answer: 99 }),
      specialQ('min3', { src: 'Giống đề TIMO', answer: 100 }),
      specialQ('tens2', { src: 'Giống đề TIMO', answer: 90 }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
