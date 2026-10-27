/* Chủ đề: Dãy số cách đều (Number theory) */
(function (root) {
  'use strict';
  const { rand } = root.TVData;
  const V = () => root.TV.vis;

  // Câu dãy số. list: các số đề cho (null = ô trống ở giữa). ask: vị trí cần tìm, đếm từ 1.
  // calc là đáp án do máy tự tính, answer là đáp án ghi tay – test/check.js so 2 số này với nhau.
  function seqQ(o) {
    const L = o.list;
    const i0 = L.findIndex((v, i) => v != null && L[i + 1] != null);
    const d = L[i0 + 1] - L[i0];
    const val = i => L[i0] + d * (i - i0);
    const len = Math.max(L.length, o.ask);
    const items = Array.from({ length: len }, (_, i) => (i < L.length ? L[i] : null));
    const far = o.ask > L.length + 1, up = d > 0, D = Math.abs(d), sg = up ? '+' : '−', word = up ? 'thêm' : 'bớt';
    const at = o.ask - 1, calc = val(at);

    const steps = [{
      text: `🔍 Tìm bước nhảy: từ <b>${L[i0]}</b> đến <b>${L[i0 + 1]}</b> là ${word} <b>${D}</b>. Số sau luôn ${word} ${D} so với số trước.`,
      run: t => t.hops(items.slice(1).map(() => `${sg}${D}`)),
    }];
    const todo = items.map((v, i) => (v == null && i <= at ? i : -1)).filter(i => i >= 0);
    todo.forEach(i => steps.push({
      text: `🐸 ${far ? `Số thứ ${i + 1}` : i >= L.length ? 'Số tiếp theo' : 'Ô trống'}: ${val(i - 1)} ${sg} ${D} = <b>${val(i)}</b>`,
      run: t => t.fill(i, val(i)),
    }));
    if (at < L.length - 1) steps.push({ text: `✅ Thử lại: ${calc} ${sg} ${D} = ${val(at + 1)}. Đúng rồi!` });
    steps.push({ text: `🎉 Đáp án: <b>${calc}</b>`, run: t => t.mark([at], 'ans') });

    return {
      title: o.title, src: o.src, en: o.en, vi: o.vi, type: 'num',
      answer: o.answer != null ? o.answer : calc, calc, hint: 1,
      wrong: [calc + d, calc - d, calc + 1],
      visual: box => { const t = V().seq(box, items, { ord: far }); t.mark([at], 'target'); return t; },
      steps,
    };
  }

  const show = L => L.map(v => (v == null ? '___' : v)).join(', ');
  const nth = k => `${k}${k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'}`;
  function textNext(L) {
    return { en: `The numbers below form an arithmetic sequence. What is the next number? ${show(L)}, ...`,
      vi: `Các số dưới đây là một dãy số cách đều. Số tiếp theo là số nào? ${show(L)}, ...` };
  }
  function textBlank(L) {
    return { en: `According to the pattern, what is the number in the space provided? ${show(L)}`,
      vi: `Theo quy luật, số cần điền vào chỗ trống là số nào? ${show(L)}` };
  }
  function textNth(L, k) {
    return { en: `The numbers below form an arithmetic sequence. What is the ${nth(k)} number? ${show(L)}, ...`,
      vi: `Các số dưới đây là một dãy số cách đều. Số thứ ${k} của dãy là số nào? ${show(L)}, ...` };
  }

  // Câu ngẫu nhiên: số tiếp theo / ô trống ở giữa / số thứ n
  function gen() {
    const d = rand(2, 6) * (Math.random() < 0.7 ? 1 : -1);
    const kind = rand(1, 3);
    const a = d > 0 ? rand(1, 20) : rand(-d * 8 + 1, -d * 8 + 20);
    const make = n => Array.from({ length: n }, (_, i) => a + d * i);
    if (kind === 1) { const L = make(5); return seqQ({ list: L, ask: 6, ...textNext(L) }); }
    if (kind === 2) {
      const L = make(6), m = rand(1, 4);
      L[m] = null;
      return seqQ({ list: L, ask: m + 1, ...textBlank(L) });
    }
    const L = make(4), k = rand(6, 8);
    return seqQ({ list: L, ask: k, ...textNth(L, k) });
  }

  const ex = (title, o) => seqQ({ title, ...o });
  const L1 = [3, 5, 7, 9], L2 = [30, 27, 24, 21], L3 = [2, 6, 10, 14];
  const T = [
    [17, 22, 27, 32, 37], [55, 49, 43, 37, 31], [4, 11, 18, 25, 32], [5, 9, 13, 17, 21, 25],
    [50, 47, 44, 41], [3, 8, 13, 18, null, 28], [6, 10, 14, 18], [60, 55, null, 45, 40],
  ];

  (root.TVTopics = root.TVTopics || []).push({
    id: 'day-so', part: 'C', icon: '🐸', title: 'Dãy số cách đều', sub: 'Ếch nhảy đều từng bậc',
    intro: 'Dãy số cách đều giống chú ếch nhảy: lần nào cũng nhảy xa bằng nhau. Tìm được bước nhảy là giải được bài!',
    words: [
      { en: 'Sequence', vi: 'Dãy số', icon: '🔢' },
      { en: 'Arithmetic sequence', vi: 'Dãy số cách đều', icon: '🐸' },
      { en: 'Pattern', vi: 'Quy luật', icon: '🧩' },
      { en: 'Next number', vi: 'Số tiếp theo', icon: '➡️' },
      { en: '5th number', vi: 'Số thứ 5', icon: '5️⃣' },
      { en: 'Space provided', vi: 'Chỗ trống', icon: '⬜' },
      { en: 'Increase', vi: 'Tăng lên', icon: '⬆️' },
      { en: 'Decrease', vi: 'Giảm xuống', icon: '⬇️' },
    ],
    tips: [
      '🔍 Bước 1: Lấy 2 số cạnh nhau, xem số sau thêm (hay bớt) bao nhiêu. Đó là bước nhảy.',
      '🐸 Bước 2: Ếch nhảy đều. Lần nào cũng thêm (hay bớt) đúng bước nhảy đó.',
      '🎯 Bước 3: Đề hỏi "số thứ 8" thì nhảy từng bước, đếm cho tới số thứ 8.',
    ],
    examples: [
      ex('Ví dụ 1 · Dãy tăng ⬆️', { list: L1, ask: 5, ...textNext(L1) }),
      ex('Ví dụ 2 · Dãy giảm ⬇️', { list: L2, ask: 5, ...textNext(L2) }),
      ex('Ví dụ 3 · Tìm số thứ 7 🎯', { list: L3, ask: 7, ...textNth(L3, 7) }),
    ],
    gen,
    test: [
      seqQ({ src: 'Đề 1 · Câu 7', list: T[0], ask: 6, answer: 42, ...textNext(T[0]) }),
      seqQ({ src: 'Đề 1 · Câu 8', list: T[1], ask: 6, answer: 25, ...textNext(T[1]) }),
      seqQ({ src: 'VQG 2024–2025 · Câu 1', list: T[3], ask: 7, answer: 29, ...textNext(T[3]) }),
      seqQ({ src: 'Giống câu 4 – Mock 2025', list: T[5], ask: 5, answer: 23, ...textBlank(T[5]) }),
      seqQ({ src: 'Giống đề TIMO', list: T[7], ask: 3, answer: 50, ...textBlank(T[7]) }),
      seqQ({ src: 'Giống câu 14 – Mock 2025', list: T[6], ask: 7, answer: 30, ...textNth(T[6], 7) }),
      seqQ({ src: 'Đề 1 · Câu 9', list: T[2], ask: 8, answer: 53, ...textNth(T[2], 8) }),
      seqQ({ src: 'VQG 2024–2025 · Câu 12', list: T[4], ask: 9, answer: 26, ...textNth(T[4], 9) }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
