/* Lưu trang vào máy để mở được khi không có mạng.
   Có mạng: luôn lấy bản mới nhất rồi lưu lại. Mất mạng: dùng bản đã lưu.
   Thêm file mới thì nhớ thêm vào danh sách FILES. */
const CACHE = 'timo-vui-hoc-v2';
const FILES = [
  './', 'index.html', 'chu-de.html', 'bai-thu-ngay.html', 'bai-tuoi.html', 'album.html', 'doi-qua.html',
  'css/style.css', 'manifest.json', 'icons/icon-192.png',
  'js/data.js', 'js/common.js', 'js/visuals.js', 'js/chu-de.js', 'js/thu-ngay.js', 'js/tuoi.js', 'js/album.js', 'js/doi-qua.js',
  'js/topics/chu-cai.js', 'js/topics/ma-ma.js', 'js/topics/quy-luat-hinh.js', 'js/topics/quy-luat-nhom.js', 'js/topics/xep-hang.js', 'js/topics/xem-gio.js', 'js/topics/tinh-nhanh.js', 'js/topics/tim-so.js', 'js/topics/dien-dau.js', 'js/topics/day-so.js', 'js/topics/chan-le.js', 'js/topics/so-sanh.js', 'js/topics/cau-tao.js', 'js/topics/goi-hop.js', 'js/topics/doan-thang.js', 'js/topics/hinh-vuong.js', 'js/topics/canh-goc.js', 'js/topics/lap-phuong.js', 'js/topics/doi-xu.js', 'js/topics/lap-so.js', 'js/topics/cai-can.js', 'js/topics/dem-so.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request)
    .then(res => {
      if (res.ok || res.type === 'opaque') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    })
    // chu-de.html?id=… dùng chung một file, nên bỏ qua phần ?id khi tìm bản đã lưu
    .catch(() => caches.match(e.request).then(hit => hit || caches.match(e.request, { ignoreSearch: true }))));
});
