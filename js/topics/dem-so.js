/* Chủ đề: Đếm số theo điều kiện (Combinatorics) */
(function (root) {
  'use strict';
  const { rand, pick, shuffle, evalExpr } = root.TVData;
  const V = () => root.TV.vis;

  // Điều kiện dùng chung: { even?, odd?, gt?, lt?, digits? }
  function test(c, v) {
    return (!c.even || v % 2 === 0) && (!c.odd || v % 2 === 1) && (c.gt == null || v > c.gt) && (c.lt == null || v < c.lt) && (!c.digits || String(v).length === c.digits);
  }
  function condVi(c) {
    return [c.even ? 'là số chẵn' : '', c.odd ? 'là số lẻ' : '', c.digits ? `có ${c.digits} chữ số` : '',
      c.gt != null && c.lt != null ? `ở giữa ${c.gt} và ${c.lt}` : c.lt != null ? `nhỏ hơn ${c.lt}` : c.gt != null ? `lớn hơn ${c.gt}` : ''].filter(Boolean).join(', ');
  }
  function condEn(c) {
    const kind = [c.digits ? `${c.digits}-digit` : '', c.even ? 'even' : c.odd ? 'odd' : ''].filter(Boolean).join(' ');
    const range = c.gt != null && c.lt != null ? ` between ${c.gt} and ${c.lt}` : c.lt != null ? ` less than ${c.lt}` : c.gt != null ? ` greater than ${c.gt}` : '';
    return `${kind ? kind + ' ' : ''}numbers${range}`;
  }

  // Tính các phép tính rồi đếm kết quả thoả điều kiện
  function exprQ(o) {
    const vals = o.exprs.map(evalExpr), ok = vals.map((v, i) => i).filter(i => test(o.cond, vals[i])), calc = ok.length;
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2,
      en: `Among the values of the following expressions, how many ${condEn(o.cond)} are there? ${o.exprs.join(', ')}`,
      vi: `Tính các phép tính: ${o.exprs.join(', ')}. Có bao nhiêu kết quả ${condVi(o.cond)}?`,
      wrong: [calc + 1, calc - 1, o.exprs.length - calc],
      visual: box => V().chips(box, o.exprs),
      steps: [
        { text: `🧮 Tính từng phép tính: ${o.exprs.map((e, i) => `${e} = ${vals[i]}`).join('; ')}.`, run: t => o.exprs.forEach((_, i) => t.group([i], '#e9ecef', `= ${vals[i]}`)) },
        { text: `🔍 Kết quả ${condVi(o.cond)}: ${ok.map(i => vals[i]).join(', ') || 'không có'}.`, run: t => t.mark(ok, 'pick') },
        { text: `🎉 Đáp án: <b>${calc}</b>` },
      ],
    };
  }

  // Đếm các số tự nhiên nằm giữa a và b (không tính a, b), có thể chỉ đếm số chẵn / lẻ
  function betweenQ(o) {
    const { a, b, cond = {} } = o, list = [];
    for (let v = a + 1; v < b; v++) if (test(cond, v)) list.push(v);
    const calc = list.length, kind = cond.even ? 'số chẵn' : cond.odd ? 'số lẻ' : 'số';
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 1,
      en: `How many ${cond.even ? 'even ' : cond.odd ? 'odd ' : ''}numbers are there between ${a} and ${b}?`,
      vi: `Có bao nhiêu ${kind} ở giữa ${a} và ${b}?`,
      wrong: [calc + 1, calc + 2, b - a],
      visual: box => V().chips(box, Array.from({ length: b - a + 1 }, (_, i) => String(a + i))),
      steps: [
        { text: `⚠️ "Ở giữa ${a} và ${b}" là không tính ${a} và ${b}.` },
        { text: `✏️ Viết ra: ${list.join(', ')}.`, run: t => t.mark(list.map(v => v - a), 'pick') },
        { text: `🔢 Đếm: <b>${calc}</b> số.` },
        { text: `🎉 Đáp án: <b>${calc}</b>` },
      ],
    };
  }

  // Dãy cách đều first, first + d, …, last có bao nhiêu số?
  function termsQ(o) {
    const { first, d, last } = o, calc = (last - first) / d + 1;
    const list = Array.from({ length: calc }, (_, i) => first + d * i);
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 1,
      en: `How many numbers are there in the sequence ${first}, ${first + d}, ${first + 2 * d}, ..., ${last}?`,
      vi: `Dãy số ${first}, ${first + d}, ${first + 2 * d}, ..., ${last} có bao nhiêu số?`,
      wrong: [calc - 1, calc + 1, last - first],
      visual: box => V().chips(box, list.map(String)),
      steps: [
        { text: `🔍 Mỗi số cách nhau ${d}. Viết hết ra: ${list.join(', ')}.` },
        { text: `🔢 Đếm từng số: 1, 2, 3… → <b>${calc}</b> số.`, run: t => t.mark(list.map((_, i) => i), 'pick') },
        { text: `🎉 Đáp án: <b>${calc}</b>` },
      ],
    };
  }

  function gen() {
    const k = rand(1, 3);
    if (k === 1) {
      const exprs = Array.from({ length: 6 }, () => (Math.random() < 0.5 ? `${rand(2, 30)} + ${rand(1, 15)}` : (() => { const a = rand(10, 50); return `${a} − ${rand(1, a)}`; })()));
      const cond = pick([{ digits: 1 }, { digits: 2 }, { gt: 10, lt: 25 }, { even: true, lt: 20 }, { odd: true }]);
      return exprQ({ exprs, cond });
    }
    if (k === 2) { const a = rand(5, 30); return betweenQ({ a, b: a + rand(4, 9), cond: pick([{}, { even: true }, { odd: true }]) }); }
    const d = rand(2, 5), first = rand(1, 10);
    return termsQ({ first, d, last: first + d * rand(4, 9) });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'dem-so', part: 'E', icon: '🔍', title: 'Đếm số theo điều kiện', sub: 'Có bao nhiêu số…?',
    intro: 'Đề hỏi có bao nhiêu số thoả điều kiện. Mình tính hết, viết hết ra rồi đếm cẩn thận từng số một!',
    words: [
      { en: 'Value', vi: 'Giá trị, kết quả', icon: '💎' },
      { en: 'Expression', vi: 'Phép tính', icon: '📝' },
      { en: 'Between', vi: 'Ở giữa', icon: '↔️' },
      { en: 'Less than', vi: 'Nhỏ hơn', icon: '◀️' },
      { en: 'Greater than', vi: 'Lớn hơn', icon: '▶️' },
      { en: '1-digit number', vi: 'Số có 1 chữ số', icon: '1️⃣' },
      { en: 'How many', vi: 'Bao nhiêu', icon: '❓' },
    ],
    tips: [
      '🧮 Có phép tính thì tính hết kết quả trước.',
      '🔍 Kiểm tra từng kết quả xem có đúng điều kiện không.',
      '⚠️ "Ở giữa 10 và 25" là không tính 10 và 25.',
    ],
    examples: [
      betweenQ({ title: 'Ví dụ 1 · Ở giữa hai số', a: 5, b: 11 }),
      exprQ({ title: 'Ví dụ 2 · Đếm số có 1 chữ số', exprs: ['3 + 4', '12 − 2', '15 − 9', '6 + 8'], cond: { digits: 1 } }),
      termsQ({ title: 'Ví dụ 3 · Dãy có mấy số?', first: 2, d: 2, last: 12 }),
    ],
    gen,
    test: [
      exprQ({ src: 'Giống câu 23 – Mock 2025', exprs: ['8 + 5', '30 − 4', '17 + 2', '9 + 9', '40 − 20', '6 + 3'], cond: { gt: 10, lt: 25 }, answer: 4 }),
      exprQ({ src: 'Giống câu 24 – Mock 2025', exprs: ['12 − 5', '3 + 4', '15 − 6', '20 − 9', '2 + 8', '11 − 3'], cond: { digits: 1 }, answer: 4 }),
      exprQ({ src: 'VQG 2025–2026 · Câu 22', exprs: ['12 + 7', '43 − 28', '59 − 51', '10 + 0', '73 − 68', '19 + 11', '81 − 79'], cond: { digits: 2 }, answer: 4 }),
      exprQ({ src: 'VQG 2025–2026 · Câu 25', exprs: ['19 + 9', '54 − 21', '18 + 6', '26 + 8', '73 − 48', '19 + 11', '81 − 54'], cond: { even: true, gt: 25, lt: 35 }, answer: 3 }),
      betweenQ({ src: 'Giống đề TIMO', a: 15, b: 23, answer: 7 }),
      betweenQ({ src: 'Giống đề TIMO', a: 10, b: 20, cond: { even: true }, answer: 4 }),
      termsQ({ src: 'Giống đề TIMO', first: 3, d: 2, last: 21, answer: 10 }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
