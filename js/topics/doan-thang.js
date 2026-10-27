/* Chủ đề: Đếm đoạn thẳng (Geometry) */
(function (root) {
  'use strict';
  const { rand } = root.TVData;
  const V = () => root.TV.vis;
  const NAMES = [['A', 'B', 'C', 'D', 'E', 'F', 'G'], ['M', 'N', 'P', 'Q', 'R', 'S']];

  // counts: số điểm trên mỗi đường thẳng, vd [4] hoặc [4, 3]
  function segQ(o) {
    const lines = o.counts.map((n, r) => NAMES[r].slice(0, n));
    const per = o.counts.map(n => (n * (n - 1)) / 2), calc = per.reduce((a, b) => a + b, 0);
    const steps = [{ text: '💡 Mẹo: lấy lần lượt từng điểm, nối với các điểm ở phía sau nó trên cùng đường thẳng.' }];
    lines.forEach((pts, r) => {
      pts.slice(0, -1).forEach((p, i) => steps.push({
        text: `✏️ Từ ${p}: ${pts.slice(i + 1).map(q => p + q).join(', ')} → <b>${pts.length - 1 - i}</b> đoạn`,
        run: t => t.from(p),
      }));
      steps.push({ text: `➕ Đường ${pts[0]}…${pts[pts.length - 1]}: ${pts.slice(0, -1).map((_, i) => pts.length - 1 - i).join(' + ')} = <b>${per[r]}</b> đoạn` });
    });
    if (lines.length > 1) steps.push({ text: `➕ Cả hình: ${per.join(' + ')} = <b>${calc}</b>` });
    steps.push({ text: `🎉 Đáp án: <b>${calc}</b> đoạn thẳng` });
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2,
      en: 'How many line segments are there in the figure below?', vi: 'Hình dưới đây có bao nhiêu đoạn thẳng?',
      wrong: [o.counts.reduce((a, b) => a + b - 1, 0), calc + 1, calc - 1],
      visual: box => V().segs(box, lines),
      steps,
    };
  }

  function gen() {
    return Math.random() < 0.7 ? segQ({ counts: [rand(3, 6)] }) : segQ({ counts: [rand(3, 4), rand(2, 3)] });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'doan-thang', part: 'D', icon: '📏', title: 'Đếm đoạn thẳng', sub: 'Nối từng điểm với điểm sau',
    intro: 'Mỗi đoạn thẳng có 2 điểm ở 2 đầu. Mình nối lần lượt từng điểm với các điểm phía sau để không sót đoạn nào!',
    words: [
      { en: 'Line segment', vi: 'Đoạn thẳng', icon: '📏' },
      { en: 'Line', vi: 'Đường thẳng', icon: '➖' },
      { en: 'Point', vi: 'Điểm', icon: '⚫' },
      { en: 'Figure', vi: 'Hình vẽ', icon: '🖼️' },
      { en: 'How many', vi: 'Bao nhiêu', icon: '❓' },
    ],
    tips: [
      '⚫ Đánh tên các điểm: A, B, C, D…',
      '✏️ Từ A nối tới tất cả điểm sau A. Rồi từ B nối tới các điểm sau B…',
      '➕ 4 điểm trên 1 đường: 3 + 2 + 1 = 6 đoạn. 5 điểm: 4 + 3 + 2 + 1 = 10 đoạn.',
    ],
    examples: [
      segQ({ title: 'Ví dụ 1 · 3 điểm', counts: [3] }),
      segQ({ title: 'Ví dụ 2 · 4 điểm', counts: [4] }),
      segQ({ title: 'Ví dụ 3 · Hai đường thẳng', counts: [3, 2] }),
    ],
    gen,
    test: [
      segQ({ src: 'Giống câu 18 – Đề 1', counts: [4], answer: 6 }),
      segQ({ src: 'Giống câu 20 – Mock 2025', counts: [5], answer: 10 }),
      segQ({ src: 'Giống đề TIMO', counts: [4, 3], answer: 9 }),
      segQ({ src: 'Giống câu 18 – VQG 2024–2025', counts: [6], answer: 15 }),
      segQ({ src: 'Giống câu 17 – VQG 2025–2026', counts: [7], answer: 21 }),
      segQ({ src: 'Giống đề TIMO', counts: [5, 3], answer: 13 }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
