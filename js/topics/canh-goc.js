/* Chủ đề: Cạnh và góc của đa giác (Geometry) */
(function (root) {
  'use strict';
  const { pick } = root.TVData;
  const V = () => root.TV.vis;

  // Đỉnh các hình, toạ độ trong khung 0..100
  const star = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? 20 : 48, a = -Math.PI / 2 + (i * Math.PI) / 5;
    return [Math.round(50 + r * Math.cos(a)), Math.round(52 + r * Math.sin(a))];
  });
  const SHAPES = {
    tam: { vi: 'tam giác', pts: [[50, 5], [95, 90], [5, 90]] },
    vuong: { vi: 'hình vuông', pts: [[10, 10], [90, 10], [90, 90], [10, 90]] },
    nha: { vi: 'ngôi nhà', pts: [[50, 5], [95, 45], [95, 95], [5, 95], [5, 45]] },
    L: { vi: 'chữ L', pts: [[5, 5], [45, 5], [45, 60], [95, 60], [95, 95], [5, 95]] },
    ten: { vi: 'mũi tên', pts: [[5, 35], [55, 35], [55, 5], [95, 50], [55, 95], [55, 65], [5, 65]] },
    sao: { vi: 'ngôi sao', pts: star },
    cong: { vi: 'dấu cộng', pts: [[35, 5], [65, 5], [65, 35], [95, 35], [95, 65], [65, 65], [65, 95], [35, 95], [35, 65], [5, 65], [5, 35], [35, 35]] },
    M: { vi: 'chữ M', pts: [[5, 95], [5, 5], [50, 50], [95, 5], [95, 95], [75, 95], [75, 45], [50, 70], [25, 45], [25, 95]] },
    // 11 đỉnh – giống hình ở VQG 2024–2025 câu 19 và VQG 2025–2026 câu 19
    k11a: { vi: 'đa giác', pts: [[40, 5], [60, 5], [75, 25], [95, 25], [80, 50], [60, 50], [60, 95], [40, 75], [40, 95], [5, 95], [5, 30]] },
    k11b: { vi: 'đa giác', pts: [[20, 5], [80, 5], [80, 30], [95, 30], [95, 70], [70, 70], [70, 95], [45, 95], [45, 60], [20, 60], [5, 30]] },
  };

  // ask: 'sides' (cạnh) hoặc 'angles' (góc trong)
  function polyQ(o) {
    const s = SHAPES[o.shape], n = s.pts.length, sides = o.ask === 'sides';
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : n, calc: n, hint: 1,
      en: sides ? 'How many sides are there in the polygon below?' : 'How many interior angles are there in the polygon below?',
      vi: sides ? 'Đa giác dưới đây có bao nhiêu cạnh?' : 'Đa giác dưới đây có bao nhiêu góc trong?',
      wrong: [n - 1, n + 1],
      visual: box => V().poly(box, s.pts),
      steps: sides ? [
        { text: '✏️ Đi vòng quanh hình, mỗi đoạn thẳng ở viền là 1 cạnh. Đánh số để không đếm trùng.', run: t => t.sides() },
        { text: `🔢 Đếm được: 1, 2, 3… ${n}.` },
        { text: `🎉 Đáp án: <b>${n}</b> cạnh` },
      ] : [
        { text: '📐 Góc trong nằm ở mỗi đỉnh (chỗ 2 cạnh gặp nhau), phía bên trong hình. Cả góc lõm vào cũng tính!', run: t => t.angles() },
        { text: `💡 Mẹo: hình có bao nhiêu đỉnh (bao nhiêu cạnh) thì có bấy nhiêu góc → ${n} góc.` },
        { text: `🎉 Đáp án: <b>${n}</b> góc` },
      ],
    };
  }

  function gen() {
    return polyQ({ shape: pick(['tam', 'vuong', 'nha', 'L', 'ten', 'sao', 'cong', 'M']), ask: pick(['sides', 'angles']) });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'canh-goc', part: 'D', icon: '⭐', title: 'Cạnh và góc', sub: 'Đi vòng quanh hình',
    intro: 'Mỗi đa giác có các cạnh ở viền và các góc ở đỉnh. Hình có bao nhiêu cạnh thì có bấy nhiêu góc!',
    words: [
      { en: 'Polygon', vi: 'Đa giác', icon: '⬟' },
      { en: 'Side', vi: 'Cạnh', icon: '📏' },
      { en: 'Interior angle', vi: 'Góc trong', icon: '📐' },
      { en: 'Vertex', vi: 'Đỉnh', icon: '🔺' },
      { en: 'Triangle', vi: 'Tam giác', icon: '🔺' },
      { en: 'Square', vi: 'Hình vuông', icon: '🟦' },
    ],
    tips: [
      '✏️ Chọn 1 đỉnh làm điểm bắt đầu, đi vòng quanh và đánh số từng cạnh.',
      '📐 Mỗi đỉnh có 1 góc trong. Góc lõm vào trong cũng là góc trong.',
      '💡 Số cạnh = số đỉnh = số góc trong.',
    ],
    examples: [
      polyQ({ title: 'Ví dụ 1 · Ngôi nhà có mấy cạnh?', shape: 'nha', ask: 'sides' }),
      polyQ({ title: 'Ví dụ 2 · Chữ L có mấy góc?', shape: 'L', ask: 'angles' }),
      polyQ({ title: 'Ví dụ 3 · Ngôi sao có mấy cạnh?', shape: 'sao', ask: 'sides' }),
    ],
    gen,
    test: [
      polyQ({ src: 'Giống câu 14 – Đề 1', shape: 'ten', ask: 'sides', answer: 7 }),
      polyQ({ src: 'Giống câu 15 – Đề 1', shape: 'L', ask: 'angles', answer: 6 }),
      polyQ({ src: 'Giống câu 18 – Mock 2025', shape: 'sao', ask: 'sides', answer: 10 }),
      polyQ({ src: 'Giống đề TIMO', shape: 'cong', ask: 'angles', answer: 12 }),
      polyQ({ src: 'Giống đề TIMO', shape: 'M', ask: 'sides', answer: 10 }),
      polyQ({ src: 'Giống câu 19 – VQG 2024–2025', shape: 'k11a', ask: 'angles', answer: 11 }),
      polyQ({ src: 'Giống câu 19 – VQG 2025–2026', shape: 'k11b', ask: 'sides', answer: 11 }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
