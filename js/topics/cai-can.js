/* Chủ đề: Cái cân – nặng hơn, nhẹ hơn, thay thế (Combinatorics) */
(function (root) {
  'use strict';
  const { rand, pick, shuffle } = root.TVData;
  const V = () => root.TV.vis;
  const rep = (s, n) => s.repeat(n);

  // 1 A = a B, 1 B = b C → 1 A = ? C
  function chainQ(o) {
    const { A, B, C, a, b } = o, calc = a * b;
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2,
      en: `The two balances below are balanced. How many ${C} weigh the same as 1 ${A}?`,
      vi: `Hai cái cân dưới đây đều thăng bằng. Hỏi 1 ${A} nặng bằng mấy ${C}?`,
      wrong: [a + b, calc + 1, b],
      visual: box => V().scales(box, [{ left: A, right: rep(B, a) }, { left: B, right: rep(C, b) }]),
      steps: [
        { text: `⚖️ Cân 2: 1 ${B} nặng bằng <b>${b}</b> ${C}.`, run: t => t.mark(1) },
        { text: `⚖️ Cân 1: 1 ${A} nặng bằng ${a} ${B}.`, run: t => t.mark(0) },
        { text: `🔁 Thay mỗi ${B} bằng ${b} ${C}: ${Array(a).fill(b).join(' + ')} = <b>${calc}</b> ${C}.` },
        { text: `🎉 Đáp án: <b>${calc}</b>` },
      ],
    };
  }

  // Hai cân nghiêng: tìm con nặng nhất / nhẹ nhất. order: từ nặng đến nhẹ, vd ['🐶', '🐱', '🐭']
  function heavyQ(o) {
    const [h, m, l] = o.order, ask = o.ask, calc = ask === 'heaviest' ? h : l;
    // Cân 1: bên trái nặng hơn. Cân 2: bên phải nặng hơn (để bé phải nhìn kỹ đĩa nào thấp)
    const sc = [{ left: h, right: m, tilt: -1 }, { left: l, right: m, tilt: 1 }];
    return {
      title: o.title, src: o.src, type: 'choice', answer: o.answer || calc, calc, hint: 2,
      choices: shuffle(o.order).map(v => ({ value: v, html: `<span class="big-emoji">${v}</span>` })),
      en: `Look at the balances. Which one is the ${ask}?`,
      vi: `Nhìn các cái cân. Con nào ${ask === 'heaviest' ? 'nặng nhất' : 'nhẹ nhất'}?`,
      visual: box => V().scales(box, sc),
      steps: [
        { text: '⚖️ Bên nào nặng hơn thì đĩa cân bên đó bị kéo xuống thấp hơn.' },
        { text: `👀 Cân 1: ${h} nặng hơn ${m}.`, run: t => t.mark(0) },
        { text: `👀 Cân 2: ${m} nặng hơn ${l}.`, run: t => t.mark(1) },
        { text: `🔽 Xếp từ nặng đến nhẹ: ${h} → ${m} → ${l}.` },
        { text: `🎉 Đáp án: ${ask === 'heaviest' ? 'nặng nhất' : 'nhẹ nhất'} là <span class="big-emoji">${calc}</span>` },
      ],
    };
  }

  // 1 A nặng bằng n B, A nặng w kg → 1 B nặng ? kg
  function kgQ(o) {
    const { A, B, n, w } = o, calc = w / n;
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2,
      en: `The balance is balanced. 1 ${A} weighs ${w} kg. How many kilograms does 1 ${B} weigh?`,
      vi: `Cái cân thăng bằng. 1 ${A} nặng ${w} kg. Hỏi 1 ${B} nặng mấy kg?`,
      wrong: [w - n, w * n, calc + 1],
      visual: box => V().scales(box, [{ left: A, right: rep(B, n) }]),
      steps: [
        { text: `⚖️ 1 ${A} nặng bằng ${n} ${B} → ${n} ${B} nặng ${w} kg.` },
        { text: `🤔 Tìm số mà cộng ${n} lần bằng ${w}: ${Array(n).fill(calc).join(' + ')} = ${w}.` },
        { text: `🎉 Đáp án: 1 ${B} nặng <b>${calc}</b> kg` },
      ],
    };
  }

  // A + A = B, B + A nặng w kg → hỏi B nặng mấy kg
  const melon = {
    src: 'Giống đề TIMO', type: 'num', answer: 6, calc: 9 / 3 * 2, hint: 2,
    en: 'The first balance shows 2 oranges weigh the same as 1 melon. 1 melon and 1 orange weigh 9 kg together. How many kilograms does the melon weigh?',
    vi: 'Cân 1: 2 quả cam nặng bằng 1 quả dưa. Cân 2: 1 quả dưa và 1 quả cam nặng 9 kg. Hỏi quả dưa nặng mấy kg?',
    visual: box => V().scales(box, [{ left: '🍈', right: '🍊🍊' }, { left: '🍈🍊', right: '9 kg' }]),
    steps: [
      { text: '⚖️ Cân 1: 🍈 nặng bằng 🍊🍊.' },
      { text: '🔁 Thay 🍈 ở cân 2 bằng 🍊🍊: 🍊🍊🍊 nặng 9 kg.' },
      { text: '🤔 3 quả cam nặng 9 kg: 3 + 3 + 3 = 9 → 1 quả cam nặng <b>3</b> kg.' },
      { text: '🧮 Quả dưa bằng 2 quả cam: 3 + 3 = <b>6</b> kg.' },
      { text: '🎉 Đáp án: <b>6</b> kg' },
    ],
  };

  const FRUIT = ['🍉', '🍍', '🍎', '🍐', '🍊', '🍌', '🍇'], ANIMALS = [['🐘', '🐻', '🐶', '🐱', '🐭'], ['🦒', '🐴', '🐑', '🐰', '🐥']];
  function gen() {
    const k = rand(1, 3);
    if (k === 1) { const [A, B, C] = shuffle(FRUIT); return chainQ({ A, B, C, a: rand(2, 3), b: rand(2, 4) }); }
    if (k === 2) { const set = pick(ANIMALS), i = rand(0, 2); return heavyQ({ order: set.slice(i, i + 3), ask: pick(['heaviest', 'lightest']) }); }
    const [A, B] = shuffle(FRUIT), n = rand(2, 3);
    return kgQ({ A, B, n, w: n * rand(2, 5) });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'cai-can', part: 'E', icon: '⚖️', title: 'Cái cân', sub: 'Nặng hơn, nhẹ hơn, bằng nhau',
    intro: 'Cái cân thăng bằng thì hai bên nặng bằng nhau. Bên nào nặng hơn thì đĩa bên đó bị kéo xuống!',
    words: [
      { en: 'Balance', vi: 'Cái cân', icon: '⚖️' },
      { en: 'Heavy / Heavier', vi: 'Nặng / Nặng hơn', icon: '🏋️' },
      { en: 'Heaviest', vi: 'Nặng nhất', icon: '🐘' },
      { en: 'Light / Lighter', vi: 'Nhẹ / Nhẹ hơn', icon: '🪶' },
      { en: 'Lightest', vi: 'Nhẹ nhất', icon: '🐭' },
      { en: 'Weigh', vi: 'Nặng, cân nặng', icon: '📦' },
      { en: 'The same as', vi: 'Bằng với', icon: '🟰' },
    ],
    tips: [
      '⚖️ Cân thăng bằng: hai bên nặng bằng nhau.',
      '🔽 Cân nghiêng: bên thấp hơn là bên nặng hơn.',
      '🔁 Thay thế: 1 🍉 = 2 🍍 thì chỗ nào có 🍉 có thể đổi thành 2 🍍.',
    ],
    examples: [
      heavyQ({ title: 'Ví dụ 1 · Con nào nặng nhất?', order: ['🐶', '🐱', '🐭'], ask: 'heaviest' }),
      chainQ({ title: 'Ví dụ 2 · Thay thế', A: '🍉', B: '🍍', C: '🍎', a: 2, b: 3 }),
      kgQ({ title: 'Ví dụ 3 · Mấy ki-lô-gam?', A: '🍉', B: '🍌', n: 2, w: 6 }),
    ],
    gen,
    test: [
      chainQ({ src: 'Đề cương TIMO', A: '🍉', B: '🍍', C: '🍎', a: 2, b: 3, answer: 6 }),
      chainQ({ src: 'Đề cương TIMO', A: '🐘', B: '🦒', C: '🐒', a: 2, b: 4, answer: 8 }),
      heavyQ({ src: 'Đề cương TIMO', order: ['🐶', '🐱', '🐭'], ask: 'heaviest', answer: '🐶' }),
      heavyQ({ src: 'Đề cương TIMO', order: ['🍉', '🍐', '🍎'], ask: 'lightest', answer: '🍎' }),
      kgQ({ src: 'Giống đề TIMO', A: '🍎', B: '🍌', n: 2, w: 6, answer: 3 }),
      melon,
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
