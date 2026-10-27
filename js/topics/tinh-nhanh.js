/* Chủ đề: Tính nhanh cộng trừ (Arithmetic) */
(function (root) {
  'use strict';
  const { rand, evalExpr } = root.TVData;
  const V = () => root.TV.vis;

  // Câu tính nhanh. expr: '21 + 7 + 62' (dấu cách giữa số và dấu).
  // steps: [{ text, g?: [[chỉ số thẻ số], nhãn] | [[[…], nhãn], [[…], nhãn]] }] – g tô nhóm thẻ cùng màu.
  // Mỗi nhóm mới lấy màu kế tiếp để bé nhìn ra từng cặp.
  function expQ(o) {
    const tokens = o.expr.split(' '), calc = evalExpr(o.expr);
    let color = 0;
    const steps = o.steps.map(s => {
      if (!s.g) return { text: s.text };
      const groups = Array.isArray(s.g[0][0]) ? s.g : [s.g];
      const mine = groups.map(() => color++);
      return { text: s.text, run: t => groups.forEach(([idxs, label], k) => t.group(idxs, V().GROUP_COLORS[mine[k] % 5], label)) };
    });
    steps.push({ text: `🎉 Đáp án: <b>${calc}</b>` });
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 1,
      en: `Find the value of ${o.expr}.`, vi: `Tính giá trị của: ${o.expr}`,
      wrong: o.wrong || [calc + 10, calc - 10, calc + 1],
      visual: box => V().chips(box, tokens),
      steps,
    };
  }

  // Câu ngẫu nhiên: ghép "bạn tròn chục" hoặc nhóm lặp lại
  function gen() {
    if (Math.random() < 0.6) {
      const x = rand(1, 9), y = rand(1, 9);
      const a = rand(1, 3) * 10 + x, c = rand(0, 2) * 10 + (10 - x);
      const b = rand(1, 2) * 10 + y, d = rand(0, 1) * 10 + (10 - y);
      const s1 = a + c, s2 = b + d;
      return expQ({
        expr: `${a} + ${b} + ${c} + ${d}`,
        steps: [
          { text: '💡 Tìm các cặp "bạn tròn chục": chữ số cuối cộng lại bằng 10.' },
          { text: `🧮 ${a} + ${c} = <b>${s1}</b>`, g: [[0, 2], String(s1)] },
          { text: `🧮 ${b} + ${d} = <b>${s2}</b>`, g: [[1, 3], String(s2)] },
          { text: `➕ ${s1} + ${s2} = <b>${s1 + s2}</b>` },
        ],
      });
    }
    const a = rand(5, 19), plus = Math.random() < 0.5, times = rand(2, 3);
    const b = plus ? rand(2, 9) : rand(2, Math.min(9, a - 1)); // phép trừ không ra số âm
    const one = plus ? a + b : a - b, sg = plus ? '+' : '−';
    const expr = Array.from({ length: times }, () => `${a} ${sg} ${b}`).join(' + ');
    const groups = Array.from({ length: times }, (_, k) => [[2 * k, 2 * k + 1], String(one)]);
    return expQ({
      expr,
      steps: [
        { text: `👀 Nhóm <b>${a} ${sg} ${b}</b> lặp lại ${times} lần.` },
        { text: `🧮 Mỗi nhóm: ${a} ${sg} ${b} = <b>${one}</b>`, g: groups },
        { text: `➕ ${Array(times).fill(one).join(' + ')} = <b>${one * times}</b>` },
      ],
    });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'tinh-nhanh', part: 'B', icon: '⚡', title: 'Tính nhanh', sub: 'Ghép bạn tròn chục',
    intro: 'Phép tính dài cũng không sợ! Mình tìm các số là "bạn" của nhau rồi ghép lại cho dễ tính.',
    words: [
      { en: 'Find the value', vi: 'Tính giá trị', icon: '🧮' },
      { en: 'Value', vi: 'Giá trị', icon: '💎' },
      { en: 'Plus', vi: 'Cộng', icon: '➕' },
      { en: 'Minus', vi: 'Trừ', icon: '➖' },
      { en: 'Equals', vi: 'Bằng', icon: '🟰' },
      { en: 'Expression', vi: 'Biểu thức, phép tính', icon: '📝' },
    ],
    tips: [
      '💡 Bạn tròn chục: hai số có chữ số cuối cộng lại bằng 10, ví dụ 21 + 39 = 60.',
      '👀 Nhóm giống nhau lặp lại: tính 1 nhóm rồi cộng nhiều lần.',
      '🎒 Đổi chỗ các số được, nhưng nhớ mang dấu + hay − đi theo số đó.',
    ],
    examples: [
      expQ({ title: 'Ví dụ 1 · Bạn tròn chục', expr: '8 + 13 + 2 + 7', steps: [
        { text: '💡 Tìm bạn tròn chục: 8 và 2 (8 + 2 = 10), 13 và 7 (3 + 7 = 10).' },
        { text: '🧮 8 + 2 = <b>10</b>', g: [[0, 2], '10'] },
        { text: '🧮 13 + 7 = <b>20</b>', g: [[1, 3], '20'] },
        { text: '➕ 10 + 20 = <b>30</b>' },
      ] }),
      expQ({ title: 'Ví dụ 2 · Nhóm lặp lại', expr: '10 + 4 + 10 + 4 + 10 + 4', steps: [
        { text: '👀 Nhóm <b>10 + 4</b> lặp lại 3 lần.' },
        { text: '🧮 Mỗi nhóm: 10 + 4 = <b>14</b>', g: [[[0, 1], '14'], [[2, 3], '14'], [[4, 5], '14']] },
        { text: '➕ 14 + 14 + 14 = <b>42</b>' },
      ] }),
      expQ({ title: 'Ví dụ 3 · Mang dấu đi theo', expr: '5 − 9 + 14', steps: [
        { text: '🤔 5 − 9 chưa trừ được! Mình đổi chỗ: 5 + 14 − 9 (dấu − đi theo số 9).' },
        { text: '🧮 5 + 14 = <b>19</b>', g: [[0, 2], '19'] },
        { text: '🧮 19 − 9 = <b>10</b>', g: [[1], '−9'] },
      ] }),
    ],
    gen,
    test: [
      expQ({ src: 'Đề 1 · Câu 1', expr: '15 + 3 + 15 + 3', answer: 36, steps: [
        { text: '👀 Nhóm <b>15 + 3</b> lặp lại 2 lần.' },
        { text: '🧮 Mỗi nhóm: 15 + 3 = <b>18</b>', g: [[[0, 1], '18'], [[2, 3], '18']] },
        { text: '➕ 18 + 18 = <b>36</b>' },
      ] }),
      expQ({ src: 'Đề 1 · Câu 3', expr: '19 − 7 + 19 − 7', answer: 24, steps: [
        { text: '👀 Nhóm <b>19 − 7</b> lặp lại 2 lần.' },
        { text: '🧮 Mỗi nhóm: 19 − 7 = <b>12</b>', g: [[[0, 1], '12'], [[2, 3], '12']] },
        { text: '➕ 12 + 12 = <b>24</b>' },
      ] }),
      expQ({ src: 'Đề 1 · Câu 4', expr: '38 − 9 − 14', answer: 15, steps: [
        { text: '👉 Tính lần lượt từ trái sang phải.' },
        { text: '🧮 38 − 9 = <b>29</b> (bớt 8 được 30, bớt thêm 1 được 29)', g: [[0, 1], '29'] },
        { text: '🧮 29 − 14 = <b>15</b>', g: [[2], '15'] },
      ] }),
      expQ({ src: 'Mock 2025 · Câu 10', expr: '12 − 20 + 36', answer: 28, steps: [
        { text: '🤔 12 − 20 chưa trừ được! Đổi chỗ: 12 + 36 − 20 (dấu − đi theo số 20).' },
        { text: '🧮 12 + 36 = <b>48</b>', g: [[0, 2], '48'] },
        { text: '🧮 48 − 20 = <b>28</b>', g: [[1], '−20'] },
      ] }),
      expQ({ src: 'VQG 2024–2025 · Câu 7', expr: '25 − 38 + 50 − 5', answer: 32, steps: [
        { text: '🤔 25 − 38 chưa trừ được! Mình đổi chỗ các số, dấu đi theo số.' },
        { text: '🧮 25 − 5 = <b>20</b>', g: [[0, 3], '20'] },
        { text: '🧮 50 − 38 = <b>12</b>', g: [[2, 1], '12'] },
        { text: '➕ 20 + 12 = <b>32</b>' },
      ] }),
      expQ({ src: 'Mock 2025 · Câu 7', expr: '39 + 12 + 25 + 5 + 28 + 11', answer: 120, steps: [
        { text: '💡 Tìm các cặp "bạn tròn chục" (chữ số cuối cộng lại bằng 10).' },
        { text: '🧮 39 + 11 = <b>50</b>', g: [[0, 5], '50'] },
        { text: '🧮 12 + 28 = <b>40</b>', g: [[1, 4], '40'] },
        { text: '🧮 25 + 5 = <b>30</b>', g: [[2, 3], '30'] },
        { text: '➕ 50 + 40 + 30 = <b>120</b>' },
      ] }),
      expQ({ src: 'VQG 2024–2025 · Câu 6', expr: '21 + 7 + 62 + 23 + 39 + 38', answer: 190, steps: [
        { text: '💡 Tìm các cặp "bạn tròn chục" (chữ số cuối cộng lại bằng 10).' },
        { text: '🧮 21 + 39 = <b>60</b>', g: [[0, 4], '60'] },
        { text: '🧮 7 + 23 = <b>30</b>', g: [[1, 3], '30'] },
        { text: '🧮 62 + 38 = <b>100</b>', g: [[2, 5], '100'] },
        { text: '➕ 60 + 30 + 100 = <b>190</b>' },
      ] }),
      expQ({ src: 'Đề 1 · Câu 2', expr: '115 − 38 + 6 − 12', answer: 71, steps: [
        { text: '🎒 Gom các số bị trừ lại: 38 và 12 là bạn tròn chục!' },
        { text: '🧮 Trừ 38 rồi trừ 12 = trừ một lần 38 + 12 = <b>50</b>', g: [[1, 3], '50'] },
        { text: '🧮 Số cộng: 115 + 6 = <b>121</b>', g: [[0, 2], '121'] },
        { text: '➖ 121 − 50 = <b>71</b>' },
      ] }),
      expQ({ src: 'Mock 2025 · Câu 9', expr: '5 + 5 + 5 + 5 + 5 + 5 + 5 − 9 − 9 − 8', answer: 9, steps: [
        { text: '🖐️ Có 7 số 5. Đếm thêm 5: 5, 10, 15, 20, 25, 30, <b>35</b>.', g: [[0, 1, 2, 3, 4, 5, 6], ''] },
        { text: '🧮 Trừ 9, 9, 8 = trừ một lần 9 + 9 + 8 = <b>26</b>', g: [[7, 8, 9], ''] },
        { text: '➖ 35 − 26 = <b>9</b>' },
      ] }),
      expQ({ src: 'VQG 2024–2025 · Câu 8', expr: '6 + 11 − 5 + 6 + 11 − 5 + 6 + 11 − 5 + 6 + 11 − 5', answer: 48, steps: [
        { text: '👀 Nhóm <b>6 + 11 − 5</b> lặp lại 4 lần.' },
        { text: '🧮 Mỗi nhóm: 6 + 11 = 17, 17 − 5 = <b>12</b>', g: [[[0, 1, 2], '12'], [[3, 4, 5], '12'], [[6, 7, 8], '12'], [[9, 10, 11], '12']] },
        { text: '➕ 12 + 12 + 12 + 12 = <b>48</b>' },
      ] }),
      // Bổ sung: VQG 2025–2026
      expQ({ src: 'VQG 2025–2026 · Câu 6', expr: '36 + 15 + 37 + 4 + 23 + 25', answer: 140, steps: [
        { text: '💡 Tìm các cặp "bạn tròn chục" (chữ số cuối cộng lại bằng 10).' },
        { text: '🧮 36 + 4 = <b>40</b>', g: [[0, 3], '40'] },
        { text: '🧮 15 + 25 = <b>40</b>', g: [[1, 5], '40'] },
        { text: '🧮 37 + 23 = <b>60</b>', g: [[2, 4], '60'] },
        { text: '➕ 40 + 40 + 60 = <b>140</b>' },
      ] }),
      expQ({ src: 'VQG 2025–2026 · Câu 7', expr: '7 − 16 + 19', answer: 10, steps: [
        { text: '🤔 7 − 16 chưa trừ được! Đổi chỗ: 7 + 19 − 16 (dấu − đi theo số 16).' },
        { text: '🧮 7 + 19 = <b>26</b>', g: [[0, 2], '26'] },
        { text: '🧮 26 − 16 = <b>10</b>', g: [[1], '−16'] },
      ] }),
      expQ({ src: 'VQG 2025–2026 · Câu 8', expr: '7 + 8 − 4 + 7 + 8 − 4 + 7 + 8 − 4', answer: 33, steps: [
        { text: '👀 Nhóm <b>7 + 8 − 4</b> lặp lại 3 lần.' },
        { text: '🧮 Mỗi nhóm: 7 + 8 = 15, 15 − 4 = <b>11</b>', g: [[[0, 1, 2], '11'], [[3, 4, 5], '11'], [[6, 7, 8], '11']] },
        { text: '➕ 11 + 11 + 11 = <b>33</b>' },
      ] }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
