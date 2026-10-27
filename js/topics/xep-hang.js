/* Chủ đề: Xếp hàng – đứng trước, đứng sau, đứng thứ mấy (Logical thinking) */
(function (root) {
  'use strict';
  const { rand, pick } = root.TVData;
  const V = () => root.TV.vis;
  const NAMES = ['Eric', 'Mai', 'Tom', 'An', 'Bin', 'Lan', 'Mike', 'Na'];
  const nth = k => `${k}${k % 10 === 1 && k !== 11 ? 'st' : k % 10 === 2 && k !== 12 ? 'nd' : k % 10 === 3 && k !== 13 ? 'rd' : 'th'}`;

  // kind 'behind': biết cả hàng và số bạn đứng trước → hỏi số bạn đứng sau
  // kind 'total':  biết số bạn đứng trước và đứng sau → hỏi cả hàng
  // kind 'both':   đứng thứ k từ đầu, thứ m từ cuối → hỏi cả hàng
  // kind 'back':   cả hàng, đứng thứ k từ đầu → hỏi đứng thứ mấy từ cuối
  function lineQ(o) {
    const X = o.name || 'Eric';
    let total, at, calc, en, vi, steps, wrong;
    if (o.kind === 'behind') {
      total = o.total; at = o.front + 1; calc = total - o.front - 1; wrong = [total - o.front, calc - 1];
      en = `${total} children form a column. There are ${o.front} children in front of ${X}. How many children are behind ${X}?`;
      vi = `${total} bạn xếp thành một hàng dọc. Có ${o.front} bạn đứng trước ${X}. Hỏi có bao nhiêu bạn đứng sau ${X}?`;
      steps = [
        { text: `🙂 Có ${o.front} bạn đứng trước ${X}.`, run: t => t.mark(1, o.front, 'front') },
        { text: `🧒 ${X} cũng là 1 bạn trong hàng. Đừng quên ${X} nhé!` },
        { text: `➖ Số bạn đứng sau: ${total} − ${o.front} − 1 = <b>${calc}</b>`, run: t => t.mark(at + 1, total, 'back') },
      ];
    } else if (o.kind === 'total') {
      at = o.front + 1; total = o.front + o.behind + 1; calc = total; wrong = [total - 1, total + 1];
      en = `There are ${o.front} children in front of ${X} and ${o.behind} children behind ${X}. How many children are there in the column?`;
      vi = `Trong một hàng dọc, có ${o.front} bạn đứng trước ${X} và ${o.behind} bạn đứng sau ${X}. Hỏi hàng có bao nhiêu bạn?`;
      steps = [
        { text: `🙂 Đứng trước: ${o.front} bạn.`, run: t => t.mark(1, o.front, 'front') },
        { text: `🙂 Đứng sau: ${o.behind} bạn.`, run: t => t.mark(at + 1, total, 'back') },
        { text: `➕ Cộng thêm cả ${X} nữa: ${o.front} + ${o.behind} + 1 = <b>${calc}</b>` },
      ];
    } else if (o.kind === 'both') {
      at = o.k; total = o.k + o.m - 1; calc = total; wrong = [o.k + o.m, total - 1];
      en = `${X} is the ${nth(o.k)} from the front and the ${nth(o.m)} from the back of a column. How many children are there in the column?`;
      vi = `${X} đứng thứ ${o.k} tính từ đầu hàng và đứng thứ ${o.m} tính từ cuối hàng. Hỏi hàng có bao nhiêu bạn?`;
      steps = [
        { text: `🙂 Đứng thứ ${o.k} từ đầu → trước ${X} có ${o.k} − 1 = <b>${o.k - 1}</b> bạn.`, run: t => t.mark(1, o.k - 1, 'front') },
        { text: `🙂 Đứng thứ ${o.m} từ cuối → sau ${X} có ${o.m} − 1 = <b>${o.m - 1}</b> bạn.`, run: t => t.mark(at + 1, total, 'back') },
        { text: `➕ Cả hàng: ${o.k - 1} + ${o.m - 1} + 1 (là ${X}) = <b>${calc}</b>` },
      ];
    } else {
      total = o.total; at = o.k; calc = total - o.k + 1; wrong = [total - o.k, calc + 1];
      en = `${total} children form a column. ${X} is the ${nth(o.k)} from the front. What is ${X}'s position from the back?`;
      vi = `${total} bạn xếp thành một hàng dọc. ${X} đứng thứ ${o.k} tính từ đầu hàng. Hỏi ${X} đứng thứ mấy tính từ cuối hàng?`;
      steps = [
        { text: `🙂 Trước ${X} có ${o.k} − 1 = ${o.k - 1} bạn.`, run: t => t.mark(1, o.k - 1, 'front') },
        { text: `🙂 Sau ${X} có: ${total} − ${o.k} = <b>${total - o.k}</b> bạn.`, run: t => t.mark(at + 1, total, 'back') },
        { text: `👉 Đếm từ cuối lên: qua ${total - o.k} bạn rồi tới ${X} → thứ ${total - o.k} + 1 = <b>${calc}</b>` },
      ];
    }
    steps.push({ text: `🎉 Đáp án: <b>${calc}</b>` });
    return {
      title: o.title, src: o.src, type: 'num', en, vi, answer: o.answer != null ? o.answer : calc, calc, hint: 1, wrong,
      visual: box => V().queue(box, total, at),
      steps,
    };
  }

  function gen() {
    const kind = pick(['behind', 'total', 'both', 'back']), name = pick(NAMES);
    if (kind === 'behind') { const total = rand(8, 20); return lineQ({ kind, name, total, front: rand(2, total - 3) }); }
    if (kind === 'total') return lineQ({ kind, name, front: rand(2, 9), behind: rand(2, 9) });
    if (kind === 'both') return lineQ({ kind, name, k: rand(2, 9), m: rand(2, 9) });
    const total = rand(8, 20);
    return lineQ({ kind, name, total, k: rand(2, total - 1) });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'xep-hang', part: 'A', icon: '🚶', title: 'Xếp hàng', sub: 'Trước, sau, thứ mấy?',
    intro: 'Các bạn xếp hàng dọc. Bí kíp vàng: đừng quên đếm chính bạn ấy nhé!',
    words: [
      { en: 'Column', vi: 'Hàng dọc', icon: '🚶' },
      { en: 'Row', vi: 'Hàng ngang', icon: '↔️' },
      { en: 'In front of', vi: 'Phía trước', icon: '⬅️' },
      { en: 'Behind', vi: 'Phía sau', icon: '➡️' },
      { en: 'From the front', vi: 'Tính từ đầu hàng', icon: '🔝' },
      { en: 'From the back', vi: 'Tính từ cuối hàng', icon: '🔚' },
      { en: 'Children', vi: 'Các bạn nhỏ', icon: '🧒' },
    ],
    tips: [
      '🧒 Luôn nhớ: bạn ấy cũng là 1 người trong hàng.',
      '➖ Đứng sau = cả hàng − đứng trước − 1.',
      '➕ Cả hàng = đứng trước + đứng sau + 1.',
      '🔢 Đứng thứ 5 từ đầu → phía trước có 4 bạn.',
    ],
    examples: [
      lineQ({ title: 'Ví dụ 1 · Đứng sau có mấy bạn?', kind: 'behind', name: 'Mai', total: 8, front: 3 }),
      lineQ({ title: 'Ví dụ 2 · Cả hàng có mấy bạn?', kind: 'total', name: 'Tom', front: 2, behind: 4 }),
      lineQ({ title: 'Ví dụ 3 · Thứ mấy từ hai đầu', kind: 'both', name: 'An', k: 3, m: 4 }),
    ],
    gen,
    test: [
      lineQ({ src: 'VQG 2024–2025 · Câu 3', kind: 'behind', name: 'Eric', total: 21, front: 7, answer: 13 }),
      lineQ({ src: 'Giống đề TIMO', kind: 'total', name: 'Lan', front: 5, behind: 6, answer: 12 }),
      lineQ({ src: 'Giống đề TIMO', kind: 'both', name: 'Bin', k: 4, m: 5, answer: 8 }),
      lineQ({ src: 'Giống đề TIMO', kind: 'back', name: 'Mike', total: 15, k: 6, answer: 10 }),
      lineQ({ src: 'Giống đề TIMO', kind: 'behind', name: 'Na', total: 18, front: 10, answer: 7 }),
      lineQ({ src: 'Giống đề TIMO', kind: 'total', name: 'Tom', front: 8, behind: 8, answer: 17 }),
      lineQ({ src: 'Giống đề TIMO', kind: 'both', name: 'Mai', k: 10, m: 10, answer: 19 }),
      lineQ({ src: 'Giống đề TIMO', kind: 'back', name: 'An', total: 20, k: 1, answer: 20 }),
      // Bổ sung: phiếu luyện "Xếp hàng – ngày tuần"
      lineQ({ src: 'Phiếu Xếp hàng · Bài 1', kind: 'behind', name: 'Lan', total: 24, front: 9, answer: 14 }),
      lineQ({ src: 'Phiếu Xếp hàng · Bài 4', kind: 'behind', name: 'Nam', total: 30, front: 14, answer: 15 }),
      lineQ({ src: 'Phiếu Xếp hàng · Bài 3', kind: 'behind', name: 'Hoa', total: 19, front: 6, answer: 12 }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
