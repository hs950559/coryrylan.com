'use strict';

var VERSION = 'v1.0.6';
const DEBUG = false;

console.log('WORKER: Version ' + VERSION);

self.addEventListener('install', event => {
    log('WORKER: install event in progress.');
    loadCache(event);
});

self.addEventListener('fetch', event => {
    log('WORKER: fetch event in progress.');
    handleRequest(event);
});

self.addEventListener('activate', event => {
    log('WORKER: activate event in progress.');
    clearCache(event);
});


function handleRequest(event) {
    if ((event.request.method !== 'GET') || (isHostDomainRequest(event.request.url) && event.request.method !== 'GET')) {
        log('WORKER: fetch event (GET) ignored.', event.request.method, event.request.url);
        return;
    }

    event.respondWith(caches.match(event.request).then(cached => {
        log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
        return cached || fetch(event.request).then(response => { storeInCache(response, event) }, unableToResolveRequest).catch(unableToResolveRequest);
    }));
}

function loadCache(event) {    
  event.waitUntil(caches.open(VERSION).then(cache => {
        return cache.addAll([
          '/assets/images/cory-rylan.jpg'
        ]);
      }).then(() => {
        log('WORKER: install completed');
      })
  );
}

function clearCache(event) {
      event.waitUntil(caches.keys().then(keys => {
        return Promise.all(
          keys.filter(key => {
              return !key.startsWith(VERSION);
            })
            .map(key => {
              return caches.delete(key);
            })
        );
      }).then(() => {
        log('WORKER: activate completed.');
      })
  );
}

function storeInCache(response, event) {
    let cacheCopy = response.clone();
    log('WORKER: fetch response from network.', event.request.url);

    caches.open(VERSION + 'pages').then(function add(cache) {
        cache.put(event.request, cacheCopy);
    }).then(() => {
        log('WORKER: fetch response stored in cache.', event.request.url);
    });

    return response;
}

function unableToResolveRequest() {
    log('WORKER: fetch request failed in both cache and network.');

    return new Response('<h1>Service Unavailable</h1>', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
            'Content-Type': 'text/html'
        })
    });
}

function isHostDomainRequest(url) {
    if ((url.indexOf('coryrylan') > -1) || (url.indexOf('localhost') > -1)) {
        return true;
    } else {
        return false;
    }
}

function log(msg, url) {
    if (DEBUG) {
        console.log(msg, url);
    }
}