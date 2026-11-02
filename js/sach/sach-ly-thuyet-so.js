/* Bộ đề sách – Chủ đề 3: Lý thuyết số (Number theory) */
(function (root) {
  'use strict';
  const V = () => root.TV.vis;
  const ex = n => `Exercise ${n}`;
  const done = (q, steps, ans) => ({ ...q, steps: steps.map(s => (typeof s === 'string' ? { text: s } : s)).concat({ text: `🎉 Đáp án: <b>${ans}</b>` }) });

  // ---------- Bài 1: Số lẻ và số chẵn ----------
  const oddEven = n => (n % 2 ? 'odd' : 'even');
  const oeWord = n => (n % 2 ? 'lẻ (odd)' : 'chẵn (even)');
  // Thẻ số; markOE tô xanh các số chẵn, tô cam các số lẻ
  const chipsOE = nums => box => V().chips(box, nums.map(String));
  const idxWhere = (nums, f) => nums.map((n, i) => (f(n) ? i : -1)).filter(i => i >= 0);
  const markOE = nums => t => { t.mark(idxWhere(nums, n => n % 2 === 0), 'even'); t.mark(idxWhere(nums, n => n % 2 === 1), 'odd'); };
  const from5to17 = Array.from({ length: 13 }, (_, i) => i + 5);
  const list6 = [2, 7, 75, 91, 72, 68, 38, 16, 201];

  const L1 = [
    done({ tag: ex(1), type: 'num', answer: 8, hint: 1,
      en: 'What is the largest 1-digit even number?', vi: 'Số chẵn lớn nhất có 1 chữ số là số nào?' },
    ['💡 Các số chẵn có 1 chữ số: 0, 2, 4, 6, 8.', '👉 Số lớn nhất trong đó là <b>8</b>.'], 8),
    done({ tag: ex(2), type: 'num', answer: 11, hint: 1,
      en: 'What is the smallest 2-digit odd number?', vi: 'Số lẻ nhỏ nhất có 2 chữ số là số nào?' },
    ['💡 Số nhỏ nhất có 2 chữ số là 10, nhưng 10 là số chẵn.', '👉 Số liền sau 10 là <b>11</b>, tận cùng là 1 nên là số lẻ.'], 11),
    done({ tag: ex(3), type: 'oddeven', answer: 'odd', hint: 1,
      en: 'Is 2589341 odd or even?', vi: 'Số 2589341 là lẻ hay chẵn?' },
    ['💡 Chỉ cần nhìn chữ số tận cùng (hàng đơn vị).', '👉 2589341 tận cùng là <b>1</b> nên là số <b>lẻ</b>.'], 'Lẻ (odd)'),
    done({ tag: ex(4), type: 'num', answer: 999, hint: 1,
      en: 'What is the largest 3-digit odd number?', vi: 'Số lẻ lớn nhất có 3 chữ số là số nào?' },
    ['💡 Số lớn nhất có 3 chữ số là 999.', '👉 999 tận cùng là 9 nên là số lẻ → chính là <b>999</b>.'], 999),
    done({ tag: ex(5), type: 'num', answer: 6, hint: 1,
      en: 'How many even numbers from 5 to 17 are there?', vi: 'Hỏi có bao nhiêu số chẵn tính từ 5 đến 17?',
      visual: chipsOE(from5to17) },
    [{ text: '🔍 Các số từ 5 đến 17, tô xanh các số chẵn.', run: t => t.mark(idxWhere(from5to17, n => n % 2 === 0), 'even') },
      '👉 Số chẵn: 6, 8, 10, 12, 14, 16 → có <b>6</b> số.'], 6),
    done({ tag: ex(6), type: 'num', answer: 4, hint: 1,
      en: `How many odd numbers among the following numbers are there? ${list6.join(', ')}`,
      vi: `Hỏi có bao nhiêu số lẻ trong các số sau đây? ${list6.join(', ')}`,
      visual: chipsOE(list6) },
    [{ text: '🔍 Nhìn chữ số tận cùng: tận cùng 1, 3, 5, 7, 9 là số lẻ (tô cam).', run: markOE(list6) },
      '👉 Số lẻ: 7, 75, 91, 201 → có <b>4</b> số.'], 4),
    done({ tag: ex(7), type: 'oddeven', answer: oddEven(3 + 5 + 6), hint: 1,
      en: 'Tom has 3 candies, Mary has 5 candies and John has 6 candies. Determine whether the sum of their candies is odd or even.',
      vi: 'Tom có 3 cái kẹo, Mary có 5 cái kẹo, John có 6 cái kẹo. Hỏi tổng số kẹo của 3 bạn là số lẻ hay chẵn?',
      visual: box => V().pairs(box, 14, true) },
    ['🧮 Tổng số kẹo: 3 + 5 + 6 = <b>14</b>.', { text: `👉 14 tận cùng là 4 nên là số <b>${oeWord(14)}</b>.`, run: t => t.show() }], 'Chẵn (even)'),
    done({ tag: ex(8), type: 'oddeven', answer: oddEven(5 + 8 + 3), hint: 1,
      en: 'Amy has 5 cookies, Tony has 8 cookies and Cindy has 3 cookies. Determine whether the total number of cookies is odd or even.',
      vi: 'Amy có 5 cái bánh quy, Tony có 8 cái bánh quy và Cindy có 3 cái bánh quy. Hỏi tổng số bánh của ba bạn là số lẻ hay số chẵn?',
      visual: box => V().pairs(box, 16, true) },
    ['🧮 Tổng số bánh: 5 + 8 + 3 = <b>16</b>.', { text: `👉 16 tận cùng là 6 nên là số <b>${oeWord(16)}</b>.`, run: t => t.show() }], 'Chẵn (even)'),
  ];

  // ---------- Bài 2: Sắp xếp các số theo thứ tự ----------
  const up = a => a.slice().sort((x, y) => x - y);
  const down = a => a.slice().sort((x, y) => y - x);
  // Câu hỏi số đứng thứ k (k bắt đầu từ 1) khi xếp tăng (up) hoặc giảm (down)
  function rankQ(o) {
    const sorted = o.dir === 'up' ? up(o.nums) : down(o.nums), calc = sorted[o.k - 1];
    const word = o.dir === 'up' ? 'từ bé đến lớn' : 'từ lớn đến bé';
    return done({
      tag: ex(o.n), type: 'num', answer: o.answer, calc, hint: 1, en: o.en, vi: o.vi,
      visual: box => V().chips(box, o.nums.map(String)),
    }, [
      `📶 Xếp ${word}: ${sorted.join(', ')}.`,
      { text: `👉 Số đứng thứ ${o.k} là <b>${calc}</b>.`, run: t => t.mark([o.nums.indexOf(calc)], 'pick') },
    ], o.answer);
  }
  function orderQ(o) {
    const sorted = o.dir === 'up' ? up(o.nums) : down(o.nums), calc = sorted.join(',');
    return done({
      tag: ex(o.n), type: 'order', nums: o.nums, answer: o.answer, calc, hint: 1, en: o.en, vi: o.vi,
    }, [
      '💡 Chia các số theo số chữ số: số có ít chữ số thì nhỏ hơn. Cùng số chữ số thì so từng hàng từ trái sang phải.',
      `📶 Xếp ${o.dir === 'up' ? 'từ bé đến lớn' : 'từ lớn đến bé'}: <b>${sorted.join(', ')}</b>`,
    ], sorted.join(', '));
  }
  const A2 = [1, 9, 17, 5, 12, 3, 22], A3 = [19, 5, 13, 63, 7, 9, 50];
  const L2 = [
    rankQ({ n: 1, answer: 50, dir: 'down', k: 4, nums: [23, 91, 73, 39, 46, 82, 50],
      en: 'Arrange these numbers in descending order to find the 4th largest number: 23, 91, 73, 39, 46, 82, 50',
      vi: 'Sắp xếp các số sau từ lớn đến nhỏ để tìm số lớn thứ tư: 23, 91, 73, 39, 46, 82, 50' }),
    orderQ({ n: '2a', answer: '1,3,5,9,12,17,22', dir: 'up', nums: A2,
      en: `Arrange the numbers from the smallest to the largest: ${A2.join(', ')}`,
      vi: `Sắp xếp các số đã cho từ nhỏ nhất đến lớn nhất: ${A2.join(', ')}` }),
    rankQ({ n: '2b', answer: 1, dir: 'up', k: 1, nums: A2,
      en: `Find the smallest number: ${A2.join(', ')}`, vi: `Tìm số nhỏ nhất: ${A2.join(', ')}` }),
    rankQ({ n: '2c', answer: 5, dir: 'up', k: 3, nums: A2,
      en: `Find the 3rd smallest number: ${A2.join(', ')}`, vi: `Tìm số nhỏ thứ ba: ${A2.join(', ')}` }),
    orderQ({ n: '3a', answer: '63,50,19,13,9,7,5', dir: 'down', nums: A3,
      en: `Arrange the numbers from the largest to the smallest: ${A3.join(', ')}`,
      vi: `Sắp xếp các số đã cho từ lớn nhất đến nhỏ nhất: ${A3.join(', ')}` }),
    rankQ({ n: '3b', answer: 5, dir: 'up', k: 1, nums: A3,
      en: `Find the smallest number: ${A3.join(', ')}`, vi: `Tìm số nhỏ nhất: ${A3.join(', ')}` }),
    rankQ({ n: '3c', answer: 13, dir: 'down', k: 4, nums: A3,
      en: `Find the 4th largest number: ${A3.join(', ')}`, vi: `Tìm số lớn thứ tư: ${A3.join(', ')}` }),
    rankQ({ n: 4, answer: 10, dir: 'down', k: 2, nums: [7, 12, 9, 3, 10, 6],
      en: 'Arrange numbers below in descending order to find the second largest number: 7, 12, 9, 3, 10, 6',
      vi: 'Sắp xếp các số dưới đây theo thứ tự từ lớn đến bé để tìm ra số lớn thứ hai: 7, 12, 9, 3, 10, 6' }),
  ];

  // ---------- Bài 3: Chia đều đồ vật ----------
  // Chia đều total đồ vật vào parts phần
  function shareQ(o) {
    const each = o.total / o.parts;
    return done({
      tag: ex(o.n), type: 'num', answer: o.answer, calc: each, hint: 1, en: o.en, vi: o.vi,
      visual: box => V().groups(box, [{ icon: o.icon, n: o.total, label: `${o.total} ${o.thing}` }]),
    }, [
      `💡 Chia đều ${o.total} ${o.thing} thành ${o.parts} phần bằng nhau: mỗi lần chia cho mỗi phần 1 ${o.thing} đến khi hết.`,
      { text: `🧺 Mỗi phần được <b>${each}</b> ${o.thing} (${Array(o.parts).fill(each).join(' + ')} = ${o.total}).`,
        run: t => t.add(Array.from({ length: o.parts }, (_, i) => ({ icon: o.icon, n: each, label: `${o.part} ${i + 1}` })), 'v-pop') },
    ], o.answer);
  }
  // Hai bên có a và b đồ vật, chuyển từ bên nhiều sang bên ít để bằng nhau
  function moveQ(o) {
    const total = o.a + o.b, half = total / 2, calc = o.a - half;
    return done({
      tag: ex(o.n), type: 'num', answer: o.answer, calc, hint: 1, en: o.en, vi: o.vi,
      visual: box => V().groups(box, [{ icon: o.icon, n: o.a, label: o.left }, { icon: o.icon, n: o.b, label: o.right }]),
    }, [
      `🔢 ${o.left}: ${o.a}, ${o.right}: ${o.b}. Tổng cộng: ${o.a} + ${o.b} = <b>${total}</b>.`,
      `⚖️ Khi bằng nhau, mỗi bên có: ${total} chia đôi = <b>${half}</b> (vì ${half} + ${half} = ${total}).`,
      { text: `➡️ Cần chuyển: ${o.a} − ${half} = <b>${calc}</b>.`, run: t => t.add([{ icon: o.icon, n: half, label: 'mỗi bên sau khi chuyển' }], 'v-pop') },
    ], o.answer);
  }
  const L3 = [
    shareQ({ n: 1, answer: 2, total: 6, parts: 3, icon: '🥭', thing: 'quả xoài', part: 'Rổ',
      en: 'Divide 6 mangoes equally into 3 baskets, how many mangoes are there in each basket?',
      vi: 'Chia đều 6 quả xoài vào 3 chiếc rổ, hỏi có bao nhiêu quả xoài trong mỗi rổ?' }),
    shareQ({ n: 2, answer: 4, total: 12, parts: 3, icon: '🍬', thing: 'chiếc kẹo', part: 'Nhóm',
      en: 'Separate 12 candies into three equal groups, how many candies are there in each group?',
      vi: 'Chia đều 12 chiếc kẹo vào 3 nhóm, hỏi có bao nhiêu chiếc kẹo trong mỗi nhóm?' }),
    moveQ({ n: 3, answer: 5, a: 14, b: 4, icon: '🦘', left: 'Bên trái', right: 'Bên phải',
      en: 'How many kangaroos must be moved from the left-side to the right-side to get the same number of kangaroos in both sides?',
      vi: 'Phải chuyển bao nhiêu con chuột túi từ bên trái sang bên phải để số chuột túi ở cả hai bên bằng nhau?' }),
    shareQ({ n: 4, answer: 5, total: 15, parts: 3, icon: '⚪', thing: 'hình tròn', part: 'Nhóm',
      en: 'Separate 15 circles into 3 equal groups, how many circles are there in each group?',
      vi: 'Chia 15 hình tròn thành 3 nhóm bằng nhau, hỏi có bao nhiêu hình tròn trong mỗi nhóm?' }),
    shareQ({ n: 5, answer: 3, total: 18, parts: 6, icon: '🖊️', thing: 'chiếc bút', part: 'Hộp',
      en: 'Divide equally 18 pens into 6 boxes, how many pens are there in each box?',
      vi: 'Chia đều 18 chiếc bút vào 6 hộp, hỏi mỗi hộp có bao nhiêu chiếc bút?' }),
    shareQ({ n: 6, answer: 4, total: 20, parts: 5, icon: '🪙', thing: 'đồng xu', part: 'Phần',
      en: 'Separate 20 coins into 5 equal parts, how many coins are there in each part?',
      vi: 'Chia 20 đồng xu thành 5 phần bằng nhau, hỏi mỗi phần có bao nhiêu đồng xu?' }),
    moveQ({ n: 7, answer: 2, a: 16, b: 12, icon: '🐰', left: 'Vườn trái', right: 'Vườn phải',
      en: 'How many rabbits should be moved from left to right to get the same number of rabbits in both gardens?',
      vi: 'Cần chuyển bao nhiêu con thỏ từ bên trái sang bên phải để hai khu vườn có số thỏ bằng nhau?' }),
    moveQ({ n: 8, answer: 4, a: 15, b: 7, icon: '✏️', left: 'Alice', right: 'Peter',
      en: 'Alice has 15 pencils and Peter has 7 pencils. How many pencils does Alice have to give Peter so that 2 friends have the same number of pencils?',
      vi: 'Alice có 15 chiếc bút chì và Peter có 7 chiếc bút chì. Hỏi Alice cần cho Peter mấy chiếc bút chì để hai bạn có số bút chì bằng nhau?' }),
    moveQ({ n: 9, answer: 4, a: 17, b: 9, icon: '🍎', left: 'Amy', right: 'John',
      en: 'Amy has 17 apples and John has 9 apples. How many apples does Amy have to give to John to make them have the same number of apples?',
      vi: 'Amy có 17 quả táo, John có 9 quả táo. Hỏi Amy cần cho John bao nhiêu quả táo để hai người có số táo bằng nhau?' }),
  ];

  (root.TVBook = root.TVBook || []).push(
    { id: 'sach-3-1', part: 'C', icon: '⚖️', lesson: 'Lesson 1', title: 'Số lẻ và số chẵn', en: 'Odd and even numbers', questions: L1 },
    { id: 'sach-3-2', part: 'C', icon: '📶', lesson: 'Lesson 2', title: 'Sắp xếp các số theo thứ tự', en: 'Arranging numbers in order', questions: L2 },
    { id: 'sach-3-3', part: 'C', icon: '🧺', lesson: 'Lesson 3', title: 'Chia đều đồ vật', en: 'Mathematical leveling', questions: L3 },
  );
})(typeof window !== 'undefined' ? window : globalThis);
