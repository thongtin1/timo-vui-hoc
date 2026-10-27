/* Chủ đề: So sánh số – lớn nhất, nhỏ nhất, theo yêu cầu (Number theory) */
(function (root) {
  'use strict';
  const { rand, pick, shuffle } = root.TVData;
  const V = () => root.TV.vis;
  const len = n => String(n).length;
  const DIG = { 1: '1 chữ số', 2: '2 chữ số', 3: '3 chữ số' };

  // nums, order 'max'|'min', rank 1|2, lọc theo: digits (số chữ số), parity ('even'|'odd')
  function rankQ(o) {
    const { nums, order, rank = 1, digits, parity } = o;
    const keep = nums.map((v, i) => i).filter(i => (!digits || len(nums[i]) === digits) && (!parity || (nums[i] % 2 === 0) === (parity === 'even')));
    const sorted = keep.slice().sort((a, b) => (order === 'max' ? nums[b] - nums[a] : nums[a] - nums[b]));
    const best = sorted[rank - 1], calc = nums[best];
    const kind = [parity === 'even' ? 'chẵn' : parity === 'odd' ? 'lẻ' : '', digits ? `có ${DIG[digits]}` : ''].filter(Boolean).join(' ');
    const what = `số ${kind ? kind + ' ' : ''}${order === 'max' ? 'lớn' : 'nhỏ'} ${rank === 1 ? 'nhất' : 'thứ hai'}`.replace(/\s+/g, ' ');
    const enKind = [digits ? `${digits}-digit` : '', parity || ''].filter(Boolean).join(' ');
    const steps = [];
    if (kind) steps.push({ text: `🔍 Chỉ chọn số ${kind}: ${keep.map(i => nums[i]).join(', ')}.`, run: t => t.mark(keep, 'even') });
    const mixed = new Set(keep.map(i => len(nums[i]))).size > 1;
    if (mixed) steps.push({ text: '🔢 Số nào có nhiều chữ số hơn thì lớn hơn. Đếm số chữ số trước!' });
    if (o.why) o.why.forEach(w => steps.push({ text: w }));
    steps.push({ text: `${order === 'max' ? '⬆️ Xếp từ lớn đến bé' : '⬇️ Xếp từ bé đến lớn'}: ${sorted.map(i => nums[i]).join(', ')}.` });
    steps.push({ text: `🎉 Đáp án: ${what} là <b>${calc}</b>`, run: t => t.mark([best], 'pick') });
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: kind ? 2 : 1,
      en: `By observing the numbers, which ${enKind ? enKind + ' ' : ''}number is the ${order === 'max' ? (rank === 1 ? 'greatest' : 'second greatest') : (rank === 1 ? 'smallest' : 'second smallest')}? ${nums.join(', ')}`,
      vi: `Quan sát các số: ${nums.join(', ')}. Tìm ${what}.`,
      wrong: [nums[sorted[rank]], nums[sorted[0]], order === 'max' ? Math.max(...nums) : Math.min(...nums)],
      visual: box => V().chips(box, nums.map(String)),
      steps,
    };
  }

  function gen() {
    const k = rand(1, 3);
    if (k === 1) {
      const set = new Set();
      while (set.size < 7) set.add(rand(5, 99)); // không trùng số, để "lớn thứ hai" rõ ràng
      return rankQ({ nums: shuffle([...set]), order: pick(['max', 'min']), rank: pick([1, 1, 2]) });
    }
    const nums = shuffle([rand(1, 9), rand(10, 99), rand(10, 99), rand(10, 99), rand(100, 400), rand(100, 400), rand(10, 99)]);
    const q = rankQ({ nums, order: pick(['max', 'min']), digits: 2, parity: k === 3 ? pick(['even', 'odd']) : null });
    return q.calc == null ? rankQ({ nums, order: 'max', digits: 2 }) : q;
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'so-sanh', part: 'C', icon: '🏔️', title: 'So sánh số', sub: 'Số nào lớn nhất?',
    intro: 'Số nào to nhất, số nào bé nhất? Mình đếm chữ số trước, rồi so từng chữ số từ trái sang phải nhé!',
    words: [
      { en: 'Greatest / Largest', vi: 'Lớn nhất', icon: '⬆️' },
      { en: 'Smallest', vi: 'Nhỏ nhất', icon: '⬇️' },
      { en: 'Second', vi: 'Thứ hai', icon: '2️⃣' },
      { en: '2-digit number', vi: 'Số có 2 chữ số', icon: '🔢' },
      { en: '3-digit number', vi: 'Số có 3 chữ số', icon: '💯' },
      { en: 'Even / Odd', vi: 'Chẵn / Lẻ', icon: '⚖️' },
      { en: 'Observing', vi: 'Quan sát', icon: '👀' },
    ],
    tips: [
      '🔢 Số có nhiều chữ số hơn thì lớn hơn: 100 > 99.',
      '👉 Cùng số chữ số: so chữ số đầu tiên bên trái. Bằng nhau thì so chữ số tiếp theo.',
      '🔍 Đề có điều kiện (chẵn, lẻ, 2 chữ số…) thì lọc số đúng điều kiện trước.',
      '2️⃣ "Lớn thứ hai": xếp từ lớn đến bé rồi lấy số đứng thứ 2.',
    ],
    examples: [
      rankQ({ title: 'Ví dụ 1 · Số lớn nhất', nums: [45, 9, 72, 38, 70], order: 'max' }),
      rankQ({ title: 'Ví dụ 2 · Lớn thứ hai', nums: [23, 61, 18, 56, 40], order: 'max', rank: 2 }),
      rankQ({ title: 'Ví dụ 3 · Số chẵn có 2 chữ số', nums: [111, 108, 88, 17, 99, 22, 68], order: 'max', digits: 2, parity: 'even' }),
    ],
    gen,
    test: [
      rankQ({ src: 'Đề 1 · Câu 22', nums: [37, 31, 6, 43, 50, 34, 19, 78], order: 'max', rank: 2, answer: 50 }),
      rankQ({ src: 'Đề cương TIMO', nums: [15, 84, 31, 47, 92, 24, 66], order: 'min', parity: 'odd', answer: 15 }),
      rankQ({ src: 'Đề cương TIMO', nums: [111, 18, 818, 127, 99, 202, 86], order: 'max', digits: 3, parity: 'even', answer: 818 }),
      rankQ({ src: 'Đề cương TIMO', nums: [118, 213, 82, 97, 181, 110], order: 'min', digits: 3, parity: 'odd', answer: 181 }),
      rankQ({ src: 'Giống câu 22 – Mock 2025', nums: [3456, 3465, 3546, 3645], order: 'min', answer: 3456,
        why: ['👉 Cùng 4 chữ số, chữ số đầu đều là 3. So chữ số thứ hai: 4, 4, 5, 6 → chọn các số có 4.', '👉 3456 và 3465: chữ số thứ ba là 5 và 6 → 3456 nhỏ hơn.'] }),
      rankQ({ src: 'Đề 1 · Câu 23', nums: [2015544, 2105453, 2014515, 2033554], order: 'max', answer: 2105453,
        why: ['👉 Cùng 7 chữ số, chữ số đầu đều là 2. So chữ số thứ hai: 0, 1, 0, 0 → 2105453 có chữ số 1 lớn nhất.'] }),
      rankQ({ src: 'VQG 2024–2025 · Câu 21', nums: [20247654, 2031097, 20241225, 2029899, 20240604], order: 'min', answer: 2029899,
        why: ['👉 2031097 và 2029899 chỉ có 7 chữ số, các số khác có 8 chữ số → số nhỏ nhất là 1 trong 2 số này.', '👉 So 2031097 và 2029899: chữ số thứ hai đều là 0, chữ số thứ ba là 3 và 2 → 2029899 nhỏ hơn.'] }),
      rankQ({ src: 'VQG 2025–2026 · Câu 21', nums: [2036754, 2073682, 20267945, 2025902, 20257536], order: 'max', answer: 20267945,
        why: ['👉 20267945 và 20257536 có 8 chữ số, các số khác chỉ có 7 chữ số → số lớn nhất là 1 trong 2 số này.', '👉 So từng chữ số từ trái sang: 2, 0, 2 giống nhau; chữ số thứ tư là 6 và 5 → 20267945 lớn hơn.'] }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
