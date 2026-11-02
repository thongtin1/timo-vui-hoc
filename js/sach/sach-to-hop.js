/* Bộ đề sách – Chủ đề 5: Tổ hợp (Combinatorics).
   Máy thử hết mọi cách ghép chữ số để tính đáp án (calc), test/check.js so với đáp án ghi tay. */
(function (root) {
  'use strict';
  const V = () => root.TV.vis;
  const ex = n => `Exercise ${n}`;
  const done = (q, steps, ans) => ({ ...q, steps: steps.map(s => (typeof s === 'string' ? { text: s } : s)).concat({ text: `🎉 Đáp án: <b>${ans}</b>` }) });

  // Mọi số có len chữ số lập từ digits (rep: được lặp lại chữ số), chữ số đầu khác 0
  function numbers(digits, len, rep) {
    const out = [];
    const go = (s, used) => {
      if (s.length === len) { if (s[0] !== '0') out.push(Number(s)); return; }
      digits.forEach((d, i) => { if (rep || !used.includes(i)) go(s + d, used.concat(i)); });
    };
    go('', []);
    return [...new Set(out)];
  }
  // Mọi cặp hai số có 2 chữ số, dùng 4 chữ số khác nhau lấy từ digits
  function pairs(digits, keep) {
    const out = [];
    const ds = digits.map(String);
    for (const a of numbers(ds, 2, false)) for (const b of numbers(ds, 2, false)) {
      const used = String(a) + String(b);
      if (new Set(used).size === 4 && used.split('').every(ch => ds.includes(ch)) && (!keep || keep(a, b))) out.push([a, b]);
    }
    return out;
  }
  const digitChips = ds => box => V().chips(box, ds.map(String));

  // ---------- Bài 1: Thành lập số ----------
  const D1 = [0, 2, 5, 7, 8, 9], D7 = [1, 3, 4, 8];
  const n1 = numbers(D1.map(String), 2, false), n7 = numbers(D7.map(String), 2, false);
  const odd = n => n % 2 === 1, even = n => n % 2 === 0;
  const pickQ = (o, list) => done({
    tag: ex(o.n), type: 'num', answer: o.answer, calc: o.f(list), hint: 1, en: o.en, vi: o.vi, visual: digitChips(o.digits),
  }, o.steps, o.answer);
  const countQ = (o, list) => done({
    tag: ex(o.n), type: 'num', answer: o.answer, calc: list.length, hint: 1, en: o.en, vi: o.vi, visual: digitChips(o.digits),
  }, o.steps, o.answer);
  const ANDY_EN = 'Andy chooses 2 different digits from 0, 2, 5, 7, 8 and 9 to form a 2-digit number.';
  const ANDY_VI = 'Andy chọn 2 chữ số khác nhau từ 0, 2, 5, 7, 8 và 9 để lập thành số có hai chữ số.';
  const LUCY_EN = 'Lucy chooses 2 different digits from 1, 3, 4 and 8 to form a 2-digit number.';
  const LUCY_VI = 'Lucy chọn 2 chữ số khác nhau từ 1, 3, 4 và 8 để lập thành số có hai chữ số.';
  const min = a => Math.min(...a), max = a => Math.max(...a);

  const L1 = [
    pickQ({ n: '1a', answer: 20, digits: D1, f: min,
      en: `${ANDY_EN} What is the smallest number Andy can form?`, vi: `${ANDY_VI} Hỏi số nhỏ nhất Andy lập được là số nào?`,
      steps: ['💡 Chữ số hàng chục không được là 0. Chọn chữ số nhỏ nhất khác 0 làm hàng chục: <b>2</b>.', '👉 Hàng đơn vị chọn chữ số nhỏ nhất còn lại: <b>0</b> → số 20.'] }, n1),
    pickQ({ n: '1b', answer: 25, digits: D1, f: l => min(l.filter(odd)),
      en: `${ANDY_EN} What is the smallest odd number Andy can form?`, vi: `${ANDY_VI} Hỏi số lẻ nhỏ nhất Andy tạo được là số nào?`,
      steps: ['💡 Hàng chục chọn chữ số nhỏ nhất khác 0: <b>2</b>.', '👉 Số lẻ thì hàng đơn vị là chữ số lẻ. Chữ số lẻ nhỏ nhất: <b>5</b> → số 25.'] }, n1),
    pickQ({ n: '1c', answer: 98, digits: D1, f: max,
      en: `${ANDY_EN} What is the largest number Andy can form?`, vi: `${ANDY_VI} Hỏi số lớn nhất Andy tạo được là số nào?`,
      steps: ['💡 Hàng chục chọn chữ số lớn nhất: <b>9</b>.', '👉 Hàng đơn vị chọn chữ số lớn nhất còn lại: <b>8</b> → số 98.'] }, n1),
    pickQ({ n: '1d', answer: 97, digits: D1, f: l => max(l.filter(odd)),
      en: `${ANDY_EN} What is the largest odd number Andy can form?`, vi: `${ANDY_VI} Hỏi số lẻ lớn nhất Andy tạo được là số nào?`,
      steps: ['💡 Hàng chục chọn chữ số lớn nhất: <b>9</b>.', '👉 Hàng đơn vị là chữ số lẻ lớn nhất còn lại (9 đã dùng rồi): <b>7</b> → số 97.'] }, n1),
    countQ({ n: 2, answer: 6, digits: [3, 6, 9],
      en: 'Ben chooses 2 different digits from 3, 6 and 9 to form 2-digit numbers. How many numbers can Ben form?',
      vi: 'Ben chọn 2 chữ số khác nhau từ 3, 6 và 9 để lập thành các số có hai chữ số. Hỏi Ben có thể lập được bao nhiêu số?',
      steps: ['📝 Hàng chục là 3: 36, 39. Hàng chục là 6: 63, 69. Hàng chục là 9: 93, 96.', '➕ 2 + 2 + 2 = <b>6</b> số.'] }, numbers(['3', '6', '9'], 2, false)),
    countQ({ n: 3, answer: 5, digits: [0, 1, 3, 6],
      en: 'Ashley chooses 2 different digits from 0, 1, 3 and 6 to form 2-digit numbers. Among those numbers, how many even numbers are there?',
      vi: 'Ashley chọn 2 chữ số khác nhau từ 0, 1, 3 và 6 để lập thành các số có hai chữ số. Hỏi trong các số đó có bao nhiêu số chẵn?',
      steps: ['💡 Số chẵn có hàng đơn vị là 0 hoặc 6.', '📝 Tận cùng 0: 10, 30, 60. Tận cùng 6: 16, 36 (không có 06).', '➕ 3 + 2 = <b>5</b> số chẵn.'] }, numbers(['0', '1', '3', '6'], 2, false).filter(even)),
    countQ({ n: 4, answer: 9, digits: [1, 4, 8],
      en: 'How many 2-digit numbers can be formed by using digits 1, 4 and 8? (Each digit can be repeated)',
      vi: 'Từ các chữ số 1, 4 và 8, hỏi lập được bao nhiêu số có hai chữ số? (Các chữ số có thể lặp lại)',
      steps: ['📝 Hàng chục có 3 cách chọn (1, 4, 8). Mỗi cách, hàng đơn vị cũng có 3 cách chọn.', '📝 11, 14, 18, 41, 44, 48, 81, 84, 88.', '➕ 3 + 3 + 3 = <b>9</b> số.'] }, numbers(['1', '4', '8'], 2, true)),
    countQ({ n: 5, answer: 4, digits: [3, 6, 9],
      en: 'Ben chooses 2 different digits from 3, 6 and 9 to form 2-digit numbers. How many odd numbers can Ben form?',
      vi: 'Ben chọn 2 chữ số khác nhau từ 3, 6 và 9 để lập thành các số có hai chữ số. Hỏi Ben có thể lập được bao nhiêu số lẻ?',
      steps: ['💡 Số lẻ có hàng đơn vị là 3 hoặc 9.', '📝 Tận cùng 3: 63, 93. Tận cùng 9: 39, 69.', '➕ 2 + 2 = <b>4</b> số lẻ.'] }, numbers(['3', '6', '9'], 2, false).filter(odd)),
    countQ({ n: 6, answer: 3, digits: [1, 0, 3, 9],
      en: 'Choose 2 digits, without repetition, from 1, 0, 3 and 9 to form two-digit numbers. How many even numbers are there?',
      vi: 'Chọn hai chữ số khác nhau từ 1, 0, 3 và 9 để tạo thành số có hai chữ số. Hỏi có bao nhiêu số chẵn?',
      steps: ['💡 Số chẵn phải có hàng đơn vị chẵn. Chữ số chẵn duy nhất là 0.', '📝 Tận cùng 0: 10, 30, 90 → <b>3</b> số.'] }, numbers(['1', '0', '3', '9'], 2, false).filter(even)),
    pickQ({ n: '7a', answer: 13, digits: D7, f: min,
      en: `${LUCY_EN} What is the smallest number Lucy can form?`, vi: `${LUCY_VI} Hỏi số nhỏ nhất Lucy tạo được là số nào?`,
      steps: ['💡 Hàng chục chọn chữ số nhỏ nhất: <b>1</b>.', '👉 Hàng đơn vị chọn chữ số nhỏ nhất còn lại: <b>3</b> → số 13.'] }, n7),
    pickQ({ n: '7b', answer: 14, digits: D7, f: l => min(l.filter(even)),
      en: `${LUCY_EN} What is the smallest even number Lucy can form?`, vi: `${LUCY_VI} Hỏi số chẵn nhỏ nhất Lucy tạo được là số nào?`,
      steps: ['💡 Hàng chục chọn chữ số nhỏ nhất: <b>1</b>.', '👉 Hàng đơn vị là chữ số chẵn nhỏ nhất: <b>4</b> → số 14.'] }, n7),
    pickQ({ n: 8, answer: 190, digits: [9, 0, 1], f: l => min(l.filter(even)),
      en: 'What is the smallest 3-digit even number formed by digits 9, 0 and 1? (Each digit can only be used once)',
      vi: 'Tìm số chẵn nhỏ nhất có 3 chữ số được tạo thành từ các chữ số 9, 0, 1. (Mỗi chữ số chỉ được dùng 1 lần)',
      steps: ['💡 Số chẵn thì hàng đơn vị phải là <b>0</b> (chữ số chẵn duy nhất).', '👉 Còn 1 và 9: số nhỏ hơn đặt ở hàng trăm → <b>190</b>.'] }, numbers(['9', '0', '1'], 3, false)),
    pickQ({ n: 9, answer: 530, digits: [0, 5, 1, 3], f: l => max(l.filter(even)),
      en: 'What is the largest 3-digit even number by choosing 3 numbers from 0, 5, 1 and 3? (Each digit can only be used once)',
      vi: 'Tìm số chẵn lớn nhất có 3 chữ số được tạo thành từ các chữ số 0, 5, 1 và 3. (Mỗi chữ số chỉ được dùng 1 lần)',
      steps: ['💡 Số chẵn thì hàng đơn vị phải là <b>0</b>.', '👉 Hàng trăm chọn chữ số lớn nhất: 5, hàng chục chọn chữ số lớn tiếp theo: 3 → <b>530</b>.'] }, numbers(['0', '5', '1', '3'], 3, false)),
  ];

  // ---------- Bài 2 và Bài 3: Tổng, hiệu lớn nhất và nhỏ nhất của hai số có 2 chữ số ----------
  // kind: 'maxSum' | 'minSum' | 'maxDiff' | 'minDiff'. keep: điều kiện thêm cho cặp số (vd cả hai số đều lẻ)
  function bestQ(o) {
    const ps = pairs(o.digits, o.keep);
    const val = ([a, b]) => (/Sum/.test(o.kind) ? a + b : a - b);
    const ok = /Diff/.test(o.kind) ? ps.filter(([a, b]) => a > b) : ps;
    const vals = ok.map(val), calc = /max/.test(o.kind) ? max(vals) : min(vals);
    const word = { maxSum: 'greatest sum', minSum: 'smallest sum', maxDiff: 'greatest difference', minDiff: 'smallest difference' }[o.kind];
    const vi = { maxSum: 'tổng lớn nhất', minSum: 'tổng nhỏ nhất', maxDiff: 'hiệu lớn nhất', minDiff: 'hiệu nhỏ nhất' }[o.kind];
    const n = o.digits.length;
    return done({
      tag: ex(o.n), type: 'num', answer: o.answer, calc, hint: 1, visual: digitChips(o.digits),
      en: o.en || `Given ${n} digits ${o.digits.join(', ')}. Find the ${word} of two 2-digit numbers formed by those digits without repetition.`,
      vi: o.vi || `Cho ${n} chữ số ${o.digits.join(', ')}. Tìm ${vi} có thể của hai số có 2 chữ số tạo từ các chữ số đã cho, biết rằng không có chữ số nào bị lặp lại.`,
    }, o.steps, o.answer);
  }
  const L2 = [
    bestQ({ n: 1, kind: 'maxSum', answer: 122, digits: [0, 2, 3, 9], steps: [
      '💡 Muốn tổng lớn: hai chữ số lớn nhất làm hàng chục, hai chữ số còn lại làm hàng đơn vị.',
      '👉 Hàng chục: 9 và 3. Hàng đơn vị: 2 và 0 → 92 + 30 = <b>122</b>.'] }),
    bestQ({ n: 2, kind: 'minSum', answer: 61, digits: [1, 4, 5, 6], steps: [
      '💡 Muốn tổng nhỏ: hai chữ số nhỏ nhất làm hàng chục, hai chữ số còn lại làm hàng đơn vị.',
      '👉 Hàng chục: 1 và 4. Hàng đơn vị: 5 và 6 → 15 + 46 = <b>61</b>.'] }),
    bestQ({ n: 3, kind: 'maxSum', answer: 73, digits: [1, 2, 3, 4], steps: [
      '💡 Hai chữ số lớn nhất làm hàng chục: 4 và 3.',
      '👉 Hàng đơn vị: 2 và 1 → 42 + 31 = <b>73</b>.'] }),
    bestQ({ n: 4, kind: 'maxSum', answer: 135, digits: [0, 2, 3, 5, 8], steps: [
      '💡 Chỉ cần chọn 4 chữ số. Hai chữ số lớn nhất làm hàng chục: 8 và 5.',
      '👉 Hàng đơn vị chọn 2 chữ số lớn nhất còn lại: 3 và 2 → 83 + 52 = <b>135</b>.'] }),
    bestQ({ n: 5, kind: 'minSum', answer: 55, digits: [0, 2, 3, 5, 8], steps: [
      '💡 Hàng chục không được là 0. Chọn hai chữ số nhỏ nhất khác 0 làm hàng chục: 2 và 3.',
      '👉 Hàng đơn vị chọn 2 chữ số nhỏ nhất còn lại: 0 và 5 → 20 + 35 = <b>55</b>.'] }),
    bestQ({ n: 6, kind: 'minSum', answer: 66, digits: [0, 1, 2, 4, 5, 6], keep: (a, b) => a % 2 === 1 && b % 2 === 1,
      en: 'Choose 4 digits, without repetition, from 0, 1, 2, 4, 5, 6 to form two 2-digit odd numbers. What is the minimum value of the sum?',
      vi: 'Hãy chọn 4 chữ số không lặp lại từ các chữ số 0, 1, 2, 4, 5, 6 để tạo thành 2 số lẻ có hai chữ số. Tìm tổng nhỏ nhất của hai số lẻ đó.',
      steps: [
        '💡 Hai số đều lẻ nên hàng đơn vị phải là 2 chữ số lẻ: chỉ có <b>1</b> và <b>5</b>.',
        '👉 Hàng chục chọn 2 chữ số nhỏ nhất khác 0 còn lại: 2 và 4 → 21 + 45 = <b>66</b>.'] }),
  ];
  const L3 = [
    bestQ({ n: 1, kind: 'minDiff', answer: 4, digits: [2, 5, 6, 8], steps: [
      '💡 Muốn hiệu nhỏ: hai chữ số hàng chục phải gần nhau nhất: 5 và 6.',
      '👉 Số lớn (hàng chục 6) lấy hàng đơn vị nhỏ nhất: 62. Số bé (hàng chục 5) lấy hàng đơn vị lớn nhất: 58.',
      '🧮 62 − 58 = <b>4</b>'] }),
    bestQ({ n: 2, kind: 'maxDiff', answer: 88, digits: [0, 1, 8, 9], steps: [
      '💡 Số bị trừ lớn nhất: 98. Số trừ nhỏ nhất từ 2 chữ số còn lại (0 không đứng đầu): 10.',
      '🧮 98 − 10 = <b>88</b>'] }),
    bestQ({ n: 3, kind: 'maxDiff', answer: 42, digits: [1, 2, 3, 4, 5], steps: [
      '💡 Số lớn nhất: 54. Số nhỏ nhất từ các chữ số còn lại: 12.',
      '🧮 54 − 12 = <b>42</b>'] }),
    bestQ({ n: 4, kind: 'minDiff', answer: 1, digits: [0, 2, 3, 6, 9], steps: [
      '💡 Hai chữ số hàng chục gần nhau nhất: 2 và 3.',
      '👉 Số lớn: hàng chục 3, hàng đơn vị nhỏ nhất là 0 → 30. Số bé: hàng chục 2, hàng đơn vị lớn nhất là 9 → 29.',
      '🧮 30 − 29 = <b>1</b>'] }),
  ];

  // ---------- Bài 4: Các bài toán về tiền ----------
  // coins: [{ v: mệnh giá, n: số đồng }], price: giá 1 món (bỏ trống nếu chỉ hỏi tổng tiền)
  function moneyQ(o) {
    const total = o.coins.reduce((s, c) => s + c.v * c.n, 0), calc = o.price ? Math.floor(total / o.price) : total;
    const parts = o.coins.map(c => `${c.n} đồng $${c.v} là ${c.n * c.v} đô`);
    const rest = o.price ? total - calc * o.price : 0;
    return done({
      tag: ex(o.n), type: 'num', answer: o.answer, calc, hint: 1, en: o.en, vi: o.vi,
      visual: box => V().coins(box, o.coins),
    }, [
      `💰 ${parts.join(', ')}.`,
      `➕ Tổng số tiền: ${o.coins.map(c => c.n * c.v).join(' + ')} = <b>${total}</b> đô.`,
      ...(o.price ? [`🛒 Mỗi món giá $${o.price}: ${Array(calc).fill(o.price).join(' + ')} = ${calc * o.price}${rest ? `, còn thừa ${rest} đô (không đủ mua thêm)` : ''} → mua được nhiều nhất <b>${calc}</b> món.`] : []),
    ], o.answer);
  }
  const L4 = [
    moneyQ({ n: 1, answer: 23, coins: [{ v: 1, n: 7 }, { v: 2, n: 3 }, { v: 5, n: 2 }],
      en: 'Lewis has 7 $1 coins, 3 $2 coins and 2 $5 coins. How many dollars does Lewis have?',
      vi: 'Lewis có 7 đồng xu 1 đô la, 3 đồng xu 2 đô la và 2 đồng xu 5 đô la. Hỏi Lewis có tất cả bao nhiêu đô la?' }),
    moneyQ({ n: 2, answer: 8, price: 5, coins: [{ v: 1, n: 5 }, { v: 5, n: 3 }, { v: 10, n: 2 }],
      en: 'John has 5 $1 coins, 3 $5 coins, and 2 $10 coins. What is the maximum number of books that John can buy if a book costs $5?',
      vi: 'John có 5 đồng xu 1 đô la, 3 đồng xu 5 đô la và 2 đồng xu 10 đô la. Hỏi John có thể mua nhiều nhất bao nhiêu quyển sách nếu mỗi quyển sách có giá 5 đô la?' }),
    moneyQ({ n: 3, answer: 10, price: 4, coins: [{ v: 1, n: 10 }, { v: 2, n: 9 }, { v: 5, n: 3 }],
      en: 'Chris has 10 $1 coins, 9 $2 coins and 3 $5 coins, at most how many books can he buy knowing that a book costs $4?',
      vi: 'Chris có 10 đồng xu 1 đô la, 9 đồng xu 2 đô la và 3 đồng xu 5 đô la. Hỏi Chris có thể mua nhiều nhất bao nhiêu quyển sách, biết rằng mỗi quyển sách giá 4 đô la?' }),
    moneyQ({ n: 4, answer: 6, price: 4, coins: [{ v: 2, n: 2 }, { v: 5, n: 2 }, { v: 10, n: 1 }],
      en: 'Nicole has 2 $2 coins, 2 $5 coins and 1 $10 coin, at most how many $4 biscuits can she buy?',
      vi: 'Nicole có 2 đồng xu 2 đô la, 2 đồng xu 5 đô la và 1 đồng xu 10 đô la. Hỏi bạn ấy có thể mua nhiều nhất bao nhiêu cái bánh quy giá 4 đô la?' }),
  ];

  (root.TVBook = root.TVBook || []).push(
    { id: 'sach-5-1', part: 'E', icon: '🔢', lesson: 'Lesson 1', title: 'Thành lập số', en: 'Number formation', questions: L1 },
    { id: 'sach-5-2', part: 'E', icon: '➕', lesson: 'Lesson 2', title: 'Tìm tổng lớn nhất và nhỏ nhất', en: 'Find the largest and smallest sum', questions: L2 },
    { id: 'sach-5-3', part: 'E', icon: '➖', lesson: 'Lesson 3', title: 'Tìm hiệu lớn nhất và nhỏ nhất', en: 'Find the largest and smallest difference', questions: L3 },
    { id: 'sach-5-4', part: 'E', icon: '💰', lesson: 'Lesson 4', title: 'Các bài toán về tiền', en: 'Money word problems', questions: L4 },
  );
})(typeof window !== 'undefined' ? window : globalThis);
