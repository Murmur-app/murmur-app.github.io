importScripts('cache-polyfill.js');

var dataCacheName = 'murmurData-v1';
var cacheName = 'murmurPWA-final-1';
var filesToCache = [
  './',
  './assets/images/audio-icons/Birds.svg',
  './assets/images/audio-icons/Dryer.svg',
  './assets/images/audio-icons/Fire.svg',
  './assets/images/audio-icons/Forest_waterfall.svg',
  './assets/images/audio-icons/Humans.svg',
  './assets/images/audio-icons/Ocean.svg',
  './assets/images/audio-icons/Rain.svg',
  './assets/images/audio-icons/Storm.svg',
  './assets/images/audio-icons/Stream.svg',
  './assets/images/audio-icons/Thunder.svg',
  './assets/images/audio-icons/Underwater.svg',
  './assets/images/audio-icons/Waves.svg',
  './assets/images/audio-icons/Beach.svg',
  './assets/images/cancel-button.svg',
  './assets/images/delete-button.svg',
  './assets/images/feedback-icon.svg',
  './assets/images/info-icon.svg',
  './assets/images/menu-button.svg',
  './assets/images/murmur-logo.png',
  './assets/images/music-icon.svg',
  './assets/images/pause-button.svg',
  './assets/images/play-button.svg',
  './assets/images/right-arrow-button.svg',
  './assets/images/save-button.svg',
  './assets/images/shuffle-button.svg',
  './favicon.ico',
  './index.html',
  './manifest.json',
  './robots.txt',
  './scripts/main.js',
  './scripts/vendor.js',
  './static/audioDetails.json',
  './styles/main.css',
  './apple-touch-icon.png',
  './assets/audio/Birds.mp3',
  './assets/audio/Dryer.mp3',
  './assets/audio/Fire.mp3',
  './assets/audio/Forest_waterfall.mp3',
  './assets/audio/Humans.mp3',
  './assets/audio/Ocean.mp3',
  './assets/audio/Rain.mp3',
  './assets/audio/Storm.mp3',
  './assets/audio/Stream.mp3',
  './assets/audio/Thunder.mp3',
  './assets/audio/Underwater.mp3',
  './assets/audio/Waves.mp3',
  './assets/audio/Beach.mp3',
  './assets/fonts/OpenSans-Regular.ttf',
  './assets/fonts/OpenSans-Semibold.ttf',
  './assets/fonts/roboto-regular.ttf',
  './assets/icons/icon-128x128.png',
  './assets/icons/icon-144x144.png',
  './assets/icons/icon-152x152.png',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-256x256.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
