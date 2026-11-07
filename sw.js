// Сначала сеть (чтобы после обновления на GitHub Pages игроки получали свежие файлы), при отсутствии сети берём кэш.
const C="eq-v2",F=["./","index.html","css/style.css","js/app.js","js/store.js","js/speech.js","js/review.js","content/chapters.json","icon.svg","manifest.webmanifest"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(F)))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});
