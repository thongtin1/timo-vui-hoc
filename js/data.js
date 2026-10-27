/* TIMO Vui Học – dữ liệu bài học và phần tính toán.
   File này không đụng tới giao diện nên chạy được cả trong Node để kiểm tra đáp án.
   Muốn thêm bài mới: thêm từ vựng / bài tập vào đây theo cùng mẫu. */
(function (root) {
  'use strict';

  // ---------- Tiện ích ----------
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const mod7 = n => ((n % 7) + 7) % 7;
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

  // ---------- Bài 4: Thứ – ngày – tháng ----------
  // Thứ tự theo sách: Monday là ngày đầu (chỉ số 0), Sunday là 6.
  const DAYS = [
    { en: 'Monday',    vi: 'thứ Hai',  short: 'Thứ 2', color: '#fa5252' },
    { en: 'Tuesday',   vi: 'thứ Ba',   short: 'Thứ 3', color: '#fd7e14' },
    { en: 'Wednesday', vi: 'thứ Tư',   short: 'Thứ 4', color: '#e6a700' },
    { en: 'Thursday',  vi: 'thứ Năm',  short: 'Thứ 5', color: '#40c057' },
    { en: 'Friday',    vi: 'thứ Sáu',  short: 'Thứ 6', color: '#228be6' },
    { en: 'Saturday',  vi: 'thứ Bảy',  short: 'Thứ 7', color: '#7950f2' },
    { en: 'Sunday',    vi: 'Chủ nhật', short: 'CN',    color: '#e64980' },
  ];

  const MONTHS = [
    ['January', '❄️'], ['February', '🧧'], ['March', '🌸'], ['April', '🌧️'],
    ['May', '🌻'], ['June', '☀️'], ['July', '🏖️'], ['August', '🍉'],
    ['September', '🎒'], ['October', '🎃'], ['November', '🍂'], ['December', '🎄'],
  ].map(([en, icon], i) => ({ en, vi: `Tháng ${i + 1}`, icon }));

  const TIME_WORDS = [
    { en: 'Today', vi: 'Hôm nay', icon: '🏠' },
    { en: 'Yesterday', vi: 'Hôm qua', icon: '⬅️' },
    { en: 'Tomorrow', vi: 'Ngày mai', icon: '➡️' },
    { en: 'The day before yesterday', vi: 'Hôm kia', icon: '⏮️' },
    { en: 'The day after tomorrow', vi: 'Ngày kia', icon: '⏭️' },
    { en: 'Now', vi: 'Bây giờ', icon: '⏰' },
    { en: 'Day', vi: 'Ngày', icon: '🌞' },
    { en: 'Week', vi: 'Tuần', icon: '🗓️' },
    { en: 'Month', vi: 'Tháng', icon: '📆' },
    { en: 'Year', vi: 'Năm', icon: '🎆' },
    { en: 'Leap year', vi: 'Năm nhuận', icon: '🦘' },
  ];

  // Đề cho biết một ngày nào đó; shift = cần đi bao nhiêu ngày để tới "hôm nay".
  const REFS = {
    today:     { shift: 0,  vi: 'Hôm nay',  en: d => `Today is ${d}.`,                       viText: d => `Hôm nay là ${d}.` },
    yesterday: { shift: 1,  vi: 'Hôm qua',  en: d => `Yesterday was ${d}.`,                  viText: d => `Hôm qua là ${d}.` },
    tomorrow:  { shift: -1, vi: 'Ngày mai', en: d => `Tomorrow will be ${d}.`,               viText: d => `Ngày mai là ${d}.` },
    before2:   { shift: 2,  vi: 'Hôm kia',  en: d => `The day before yesterday was ${d}.`,   viText: d => `Hôm kia là ${d}.` },
    after2:    { shift: -2, vi: 'Ngày kia', en: d => `The day after tomorrow will be ${d}.`, viText: d => `Ngày kia là ${d}.` },
  };

  const todayOf = q => mod7(q.refDay + REFS[q.ref].shift);
  const answerOf = q => mod7(todayOf(q) + q.offset);

  // Bài tập trong sách (Lesson 4, trang 18–19)
  const BOOK_DATE = [
    { en: 'Today, it is Tuesday. Which day of the week will it be 5 days later?',
      vi: 'Hôm nay là thứ Ba. Hỏi 5 ngày nữa là thứ mấy trong tuần?', ref: 'today', refDay: 1, offset: 5 },
    { en: 'Yesterday was Friday. Which day of the week will it be 4 days from now?',
      vi: 'Hôm qua là thứ Sáu. Hỏi 4 ngày nữa (tính từ hôm nay) là thứ mấy?', ref: 'yesterday', refDay: 4, offset: 4 },
    { en: 'It will be Sunday tomorrow. Which day of the week was it 4 days ago (from now)?',
      vi: 'Ngày mai là Chủ nhật. Hỏi 4 ngày trước (tính từ bây giờ) là thứ mấy?', ref: 'tomorrow', refDay: 6, offset: -4 },
    { en: 'If yesterday was Friday, which day of the week will it be 5 days later (from today)?',
      vi: 'Nếu hôm qua là thứ Sáu, 5 ngày nữa (tính từ hôm nay) là thứ mấy?', ref: 'yesterday', refDay: 4, offset: 5 },
    { en: 'Today is Monday. Which day of the week was it 8 days ago?',
      vi: 'Hôm nay là thứ Hai. 8 ngày trước là thứ mấy?', ref: 'today', refDay: 0, offset: -8 },
    { en: 'The day after tomorrow will be Thursday. Which day of the week was it 2 days ago (from today)?',
      vi: 'Ngày kia là thứ Năm. Hỏi 2 ngày trước (tính từ hôm nay) là thứ mấy?', ref: 'after2', refDay: 3, offset: -2 },
    { en: 'If yesterday was Friday, which day of the week will it be 10 days later from now?',
      vi: 'Nếu hôm qua là thứ Sáu, 10 ngày nữa (tính từ hôm nay) là thứ mấy?', ref: 'yesterday', refDay: 4, offset: 10,
      tag: 'Đề TIMO 2019–2020' },
  ];

  // Lời giải từng bước. Các bước đầu (dateHintCount) dùng làm gợi ý, không lộ đáp án.
  function dateSteps(q) {
    const t = todayOf(q), a = answerOf(q), n = Math.abs(q.offset), fwd = q.offset > 0;
    const go = fwd ? 1 : -1, ref = REFS[q.ref], s = [];
    if (q.ref === 'today') {
      s.push(`🏠 Hôm nay là <b>${DAYS[t].vi}</b>.`);
    } else {
      s.push(`🏠 Tìm hôm nay: ${ref.vi} là ${DAYS[q.refDay].vi}. Từ ${ref.vi.toLowerCase()} ${ref.shift > 0 ? 'đi tới' : 'lùi lại'} ${Math.abs(ref.shift)} ngày là hôm nay: <b>${DAYS[t].vi}</b>.`);
    }
    s.push(fwd
      ? `➡️ “${n} ngày nữa” (later) là <b class="fwd-t">đi tới</b> ${n} bước.`
      : `⬅️ “${n} ngày trước” (ago) là <b class="back-t">lùi lại</b> ${n} bước.`);
    const rest = n % 7;
    if (n >= 7) s.push(`✨ Mẹo: ${fwd ? 'đi tới' : 'lùi lại'} 7 bước là về đúng ${DAYS[t].vi}.${rest ? ` Chỉ còn ${rest} bước nữa thôi!` : ''}`);
    if (rest) {
      const chain = [];
      for (let i = 1; i <= rest; i++) chain.push(DAYS[mod7(t + go * i)].vi);
      s.push(`🧟 Zoombe nhảy ${rest} bước: ${chain.join(' → ')}.`);
    }
    s.push(`🎉 Đáp án: <b>${cap(DAYS[a].vi)} (${DAYS[a].en})</b>`);
    return s;
  }
  const dateHintCount = q => (Math.abs(q.offset) >= 7 ? 3 : 2);

  // 3 lựa chọn: đáp án + các lỗi hay gặp (đi ngược chiều, quên tìm hôm nay, lệch 1 ngày).
  function dateChoices(q) {
    const a = answerOf(q), t = todayOf(q);
    const out = [a];
    for (const d of [mod7(t - q.offset), mod7(q.refDay + q.offset), mod7(a + 1), mod7(a - 1), mod7(a + 2)]) {
      if (out.length < 3 && !out.includes(d)) out.push(d);
    }
    return shuffle(out);
  }

  const askEn = o => (o > 0
    ? `Which day of the week will it be ${plural(o, 'day')} later?`
    : `Which day of the week was it ${plural(-o, 'day')} ago?`);
  const askVi = o => (o > 0 ? `Hỏi ${o} ngày nữa là thứ mấy?` : `Hỏi ${-o} ngày trước là thứ mấy?`);
  const sign = () => (Math.random() < 0.5 ? -1 : 1);

  // Câu hỏi ngẫu nhiên: 1 = dễ (chỉ đi tới), 2 = vừa (tới/lùi), 3 = khó (hôm qua/ngày mai…, tới 10 ngày)
  function genDate(level) {
    let ref = 'today', offset;
    if (level === 1) offset = rand(1, 4);
    else if (level === 2) offset = rand(1, 6) * sign();
    else { ref = pick(Object.keys(REFS)); offset = rand(1, 10) * sign(); }
    const q = { ref, refDay: rand(0, 6), offset };
    q.en = `${REFS[ref].en(DAYS[q.refDay].en)} ${askEn(offset)}`;
    q.vi = `${REFS[ref].viText(DAYS[q.refDay].vi)} ${askVi(offset)}`;
    return q;
  }

  // ---------- Bài 5: Tính tuổi ----------
  const AGE_WORDS = [
    { en: 'Age', vi: 'Tuổi', icon: '🎂' },
    { en: 'Older', vi: 'Nhiều tuổi hơn', icon: '⬆️' },
    { en: 'Younger', vi: 'Ít tuổi hơn', icon: '⬇️' },
    { en: 'The same age as', vi: 'Bằng tuổi', icon: '👯' },
    { en: 'Equal to', vi: 'Bằng', icon: '🟰' },
    { en: 'Born', vi: 'Sinh ra', icon: '👶' },
    { en: 'Year', vi: 'Năm', icon: '📅' },
    { en: 'Now', vi: 'Bây giờ', icon: '⏰' },
    { en: 'Later / After', vi: 'Sau, nữa', icon: '⏩' },
    { en: 'Ago / Before', vi: 'Trước', icon: '⏪' },
    { en: 'Sum', vi: 'Tổng', icon: '➕' },
    { en: 'Difference', vi: 'Hiệu (hơn kém)', icon: '➖' },
  ];

  // Bài tập trong sách (Lesson 5, trang 20). choices[0] là đáp án đúng; hint = số bước gợi ý được mở trước.
  const BOOK_AGE = [
    { en: '5 years ago, Mike was 11 years old. How old is he now?',
      vi: '5 năm trước, Mike 11 tuổi. Hỏi hiện tại cậu ấy bao nhiêu tuổi?',
      choices: [16, 6, 15], hint: 1,
      steps: ['⏪ 5 năm trước Mike 11 tuổi. Từ đó tới bây giờ Mike lớn thêm 5 tuổi.', '🧮 11 + 5 = <b>16</b>'] },
    { en: '2 years ago, Anna was 6 years old. How old will she be 3 years later from now?',
      vi: '2 năm trước, Anna 6 tuổi. Hỏi 3 năm sau (tính từ hiện tại) cô ấy bao nhiêu tuổi?',
      choices: [11, 9, 8], hint: 2,
      steps: ['⏪ 2 năm trước Anna 6 tuổi → bây giờ Anna: 6 + 2 = <b>8</b> tuổi.', '⏩ 3 năm sau Anna lớn thêm 3 tuổi nữa.', '🧮 8 + 3 = <b>11</b>'] },
    { en: 'Father is 29 years old. Mother is 3 years younger than father. How old is mother?',
      vi: 'Bố 29 tuổi. Mẹ ít hơn bố 3 tuổi. Hỏi mẹ bao nhiêu tuổi?',
      choices: [26, 32, 27], hint: 1,
      steps: ['⬇️ Mẹ ít tuổi hơn bố (younger) 3 tuổi → lấy tuổi bố bớt đi 3.', '🧮 29 − 3 = <b>26</b>'] },
    { en: '4 years later, Jack will be 18 years old. How old is he now?',
      vi: '4 năm sau, Jack sẽ 18 tuổi. Hỏi hiện tại anh ấy bao nhiêu tuổi?',
      choices: [14, 22, 15], hint: 1,
      steps: ['⏩ Phải 4 năm nữa Jack mới 18 tuổi, nên bây giờ Jack còn ít hơn 4 tuổi.', '🧮 18 − 4 = <b>14</b>'] },
    { en: 'When Amy was born, her mother was 26 years old. When Amy is 3 years old, how old will her mother be?',
      vi: 'Khi Amy vừa sinh ra, mẹ bạn ấy 26 tuổi. Hỏi khi Amy lên 3 tuổi, mẹ bạn ấy bao nhiêu tuổi?',
      choices: [29, 23, 26], hint: 2,
      steps: ['👶 Khi Amy vừa sinh ra (0 tuổi), mẹ 26 tuổi → mẹ hơn Amy 26 tuổi.', '⏩ Amy lớn thêm 3 tuổi thì mẹ cũng lớn thêm 3 tuổi.', '🧮 26 + 3 = <b>29</b>'] },
    { en: 'After 5 years, Amy will be 9 years old. Jenny is 2 years older than Amy. How old is Jenny now?',
      vi: '5 năm nữa, Amy sẽ lên 9 tuổi. Jenny lớn hơn Amy 2 tuổi. Hỏi hiện nay Jenny bao nhiêu tuổi?',
      choices: [6, 11, 4], hint: 2,
      steps: ['⏩ 5 năm nữa Amy mới 9 tuổi → bây giờ Amy: 9 − 5 = <b>4</b> tuổi.', '⬆️ Jenny hơn Amy 2 tuổi (older).', '🧮 4 + 2 = <b>6</b>'] },
    { en: 'Father is 34 years old and mother is 32 years old. What is the difference between their ages?',
      vi: 'Tuổi của bố là 34, tuổi của mẹ là 32. Hỏi bố hơn mẹ bao nhiêu tuổi?',
      choices: [2, 66, 3], hint: 1,
      steps: ['➖ Hiệu số tuổi (difference): lấy tuổi lớn trừ tuổi bé.', '🧮 34 − 32 = <b>2</b>'] },
    { en: 'After 6 years, Amy will be 13 years old. Bentley is 8 years old now. What is the sum of their ages now?',
      vi: 'Sau 6 năm nữa, Amy sẽ 13 tuổi. Hiện nay Bentley đang 8 tuổi. Hỏi tổng số tuổi của Amy và Bentley bây giờ là bao nhiêu?',
      choices: [15, 21, 7], hint: 2,
      steps: ['⏩ 6 năm nữa Amy mới 13 tuổi → bây giờ Amy: 13 − 6 = <b>7</b> tuổi.', '➕ Tổng (sum): cộng tuổi Amy với tuổi Bentley.', '🧮 7 + 8 = <b>15</b>'] },
  ].map(q => ({ ...q, answer: q.choices[0], steps: q.steps.concat(`🎉 Đáp án: <b>${q.choices[0]} tuổi</b>`) }));

  const NAMES = ['Lan', 'Minh', 'Tom', 'Anna', 'Bin', 'Na', 'Mai', 'Ben'];
  const yrs = n => plural(n, 'year');

  function ageChoices(ans, wrong) {
    const out = [ans];
    for (const c of [wrong, ans + 1, ans - 1, ans + 2]) {
      if (out.length < 3 && c >= 0 && !out.includes(c)) out.push(c);
    }
    return shuffle(out);
  }

  // Câu hỏi tuổi ngẫu nhiên, số nhỏ (trong phạm vi 20) hợp với bé lớp 1.
  function genAge() {
    const [X, Y] = shuffle(NAMES);
    const type = rand(1, 5);
    let a, b, ans, wrong, en, vi, how;
    if (type === 1) {
      a = rand(3, 12); b = rand(1, 5); ans = a + b; wrong = a - b;
      en = `${X} is ${yrs(a)} old. ${Y} is ${yrs(b)} older than ${X}. How old is ${Y}?`;
      vi = `${X} ${a} tuổi. ${Y} hơn ${X} ${b} tuổi. Hỏi ${Y} bao nhiêu tuổi?`;
      how = `⬆️ ${Y} <b>nhiều tuổi hơn</b> ${X} (older), nên lấy tuổi ${X} cộng thêm ${b}.`;
    } else if (type === 2) {
      a = rand(6, 14); b = rand(1, 5); ans = a - b; wrong = a + b;
      en = `${X} is ${yrs(a)} old. ${Y} is ${yrs(b)} younger than ${X}. How old is ${Y}?`;
      vi = `${X} ${a} tuổi. ${Y} kém ${X} ${b} tuổi. Hỏi ${Y} bao nhiêu tuổi?`;
      how = `⬇️ ${Y} <b>ít tuổi hơn</b> ${X} (younger), nên lấy tuổi ${X} bớt đi ${b}.`;
    } else if (type === 3) {
      a = rand(2, 10); b = rand(1, 5); ans = a + b; wrong = a - b;
      en = `${yrs(b)} ago, ${X} was ${yrs(a)} old. How old is ${X} now?`;
      vi = `${b} năm trước, ${X} ${a} tuổi. Hỏi bây giờ ${X} bao nhiêu tuổi?`;
      how = `⏪ ${b} năm trước ${X} còn nhỏ. Tới bây giờ ${X} đã lớn thêm ${b} tuổi.`;
    } else if (type === 4) {
      a = rand(7, 15); b = rand(1, 5); ans = a - b; wrong = a + b;
      en = `In ${yrs(b)}, ${X} will be ${yrs(a)} old. How old is ${X} now?`;
      vi = `${b} năm nữa, ${X} sẽ ${a} tuổi. Hỏi bây giờ ${X} bao nhiêu tuổi?`;
      how = `⏩ Phải ${b} năm nữa ${X} mới ${a} tuổi, nên bây giờ ${X} còn ít hơn ${b} tuổi.`;
    } else {
      a = rand(3, 10); b = rand(1, 5); ans = a + b; wrong = a - b;
      en = `${X} is ${yrs(a)} old now. How old will ${X} be ${yrs(b)} later?`;
      vi = `Bây giờ ${X} ${a} tuổi. Hỏi ${b} năm nữa ${X} bao nhiêu tuổi?`;
      how = `⏩ Mỗi năm ${X} lớn thêm 1 tuổi. ${b} năm nữa thì lớn thêm ${b} tuổi.`;
    }
    const op = ans > a ? '+' : '−';
    return {
      en, vi, answer: ans, hint: 1,
      choices: ageChoices(ans, wrong),
      steps: [how, `🧮 ${a} ${op} ${b} = <b>${ans}</b>`, `🎉 Đáp án: <b>${ans} tuổi</b>`],
    };
  }

  // ---------- Bài tự làm của Bài 4 và Bài 5 (câu trong đề ôn + câu cùng dạng) ----------
  const TEST_DATE = [
    { src: 'Mock 2025 · Câu 3', ref: 'tomorrow', refDay: 4, offset: 11,
      en: 'If tomorrow will be Friday, which day of the week will 11 days later be from today?',
      vi: 'Nếu ngày mai là thứ Sáu, hỏi 11 ngày nữa (tính từ hôm nay) là thứ mấy?' },
    { src: 'Giống đề TIMO', ref: 'before2', refDay: 5, offset: 9,
      en: 'The day before yesterday was Saturday. Which day of the week will it be 9 days later from today?',
      vi: 'Hôm kia là thứ Bảy. Hỏi 9 ngày nữa (tính từ hôm nay) là thứ mấy?' },
    { src: 'Giống đề TIMO', ref: 'today', refDay: 2, offset: -10,
      en: 'Today is Wednesday. Which day of the week was it 10 days ago?',
      vi: 'Hôm nay là thứ Tư. Hỏi 10 ngày trước là thứ mấy?' },
    { src: 'Giống đề TIMO', ref: 'yesterday', refDay: 6, offset: -5,
      en: 'Yesterday was Sunday. Which day of the week was it 5 days ago (from today)?',
      vi: 'Hôm qua là Chủ nhật. Hỏi 5 ngày trước (tính từ hôm nay) là thứ mấy?' },
  ];

  const TEST_AGE = [
    { src: 'Mock 2025 · Câu 1', answer: 5,
      en: 'Edward is 18 years old now and Kenny was 8 years old 5 years ago. What is the difference between their ages?',
      vi: 'Bây giờ Edward 18 tuổi. 5 năm trước Kenny 8 tuổi. Hỏi hai bạn hơn kém nhau bao nhiêu tuổi?',
      steps: ['⏪ 5 năm trước Kenny 8 tuổi → bây giờ Kenny: 8 + 5 = <b>13</b> tuổi.', '➖ Hơn kém (difference): lấy tuổi lớn trừ tuổi bé.', '🧮 18 − 13 = <b>5</b>'] },
    { src: 'VQG 2024–2025 · Câu 4', answer: 27,
      en: '12 years ago, John was 8 years old. Mary is 7 years elder than John. How old is Mary now?',
      vi: '12 năm trước, John 8 tuổi. Mary hơn John 7 tuổi. Hỏi bây giờ Mary bao nhiêu tuổi?',
      steps: ['⏪ 12 năm trước John 8 tuổi → bây giờ John: 8 + 12 = <b>20</b> tuổi.', '⬆️ Mary nhiều tuổi hơn John 7 tuổi.', '🧮 20 + 7 = <b>27</b>'] },
    { src: 'Đề 1 · Câu 25', answer: 44,
      vi: 'Năm nay Voi 5 tuổi. Mẹ Voi nhiều hơn Voi 32 tuổi. Hỏi sau 1 năm nữa, tổng số tuổi của Voi và mẹ là bao nhiêu?',
      steps: ['🐘 Mẹ Voi bây giờ: 5 + 32 = <b>37</b> tuổi.', '⏩ 1 năm nữa ai cũng thêm 1 tuổi: Voi 6 tuổi, mẹ 38 tuổi.', '➕ Tổng: 6 + 38 = <b>44</b>'] },
    { src: 'Giống đề TIMO', answer: 37,
      en: '3 years later, Tom will be 10 years old. His father is 30 years older than Tom. How old is his father now?',
      vi: '3 năm nữa, Tom sẽ 10 tuổi. Bố hơn Tom 30 tuổi. Hỏi bây giờ bố Tom bao nhiêu tuổi?',
      steps: ['⏩ 3 năm nữa Tom mới 10 tuổi → bây giờ Tom: 10 − 3 = <b>7</b> tuổi.', '⬆️ Bố hơn Tom 30 tuổi.', '🧮 7 + 30 = <b>37</b>'] },
    { src: 'Giống đề TIMO', answer: 14,
      en: 'Lan is the same age as Na. 2 years ago, Lan was 5 years old. What is the sum of their ages now?',
      vi: 'Lan bằng tuổi Na. 2 năm trước Lan 5 tuổi. Hỏi bây giờ tổng số tuổi của Lan và Na là bao nhiêu?',
      steps: ['⏪ 2 năm trước Lan 5 tuổi → bây giờ Lan: 5 + 2 = <b>7</b> tuổi.', '👯 Na bằng tuổi Lan → Na cũng 7 tuổi.', '➕ Tổng: 7 + 7 = <b>14</b>'] },
  ].map(q => ({ ...q, type: 'num', steps: q.steps.concat(`🎉 Đáp án: <b>${q.answer}</b>`) }));

  // ---------- 5 phần của đề TIMO và các bài đã có trang riêng ----------
  const PARTS = [
    { id: 'A', icon: '🧠', vi: 'Tư duy logic', en: 'Logical thinking', color: '#7048e8', soon: 'Mật mã · Quy luật hình · Xếp hàng · Xem giờ' },
    { id: 'B', icon: '➕', vi: 'Số học', en: 'Arithmetic', color: '#e64980', soon: 'Điền dấu + −' },
    { id: 'C', icon: '🔢', vi: 'Lý thuyết số', en: 'Number theory', color: '#228be6', soon: 'So sánh số · Cấu tạo số · Gói và hộp' },
    { id: 'D', icon: '📐', vi: 'Hình học', en: 'Geometry', color: '#2f9e44', soon: 'Đoạn thẳng · Hình vuông · Cạnh và góc · Khối lập phương' },
    { id: 'E', icon: '🎲', vi: 'Tổ hợp', en: 'Combinatorics', color: '#e8590c', soon: 'Đổi tiền xu · Lập số · Cái cân · Đếm số' },
  ];
  const LINKS = [
    { part: 'A', href: 'bai-thu-ngay.html', icon: '📅', title: 'Thứ · Ngày · Tháng', sub: 'Zoombe nhảy vòng tròn 7 ngày', test: 'ngay-test', n: TEST_DATE.length },
    { part: 'A', href: 'bai-tuoi.html', icon: '🎂', title: 'Tính tuổi', sub: 'Ai lớn hơn? Ai nhỏ hơn?', test: 'tuoi-test', n: TEST_AGE.length },
  ];

  // Tính giá trị phép tính chỉ có + và − (tính lần lượt từ trái sang phải)
  function evalExpr(s) {
    const t = String(s).replace(/−/g, '-').replace(/\s+/g, '').match(/[+-]?\d+/g) || [];
    return t.reduce((sum, x) => sum + Number(x), 0);
  }

  const api = {
    rand, pick, shuffle, cap, mod7, evalExpr,
    DAYS, MONTHS, TIME_WORDS, REFS, BOOK_DATE,
    todayOf, answerOf, dateSteps, dateHintCount, dateChoices, genDate,
    AGE_WORDS, BOOK_AGE, genAge,
    TEST_DATE, TEST_AGE, PARTS, LINKS,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TVData = api;
})(typeof window !== 'undefined' ? window : globalThis);
