/* Chủ đề: Điền dấu + − và tìm phép tính đúng (Arithmetic) */
(function (root) {
  'use strict';
  const { rand, shuffle } = root.TVData;
  const text = (nums, s) => nums.map((n, i) => (i ? ` ${s[i - 1] === '-' ? '−' : '+'} ` : '') + n).join('');
  // Tính lần lượt từ trái sang phải; trả về null nếu giữa chừng bị âm (bé lớp 1 chưa trừ được)
  function run(nums, s) {
    let v = nums[0];
    const parts = [];
    for (let i = 1; i < nums.length; i++) {
      const nv = s[i - 1] === '-' ? v - nums[i] : v + nums[i];
      parts.push(`${v} ${s[i - 1] === '-' ? '−' : '+'} ${nums[i]} = ${nv}`);
      if (nv < 0) return null;
      v = nv;
    }
    return { v, parts };
  }
  const allSigns = n => Array.from({ length: 2 ** n }, (_, m) => Array.from({ length: n }, (_, i) => ((m >> i) & 1 ? '-' : '+')).join(''));

  // nums: các số, target: kết quả. Có thể có nhiều cách đúng – chấm bằng check().
  function signsQ(o) {
    const { nums, target } = o, k = nums.length - 1;
    const good = s => { const r = run(nums, s); return !!r && r.v === target; };
    const sols = allSigns(k).filter(good);
    const ans = o.answer || sols[0];
    const sum = nums.reduce((a, b) => a + b, 0), diff = sum - target;
    const minus = nums.filter((_, i) => i && ans[i - 1] === '-');
    const steps = [{ text: `💡 Mẹo: thử cộng hết trước: ${nums.join(' + ')} = <b>${sum}</b>.` }];
    if (diff === 0) steps.push({ text: `👍 Bằng ${target} luôn! Điền toàn dấu +.` });
    else {
      steps.push({ text: `🔍 ${sum} nhiều hơn ${target} là ${sum} − ${target} = ${diff}. Đổi dấu + thành − trước một số thì kết quả bớt đi 2 lần số đó.` });
      steps.push({ text: `👉 ${diff} = ${minus.map(m => `${m} + ${m}`).join(' + ')} → đổi dấu trước <b>${minus.join(', ')}</b> thành dấu −.` });
    }
    steps.push({ text: `✅ Thử lại: ${run(nums, ans).parts.join('; ')}. Đúng rồi!` });
    steps.push({ text: `🎉 Đáp án: <b>${text(nums, ans)} = ${target}</b>` });
    const wrong = shuffle(allSigns(k).filter(s => !good(s))).slice(0, 2);
    return {
      title: o.title, src: o.src, type: 'signs', nums, target, answer: ans, hint: 2, wrong,
      check: v => typeof v === 'string' && v.length === k && good(v),
      en: `Fill in the blanks with "+" and "−" to make the equation correct: ${nums.join(' ___ ')} = ${target}`,
      vi: `Điền dấu + hoặc − vào chỗ trống để phép tính đúng: ${nums.join(' ___ ')} = ${target}`,
      steps,
    };
  }

  // Tìm phép tính đúng trong 4 phép tính A, B, C, D
  function pickEqQ(o) {
    const L = 'ABCD';
    const res = o.opts.map(e => { const [l, r] = e.split('='); const nums = l.match(/\d+/g).map(Number); const s = (l.match(/[+−-]/g) || []).map(c => (c === '+' ? '+' : '-')); return { e, rr: run(nums, s), want: Number(r) }; });
    const calc = L[res.findIndex(x => x.rr && x.rr.v === x.want)];
    return {
      title: o.title, src: o.src, type: 'choice', answer: o.answer || calc, calc, hint: 1,
      choices: o.opts.map((e, i) => ({ value: L[i], html: `<b>${L[i]}</b><small class="eq-small">${e}</small>` })),
      en: 'Which equation of the following is correct?', vi: 'Phép tính nào dưới đây là đúng?',
      steps: [
        { text: '🧮 Tính vế trái của từng phép tính rồi so với số sau dấu =.' },
        ...res.map((x, i) => ({ text: `${L[i]}. ${x.e}: ${x.rr ? `vế trái bằng <b>${x.rr.v}</b> ${x.rr.v === x.want ? '✅' : '❌'}` : 'có bước trừ không được ❌'}` })),
        { text: `🎉 Đáp án: <b>${calc}</b>` },
      ],
    };
  }

  function gen() {
    // 4 phép tính cùng 3 số, chỉ khác dấu; chọn kết quả sao cho đúng 1 phép tính đúng
    while (Math.random() < 0.3) {
      const nums = [rand(5, 12), rand(2, 9), rand(2, 9)];
      const combos = allSigns(2), vals = combos.map(s => run(nums, s));
      const pickI = rand(0, 3);
      if (!vals[pickI]) continue;
      const t = vals[pickI].v;
      if (vals.filter(r => r && r.v === t).length !== 1) continue;
      return pickEqQ({ opts: combos.map(s => `${text(nums, s)} = ${t}`) });
    }
    for (;;) {
      const nums = Array.from({ length: rand(3, 4) }, (_, i) => (i ? rand(1, 9) : rand(5, 20)));
      const s = allSigns(nums.length - 1)[rand(0, 2 ** (nums.length - 1) - 1)];
      const r = run(nums, s);
      if (r && allSigns(nums.length - 1).filter(x => { const q = run(nums, x); return q && q.v === r.v; }).length < 2 ** (nums.length - 1) - 1) {
        return signsQ({ nums, target: r.v });
      }
    }
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'dien-dau', part: 'B', icon: '➕', title: 'Điền dấu + −', sub: 'Cộng hay trừ cho đúng?',
    intro: 'Mình là thợ sửa phép tính! Đặt dấu + hoặc − vào đúng chỗ để phép tính ra kết quả đúng.',
    words: [
      { en: 'Fill in', vi: 'Điền vào', icon: '✏️' },
      { en: 'Blank / Line', vi: 'Chỗ trống', icon: '⬜' },
      { en: 'Equation', vi: 'Phép tính', icon: '📝' },
      { en: 'Correct', vi: 'Đúng', icon: '✅' },
      { en: 'Plus', vi: 'Cộng (+)', icon: '➕' },
      { en: 'Minus', vi: 'Trừ (−)', icon: '➖' },
      { en: 'Which', vi: 'Cái nào', icon: '❓' },
    ],
    tips: [
      '💡 Thử cộng hết trước. Bằng kết quả thì xong!',
      '🔍 Nếu nhiều hơn: đổi dấu + thành − trước một số thì kết quả bớt đi 2 lần số đó.',
      '✅ Luôn tính lại từ trái sang phải để kiểm tra.',
    ],
    examples: [
      signsQ({ title: 'Ví dụ 1 · Cộng hết là đúng', nums: [1, 2, 3, 4], target: 10 }),
      signsQ({ title: 'Ví dụ 2 · Phải có dấu −', nums: [4, 7, 9], target: 2 }),
      pickEqQ({ title: 'Ví dụ 3 · Phép tính nào đúng?', opts: ['4 − 2 − 5 = 7', '4 + 2 − 5 = 7', '4 + 2 + 5 = 7', '4 − 2 + 5 = 7'] }),
    ],
    gen,
    test: [
      signsQ({ src: 'Đề cương TIMO', nums: [2, 3, 4, 5], target: 14, answer: '+++' }),
      signsQ({ src: 'Đề cương TIMO', nums: [26, 4, 16, 5], target: 11, answer: '--+' }),
      signsQ({ src: 'Giống câu 12 – Mock 2025', nums: [15, 6, 8, 3], target: 16, answer: '+-+' }),
      signsQ({ src: 'Giống đề TIMO', nums: [10, 3, 5, 2], target: 10, answer: '+-+' }),
      signsQ({ src: 'VQG 2025–2026 · Câu 12', nums: [15, 7, 20, 8], target: 10, answer: '+-+' }),
      pickEqQ({ src: 'Đề cương TIMO', opts: ['6 + 8 + 5 = 9', '6 − 8 − 5 = 9', '6 + 8 − 5 = 9', '6 − 8 + 5 = 9'], answer: 'C' }),
      pickEqQ({ src: 'Đề cương TIMO', opts: ['5 + 6 − 1 = 10', '5 + 6 + 1 = 10', '5 − 6 − 1 = 10', '6 − 5 + 1 = 10'], answer: 'A' }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
