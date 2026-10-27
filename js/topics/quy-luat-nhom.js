/* Chủ đề: Quy luật nhóm – nhóm thứ n có bao nhiêu hình (Logical thinking) */
(function (root) {
  'use strict';
  const { rand, pick } = root.TVData;
  const V = () => root.TV.vis;

  // Nhóm 1 có a hình, mỗi nhóm sau thêm (hoặc bớt) d hình. Đề cho xem show nhóm đầu, hỏi nhóm thứ k.
  function groupQ(o) {
    const { a, d, show, k, icon } = o, n = i => a + d * (i - 1), calc = n(k);
    const D = Math.abs(d), word = d > 0 ? 'thêm' : 'bớt';
    const first = Array.from({ length: show }, (_, i) => ({ icon, n: n(i + 1), label: `nhóm ${i + 1}` }));
    const steps = [
      { text: `🔢 Đếm: ${first.map((g, i) => `nhóm ${i + 1} có ${g.n}`).join(', ')}.` },
      { text: `🔍 Mỗi nhóm sau ${word} <b>${D}</b> ${icon} so với nhóm trước.` },
    ];
    for (let i = show + 1; i <= k; i++) {
      steps.push({ text: `👉 Nhóm ${i}: ${n(i - 1)} ${d > 0 ? '+' : '−'} ${D} = <b>${n(i)}</b>`, run: t => t.add([{ icon, n: n(i), label: `nhóm ${i}` }], 'v-pop new') });
    }
    steps.push({ text: `🎉 Đáp án: nhóm thứ ${k} có <b>${calc}</b> ${icon}` });
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2,
      en: `According to the pattern shown below, how many ${icon} are there in the ${k}th group?`,
      vi: `Theo quy luật như hình, nhóm thứ ${k} có bao nhiêu ${icon}?`,
      wrong: [calc + d, calc - d, n(show + 1)],
      visual: box => V().groups(box, first),
      steps,
    };
  }

  // Số hình tăng thêm 1, rồi 2, rồi 3…: 0, 1, 3, 6, 10, 15 (số tam giác)
  function triQ(o) {
    const { show, k, icon } = o, n = i => ((i - 1) * i) / 2, calc = n(k);
    const first = Array.from({ length: show }, (_, i) => ({ icon, n: n(i + 1), label: `nhóm ${i + 1}` }));
    const steps = [
      { text: `🔢 Đếm: ${first.map((g, i) => `nhóm ${i + 1} có ${g.n}`).join(', ')}.` },
      { text: `🔍 Mỗi nhóm thêm nhiều hơn lần trước 1 hình: thêm 1, thêm 2, thêm 3…` },
    ];
    for (let i = show + 1; i <= k; i++) {
      steps.push({ text: `👉 Nhóm ${i}: ${n(i - 1)} + ${i - 1} = <b>${n(i)}</b>`, run: t => t.add([{ icon, n: n(i), label: `nhóm ${i}` }], 'v-pop new') });
    }
    steps.push({ text: `🎉 Đáp án: nhóm thứ ${k} có <b>${calc}</b> ${icon}` });
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2,
      en: `According to the pattern shown below, how many ${icon} are there in the ${k}th group?`,
      vi: `Theo quy luật như hình, nhóm thứ ${k} có bao nhiêu ${icon}?`,
      wrong: [calc - 1, n(k - 1) + k - 2, calc + k],
      visual: box => V().groups(box, first),
      steps,
    };
  }

  function gen() {
    const icon = pick(['⭐', '🔵', '🌸', '🍎', '🍬', '🐟']);
    if (Math.random() < 0.25) {
      const d = rand(1, 3), k = rand(4, 5), a = d * (k - 1) + rand(1, 3);
      return groupQ({ icon, a, d: -d, show: 3, k });
    }
    return groupQ({ icon, a: rand(1, 4), d: rand(1, 3), show: 3, k: rand(4, 6) });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'quy-luat-nhom', part: 'A', icon: '✨', title: 'Quy luật nhóm', sub: 'Nhóm thứ mấy có mấy hình?',
    intro: 'Mỗi nhóm có nhiều hơn (hoặc ít hơn) nhóm trước một số hình bằng nhau. Đếm xem nhóm sau thêm mấy hình nhé!',
    words: [
      { en: 'Group', vi: 'Nhóm', icon: '🧺' },
      { en: '4th group', vi: 'Nhóm thứ 4', icon: '4️⃣' },
      { en: '5th group', vi: 'Nhóm thứ 5', icon: '5️⃣' },
      { en: '6th group', vi: 'Nhóm thứ 6', icon: '6️⃣' },
      { en: 'Pattern', vi: 'Quy luật', icon: '🧩' },
      { en: 'How many', vi: 'Bao nhiêu', icon: '❓' },
    ],
    tips: [
      '🔢 Đếm số hình trong từng nhóm đề cho.',
      '🔍 So 2 nhóm cạnh nhau: nhóm sau thêm (hay bớt) mấy hình?',
      '👉 Cứ thêm (hay bớt) đúng chừng đó cho tới nhóm đề hỏi.',
      '📈 Có khi số thêm vào tăng dần: thêm 1, thêm 2, thêm 3… (0, 1, 3, 6, 10, 15).',
    ],
    examples: [
      groupQ({ title: 'Ví dụ 1 · Mỗi nhóm thêm 1', icon: '🌸', a: 1, d: 1, show: 3, k: 5 }),
      groupQ({ title: 'Ví dụ 2 · Mỗi nhóm thêm 2', icon: '⭐', a: 1, d: 2, show: 3, k: 5 }),
      groupQ({ title: 'Ví dụ 3 · Mỗi nhóm bớt 2', icon: '🍬', a: 9, d: -2, show: 3, k: 4 }),
      triQ({ title: 'Ví dụ 4 · Thêm 1, thêm 2, thêm 3…', icon: '🌸', show: 4, k: 5 }),
    ],
    gen,
    test: [
      groupQ({ src: 'VQG 2025–2026 · Câu 1', icon: '🔺', a: 1, d: 2, show: 4, k: 6, answer: 11 }),
      triQ({ src: 'VQG 2024–2025 · Câu 5', icon: '⭐', show: 4, k: 6, answer: 15 }),
      triQ({ src: 'Phiếu Dãy số · Bài 38', icon: '🔵', show: 4, k: 7, answer: 21 }),
      groupQ({ src: 'Giống câu 5 – Mock 2025', icon: '🔵', a: 2, d: 2, show: 3, k: 5, answer: 10 }),
      groupQ({ src: 'Đề cương TIMO', icon: '🌸', a: 1, d: 1, show: 3, k: 7, answer: 7 }),
      groupQ({ src: 'Đề cương TIMO', icon: '🍎', a: 3, d: 3, show: 3, k: 4, answer: 12 }),
      groupQ({ src: 'Giống đề TIMO', icon: '⭐', a: 1, d: 3, show: 3, k: 5, answer: 13 }),
      groupQ({ src: 'Giống đề TIMO', icon: '🍬', a: 10, d: -2, show: 3, k: 5, answer: 2 }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
