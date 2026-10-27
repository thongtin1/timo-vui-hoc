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
const TYPES = ['num', 'letter', 'oddeven', 'choice', 'word', 'signs'];

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

console.log(fails ? `\n❌ ${fails}/${checks} kiểm tra bị lỗi` : `\n✅ Tất cả ${checks} kiểm tra đều đúng`);
process.exit(fails ? 1 : 0);
