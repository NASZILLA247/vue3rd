var cacheName = 'school_activities'
var cacheFiles = [
    'index.html',
    'js/main.js',
    'css/style.css',
    'images/icon.png',
    'images/icon_1.png',
    'images/empty-box.png'
]

self.addEventListener('install', (e)=>{
    console.log('[Service-worker] Install')
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service-worker] Caching all the files')
            return cache.addAll(cacheFiles)
        })
    )
})

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (r) {
            // Download the file if it is not in the cache,
            return r || fetch(e.request).then(function (response) {
                // add the new file to cache
                return caches.open(cacheName).then(function (cache) {
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});