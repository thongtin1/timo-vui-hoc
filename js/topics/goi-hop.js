/* Chủ đề: Gói và hộp – nhân, chia đều, "ít nhất", mua kèm được tặng (Number theory) */
(function (root) {
  'use strict';
  const { rand, pick } = root.TVData;
  const V = () => root.TV.vis;
  const skip = (per, k) => Array.from({ length: k }, (_, i) => per * (i + 1)).join(', ');

  // k hộp, mỗi hộp per đồ vật → có tất cả bao nhiêu?
  function mulQ(o) {
    const { k, per, icon, thing, box } = o, calc = k * per;
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 1,
      en: o.en || `A ${box.en} has ${per} ${thing.en}. How many ${thing.en} are there in ${k} ${box.en}s?`,
      vi: o.vi || `Một ${box.vi} có ${per} ${thing.vi}. Hỏi ${k} ${box.vi} như vậy có bao nhiêu ${thing.vi}?`,
      wrong: [k + per, calc + per, calc - per],
      visual: b => V().groups(b, Array.from({ length: k }, (_, i) => ({ icon, n: per, label: `${box.vi} ${i + 1}` }))),
      steps: [
        { text: `${icon} Mỗi ${box.vi} có ${per}. Có ${k} ${box.vi} → cộng ${per} lặp lại ${k} lần.` },
        { text: `🔢 Đếm thêm ${per}: ${skip(per, k)}.`, run: t => t.mark(Array.from({ length: k }, (_, i) => i), 'hl') },
        { text: `🎉 Đáp án: <b>${calc}</b> ${thing.vi}` },
      ],
    };
  }

  // Cần need đồ vật (có thể là tổng 2 số), mỗi hộp per → ít nhất mấy hộp?
  function atLeastQ(o) {
    const { needs, per, icon, thing, box } = o, need = needs.reduce((a, b) => a + b, 0), calc = Math.ceil(need / per);
    return {
      title: o.title, src: o.src, en: o.en, vi: o.vi, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2,
      wrong: [Math.floor(need / per), calc + 1],
      visual: b => V().groups(b, []),
      steps: [
        ...(needs.length > 1 ? [{ text: `➕ Cần tất cả: ${needs.join(' + ')} = <b>${need}</b> ${thing.vi}.` }] : []),
        { text: `🔢 Đếm thêm ${per} (mỗi ${box.vi}): ${skip(per, calc)}.`, run: t => t.add(Array.from({ length: calc }, (_, i) => ({ icon, n: per, label: `${box.vi} ${i + 1}: ${per * (i + 1)}` })), 'v-pop') },
        ...(calc > 1 ? [{ text: `🤔 ${calc - 1} ${box.vi} có ${per * (calc - 1)} ${thing.vi}, chưa đủ ${need}.`, run: t => t.mark(Array.from({ length: calc - 1 }, (_, i) => i), 'lack') }] : []),
        { text: `✅ ${calc} ${box.vi} có ${per * calc} ${thing.vi}, đủ rồi!`, run: t => t.mark([calc - 1], 'hl') },
        { text: `🎉 Đáp án: ít nhất <b>${calc}</b> ${box.vi}` },
      ],
    };
  }

  // Gói lớn có L, gói nhỏ có S. Mỗi lần mua 1 gói lớn + perS gói nhỏ (mặc định 1) được tặng thêm extra.
  function promoQ(o) {
    const { L, S, nl, ns, extra, icon } = o, perS = o.perS || 1, pairs = Math.min(nl, Math.floor(ns / perS)), calc = nl * L + ns * S + pairs * extra;
    return {
      title: o.title, src: o.src, en: o.en, vi: o.vi, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2,
      wrong: [nl * L + ns * S, calc + extra, nl * L + ns * S + extra],
      visual: b => V().groups(b, [
        ...Array.from({ length: nl }, () => ({ icon, n: L, label: 'gói lớn', cls: 'big' })),
        ...Array.from({ length: ns }, () => ({ icon, n: S, label: 'gói nhỏ' })),
      ]),
      steps: [
        { text: `📦 ${nl} gói lớn: đếm thêm ${L}: ${skip(L, nl)} → <b>${nl * L}</b>.`, run: t => t.mark(Array.from({ length: nl }, (_, i) => i), 'hl') },
        { text: `📦 ${ns} gói nhỏ: đếm thêm ${S}: ${skip(S, ns)} → <b>${ns * S}</b>.` },
        { text: perS === 1
          ? `🎁 Ghép 1 gói lớn với 1 gói nhỏ thành 1 cặp: được ${pairs} cặp (vì chỉ có ${Math.min(nl, ns)} gói ${nl <= ns ? 'lớn' : 'nhỏ'}). Mỗi cặp tặng ${extra} → tặng ${pairs * extra}.`
          : `🎁 Mỗi bộ gồm 1 gói lớn và ${perS} gói nhỏ. ${ns} gói nhỏ chia được ${Math.floor(ns / perS)} bộ, có đủ gói lớn → được ${pairs} bộ. Mỗi bộ tặng ${extra} → tặng ${pairs * extra}.`,
          run: t => t.add([{ icon, n: pairs * extra, label: 'quà tặng 🎁' }], 'gift v-pop') },
        { text: `➕ Tất cả: ${nl * L} + ${ns * S} + ${pairs * extra} = <b>${calc}</b>` },
        { text: `🎉 Đáp án: <b>${calc}</b>` },
      ],
    };
  }

  // Chia đều total đồ vật cho k bạn → mỗi bạn mấy cái?
  function shareQ(o) {
    const { total, k, icon, thing } = o, calc = total / k;
    return {
      title: o.title, src: o.src, type: 'num', answer: o.answer != null ? o.answer : calc, calc, hint: 2,
      en: `${total} ${thing.en} are shared equally among ${k} children. How many ${thing.en} does each child get?`,
      vi: `Chia đều ${total} ${thing.vi} cho ${k} bạn. Hỏi mỗi bạn được mấy ${thing.vi}?`,
      wrong: [total - k, calc + 1, calc - 1],
      visual: b => V().groups(b, Array.from({ length: k }, (_, i) => ({ icon: '🧒', n: 1, label: `bạn ${i + 1}` }))),
      steps: [
        { text: `🤲 Chia lần lượt: mỗi lượt mỗi bạn nhận 1 ${thing.vi}, mỗi lượt hết ${k} ${thing.vi}.` },
        { text: `🔢 Đếm thêm ${k} cho tới ${total}: ${skip(k, calc)} → chia được <b>${calc}</b> lượt.`,
          run: t => Array.from({ length: k }, (_, i) => t.label(i, `bạn ${i + 1}: ${icon.repeat(calc)}`)) },
        { text: `✅ Thử lại: ${Array(k).fill(calc).join(' + ')} = ${total}. Đúng rồi!` },
        { text: `🎉 Đáp án: mỗi bạn <b>${calc}</b> ${thing.vi}` },
      ],
    };
  }

  const EGG = { en: 'eggs', vi: 'quả trứng' }, CANDY = { en: 'candies', vi: 'cái kẹo' };
  const BOXES = [
    { icon: '🥚', thing: EGG, box: { en: 'box', vi: 'hộp' } },
    { icon: '🍬', thing: CANDY, box: { en: 'bag', vi: 'túi' } },
    { icon: '✏️', thing: { en: 'pencils', vi: 'cây bút chì' }, box: { en: 'box', vi: 'hộp' } },
    { icon: '🍎', thing: { en: 'apples', vi: 'quả táo' }, box: { en: 'basket', vi: 'giỏ' } },
  ];
  function gen() {
    const t = pick(BOXES), kind = rand(1, 3);
    if (kind === 1) return mulQ({ ...t, k: rand(2, 4), per: rand(2, 8) });
    if (kind === 2) {
      const per = rand(4, 8), need = rand(per + 1, per * 4);
      return atLeastQ({ ...t, needs: [need], per,
        en: `Each ${t.box.en} has ${per} ${t.thing.en}. Mary needs ${need} ${t.thing.en}. At least how many ${t.box.en}s does she need to buy?`,
        vi: `Mỗi ${t.box.vi} có ${per} ${t.thing.vi}. Mai cần ${need} ${t.thing.vi}. Hỏi Mai cần mua ít nhất mấy ${t.box.vi}?` });
    }
    const k = rand(2, 4), each = rand(2, 5);
    return shareQ({ total: k * each, k, icon: t.icon, thing: t.thing });
  }

  (root.TVTopics = root.TVTopics || []).push({
    id: 'goi-hop', part: 'C', icon: '📦', title: 'Gói và hộp', sub: 'Đếm thêm, chia đều, quà tặng',
    intro: 'Hộp trứng, túi kẹo, gói bút… Mình đếm thêm từng hộp, chia đều cho các bạn, và nhớ cộng cả quà tặng nhé!',
    words: [
      { en: 'Each', vi: 'Mỗi', icon: '☝️' },
      { en: 'Box', vi: 'Hộp', icon: '📦' },
      { en: 'Package', vi: 'Gói, túi', icon: '🛍️' },
      { en: 'Large / Small', vi: 'Lớn / Nhỏ', icon: '↕️' },
      { en: 'At least', vi: 'Ít nhất', icon: '🔽' },
      { en: 'Extra / Free', vi: 'Thêm / Miễn phí', icon: '🎁' },
      { en: 'In total', vi: 'Tất cả', icon: '🧮' },
      { en: 'Shared equally', vi: 'Chia đều', icon: '🤲' },
    ],
    tips: [
      '🔢 Nhiều hộp giống nhau: đếm thêm từng hộp (8, 16, 24…).',
      '🔽 "Ít nhất mấy hộp": đếm thêm cho tới khi đủ hoặc vượt số cần.',
      '🎁 Quà tặng: đếm xem ghép được mấy cặp (1 lớn + 1 nhỏ), mỗi cặp được tặng thêm.',
      '🤲 Chia đều: mỗi lượt chia cho mỗi bạn 1 cái, đếm xem chia được mấy lượt.',
    ],
    examples: [
      mulQ({ title: 'Ví dụ 1 · Đếm thêm từng hộp', ...BOXES[0], k: 3, per: 4 }),
      atLeastQ({ title: 'Ví dụ 2 · Ít nhất mấy hộp?', ...BOXES[0], needs: [10], per: 4,
        en: 'Each box has 4 eggs. Mom needs 10 eggs. At least how many boxes does she need to buy?',
        vi: 'Mỗi hộp có 4 quả trứng. Mẹ cần 10 quả trứng. Hỏi mẹ cần mua ít nhất mấy hộp?' }),
      shareQ({ title: 'Ví dụ 3 · Chia đều', total: 12, k: 3, icon: '🍬', thing: CANDY }),
    ],
    gen,
    test: [
      mulQ({ src: 'Đề 1 · Câu 24', icon: '😷', k: 3, per: 8, answer: 24, thing: { en: 'masks', vi: 'chiếc khẩu trang' }, box: { en: 'box', vi: 'hộp' },
        vi: 'Một hộp khẩu trang có 8 chiếc. Hỏi 3 hộp khẩu trang có bao nhiêu chiếc?', en: 'A box has 8 masks. How many masks are there in 3 boxes?' }),
      atLeastQ({ src: 'VQG 2024–2025 · Câu 13', ...BOXES[0], needs: [20, 15], per: 8, answer: 5,
        en: 'Each box of eggs has 8 eggs. Mom asks Mary to buy 20 eggs. Her neighbor asks her to buy 15 eggs. At least how many boxes of eggs does Mary need to buy?',
        vi: 'Mỗi hộp trứng có 8 quả. Mẹ nhờ Mary mua 20 quả trứng. Hàng xóm nhờ Mary mua 15 quả. Hỏi Mary cần mua ít nhất mấy hộp trứng?' }),
      promoQ({ src: 'VQG 2024–2025 · Câu 14', icon: '🍬', L: 8, S: 3, nl: 3, ns: 6, extra: 1, answer: 45,
        en: 'A large package contains 8 candies. A small package contains 3 candies. Buying 1 large package and 1 small package together will get you 1 extra candy for free every time. If Peggy buys 3 large packages and 6 small packages, how many candies does she have in total?',
        vi: 'Gói lớn có 8 cái kẹo, gói nhỏ có 3 cái kẹo. Cứ mua 1 gói lớn cùng 1 gói nhỏ thì được tặng thêm 1 cái kẹo. Peggy mua 3 gói lớn và 6 gói nhỏ. Hỏi Peggy có tất cả bao nhiêu cái kẹo?' }),
      promoQ({ src: 'Mock 2025 · Câu 11', icon: '🥚', L: 8, S: 4, nl: 3, ns: 5, extra: 2, answer: 50,
        en: 'A large package contains 8 eggs. A small package contains 4 eggs. Buying both a large package and a small package will attach 2 extra eggs every time. If Mary buys 3 large and 5 small packages, how many eggs does she have?',
        vi: 'Gói lớn có 8 quả trứng, gói nhỏ có 4 quả. Cứ mua 1 gói lớn cùng 1 gói nhỏ thì được tặng thêm 2 quả. Mary mua 3 gói lớn và 5 gói nhỏ. Hỏi Mary có bao nhiêu quả trứng?' }),
      promoQ({ src: 'VQG 2025–2026 · Câu 14', icon: '🍪', L: 10, S: 5, nl: 4, ns: 4, perS: 2, extra: 3, answer: 66,
        en: 'A large package contains 10 cookies. A small package contains 5 cookies. Buying 1 large package and 2 small packages together will get you 3 extra cookies for free every time. If Peggy buys 4 large packages and 4 small packages, how many cookies does she get in total?',
        vi: 'Gói lớn có 10 cái bánh quy, gói nhỏ có 5 cái. Cứ mua 1 gói lớn cùng 2 gói nhỏ thì được tặng thêm 3 cái bánh. Peggy mua 4 gói lớn và 4 gói nhỏ. Hỏi Peggy có tất cả bao nhiêu cái bánh quy?' }),
      mulQ({ src: 'Đề cương TIMO', icon: '🛞', k: 4, per: 4, answer: 16, thing: { en: 'wheels', vi: 'bánh xe' }, box: { en: 'car', vi: 'ô tô' },
        en: 'A car has 4 wheels. How many wheels do 4 cars have?', vi: 'Một ô tô có 4 bánh xe. Hỏi 4 ô tô có bao nhiêu bánh xe?' }),
      shareQ({ src: 'Đề cương TIMO', total: 15, k: 3, icon: '🍬', thing: CANDY, answer: 5 }),
      atLeastQ({ src: 'Giống đề TIMO', ...BOXES[3], needs: [25], per: 6, answer: 5,
        en: 'Each basket has 6 apples. Tom needs 25 apples. At least how many baskets does he need?',
        vi: 'Mỗi giỏ có 6 quả táo. Tom cần 25 quả táo. Hỏi Tom cần ít nhất mấy giỏ táo?' }),
    ],
  });
})(typeof window !== 'undefined' ? window : globalThis);
