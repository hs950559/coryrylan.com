var VERSION = 'v1.0.0';

console.log('WORKER: Version ' + VERSION);

self.addEventListener('install', event => {
  console.log('WORKER: install event in progress.');
  
  event.waitUntil(caches.open(VERSION).then(cache => {
        return cache.addAll([
          '/'
        ]);
      }).then(() => {
        console.log('WORKER: install completed');
      })
  );
});

self.addEventListener('fetch', event => {
  console.log('WORKER: fetch event in progress.');

  if (event.request.method !== 'GET') {
    console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
    return;
  }

  event.respondWith(caches.match(event.request).then(cached => {
        let networked = fetch(event.request).then(fetchedFromNetwork, unableToResolve).catch(unableToResolve);
        console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
        
        return cached || networked;

        function fetchedFromNetwork(response) {
          let cacheCopy = response.clone();
          console.log('WORKER: fetch response from network.', event.request.url);

          caches.open(VERSION + 'pages').then(function add(cache) {
              cache.put(event.request, cacheCopy);
            }).then(() => {
              console.log('WORKER: fetch response stored in cache.', event.request.url);
            });

          return response;
        }

        function unableToResolve () {
          console.log('WORKER: fetch request failed in both cache and network.');

          return new Response('<h1>Service Unavailable</h1>', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
        }
      })
  );
});

self.addEventListener('activate', event => {
  console.log('WORKER: activate event in progress.');

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
        console.log('WORKER: activate completed.');
      })
  );
});