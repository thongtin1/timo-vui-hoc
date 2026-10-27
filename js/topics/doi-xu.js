/* Chủ đề: Đổi tiền xu (Combinatorics) */
(function (root) {
  'use strict';
  const { rand, pick } = root.TVData;
  const V = () => root.TV.vis;

  // have: [{ v: 1, n: 8 }, { v: 2, n: 4 }] – các đồng xu đang có; to: mệnh giá muốn đổi sang
  function coinQ(o) {
    const { have, to } = o;
    const total = have.reduce((a, c) => a + c.v * c.n, 0), calc = Math.floor(total / to), rest = total - calc * to;
    const valueStep = c => (c.v === 1 ? `${c.n} đồng $1 = <b>${c.n}</b> đô` : `${c.n} đồng $${c.v}: đếm thêm ${c.v}: ${Array.from({ length: c.n }, (_, i) => c.v * (i + 1)).join(', ')} → <b>${c.v * c.n}</b> đô`);
    const count = calc <= 12
      ? `🔢 Đếm thêm ${to} cho tới ${total}: ${Array.from({ length: calc }, (_, i) => to * (i + 1)).join(', ')} → <b>${calc}</b> đồng $${to}${rest ? `, còn thừa ${rest} đô (không đủ đổi thêm)` : ''}.`
      : `🔢 Cứ 10 đô đổi được ${10 / to} đồng $${to}. ${total} đô gồm ${total / 10} lần 10 đô → ${Array(total / 10).fill(10 / to).join(' + ')} = <b>${calc}</b> đồng $${to}.`;
    const en = `${o.name || 'Neo'} has ${have.map(c => `${c.n} $${c.v} coins`).join(' and ')}. At most how many $${to} coins can he exchange?`;
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2, en,
      vi: `${o.name || 'Neo'} có ${have.map(c => `${c.n} đồng $${c.v}`).join(' và ')}. Hỏi đổi được nhiều nhất bao nhiêu đồng $${to}?`,
      wrong: [calc + 1, calc - 1, have.reduce((a, c) => a + c.n, 0)],
      visual: box => V().coins(box, have),
      steps: [
        ...have.map(c => ({ text: `💰 ${valueStep(c)}` })),
        ...(have.length > 1 ? [{ text: `➕ Tổng: ${have.map(c => c.v * c.n).join(' + ')} = <b>${total}</b> đô.` }] : []),
        { text: count, run: t => t.change(Math.min(calc, 20), rest, to) },
        { text: `🎉 Đáp án: <b>${calc}</b> đồng $${to}` },
      ],
    };
  }

  function gen() {
    return coinQ({ name: pick(['Neo', 'Tom', 'Bin', 'Henry']), have: [{ v: 1, n: rand(1, 9) }, { v: 2, n: rand(1, 8) }], to: 5 });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'doi-xu', part: 'E', icon: '🪙', title: 'Đổi tiền xu', sub: 'Có bao nhiêu đô?',
    intro: 'Muốn đổi tiền, mình tính xem có tất cả bao nhiêu đô trước, rồi đếm xem đổi được mấy đồng mới.',
    words: [
      { en: 'Coin', vi: 'Đồng xu', icon: '🪙' },
      { en: 'Exchange', vi: 'Đổi', icon: '🔁' },
      { en: 'At most', vi: 'Nhiều nhất', icon: '🔼' },
      { en: 'Dollar ($)', vi: 'Đô la', icon: '💵' },
      { en: 'Has', vi: 'Có', icon: '👜' },
    ],
    tips: [
      '💰 Tính tổng số tiền: đồng $2 thì đếm thêm 2, đồng $5 thì đếm thêm 5.',
      '🔢 Đổi sang đồng $5: đếm thêm 5 (5, 10, 15…) cho tới khi không đủ nữa.',
      '⚠️ Tiền thừa không đủ thì không đổi được.',
    ],
    examples: [
      coinQ({ title: 'Ví dụ 1 · Chỉ có đồng $1', have: [{ v: 1, n: 12 }], to: 5 }),
      coinQ({ title: 'Ví dụ 2 · Đồng $1 và $2', have: [{ v: 1, n: 3 }, { v: 2, n: 4 }], to: 5 }),
      coinQ({ title: 'Ví dụ 3 · Đổi sang đồng $2', have: [{ v: 5, n: 2 }], to: 2 }),
    ],
    gen,
    test: [
      coinQ({ src: 'VQG 2024–2025 · Câu 23', have: [{ v: 1, n: 8 }, { v: 2, n: 4 }], to: 5, answer: 3 }),
      coinQ({ src: 'Mock 2025 · Câu 21', have: [{ v: 1, n: 9 }, { v: 2, n: 12 }], to: 5, answer: 6 }),
      coinQ({ src: 'VQG 2025–2026 · Câu 24', name: 'Henry', have: [{ v: 5, n: 7 }, { v: 1, n: 5 }], to: 2, answer: 20 }),
      coinQ({ src: 'Giống đề TIMO', name: 'Tom', have: [{ v: 1, n: 7 }, { v: 2, n: 9 }], to: 5, answer: 5 }),
      coinQ({ src: 'Giống đề TIMO', name: 'Bin', have: [{ v: 2, n: 8 }], to: 5, answer: 3 }),
      coinQ({ src: 'Giống đề TIMO', name: 'An', have: [{ v: 1, n: 4 }, { v: 2, n: 3 }], to: 5, answer: 2 }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
