/*
 *
 *  LPA
 *  Author: Ido Green
 *  Date: March 2016
 */

// Until all the browsers will give us the APIs to cache.
importScripts('/cache-polyfill.js');

var cacheName = "LPA-v3";

//
// Install our web app and its assets
//
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log("LPA is caching it's files under: " + cacheName);
      return cache.addAll([
        '/',
        '/index.html',
        '/index.html?homescreen=1',
        '/?homescreen=1',
        'css/bootstrap-theme.min.css',
        'css/bootstrap.min.css',
        'js/vendor/modernizr-2.8.3-respond-1.4.2.min.js',
        'js/vendor/jquery-1.11.2.min.js',
        'js/vendor/bootstrap.min.js'
      ]).then(function() {
        return self.skipWaiting();
      });
    })
  );
});


//
self.addEventListener('activate', function(e) {
  console.log('[LPA SW] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.log('[LPA SW] Removing old cache', key);
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

//
self.addEventListener('fetch', function(event) {
  console.log("SW got: " + event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});