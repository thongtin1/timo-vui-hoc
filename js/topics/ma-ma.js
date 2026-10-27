/* Chủ đề: Giải mật mã – mỗi chữ dịch đi cùng một số bước (Logical thinking) */
(function (root) {
  'use strict';
  const { pick } = root.TVData;
  const V = () => root.TV.vis;
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const pos = c => ABC.indexOf(c);
  const shift = (c, d) => ABC[(((pos(c) + d) % 26) + 26) % 26];
  // Bước dịch từ chữ a sang chữ b, chọn đường ngắn nhất (-13..12)
  const stepOf = (a, b) => ((((pos(b) - pos(a)) % 26) + 39) % 26) - 13;

  // from → to là ví dụ của đề, ask là chữ cần mã hoá. Mọi chữ trong ví dụ phải dịch cùng một bước.
  function codeQ(o) {
    const d = stepOf(o.from[0], o.to[0]);
    const consistent = o.from.split('').every((c, i) => shift(c, d) === o.to[i]);
    const calc = consistent ? o.ask.split('').map(c => shift(c, d)).join('') : '?';
    const D = Math.abs(d), word = d > 0 ? 'đếm tiếp' : 'đếm lùi';
    const wraps = o.ask.split('').some(c => (d > 0 ? pos(c) + d > 25 : pos(c) + d < 0));
    return {
      title: o.title, src: o.src, type: 'word', answer: o.answer || calc, calc, hint: 2,
      wrong: [o.ask.split('').map(c => shift(c, -d)).join(''), o.ask.split('').map(c => shift(c, d + 1)).join('')],
      en: `It is known that "${o.from}" is "${o.to}". What is the password for "${o.ask}"?`,
      vi: `Biết rằng "${o.from}" được viết thành "${o.to}". Hỏi "${o.ask}" được viết thành gì?`,
      visual: box => {
        box.innerHTML = '<div class="v-code"><div></div><div></div><div class="v-abc"></div></div>';
        const [top, bot, abc] = box.firstChild.children;
        const s = V().seq(top, o.ask.split(''));
        const r = V().seq(bot, o.ask.split('').map(() => null));
        return { s, r, a: V().alpha(abc) };
      },
      steps: [
        { text: `🔍 So chữ đầu: ${o.from[0]} → ${o.to[0]} là ${word} <b>${D}</b> chữ.`, run: t => t.a.walk(o.from[0], d) },
        { text: `✅ Các chữ khác cũng vậy: ${o.from.split('').map((c, i) => `${c} → ${o.to[i]}`).join(', ')}.` },
        { text: `🔁 Quy luật: mỗi chữ ${word} ${D} chữ.${wraps ? (d > 0 ? ' Hết Z thì quay lại A.' : ' Lùi quá A thì quay về Z.') : ''}` },
        { text: `✏️ ${o.ask}: ${o.ask.split('').map(c => `${c} → <b>${shift(c, d)}</b>`).join(', ')}`,
          run: t => o.ask.split('').forEach((c, i) => setTimeout(() => t.r.fill(i, shift(c, d)), i * 300)) },
        { text: `🎉 Đáp án: <b>${calc}</b>` },
      ],
    };
  }

  const WORDS = ['CAT', 'DOG', 'SUN', 'BEE', 'PIG', 'HAT', 'BOX', 'CUP', 'RED', 'MAP'];
  function gen() {
    const d = pick([1, 2, 3, -1, -2]), from = pick(WORDS);
    let ask = pick(WORDS);
    while (ask === from) ask = pick(WORDS);
    return codeQ({ from, to: from.split('').map(c => shift(c, d)).join(''), ask });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'ma-ma', part: 'A', icon: '🔐', title: 'Giải mật mã', sub: 'Mỗi chữ dịch đi mấy bước?',
    intro: 'Mật mã là mỗi chữ cái được đổi thành chữ khác, cách nó cùng một số bước. Mình làm thám tử nhé!',
    words: [
      { en: 'Password', vi: 'Mật khẩu, mật mã', icon: '🔐' },
      { en: 'Code', vi: 'Mã', icon: '🧩' },
      { en: 'It is known that', vi: 'Biết rằng', icon: '💡' },
      { en: 'Letter', vi: 'Chữ cái', icon: '🔤' },
      { en: 'Alphabet', vi: 'Bảng chữ cái', icon: '🔠' },
      { en: 'Word', vi: 'Từ', icon: '📝' },
    ],
    tips: [
      '🔍 So chữ đầu tiên của 2 từ: đếm xem cách nhau mấy chữ, đếm tiếp hay đếm lùi.',
      '✅ Thử thêm 1–2 chữ nữa cho chắc.',
      '✏️ Đổi từng chữ của từ mới theo đúng quy luật đó.',
      '🔄 Bảng chữ cái là vòng tròn: sau Z là A, trước A là Z.',
    ],
    examples: [
      codeQ({ title: 'Ví dụ 1 · Đếm tiếp 1 chữ', from: 'ONE', to: 'POF', ask: 'TWO' }),
      codeQ({ title: 'Ví dụ 2 · Đếm tiếp 2 chữ', from: 'CUT', to: 'EWV', ask: 'HUG' }),
      codeQ({ title: 'Ví dụ 3 · Đếm lùi, quay vòng', from: 'YEN', to: 'XDM', ask: 'HONG' }),
    ],
    gen,
    test: [
      codeQ({ src: 'Đề cương TIMO', from: 'MATH', to: 'OCVJ', ask: 'HKIMO', answer: 'JMKOQ' }),
      codeQ({ src: 'Đề cương TIMO', from: 'MON', to: 'KML', ask: 'LOVE', answer: 'JMTC' }),
      codeQ({ src: 'Đề cương TIMO', from: 'CHAU', to: 'AFYS', ask: 'YEN', answer: 'WCL' }),
      codeQ({ src: 'Đề cương TIMO', from: 'BLACK', to: 'AKZBJ', ask: 'GRAY', answer: 'FQZX' }),
      codeQ({ src: 'Đề cương TIMO', from: 'DUC', to: 'ARZ', ask: 'CHAU', answer: 'ZEXR' }),
      codeQ({ src: 'Đề cương TIMO', from: 'SAY', to: 'PXV', ask: 'SAID', answer: 'PXFA' }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
