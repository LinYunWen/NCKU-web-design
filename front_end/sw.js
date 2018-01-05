const cacheFile = [
  '',
  'index.html',
  'css/bootstrap.min.css',
  'font-awesome/css/font-awesome.min.css',
  'css/animate.css',
  'css/style.css',
  'css/color.css',
  'css/showcase.css',
  'js/jquery.min.js',
  'js/jquery.easing.min.js',
  'js/jquery.scrollTo.js',
  'js/wow.min.js',
  'js/custom.js',
  'img/bg2.jpg'
]

const cacheKey = 'v2.0.2'

// install
self.addEventListener('install', event => {
  console.log("now install")

  event.waitUntil(
    caches.open(cacheKey)
    .then(cache => cache.addAll(cacheFile))
    // .then(() => self.skipWaiting())
  )
})

// activate
self.addEventListener('activate', event => {
  console.log(`activate ${cacheKey}, now ready to handle fetches`)
  event.waitUntil(
    caches.keys().then(cacheNames => {
      const promiseArr = cacheNames.map(item => {
        if (item !== cacheKey) {
          return caches.delete(item)
        }
      })
      return Promise.all(promiseArr)
    })
  )
})

// fetch
self.addEventListener('fetch', event => {
  console.log(`${event.request.method}: ${event.request.url}`)
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response
      }
      return fetch(event.request)
    })
  )
})

self.addEventListener('notificationclose', function(event) {
  var notification = event.notification;
  var primaryKey = notification.data.primaryKey;

  console.log('Closed notification: ' + primaryKey);
});

self.addEventListener('notificationclick', function(event) {
  var notification = event.notification;
  var primaryKey = notification.data.primaryKey;
  var action = event.action;

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow('http://www.google.com');
    notification.close();
  }
});