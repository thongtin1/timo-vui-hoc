/* Chủ đề: Lập số từ các chữ số (Combinatorics) */
(function (root) {
  'use strict';
  const { rand, pick, shuffle } = root.TVData;
  const V = () => root.TV.vis;

  // Mọi số có k chữ số lập từ digits, không lặp lại chữ số, chữ số đầu khác 0
  function numbers(digits, k) {
    const out = [];
    (function go(cur, left) {
      if (cur.length === k) { if (cur[0] !== 0) out.push(Number(cur.join(''))); return; }
      left.forEach((d, i) => go(cur.concat(d), left.filter((_, j) => j !== i)));
    })([], digits);
    return Array.from(new Set(out)).sort((a, b) => a - b);
  }
  const desc = ds => ds.slice().sort((a, b) => b - a), asc = ds => ds.slice().sort((a, b) => a - b);
  const sayDigits = ds => ds.join(', ');
  const largest = (ds, k) => Number(desc(ds).slice(0, k).join(''));
  const smallest = (ds, k) => { const a = asc(ds), first = a.find(d => d !== 0); const rest = a.filter((d, i) => i !== a.indexOf(first)); return Number([first].concat(rest.slice(0, k - 1)).join('')); };

  function maxStep(ds, k) { return `⬆️ Số lớn nhất: chữ số lớn nhất đứng đầu, rồi lớn thứ hai… → <b>${largest(ds, k)}</b>`; }
  function minStep(ds, k) {
    return ds.includes(0)
      ? `⬇️ Số nhỏ nhất: chữ số đầu không được là 0, nên chọn ${asc(ds).find(d => d)} đứng đầu, sau đó là 0… → <b>${smallest(ds, k)}</b>`
      : `⬇️ Số nhỏ nhất: chữ số nhỏ nhất đứng đầu, rồi nhỏ thứ hai… → <b>${smallest(ds, k)}</b>`;
  }

  // ask: 'max' | 'min' | 'diff' (lớn nhất − nhỏ nhất) | 'count' (có bao nhiêu số)
  function makeQ(o) {
    const { digits: ds, k, ask } = o, all = numbers(ds, k);
    const calc = ask === 'max' ? largest(ds, k) : ask === 'min' ? smallest(ds, k) : ask === 'diff' ? largest(ds, k) - smallest(ds, k) : all.length;
    const what = { max: 'số lớn nhất', min: 'số nhỏ nhất', diff: 'hiệu của số lớn nhất và số nhỏ nhất', count: 'có bao nhiêu số' }[ask];
    const whatEn = { max: 'What is the largest number', min: 'What is the smallest number', diff: 'What is the difference between the largest number and the smallest number', count: 'How many numbers' }[ask];
    const steps = [];
    if (ask === 'max' || ask === 'diff') steps.push({ text: maxStep(ds, k) });
    if (ask === 'min' || ask === 'diff') steps.push({ text: minStep(ds, k) });
    if (ask === 'diff') steps.push({ text: `➖ Hiệu: ${largest(ds, k)} − ${smallest(ds, k)} = <b>${calc}</b>` });
    if (ask === 'count') {
      const firsts = asc(ds).filter(d => d !== 0);
      firsts.forEach(f => steps.push({ text: `✏️ Chữ số ${f} đứng đầu: ${all.filter(n => String(n)[0] === String(f)).join(', ')}` }));
      steps.push({ text: `🔢 Đếm tất cả: <b>${all.length}</b> số${ds.includes(0) ? ' (0 không được đứng đầu)' : ''}.` });
    }
    steps.push({ text: `🎉 Đáp án: <b>${calc}</b>` });
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 1,
      en: `${whatEn} that can be formed by choosing ${k} different digits from ${sayDigits(ds)}?`,
      vi: `Chọn ${k} chữ số khác nhau trong các chữ số ${sayDigits(ds)} để lập số có ${k} chữ số. Hỏi ${what}${ask === 'count' ? ' như vậy' : ''}?`,
      wrong: ask === 'min' && ds.includes(0) ? [Number(asc(ds).slice(0, k).join(''))] : [calc + 1, calc - 1],
      visual: box => V().chips(box, ds.map(String)),
      steps,
    };
  }

  function gen() {
    const k = pick([2, 2, 3]), ds = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, k + 1);
    return makeQ({ digits: ds, k, ask: pick(k === 2 ? ['max', 'min', 'diff', 'count'] : ['max', 'min', 'diff']) });
  }

  // Mock 2025 · Câu 25: 2 số lẻ có 2 chữ số, tổng lớn nhất
  const oddPair = {
    src: 'Mock 2025 · Câu 25', type: 'num', answer: 168, hint: 2,
    calc: (() => { let best = 0; const ds = [2, 1, 3, 5, 7, 9]; for (const a of numbers(ds, 2)) for (const b of numbers(ds, 2)) { const s = new Set(String(a) + String(b)); if (s.size === 4 && a % 2 && b % 2) best = Math.max(best, a + b); } return best; })(),
    en: 'Choose 4 digits, without repetition, from 2, 1, 3, 5, 7 and 9 to form two 2-digit odd numbers and add them up. What is the maximum value of the sum?',
    vi: 'Chọn 4 chữ số khác nhau trong các chữ số 2, 1, 3, 5, 7, 9 để lập hai số lẻ có 2 chữ số rồi cộng lại. Hỏi tổng lớn nhất là bao nhiêu?',
    visual: box => V().chips(box, ['2', '1', '3', '5', '7', '9']),
    steps: [
      { text: '💡 Chữ số hàng chục quan trọng hơn: muốn tổng lớn, hai chữ số hàng chục phải lớn nhất → <b>9</b> và <b>7</b>.' },
      { text: '🟠 Số lẻ có chữ số cuối là 1, 3, 5, 7, 9. Còn lại 2, 1, 3, 5 → chọn 2 số lẻ lớn nhất làm hàng đơn vị: <b>5</b> và <b>3</b>.' },
      { text: '🧮 Hai số: 95 và 73 (hoặc 93 và 75). Tổng: 95 + 73 = <b>168</b>' },
      { text: '🎉 Đáp án: <b>168</b>' },
    ],
  };

  (root.TVTopics = root.TVTopics || []).push({
    id: 'lap-so', part: 'E', icon: '🔢', title: 'Lập số', sub: 'Ghép chữ số thành số',
    intro: 'Có mấy tấm thẻ chữ số. Mình xếp chúng thành số lớn nhất, số nhỏ nhất, hoặc đếm xem lập được bao nhiêu số!',
    words: [
      { en: 'Digit', vi: 'Chữ số', icon: '🔢' },
      { en: 'Choose', vi: 'Chọn', icon: '👆' },
      { en: 'Without repetition', vi: 'Không lặp lại', icon: '🚫' },
      { en: 'Form', vi: 'Lập, tạo thành', icon: '🧩' },
      { en: 'Largest / Smallest', vi: 'Lớn nhất / Nhỏ nhất', icon: '↕️' },
      { en: 'Difference', vi: 'Hiệu', icon: '➖' },
      { en: 'Sum', vi: 'Tổng', icon: '➕' },
    ],
    tips: [
      '⬆️ Số lớn nhất: xếp chữ số từ lớn đến bé.',
      '⬇️ Số nhỏ nhất: xếp chữ số từ bé đến lớn, nhưng 0 không được đứng đầu.',
      '✏️ Đếm số lập được: lần lượt cho từng chữ số đứng đầu rồi viết ra hết.',
    ],
    examples: [
      makeQ({ title: 'Ví dụ 1 · Số lớn nhất', digits: [3, 8, 5], k: 2, ask: 'max' }),
      makeQ({ title: 'Ví dụ 2 · Số nhỏ nhất (có số 0)', digits: [0, 4, 7], k: 2, ask: 'min' }),
      makeQ({ title: 'Ví dụ 3 · Lập được mấy số?', digits: [1, 2, 3], k: 2, ask: 'count' }),
    ],
    gen,
    test: [
      makeQ({ src: 'Giống đề TIMO', digits: [1, 6, 3], k: 3, ask: 'max', answer: 631 }),
      makeQ({ src: 'Giống đề TIMO', digits: [0, 5, 2], k: 3, ask: 'min', answer: 205 }),
      makeQ({ src: 'VQG 2025–2026 · Câu 23', digits: [7, 4, 5, 9], k: 2, ask: 'diff', answer: 52 }),
      makeQ({ src: 'VQG 2024–2025 · Câu 22', digits: [0, 2, 4, 5, 9], k: 3, ask: 'diff', answer: 750 }),
      makeQ({ src: 'Giống đề TIMO', digits: [0, 1, 2], k: 2, ask: 'count', answer: 4 }),
      oddPair,
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
