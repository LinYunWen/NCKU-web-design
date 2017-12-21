if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
    .then(reg => {
        console.log('SW registered ', reg)
        subscribe_user(reg);
    })
    .catch(err => {
        console.log('SW Error ', err)
    })
}

const applicationServerPublicKey = 'BIZ_0tzQX2C3laZo5Q3yymPgmjzwTW0_wSb1FIkbEgMYlBJYVTshzhcEvQLsDVlHGuwq8QEpqN87pEM57EjVbcQ'

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function subscribe_user(swRegistration) {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
    .then(subscription => {
        console.log('User is subscribed');
        $.ajax({
            method: "POST",
            url: "/store_subscription",
            data: {
                subscription: JSON.stringify(subscription),
            },
            success: function(){console.log(JSON.stringify(subscription));},
            error: function(){console.log('Failed to post subscription');}
        });
    })
    .catch(err => {
        console.log('Failed to subscribe the user: ', err);
    });
}

