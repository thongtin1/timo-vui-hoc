/* Chủ đề: Tìm số chưa biết (Arithmetic) */
(function (root) {
  'use strict';
  const { rand, pick, evalExpr } = root.TVData;
  const V = () => root.TV.vis;

  // Máy tự giải để kiểm tra đáp án: giải lần lượt từng phép tính, mỗi phép tính có 1 ẩn (chữ cái hoặc ?)
  function solveEqs(eqs) {
    const known = {};
    eqs.forEach(eq => {
      const sym = (eq.match(/[A-Z?]/g) || []).find(s => !(s in known));
      const put = (s, x) => s.replace(/[A-Z?]/g, c => (c === sym ? x : known[c]));
      for (let x = 0; x <= 500; x++) {
        const [l, r] = put(eq, x).split('=');
        if (evalExpr(l) === evalExpr(r)) { known[sym] = x; break; }
      }
    });
    return known;
  }

  // o: { eqs: ['26 − A = 7'], ask: 'A', bars: [{ total, parts }], steps: [{ text, run?(t) }] }
  function findQ(o) {
    const calc = solveEqs(o.eqs)[o.ask];
    return {
      title: o.title, src: o.src, en: o.en, vi: o.vi, type: 'num',
      answer: o.answer != null ? o.answer : calc, calc, hint: o.hint || 2,
      wrong: o.wrong || [calc + 1, calc - 1],
      visual: box => V().bar(box, o.bars),
      steps: o.steps.concat({ text: `🎉 Đáp án: <b>${o.ask} = ${calc}</b>` }),
    };
  }

  // Mẫu 1: a − ? = c hoặc ? + b = c (tìm 1 phần). Mẫu 2: ? − b = c (tìm cả đoạn).
  function partQ(o) {
    const { whole, known, x, sym, eq } = o;
    return findQ({
      ...o, eqs: [eq], ask: sym, wrong: [whole + known, x + 1, x - 1],
      bars: [{ total: String(whole), parts: o.first ? [{ label: sym, value: x, hide: true }, { label: String(known), value: known }] : [{ label: String(known), value: known }, { label: sym, value: x, hide: true }] }],
      steps: [
        { text: `📏 Vẽ sơ đồ: đoạn <b>${whole}</b> gồm 2 phần: phần <b>${sym}</b> và phần <b>${known}</b>.` },
        { text: `🔍 Muốn tìm ${sym}, lấy cả đoạn ${whole} bớt đi phần ${known}.` },
        { text: `🧮 ${whole} − ${known} = <b>${x}</b>`, run: t => t.reveal(0, o.first ? 0 : 1, `${sym} = ${x}`) },
        { text: `✅ Thử lại: ${eq.replace(sym, x)}. Đúng rồi!` },
      ],
    });
  }
  function totalQ(o) {
    const { a, b, sym, eq } = o; // sym − a = b
    return findQ({
      ...o, eqs: [eq], ask: sym, wrong: [b - a, a + b + 1, a + b - 1],
      bars: [{ total: sym, totalHide: true, parts: [{ label: String(b), value: b }, { label: String(a), value: a }] }],
      steps: [
        { text: `📏 ${sym} là cả đoạn. Bớt đi ${a} thì còn ${b} → cả đoạn gồm phần <b>${b}</b> và phần <b>${a}</b>.` },
        { text: '🔍 Muốn tìm cả đoạn, cộng 2 phần lại.' },
        { text: `🧮 ${b} + ${a} = <b>${a + b}</b>`, run: t => t.total(0, `${sym} = ${a + b}`) },
        { text: `✅ Thử lại: ${eq.replace(sym, a + b)}. Đúng rồi!` },
      ],
    });
  }
  // A + A (+ A) = c: chia thành các phần bằng nhau, thử từng số
  function sameQ(o) {
    const { k, x, sym } = o, c = k * x, eq = `${Array(k).fill(sym).join(' + ')} = ${c}`;
    const tryLow = Array(k).fill(x - 1).join(' + '), tryOk = Array(k).fill(x).join(' + ');
    return findQ({
      ...o, eqs: [eq], ask: sym, wrong: [c - x, x + 1, x - 1],
      en: o.en || `If ${sym} represents the same number, what is the value of ${sym}? ${eq}`,
      vi: o.vi || `Biết ${eq}. Hỏi ${sym} bằng mấy?`,
      bars: [{ total: String(c), parts: Array.from({ length: k }, () => ({ label: sym, value: x, hide: true, c: 0 })) }],
      steps: [
        { text: `📏 ${c} chia thành ${k} phần bằng nhau, phần nào cũng là ${sym}.` },
        { text: `🤔 Thử ${sym} = ${x - 1}: ${tryLow} = ${(x - 1) * k}. Còn thiếu!` },
        { text: `🤔 Thử ${sym} = ${x}: ${tryOk} = ${c}. Đúng rồi!`, run: t => { for (let i = 0; i < k; i++) t.reveal(0, i, `${sym} = ${x}`); } },
      ],
    });
  }

  // Phép cộng đặt cột có chữ cái thay chữ số. rows: ['6A', 'A4'], sum: '152'. Máy thử mọi chữ số để kiểm tra.
  function colQ(o) {
    const letters = Array.from(new Set((o.rows.join('') + o.sum).match(/[A-Z]/g)));
    const val = (s, m) => Number(s.replace(/[A-Z]/g, c => m[c]));
    let calc = null;
    (function go(i, m) {
      if (calc != null) return;
      if (i === letters.length) {
        const lead = o.rows.concat(o.sum).every(r => !/[A-Z]/.test(r[0]) || m[r[0]] !== 0);
        const diff = new Set(Object.values(m)).size === letters.length;
        if (lead && diff && o.rows.reduce((a, r) => a + val(r, m), 0) === val(o.sum, m)) calc = m[o.ask];
        return;
      }
      for (let d = 0; d <= 9; d++) go(i + 1, { ...m, [letters[i]]: d });
    })(0, {});
    const sp = s => s.split('').join(' ');
    return {
      title: o.title, src: o.src, en: o.en, vi: o.vi, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 1,
      wrong: o.wrong || [calc + 1, calc - 1],
      visual: box => {
        box.innerHTML = `<div class="col-add">${o.rows.map((r, i) => `<div>${i ? '+ ' : '&nbsp; '}${sp(r)}</div>`).join('')}<div class="col-sum">${sp(o.sum)}</div></div>`;
        return null;
      },
      steps: o.steps.concat({ text: `🎉 Đáp án: <b>${o.ask} = ${calc}</b>` }),
    };
  }

  function gen() {
    const sym = pick(['A', '?']), kind = rand(1, 4);
    if (kind === 1) {
      const x = rand(2, 30), known = rand(2, 20), whole = x + known, eq = `${sym} + ${known} = ${whole}`;
      return partQ({ whole, known, x, sym, eq, first: true, vi: `Biết ${eq}. Hỏi ${sym} bằng mấy?`, en: `What is the value of ${sym}? ${eq}` });
    }
    if (kind === 2) {
      const x = rand(2, 30), c = rand(2, 20), whole = x + c, eq = `${whole} − ${sym} = ${c}`;
      return partQ({ whole, known: c, x, sym, eq, first: true, vi: `Biết ${eq}. Hỏi ${sym} bằng mấy?`, en: `What is the value of ${sym}? ${eq}` });
    }
    if (kind === 3) {
      const a = rand(2, 15), b = rand(2, 30), eq = `${sym} − ${a} = ${b}`;
      return totalQ({ a, b, sym, eq, vi: `Biết ${eq}. Hỏi ${sym} bằng mấy?`, en: `What is the value of ${sym}? ${eq}` });
    }
    return sameQ({ k: rand(2, 3), x: rand(2, 9), sym: 'A' });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'tim-so', part: 'B', icon: '🔎', title: 'Tìm số chưa biết', sub: 'Số nào trốn trong ô?',
    intro: 'Có một số đang trốn trong chữ A hoặc dấu ?. Mình vẽ sơ đồ đoạn thẳng là tìm ra ngay!',
    words: [
      { en: 'Equation', vi: 'Phép tính', icon: '📝' },
      { en: 'Correct', vi: 'Đúng', icon: '✅' },
      { en: 'Blank', vi: 'Chỗ trống', icon: '⬜' },
      { en: 'Represent', vi: 'Thay cho, biểu diễn', icon: '🎭' },
      { en: 'Same number', vi: 'Cùng một số', icon: '👯' },
      { en: 'Different', vi: 'Khác nhau', icon: '🔀' },
      { en: '1-digit number', vi: 'Số có 1 chữ số', icon: '1️⃣' },
      { en: 'Value', vi: 'Giá trị', icon: '💎' },
    ],
    tips: [
      '📏 Vẽ sơ đồ: cả đoạn là số lớn nhất, chia thành các phần.',
      '🔍 Tìm 1 phần: lấy cả đoạn bớt đi phần kia.',
      '➕ Tìm cả đoạn: cộng các phần lại.',
      '✅ Tìm xong, thay số vào phép tính để thử lại.',
    ],
    examples: [
      partQ({ title: 'Ví dụ 1 · Tìm 1 phần', whole: 9, known: 4, x: 5, sym: '?', eq: '? + 4 = 9', first: true,
        en: 'What is the number filled in the blank? ? + 4 = 9', vi: 'Số nào điền vào ô trống? ? + 4 = 9' }),
      totalQ({ title: 'Ví dụ 2 · Tìm cả đoạn', a: 3, b: 8, sym: 'A', eq: 'A − 3 = 8',
        en: 'What is the value of A? A − 3 = 8', vi: 'Biết A − 3 = 8. Hỏi A bằng mấy?' }),
      sameQ({ title: 'Ví dụ 3 · A giống nhau', k: 2, x: 4, sym: 'A' }),
    ],
    gen,
    test: [
      partQ({ src: 'Giống đề TIMO', whole: 30, known: 14, x: 16, sym: '?', eq: '? + 14 = 30', first: true, answer: 16,
        en: 'What is the number filled in the blank if the equation is correct? ? + 14 = 30', vi: 'Số nào điền vào chỗ trống để phép tính đúng? ? + 14 = 30' }),
      partQ({ src: 'Đề 1 · Câu 5', whole: 26, known: 7, x: 19, sym: 'A', eq: '26 − A = 7', first: true, answer: 19,
        vi: 'Biết rằng 26 − A = 7. Giá trị của A bằng bao nhiêu?' }),
      partQ({ src: 'VQG 2024–2025 · Câu 9', whole: 32, known: 15, x: 17, sym: '?', eq: '32 − ? = 15', first: true, answer: 17,
        en: 'What is the number filled in the blank if the equation below is correct? 32 − ? = 15', vi: 'Số nào điền vào chỗ trống để phép tính đúng? 32 − ? = 15' }),
      totalQ({ src: 'Giống đề TIMO', a: 9, b: 23, sym: 'A', eq: 'A − 9 = 23', answer: 32,
        en: 'What is the value of A? A − 9 = 23', vi: 'Biết A − 9 = 23. Hỏi A bằng mấy?' }),
      sameQ({ src: 'Đề 1 · Câu 6', k: 3, x: 6, sym: 'A', answer: 6, vi: 'Biết rằng A + A + A = 18. Giá trị của A bằng bao nhiêu?' }),
      findQ({ src: 'Giống câu 6 – Mock 2025', eqs: ['A + A + 4 = 14'], ask: 'A', answer: 5,
        en: 'If A represents the same 1-digit number, what is the value of A? A + A + 4 = 14',
        vi: 'A là cùng một số có 1 chữ số. Biết A + A + 4 = 14. Hỏi A bằng mấy?',
        bars: [{ total: '14', parts: [{ label: 'A', value: 5, hide: true, c: 0 }, { label: 'A', value: 5, hide: true, c: 0 }, { label: '4', value: 4, c: 1 }] }],
        steps: [
          { text: '📏 Đoạn 14 gồm 3 phần: A, A và 4.' },
          { text: '🔍 Bỏ phần 4 ra: A + A = 14 − 4 = <b>10</b>.' },
          { text: '🤔 Hai số giống nhau cộng lại bằng 10: 5 + 5 = 10. Vậy A = 5.', run: t => { t.reveal(0, 0, 'A = 5'); t.reveal(0, 1, 'A = 5'); } },
          { text: '✅ Thử lại: 5 + 5 + 4 = 14. Đúng rồi!' },
        ] }),
      findQ({ src: 'Giống câu 8 – Mock 2025', eqs: ['35 − ? = 12 + 8'], ask: '?', answer: 15,
        en: 'Find the value of the question mark if the equation is correct. 35 − ? = 12 + 8',
        vi: 'Tìm số ở dấu ? để phép tính đúng: 35 − ? = 12 + 8',
        bars: [{ total: '35', parts: [{ label: '?', value: 15, hide: true }, { label: '12 + 8', value: 20 }] }],
        steps: [
          { text: '👉 Tính bên phải trước: 12 + 8 = <b>20</b>. Vậy 35 − ? = 20.' },
          { text: '📏 Đoạn 35 gồm phần ? và phần 20.' },
          { text: '🧮 35 − 20 = <b>15</b>', run: t => t.reveal(0, 0, '? = 15') },
          { text: '✅ Thử lại: 35 − 15 = 20. Đúng rồi!' },
        ] }),
      // Bổ sung: VQG 2025–2026 và đề chính thức VQG 2024–2025 câu 10
      partQ({ src: 'VQG 2025–2026 · Câu 9', whole: 88, known: 57, x: 31, sym: '?', eq: '88 − ? = 57', first: true, answer: 31,
        en: 'What is the number that should be filled in the blank? 88 − ? = 57', vi: 'Số nào thích hợp điền vào chỗ trống? 88 − ? = 57' }),
      colQ({ src: 'VQG 2025–2026 · Câu 10', rows: ['6A', 'A4'], sum: '152', ask: 'A', answer: 8,
        en: 'Given that A is a 1-digit number, find the value of A: 6A + A4 = 152',
        vi: 'Biết A là số có 1 chữ số. Tìm A trong phép cộng: 6A + A4 = 152',
        steps: [
          { text: '👉 Nhìn hàng đơn vị (cột bên phải): A + 4 có chữ số cuối là <b>2</b>.' },
          { text: '🤔 Số nào cộng 4 ra số có chữ số cuối là 2? 8 + 4 = 12 → A = 8 (nhớ 1 sang hàng chục).' },
          { text: '✅ Thử lại: 68 + 84 = 152. Đúng rồi!' },
        ] }),
      colQ({ src: 'VQG 2024–2025 · Câu 10', rows: ['A', 'AB'], sum: '51', ask: 'B', answer: 7,
        en: 'Given that A and B represent different 1-digit numbers, what is the value of B if the equation is correct? A + AB = 51',
        vi: 'A và B là hai chữ số khác nhau. Biết A + AB = 51 (AB là số có 2 chữ số). Hỏi B bằng mấy?',
        steps: [
          { text: '🔢 AB là số có A chục và B đơn vị. A + AB = 51 nên AB nhỏ hơn 51 → A là 1, 2, 3 hoặc 4.' },
          { text: '🤔 Thử A = 4: 4 + 4B = 51 → 4B = 51 − 4 = 47 → B = 7. (A = 3 thì 3B = 48, không được vì 3B chỉ từ 30 đến 39.)' },
          { text: '✅ Thử lại: 4 + 47 = 51. Đúng rồi!' },
        ] }),
      findQ({ src: 'Giống đề TIMO', eqs: ['A + 7 = 12', 'B + A = 9'], ask: 'B', answer: 4,
        en: 'A and B represent different 1-digit numbers. A + 7 = 12 and B + A = 9. What is the value of B?',
        vi: 'A và B là hai số có 1 chữ số khác nhau. Biết A + 7 = 12 và B + A = 9. Hỏi B bằng mấy?',
        bars: [
          { total: '12', parts: [{ label: 'A', value: 5, hide: true, c: 0 }, { label: '7', value: 7, c: 1 }] },
          { total: '9', parts: [{ label: 'B', value: 4, hide: true, c: 2 }, { label: 'A', value: 5, hide: true, c: 0 }] },
        ],
        steps: [
          { text: '1️⃣ Tìm A trước: A + 7 = 12 → A = 12 − 7 = <b>5</b>.', run: t => { t.reveal(0, 0, 'A = 5'); t.reveal(1, 1, 'A = 5'); } },
          { text: '2️⃣ Thay A = 5 vào: B + 5 = 9.' },
          { text: '🧮 B = 9 − 5 = <b>4</b>', run: t => t.reveal(1, 0, 'B = 4') },
        ] }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
