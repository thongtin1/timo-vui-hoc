/* Kiểm tra đáp án và lời giải của mọi chủ đề. Chạy: node test/check.js */
'use strict';
const fs = require('fs');
const path = require('path');

const D = require('../js/data.js');
globalThis.TVData = D;
const dir = path.join(__dirname, '../js/topics');
fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort().forEach(f => require(path.join(dir, f)));
const topics = globalThis.TVTopics || [];

let fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; console.log('  ✗ ' + msg); } }
const norm = v => String(v).trim().toUpperCase();
const textOf = s => (typeof s === 'string' ? s : s.text);
const TYPES = ['num', 'letter', 'oddeven', 'choice', 'word', 'signs', 'order'];

// Một câu hỏi hợp lệ: có đề, đáp án đúng kiểu, máy tự tính ra cùng đáp án, bước cuối có 🎉 và đáp án
function checkQ(q, where) {
  ok(TYPES.includes(q.type), `${where}: kiểu câu "${q.type}" không hợp lệ`);
  ok(q.vi && q.vi.length > 5, `${where}: thiếu đề tiếng Việt`);
  ok(q.answer != null && q.answer !== '', `${where}: thiếu đáp án`);
  if (q.calc !== undefined) ok(norm(q.calc) === norm(q.answer), `${where}: đáp án ghi tay ${q.answer} ≠ máy tính ${q.calc}`);
  if (q.type === 'num') ok(Number.isInteger(Number(q.answer)) && Number(q.answer) >= 0, `${where}: đáp án số phải là số tự nhiên (${q.answer})`);
  if (q.type === 'letter') ok(/^[A-Z]$/.test(q.answer), `${where}: đáp án chữ phải là 1 chữ in hoa (${q.answer})`);
  if (q.type === 'oddeven') ok(['even', 'odd'].includes(q.answer), `${where}: đáp án chẵn lẻ phải là even/odd`);
  if (q.type === 'word') ok(/^[A-Z]+$/.test(q.answer), `${where}: đáp án mật mã phải là chữ in hoa (${q.answer})`);
  if (q.type === 'signs') {
    ok(typeof q.check === 'function' && q.check(q.answer), `${where}: dấu ${q.answer} không ra đúng kết quả`);
    (q.wrong || []).forEach(w => ok(!q.check(w), `${where}: lựa chọn sai ${w} lại ra đúng kết quả`));
  }
  if (q.type === 'order') ok(Array.isArray(q.nums) && String(q.answer).split(',').map(Number).sort((a, b) => a - b).join() === q.nums.slice().sort((a, b) => a - b).join(), `${where}: đáp án sắp xếp phải dùng đủ các số đã cho`);
  if (q.type === 'choice') ok((q.choices || []).some(c => norm(c.value) === norm(q.answer)), `${where}: đáp án không có trong các lựa chọn`);
  ok(Array.isArray(q.steps) && q.steps.length >= 2, `${where}: cần ít nhất 2 bước giải`);
  const last = textOf(q.steps[q.steps.length - 1]) || '';
  ok(last.includes('🎉'), `${where}: bước cuối phải là đáp án 🎉`);
  if (['num', 'letter', 'word'].includes(q.type)) ok(last.includes(String(q.answer)), `${where}: bước cuối không nhắc đáp án ${q.answer}`);
  q.steps.forEach((s, i) => ok(typeof textOf(s) === 'string' && textOf(s).length > 3, `${where}: bước ${i + 1} trống`));
}

console.log(`📚 ${topics.length} chủ đề`);
const ids = new Set();
topics.forEach(t => {
  console.log(`• ${t.title} (${t.id}): ${t.test.length} câu bài tự làm, ${t.examples.length} ví dụ`);
  ok(!ids.has(t.id), `trùng mã chủ đề ${t.id}`);
  ids.add(t.id);
  ok(D.PARTS.some(p => p.id === t.part), `${t.id}: phần "${t.part}" không có`);
  ok(t.words.length >= 4, `${t.id}: cần ít nhất 4 từ vựng`);
  ok(t.test.length >= 5, `${t.id}: cần ít nhất 5 câu bài tự làm`);
  t.examples.forEach((q, i) => { ok(!!q.title, `${t.id} ví dụ ${i + 1}: thiếu tiêu đề`); checkQ(q, `${t.id} ví dụ ${i + 1}`); });
  t.test.forEach((q, i) => checkQ(q, `${t.id} câu ${i + 1}`));
  for (let k = 0; k < 500; k++) {
    const q = t.gen();
    checkQ(q, `${t.id} câu ngẫu nhiên #${k}`);
    if (fails > 20) break;
  }
});

// Bài 4 và Bài 5
D.TEST_DATE.forEach((q, i) => {
  const a = D.answerOf(q), steps = D.dateSteps(q);
  ok(steps[steps.length - 1].includes(D.DAYS[a].en), `Bài 4 câu ${i + 1}: lời giải không ra ${D.DAYS[a].en}`);
});
ok(D.answerOf(D.TEST_DATE[0]) === 0, 'Bài 4 câu 1 (Mock 2025 · Câu 3) phải ra thứ Hai');
D.TEST_DATE.forEach((q, i) => { if (q.expect) ok(D.DAYS[D.answerOf(q)].en === q.expect, `Bài 4 câu ${i + 1}: máy tính ra ${D.DAYS[D.answerOf(q)].en}, đáp án ghi tay ${q.expect}`); });
D.TEST_AGE.forEach((q, i) => checkQ(q, `Bài 5 câu ${i + 1}`));

// ---------- Bộ đề sách ----------
const sachDir = path.join(__dirname, '../js/sach');
fs.readdirSync(sachDir).filter(f => f.endsWith('.js')).sort().forEach(f => require(path.join(sachDir, f)));
const book = globalThis.TVBook || [], geo = globalThis.TVBookGeo;
const bookIds = new Set();
let bookN = 0;
console.log(`📘 Bộ đề sách: ${book.length} bài`);
book.forEach(L => {
  ok(!bookIds.has(L.id), `trùng mã bài sách ${L.id}`);
  bookIds.add(L.id);
  ok(D.PARTS.some(p => p.id === L.part), `${L.id}: phần "${L.part}" không có`);
  ok(L.questions.length >= 4, `${L.id}: cần ít nhất 4 câu`);
  bookN += L.questions.length;
  L.questions.forEach((q, i) => {
    const where = `${L.id} câu ${i + 1}`;
    checkQ(q, where);
    // Tam giác: các nhóm trong lời giải phải đúng bằng các tam giác máy tự tìm trong hình (không thiếu, không thừa)
    if (q.groups) {
      const key = t => t.slice().sort().join('-');
      const auto = geo.trianglesOf(q.fig).map(key).sort(), listed = q.groups.flatMap(g => g.tris).map(key).sort();
      ok(auto.join() === listed.join(), `${where}: tam giác trong lời giải khác hình vẽ (máy đếm ${auto.length}, lời giải ${listed.length})`);
      ok(new Set(listed).size === listed.length, `${where}: một tam giác bị đếm 2 lần`);
    }
    if (q.cubes) checkCubes(q, where);
  });
});
console.log(`   ${bookN} câu`);

// Khối lập phương: vẽ lại như trên trang (mặt trước, trên, phải; vẽ từ sau ra trước) rồi xem mỗi khối còn lộ ra bao nhiêu.
// Khối thường phải nhìn thấy được; câu "có ít nhất bao nhiêu khối" thì mọi khối đều phải nhìn thấy.
function checkCubes(q, where) {
  const s = 40, dx = 15, dy = 14, P = (c, d, z) => [c * s + d * dx, -z * s - d * dy];
  const all = q.cubes.concat(q.hidden), key = c => c.join();
  ok(new Set(all.map(key)).size === all.length, `${where}: có 2 khối trùng chỗ`);
  const order = all.slice().sort((a, b) => b[1] - a[1] || a[2] - b[2] || a[0] - b[0]);
  const faces = [];
  order.forEach(cb => {
    const [x, y] = P(...cb);
    faces.push({ cb, ps: [[x, y], [x + s, y], [x + s, y - s], [x, y - s]] });
    faces.push({ cb, ps: [[x, y - s], [x + s, y - s], [x + s + dx, y - s - dy], [x + dx, y - s - dy]] });
    faces.push({ cb, ps: [[x + s, y], [x + s + dx, y - dy], [x + s + dx, y - s - dy], [x + s, y - s]] });
  });
  const inside = (px, py, ps) => {
    let inn = false;
    for (let i = 0, j = ps.length - 1; i < ps.length; j = i++) {
      const [xi, yi] = ps[i], [xj, yj] = ps[j];
      if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inn = !inn;
    }
    return inn;
  };
  const seen = new Map();
  const xs = faces.flatMap(f => f.ps.map(p => p[0])), ys = faces.flatMap(f => f.ps.map(p => p[1]));
  for (let px = Math.min(...xs) + 0.5; px < Math.max(...xs); px += 1) {
    for (let py = Math.min(...ys) + 0.5; py < Math.max(...ys); py += 1) {
      let top = null;
      faces.forEach(f => { if (inside(px, py, f.ps)) top = f.cb; });
      if (top) seen.set(key(top), (seen.get(key(top)) || 0) + 1);
    }
  }
  const mustSee = q.least ? all : q.cubes;
  mustSee.forEach(cb => ok((seen.get(key(cb)) || 0) >= 40, `${where}: khối ${key(cb)} bị che gần hết, bé không thấy được`));
  // Khối nằm trên cao phải có khối đỡ bên dưới (trừ câu "ít nhất", hình có thể dán khối)
  if (!q.least) all.forEach(cb => { if (cb[2] > 0) ok(all.some(o => o[0] === cb[0] && o[1] === cb[1] && o[2] === cb[2] - 1), `${where}: khối ${key(cb)} không có khối đỡ`); });
}

console.log(fails ? `\n❌ ${fails}/${checks} kiểm tra bị lỗi` : `\n✅ Tất cả ${checks} kiểm tra đều đúng`);
process.exit(fails ? 1 : 0);
