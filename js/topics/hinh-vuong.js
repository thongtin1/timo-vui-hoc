/* Chủ đề: Đếm hình vuông (Geometry) */
(function (root) {
  'use strict';
  const { rand } = root.TVData;
  const V = () => root.TV.vis;

  // Lưới rows × cols ô vuông nhỏ: đếm hình vuông 1 ô, 2 × 2 ô, 3 × 3 ô…
  function gridQ(o) {
    const { rows, cols } = o, sizes = [];
    for (let k = 1; k <= Math.min(rows, cols); k++) sizes.push({ k, n: (rows - k + 1) * (cols - k + 1) });
    const calc = sizes.reduce((a, s) => a + s.n, 0);
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2,
      en: 'How many squares are there in the figure below?', vi: 'Hình dưới đây có bao nhiêu hình vuông?',
      wrong: [rows * cols, calc + 1, calc - 1],
      visual: box => V().grid(box, rows, cols),
      steps: [
        { text: '💡 Đếm theo cỡ: hình vuông nhỏ (1 ô) trước, rồi hình vuông to dần.' },
        ...sizes.map(s => ({
          text: s.k === 1
            ? `🟨 Hình vuông nhỏ 1 ô: ${rows} hàng, mỗi hàng ${cols} ô → ${Array(rows).fill(cols).join(' + ')} = <b>${s.n}</b>`
            : `🟧 Hình vuông ${s.k} × ${s.k} ô (ghép từ ${s.k * s.k} ô nhỏ): <b>${s.n}</b>`,
          run: t => t.show(s.k),
        })),
        ...(sizes.length > 1 ? [{ text: `➕ Tất cả: ${sizes.map(s => s.n).join(' + ')} = <b>${calc}</b>` }] : []),
        { text: `🎉 Đáp án: <b>${calc}</b> hình vuông` },
      ],
    };
  }

  function gen() {
    const rows = rand(1, 3);
    return gridQ({ rows, cols: rand(Math.max(rows, 2), 4) });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'hinh-vuong', part: 'D', icon: '🟦', title: 'Đếm hình vuông', sub: 'Nhỏ rồi to, không sót',
    intro: 'Trong một hình có hình vuông nhỏ và cả hình vuông to ghép lại. Mình đếm theo từng cỡ để không sót nhé!',
    words: [
      { en: 'Square', vi: 'Hình vuông', icon: '🟦' },
      { en: 'Figure', vi: 'Hình vẽ', icon: '🖼️' },
      { en: 'Small', vi: 'Nhỏ', icon: '🔹' },
      { en: 'Big / Large', vi: 'To / Lớn', icon: '🔷' },
      { en: 'How many', vi: 'Bao nhiêu', icon: '❓' },
    ],
    tips: [
      '🟨 Đếm hình vuông nhỏ (1 ô) trước.',
      '🟧 Rồi đếm hình vuông to ghép từ 4 ô (2 × 2), 9 ô (3 × 3)…',
      '➕ Cộng tất cả lại. Hình chữ nhật dài không phải hình vuông nhé!',
    ],
    examples: [
      gridQ({ title: 'Ví dụ 1 · Hàng 3 ô', rows: 1, cols: 3 }),
      gridQ({ title: 'Ví dụ 2 · Lưới 2 × 2', rows: 2, cols: 2 }),
      gridQ({ title: 'Ví dụ 3 · Lưới 2 × 3', rows: 2, cols: 3 }),
    ],
    gen,
    test: [
      gridQ({ src: 'Giống câu 13 – Đề 1', rows: 2, cols: 2, answer: 5 }),
      gridQ({ src: 'Giống câu 17 – Mock 2025', rows: 2, cols: 3, answer: 8 }),
      gridQ({ src: 'Giống câu 17 – VQG 2024–2025', rows: 2, cols: 4, answer: 11 }),
      gridQ({ src: 'Giống câu 16 – VQG 2025–2026', rows: 3, cols: 3, answer: 14 }),
      gridQ({ src: 'Giống đề TIMO', rows: 1, cols: 5, answer: 5 }),
      gridQ({ src: 'Giống đề TIMO', rows: 3, cols: 4, answer: 20 }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
