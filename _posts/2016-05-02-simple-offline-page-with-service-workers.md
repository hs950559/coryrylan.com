---
layout: post
title: Simple Offline Page with Service Workers
description: Learn how to add a simple offline reading view to your website using Service Workers.
keywords: Cory Rylan, Offline, Jekyll, Service Workers
tags: ServiceWorkers, JavaScript, Offline
date: 2016-05-02
permalink: /blog/simple-offline-page-with-service-workers
demo:
---

This post we are going to cover how to create a minimal offline reading page
as an intro to Service Workers. Our offline feature will allow a user to read the 
latest couple of posts on our blog example even when they are offline with no available
network.

So first what are Service Workers and how do they help us make offline web apps and sites?
Well service workers are a new feature that allows us to have fine grain control of our
websites and apps even when they are offline. A service worker is basically a JavaScript 
file that runs outside of the standard browser window context. With a registered service 
worker script we can have fine grain control over things such as the browser cache and 
the network requests.

With this new control we can intercept browser requests and alter the browser cache
for when we are offline. For this example we will cache an offline article and serve
cached article when the browser is offline instead of the standard browser offline error.

So first in our `index.html` or root view we will add the following script 
to the bottom of our page.

<pre class="language-javascript">
<code>
{% raw %}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('/service-worker.js')
           .then(function () { console.log('Service Worker Registered'); });
}
{% endraw %}
</code>
</pre>

This script will check if the browser supports service workers and if so register the service worker.
This is a great behavior as our site will work just fine if the browser doesnt support 
service workers. Next lets take a look at our `service-worker.js` file. We wont dig deep into the details 
as the service worker spec is a lower level API that is quite robust.

<pre class="language-javascript">
<code>
{% raw %}
---

---

// Original Source: https://googlechrome.github.io/samples/service-worker/custom-offline-page/
// go here to delete a registered service worker, handy for debugging 
// => chrome://inspect/#service-workers

'use strict';

// Incrementing CACHE_VERSION will start the install event and
// force previously cached resources to be cached again.
const CACHE_VERSION = '{{ site.time }}';
let CURRENT_CACHES = {
  offline: 'offline-v' + CACHE_VERSION
};

const OFFLINE_URL = 'offline.html';

function createCacheBustedRequest(url) {
  let request = new Request(url, {cache: 'reload'});
  // See https://fetch.spec.whatwg.org/#concept-request-mode
  // This is not yet supported in Chrome as of M48, so we need to explicitly check to see if the cache: 'reload' option had any effect.
  if ('cache' in request) {
    return request;
  }

  // If {cache: 'reload'} didn't have any effect, append a cache-busting URL parameter instead.
  let bustedUrl = new URL(url, self.location.href);
  bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();
  return new Request(bustedUrl);
}

self.addEventListener('install', event => {
  event.waitUntil(
    fetch(createCacheBustedRequest(OFFLINE_URL)).then(function(response) {
      return caches.open(CURRENT_CACHES.offline).then(function(cache) {
        return cache.put(OFFLINE_URL, response);
      });
    })
  );
});

self.addEventListener('activate', event => {
  // Delete all caches that aren't named in CURRENT_CACHES.
  let expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' ||
      (event.request.method === 'GET' &&
       event.request.headers.get('accept').includes('text/html'))) {
    console.log('Handling fetch event for', event.request.url);
    event.respondWith(
      fetch(createCacheBustedRequest(event.request.url)).catch(error => {
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
{% endraw %}
</code>
</pre>

The first important part of this file is the triple dash block at the top `---`. This tells Jekyll
to treat the JavaScript file as a Jekyll liquid template. We do this to insert a version number into our 
service worker like so:

<pre class="language-javascript">
<code>
{% raw %}
// Incrementing CACHE_VERSION will kick off the install event and
// force previously cached resources to be cached again.

const CACHE_VERSION = '{{ site.time }}';
let CURRENT_CACHES = {
  offline: 'offline-v' + CACHE_VERSION
};
{% endraw %}
</code>
</pre>

Our service worker file creates an offline file cache to store our offline page `offline.html`. The first event
is the `install`. This runs the first time when the browser detects a new service worker version. After the install
occurs the `activate` runs. The activate event runs and checks for old caches or no longer used caches. This is important
as we want to clean the cache so it does not bloat over time.
 
The last event `fetch` runs on any network request passing through 
the browser. This allows us to intercept the request and handle it as needed. So in our example if the request fails
we hand back the `offline.html` file we stored in the cache. Next we will look at our `offline.html` file. In this
example we are using [Jekyll](https://jekyllrb.com/) but the same principle could be used for any backend stack.

<pre class="language-html">
<code>
{% raw %}
---

---

&lt;!DOCTYPE HTML&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;meta charset=&quot;utf-8&quot;&gt;
  &lt;title&gt;Offline Reading&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;main&gt;        
    &lt;button onclick=&quot;document.location.reload(true);&quot; class=&quot;btn&quot;&gt;Retry Connection&lt;/button&gt;
            
    {% for post in site.posts limit:2 %}
      &lt;h2&gt;{{ post.title }}&lt;/h2&gt;    
        &lt;small&gt;{{ post.date | date: &quot;%b %-d, %Y&quot; }}&lt;/small&gt;&lt;br/&gt;

        {{ post.content }}
            
        &lt;br /&gt;&lt;hr /&gt;&lt;br /&gt;
    {% endfor %}
  &lt;/main&gt;
&lt;/body&gt;
&lt;/html&gt;
{% endraw %}
</code>
</pre>

In our offline page we add a refresh button to prompt the user reconnect to the site. We then list the latest two 
posts on our blog using the `limit:2`. Now when our user is offline we can give a simple page with usable content
for the user. Go ahead and try it out. Disable the network in the dev tools or turn your phone on airplane mode
and this site will give you offline content!

There are many advanced caching and offline techniques far more advanced than this but this alone
can add a lot of value to your site with minimal effort. I encourage everyone to read through Jake Archibald's post the
[Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook/) at least twice. 