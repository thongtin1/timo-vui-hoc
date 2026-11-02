/* Bộ đề sách – Chủ đề 1: Tư duy logic (Logical thinking).
   Bài tập phần Luyện tập (Practice) của sách, giữ đúng số thứ tự Exercise để bé dò với sách. */
(function (root) {
  'use strict';
  const D = root.TVData;
  const V = () => root.TV.vis;
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const pos = c => ABC.indexOf(c.toUpperCase());
  const shift = (c, d) => ABC[(((pos(c) + d) % 26) + 26) % 26];
  const ex = n => `Exercise ${n}`;

  // ---------- Bài 1: Dãy số có quy luật ----------
  // items: các số đề cho, null là ô cần tìm. fills: [[chỉ số ô, số, chữ giải thích]] lần lượt điền vào.
  function seqQ(o) {
    const fills = o.fills.map(([i, v, text]) => ({ text, run: t => t.fill(i, v) }));
    return {
      tag: ex(o.n), type: 'num', answer: o.answer, hint: 1,
      en: o.en, vi: o.vi,
      visual: box => V().seq(box, o.items, { ord: o.ord, group: o.group }),
      steps: [
        { text: o.rule, run: o.hops ? t => t.hops(o.hops) : null },
        ...fills,
        { text: `🎉 Đáp án: <b>${o.answer}</b>` },
      ],
    };
  }
  const plus = (d, n) => Array(n).fill(d > 0 ? `+${d}` : `−${-d}`);

  const L1 = [
    seqQ({ n: 1, answer: 23, ord: true, items: [2, 5, 8, 11, 14, null, null, null], hops: plus(3, 7),
      en: 'Given the sequence with the pattern below, find the 8th term in the sequence: 2, 5, 8, 11, 14, …',
      vi: 'Cho dãy số có quy luật dưới đây, tìm số thứ 8 của dãy: 2, 5, 8, 11, 14, …',
      rule: '🔍 Quy luật: số sau hơn số liền trước <b>3</b> đơn vị (+3).',
      fills: [[5, 17, '👉 Số thứ 6: 14 + 3 = <b>17</b>'], [6, 20, '👉 Số thứ 7: 17 + 3 = <b>20</b>'], [7, 23, '👉 Số thứ 8: 20 + 3 = <b>23</b>']] }),
    seqQ({ n: 2, answer: 30, items: [5, 10, 15, 20, 25, null], hops: plus(5, 5),
      en: 'According to the pattern below, find the next term in the sequence: 5, 10, 15, 20, 25, …',
      vi: 'Dựa vào quy luật dưới đây, tìm số tiếp theo của dãy: 5, 10, 15, 20, 25, …',
      rule: '🔍 Quy luật: số sau hơn số liền trước <b>5</b> đơn vị (+5).',
      fills: [[5, 30, '👉 Số tiếp theo: 25 + 5 = <b>30</b>']] }),
    seqQ({ n: 3, answer: 8, items: [0, 2, 4, 6, null], hops: plus(2, 4),
      en: 'According to the pattern below, what is the number in the space provided? 0, 2, 4, 6, __',
      vi: 'Dựa vào quy luật dưới đây, tìm số thích hợp điền vào chỗ trống: 0, 2, 4, 6, __',
      rule: '🔍 Quy luật: số sau hơn số liền trước <b>2</b> đơn vị (+2).',
      fills: [[4, 8, '👉 Số cần điền: 6 + 2 = <b>8</b>']] }),
    seqQ({ n: 4, answer: 29, items: [1, 2, 4, 7, 11, 16, 22, null], hops: ['+1', '+2', '+3', '+4', '+5', '+6', '+7'],
      en: 'According to the pattern below, find the next term in the sequence: 1, 2, 4, 7, 11, 16, 22, …',
      vi: 'Dựa vào quy luật dưới đây, tìm số tiếp theo trong dãy: 1, 2, 4, 7, 11, 16, 22, …',
      rule: '🔍 Quy luật: lần lượt cộng thêm 1, 2, 3, 4, 5, 6… (mỗi lần cộng nhiều hơn lần trước 1).',
      fills: [[7, 29, '👉 Lần này cộng 7: 22 + 7 = <b>29</b>']] }),
    seqQ({ n: 5, answer: 13, items: [1, 1, 2, 3, 5, 8, null],
      en: 'According to the pattern below, find the next number in the sequence: 1, 1, 2, 3, 5, 8, …',
      vi: 'Dựa vào quy luật sau, tìm số tiếp theo trong dãy: 1, 1, 2, 3, 5, 8, …',
      rule: '🔍 Quy luật: mỗi số bằng tổng của 2 số đứng ngay trước nó: 1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, 3 + 5 = 8.',
      fills: [[6, 13, '👉 Số tiếp theo: 5 + 8 = <b>13</b>']] }),
    seqQ({ n: 6, answer: 21, ord: true, items: [31, 29, 27, 25, null, null], hops: plus(-2, 5),
      en: 'What is the 6th number in the sequence with the pattern below? 31, 29, 27, 25, …',
      vi: 'Tìm số thứ 6 trong dãy số có quy luật dưới đây: 31, 29, 27, 25, …',
      rule: '🔍 Quy luật: số sau kém số liền trước <b>2</b> đơn vị (−2).',
      fills: [[4, 23, '👉 Số thứ 5: 25 − 2 = <b>23</b>'], [5, 21, '👉 Số thứ 6: 23 − 2 = <b>21</b>']] }),
    seqQ({ n: 7, answer: 57, items: [9, 17, 25, 33, 41, 49, null], hops: plus(8, 6),
      en: 'According to the pattern below, find the next number in the sequence: 9, 17, 25, 33, 41, 49, …',
      vi: 'Dựa vào quy luật dưới đây, tìm số tiếp theo trong dãy: 9, 17, 25, 33, 41, 49, …',
      rule: '🔍 Quy luật: số sau hơn số liền trước <b>8</b> đơn vị (+8).',
      fills: [[6, 57, '👉 Số tiếp theo: 49 + 8 = <b>57</b>']] }),
    seqQ({ n: 8, answer: 4, items: [20, 1, 19, 2, 18, 3, 17, null], group: i => i % 2,
      en: 'According to the pattern below, which number should be filled in the blank? 20, 1, 19, 2, 18, 3, 17, __',
      vi: 'Dựa vào quy luật dưới đây, tìm số thích hợp để điền vào chỗ trống: 20, 1, 19, 2, 18, 3, 17, __',
      rule: '👀 Đây là 2 dãy xen kẽ: dãy <b class="g0-t">tím</b> 20, 19, 18, 17 (bớt 1) và dãy <b class="g1-t">cam</b> 1, 2, 3 (thêm 1).',
      fills: [[7, 4, '👉 Chỗ trống thuộc dãy cam: 3 + 1 = <b>4</b>']] }),
  ];

  // ---------- Bài 2: Bài toán liên quan đến dãy có quy luật ----------
  // groups: các nhóm đề cho (để vẽ), counts: số kí hiệu từng nhóm, rule: quy luật, more: các bước tính tiếp.
  function symQ(o) {
    return {
      tag: ex(o.n), type: 'num', answer: o.answer, hint: 2,
      en: o.en, vi: o.vi,
      visual: box => V().sym(box, o.groups.concat({ ask: true }), o.mark),
      steps: [
        { text: `🔢 Đếm: ${o.counts.map((c, i) => `nhóm ${i + 1} có <b>${c}</b>`).join(', ')}.`, run: t => o.counts.forEach((c, i) => t.count(i, c)) },
        { text: o.rule },
        ...o.more.map(text => ({ text })),
        { text: `🎉 Đáp án: <b>${o.answer}</b> ${o.mark}` },
      ],
    };
  }
  const cellsWhere = (n, f) => {
    const out = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (f(r, c)) out.push([r, c]);
    return out;
  };
  // Hình thoi (kim cương) bán kính k trên lưới (2k + 1) × (2k + 1): kí hiệu nằm ở viền ngoài
  const diamond = k => ({ n: 2 * k + 1, on: cellsWhere(2 * k + 1, (r, c) => k > 0 && Math.abs(r - k) + Math.abs(c - k) === k) });

  // Quy luật chữ cái: items các chữ đề cho, null là chỗ trống. walk: [chữ bắt đầu, số bước] để bảng chữ cái đếm theo.
  function letterQ(o) {
    return {
      tag: ex(o.n), type: 'letter', answer: o.answer, hint: 1,
      en: o.en, vi: o.vi,
      visual: box => {
        box.innerHTML = '<div class="v-code"><div></div><div class="v-abc"></div></div>';
        const [top, abc] = box.firstChild.children;
        return { s: V().seq(top, o.items, { group: o.group }), a: V().alpha(abc) };
      },
      steps: [
        { text: o.rule, run: t => t.a.mark(o.items.filter(Boolean).map(c => c.toUpperCase())) },
        { text: o.last, run: t => { t.a.walk(o.walk[0], o.walk[1]); t.s.fill(o.items.indexOf(null), o.answer); } },
        { text: `🎉 Đáp án: <b>${o.answer}</b>` },
      ],
    };
  }
  // Mật khẩu: mỗi chữ dịch đi cùng một số bước
  function codeQ(o) {
    const d = pos(o.to[0]) - pos(o.from[0]), calc = o.ask.split('').map(c => shift(c, d)).join('');
    return {
      tag: ex(o.n), type: 'word', answer: o.answer, calc, hint: 2,
      en: `It is known that the password for "${o.from}" is "${o.to}". What is the password for "${o.ask}"?`,
      vi: `Biết rằng "${o.from}" có mật khẩu là "${o.to}". Tìm mật khẩu cho "${o.ask}".`,
      visual: box => {
        box.innerHTML = '<div class="v-code"><div></div><div></div><div class="v-abc"></div></div>';
        const [top, bot, abc] = box.firstChild.children;
        return { s: V().seq(top, o.ask.split('')), r: V().seq(bot, o.ask.split('').map(() => null)), a: V().alpha(abc) };
      },
      steps: [
        { text: `🔍 So chữ đầu: ${o.from[0]} → ${o.to[0]} là đếm tiếp <b>${d}</b> chữ.`, run: t => t.a.walk(o.from[0], d) },
        { text: `✅ Các chữ khác cũng vậy: ${o.from.split('').map((c, i) => `${c} → ${o.to[i]}`).join(', ')}. Mỗi chữ đếm tiếp ${d} chữ.` },
        { text: `✏️ ${o.ask}: ${o.ask.split('').map(c => `${c} → <b>${shift(c, d)}</b>`).join(', ')}`,
          run: t => o.ask.split('').forEach((c, i) => setTimeout(() => t.r.fill(i, shift(c, d)), i * 300)) },
        { text: `🎉 Đáp án: <b>${calc}</b>` },
      ],
    };
  }

  const L2 = [
    symQ({ n: 1, answer: 10, mark: '●', counts: [1, 3, 6], groups: [{ pile: [1] }, { pile: [1, 2] }, { pile: [1, 2, 3] }],
      en: 'According to the pattern below, how many circles are there in the 4th group?',
      vi: 'Theo quy luật, hỏi có bao nhiêu hình tròn trong nhóm thứ 4?',
      rule: '🔍 Quy luật: nhóm sau thêm một hàng, hàng mới nhiều hơn hàng trước 1 hình: thêm 2, rồi thêm 3…',
      more: ['👉 Nhóm 4 thêm hàng 4 hình: 6 + 4 = <b>10</b>'] }),
    symQ({ n: 2, answer: 5, mark: '⊕', counts: [1, 2, 3, 4],
      groups: [1, 2, 3, 4].map(n => ({ n, on: cellsWhere(n, (r, c) => r === c) })),
      en: 'From the pattern below, how many symbols ⊕ are there in the 5th group?',
      vi: 'Cho quy luật dưới đây, hỏi có bao nhiêu kí hiệu ⊕ trong nhóm thứ 5?',
      rule: '🔍 Quy luật: nhóm thứ mấy thì có bấy nhiêu ⊕, xếp trên đường chéo. Mỗi nhóm thêm 1 ⊕.',
      more: ['👉 Nhóm 5: 4 + 1 = <b>5</b>'] }),
    symQ({ n: 3, answer: 20, mark: '#', counts: [0, 4, 8, 12], groups: [0, 1, 2, 3].map(diamond),
      en: 'According to the pattern below, how many symbols # are there in the 6th group?',
      vi: 'Cho dãy dưới đây, hỏi có bao nhiêu kí hiệu # trong nhóm thứ 6?',
      rule: '🔍 Quy luật: mỗi nhóm sau thêm <b>4</b> kí hiệu # (mỗi cánh thêm 1).',
      more: ['👉 Nhóm 5: 12 + 4 = <b>16</b>', '👉 Nhóm 6: 16 + 4 = <b>20</b>'] }),
    symQ({ n: 4, answer: 17, mark: '⊗', counts: [1, 5, 9, 13],
      groups: [1, 3, 5, 7].map(n => ({ n, on: cellsWhere(n, (r, c) => r === c || r + c === n - 1) })),
      en: 'From the pattern below, how many symbols ⊗ are there in the 5th group?',
      vi: 'Cho quy luật dưới đây, hỏi có bao nhiêu kí hiệu ⊗ trong nhóm thứ 5?',
      rule: '🔍 Quy luật: kí hiệu xếp thành hình chữ X. Mỗi nhóm sau thêm <b>4</b> kí hiệu ⊗ (mỗi đầu chữ X thêm 1).',
      more: ['👉 Nhóm 5: 13 + 4 = <b>17</b>'] }),
    symQ({ n: 5, answer: 24, mark: '⊗', counts: [0, 6, 12, 18],
      groups: [1, 3, 5, 7].map(n => ({ n, on: cellsWhere(n, (r, c) => n > 1 && (c === 0 || r === n - 1 || r === c)) })),
      en: 'From the pattern below, how many symbols ⊗ are there in the 5th group?',
      vi: 'Cho quy luật dưới đây, hỏi có bao nhiêu kí hiệu ⊗ trong nhóm thứ 5?',
      rule: '🔍 Quy luật: kí hiệu xếp theo 3 cạnh của hình tam giác. Mỗi nhóm sau thêm <b>6</b> kí hiệu ⊗.',
      more: ['👉 Nhóm 5: 18 + 6 = <b>24</b>'] }),
    symQ({ n: 6, answer: 10, mark: '※', counts: [1, 3, 6],
      groups: [1, 2, 3].map(n => ({ n, on: cellsWhere(n, (r, c) => c >= r) })),
      en: 'According to the pattern shown below, how many ※ are there in the 4th group?',
      vi: 'Cho quy luật dưới đây, có bao nhiêu hình ※ trong nhóm thứ tư?',
      rule: '🔍 Quy luật: nhóm sau to hơn 1 hàng; nhóm 2 thêm 2, nhóm 3 thêm 3, vậy nhóm 4 thêm 4.',
      more: ['👉 Nhóm 4: 6 + 4 = <b>10</b>'] }),
    letterQ({ n: 7, answer: 'Q', items: ['A', 'E', 'I', 'M', null], walk: ['M', 4],
      en: 'According to the pattern below, what is the English letter in the space? A, E, I, M, __',
      vi: 'Cho quy luật dưới đây, tìm chữ cái tiếng Anh điền vào chỗ trống: A, E, I, M, __',
      rule: '🔍 A → E → I → M: mỗi lần đếm tiếp <b>4</b> chữ cái.',
      last: '👉 Từ M đếm tiếp 4 chữ: N, O, P, <b>Q</b>.' }),
    letterQ({ n: 8, answer: 'Q', items: ['B', 'd', 'G', 'i', 'L', 'n', null], walk: ['N', 3], group: i => i % 2,
      en: 'According to the pattern below, what is the English letter in the space? B, d, G, i, L, n, __',
      vi: 'Cho quy luật dưới đây, tìm chữ cái tiếng Anh điền vào chỗ trống: B, d, G, i, L, n, __',
      rule: '🔍 Các chữ lần lượt đếm tiếp 2 chữ, rồi 3 chữ, rồi 2, rồi 3… (B → d: 2, d → G: 3). Chữ in hoa và chữ thường xen kẽ nhau.',
      last: '👉 n → ? phải đếm tiếp 3 chữ: o, p, q. Đến lượt chữ in hoa nên là <b>Q</b>.' }),
    codeQ({ n: 9, from: 'STAR', to: 'VWDU', ask: 'HAM', answer: 'KDP' }),
    codeQ({ n: 10, from: 'FULL', to: 'KZQQ', ask: 'MATH', answer: 'RFYM' }),
  ];

  // ---------- Bài 3: Dãy hình có quy luật ----------
  // items: các hình đề cho, null là chỗ trống. unit: nhóm hình lặp lại. opts: các hình để bé chọn.
  function figQ(o) {
    const at = o.items.indexOf(null), pos1 = (at % o.unit.length) + 1;
    return {
      tag: ex(o.n), type: 'choice', answer: o.answer, hint: 1,
      choices: o.opts.map(f => ({ value: f, html: `<b class="big-emoji">${f}</b>` })),
      en: o.en, vi: o.vi,
      visual: box => V().seq(box, o.items),
      steps: [
        { text: o.rule || `🔍 Nhóm <b>${o.unit.join(' ')}</b> lặp đi lặp lại (mỗi nhóm ${o.unit.length} hình).` },
        { text: o.last || `👉 Chỗ cần tìm là hình thứ ${at + 1}. Đếm theo từng nhóm ${o.unit.length} hình thì nó là hình thứ ${pos1} của nhóm.`,
          run: t => t.fill(at, o.answer) },
        { text: `🎉 Đáp án: <b>${o.answer}</b>` },
      ],
    };
  }
  const NEXT_EN = 'Given the sequence below, find the next figure.';
  const NEXT_VI = 'Cho dãy dưới đây, hình tiếp theo là hình nào?';
  const L3 = [
    figQ({ n: 1, answer: '★', opts: ['■', '★', '▲'], unit: ['■', '★', '▲', '★'],
      items: ['■', '★', '▲', '★', '■', '★', '▲', '★', '■', '★', '▲', null], en: NEXT_EN, vi: NEXT_VI }),
    figQ({ n: 2, answer: '□', opts: ['✚', '□', '●'], unit: ['✚', '□', '●', '□', '✚'],
      items: ['✚', '□', '●', '□', '✚', '✚', '□', '●', '□', '✚', '✚', '□', '●', '□', '✚', '✚', null],
      en: 'Given the sequence below, find the next figure.', vi: 'Cho dãy dưới đây, tìm hình tiếp theo của dãy.' }),
    figQ({ n: 3, answer: '★', opts: ['★', '▲', '□'], unit: ['★', '★', '▲', '□'],
      items: ['★', '★', '▲', '□', '★', '★', '▲', '□', '★', '★', '▲', '□', '★', '★', '▲', '□', '★', null],
      en: 'By observing the pattern from left to right, what is the next figure?',
      vi: 'Quan sát quy luật dưới đây từ trái sang phải, hỏi hình tiếp theo là hình nào?' }),
    figQ({ n: 4, answer: '○', opts: ['○', '★', '▲'], unit: ['○', '★', '▲', '★'],
      items: ['○', '★', '▲', '★', '○', '★', '▲', '★', null, '★'],
      en: 'According to the pattern shown below, what is the missing figure?',
      vi: 'Dựa vào quy luật dưới đây, hình còn thiếu là hình nào?' }),
    figQ({ n: 5, answer: '○', opts: ['○', '□', '△'], unit: ['○', '□', '○', '△'],
      items: ['○', '□', '○', '△', '○', '□', '○', '△', '○', '□', null, '△'],
      en: 'According to the pattern shown below, what is the figure in the space provided?',
      vi: 'Theo quy luật dưới đây, hình nào là hình điền vào chỗ trống?' }),
    figQ({ n: 6, answer: '○', opts: ['○', '△', '□'], unit: ['○', '△', '□', '○'],
      items: ['○', '△', '□', '○', '○', '△', '□', '○', '○', '△', '□', '○', null],
      en: 'According to the pattern shown below, what is the next symbol?',
      vi: 'Theo quy luật dưới đây, hình tiếp theo là hình nào?' }),
    figQ({ n: 7, answer: '😐', opts: ['😄', '😐', '😢'], unit: [],
      items: ['😄', '😐', '😐', '😢', '😄', '😄', '😐', '😐', '😐', '😢', '😢', '😄', '😄', '😄', '😐', '😐', '😐', null],
      en: 'According to the pattern shown below, what is the next symbol?',
      vi: 'Theo quy luật dưới đây, hình tiếp theo là hình nào?',
      rule: '🔍 Chia thành từng nhóm: (1 😄, 2 😐, 1 😢), (2 😄, 3 😐, 2 😢), (3 😄, …). Mỗi nhóm sau mỗi loại thêm 1 hình.',
      last: '👉 Nhóm 3 phải có 3 😄, <b>4 😐</b>, 3 😢. Mới có 3 😐 nên hình tiếp theo vẫn là 😐.' }),
  ];

  // ---------- Bài 4: Thứ ngày tháng (bài tập trong sách, đã có ở Thử thách TIMO của Bài 4) ----------
  const dayHtml = i => `<span class="day-chip" style="--c:${D.DAYS[i].color}">${D.cap(D.DAYS[i].vi)}</span><small>${D.DAYS[i].en}</small>`;
  const L4 = D.BOOK_DATE.map((q, i) => ({
    tag: q.tag ? `${ex(i + 1)} · ${q.tag}` : ex(i + 1), type: 'choice', en: q.en, vi: q.vi,
    answer: D.answerOf(q), hint: D.dateHintCount(q), steps: D.dateSteps(q),
    choices: D.DAYS.map((_, k) => ({ value: k, html: dayHtml(k) })),
  }));

  // ---------- Bài 5: Tính tuổi (bài tập trong sách, đã có ở Thử thách TIMO của Bài 5) ----------
  const L5 = D.BOOK_AGE.map((q, i) => ({ tag: ex(i + 1), type: 'num', en: q.en, vi: q.vi, answer: q.answer, hint: q.hint, steps: q.steps }));

  // ---------- Bài 6: Bài toán xếp hàng ----------
  function lineQ(o) {
    return {
      tag: ex(o.n), type: 'num', answer: o.answer, hint: 1, en: o.en, vi: o.vi,
      visual: box => V().queue(box, o.total, o.at),
      steps: o.steps.concat({ text: `🎉 Đáp án: <b>${o.answer}</b>` }),
    };
  }
  const L6 = [
    lineQ({ n: 1, answer: 5, total: 9, at: 6,
      en: 'There are 9 people in a row, 3 people behind Tommy. How many people are in front of Tommy?',
      vi: 'Một hàng có 9 người, phía sau Tommy có 3 người. Hỏi phía trước Tommy có mấy người?',
      steps: [
        { text: '🙂 Phía sau Tommy có 3 người.', run: t => t.mark(7, 9, 'back') },
        { text: '🧒 Vị trí của Tommy: 9 − 3 = <b>6</b> (Tommy đứng thứ 6).' },
        { text: '➖ Phía trước Tommy: 6 − 1 = <b>5</b> người.', run: t => t.mark(1, 5, 'front') },
      ] }),
    lineQ({ n: 2, answer: 10, total: 14, at: 10,
      en: '14 people line up a row. There are 4 people behind Nicole. What is Nicole\'s position in the row?',
      vi: 'Có 14 người xếp thành một hàng. Phía sau Nicole có 4 người, hỏi Nicole đứng ở vị trí thứ mấy trong hàng?',
      steps: [
        { text: '🙂 Phía sau Nicole có 4 người.', run: t => t.mark(11, 14, 'back') },
        { text: '🧮 Vị trí = tổng số người − số người đứng sau: 14 − 4 = <b>10</b>.' },
      ] }),
    lineQ({ n: 3, answer: 7, total: 12, at: 9,
      en: '12 people line up a row and Michael is at the top. Behind Jenny there are 3 people. How many people are between Michael and Jenny?',
      vi: 'Có 12 người xếp thành một hàng và Michael đứng đầu hàng. Phía sau Jenny còn 3 người. Hỏi giữa Michael và Jenny có bao nhiêu người?',
      steps: [
        { text: '🙂 Michael đứng đầu hàng: vị trí thứ 1.', run: t => t.mark(1, 1, 'front') },
        { text: '🧒 Phía sau Jenny còn 3 người → Jenny đứng thứ 12 − 3 = <b>9</b>.', run: t => t.mark(10, 12, 'back') },
        { text: '➖ Giữa vị trí 1 và vị trí 9: 9 − 1 − 1 = <b>7</b> người.' },
      ] }),
    lineQ({ n: 4, answer: 7, total: 13, at: 7,
      en: 'There is a line of 13 people. Jack stands in the middle of the line. What is Jack\'s position in the line?',
      vi: 'Một hàng có 13 người, Jack đứng ở vị trí chính giữa hàng. Hỏi Jack đứng ở vị trí thứ mấy trong hàng?',
      steps: [
        { text: '🧒 Đứng chính giữa: số người đứng trước bằng số người đứng sau.' },
        { text: '➖ Bỏ Jack ra còn 13 − 1 = 12 người, chia đôi: mỗi bên <b>6</b> người.', run: t => { t.mark(1, 6, 'front'); t.mark(8, 13, 'back'); } },
        { text: '👉 Jack đứng sau 6 người nên đứng thứ 6 + 1 = <b>7</b>.' },
      ] }),
    lineQ({ n: 5, answer: 2, total: 8, at: 3,
      en: 'In a line, Mitchel is at 3rd place, Mary is at 6th. How many people are there between Mitchel and Mary?',
      vi: 'Trong một hàng dọc, Mitchel đứng ở vị trí thứ 3, Mary đứng ở vị trí thứ 6. Hỏi giữa Mitchel và Mary có bao nhiêu bạn?',
      steps: [
        { text: '🙂 Mitchel đứng thứ 3, Mary đứng thứ 6.' },
        { text: '👉 Ở giữa là các bạn đứng thứ 4 và thứ 5.', run: t => t.mark(4, 5, 'front') },
        { text: '➖ 6 − 3 − 1 = <b>2</b> bạn.' },
      ] }),
  ];

  (root.TVBook = root.TVBook || []).push(
    { id: 'sach-1-1', part: 'A', icon: '🔢', lesson: 'Lesson 1', title: 'Dãy số có quy luật', en: 'Number sequence with pattern', questions: L1 },
    { id: 'sach-1-2', part: 'A', icon: '🧩', lesson: 'Lesson 2', title: 'Bài toán về dãy có quy luật', en: 'Problems related to sequence with pattern', questions: L2 },
    { id: 'sach-1-3', part: 'A', icon: '🔷', lesson: 'Lesson 3', title: 'Dãy hình có quy luật', en: 'Figure sequence with pattern', questions: L3 },
    { id: 'sach-1-4', part: 'A', icon: '📅', lesson: 'Lesson 4', title: 'Thứ ngày tháng', en: 'Date problem', questions: L4 },
    { id: 'sach-1-5', part: 'A', icon: '🎂', lesson: 'Lesson 5', title: 'Tính tuổi', en: 'Age problem', questions: L5 },
    { id: 'sach-1-6', part: 'A', icon: '🧍', lesson: 'Lesson 6', title: 'Xếp hàng', en: 'Line forming problem', questions: L6 },
  );
})(typeof window !== 'undefined' ? window : globalThis);
