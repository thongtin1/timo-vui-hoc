/* Chủ đề: Quy luật chữ cái (Logical thinking) */
(function (root) {
  'use strict';
  const { rand, pick } = root.TVData;
  const V = () => root.TV.vis;
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const pos = c => ABC.indexOf(c);

  // Bước nhảy đều của một dãy chữ (bỏ qua ô trống). Không đều thì trả về null.
  function stepOf(list) {
    let d = null;
    for (let i = 0; i + 1 < list.length; i++) {
      if (list[i] === '_' || list[i + 1] === '_') continue;
      const s = pos(list[i + 1]) - pos(list[i]);
      if (d == null) d = s;
      else if (d !== s) return null;
    }
    return d;
  }

  // seq: 'B E H K N _ T' – dấu _ là chỗ trống. Máy tự nhận ra dãy đều hay 2 dãy xen kẽ.
  function letterQ(o) {
    const items = o.seq.split(' '), b = items.indexOf('_');
    let mix = false, d = stepOf(items), group = null;
    if (d == null) {
      mix = true;
      group = items.filter((_, i) => i % 2 === b % 2);
      d = stepOf(group);
    }
    const prevIdx = mix ? b - 2 : b - 1;
    const prev = items[prevIdx], calc = ABC[pos(prev) + d];
    const D = Math.abs(d), word = d > 0 ? 'đếm tiếp' : 'đếm lùi';
    const shown = items.map(c => (c === '_' ? null : c));
    const given = items.filter(c => c !== '_');
    const i0 = items.findIndex((c, i) => c !== '_' && items[i + 1] && items[i + 1] !== '_');

    const steps = mix ? [
      { text: '👀 Đây là 2 dãy nhỏ xen kẽ nhau: dãy <b class="g0-t">tím</b> và dãy <b class="g1-t">cam</b>.' },
      ...[0, 1].map(g => {
        const sub = items.filter((_, i) => i % 2 === g);
        const s = stepOf(sub);
        return { text: `${g ? '🟠 Dãy cam' : '🟣 Dãy tím'}: ${sub.map(c => (c === '_' ? '?' : c)).join(', ')} → mỗi lần ${s > 0 ? 'đếm tiếp' : 'đếm lùi'} <b>${Math.abs(s)}</b> chữ.` };
      }),
      { text: `🐸 Chỗ trống thuộc dãy ${b % 2 ? 'cam' : 'tím'}. Từ <b>${prev}</b> ${word} ${D} chữ → <b>${calc}</b>.`, run: t => { t.a.count(prev, calc); t.s.fill(b, calc); } },
    ] : [
      { text: '🔤 Tìm các chữ trong bảng chữ cái.', run: t => t.a.mark(given) },
      { text: `🔍 Từ ${items[i0]} đến ${items[i0 + 1]}: ${word} <b>${D}</b> chữ. Lần nào cũng ${word} ${D} chữ.`,
        run: t => t.s.hops(items.slice(1).map(() => `${d > 0 ? '+' : '−'}${D}`)) },
      { text: `🐸 Từ <b>${prev}</b> ${word} ${D} chữ → <b>${calc}</b>.`, run: t => { t.a.count(prev, calc); t.s.fill(b, calc); } },
    ];
    steps.push({ text: `🎉 Đáp án: chữ <b>${calc}</b>` });

    return {
      title: o.title, src: o.src, type: 'letter', answer: o.answer || calc, calc, hint: mix ? 3 : 2,
      en: `According to the pattern below, what is the English letter in the space provided? ${o.seq.replace('_', '___').split(' ').join(', ')}`,
      vi: `Theo quy luật, chữ cái tiếng Anh cần điền vào chỗ trống là chữ gì? ${o.seq.replace('_', '___').split(' ').join(', ')}`,
      wrong: [ABC[pos(prev) - d], ABC[pos(calc) + 1], ABC[pos(calc) - 1]],
      visual: box => {
        box.innerHTML = '<div class="v-seq"></div><div class="v-abc"></div>';
        const s = V().seq(box.firstChild, shown, { group: mix ? i => i % 2 : null });
        const a = V().alpha(box.lastChild);
        s.mark([b], 'target');
        return { s, a };
      },
      steps,
    };
  }

  function gen() {
    const d = pick([1, 2, 3, -1, -2]), len = 5;
    const start = d > 0 ? rand(0, 25 - d * len) : rand(-d * len, 25);
    const items = Array.from({ length: len }, (_, i) => ABC[start + d * i]);
    items[Math.random() < 0.6 ? len - 1 : rand(2, len - 2)] = '_';
    return letterQ({ seq: items.join(' ') });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'chu-cai', part: 'A', icon: '🔤', title: 'Quy luật chữ cái', sub: 'Đếm chữ trong bảng ABC',
    intro: 'Các chữ cái cũng xếp hàng theo quy luật, giống dãy số vậy. Mình dùng bảng chữ cái để đếm nhé!',
    words: [
      { en: 'Pattern', vi: 'Quy luật', icon: '🧩' },
      { en: 'English letter', vi: 'Chữ cái tiếng Anh', icon: '🔤' },
      { en: 'Alphabet', vi: 'Bảng chữ cái', icon: '🔠' },
      { en: 'Space provided', vi: 'Chỗ trống', icon: '⬜' },
      { en: 'Fill in', vi: 'Điền vào', icon: '✏️' },
      { en: 'Next', vi: 'Tiếp theo', icon: '➡️' },
    ],
    tips: [
      '🔤 Nhìn bảng chữ cái, tìm từng chữ của đề.',
      '🔍 Đếm từ chữ này sang chữ kia xem cách nhau mấy chữ. Đó là bước nhảy.',
      '👀 Nếu bước nhảy lúc thế này lúc thế khác, thử tách thành 2 dãy xen kẽ: chữ thứ 1, 3, 5… và chữ thứ 2, 4, 6…',
    ],
    play: {
      title: '🔠 Bảng chữ cái: bấm để nghe đọc',
      mount(el) { V().alpha(el); },
    },
    examples: [
      letterQ({ title: 'Ví dụ 1 · Đếm tiếp 1 chữ', seq: 'C D E F _' }),
      letterQ({ title: 'Ví dụ 2 · Đếm tiếp 2 chữ', seq: 'B D F H _' }),
      letterQ({ title: 'Ví dụ 3 · Hai dãy xen kẽ', seq: 'A K B L C _' }),
    ],
    gen,
    test: [
      letterQ({ src: 'Đề cương TIMO', seq: 'F G H I _ K', answer: 'J' }),
      letterQ({ src: 'Giống câu 2 – Mock 2025', seq: 'A C E G _ K', answer: 'I' }),
      letterQ({ src: 'Đề cương TIMO', seq: 'A D G J M _', answer: 'P' }),
      letterQ({ src: 'Đề cương TIMO', seq: 'Z X V T _ P N', answer: 'R' }),
      // Đề gốc in chữ cuối là S, nhưng theo quy luật +3 thì chữ cuối phải là T
      letterQ({ src: 'Đề 1 · Câu 19', seq: 'B E H K N _ T', answer: 'Q' }),
      letterQ({ src: 'Đề cương TIMO', seq: 'L O M P N _', answer: 'Q' }),
      letterQ({ src: 'Đề 1 · Câu 20', seq: 'D K E L F M G _ H', answer: 'N' }),
      letterQ({ src: 'Đề cương TIMO', seq: 'P Q O S N U M _ L', answer: 'W' }),
      letterQ({ src: 'VQG 2024–2025 · Câu 2', seq: 'D A G C J E M G _', answer: 'P' }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
