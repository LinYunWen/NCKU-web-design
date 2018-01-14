const cacheFile = [
    'index.html',
    'report.html',
    'login.html',
    'about.html',
    'search.html',
    'font-awesome/css/font-awesome.min.css',
    'css/animate.css',
    'css/bootstrap.min.css',
    'css/camera.css',
    'css/index.css',
    'css/login.css',
    'css/post-illegal-parking.css',
    'css/style.css',
    'css/color.css',
    'js/jquery.min.js',
    'js/jquery.easing.min.js',
    'js/jquery.scrollTo.js',
    'js/wow.min.js',
    'js/about.js',
    'js/location.js',
    'js/publish.js',
    'js/report.js',
    'js/upload-imgur.js',
    'js/custom.js',
    'js/camera.js',
    'js/index.js',
    'js/login.js',
    'js/post-illegal-parking.js',
    'img/bg2.jpg'
]

const cacheKey = 'v2.1.0';

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
    // console.log(`${event.request.method}: ${event.request.url}`)
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response
            }
            return fetch(event.request)
        })
    )
})

/*
self.addEventListener('notificationclose', function(event) {
    var notification = event.notification;
    var primaryKey = notification.data.primaryKey;

    console.log('Closed notification: ' + primaryKey);
});
*/

/****拖吊地點****/
var longitude;
var latitude;

self.addEventListener('notificationclick', function(event) {
    //var primaryKey = notification.data.primaryKey;
    var action = event.action;
    var location_url = 'http://maps.google.com/?q='+latitude+', '+longitude;

    clients.openWindow(location_url);
    event.notification.close();

    /*if (action === 'close') {
        event.notification.close();
    } else if(action === 'explore') {
        clients.openWindow('http://www.google.com');
        event.notification.close();
    }*/
});

self.addEventListener('push', event => {
    console.log('[Service Worker] Push Received.');

    if (event.data) {
        push_content = event.data.json();
        longitude = push_content.longitude;
        latitude = push_content.latitude;
        console.log(longitude+'\n'+latitude);

        var title = '有拖吊唷!';
        var options = {
            body: '點擊查看地點',
            icon: 'img/icons/logo_144.png',
            //vibrate: [100, 50, 100],
            //data: {
            //    dateOfArrival: Date.now(),
            //    primaryKey: 1
            //}
            //actions: [
            //    {
            //        action: 'explore', title: 'Explore this new world',
            //        icon: 'img/icons/scan.png'
            //    }
            //]
            //    {action: 'close', title: 'Close notification',
            //      icon: 'img/icons/search2.png'},
            //]
        };
    }
    event.waitUntil(self.registration.showNotification(title, options));
});


