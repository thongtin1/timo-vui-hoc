/* Bộ đề sách – Chủ đề 2: Số học (Arithmetic) */
(function (root) {
  'use strict';
  const { evalExpr } = root.TVData;
  const V = () => root.TV.vis;
  const ex = n => `Exercise ${n}`;

  // ---------- Bài 1: Ghép cặp hợp lý ----------
  // expr: '3 + 12 + 21' (dấu cách giữa số và dấu). steps: [{ text, g?: [[chỉ số thẻ số], nhãn] | [[[…], nhãn], …] }]
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
      tag: o.tag || ex(o.n), type: 'num', answer: o.answer, calc, hint: 1,
      en: `${o.calcWord ? 'Calculate:' : 'Find the value of'} ${o.expr}.`, vi: `${o.calcWord ? 'Tính:' : 'Tính giá trị của:'} ${o.expr}`,
      visual: box => V().chips(box, tokens),
      steps,
    };
  }

  const L1 = [
    expQ({ n: 1, answer: 52, expr: '3 + 12 + 21 + 9 + 7', steps: [
      { text: '💡 Ghép các số có hàng đơn vị cộng lại tròn chục: 3 và 7, 21 và 9.' },
      { text: '🧮 3 + 7 = <b>10</b>', g: [[0, 4], '10'] },
      { text: '🧮 21 + 9 = <b>30</b>', g: [[2, 3], '30'] },
      { text: '➕ 10 + 30 + 12 = <b>52</b>' },
    ] }),
    expQ({ n: 2, answer: 75, expr: '13 + 14 + 15 + 16 + 17', steps: [
      { text: '💡 Ghép số đầu với số cuối, số thứ hai với số thứ tư.' },
      { text: '🧮 13 + 17 = <b>30</b>', g: [[0, 4], '30'] },
      { text: '🧮 14 + 16 = <b>30</b>', g: [[1, 3], '30'] },
      { text: '➕ 30 + 30 + 15 = <b>75</b>' },
    ] }),
    expQ({ n: 3, answer: 108, expr: '3 + 6 + 9 + 12 + 15 + 18 + 21 + 24', steps: [
      { text: '💡 Ghép số đầu với số cuối, đi dần vào giữa: các cặp đều bằng 27.' },
      { text: '🧮 3 + 24 = 6 + 21 = 9 + 18 = 12 + 15 = <b>27</b>', g: [[[0, 7], '27'], [[1, 6], '27'], [[2, 5], '27'], [[3, 4], '27']] },
      { text: '➕ Có 4 cặp: 27 + 27 + 27 + 27 = <b>108</b>' },
    ] }),
    expQ({ n: 4, tag: 'Exercise 4 · TIMO 2020–2021', answer: 120, expr: '48 + 6 + 11 + 29 + 12 + 14', steps: [
      { text: '💡 Ghép các cặp tròn chục: 48 và 12, 6 và 14, 11 và 29.' },
      { text: '🧮 48 + 12 = <b>60</b>', g: [[0, 4], '60'] },
      { text: '🧮 6 + 14 = <b>20</b>', g: [[1, 5], '20'] },
      { text: '🧮 11 + 29 = <b>40</b>', g: [[2, 3], '40'] },
      { text: '➕ 60 + 20 + 40 = <b>120</b>' },
    ] }),
    expQ({ n: 5, answer: 1100, expr: '179 + 219 + 121 + 181 + 281 + 119', steps: [
      { text: '💡 Ghép các cặp tròn trăm: 179 và 121, 219 và 181, 281 và 119.' },
      { text: '🧮 179 + 121 = <b>300</b>', g: [[0, 2], '300'] },
      { text: '🧮 219 + 181 = <b>400</b>', g: [[1, 3], '400'] },
      { text: '🧮 281 + 119 = <b>400</b>', g: [[4, 5], '400'] },
      { text: '➕ 300 + 400 + 400 = <b>1100</b>' },
    ] }),
    expQ({ n: 6, answer: 18, expr: '8 + 7 − 6 + 5 + 4 − 3 + 2 + 1 − 0', steps: [
      { text: '💡 Ghép mỗi phép trừ với số đứng ngay trước nó: 7 − 6, 4 − 3, 1 − 0 đều bằng 1.' },
      { text: '🧮 7 − 6 = 1, 4 − 3 = 1, 1 − 0 = 1', g: [[[1, 2], '1'], [[4, 5], '1'], [[7, 8], '1']] },
      { text: '🧮 Các số còn lại: 8 + 5 + 2 = <b>15</b>', g: [[0, 3, 6], '15'] },
      { text: '➕ 15 + 1 + 1 + 1 = <b>18</b>' },
    ] }),
    expQ({ n: 7, answer: 31, expr: '21 + 19 − 17 + 15 − 13 + 11 − 9 + 7 − 5 + 3 − 1', steps: [
      { text: '💡 Ghép từng cặp "số trước trừ số sau": 19 − 17, 15 − 13, 11 − 9, 7 − 5, 3 − 1. Cặp nào cũng bằng 2.' },
      { text: '🧮 Có 5 cặp, mỗi cặp bằng 2 → 2 + 2 + 2 + 2 + 2 = <b>10</b>', g: [[[1, 2], '2'], [[3, 4], '2'], [[5, 6], '2'], [[7, 8], '2'], [[9, 10], '2']] },
      { text: '➕ 21 + 10 = <b>31</b>' },
    ] }),
    expQ({ n: 8, answer: 10, expr: '4 + 4 + 4 + 4 + 4 + 4 + 4 − 6 − 6 − 6', steps: [
      { text: '💡 Ghép hai số 4 với một số 6: 4 + 4 − 6 = 2. Ghép được 3 nhóm như vậy.' },
      { text: '🧮 Mỗi nhóm 4 + 4 − 6 = <b>2</b>', g: [[[0, 1, 7], '2'], [[2, 3, 8], '2'], [[4, 5, 9], '2']] },
      { text: '➕ Còn lại một số 4: 2 + 2 + 2 + 4 = <b>10</b>' },
    ] }),
    expQ({ n: 9, calcWord: true, answer: 8, expr: '18 − 2 − 8', steps: [
      { text: '💡 Trừ liên tiếp 2 rồi 8 cũng giống trừ một lần 2 + 8 = 10.', g: [[1, 2], '10'] },
      { text: '🧮 18 − 10 = <b>8</b>' },
    ] }),
    expQ({ n: 10, calcWord: true, answer: 31, expr: '36 − 9 + 4', steps: [
      { text: '💡 Cộng 4 trước cho tròn chục: 36 + 4 = <b>40</b>.', g: [[0, 2], '40'] },
      { text: '🧮 40 − 9 = <b>31</b>' },
    ] }),
  ];

  // ---------- Bài 2: Cân bằng phép tính ----------
  // left, right: hai vế (chuỗi, có hình che số), steps: lời giải.
  function balQ(o) {
    const tokens = `${o.left} = ${o.right}`.split(' ');
    return {
      tag: ex(o.n), type: 'num', answer: o.answer, hint: 1,
      en: `${o.en} ${o.left} = ${o.right}`, vi: `${o.vi} ${o.left} = ${o.right}`,
      visual: box => V().chips(box, tokens),
      steps: o.steps.map(text => ({ text })).concat({ text: `🎉 Đáp án: <b>${o.answer}</b>` }),
    };
  }
  const BOX_EN = 'Find the suitable number to fill in the boxes below.';
  const BOX_VI = 'Tìm số thích hợp để điền vào ô trống dưới đây.';
  const L2 = [
    balQ({ n: 1, answer: 5, left: '12 + ✈️', right: '15 + 2',
      en: 'Find the suitable number to replace the airplane below.', vi: 'Tìm số thích hợp để thay thế cho chiếc máy bay dưới đây.',
      steps: ['⚖️ Vế phải: 15 + 2 = <b>17</b>. Vế trái cũng phải bằng 17.', '🧮 12 + ✈️ = 17 → ✈️ = 17 − 12 = <b>5</b>'] }),
    balQ({ n: 2, answer: 4, left: '✉️ + 7', right: '16 − 5',
      en: 'Find the number hidden inside the envelope below.', vi: 'Tìm số bị giấu ở trong phong bì thư.',
      steps: ['⚖️ Vế phải: 16 − 5 = <b>11</b>.', '🧮 ✉️ + 7 = 11 → ✉️ = 11 − 7 = <b>4</b>'] }),
    balQ({ n: '3a', answer: 15, left: '□ + 2', right: '19 − 2', en: BOX_EN, vi: BOX_VI,
      steps: ['⚖️ Vế phải: 19 − 2 = <b>17</b>.', '🧮 □ + 2 = 17 → □ = 17 − 2 = <b>15</b>'] }),
    balQ({ n: '3b', answer: 13, left: '3 + □', right: '20 + 1 − 5', en: BOX_EN, vi: BOX_VI,
      steps: ['⚖️ Vế phải: 20 + 1 − 5 = <b>16</b>.', '🧮 3 + □ = 16 → □ = 16 − 3 = <b>13</b>'] }),
    balQ({ n: '3c', answer: 10, left: '5 + 8', right: '□ + 3', en: BOX_EN, vi: BOX_VI,
      steps: ['⚖️ Vế trái: 5 + 8 = <b>13</b>.', '🧮 □ + 3 = 13 → □ = 13 − 3 = <b>10</b>'] }),
    balQ({ n: '3d', answer: 5, left: '10 − 3', right: '2 + □', en: BOX_EN, vi: BOX_VI,
      steps: ['⚖️ Vế trái: 10 − 3 = <b>7</b>.', '🧮 2 + □ = 7 → □ = 7 − 2 = <b>5</b>'] }),
    balQ({ n: 4, answer: 17, left: '● − 5', right: '12',
      en: 'Find the suitable number to replace the circle below.', vi: 'Tìm số thích hợp để thay thế cho hình tròn dưới đây.',
      steps: ['💡 Một số bớt đi 5 thì còn 12. Muốn tìm số đó, lấy 12 cộng lại 5.', '🧮 ● = 12 + 5 = <b>17</b>'] }),
    balQ({ n: 5, answer: 8, left: '⏰ − 2', right: '1 + 5',
      en: 'Find the number covered by the clock in the equation below.', vi: 'Tìm số đã bị che bởi chiếc đồng hồ trong phép tính dưới đây.',
      steps: ['⚖️ Vế phải: 1 + 5 = <b>6</b>.', '🧮 ⏰ − 2 = 6 → ⏰ = 6 + 2 = <b>8</b>'] }),
  ];

  // ---------- Bài 3: Bài toán mật mã ----------
  // rows/op/res: phép tính đặt dọc. eq: viết hàng ngang để đọc to.
  function cryQ(o) {
    return {
      tag: ex(o.n), type: 'num', answer: o.answer, hint: 1,
      en: `${o.en} ${o.eq}`, vi: `${o.vi} ${o.eq}`,
      visual: box => V().vcalc(box, o.rows, o.op || '+', o.res),
      steps: o.steps.map(text => ({ text })).concat({ text: `🎉 Đáp án: <b>${o.answer}</b>` }),
    };
  }
  const L3 = [
    cryQ({ n: 1, answer: 8, rows: ['X5', 'X'], res: '93', eq: 'X5 + X = 93',
      en: 'Find the value of X in the equation below.', vi: 'Tìm giá trị của X trong phép tính sau.',
      steps: ['🔍 Hàng đơn vị: 5 + X có chữ số tận cùng là 3 → 5 + X = 13.', '🧮 X = 13 − 5 = <b>8</b>. Thử lại: 85 + 8 = 93 ✅'] }),
    cryQ({ n: 2, answer: 7, rows: ['X1', 'Y'], res: '44', eq: 'X1 + Y = 44',
      en: 'Find the value of X + Y given that:', vi: 'Tìm giá trị của X + Y biết rằng:',
      steps: ['🔍 Hàng đơn vị: 1 + Y = 4 → Y = <b>3</b> (không có nhớ).', '🔍 Hàng chục: X = <b>4</b>. Thử lại: 41 + 3 = 44 ✅', '➕ X + Y = 4 + 3 = <b>7</b>'] }),
    cryQ({ n: 3, answer: 7, rows: ['XX', 'Y'], res: '40', eq: 'XX + Y = 40',
      en: 'Find the value of Y in the equation below.', vi: 'Tìm giá trị của Y trong phép tính sau.',
      steps: ['🔍 Hàng đơn vị: X + Y có tận cùng là 0 → X + Y = 10, nhớ 1 sang hàng chục.', '🔍 Hàng chục: X + 1 = 4 → X = <b>3</b>.', '🧮 Y = 10 − 3 = <b>7</b>. Thử lại: 33 + 7 = 40 ✅'] }),
    cryQ({ n: 4, answer: 4, rows: ['52'], op: '−', res: '48', eq: '52 − A = 48',
      en: 'If A is a 1-digit number, what is the value of A if the equation is correct?', vi: 'Cho A là số có một chữ số. Tìm giá trị của A để phép tính dưới đây đúng.',
      steps: ['💡 52 bớt đi A thì còn 48. Muốn tìm A, lấy 52 trừ 48.', '🧮 A = 52 − 48 = <b>4</b>'] }),
    cryQ({ n: 5, answer: 6, rows: ['AB', 'B'], res: 'B4', eq: 'AB + B = B4',
      en: 'If A and B are different 1-digit numbers, what is the value of A if the equation is correct?',
      vi: 'Cho A và B là hai số có một chữ số khác nhau. Tìm giá trị của A để phép tính dưới đây đúng.',
      steps: [
        '🔍 Hàng đơn vị: B + B có tận cùng là 4 → B = 2 (2 + 2 = 4) hoặc B = 7 (7 + 7 = 14).',
        '❌ Thử B = 2: A2 + 2 = 24 → A2 = 22 → A = 2, trùng với B. Loại!',
        '✅ Thử B = 7: A7 + 7 = 74 → A7 = 67 → A = <b>6</b>.',
      ] }),
    cryQ({ n: 6, answer: 4, rows: ['A', 'A8'], res: '52', eq: 'A + A8 = 52',
      en: 'Refer to the puzzle, find the value of A.', vi: 'Cho câu đố dưới đây, tìm giá trị của A.',
      steps: ['🔍 Hàng đơn vị: A + 8 có tận cùng là 2 → A + 8 = 12 → A = <b>4</b>, nhớ 1.', '✅ Hàng chục: A + 1 = 4 + 1 = 5 đúng. Thử lại: 4 + 48 = 52 ✅'] }),
    cryQ({ n: 7, answer: 9, rows: ['A', '2A'], res: '38', eq: 'A + 2A = 38',
      en: 'If A represents the same 1-digit number, what is the value of A if the equation is correct?',
      vi: 'Cho A là số có một chữ số. Tìm giá trị của A để phép tính dưới đây đúng.',
      steps: ['🔍 Hàng chục: 2 cộng số nhớ phải bằng 3 → hàng đơn vị có nhớ 1.', '🔍 Hàng đơn vị: A + A = 18 → A = <b>9</b>. Thử lại: 9 + 29 = 38 ✅'] }),
  ];

  (root.TVBook = root.TVBook || []).push(
    { id: 'sach-2-1', part: 'B', icon: '🤝', lesson: 'Lesson 1', title: 'Ghép cặp hợp lý', en: 'Smart combination', questions: L1 },
    { id: 'sach-2-2', part: 'B', icon: '⚖️', lesson: 'Lesson 2', title: 'Cân bằng phép tính', en: 'Balance on equation', questions: L2 },
    { id: 'sach-2-3', part: 'B', icon: '🔐', lesson: 'Lesson 3', title: 'Bài toán mật mã', en: 'Cryptarithm', questions: L3 },
  );
})(typeof window !== 'undefined' ? window : globalThis);
