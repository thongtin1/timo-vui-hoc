/* Chủ đề: Xem giờ – mấy giờ sau / trước (Logical thinking) */
(function (root) {
  'use strict';
  const { rand } = root.TVData;
  const V = () => root.TV.vis;
  const wrap = h => ((((h - 1) % 12) + 12) % 12) + 1;

  // h: giờ đồng hồ đang chỉ, d: số giờ sau (dương) hoặc trước (âm)
  function clockQ(o) {
    const { h, d } = o, D = Math.abs(d), fwd = d > 0, calc = wrap(h + d);
    const rest = D >= 12 ? D - 12 : D, go = fwd ? 1 : -1;
    const chain = Array.from({ length: rest }, (_, i) => wrap(h + go * (i + 1)));
    const crosses = fwd ? chain.includes(1) : chain.includes(12); // đi tới qua 12 → 1, lùi qua 1 → 12
    const steps = [
      { text: `🕘 Kim giờ (kim ngắn, màu cam) chỉ số <b>${h}</b>, kim phút (kim dài) chỉ số 12 → bây giờ là <b>${h} giờ</b>.` },
      { text: `${fwd ? '⏩' : '⏪'} ${D} giờ ${fwd ? 'sau' : 'trước'}: kim giờ ${fwd ? 'đi tiếp' : 'lùi lại'} ${D} số.` },
    ];
    if (D >= 12) steps.push({ text: `✨ Mẹo: đi đủ 12 giờ là kim quay đúng 1 vòng, về lại số ${h}. Chỉ còn ${rest} giờ nữa thôi!` });
    if (rest) {
      steps.push({ text: `🐾 ${fwd ? 'Đếm tiếp' : 'Đếm lùi'} ${rest} số: ${chain.join(' → ')}.${crosses ? (fwd ? ' Qua số 12 thì đếm tiếp 1, 2, 3…' : ' Lùi qua số 1 thì tới số 12.') : ''}`, run: t => t.walk(go * rest) });
    }
    steps.push({ text: `🎉 Đáp án: <b>${calc} giờ</b>` });
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2,
      en: `Now, the clock looks like the picture below. What time is it ${D} hour${D > 1 ? 's' : ''} ${fwd ? 'later' : 'before'}?`,
      vi: `Đồng hồ đang chỉ như hình. Hỏi ${D} giờ ${fwd ? 'sau' : 'trước'} là mấy giờ?`,
      wrong: [wrap(h - d), wrap(calc + 1), wrap(calc - 1)],
      visual: box => V().clock(box, h),
      steps,
    };
  }

  function gen() {
    const d = rand(1, 6) * (Math.random() < 0.6 ? 1 : -1);
    return clockQ({ h: rand(1, 12), d });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'xem-gio', part: 'A', icon: '⏰', title: 'Xem giờ', sub: 'Kim giờ đi tới, lùi lại',
    intro: 'Kim ngắn chỉ giờ. Mỗi giờ trôi qua, kim ngắn nhảy sang 1 số. Đồng hồ là một vòng tròn: qua số 12 lại về số 1!',
    words: [
      { en: 'Clock', vi: 'Đồng hồ', icon: '⏰' },
      { en: 'Hour', vi: 'Giờ', icon: '🕐' },
      { en: 'Hour hand', vi: 'Kim giờ (kim ngắn)', icon: '🟠' },
      { en: "O'clock", vi: 'Giờ đúng', icon: '🕛' },
      { en: 'Later', vi: 'Sau', icon: '⏩' },
      { en: 'Before', vi: 'Trước', icon: '⏪' },
      { en: 'What time is it?', vi: 'Mấy giờ rồi?', icon: '❓' },
    ],
    tips: [
      '🕘 Nhìn kim ngắn để biết bây giờ là mấy giờ.',
      '⏩ "giờ sau" (later): đếm tiếp. ⏪ "giờ trước" (before): đếm lùi.',
      '🔄 Qua số 12 lại đếm 1, 2, 3… Đi đủ 12 giờ là kim về chỗ cũ.',
    ],
    examples: [
      clockQ({ title: 'Ví dụ 1 · 3 giờ sau', h: 2, d: 3 }),
      clockQ({ title: 'Ví dụ 2 · Đi qua số 12', h: 11, d: 3 }),
      clockQ({ title: 'Ví dụ 3 · Lùi lại', h: 1, d: -2 }),
    ],
    gen,
    test: [
      clockQ({ src: 'Đề cương TIMO', h: 9, d: 5, answer: 2 }),
      clockQ({ src: 'Đề cương TIMO', h: 3, d: -2, answer: 1 }),
      clockQ({ src: 'Đề cương TIMO', h: 2, d: -3, answer: 11 }),
      clockQ({ src: 'Giống đề TIMO', h: 7, d: 4, answer: 11 }),
      clockQ({ src: 'Giống đề TIMO', h: 10, d: 6, answer: 4 }),
      clockQ({ src: 'Giống đề TIMO', h: 1, d: -4, answer: 9 }),
      clockQ({ src: 'Giống đề TIMO', h: 5, d: -7, answer: 10 }),
      clockQ({ src: 'Giống đề TIMO', h: 8, d: 14, answer: 10 }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
