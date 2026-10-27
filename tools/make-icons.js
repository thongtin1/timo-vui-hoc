/* Vẽ icon ứng dụng (ngôi sao vàng trên nền tím) ra file PNG, không cần thư viện ngoài.
   Chạy: node tools/make-icons.js  → tạo icons/icon-192.png, icon-512.png, apple-touch-icon.png */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PURPLE = [112, 72, 232], GOLD = [252, 196, 25], WHITE = [255, 255, 255];

// Ngôi sao 5 cánh, tâm (0,0), bán kính ngoài 1
const STAR = Array.from({ length: 10 }, (_, i) => {
  const r = i % 2 ? 0.45 : 1, a = -Math.PI / 2 + (i * Math.PI) / 5;
  return [r * Math.cos(a), r * Math.sin(a)];
});
function inPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
// Màu tại điểm (u, v) trong khoảng 0..1. full = nền phủ kín (icon iPhone tự bo góc)
function color(u, v, full) {
  const x = (u - 0.5) / 0.34, y = (v - 0.53) / 0.34;
  if (inPoly(x, y, STAR)) return GOLD;
  const sx = (u - 0.5) / 0.37, sy = (v - 0.53) / 0.37; // viền trắng quanh sao
  if (inPoly(sx, sy, STAR)) return WHITE;
  if (full) return PURPLE;
  const d = Math.hypot(u - 0.5, v - 0.5);
  return d <= 0.5 ? PURPLE : null;
}

function png(size, full) {
  const S = 4; // khử răng cưa: lấy mẫu 4×4 điểm mỗi pixel
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
        const c = color((x + (i + 0.5) / S) / size, (y + (j + 0.5) / S) / size, full);
        if (c) { r += c[0]; g += c[1]; b += c[2]; a++; }
      }
      const o = y * (size * 4 + 1) + 1 + x * 4;
      raw[o] = a ? r / a : 0; raw[o + 1] = a ? g / a : 0; raw[o + 2] = a ? b / a : 0; raw[o + 3] = (a / (S * S)) * 255;
    }
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8 bit, RGBA
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0)),
  ]);
}

const out = path.join(__dirname, '../icons');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'icon-192.png'), png(192, true));
fs.writeFileSync(path.join(out, 'icon-512.png'), png(512, true));
fs.writeFileSync(path.join(out, 'apple-touch-icon.png'), png(180, true));
console.log('Đã tạo icon trong thư mục icons/');
