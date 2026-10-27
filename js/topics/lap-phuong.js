/* Chủ đề: Đếm khối lập phương (Geometry) */
(function (root) {
  'use strict';
  const { pick } = root.TVData;
  const V = () => root.TV.vis;

  // h[r][c] = số khối chồng ở mỗi ô. Đếm theo tầng: tầng k có bao nhiêu ô cao từ k khối trở lên.
  function stackQ(o) {
    const cells = o.h.flat(), top = Math.max(...cells), calc = cells.reduce((a, b) => a + b, 0);
    const layers = Array.from({ length: top }, (_, z) => cells.filter(n => n > z).length);
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2,
      en: o.en || 'Some identical cubes are stacked together as shown in the figure below. At least how many cubes are there in the figure?',
      vi: o.vi || 'Các khối lập phương giống nhau được xếp chồng lên nhau như hình. Hỏi có ít nhất bao nhiêu khối lập phương?',
      wrong: [calc - 1, calc + 1, layers[0]],
      visual: box => V().cubes(box, o.h),
      steps: [
        { text: '💡 Đếm theo từng tầng, từ dưới lên. Khối ở trên luôn có khối đỡ bên dưới (kể cả khối bị che khuất).' },
        ...layers.map((n, z) => ({ text: `${['🟨', '🟧', '🟪', '🟩'][z % 4]} Tầng ${z + 1}${z === 0 ? ' (dưới cùng)' : ''}: <b>${n}</b> khối`, run: t => t.layer(z) })),
        ...(layers.length > 1 ? [{ text: `➕ Tất cả: ${layers.join(' + ')} = <b>${calc}</b>` }] : []),
        { text: `🎉 Đáp án: <b>${calc}</b> khối` },
      ],
    };
  }

  // Hình 1 có h khối; Hình 2 ghép từ k hình 1 giống nhau
  function copyQ(o) {
    const one = o.h.flat().reduce((a, b) => a + b, 0), calc = one * o.k;
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2,
      en: `Figure 1 is formed by ${one} cubes and figure 2 is formed by ${o.k} identical shapes as figure 1. How many cubes are there in figure 2?`,
      vi: `Hình 1 được ghép từ ${one} khối lập phương (như hình). Hình 2 được ghép từ ${o.k} hình giống hệt Hình 1. Hỏi Hình 2 có bao nhiêu khối lập phương?`,
      wrong: [one + o.k, calc - one],
      visual: box => V().cubes(box, o.h),
      steps: [
        { text: `🧊 Hình 1 có <b>${one}</b> khối.` },
        { text: `🧩 Hình 2 gồm ${o.k} hình 1 → cộng ${one} lặp lại ${o.k} lần.` },
        { text: `🔢 Đếm thêm ${one}: ${Array.from({ length: o.k }, (_, i) => one * (i + 1)).join(', ')}.` },
        { text: `🎉 Đáp án: <b>${calc}</b> khối` },
      ],
    };
  }

  const STACKS = [
    [[1, 1], [1, 1]], [[2, 1], [1, 0]], [[3, 2, 1]], [[2, 2], [1, 1]], [[2, 1, 1], [1, 1, 0]],
    [[3, 1], [2, 1]], [[1, 2, 1], [1, 1, 1]], [[2, 2, 2]], [[3, 2], [2, 1]],
  ];
  function gen() { return Math.random() < 0.8 ? stackQ({ h: pick(STACKS) }) : copyQ({ h: pick(STACKS.slice(0, 4)), k: pick([2, 3]) }); }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'lap-phuong', part: 'D', icon: '🧊', title: 'Khối lập phương', sub: 'Đếm theo từng tầng',
    intro: 'Các khối lập phương xếp chồng lên nhau, có khối bị che mất. Mình đếm từng tầng từ dưới lên là không sót!',
    words: [
      { en: 'Cube', vi: 'Khối lập phương', icon: '🧊' },
      { en: 'Identical', vi: 'Giống nhau', icon: '👯' },
      { en: 'Stacked', vi: 'Xếp chồng', icon: '🧱' },
      { en: 'Figure', vi: 'Hình', icon: '🖼️' },
      { en: 'At least', vi: 'Ít nhất', icon: '🔽' },
      { en: 'Formed by', vi: 'Được ghép bởi', icon: '🧩' },
    ],
    tips: [
      '🟨 Đếm tầng dưới cùng trước, rồi tầng 2, tầng 3…',
      '👀 Khối ở trên cao phải có khối đỡ bên dưới, dù mình không nhìn thấy.',
      '🧩 Hình ghép từ nhiều hình giống nhau: đếm 1 hình rồi cộng lặp lại.',
    ],
    examples: [
      stackQ({ title: 'Ví dụ 1 · Một tầng', h: [[1, 1], [1, 1]] }),
      stackQ({ title: 'Ví dụ 2 · Cầu thang', h: [[3, 2, 1]] }),
      copyQ({ title: 'Ví dụ 3 · Ghép hình giống nhau', h: [[2, 1], [1, 0]], k: 2 }),
    ],
    gen,
    test: [
      stackQ({ src: 'Giống đề TIMO', h: [[2, 2], [1, 1]], answer: 6 }),
      stackQ({ src: 'Giống đề TIMO', h: [[3, 1], [2, 1]], answer: 7 }),
      stackQ({ src: 'Giống đề TIMO', h: [[1, 1, 1], [1, 2, 1], [1, 1, 1]], answer: 10 }),
      copyQ({ src: 'VQG 2024–2025 · Câu 16', h: [[2, 1], [1, 1]], k: 4, answer: 20 }),
      copyQ({ src: 'Giống câu 16 – Mock 2025', h: [[3, 2, 1]], k: 2, answer: 12 }),
      stackQ({ src: 'Giống câu 20 – VQG 2025–2026', h: [[3, 3, 2], [2, 2, 1], [1, 1, 1]], answer: 16 }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
