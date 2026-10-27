/* Chủ đề: Quy luật hình – nhóm hình lặp lại (Logical thinking) */
(function (root) {
  'use strict';
  const { rand, pick, shuffle } = root.TVData;
  const V = () => root.TV.vis;

  // Tìm nhóm lặp lại ngắn nhất khớp với mọi hình đã biết (null là chỗ trống)
  function unitOf(items) {
    for (let L = 1; L < items.length; L++) {
      const unit = Array(L).fill(null);
      const ok = items.every((v, i) => {
        if (v == null) return true;
        if (unit[i % L] == null) unit[i % L] = v;
        return unit[i % L] === v;
      });
      if (ok && !unit.includes(null)) return unit;
    }
    return null;
  }

  // items: mảng hình, null là chỗ trống. Đáp án chọn trong các hình xuất hiện trong dãy (+ 1 hình lạ).
  function patQ(o) {
    const { items } = o, b = items.indexOf(null), unit = unitOf(items), L = unit.length, calc = unit[b % L];
    const pool = Array.from(new Set(items.filter(v => v != null).concat(o.extra || [])));
    const choices = shuffle(pool).map(v => ({ value: v, html: `<span class="big-emoji">${v}</span>` }));
    return {
      title: o.title, src: o.src, type: 'choice', answer: o.answer || calc, calc, hint: 2, choices,
      en: 'According to the pattern shown below, what is the figure in the space provided?',
      vi: 'Theo quy luật, hình nào cần điền vào chỗ trống?',
      visual: box => V().seq(box, items, { group: i => (Math.floor(i / L) % 2) }),
      steps: [
        { text: `👀 Tìm nhóm lặp lại: ${unit.join(' ')} — rồi lại ${unit.join(' ')}…`, run: t => t.mark(unit.map((_, i) => i), 'hl') },
        { text: `🔁 Mỗi nhóm có <b>${L}</b> hình. Các nhóm được tô 2 màu xen kẽ để dễ nhìn.` },
        { text: `👉 Chỗ trống là hình thứ ${(b % L) + 1} trong nhóm → <span class="big-emoji">${calc}</span>`, run: t => t.fill(b, calc) },
        { text: `🎉 Đáp án: <span class="big-emoji">${calc}</span>` },
      ],
    };
  }

  const SETS = [['🔴', '🔵', '🟢', '🟡'], ['🍎', '🍌', '🍇', '🍓'], ['🐶', '🐱', '🐭', '🐰'], ['⭐', '🌙', '☀️', '☁️'], ['🔺', '🟦', '🟣', '🔶']];
  function gen() {
    const set = shuffle(pick(SETS)), L = rand(2, 3);
    const unit = Array.from({ length: L }, (_, i) => set[i]);
    if (L === 2 && Math.random() < 0.4) unit.push(unit[0]); // dạng A A B hoặc A B A
    const len = unit.length * 2 + rand(1, unit.length);
    const items = Array.from({ length: len }, (_, i) => unit[i % unit.length]);
    items[Math.random() < 0.6 ? len - 1 : rand(1, len - 2)] = null;
    return patQ({ items, extra: [set[3]] });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'quy-luat-hinh', part: 'A', icon: '🔷', title: 'Quy luật hình', sub: 'Nhóm hình lặp lại',
    intro: 'Các hình xếp theo một nhóm, rồi nhóm đó lặp lại mãi. Tìm ra nhóm là biết hình tiếp theo!',
    words: [
      { en: 'Pattern', vi: 'Quy luật', icon: '🧩' },
      { en: 'Figure', vi: 'Hình', icon: '🔷' },
      { en: 'Shape', vi: 'Hình dạng', icon: '🔺' },
      { en: 'Repeat', vi: 'Lặp lại', icon: '🔁' },
      { en: 'Space provided', vi: 'Chỗ trống', icon: '⬜' },
      { en: 'Next', vi: 'Tiếp theo', icon: '➡️' },
    ],
    tips: [
      '👀 Đọc từ trái sang phải, tìm chỗ dãy bắt đầu lặp lại.',
      '🔁 Khoanh từng nhóm lặp lại: 🔴🔵 | 🔴🔵 | 🔴🔵…',
      '👉 Chỗ trống là hình thứ mấy trong nhóm thì chọn hình đó.',
    ],
    examples: [
      patQ({ title: 'Ví dụ 1 · Nhóm 2 hình', items: ['🔴', '🔵', '🔴', '🔵', '🔴', null], extra: ['🟢'] }),
      patQ({ title: 'Ví dụ 2 · Nhóm 3 hình', items: ['🐶', '🐱', '🐭', '🐶', '🐱', '🐭', '🐶', null], extra: ['🐰'] }),
      patQ({ title: 'Ví dụ 3 · Mũi tên xoay', items: ['⬆️', '➡️', '⬇️', '⬅️', '⬆️', '➡️', null], extra: [] }),
    ],
    gen,
    test: [
      patQ({ src: 'Giống câu 20 – VQG 2024–2025', items: ['🔺', '🟦', '🔺', '🟦', '🔺', null], extra: ['🟣'], answer: '🟦' }),
      patQ({ src: 'Giống câu 19 – Mock 2025', items: ['🍎', '🍎', '🍌', '🍎', '🍎', '🍌', '🍎', null], extra: ['🍇'], answer: '🍎' }),
      patQ({ src: 'Giống đề TIMO', items: ['⬆️', '➡️', '⬇️', '⬅️', '⬆️', '➡️', null], answer: '⬇️' }),
      patQ({ src: 'Giống câu 17 – Đề 1', items: ['🔴', '🟡', '🟢', '🔴', '🟡', null, '🔴'], extra: ['🔵'], answer: '🟢' }),
      patQ({ src: 'Giống đề TIMO', items: ['⭐', '🌙', '🌙', '⭐', '🌙', '🌙', '⭐', null], extra: ['☀️'], answer: '🌙' }),
      patQ({ src: 'Giống đề TIMO', items: ['🐶', '🐱', '🐭', '🐶', '🐱', '🐭', '🐶', '🐱', null], extra: ['🐰'], answer: '🐭' }),
      patQ({ src: 'VQG 2025–2026 · Câu 18', items: ['🟥', '⭐', '🔺', '🟥', '⚪', '🔺', '🟥', '⭐', '🔺', '🟥', '⚪', '🔺', '🟥', '⭐', '🔺', '🟥', null, '🔺'], answer: '⚪' }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
