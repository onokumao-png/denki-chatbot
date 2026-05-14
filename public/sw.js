// 最小限の Service Worker（ホーム画面追加を可能にする）

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

// ネットワーク優先でフェッチ（APIレスポンスはキャッシュしない）
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
