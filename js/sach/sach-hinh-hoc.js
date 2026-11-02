/* Bộ đề sách – Chủ đề 4: Hình học (Geometry).
   Hình được vẽ lại theo sách. Máy tự đếm hình vuông, tam giác, đoạn thẳng từ hình vẽ để kiểm tra đáp án (test/check.js). */
(function (root) {
  'use strict';
  const V = () => root.TV.vis;
  const ex = n => `Exercise ${n}`;
  const sum = a => a.reduce((x, y) => x + y, 0);

  // Co giãn toạ độ (lấy từ ảnh chụp sách) vào khung 0..100, giữ nguyên tỉ lệ
  function fit(raw) {
    const vs = Object.values(raw), xs = vs.map(p => p[0]), ys = vs.map(p => p[1]);
    const x0 = Math.min(...xs), y0 = Math.min(...ys), k = 100 / Math.max(Math.max(...xs) - x0, Math.max(...ys) - y0);
    const out = Array.isArray(raw) ? [] : {};
    Object.keys(raw).forEach(key => { out[key] = [Math.round((raw[key][0] - x0) * k * 10) / 10, Math.round((raw[key][1] - y0) * k * 10) / 10]; });
    return out;
  }

  // ---------- Bài 1: Đếm hình vuông ----------
  // rows: ['#####', '.###.'] – # là ô vuông có trong hình
  const cellsOf = rows => rows.flatMap((s, r) => s.split('').map((ch, c) => (ch === '#' ? [r, c] : null)).filter(Boolean));
  // spots[k − 1] = góc trên bên trái của các hình vuông k × k ô nằm trọn trong hình
  function squareSpots(cells) {
    const has = new Set(cells.map(([r, c]) => r + ',' + c)), out = [];
    for (let k = 1; ; k++) {
      const spots = cells.filter(([r, c]) => {
        for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) if (!has.has(`${r + i},${c + j}`)) return false;
        return true;
      });
      if (!spots.length) return out;
      out.push(spots);
    }
  }
  function squareQ(o) {
    const cells = cellsOf(o.rows), spots = squareSpots(cells), counts = spots.map(s => s.length), calc = sum(counts);
    return {
      tag: o.tag || ex(o.n), type: 'num', answer: o.answer, calc, hint: 1,
      en: 'How many squares are there in the figure below?', vi: 'Hỏi có bao nhiêu hình vuông trong hình dưới đây?',
      visual: box => V().cells(box, cells),
      steps: [
        { text: '💡 Đếm theo cỡ: hình vuông nhỏ (1 ô) trước, rồi hình vuông to ghép từ 4 ô, 9 ô…' },
        ...spots.map((s, i) => ({
          text: i === 0 ? `🟨 Hình vuông nhỏ (1 ô): <b>${s.length}</b>` : `🟧 Hình vuông ${i + 1} × ${i + 1} ô (ghép từ ${(i + 1) * (i + 1)} ô nhỏ): <b>${s.length}</b>`,
          run: t => t.show(s, i + 1),
        })),
        ...(counts.length > 1 ? [{ text: `➕ Tất cả: ${counts.join(' + ')} = <b>${calc}</b>` }] : []),
        { text: `🎉 Đáp án: <b>${calc}</b> hình vuông` },
      ],
    };
  }
  const L1 = [
    squareQ({ n: 2, answer: 10, rows: ['#####', '.###.'] }),
    squareQ({ n: 3, answer: 10, rows: ['#####', '.##..', '##...'] }),
    squareQ({ n: 4, answer: 13, rows: ['#.###.', '.#####', '..#.#.'] }),
    squareQ({ n: 5, answer: 11, rows: ['###', '###', '##.'] }),
    squareQ({ tag: 'Exercise 6 · TIMO 2019–2020', answer: 10, rows: ['.#####', '##..##'] }),
    squareQ({ n: 7, answer: 13, rows: ['#####', '.##.#', '.##..', '.#...'] }),
  ];

  // ---------- Hình vẽ từ điểm và đường thẳng ----------
  // Hai điểm được nối với nhau nếu cùng nằm trên một đường thẳng của hình
  const joined = (fig, a, b) => fig.lines.some(l => l.includes(a) && l.includes(b));
  const sameLine = (fig, a, b, c) => fig.lines.some(l => l.includes(a) && l.includes(b) && l.includes(c));
  // Mọi tam giác trong hình: 3 điểm nối với nhau từng đôi một và không cùng nằm trên một đường thẳng
  function trianglesOf(fig) {
    const ps = Object.keys(fig.pts), out = [];
    for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) for (let k = j + 1; k < ps.length; k++) {
      const [a, b, c] = [ps[i], ps[j], ps[k]];
      if (joined(fig, a, b) && joined(fig, b, c) && joined(fig, a, c) && !sameLine(fig, a, b, c)) out.push([a, b, c]);
    }
    return out;
  }
  // Mỗi đường thẳng có n điểm thì có n × (n − 1) : 2 đoạn thẳng
  const segCount = n => (n * (n - 1)) / 2;

  // ---------- Bài 2: Đếm số hình tam giác ----------
  // groups: [{ label, tris: [['A', 'B', 'C'], …] }] – đếm theo từng nhóm, từ nhỏ đến to
  function triQ(o) {
    const fig = { ...o.fig, pts: fit(o.fig.pts) }, counts = o.groups.map(g => g.tris.length), calc = trianglesOf(fig).length;
    let from = 0;
    return {
      tag: ex(o.n), type: 'num', answer: o.answer, calc, groups: o.groups, fig, hint: 1,
      en: 'How many triangles are there in the figure below?', vi: 'Hỏi có bao nhiêu hình tam giác trong hình dưới đây?',
      visual: box => V().lines(box, fig),
      steps: [
        { text: '💡 Đếm cả các tam giác ghép từ nhiều hình nhỏ. Đếm theo cỡ từ nhỏ tới lớn để không sót.' },
        ...o.groups.map(g => {
          const start = from;
          from += g.tris.length;
          return { text: `🔺 ${g.label}: <b>${g.tris.length}</b>`, run: t => t.tris(g.tris, 'Tam giác', start) };
        }),
        { text: `➕ Tất cả: ${counts.join(' + ')} = <b>${sum(counts)}</b>` },
        { text: `🎉 Đáp án: <b>${o.answer}</b> hình tam giác` },
      ],
    };
  }
  const hexagram = (() => {
    const p = (r, deg) => [50 + r * Math.cos((deg * Math.PI) / 180), 50 + r * Math.sin((deg * Math.PI) / 180)];
    const r = 50 / Math.sqrt(3);
    return {
      U1: p(50, -90), U2: p(50, 150), U3: p(50, 30), D1: p(50, 90), D2: p(50, -150), D3: p(50, -30),
      H0: p(r, 0), H60: p(r, 60), H120: p(r, 120), H180: p(r, 180), H240: p(r, 240), H300: p(r, 300),
    };
  })();
  const L2 = [
    triQ({ n: 1, answer: 7,
      fig: { pts: { A: [50, 0], B: [0, 60], C: [100, 60], M: [50, 60], D: [25, 30], E: [75, 30] },
        lines: [['A', 'D', 'B'], ['A', 'E', 'C'], ['B', 'M', 'C'], ['A', 'M'], ['D', 'M'], ['E', 'M']] },
      groups: [
        { label: 'Tam giác nhỏ', tris: [['A', 'D', 'M'], ['D', 'B', 'M'], ['A', 'E', 'M'], ['E', 'M', 'C']] },
        { label: 'Tam giác ghép từ 2 hình nhỏ', tris: [['A', 'B', 'M'], ['A', 'M', 'C']] },
        { label: 'Tam giác to nhất', tris: [['A', 'B', 'C']] },
      ] }),
    triQ({ n: 2, answer: 16,
      fig: { pts: { A: [0, 0], B: [100, 0], C: [100, 100], D: [0, 100], E: [50, 0], F: [100, 50], G: [50, 100], H: [0, 50], O: [50, 50] },
        lines: [['A', 'E', 'B'], ['B', 'F', 'C'], ['C', 'G', 'D'], ['D', 'H', 'A'], ['A', 'O', 'C'], ['B', 'O', 'D'], ['E', 'O', 'G'], ['H', 'O', 'F']] },
      groups: [
        { label: 'Tam giác nhỏ', tris: [['A', 'E', 'O'], ['E', 'B', 'O'], ['B', 'F', 'O'], ['F', 'C', 'O'], ['C', 'G', 'O'], ['G', 'D', 'O'], ['D', 'H', 'O'], ['H', 'A', 'O']] },
        { label: 'Tam giác ghép từ 2 hình nhỏ', tris: [['A', 'B', 'O'], ['B', 'C', 'O'], ['C', 'D', 'O'], ['D', 'A', 'O']] },
        { label: 'Tam giác bằng nửa hình vuông', tris: [['A', 'B', 'C'], ['B', 'C', 'D'], ['C', 'D', 'A'], ['D', 'A', 'B']] },
      ] }),
    triQ({ n: 3, answer: 5,
      fig: { pts: { a: [50, 0], b: [34, 18], c: [66, 18], m2: [50, 18], L2: [26, 42], R2: [74, 42], m3: [50, 42], L3: [16, 74], R3: [84, 74], p: [43, 74], q: [57, 74], r: [57, 94], s: [43, 94] },
        lines: [['a', 'b'], ['a', 'c'], ['b', 'm2', 'c'], ['m2', 'L2'], ['m2', 'R2'], ['L2', 'm3', 'R2'], ['m3', 'L3'], ['m3', 'R3'], ['L3', 'p', 'q', 'R3'], ['p', 's'], ['q', 'r'], ['s', 'r'], ['p', 'r']],
        fill: [['a', 'b', 'c'], ['m2', 'L2', 'R2'], ['m3', 'L3', 'R3'], ['p', 'q', 'r', 's']] },
      groups: [
        { label: 'Tam giác ở tán cây', tris: [['a', 'b', 'c'], ['m2', 'L2', 'R2'], ['m3', 'L3', 'R3']] },
        { label: 'Thân cây là hình vuông chia đôi', tris: [['p', 'q', 'r'], ['p', 'r', 's']] },
      ] }),
    triQ({ n: 4, answer: 8,
      fig: { pts: hexagram,
        lines: [['U1', 'H240', 'H180', 'U2'], ['U1', 'H300', 'H0', 'U3'], ['U2', 'H120', 'H60', 'U3'], ['D2', 'H180', 'H120', 'D1'], ['D3', 'H0', 'H60', 'D1'], ['D2', 'H240', 'H300', 'D3']] },
      groups: [
        { label: 'Tam giác nhỏ ở 6 cánh sao', tris: [['U1', 'H240', 'H300'], ['U2', 'H180', 'H120'], ['U3', 'H0', 'H60'], ['D1', 'H120', 'H60'], ['D2', 'H240', 'H180'], ['D3', 'H300', 'H0']] },
        { label: 'Tam giác to', tris: [['U1', 'U2', 'U3'], ['D1', 'D2', 'D3']] },
      ] }),
  ];

  // ---------- Bài 3: Đếm số đoạn thẳng ----------
  function segQ(o) {
    const fig = { ...o.fig, pts: fit(o.fig.pts), dots: true }, counts = fig.lines.map(l => segCount(l.length)), calc = sum(counts);
    let from = 0;
    const steps = fig.lines.map((l, i) => {
      const start = from;
      from += counts[i];
      return {
        text: l.length === 2 ? `📏 Đường thẳng thứ ${i + 1}: chỉ có 2 điểm ở hai đầu → <b>1</b> đoạn` : `📏 Đường thẳng thứ ${i + 1}: có ${l.length} điểm → ${Array.from({ length: l.length - 1 }, (_, k) => l.length - 1 - k).join(' + ')} = <b>${counts[i]}</b> đoạn`,
        run: t => t.segs(l, start),
      };
    });
    return {
      tag: ex(o.n), type: 'num', answer: o.answer, calc, hint: 1,
      en: 'How many line segments are there in the figure below?', vi: 'Hỏi có bao nhiêu đoạn thẳng trong hình dưới đây?',
      visual: box => V().lines(box, fig),
      steps: [
        { text: '💡 Đếm trên từng đường thẳng: đoạn không có điểm nào ở giữa, rồi đoạn có 1 điểm ở giữa, 2 điểm ở giữa…' },
        ...steps,
        { text: `➕ Tất cả: ${counts.join(' + ')} = <b>${calc}</b>` },
        { text: `🎉 Đáp án: <b>${calc}</b> đoạn thẳng` },
      ],
    };
  }
  const L3 = [
    segQ({ n: 1, answer: 7, fig: { pts: { P: [600, 242], Q: [873, 220], X: [737, 328], R: [638, 402], S: [847, 397] },
      lines: [['P', 'X', 'S'], ['Q', 'X', 'R'], ['P', 'Q']] } }),
    segQ({ n: 2, answer: 6, fig: { pts: { A: [568, 540], B: [682, 575], C: [795, 608], D: [905, 643] }, lines: [['A', 'B', 'C', 'D']] } }),
    segQ({ n: 3, answer: 11, fig: { pts: { A: [790, 108], B: [838, 297], X: [1020, 275], C: [1300, 235], D: [1255, 450], E: [890, 505] },
      lines: [['A', 'B', 'E'], ['A', 'X', 'D'], ['B', 'X', 'C'], ['C', 'D'], ['E', 'D']] } }),
    segQ({ n: 4, answer: 7, fig: { pts: { A: [640, 207], B: [880, 205], M: [582, 307], C: [541, 371], D: [905, 378] },
      lines: [['A', 'M', 'C'], ['A', 'B'], ['B', 'D'], ['D', 'C'], ['M', 'B']] } }),
    segQ({ n: 5, answer: 10, fig: { pts: { A: [568, 550], B: [718, 523], C: [898, 600], D: [695, 647], E: [523, 688], F: [741, 766] },
      lines: [['E', 'D', 'C'], ['A', 'B'], ['B', 'C'], ['C', 'F'], ['F', 'E'], ['E', 'A'], ['A', 'D'], ['B', 'D']] } }),
  ];

  // ---------- Bài 4: Đếm hình 3D tạo từ các khối lập phương ----------
  // cubes: [[cột, hàng, tầng], …] (hàng 0 gần mắt nhất). hidden: các khối bị che, phải có để đỡ khối ở trên.
  function cubeQ(o) {
    const all = o.cubes.concat(o.hidden || []), calc = all.length, top = Math.max(...all.map(c => c[2]));
    const layers = Array.from({ length: top + 1 }, (_, z) => all.filter(c => c[2] === z).length);
    const hid = (o.hidden || []).length;
    return {
      tag: ex(o.n), type: 'num', answer: o.answer, calc, cubes: o.cubes, hidden: o.hidden || [], least: !!o.least, hint: 1,
      en: o.en, vi: o.vi,
      visual: box => V().stack(box, all, o.hidden),
      steps: [
        { text: '💡 Đếm từng tầng, từ tầng dưới cùng lên trên.' },
        ...layers.map((n, z) => ({
          text: z === 0 ? `🟨 Tầng dưới cùng: <b>${n}</b> khối${hid ? ` (có ${hid} khối bị che khuất)` : ''}` : `🟧 Tầng ${z + 1}: <b>${n}</b> khối`,
          run: t => t.layer(z),
        })),
        ...(hid ? [{ text: '👀 Khối bị che nằm ngay dưới khối ở tầng trên. Không có nó thì khối ở trên không đứng được!', run: t => t.reveal() }] : []),
        ...(layers.length > 1 ? [{ text: `➕ Tất cả: ${layers.join(' + ')} = <b>${calc}</b>` }] : []),
        { text: `🎉 Đáp án: <b>${calc}</b> khối lập phương` },
      ],
    };
  }
  const CUBE_EN = 'Given the figure below. How many cubes are there?';
  const CUBE_VI = 'Cho hình vẽ dưới đây. Hỏi có bao nhiêu khối lập phương?';
  const LEAST_EN = 'At least how many cubes are there in the figure below?';
  const LEAST_VI = 'Có ít nhất bao nhiêu khối lập phương trong hình dưới đây?';
  const L4 = [
    cubeQ({ n: 1, answer: 4, en: CUBE_EN, vi: CUBE_VI, cubes: [[0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 0, 1]] }),
    cubeQ({ n: 2, answer: 5, en: CUBE_EN, vi: CUBE_VI, cubes: [[1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 2, 1]], hidden: [[0, 2, 0]] }),
    cubeQ({ n: 3, answer: 5, en: CUBE_EN, vi: CUBE_VI, cubes: [[0, 0, 0], [0, 0, 1], [0, 0, 2], [1, 0, 0], [1, 1, 0]] }),
    cubeQ({ n: 4, answer: 6, en: CUBE_EN, vi: CUBE_VI, cubes: [[0, 2, 0], [1, 2, 1], [1, 1, 0], [2, 1, 0], [2, 0, 0]], hidden: [[1, 2, 0]] }),
    cubeQ({ n: 5, answer: 6, cubes: [[1, 0, 0], [0, 1, 0], [2, 1, 0], [1, 1, 1], [1, 1, 2]], hidden: [[1, 1, 0]],
      en: 'Amy stacks some cubes to get the figure below. How many cubes does she need to use?',
      vi: 'Amy xếp các khối lập phương chồng lên nhau giống như hình dưới đây. Hỏi cô ấy đã dùng bao nhiêu khối lập phương?' }),
    cubeQ({ n: 6, answer: 8, least: true, en: LEAST_EN, vi: LEAST_VI,
      cubes: [[1, 0, 0], [1, 0, 1], [0, 2, 0], [0, 2, 1], [2, 1, 0], [2, 2, 0], [3, 1, 0], [3, 1, 1]] }),
    cubeQ({ n: 7, answer: 10, least: true, en: LEAST_EN, vi: LEAST_VI,
      cubes: [[1, 0, 0], [3, 0, 0], [1, 0, 1], [2, 0, 1], [3, 0, 1], [1, 0, 2], [3, 0, 2], [0, 1, 1], [1, 1, 1], [3, 1, 0]] }),
    cubeQ({ n: 8, answer: 7, cubes: [[0, 1, 0], [1, 1, 0], [2, 1, 1], [3, 1, 0], [2, 0, 0], [3, 0, 0]], hidden: [[2, 1, 0]],
      en: 'David stacks some cubes to be the figure below. How many cubes does he need to use?',
      vi: 'David xếp các khối lập phương chồng lên nhau giống như hình bên dưới. Hỏi anh ấy cần dùng bao nhiêu khối lập phương?' }),
    cubeQ({ n: 9, answer: 8, cubes: [[0, 1, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0], [2, 1, 1], [2, 1, 2], [3, 1, 0]], hidden: [[2, 1, 0]],
      en: 'Amy stacks some cubes to get the figure below. How many cubes does she need to use?',
      vi: 'Amy xếp các khối lập phương chồng lên nhau để được hình bên dưới. Hỏi cô ấy cần dùng bao nhiêu khối lập phương?' }),
  ];

  // ---------- Bài 5: Số cạnh, số đỉnh và số góc trong của đa giác ----------
  // ask: 'sides' (cạnh), 'vertices' (đỉnh), 'angles' (góc trong)
  function polyQ(o) {
    const pts = fit(o.pts), calc = pts.length;
    const word = { sides: 'cạnh', vertices: 'đỉnh', angles: 'góc trong' }[o.ask];
    return {
      tag: ex(o.n), type: 'num', answer: o.answer, calc, hint: 1, en: o.en, vi: o.vi,
      visual: box => V().poly(box, pts),
      steps: [
        { text: `💡 Đánh số lần lượt từng ${o.ask === 'sides' ? 'cạnh' : 'đỉnh'} theo một chiều, đến khi quay về chỗ bắt đầu thì dừng.`,
          run: t => (o.ask === 'sides' ? t.sides() : t.angles()) },
        { text: '📐 Đa giác có số cạnh = số đỉnh = số góc trong.' },
        { text: `🎉 Đáp án: <b>${calc}</b> ${word}` },
      ],
    };
  }
  const regular = n => Array.from({ length: n }, (_, i) => [50 + 50 * Math.cos(((-90 + (360 * i) / n) * Math.PI) / 180), 50 + 50 * Math.sin(((-90 + (360 * i) / n) * Math.PI) / 180)]);
  const L5 = [
    polyQ({ n: 1, answer: 14, ask: 'sides',
      en: 'How many sides are there in the figure below?', vi: 'Hỏi hình vẽ dưới đây có bao nhiêu cạnh?',
      pts: [[525, 205], [695, 255], [535, 290], [540, 380], [605, 385], [695, 495], [540, 505], [492, 682], [472, 505], [330, 485], [418, 378], [480, 375], [497, 293], [350, 235]] }),
    polyQ({ n: 2, answer: 7, ask: 'angles', pts: regular(7),
      en: 'How many interior angles are there in the polygon below?', vi: 'Hình đa giác dưới đây có bao nhiêu góc trong?' }),
    polyQ({ n: 3, answer: 6, ask: 'angles', pts: [[540, 360], [855, 450], [710, 690], [622, 468], [490, 690], [340, 690]],
      en: 'How many interior angles are there in the polygon below?', vi: 'Hình đa giác dưới đây có bao nhiêu góc trong?' }),
    polyQ({ n: 4, answer: 8, ask: 'vertices', pts: [[470, 160], [765, 158], [905, 365], [808, 580], [525, 588], [420, 490], [612, 372], [385, 375]],
      en: 'How many vertices are there in the polygon below?', vi: 'Hình đa giác dưới đây có bao nhiêu đỉnh?' }),
    polyQ({ n: 5, answer: 8, ask: 'angles', pts: [[445, 108], [607, 300], [798, 145], [852, 562], [685, 660], [548, 592], [620, 422], [440, 395]],
      en: 'How many interior angles are there in the polygon below?', vi: 'Hình đa giác dưới đây có bao nhiêu góc trong?' }),
  ];

  (root.TVBook = root.TVBook || []).push(
    { id: 'sach-4-1', part: 'D', icon: '🟦', lesson: 'Lesson 1', title: 'Đếm số hình vuông', en: 'Count the number of squares', questions: L1,
      note: 'Sách không có ảnh Exercise 1 nên bộ đề bắt đầu từ Exercise 2.' },
    { id: 'sach-4-2', part: 'D', icon: '🔺', lesson: 'Lesson 2', title: 'Đếm số hình tam giác', en: 'Count the number of triangles', questions: L2 },
    { id: 'sach-4-3', part: 'D', icon: '📏', lesson: 'Lesson 3', title: 'Đếm số đoạn thẳng', en: 'Count the number of line segments', questions: L3 },
    { id: 'sach-4-4', part: 'D', icon: '🧊', lesson: 'Lesson 4', title: 'Đếm hình 3D tạo từ các khối lập phương', en: 'Count the number of 3D figures formed by cubes', questions: L4 },
    { id: 'sach-4-5', part: 'D', icon: '⬟', lesson: 'Lesson 5', title: 'Số cạnh, số đỉnh và số góc trong của đa giác', en: 'Number of sides, vertices, interior angles in polygons', questions: L5 },
  );

  // Cho test/check.js tự đếm lại từ hình vẽ
  root.TVBookGeo = { squareSpots, cellsOf, trianglesOf, segCount };
})(typeof window !== 'undefined' ? window : globalThis);
