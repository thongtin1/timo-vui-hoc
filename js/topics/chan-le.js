/* Chủ đề: Số chẵn – số lẻ (Number theory) */
(function (root) {
  'use strict';
  const { rand, pick, shuffle, evalExpr } = root.TVData;
  const V = () => root.TV.vis;
  const isEven = n => n % 2 === 0;
  const KIND = { even: 'chẵn', odd: 'lẻ' };
  const DIGITS = { even: '0, 2, 4, 6, 8', odd: '1, 3, 5, 7, 9' };
  const DOT = { even: '🔵', odd: '🟠' };
  const idxOf = (nums, kind) => nums.map((v, i) => i).filter(i => isEven(nums[i]) === (kind === 'even'));

  // Tìm số chẵn/lẻ lớn nhất hoặc nhỏ nhất (rank 2 = thứ hai) trong dãy
  function pickQ(o) {
    const { nums, kind, order, rank } = o;
    const want = idxOf(nums, kind);
    const sorted = want.slice().sort((a, b) => (order === 'max' ? nums[b] - nums[a] : nums[a] - nums[b]));
    const best = sorted[rank - 1], calc = nums[best];
    const what = `số ${KIND[kind]} ${order === 'max' ? 'lớn' : 'nhỏ'} ${rank === 1 ? 'nhất' : 'thứ hai'}`;
    return {
      src: o.src, title: o.title, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2,
      en: o.en || `By observing the numbers, which ${kind} number is the ${order === 'max' ? (rank === 1 ? 'greatest' : 'second greatest') : (rank === 1 ? 'smallest' : 'second smallest')}? ${nums.join(', ')}`,
      vi: `Quan sát các số sau. Tìm ${what}: ${nums.join(', ')}`,
      wrong: [nums[sorted[rank]], nums[sorted[0]], Math.max(...nums)],
      visual: box => V().chips(box, nums.map(String)),
      steps: [
        { text: `🔍 Số ${KIND[kind]} có chữ số cuối là ${DIGITS[kind]}.` },
        { text: `${DOT[kind]} Tô màu các số ${KIND[kind]}: ${want.map(i => nums[i]).join(', ')}.`, run: t => t.mark(want, kind) },
        { text: `${order === 'max' ? '⬆️ Xếp từ lớn đến bé' : '⬇️ Xếp từ bé đến lớn'}: ${sorted.map(i => nums[i]).join(', ')}.` },
        { text: `🎉 Đáp án: ${what} là <b>${calc}</b>`, run: t => t.mark([best], 'pick') },
      ],
    };
  }

  // Đếm số chẵn và số lẻ rồi tìm hơn kém
  function countQ(o) {
    const { nums } = o;
    const ev = idxOf(nums, 'even'), od = idxOf(nums, 'odd');
    const E = ev.length, O = od.length, calc = Math.abs(E - O);
    return {
      src: o.src, title: o.title, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2,
      en: o.en, vi: o.vi, wrong: [E, O, E + O],
      visual: box => V().chips(box, nums.map(String)),
      steps: [
        { text: `🔵 Tô xanh số chẵn: ${ev.map(i => nums[i]).join(', ')} → có <b>${E}</b> số.`, run: t => t.mark(ev, 'even') },
        { text: `🟠 Tô cam số lẻ: ${od.map(i => nums[i]).join(', ')} → có <b>${O}</b> số.`, run: t => t.mark(od, 'odd') },
        { text: `➖ Hơn kém: ${Math.max(E, O)} − ${Math.min(E, O)} = <b>${calc}</b>` },
        { text: `🎉 Đáp án: <b>${calc}</b>` },
      ],
    };
  }

  // Tổng nhiều số là chẵn hay lẻ? Ghép đôi các số lẻ: 2 số lẻ cộng lại thành số chẵn.
  function sumQ(o) {
    const { nums } = o;
    const od = idxOf(nums, 'odd'), O = od.length, p = Math.floor(O / 2);
    const calc = isEven(nums.reduce((a, b) => a + b, 0)) ? 'even' : 'odd';
    const tokens = nums.flatMap((v, i) => (i ? ['+', String(v)] : [String(v)]));
    return {
      src: o.src, title: o.title, type: 'oddeven', answer: o.answer || calc, calc, hint: 2,
      en: `Determine whether the result of ${nums.join(' + ')} is odd or even.`,
      vi: `Kết quả của ${nums.join(' + ')} là số chẵn hay số lẻ?`,
      visual: box => V().chips(box, tokens),
      steps: [
        { text: `🟠 Tìm các số lẻ: ${od.map(i => nums[i]).join(', ')} → có <b>${O}</b> số lẻ.`, run: t => t.mark(od, 'odd') },
        { text: `🤝 Hai số lẻ cộng lại thành số chẵn (vd 3 + 5 = 8). Ghép đôi: được ${p} cặp${O % 2 ? ', <b>còn thừa 1 số lẻ</b>' : ', <b>không thừa số nào</b>'}.`,
          run: t => { for (let k = 0; k < p; k++) t.group([od[2 * k], od[2 * k + 1]], V().GROUP_COLORS[k % 5], `cặp ${k + 1}`); } },
        { text: '🔵 Cộng thêm số chẵn thì kết quả không đổi chẵn – lẻ.', run: t => t.mark(idxOf(nums, 'even'), 'even') },
        { text: `🎉 Đáp án: tổng là số <b>${KIND[calc]} (${calc})</b>` },
      ],
    };
  }

  // Phép tính có cả + và −: kết quả chẵn hay lẻ? Cộng hay trừ một số lẻ đều làm đổi chẵn ↔ lẻ.
  function exprParityQ(o) {
    const tokens = o.expr.split(' '), nums = tokens.filter(t => /^\d+$/.test(t)).map(Number);
    const od = idxOf(nums, 'odd'), O = od.length, val = evalExpr(o.expr), calc = val % 2 ? 'odd' : 'even';
    return {
      src: o.src, title: o.title, type: 'oddeven', answer: o.answer || calc, calc, hint: 2,
      en: `Determine whether the result of ${o.expr} is odd or even.`,
      vi: `Kết quả của ${o.expr} là số chẵn hay số lẻ?`,
      visual: box => V().chips(box, tokens),
      steps: [
        { text: `🟠 Tìm các số lẻ: ${od.map(i => nums[i]).join(', ')} → có <b>${O}</b> số lẻ.`, run: t => t.mark(od, 'odd') },
        { text: '💡 Dấu + hay dấu − cũng vậy: hai số lẻ gặp nhau thì thành chẵn.' },
        { text: `🤝 Ghép đôi ${O} số lẻ: được ${Math.floor(O / 2)} cặp, ${O % 2 ? '<b>thừa 1 số lẻ</b> → kết quả lẻ' : '<b>không thừa</b> → kết quả chẵn'}.` },
        { text: `✅ Tính thử: ${o.expr} = ${val}. Đúng là số ${KIND[calc]}!` },
        { text: `🎉 Đáp án: số <b>${KIND[calc]} (${calc})</b>` },
      ],
    };
  }

  // VQG 2024–2025 · Câu 25: tính từng phép tính, đếm số chẵn nhỏ hơn 20
  const EXPRS = ['9 + 6', '15 + 6', '49 − 31', '57 − 27', '9 + 13', '8 + 6', '38 − 26'];
  const vals = EXPRS.map(evalExpr);
  const evIdx = vals.map((v, i) => i).filter(i => isEven(vals[i]));
  const okIdx = evIdx.filter(i => vals[i] < 20);
  const q25 = {
    src: 'VQG 2024–2025 · Câu 25', type: 'num', answer: 3, calc: okIdx.length, hint: 2,
    en: `Among the values of the following equations, how many even numbers less than 20 are there? ${EXPRS.join(', ')}`,
    vi: `Tính các phép tính sau. Có bao nhiêu kết quả là số chẵn nhỏ hơn 20? ${EXPRS.join(', ')}`,
    visual: box => V().chips(box, EXPRS),
    steps: [
      { text: `🧮 Tính từng phép tính: ${EXPRS.map((e, i) => `${e} = ${vals[i]}`).join('; ')}.`,
        run: t => EXPRS.forEach((_, i) => t.group([i], '#e9ecef', `= ${vals[i]}`)) },
      { text: `🔵 Kết quả là số chẵn: ${evIdx.map(i => vals[i]).join(', ')}.`, run: t => t.mark(evIdx, 'even') },
      { text: `⬇️ Nhỏ hơn 20: ${okIdx.map(i => vals[i]).join(', ')} → có <b>${okIdx.length}</b> số.`, run: t => t.mark(okIdx, 'pick') },
      { text: `🎉 Đáp án: <b>${okIdx.length}</b>` },
    ],
  };

  // Câu "số này chẵn hay lẻ?" có chấm tròn xếp đôi
  function oneQ(n, title) {
    const k = isEven(n) ? 'even' : 'odd';
    return {
      title, type: 'oddeven', answer: k, calc: k, hint: 1,
      en: `Is ${n} an odd number or an even number?`, vi: `Số ${n} là số chẵn hay số lẻ?`,
      visual: n <= 20 ? box => V().pairs(box, n, true) : null,
      steps: [
        n <= 20
          ? { text: `🔵 Xếp ${n} chấm thành từng đôi. ${k === 'odd' ? 'Còn 1 chấm không có bạn!' : 'Chấm nào cũng có bạn!'}`, run: t => t.show() }
          : { text: `👀 Nhìn chữ số cuối của ${n}: là chữ số <b>${n % 10}</b>. Số ${KIND[k]} có chữ số cuối là ${DIGITS[k]}.` },
        { text: `🎉 Đáp án: ${n} là số <b>${KIND[k]} (${k})</b>` },
      ],
    };
  }

  function gen() {
    const kind = rand(1, 3);
    if (kind === 1) return oneQ(rand(1, 99));
    const nums = shuffle(Array.from({ length: 30 }, (_, i) => rand(10, 99))).slice(0, 6);
    if (idxOf(nums, 'even').length < 2) nums[0] = 2 * rand(5, 49);
    if (idxOf(nums, 'odd').length < 2) nums[1] = 2 * rand(5, 48) + 1;
    if (kind === 2) return pickQ({ nums, kind: pick(['even', 'odd']), order: pick(['max', 'min']), rank: 1 });
    return countQ({ nums, vi: `Trong các số ${nums.join(', ')}, số lượng số chẵn và số lượng số lẻ hơn kém nhau mấy?` });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'chan-le', part: 'C', icon: '⚖️', title: 'Số chẵn – số lẻ', sub: 'Chấm nào cũng có bạn?',
    intro: 'Số chẵn thì xếp được thành từng đôi. Số lẻ thì luôn thừa ra 1 bạn lẻ loi. Mình cùng xem nhé!',
    words: [
      { en: 'Even number', vi: 'Số chẵn', icon: '🔵' },
      { en: 'Odd number', vi: 'Số lẻ', icon: '🟠' },
      { en: 'Greatest', vi: 'Lớn nhất', icon: '⬆️' },
      { en: 'Smallest', vi: 'Nhỏ nhất', icon: '⬇️' },
      { en: 'Second', vi: 'Thứ hai', icon: '2️⃣' },
      { en: 'The number of', vi: 'Số lượng', icon: '🔢' },
      { en: 'Difference', vi: 'Hiệu, hơn kém', icon: '➖' },
      { en: 'Less than', vi: 'Nhỏ hơn', icon: '◀️' },
      { en: 'Result', vi: 'Kết quả', icon: '🧾' },
      { en: 'Determine', vi: 'Xác định', icon: '🔍' },
    ],
    tips: [
      '🔵 Số chẵn có chữ số cuối là 0, 2, 4, 6, 8.',
      '🟠 Số lẻ có chữ số cuối là 1, 3, 5, 7, 9.',
      '🤝 Lẻ + lẻ = chẵn. Chẵn + chẵn = chẵn. Chẵn + lẻ = lẻ.',
    ],
    play: {
      title: '🔵 Đồ chơi: xếp chấm thành đôi',
      mount(el) {
        let n = 7;
        el.innerHTML = `<div class="year-row"><button class="btn back-btn pl-minus">− 1</button><span class="year-label pl-n"></span><button class="btn fwd-btn pl-plus">+ 1</button></div><div class="pl-box"></div>`;
        const box = el.querySelector('.pl-box'), lab = el.querySelector('.pl-n');
        function draw() {
          lab.textContent = `Số ${n}`;
          V().pairs(box, n);
          el.querySelector('.pl-minus').disabled = n <= 1;
          el.querySelector('.pl-plus').disabled = n >= 20;
          root.TV.say(`${n} là số ${isEven(n) ? 'chẵn' : 'lẻ'}`);
        }
        el.querySelector('.pl-minus').addEventListener('click', () => { n--; draw(); });
        el.querySelector('.pl-plus').addEventListener('click', () => { n++; draw(); });
        lab.textContent = `Số ${n}`;
        V().pairs(box, n);
      },
    },
    examples: [
      oneQ(7, 'Ví dụ 1 · Số 7 chẵn hay lẻ?'),
      pickQ({ title: 'Ví dụ 2 · Số lẻ lớn nhất', nums: [15, 8, 23, 42, 31], kind: 'odd', order: 'max', rank: 1 }),
      sumQ({ title: 'Ví dụ 3 · Tổng chẵn hay lẻ?', nums: [3, 5, 4] }),
    ],
    gen,
    test: [
      pickQ({ src: 'VQG 2024–2025 · Câu 11', nums: [58, 63, 28, 80, 92, 97, 71], kind: 'even', order: 'max', rank: 1, answer: 92 }),
      pickQ({ src: 'Giống câu 15 – Mock 2025', nums: [47, 86, 39, 68, 95, 74], kind: 'even', order: 'max', rank: 1, answer: 86 }),
      pickQ({ src: 'Đề 1 · Câu 10', nums: [12, 25, 19, 24, 63, 88, 70, 46], kind: 'odd', order: 'max', rank: 1, answer: 63 }),
      pickQ({ src: 'Đề 1 · Câu 11', nums: [23, 44, 18, 27, 35, 11, 76, 94], kind: 'even', order: 'min', rank: 2, answer: 44 }),
      countQ({ src: 'Đề 1 · Câu 12', nums: [10, 7, 32, 71, 54, 16, 73, 66], answer: 2,
        vi: 'Quan sát các số: 10, 7, 32, 71, 54, 16, 73, 66. Số lượng số chẵn nhiều hơn số lượng số lẻ là bao nhiêu?' }),
      countQ({ src: 'VQG 2024–2025 · Câu 24', nums: [25, 34, 17, 22, 9, 16, 8, 31, 38], answer: 1,
        en: 'Refer to the following numbers, what is the difference between the number of even numbers and the number of odd numbers? 25, 34, 17, 22, 9, 16, 8, 31, 38',
        vi: 'Cho các số: 25, 34, 17, 22, 9, 16, 8, 31, 38. Số lượng số chẵn và số lượng số lẻ hơn kém nhau mấy?' }),
      sumQ({ src: 'Giống câu 13 – Mock 2025', nums: [1, 3, 5, 7, 9, 11], answer: 'even' }),
      sumQ({ src: 'VQG 2024–2025 · Câu 15', nums: [2, 5, 7, 8, 11, 13, 14, 15, 17, 20, 21, 23], answer: 'even' }),
      q25,
      // Bổ sung: VQG 2025–2026
      pickQ({ src: 'VQG 2025–2026 · Câu 11', nums: [38, 63, 27, 12, 91, 17, 71], kind: 'odd', order: 'min', rank: 1, answer: 17 }),
      exprParityQ({ src: 'VQG 2025–2026 · Câu 15', expr: '5 + 7 − 9 + 11 − 13 + 19 − 17 + 20', answer: 'odd' }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
